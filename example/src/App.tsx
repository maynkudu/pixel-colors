import { useState } from "react";
import { usePixelColors } from "pixel-colors";

export default function App() {
  const [image, setImage] = useState<string>(
    "https://picsum.photos/seed/nature/1200/800",
  );
  const { palette, loading, error } = usePixelColors(image, 6);

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(URL.createObjectURL(file));
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>🎨 Pixel Colors</h1>
        <p style={styles.subtitle}>Professional color extraction playground</p>
      </header>

      <main style={styles.main}>
        {/* Upload Section */}
        <section style={styles.uploadSection}>
          <label style={styles.uploadLabel}>
            Choose an image
            <input
              type="file"
              onChange={handleUpload}
              accept="image/*"
              style={styles.hiddenInput}
            />
          </label>
          <span style={styles.uploadNote}>PNG, JPG, or WEBP supported</span>
        </section>

        <div style={styles.grid}>
          {/* Image Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>Source Image</div>
            <div style={styles.imageWrapper}>
              <img src={image} style={styles.image} alt="Test" />
            </div>
          </div>

          {/* Palette Card */}
          <div style={styles.card}>
            <div style={styles.cardHeader}>Extracted Palette</div>
            <div style={styles.paletteContent}>
              {loading && <div style={styles.status}>Analyzing image...</div>}
              {error && <div style={styles.error}>{error}</div>}
              {!loading && !error && (
                <div style={styles.list}>
                  {palette.map((color: string, i: number) => (
                    <div key={i} style={styles.row}>
                      <div
                        style={{
                          ...styles.swatch,
                          backgroundColor: color,
                        }}
                      />
                      <div style={styles.colorInfo}>
                        <code style={styles.code}>{color.toUpperCase()}</code>
                        <button
                          onClick={() => navigator.clipboard.writeText(color)}
                          style={styles.copyBtn}
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100-vh",
    backgroundColor: "#f8fafc",
    color: "#1e293b",
    padding: "40px 20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: "center" as const,
    marginBottom: "40px",
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: 800,
    margin: 0,
    color: "#0f172a",
    letterSpacing: "-0.025em",
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    marginTop: "8px",
  },
  main: {
    maxWidth: "1000px",
    margin: "0 auto",
  },
  uploadSection: {
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    marginBottom: "32px",
    gap: "8px",
  },
  uploadLabel: {
    backgroundColor: "#2563eb",
    color: "white",
    padding: "10px 24px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: 600,
    transition: "background-color 0.2s",
  },
  hiddenInput: {
    display: "none",
  },
  uploadNote: {
    fontSize: "0.85rem",
    color: "#94a3b8",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "white",
    borderRadius: "16px",
    boxShadow:
      "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    overflow: "hidden",
    border: "1px solid #e2e8f0",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #e2e8f0",
    fontWeight: 600,
    fontSize: "0.95rem",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    color: "#64748b",
  },
  imageWrapper: {
    padding: "20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f1f5f9",
  },
  image: {
    maxWidth: "100%",
    maxHeight: "400px",
    borderRadius: "8px",
    display: "block",
    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
  },
  paletteContent: {
    padding: "20px",
  },
  list: {
    display: "flex",
    flexDirection: "column" as const,
    gap: "12px",
  },
  row: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    padding: "8px",
    borderRadius: "12px",
    border: "1px solid #f1f5f9",
    transition: "background-color 0.2s",
  },
  swatch: {
    width: "56px",
    height: "56px",
    borderRadius: "10px",
    boxShadow: "inset 0 0 0 1px rgba(0,0,0,0.05)",
  },
  colorInfo: {
    flex: 1,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  code: {
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    fontSize: "0.9rem",
    fontWeight: 600,
    color: "#334155",
  },
  copyBtn: {
    padding: "6px 12px",
    fontSize: "0.75rem",
    borderRadius: "6px",
    border: "1px solid #e2e8f0",
    backgroundColor: "transparent",
    cursor: "pointer",
    fontWeight: 500,
    color: "#64748b",
  },
  status: {
    textAlign: "center" as const,
    color: "#64748b",
    padding: "40px 0",
  },
  error: {
    color: "#ef4444",
    textAlign: "center" as const,
    padding: "20px",
    backgroundColor: "#fef2f2",
    borderRadius: "8px",
  },
};
