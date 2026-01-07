type RGB = [number, number, number];

function distanceSq(a: RGB, b: RGB): number {
  return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2 + (a[2] - b[2]) ** 2;
}

export function kMeans(points: RGB[], k: number, maxIterations = 10): RGB[] {
  if (points.length === 0) return Array.from({ length: k }, () => [0, 0, 0]);

  let centroids: RGB[] = [];

  // 1. Safe Initialization
  if (points.length < k) {
    centroids = [...points];
    while (centroids.length < k) {
      centroids.push([0, 0, 0]);
    }
  } else {
    const step = Math.floor(points.length / k);
    for (let i = 0; i < k; i++) {
      const p = points[i * step];
      centroids.push(p ? p : [0, 0, 0]);
    }
  }

  // Ensure exact length k
  centroids = centroids.slice(0, k);

  // 2. The Algorithm
  for (let iter = 0; iter < maxIterations; iter++) {
    const sums: RGB[] = Array.from({ length: k }, () => [0, 0, 0]);
    const counts: number[] = new Array(k).fill(0);

    // Assignment Step
    for (const p of points) {
      let minDist = Number.MAX_VALUE;
      let clusterIndex = 0;

      for (let j = 0; j < k; j++) {
        const c = centroids[j];
        if (!c) continue;
        const dist = distanceSq(p, c);
        if (dist < minDist) {
          minDist = dist;
          clusterIndex = j;
        }
      }

      const s = sums[clusterIndex];
      const currentCount = counts[clusterIndex];

      // Guard both to satisfy strict indexed access
      if (s && typeof currentCount === "number") {
        s[0] += p[0];
        s[1] += p[1];
        s[2] += p[2];
        counts[clusterIndex] = currentCount + 1;
      }
    }

    // Update Step
    let converged = true;
    for (let j = 0; j < k; j++) {
      const count = counts[j];
      const oldC = centroids[j];
      const sum = sums[j];

      // Logic: If we have points in this cluster, calculate new average
      if (typeof count === "number" && count > 0 && oldC && sum) {
        const newR = Math.round(sum[0] / count);
        const newG = Math.round(sum[1] / count);
        const newB = Math.round(sum[2] / count);

        if (oldC[0] !== newR || oldC[1] !== newG || oldC[2] !== newB) {
          converged = false;
        }

        centroids[j] = [newR, newG, newB];
      }
    }

    if (converged) break;
  }

  return centroids;
}

export function extractColors(img: HTMLImageElement, k = 4): string[] {
  if (typeof window === "undefined" || typeof document === "undefined")
    return [];

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];

  const MAX_SIZE = 100;
  let width = img.naturalWidth;
  let height = img.naturalHeight;

  if (width > MAX_SIZE || height > MAX_SIZE) {
    const ratio = Math.min(MAX_SIZE / width, MAX_SIZE / height);
    width = Math.round(width * ratio);
    height = Math.round(height * ratio);
  }

  canvas.width = width;
  canvas.height = height;
  ctx.drawImage(img, 0, 0, width, height);

  const { data } = ctx.getImageData(0, 0, width, height);
  const points: RGB[] = [];

  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const a = data[i + 3];

    if (
      typeof r === "number" &&
      typeof g === "number" &&
      typeof b === "number" &&
      typeof a === "number" &&
      a >= 128
    ) {
      points.push([r, g, b]);
    }
  }

  return kMeans(points, k).map(([r, g, b]) => `rgb(${r}, ${g}, ${b})`);
}
