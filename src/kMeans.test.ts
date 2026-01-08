import { test, expect, describe } from "bun:test";
import { kMeans, type RGB } from "./extractColors";

describe("kMeans Algorithm", () => {
  test("should identify distinct color clusters", () => {
    // 6 points: 3 clearly Red, 3 clearly Blue
    const points: RGB[] = [
      [255, 0, 0],
      [250, 2, 2],
      [240, 5, 5],
      [0, 0, 255],
      [2, 2, 250],
      [5, 5, 240],
    ];

    const result = kMeans(points, 2);

    expect(result).toHaveLength(2);
    // The centroids should be close to pure red and pure blue
    const hasRed = result.some(([r, g, b]) => r > 200 && b < 10);
    const hasBlue = result.some(([r, g, b]) => b > 200 && r < 10);

    expect(hasRed).toBe(true);
    expect(hasBlue).toBe(true);
  });

  test("should sort results by frequency (dominance)", () => {
    // 3 Red pixels, 1 Blue pixel
    const points: RGB[] = [
      [255, 0, 0],
      [255, 0, 0],
      [255, 0, 0],
      [0, 0, 255],
    ];

    const result = kMeans(points, 2);
    // Red must be first because it appears 3 times
    expect(result[0][0]).toBeGreaterThan(200);
    expect(result[0][2]).toBeLessThan(50);
  });

  test("handles points fewer than k", () => {
    const points: RGB[] = [[255, 0, 0]];
    const result = kMeans(points, 3);
    expect(result).toHaveLength(3);
    expect(result[0]).toEqual([255, 0, 0]);
  });

  test("handles empty input", () => {
    const result = kMeans([], 4);
    expect(result).toHaveLength(4);
    expect(result.every((c) => c[0] === 0)).toBe(true);
  });
});
