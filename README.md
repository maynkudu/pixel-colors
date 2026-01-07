# pixel-colors

A high-performance, deterministic color extraction library for React. Use K-Means clustering to find dominant color palettes from any image with zero external dependencies.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
![Bundle Size](https://img.shields.io/bundlephobia/minzip/pixel-colors)
![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue)

---

## Key Features

- **Deterministic K-Means**: Unlike other libraries that use random seeding, our algorithm uses a strided initialization for consistent palettes every time.
- **Performance Optimized**: Automatically downsamples large images on an offscreen canvas to ensure extraction happens in milliseconds.
- **Strictly Typed**: Built with \`noUncheckedIndexedAccess\` and \`verbatimModuleSyntax\`—no "possibly undefined" runtime errors.
- **SSR Safe**: Internal guards for \`window\` and \`document\` make it compatible with Next.js, Remix, and Bun.

---

## Installation

```bash
bun add pixel-colors
# or
npm install pixel-colors
```

---

## Usage

### Basic Example

The \`usePixelColors\` hook handles image loading, canvas drawing, and color clustering in a single line.

```tsx
import { usePixelColors } from "pixel-colors";

function ProfileCard({ userImage }) {
  const { palette, loading, error } = usePixelColors(userImage, 5);

  if (loading) return <SkeletonPalette />;

  return (
    <div style={{ borderColor: palette[0] }}>
      {palette.map((color) => (
        <Swatch key={color} color={color} />
      ))}
    </div>
  );
}
```

### Logic-Only (Vanilla JS/TS)

You can use the core extraction logic without React:

```ts
import { extractColors } from "pixel-colors";

const img = document.getElementById("my-image") as HTMLImageElement;
const colors = extractColors(img, 6);
// Returns ['rgb(25, 45, 60)', ...]
```

---

## Technical Details

### Downsampling

To prevent the main thread from locking up on 4K images, the library resizes the input to a maximum of **100x100px** before processing. This reduces the pixel data by ~99% while maintaining the integrity of the dominant color clusters.

### Algorithm

1.  **Staging**: Image is drawn to an offscreen canvas.
2.  **Sampling**: Pixels are converted to an \`RGB\` coordinate space.
3.  **Clustering**: K-Means groups pixels into \`k\` clusters using Euclidean distance.
4.  **Convergence**: The algorithm iterates until centroids stabilize or max iterations (10) are reached.

---

## Configuration (TSConfig)

This library is built with modern TypeScript standards. For the best experience, we recommend these settings:

```json
{
  "compilerOptions": {
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

---

## Contributing

Contributions are welcome. Please ensure that any new hooks or logic maintain the zero-dependency goal and pass the existing \`bun test\` suite.

## License

MIT © [maynkudu](https://github.com/maynkudu)
