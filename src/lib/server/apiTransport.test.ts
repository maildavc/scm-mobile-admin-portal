import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  decodeBackendBody,
  decodeBackendFile,
  encodeJsonRequest,
  encryptPayload,
  findAuthTokens,
  removeAuthTokens,
  toCamelCase,
  toPascalCase,
} from "./apiTransport";

beforeEach(() => {
  process.env.API_AES_KEY = "1234567890abcdef";
  process.env.API_AES_IV = "abcdef1234567890";
});

describe("API transport", () => {
  it("converts nested object keys in both directions", () => {
    const input = { firstName: "Ada", items: [{ productId: "p-1" }] };
    const pascal = toPascalCase(input);

    expect(pascal).toEqual({
      FirstName: "Ada",
      Items: [{ ProductId: "p-1" }],
    });
    expect(toCamelCase(pascal)).toEqual(input);
  });

  it("encrypts browser JSON and decrypts backend response wrappers", () => {
    const encoded = JSON.parse(encodeJsonRequest({ firstName: "Ada" })) as { request: string };
    expect(encoded.request).not.toContain("Ada");

    const backendBody = JSON.stringify({
      Response: encryptPayload(
        JSON.stringify({
          Status: "success",
          Data: { FirstName: "Ada" },
        }),
      ),
    });

    expect(decodeBackendBody(backendBody)).toEqual({
      isJson: true,
      data: {
        status: "success",
        data: { firstName: "Ada" },
      },
    });
  });

  it("unwraps encrypted image bytes from the gateway envelope", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const { createCipheriv } = require("node:crypto");
    const cipher = createCipheriv("aes-128-cbc", Buffer.from("1234567890abcdef"), Buffer.from("abcdef1234567890"));
    const encrypted = Buffer.concat([cipher.update(png), cipher.final()]).toString("base64");
    const wrapped = Buffer.from(JSON.stringify({ response: encrypted }));

    const decoded = decodeBackendFile(wrapped);
    expect(decoded.kind).toBe("file");
    expect(decoded.contentType).toBe("image/png");
    expect(decoded.bytes?.subarray(0, 4)).toEqual(png.subarray(0, 4));
  });

  it("rejects file payloads whose bytes were destroyed by a UTF-8 round trip", () => {
    const png = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
    const noise = Buffer.concat(
      Array.from({ length: 512 }, () => Buffer.from([0x80, 0x91, 0xa2, 0xff])),
    );
    const mangled = Buffer.from(Buffer.concat([png, noise]).toString("utf8"), "utf8");

    const { createCipheriv } = require("node:crypto");
    const cipher = createCipheriv("aes-128-cbc", Buffer.from("1234567890abcdef"), Buffer.from("abcdef1234567890"));
    const encrypted = Buffer.concat([cipher.update(mangled), cipher.final()]).toString("base64");

    const decoded = decodeBackendFile(Buffer.from(JSON.stringify({ response: encrypted })));
    expect(decoded.kind).toBe("corrupt");
    expect(decoded.bytes).toBeUndefined();
  });

  it("finds tokens deeply and removes them before returning login data", () => {
    const response = {
      data: {
        accessToken: "access",
        refreshToken: "refresh",
        user: { id: "u-1" },
      },
    };

    expect(findAuthTokens(response)).toEqual({
      accessToken: "access",
      refreshToken: "refresh",
    });
    expect(removeAuthTokens(response)).toEqual({
      data: { user: { id: "u-1" } },
    });
  });
});
