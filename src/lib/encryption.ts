import CryptoJS from "crypto-js";

const AES_KEY = process.env.NEXT_PUBLIC_AES_KEY || "";
const AES_IV = process.env.NEXT_PUBLIC_AES_IV || "";

/**
 * Encrypt a plaintext string using AES-128-CBC.
 * Returns a Base64-encoded ciphertext string.
 */
export function encryptPayload(plaintext: string): string {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const iv = CryptoJS.enc.Utf8.parse(AES_IV);

  const encrypted = CryptoJS.AES.encrypt(plaintext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return encrypted.toString(); // Base64-encoded ciphertext
}

/**
 * Decrypt a Base64-encoded AES-128-CBC ciphertext string.
 * Returns the decrypted plaintext string.
 */
export function decryptPayload(ciphertext: string): string {
  const key = CryptoJS.enc.Utf8.parse(AES_KEY);
  const iv = CryptoJS.enc.Utf8.parse(AES_IV);

  const decrypted = CryptoJS.AES.decrypt(ciphertext, key, {
    iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  return decrypted.toString(CryptoJS.enc.Utf8);
}
