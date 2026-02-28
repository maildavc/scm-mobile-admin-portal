import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://46.101.225.14:5000";

/**
 * Proxy all API requests through Next.js server to avoid
 * browser Content-Encoding issues with encrypted responses.
 * The server-side fetch CAN set Accept-Encoding: identity.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

  const body = await request.text();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  };

  // Forward Authorization header if present
  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  // Forward correlation ID if present
  const correlationId = request.headers.get("X-Correlation-ID");
  if (correlationId) headers["X-Correlation-ID"] = correlationId;

  try {
    const res = await fetch(targetUrl, {
      method: "POST",
      headers,
      body,
    });

    const responseText = await res.text();

    return new NextResponse(responseText, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

  const headers: Record<string, string> = {
    "Accept-Encoding": "identity",
  };

  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const correlationId = request.headers.get("X-Correlation-ID");
  if (correlationId) headers["X-Correlation-ID"] = correlationId;

  try {
    const res = await fetch(targetUrl, { headers });
    const responseText = await res.text();

    return new NextResponse(responseText, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

  const body = await request.text();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  };

  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const correlationId = request.headers.get("X-Correlation-ID");
  if (correlationId) headers["X-Correlation-ID"] = correlationId;

  try {
    const res = await fetch(targetUrl, {
      method: "PUT",
      headers,
      body,
    });

    const responseText = await res.text();

    return new NextResponse(responseText, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

  const headers: Record<string, string> = {
    "Accept-Encoding": "identity",
  };

  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const correlationId = request.headers.get("X-Correlation-ID");
  if (correlationId) headers["X-Correlation-ID"] = correlationId;

  try {
    const res = await fetch(targetUrl, {
      method: "DELETE",
      headers,
    });

    const responseText = await res.text();

    return new NextResponse(responseText, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const targetUrl = `${API_BASE_URL}/${path.join("/")}`;

  const body = await request.text();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Accept-Encoding": "identity",
  };

  const auth = request.headers.get("Authorization");
  if (auth) headers["Authorization"] = auth;

  const correlationId = request.headers.get("X-Correlation-ID");
  if (correlationId) headers["X-Correlation-ID"] = correlationId;

  try {
    const res = await fetch(targetUrl, {
      method: "PATCH",
      headers,
      body,
    });

    const responseText = await res.text();

    return new NextResponse(responseText, {
      status: res.status,
      headers: {
        "Content-Type": res.headers.get("Content-Type") || "text/plain",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Proxy request failed", details: String(error) },
      { status: 502 },
    );
  }
}
