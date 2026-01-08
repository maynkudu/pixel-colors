import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Helmet, HelmetProvider } from "react-helmet-async";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <HelmetProvider>
      <SEO />
      <App />
    </HelmetProvider>
  </StrictMode>,
);

export function SEO() {
  return (
    <Helmet>
      <title>PixelColors — Extract Palettes (HEX, RGB, OKLCH)</title>
      <meta
        name="description"
        content="Professional image color palette generator. Extract visual DNA in HEX, RGB, and high-accuracy OKLCH. Export CSS variables instantly."
      />
      <meta
        name="keywords"
        content="color palette generator, oklch extractor, image to css, color-mix, design tools"
      />

      {/* Open Graph / Social Media */}
      <meta property="og:title" content="PixelColors — Extract Palettes" />
      <meta
        property="og:description"
        content="Extract visual DNA from any image with high-accuracy OKLCH support."
      />
      <meta property="og:image" content="/og-preview.png" />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="PixelColors" />
      <meta name="twitter:image" content="/og-preview.png" />

      <link rel="canonical" href="https://maynkudu.github.io/pixel-colors/" />
      <meta
        name="twitter:description"
        content="Extract visual DNA from any image with high-accuracy OKLCH support."
      />
    </Helmet>
  );
}
