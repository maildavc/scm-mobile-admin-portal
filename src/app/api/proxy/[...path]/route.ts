import { NextRequest, NextResponse } from "next/server";
import {
  createCorrelationId,
  decodeBackendBody,
  decodeBackendFile,
  encodeJsonRequest,
  findAuthTokens,
  getApiBaseUrl,
  removeAuthTokens,
} from "@/lib/server/apiTransport";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = { params: Promise<{ path: string[] }> };
type ProxyBody = string | FormData | undefined;

interface ForwardRequest {
  method: string;
  url: string;
  headers: Record<string, string>;
  body?: ProxyBody;
}

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";
const REFRESH_PATH = process.env.AUTH_REFRESH_PATH || "/api/v1/auth/refresh";

function isProduction() {
  return process.env.NODE_ENV === "production";
}

function normalizeOrigin(origin: string) {
  return origin.trim().replace(/\/+$/, "");
}

function getConfiguredOrigins() {
  return (process.env.APP_ORIGIN || process.env.ALLOWED_ORIGINS || "")
    .split(",")
    .map(normalizeOrigin)
    .filter(Boolean);
}

/** Public site origin behind reverse proxies (nginx, load balancers). */
function getPublicOrigin(request: NextRequest) {
  const forwardedHost = request.headers.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || request.headers.get("host");
  if (!host) return normalizeOrigin(request.nextUrl.origin);

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const proto = forwardedProto || (isProduction() ? "https" : request.nextUrl.protocol.replace(":", ""));
  return normalizeOrigin(`${proto}://${host}`);
}

function isAllowedOrigin(request: NextRequest, origin: string) {
  const normalizedOrigin = normalizeOrigin(origin);
  const configured = getConfiguredOrigins();
  if (configured.length > 0) {
    return configured.includes(normalizedOrigin);
  }

  return (
    normalizedOrigin === getPublicOrigin(request) ||
    normalizedOrigin === normalizeOrigin(request.nextUrl.origin)
  );
}

function setAuthCookies(response: NextResponse, accessToken: string, refreshToken?: string) {
  response.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: 24 * 60 * 60,
  });
  if (refreshToken) {
    response.cookies.set(REFRESH_COOKIE, refreshToken, {
      httpOnly: true,
      secure: isProduction(),
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });
  }
}

function clearAuthCookies(response: NextResponse) {
  response.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  response.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}

function buildTargetUrl(request: NextRequest, path: string[]) {
  const target = new URL(`${getApiBaseUrl()}/${path.join("/")}`);
  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.append(key.charAt(0).toUpperCase() + key.slice(1), value);
  });
  return target.toString();
}

function buildHeaders(
  request: NextRequest,
  accessToken?: string,
  contentType?: string,
): Record<string, string> {
  const headers: Record<string, string> = {
    Accept: "*/*",
    "Accept-Encoding": "gzip, deflate, br",
    "User-Agent": "SCM-Admin-Proxy/2.0",
    "X-Correlation-ID": createCorrelationId(request.headers.get("X-Correlation-ID")),
  };

  if (accessToken) headers.Authorization = `Bearer ${accessToken}`;
  if (contentType) headers["Content-Type"] = contentType;
  return headers;
}

async function prepareBody(
  request: NextRequest,
): Promise<{ body: ProxyBody; contentType?: string }> {
  if (["GET", "HEAD"].includes(request.method)) return { body: undefined };

  const incomingType = request.headers.get("content-type") || "";
  if (incomingType.includes("multipart/form-data")) {
    return { body: await request.formData() };
  }

  const text = await request.text();
  if (!text) return { body: undefined };

  try {
    return {
      body: encodeJsonRequest(JSON.parse(text)),
      contentType: "application/json",
    };
  } catch {
    return {
      body: encodeJsonRequest(text),
      contentType: "application/json",
    };
  }
}

async function forward({ method, url, headers, body }: ForwardRequest) {
  return fetch(url, {
    method,
    headers,
    body,
    cache: "no-store",
    redirect: "manual",
  });
}

async function refreshAccessToken(
  request: NextRequest,
): Promise<{ accessToken: string; refreshToken?: string } | null> {
  const refreshToken = request.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;

  try {
    const response = await fetch(`${getApiBaseUrl()}${REFRESH_PATH}`, {
      method: "POST",
      headers: buildHeaders(request, undefined, "application/json"),
      body: encodeJsonRequest({ refreshToken }),
      cache: "no-store",
    });
    if (!response.ok) return null;

    const decoded = decodeBackendBody(await response.text());
    return findAuthTokens(decoded.data);
  } catch {
    return null;
  }
}

function createClientResponse(
  decoded: ReturnType<typeof decodeBackendBody>,
  status: number,
  backendContentType: string | null,
) {
  if (decoded.isJson) {
    return NextResponse.json(decoded.data, { status });
  }
  return new NextResponse(String(decoded.data), {
    status,
    headers: {
      "Content-Type": backendContentType || "text/plain; charset=utf-8",
    },
  });
}

