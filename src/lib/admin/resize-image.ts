/**
 * Phone photos weigh 4–8 MB and Vercel rejects request bodies over 4.5 MB,
 * so photos are downscaled in the browser before uploading.
 */
const MAX_SIDE = 2000;
const QUALITY = 0.85;

export const PHOTO_READ_ERROR =
  "No se pudo leer la foto. Usa una foto JPG o PNG.";

async function decode(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ("createImageBitmap" in window) {
    try {
      return await createImageBitmap(file);
    } catch {
      // fall through to <img>, which some browsers decode more formats with
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await img.decode();
    return img;
  } finally {
    URL.revokeObjectURL(url);
  }
}

export async function resizeImage(file: File): Promise<File> {
  // Vector and animated images are uploaded as-is
  if (file.type === "image/svg+xml" || file.type === "image/gif") return file;

  let source: ImageBitmap | HTMLImageElement;
  try {
    source = await decode(file);
  } catch {
    throw new Error(PHOTO_READ_ERROR);
  }

  const width = source.width;
  const height = source.height;
  if (!width || !height) throw new Error(PHOTO_READ_ERROR);

  const scale = Math.min(1, MAX_SIDE / Math.max(width, height));
  // Small JPGs don't need re-encoding
  if (scale === 1 && file.type === "image/jpeg" && file.size < 1.5 * 1024 * 1024) {
    return file;
  }

  const canvas = document.createElement("canvas");
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY)
  );
  if (!blob) throw new Error(PHOTO_READ_ERROR);

  const name = file.name.replace(/\.[^.]+$/, "") + ".jpg";
  return new File([blob], name, { type: "image/jpeg" });
}

/** Resizes and uploads a photo; returns its public URL. */
export async function uploadPhoto(file: File): Promise<string> {
  const ready = await resizeImage(file);
  const formData = new FormData();
  formData.append("file", ready);

  const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.url) {
    throw new Error(data.error || "Error al subir la imagen");
  }
  return data.url;
}
