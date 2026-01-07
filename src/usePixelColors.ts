import { useState, useEffect } from "react";
import { extractColors } from "./extractColors";

export function usePixelColors(src: string, count = 4) {
  const [palette, setPalette] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!src) return;

    let isMounted = true;
    setLoading(true);

    const img = new Image();
    img.crossOrigin = "Anonymous"; // Crucial for reading canvas data
    img.src = src;

    img.onload = () => {
      if (!isMounted) return;
      try {
        const colors = extractColors(img, count);
        setPalette(colors);
        setLoading(false);
      } catch (err) {
        console.error(err);
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
  }, [src, count]);

  return { palette, loading, error };
}
