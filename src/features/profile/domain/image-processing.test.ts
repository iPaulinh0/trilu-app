import { describe, expect, it } from "vitest";
import { computeCenterSquareCrop, computeOutputSize, PROFILE_IMAGE_OUTPUT_SIZE } from "./image-processing";

/**
 * `processProfileImage` itself needs `createImageBitmap`/`<canvas>`, which
 * only exist in a browser — this project's vitest suite runs in plain Node
 * (see vitest.config.ts), so only the pure geometry math is unit-tested
 * here. The actual pixel pipeline was verified manually in-browser.
 */
describe("computeCenterSquareCrop", () => {
  it("crops a landscape image to a centered square using the shorter side", () => {
    expect(computeCenterSquareCrop(1200, 800)).toEqual({ x: 200, y: 0, size: 800 });
  });

  it("crops a portrait image to a centered square using the shorter side", () => {
    expect(computeCenterSquareCrop(800, 1200)).toEqual({ x: 0, y: 200, size: 800 });
  });

  it("returns the full image untouched when it's already square", () => {
    expect(computeCenterSquareCrop(500, 500)).toEqual({ x: 0, y: 0, size: 500 });
  });
});

describe("computeOutputSize", () => {
  it("downscales a crop larger than the max output to exactly the max", () => {
    expect(computeOutputSize(2000)).toBe(PROFILE_IMAGE_OUTPUT_SIZE);
  });

  it("never upscales a crop smaller than the max output", () => {
    expect(computeOutputSize(200)).toBe(200);
  });

  it("respects a custom max", () => {
    expect(computeOutputSize(2000, 256)).toBe(256);
  });
});
