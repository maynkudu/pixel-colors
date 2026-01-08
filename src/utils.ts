type RGB = [number, number, number];

/**
 * Extracts the lightness value (0-1) from any supported format.
 */
export function getRelativeLuminance(color: string): number {
  // 1. Handle OKLCH
  if (color.startsWith("oklch")) {
    const match = color.match(/oklch\(([\d.]+)%/);
    if (match) {
      // OKLCH L is 0-100%, we normalize to 0-1
      return parseFloat(match[1] ?? "1") / 100;
    }
  }

  // 2. Handle Hex/RGB via HSP Model
  const [r, g, b] = toRgb(color);
  // HSP Equation normalized to 0-1 (sqrt of weighted squares / 255)
  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b)) / 255;
}

/**
 * Optimized contrast picker
 */
export function getContrastText(backgroundColor: string): "white" | "black" {
  // We use 0.5 as the threshold for normalized luminance
  return getRelativeLuminance(backgroundColor) > 0.5 ? "black" : "white";
}

/**
 * Standardizes Hex/RGB strings to [r, g, b]
 */
export function toRgb(color: string): RGB {
  if (color.startsWith("#")) {
    const cleanHex = color.replace("#", "");
    const num = parseInt(cleanHex, 16);
    return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
  }

  const match = color.match(/\d+/g);
  if (!match || match.length < 3) return [0, 0, 0];
  return [Number(match[0]), Number(match[1]), Number(match[2])];
}

/**
 * Highly optimized Hex to RGB using bitwise operators
 */
export function hexToRgb(hex: string): RGB {
  const cleanHex = hex.replace("#", "");
  const num = parseInt(cleanHex, 16);

  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

export function rgbToHex(r: number, g: number, b: number): string {
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

export function rgbToOklch(r: number, g: number, b: number): string {
  // 1. Linearize sRGB
  const linearize = (val: number) => {
    const v = val / 255;
    return v > 0.04045 ? Math.pow((v + 0.055) / 1.055, 2.4) : v / 12.92;
  };

  const rL = linearize(r);
  const gL = linearize(g);
  const bL = linearize(b);

  // 2. Convert to LMS space using the M1 matrix
  const l = 0.4122214708 * rL + 0.5363325363 * gL + 0.0514459929 * bL;
  const m = 0.2119034982 * rL + 0.6806995451 * gL + 0.1073969466 * bL;
  const s = 0.0883024619 * rL + 0.2817188376 * gL + 0.6299787005 * bL;

  // 3. Apply non-linearity (cube root)
  const l_ = Math.cbrt(l);
  const m_ = Math.cbrt(m);
  const s_ = Math.cbrt(s);

  // 4. Convert to Oklab components (L, a, b) using the M2 matrix
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const a = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const b_ok = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;

  // 5. Convert Oklab (Lab) to Oklch (Lch)
  const C = Math.sqrt(a * a + b_ok * b_ok);
  let H = (Math.atan2(b_ok, a) * 180) / Math.PI;
  if (H < 0) H += 360; // Normalize hue to 0-360

  return `oklch(${(L * 100).toFixed(2)}% ${C.toFixed(4)} ${H.toFixed(2)})`;
}
