import NativeBrotliDecompress from './NativeBrotliDecompress';

export async function decompress(base64Data: string): Promise<string> {
  return NativeBrotliDecompress.decompress(base64Data);
};