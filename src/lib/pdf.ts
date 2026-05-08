// Convert a File (PDF or image) to base64 image data ready for vision API.
// PDFs: render first page to canvas via pdfjs-dist.
export async function fileToImageBase64(file: File): Promise<{ base64: string; mimeType: string }> {
  if (file.type.startsWith("image/")) {
    const base64 = await readAsBase64(file);
    return { base64, mimeType: file.type };
  }
  if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
    return await renderPdfFirstPage(file);
  }
  throw new Error(`Unsupported file type: ${file.type || file.name}`);
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

async function renderPdfFirstPage(file: File): Promise<{ base64: string; mimeType: string }> {
  const pdfjs = await import("pdfjs-dist");
  // Use CDN worker to avoid bundling worker file
  // @ts-ignore
  pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

  const buf = await file.arrayBuffer();
  const doc = await pdfjs.getDocument({ data: buf }).promise;
  const page = await doc.getPage(1);
  const viewport = page.getViewport({ scale: 2 });
  const canvas = document.createElement("canvas");
  canvas.width = viewport.width;
  canvas.height = viewport.height;
  const ctx = canvas.getContext("2d")!;
  await page.render({ canvas, canvasContext: ctx, viewport } as any).promise;
  const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
  return { base64: dataUrl.split(",")[1], mimeType: "image/jpeg" };
}
