import { thumbHashToDataURL } from 'thumbhash';

export function decodeThumbHash(hash: string): string | null {
  try {
    const bytes = base64ToBytes(hash);
    return thumbHashToDataURL(bytes);
  } catch (e) {
    console.error('Failed to decode thumbhash:', e);
    return null;
  }
}

function base64ToBytes(base64: string): Uint8Array {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
