/**
 * Pure validation for a candidate avatar file — no DOM/canvas work here, so
 * it's testable in plain Node. Real MIME sniffing (not just the browser-
 * reported `File.type`) happens via the magic-byte signatures below, since a
 * renamed `.txt` can otherwise claim to be `image/png`.
 */

export const PROFILE_IMAGE_MAX_BYTES = 5 * 1024 * 1024;

export const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"] as const;
export type AcceptedImageType = (typeof ACCEPTED_IMAGE_TYPES)[number];

export type ImageValidationErrorReason = "invalidType" | "tooLarge";

export class ImageValidationError extends Error {
  reason: ImageValidationErrorReason;

  constructor(reason: ImageValidationErrorReason, message: string) {
    super(message);
    this.name = "ImageValidationError";
    this.reason = reason;
  }
}

/** Magic-byte signatures for the three accepted formats. */
function sniffImageType(bytes: Uint8Array): AcceptedImageType | null {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 8 &&
    bytes[0] === 0x89 &&
    bytes[1] === 0x50 &&
    bytes[2] === 0x4e &&
    bytes[3] === 0x47 &&
    bytes[4] === 0x0d &&
    bytes[5] === 0x0a &&
    bytes[6] === 0x1a &&
    bytes[7] === 0x0a
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 12 &&
    bytes[0] === 0x52 &&
    bytes[1] === 0x49 &&
    bytes[2] === 0x46 &&
    bytes[3] === 0x46 &&
    bytes[8] === 0x57 &&
    bytes[9] === 0x45 &&
    bytes[10] === 0x42 &&
    bytes[11] === 0x50
  ) {
    return "image/webp";
  }
  return null;
}

/** Reads only the first bytes needed to sniff the format — never the whole file. */
export async function detectRealImageType(file: Blob): Promise<AcceptedImageType | null> {
  const head = await file.slice(0, 12).arrayBuffer();
  return sniffImageType(new Uint8Array(head));
}

/**
 * Throws ImageValidationError when the file fails size or (real, sniffed)
 * type checks. Callers should catch this specifically to show a field-level
 * message instead of a generic failure toast.
 */
export async function validateProfileImageFile(file: File): Promise<void> {
  if (file.size > PROFILE_IMAGE_MAX_BYTES) {
    throw new ImageValidationError("tooLarge", "A imagem deve ter no máximo 5 MB.");
  }
  const realType = await detectRealImageType(file);
  if (!realType) {
    throw new ImageValidationError("invalidType", "Envie uma imagem em JPEG, PNG ou WebP.");
  }
}