async function handle(request: NextRequest, context: RouteContext) {
  const { path } = await context.params;
  const normalizedPath = path.join("/");
  const isLogin = normalizedPath === "api/v1/auth/login";
  const isLogout = normalizedPath === "api/v1/auth/logout";
  const isValidPath =
    normalizedPath.startsWith("api/v1/") &&
    path.every(
      (segment) => segment !== "." && segment !== ".." && /^[a-zA-Z0-9._:-]+$/.test(segment),
    );
  if (!isValidPath) {
    return NextResponse.json({ message: "Invalid API path." }, { status: 400 });
  }

  const origin = request.headers.get("origin");
  if (
    !["GET", "HEAD", "OPTIONS"].includes(request.method) &&
    origin &&
    !isAllowedOrigin(request, origin)
  ) {
    return NextResponse.json(
      { message: "Cross-origin API requests are not allowed." },
      { status: 403 },
    );
  }

  try {
    const { body, contentType } = await prepareBody(request);
    const targetUrl = buildTargetUrl(request, path);
    let accessToken = request.cookies.get(ACCESS_COOKIE)?.value;
    let backendResponse = await forward({
      method: request.method,
      url: targetUrl,
      headers: buildHeaders(request, accessToken, contentType),
      body,
    });

    let refreshedTokens: Awaited<ReturnType<typeof refreshAccessToken>> = null;
    if (
      backendResponse.status === 401 &&
      !isLogin &&
      !isLogout &&
      normalizedPath !== REFRESH_PATH.replace(/^\/+/, "")
    ) {
      refreshedTokens = await refreshAccessToken(request);
      if (refreshedTokens) {
        accessToken = refreshedTokens.accessToken;
        backendResponse = await forward({
          method: request.method,
          url: targetUrl,
          headers: buildHeaders(request, accessToken, contentType),
          body,
        });
      }
    }

    const raw = Buffer.from(await backendResponse.arrayBuffer());
    const isFileRoute =
      /\/documents\/[^/]+\/file$/.test(normalizedPath) || /\/profile-image$/.test(normalizedPath);

    if (isFileRoute) {
      const fileDecoded = decodeBackendFile(raw);
      if (fileDecoded.kind === "corrupt") {
        const clientResponse = NextResponse.json(
          {
            message:
              "The API returned this file as text instead of binary, so the content is corrupted and cannot be displayed. This needs a backend fix.",
          },
          { status: 502 },
        );
        if (refreshedTokens) {
          setAuthCookies(clientResponse, refreshedTokens.accessToken, refreshedTokens.refreshToken);
        }
        clientResponse.headers.set("Cache-Control", "no-store");
        return clientResponse;
      }
      if (fileDecoded.kind === "file" && fileDecoded.bytes) {
        const clientResponse = new NextResponse(new Uint8Array(fileDecoded.bytes), {
          status: backendResponse.status,
          headers: {
            "Content-Type": fileDecoded.contentType || "application/octet-stream",
            "Content-Disposition": "inline",
            "Cache-Control": "private, no-store",
          },
        });
        if (refreshedTokens) {
          setAuthCookies(clientResponse, refreshedTokens.accessToken, refreshedTokens.refreshToken);
        }
        clientResponse.headers.set(
          "X-Correlation-ID",
          backendResponse.headers.get("X-Correlation-ID") ||
            request.headers.get("X-Correlation-ID") ||
            "",
        );
        return clientResponse;
      }
      const clientResponse = NextResponse.json(fileDecoded.data, { status: backendResponse.status });
      if (refreshedTokens) {
        setAuthCookies(clientResponse, refreshedTokens.accessToken, refreshedTokens.refreshToken);
      }
      if (backendResponse.status === 401) {
        clearAuthCookies(clientResponse);
      }
      clientResponse.headers.set(
        "X-Correlation-ID",
        backendResponse.headers.get("X-Correlation-ID") ||
          request.headers.get("X-Correlation-ID") ||
          "",
      );
      clientResponse.headers.set("Cache-Control", "no-store");
      return clientResponse;
    }

    const decoded = decodeBackendBody(raw.toString("utf8"));
    const loginTokens = isLogin ? findAuthTokens(decoded.data) : null;
    const safeDecoded = loginTokens
      ? { ...decoded, data: removeAuthTokens(decoded.data) }
      : decoded;
    const clientResponse = createClientResponse(
      safeDecoded,
      backendResponse.status,
      backendResponse.headers.get("content-type"),
    );

    if (loginTokens) {
      setAuthCookies(clientResponse, loginTokens.accessToken, loginTokens.refreshToken);
    } else if (refreshedTokens) {
      setAuthCookies(clientResponse, refreshedTokens.accessToken, refreshedTokens.refreshToken);
    }

    if (isLogout || backendResponse.status === 401) {
      clearAuthCookies(clientResponse);
    }

    clientResponse.headers.set(
      "X-Correlation-ID",
      backendResponse.headers.get("X-Correlation-ID") ||
        request.headers.get("X-Correlation-ID") ||
        "",
    );
    clientResponse.headers.set("Cache-Control", "no-store");
    return clientResponse;
  } catch (error) {
    const correlationId = createCorrelationId(request.headers.get("X-Correlation-ID"));
    console.error("API proxy failure", {
      correlationId,
      method: request.method,
      path: request.nextUrl.pathname,
      error: error instanceof Error ? error.message : String(error),
    });
    const response = NextResponse.json(
      {
        message: "The upstream service is unavailable.",
        correlationId,
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "no-store",
          "X-Correlation-ID": correlationId,
        },
      },
    );
    if (isLogout) clearAuthCookies(response);
    return response;
  }
}

export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const PATCH = handle;
export const DELETE = handle;
