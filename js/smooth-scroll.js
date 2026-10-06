import Lenis from "../node_modules/lenis/dist/lenis.mjs";

export function createSmoothScroller() {
  return new Lenis({
    autoRaf: true,
    lerp: 0.14,
    smoothWheel: true,
    syncTouch: false,
    respectReducedMotion: true,
  });
}
