import { useState, useEffect } from "react";
import { extractColors, type RGB } from "./extractColors";
import { rgbToHex, rgbToOklch } from "./utils";

export type ColorFormat = "rgb" | "hex" | "oklch";

interface Options {
  format?: ColorFormat;
}

export function usePixelColors(src: string, count = 4, options: Options = {}) {
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    setLoading(true);
    setError(null); // Reset error on new source

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      try {
        // 1. Extract raw [r, g, b] arrays from the image
        const rawColors: RGB[] = extractColors(img, count);

        // 2. Format them based on user preference
        const formatted = rawColors.map(([r, g, b]) => {
          switch (options.format) {
            case "hex":
              return rgbToHex(r, g, b);
            case "oklch":
              return rgbToOklch(r, g, b);
            default:
              return `rgb(${r}, ${g}, ${b})`;
          }
        });

        setPalette(formatted);
        setLoading(false);
      } catch (err) {
        setError("Failed to extract colors");
        setLoading(false);
      }
    };

    img.onerror = () => {
      if (!isMounted) return;
      setError("Failed to load image");
      setLoading(false);
    };

    return () => {
      isMounted = false;
    };
    // Add options.format to the dependency array so the palette
    // updates instantly when the user toggles the format!
  }, [src, count, options.format]);

  return { palette, loading, error };
}
