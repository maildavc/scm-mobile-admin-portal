import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACCESS_COOKIE = "accessToken";
const DEFAULT_STORAGE_HOSTS = ["10.114.0.3", "api.phroneiq.com"];

function getAllowedHosts() {
  const extra = (process.env.DOCUMENT_STORAGE_HOSTS || "")
    .split(",")
    .map((host) => host.trim().toLowerCase())
    .filter(Boolean);
  return new Set([...DEFAULT_STORAGE_HOSTS, ...extra]);
}

function isAllowedStorageUrl(raw: string) {
  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    return false;
  }

  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;

  const host = parsed.hostname.toLowerCase();
  if (host.endsWith(".phroneiq.com") || host === "phroneiq.com") return true;
  return getAllowedHosts().has(host);
}

function guessContentType(url: string, fallback?: string | null) {
  if (fallback && fallback !== "application/octet-stream") return fallback;
  const path = url.split("?")[0].toLowerCase();
  if (path.endsWith(".png")) return "image/png";
  if (path.endsWith(".jpg") || path.endsWith(".jpeg")) return "image/jpeg";
  if (path.endsWith(".gif")) return "image/gif";
  if (path.endsWith(".webp")) return "image/webp";
  if (path.endsWith(".pdf")) return "application/pdf";
  if (path.endsWith(".svg")) return "image/svg+xml";
  return fallback || "application/octet-stream";
}

export async function GET(request: NextRequest) {
  if (!request.cookies.get(ACCESS_COOKIE)?.value) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const fileUrl = request.nextUrl.searchParams.get("url");
  if (!fileUrl || !isAllowedStorageUrl(fileUrl)) {
    return NextResponse.json({ message: "Invalid document URL" }, { status: 400 });
  }

  try {
    const upstream = await fetch(fileUrl, {
      cache: "no-store",
      redirect: "manual",
      headers: { Accept: "image/*,application/pdf,*/*" },
    });

    if (!upstream.ok || !upstream.body) {
      return NextResponse.json(
        {
          message:
            "Document storage is on a private network and cannot be reached from this app.",
        },
        { status: upstream.status >= 400 ? upstream.status : 502 },
      );
    }

    const contentType = guessContentType(fileUrl, upstream.headers.get("content-type"));
    return new NextResponse(upstream.body, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": "inline",
        "Cache-Control": "private, no-store",
      },
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "Document storage is on a private network and cannot be reached from this app.",
      },
      { status: 502 },
    );
  }
}
