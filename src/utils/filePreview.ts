/** Magic-byte sniff for KYC document preview. Do not trust Content-Type. */

export type FilePreviewKind = "image" | "pdf";

const REPLACEMENT = [0xef, 0xbf, 0xbd] as const;

export function isUtf8MangledBytes(bytes: Uint8Array): boolean {
  const window = bytes.subarray(0, Math.min(bytes.length, 64 * 1024));
  let occurrences = 0;
  for (let i = 0; i < window.length - 2; i += 1) {
    if (window[i] === REPLACEMENT[0] && window[i + 1] === REPLACEMENT[1] && window[i + 2] === REPLACEMENT[2]) {
      occurrences += 1;
      i += 2;
    }
  }
  return occurrences * 3 > window.length * 0.05;
}

export function sniffPreviewKind(bytes: Uint8Array): FilePreviewKind | null {
  if (bytes.length >= 4 && bytes[0] === 0x89 && bytes[1] === 0x50 && bytes[2] === 0x4e && bytes[3] === 0x47) {
    return "image";
  }
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image";
  }
  if (bytes.length >= 6 && bytes[0] === 0x47 && bytes[1] === 0x49 && bytes[2] === 0x46) {
    return "image";
  }
  if (bytes.length >= 4 && bytes[0] === 0x25 && bytes[1] === 0x50 && bytes[2] === 0x44 && bytes[3] === 0x46) {
    return "pdf";
  }
  return null;
}

export function mimeForPreviewKind(kind: FilePreviewKind, bytes: Uint8Array): string {
  if (kind === "pdf") return "application/pdf";
  if (bytes.length >= 4 && bytes[0] === 0x89) return "image/png";
  if (bytes.length >= 6 && bytes[0] === 0x47) return "image/gif";
  return "image/jpeg";
}
