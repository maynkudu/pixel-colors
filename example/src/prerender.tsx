import { renderToString } from "react-dom/server";
import App from "./App";
import { HelmetProvider, type HelmetServerState } from "react-helmet-async";
import { StrictMode } from "react";

// Define a more flexible type for the props to satisfy TS
interface PrerenderElement {
  type: string;
  props: Record<string, string>;
}

interface PrerenderResult {
  html: string;
  head: {
    title: string;
    elements: Set<PrerenderElement>;
  };
}

export async function prerender(): Promise<PrerenderResult> {
  const helmetContext = {} as { helmet?: HelmetServerState };

  const html = renderToString(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <App />
      </HelmetProvider>
    </StrictMode>,
  );

  const { helmet } = helmetContext;

  // We explicitly define the elements array first to avoid inline type inference issues
  const elements: PrerenderElement[] = [
    {
      type: "meta",
      props: {
        name: "description",
        content:
          "Extract professional color palettes (HEX, RGB, OKLCH) from images.",
      },
    },
    {
      type: "meta",
      props: {
        property: "og:image",
        content: "/pixel-colors/og-preview.png",
      },
    },
  ];

  return {
    html,
    head: {
      title:
        helmet?.title?.toString().replace(/<[^>]*>?/gm, "") || "PixelColors",
      elements: new Set(elements),
    },
  };
}
