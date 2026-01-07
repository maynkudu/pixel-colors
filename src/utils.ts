/**
 * Converts an RGB string "rgb(255, 255, 255)" to a brightness value.
 * Uses the HSP color model for better human perception accuracy.
 */
export function getLuminance(rgbString: string): number {
  const match = rgbString.match(/\d+/g);

  // Defensive check: ensure we have at least 3 segments
  if (!match || match.length < 3) return 0;

  const [r, g, b] = match.map(Number);

  // Final safety check: if any value failed to parse as a number
  if (!r || !g || !b) return 0;

  // HSP Equation: Weighted for human ocular sensitivity
  return Math.sqrt(0.299 * (r * r) + 0.587 * (g * g) + 0.114 * (b * b));
}

/**
 * Returns 'white' or 'black' depending on which has better contrast
 * against the provided background color.
 */
export function getContrastText(backgroundColor: string): "white" | "black" {
  const luminance = getLuminance(backgroundColor);
  return luminance > 127.5 ? "black" : "white";
}
