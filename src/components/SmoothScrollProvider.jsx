import { createContext, useCallback, useContext, useEffect, useRef } from "react";
import { createSmoothScroller } from "../../js/smooth-scroll.js";

const SmoothScrollContext = createContext(null);

export function SmoothScrollProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    const lenis = createSmoothScroller();
    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  const scrollTo = useCallback((target, options = {}) => {
    const lenis = lenisRef.current;
    if (lenis) {
      lenis.scrollTo(target, { offset: -80, ...options });
      return;
    }

    if (target instanceof HTMLElement) {
      target.scrollIntoView({ behavior: "auto", block: "start" });
    }
  }, []);

  return (
    <SmoothScrollContext.Provider value={scrollTo}>
      {children}
    </SmoothScrollContext.Provider>
  );
}

export function useSmoothScroll() {
  const scrollTo = useContext(SmoothScrollContext);
  if (!scrollTo) {
    return (target) => {
      if (typeof target === "string") {
        const el = document.querySelector(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      } else if (target instanceof HTMLElement) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
  }
  return scrollTo;
}

