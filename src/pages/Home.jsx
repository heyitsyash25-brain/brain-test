import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SmoothScrollProvider, useSmoothScroll } from "../components/SmoothScrollProvider.jsx";
import { MainLayout } from "../layouts/MainLayout.jsx";
import { HomeContent } from "./HomeContent.jsx";

function HomePage() {
  const navigate = useNavigate();
  const scrollTo = useSmoothScroll();

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "Quinfosys™ Quantum AI";
    return () => {
      document.title = previousTitle;
    };
  }, []);

  function handleClick(event) {
    if (!(event.target instanceof Element)) return;

    const action = event.target.closest(
      '#btn-hero-getstarted, #btn-cta-getstarted, #btn-hero-explore, #btn-cta-demo, [data-action="enterprise-signup"]',
    );
    if (action) {
      if (action.id === "btn-hero-explore") {
        const features = document.getElementById("features");
        if (features) scrollTo(features);
        return;
      }
      event.preventDefault();
      const destination = action.matches('[data-action="enterprise-signup"]')
        ? "/signin"
        : "/signup";
      navigate(destination);
      return;
    }

    const link = event.target.closest("a");
    if (!link) return;
    const destination = new URL(link.href, window.location.href);
    if (
      destination.origin === window.location.origin &&
      ["/signin", "/signup", "/signin.html", "/signup.html"].includes(destination.pathname)
    ) {
      const text = link.textContent.trim().toLowerCase();
      const target = destination.pathname === "/signup" || destination.pathname === "/signup.html" ||
        text.includes("get started") || text.includes("trial")
        ? "/signup"
        : "/signin";
      event.preventDefault();
      navigate(target);
    }
  }

  return (
    <MainLayout>
      <HomeContent onClick={handleClick} />
    </MainLayout>
  );
}

export function Home() {
  return (
    <SmoothScrollProvider>
      <HomePage />
    </SmoothScrollProvider>
  );
}
