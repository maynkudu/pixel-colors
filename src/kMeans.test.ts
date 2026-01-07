import { expect, test, describe } from "bun:test";
import { kMeans } from "./extractColors";

type RGB = [number, number, number];

describe("kMeans Algorithm", () => {
  test("should return exactly k colors even with empty input", () => {
    const result = kMeans([], 5);
    expect(result).toHaveLength(5);
    expect(result[0]).toEqual([0, 0, 0]);
  });

  test("should extract obvious dominant colors", () => {
    // A dataset of pure Reds and pure Blues
    const points: RGB[] = [
      [255, 0, 0],
      [250, 0, 0],
      [240, 2, 2], // Red-ish
      [0, 0, 255],
      [0, 5, 250],
      [2, 2, 240], // Blue-ish
    ];

    const result = kMeans(points, 2);

    // One centroid should be red-ish, one should be blue-ish
    const hasRed = result.some(([r, g, b]) => r > 200 && b < 50);
    const hasBlue = result.some(([r, g, b]) => b > 200 && r < 50);

    expect(hasRed).toBe(true);
    expect(hasBlue).toBe(true);
  });

  test("is deterministic with same input", () => {
    const points: RGB[] = [
      [10, 20, 30],
      [100, 110, 120],
      [200, 210, 220],
      [50, 50, 50],
    ];

    const run1 = kMeans(points, 2);
    const run2 = kMeans(points, 2);

    expect(run1).toEqual(run2);
  });
});
