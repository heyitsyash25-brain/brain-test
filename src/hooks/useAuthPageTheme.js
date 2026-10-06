import { useEffect, useState } from "react";

export function useAuthPageTheme(pageClass) {
  const [theme, setTheme] = useState(() => localStorage.getItem("qb_theme") || "dark");

  useEffect(() => {
    document.body.classList.add("auth-page", pageClass);
    document.body.classList.toggle("theme-dark", theme === "dark");
    localStorage.setItem("qb_theme", theme);

    return () => document.body.classList.remove("auth-page", pageClass, "theme-dark");
  }, [theme, pageClass]);

  return {
    theme,
    toggleTheme: () => setTheme((current) => (current === "light" ? "dark" : "light")),
  };
}
