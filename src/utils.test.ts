import { test, expect, describe } from "bun:test";
import { rgbToOklch, getContrastText, toRgb } from "./utils";

describe("Color Utilities", () => {
  describe("rgbToOklch Accuracy", () => {
    test("converts pure white correctly", () => {
      const white = rgbToOklch(255, 255, 255);
      expect(white).toStartWith("oklch(100.00%");
    });

    test("converts pure black correctly", () => {
      const black = rgbToOklch(0, 0, 0);
      expect(black).toStartWith("oklch(0.00%");
    });

    test("handles middle gray with linearization", () => {
      // #808080 (128, 128, 128)
      const gray = rgbToOklch(128, 128, 128);
      const lMatch = gray.match(/oklch\(([\d.]+)%/);
      const lValue = parseFloat(lMatch![1]);

      // With proper sRGB linearization, 128/255 maps to ~60% L in OKLCH
      expect(lValue).toBeGreaterThan(59);
      expect(lValue).toBeLessThan(61);
    });
  });

  describe("Contrast Logic", () => {
    test("suggests black text for light colors", () => {
      expect(getContrastText("#ffffff")).toBe("black");
      expect(getContrastText("oklch(95% 0.05 100)")).toBe("black");
    });

    test("suggests white text for dark colors", () => {
      expect(getContrastText("#000000")).toBe("white");
      expect(getContrastText("oklch(20% 0.1 250)")).toBe("white");
    });
  });

  describe("toRgb Parser", () => {
    test("parses hex correctly", () => {
      expect(toRgb("#ff0000")).toEqual([255, 0, 0]);
    });

    test("parses rgb string correctly", () => {
      expect(toRgb("rgb(0, 255, 0)")).toEqual([0, 255, 0]);
    });
  });
});
