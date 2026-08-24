/**
 * Avatar processing pipeline. The geometry math below is pure (plain
 * numbers in, plain numbers out) so it's unit-testable without a DOM; the
 * actual pixel work (`processProfileImage`) needs `createImageBitmap` +
 * `<canvas>`, which only exist in a browser, so that half is exercised via
 * manual/browser verification instead of vitest (this project's test suite
 * runs in a plain Node environment with no DOM).
 */

export const PROFILE_IMAGE_OUTPUT_SIZE = 512;
const WEBP_QUALITY = 0.85;

export interface SquareCrop {
  x: number;
  y: number;
  size: number;
}

/** Largest centered square that fits inside a width×height source image. */
export function computeCenterSquareCrop(width: number, height: number): SquareCrop {
  const size = Math.min(width, height);
  return { x: Math.round((width - size) / 2), y: Math.round((height - size) / 2), size };
}

/** Never upscales a smaller-than-target source — only ever shrinks. */
export function computeOutputSize(cropSize: number, maxOutput = PROFILE_IMAGE_OUTPUT_SIZE): number {
  return Math.min(cropSize, maxOutput);
}

function canEncodeWebP(): boolean {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL("image/webp").startsWith("data:image/webp");
}

/**
 * Orientation-corrected (via `imageOrientation: "from-image"`, which reads
 * the EXIF tag natively), center-cropped to square, downscaled to at most
 * 512×512, and re-encoded — WebP when the browser supports encoding it,
 * falling back to JPEG otherwise.
 */
export async function processProfileImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  try {
    const crop = computeCenterSquareCrop(bitmap.width, bitmap.height);
    const outputSize = computeOutputSize(crop.size);

    const canvas = document.createElement("canvas");
    canvas.width = outputSize;
    canvas.height = outputSize;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Não foi possível processar a imagem.");
    ctx.drawImage(bitmap, crop.x, crop.y, crop.size, crop.size, 0, 0, outputSize, outputSize);

    const useWebP = canEncodeWebP();
    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, useWebP ? "image/webp" : "image/jpeg", WEBP_QUALITY),
    );
    if (!blob) throw new Error("Não foi possível processar a imagem.");
    return blob;
  } finally {
    bitmap.close();
  }
}
