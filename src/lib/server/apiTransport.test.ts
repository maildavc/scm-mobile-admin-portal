import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import {
  decodeBackendBody,
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
