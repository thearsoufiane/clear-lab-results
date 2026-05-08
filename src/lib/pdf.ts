// Convert any supported file (PDF or image) to base64 directly, no processing.
export async function fileToBase64(file: File): Promise<{ base64: string; mimeType: string; fileName: string }> {
  const mimeType =
    file.type ||
    (file.name.toLowerCase().endsWith(".pdf") ? "application/pdf" : "application/octet-stream");
  const base64 = await readAsBase64(file);
  return { base64, mimeType, fileName: file.name };
}

function readAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => {
      const result = r.result as string;
      const comma = result.indexOf(",");
      resolve(result.slice(comma + 1));
    };
    r.onerror = () => reject(r.error);
    r.readAsDataURL(file);
  });
}
