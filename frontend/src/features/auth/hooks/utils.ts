/**
 * ArrayBufferをBase64文字列に変換
 * @param buffer - 変換対象のバイナリデータ
 * @returns Base64エンコードされた文字列
 */
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCodePoint(...new Uint8Array(buffer)))
}

/**
 * Base64文字列をArrayBufferに変換
 * @param base64 - Base64エンコードされた文字列
 * @returns デコードされたバイナリデータ
 */
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = String.prototype.codePointAt.call(binaryString, i) as number
  }
  return bytes.buffer as ArrayBuffer
}
