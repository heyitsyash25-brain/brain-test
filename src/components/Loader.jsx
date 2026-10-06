import { useEffect } from "react";

/**
 * Pure Solid White Lottie Page & Component Loader
 * Lottie Animation URL: https://lottiefiles.com/free-animation/loading-WEOp0qe5kL
 * Implementation Guidelines:
 * 1. Color styling: Rendered strictly in solid white (#FFFFFF) via brightness-0 invert tint override filter.
 * 2. Sizing: Scaled to standard loader dimensions around 48px–64px (default 60px), centered in container/viewport.
 * 3. Scope: Applied to all global and page-level loading states.
 * 4. Preservations: Surrounding layout, text, and formatting preserved without modification.
 */
export function Loader({ label = "Loading page...", fullScreen = true, size = 60 }) {
  useEffect(() => {
    if (!document.getElementById("lottie-player-script")) {
      const script = document.createElement("script");
      script.id = "lottie-player-script";
      script.src = "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      document.head.appendChild(script);
    }
  }, []);

  const containerClasses = fullScreen
    ? "fixed inset-0 z-[9999] bg-[#050505]/95 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center"
    : "flex flex-col items-center justify-center p-8 text-center w-full min-h-[200px]";

  const dimPx = typeof size === "number" ? `${size}px` : size;

  return (
    <div role="status" aria-live="polite" className={containerClasses}>
      <div 
        className="relative flex items-center justify-center shrink-0" 
        style={{ width: dimPx, height: dimPx, maxWidth: "64px", maxHeight: "64px" }}
      >
        {/* Soft glowing aura behind loader */}
        <div className="absolute inset-0 rounded-full bg-white/10 blur-lg animate-pulse" />

        {/* Lottie Player formatted strictly in Pure White (#FFFFFF) */}
        <div className="relative w-full h-full flex items-center justify-center filter brightness-0 invert drop-shadow-[0_0_12px_rgba(255,255,255,0.85)]">
          <lottie-player
            src="/loading-lottie.json"
            background="transparent"
            speed="1"
            style={{ width: "100%", height: "100%" }}
            loop
            autoplay
          />
        </div>
      </div>

      {/* Loading Label in White */}
      {label && (
        <div className="mt-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-white animate-ping" />
          <span className="text-xs font-semibold tracking-wider text-white font-mono uppercase">
            {label}
          </span>
        </div>
      )}
    </div>
  );
}


