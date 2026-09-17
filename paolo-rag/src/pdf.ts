export function isPdfFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return file.type === "application/pdf" || name.endsWith(".pdf");
}

export async function extractPdfText(buffer: ArrayBuffer): Promise<string> {
  const { extractText, getDocumentProxy } = await import("unpdf");
  const pdf = await getDocumentProxy(new Uint8Array(buffer));
  const result = await extractText(pdf, { mergePages: true });
  const text = Array.isArray(result.text)
    ? result.text.join("\n\n")
    : String(result.text || "");
  return text.replace(/\u0000/g, "").trim();
}

export function asFormFile(value: unknown): File | null {
  if (value == null || typeof value === "string") return null;
  // Workers FormData may type uploads as Blob-like without a usable File constructor.
  if (typeof value === "object" && "arrayBuffer" in value && "name" in value) {
    return value as File;
  }
  return null;
}
