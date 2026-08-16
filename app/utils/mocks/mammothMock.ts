/**
 * Mock stub for optional mammoth docx parser in @browserai/browserai.
 * Resolves Vite CJS/ESM interop in development and Web Worker bundling.
 */
export async function convertToHtml(): Promise<{ value: string; messages: unknown[] }> {
  return { value: '', messages: [] };
}

export async function extractRawText(): Promise<{ value: string; messages: unknown[] }> {
  return { value: '', messages: [] };
}

const mammothMock = {
  convertToHtml,
  extractRawText,
};

export default mammothMock;
