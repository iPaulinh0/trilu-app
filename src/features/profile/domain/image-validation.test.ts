import { describe, expect, it } from "vitest";
import { ImageValidationError, PROFILE_IMAGE_MAX_BYTES, validateProfileImageFile } from "./image-validation";

const JPEG_HEADER = new Uint8Array([0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46]);
const PNG_HEADER = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const WEBP_HEADER = new Uint8Array([
  0x52, 0x49, 0x46, 0x46, 0x00, 0x00, 0x00, 0x00, 0x57, 0x45, 0x42, 0x50,
]);

function fileFrom(bytes: Uint8Array, name: string, type: string, sizeOverride?: number): File {
  const padded = sizeOverride ? new Uint8Array(sizeOverride) : bytes;
  if (sizeOverride) padded.set(bytes);
  return new File([padded as BlobPart], name, { type });
}

describe("validateProfileImageFile", () => {
  it("accepts a real JPEG, even if renamed with the wrong extension", async () => {
    const file = fileFrom(JPEG_HEADER, "photo.png", "image/png");
    await expect(validateProfileImageFile(file)).resolves.toBeUndefined();
  });

  it("accepts a real PNG", async () => {
    const file = fileFrom(PNG_HEADER, "photo.png", "image/png");
    await expect(validateProfileImageFile(file)).resolves.toBeUndefined();
  });

  it("accepts a real WebP", async () => {
    const file = fileFrom(WEBP_HEADER, "photo.webp", "image/webp");
    await expect(validateProfileImageFile(file)).resolves.toBeUndefined();
  });

  it("rejects a file whose real bytes don't match any accepted format, regardless of the reported MIME type", async () => {
    const fakeFile = new File([new TextEncoder().encode("not an image")], "photo.png", { type: "image/png" });
    await expect(validateProfileImageFile(fakeFile)).rejects.toMatchObject({
      name: "ImageValidationError",
      reason: "invalidType",
    });
  });

  it("rejects a file over 5 MB even when the content is a real, valid image", async () => {
    const oversized = fileFrom(JPEG_HEADER, "big.jpg", "image/jpeg", PROFILE_IMAGE_MAX_BYTES + 1);
    await expect(validateProfileImageFile(oversized)).rejects.toMatchObject({
      name: "ImageValidationError",
      reason: "tooLarge",
    });
  });

  it("accepts a file exactly at the 5 MB limit", async () => {
    const atLimit = fileFrom(JPEG_HEADER, "limit.jpg", "image/jpeg", PROFILE_IMAGE_MAX_BYTES);
    await expect(validateProfileImageFile(atLimit)).resolves.toBeUndefined();
  });

  it("is an instance of ImageValidationError so callers can catch it specifically", async () => {
    const fakeFile = new File([new Uint8Array([1, 2, 3])], "x", { type: "image/png" });
    await expect(validateProfileImageFile(fakeFile)).rejects.toBeInstanceOf(ImageValidationError);
  });
});
