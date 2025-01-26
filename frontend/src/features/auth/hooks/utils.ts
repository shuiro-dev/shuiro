/**
 * ArrayBufferをBase64文字列に変換
 * @param buffer - 変換対象のバイナリデータ
 * @returns Base64エンコードされた文字列
 */
export const arrayBufferToBase64 = (
  buffer: ArrayBuffer | ArrayBufferLike,
): string => {
  const uint8Array =
    buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  return btoa(String.fromCodePoint(...uint8Array))
    .replaceAll("+", "-")
    .replaceAll("/", "_")
    .replaceAll("=", "")
}

/**
 * Base64文字列をArrayBufferに変換
 * @param base64 - Base64エンコードされた文字列
 * @returns デコードされたバイナリデータ
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  try {
    const standardBase64 = base64
      .replaceAll("-", "+")
      .replaceAll("_", "/")
      .padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")

    const binaryString = atob(standardBase64)
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = String.prototype.codePointAt.call(binaryString, i) as number
    }
    return bytes.buffer as ArrayBuffer
  } catch (error) {
    console.error("Base64 decoding error:", error)
    throw new Error("Base64文字列のデコードに失敗しました")
  }
}
