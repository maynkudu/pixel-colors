import { StrictMode } from "react";
import { hydrateRoot, createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { Helmet, HelmetProvider } from "react-helmet-async";

const container = document.getElementById("root")!;

const MainApp = () => (
  <StrictMode>
    <HelmetProvider>
      <SEO />
      <App />
    </HelmetProvider>
  </StrictMode>
);

if (container.hasChildNodes()) {
  hydrateRoot(container, <MainApp />);
} else {
  createRoot(container).render(<MainApp />);
}

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
      <meta property="og:title" content="PixelColors — Extract Palettes" />
      <meta property="og:image" content="/pixel-colors/og-preview.png" />
      <meta property="og:type" content="website" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta
        name="twitter:description"
        content="Professional image color palette generator. Extract visual DNA in HEX, RGB, and OKLCH."
      />
      <link rel="canonical" href="https://maynkudu.github.io/pixel-colors/" />
    </Helmet>
  );
}
