import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://10.114.0.3:5000";

/* ------------------------------------------------------------------ */
/*  fetch-based proxy – undici auto-decompresses br/gzip/deflate       */
/* ------------------------------------------------------------------ */

interface ProxyResult {
  status: number;
  contentType: string;
  body: string;
}

async function proxyFetch(
  targetUrl: string,
  method: string,
  headers: Record<string, string>,
  body?: string,
): Promise<ProxyResult> {
  console.log("[PROXY] >>> Requesting:", method, targetUrl);
  console.log("[PROXY] >>> Request headers:", JSON.stringify(headers));
  if (body) console.log("[PROXY] >>> Request body:", body);

  const res = await fetch(targetUrl, {
    method,
    headers,
    body: body || undefined,
    // @ts-expect-error — Next.js extends RequestInit with this option
    cache: "no-store",
  });

  // Log ALL response headers
  console.log("[PROXY] <<< Status:", res.status, res.statusText);
  console.log("[PROXY] <<< All response headers:");
  res.headers.forEach((value, key) => {
    console.log(`  ${key}: ${value}`);
  });

  // Try arrayBuffer first to see raw bytes
  const buffer = await res.arrayBuffer();
  console.log("[PROXY] <<< ArrayBuffer byteLength:", buffer.byteLength);

  // Convert to string
  const uint8 = new Uint8Array(buffer);
  console.log("[PROXY] <<< First 100 bytes (raw):", Array.from(uint8.slice(0, 100)));
  const text = new TextDecoder().decode(buffer);
  console.log("[PROXY] <<< Text length:", text.length);
  console.log("[PROXY] <<< Full body:", text);

  return {
    status: res.status,
    contentType: res.headers.get("content-type") || "application/octet-stream",
    body: text,
  };
}

/* ------------------------------------------------------------------ */
/*  Shared helpers                                                     */
/* ------------------------------------------------------------------ */

function buildHeaders(
  request: NextRequest,
  includeContentType = false,
): Record<string, string> {
  const headers: Record<string, string> = {
    // Match the headers that Postman sends (which work against this backend)
    "User-Agent": "SCM-Admin-Proxy/1.0",
    "Accept": "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "Connection": "keep-alive",
  };

  if (includeContentType) {
    headers["Content-Type"] = "application/json";
  }

  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const correlationId = request.headers.get("X-Correlation-ID");
  if (correlationId) headers["X-Correlation-ID"] = correlationId;

  return headers;
}

function toNextResponse(result: ProxyResult): NextResponse {
  return new NextResponse(result.body, {
    status: result.status,
    headers: { "Content-Type": result.contentType },
  });
}

/* ------------------------------------------------------------------ */
/*  Route handlers                                                     */
/* ------------------------------------------------------------------ */

// ─── POST ────────────────────────────────────────────────────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;
  const body = await request.text();

  try {
    const result = await proxyFetch(
      targetUrl,
      "POST",
      buildHeaders(request, true),
      body,
    );
    return toNextResponse(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

// ─── GET ─────────────────────────────────────────────────────────────────────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const search = request.nextUrl.search;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}${search}`;

  try {
    const result = await proxyFetch(
      targetUrl,
      "GET",
      buildHeaders(request),
    );
    return toNextResponse(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

// ─── PUT ─────────────────────────────────────────────────────────────────────
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;
  const body = await request.text();

  try {
    const result = await proxyFetch(
      targetUrl,
      "PUT",
      buildHeaders(request, true),
      body,
    );
    return toNextResponse(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

  try {
    const result = await proxyFetch(
      targetUrl,
      "DELETE",
      buildHeaders(request),
    );
    return toNextResponse(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

// ─── PATCH ───────────────────────────────────────────────────────────────────
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;
  const body = await request.text();

  try {
    const result = await proxyFetch(
      targetUrl,
      "PATCH",
      buildHeaders(request, true),
      body,
    );
    return toNextResponse(result);
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}
