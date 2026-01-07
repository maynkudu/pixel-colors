import { useState } from "react";
import { usePixelColors, getContrastText } from "pixel-colors";

export default function App() {
  const [image, setImage] = useState<string>(
    "https://picsum.photos/seed/office/1200/800",
  );
  const [count, setCount] = useState<number>(6);
  const { palette, loading, error } = usePixelColors(image, count);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const downloadCSS = () => {
    const css = `:root {\n${palette.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n")}\n}`;
    const blob = new Blob([css], { type: "text/css" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "variables.css";
    a.click();
  };

  return (
    <div style={styles.container}>
      <div style={styles.wrapper}>
        {/* Header */}
        <header style={styles.header}>
          <h1 style={styles.title}>Pixel Colors</h1>
          <p style={styles.subtitle}>Extract aesthetic palettes from images.</p>
        </header>

        {/* Toolbar */}
        <div style={styles.toolbar}>
          <div style={styles.controlGroup}>
            <label style={styles.label}>Colors: {count}</label>
            <input
              type="range"
              min="1"
              max="12"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value))}
              style={styles.range}
            />
          </div>

          <div style={styles.actionGroup}>
            <label style={styles.secondaryBtn}>
              Upload Image
              <input
                type="file"
                onChange={handleUpload}
                accept="image/*"
                style={{ display: "none" }}
              />
            </label>
            <button
              onClick={downloadCSS}
              style={styles.primaryBtn}
              disabled={palette.length === 0}
            >
              Export CSS
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.content}>
          {/* Image Preview */}
          <div style={styles.previewCard}>
            <img src={image} style={styles.mainImage} alt="Source" />
          </div>

          {/* Palette Grid */}
          <div style={styles.paletteGrid}>
            {loading ? (
              <div style={styles.loader}>Generating palette...</div>
            ) : error ? (
              <div style={styles.error}>{error}</div>
            ) : (
              palette.map((color, i) => (
                <div
                  key={i}
                  style={{ ...styles.swatch, backgroundColor: color }}
                  onClick={() => navigator.clipboard.writeText(color)}
                >
                  <span
                    style={{
                      ...styles.colorLabel,
                      color: getContrastText(color),
                    }}
                  >
                    {color.toUpperCase()}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#09090b",
    color: "#fafafa",
    padding: "60px 20px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  wrapper: {
    maxWidth: "800px",
    margin: "0 auto",
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "48px",
  },
  title: {
    fontSize: "2rem",
    fontWeight: 700,
    letterSpacing: "-0.05em",
    margin: "0 0 8px 0",
  },
  subtitle: {
    color: "#a1a1aa",
    fontSize: "0.95rem",
  },
  toolbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#18181b",
    padding: "16px 24px",
    borderRadius: "12px",
    border: "1px solid #27272a",
    marginBottom: "24px",
    gap: "20px",
    flexWrap: "wrap" as const,
  },
  controlGroup: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  label: {
    fontSize: "0.875rem",
    fontWeight: 500,
    minWidth: "80px",
  },
  range: {
    cursor: "pointer",
    accentColor: "#fafafa",
  },
  actionGroup: {
    display: "flex",
    gap: "12px",
  },
  primaryBtn: {
    backgroundColor: "#fafafa",
    color: "#18181b",
    border: "none",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 600,
    cursor: "pointer",
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    color: "#fafafa",
    border: "1px solid #27272a",
    padding: "8px 16px",
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    cursor: "pointer",
  },
  content: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "24px",
  },
  previewCard: {
    width: "100%",
    borderRadius: "12px",
    overflow: "hidden",
    border: "1px solid #27272a",
    backgroundColor: "#18181b",
    lineHeight: 0,
  },
  mainImage: {
    width: "100%",
    height: "auto",
    maxHeight: "500px",
    objectFit: "contain" as const,
  },
  paletteGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
    gap: "12px",
  },
  swatch: {
    height: "100px",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "copy",
    transition: "transform 0.1s ease",
    border: "1px solid rgba(255,255,255,0.1)",
    position: "relative" as const,
  },
  colorLabel: {
    fontSize: "0.75rem",
    fontWeight: 700,
    fontFamily: "monospace",
    opacity: 0.8,
  },
  loader: {
    gridColumn: "1 / -1",
    textAlign: "center" as const,
    padding: "40px",
    color: "#a1a1aa",
  },
  error: {
    gridColumn: "1 / -1",
    textAlign: "center" as const,
    padding: "20px",
    color: "#f87171",
    backgroundColor: "rgba(248, 113, 113, 0.1)",
    borderRadius: "8px",
  },
};
