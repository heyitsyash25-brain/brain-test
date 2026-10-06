import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useSmoothScroll } from "./SmoothScrollProvider.jsx";
import logo from "../assets/images/quinfosys-logo-transparent.png";

const menus = [
  {
    label: "Developers",
    links: [
      ["Quantum AI Code", "#features"],
      ["Quantum AI Platform", "#features"],
      ["Scientific Work", "#solutions"],
    ],
  },
  {
    label: "Enterprise",
    links: [
      ["Target Users", "#target-users"],
      ["Enterprise Solutions", "#enterprise"],
    ],
  },
  {
    label: "Resources",
    links: [
      ["Use Cases", "#use-cases"],
      ["Docs", "#use-cases"],
      ["Papers", "#use-cases"],
      ["APIs", "#use-cases"],
    ],
  },
];

function SectionLink({ href, children, onNavigate, scrollTo, className = "", onClick }) {
  return (
    <a
      href={href}
      className={className}
      onClick={(event) => {
        if (href.startsWith("#")) {
          const scrollToSection = () => {
            const target = document.querySelector(href);
            if (target) scrollTo(target);
          };

          if (window.location.pathname !== "/") {
            event.preventDefault();
            onNavigate("/");
            window.setTimeout(scrollToSection, 0);
          } else if (document.querySelector(href)) {
            event.preventDefault();
            scrollToSection();
          }
        }
        onClick?.(event);
      }}
    >
      {children}
    </a>
  );
}

export function Navbar() {
  const navigate = useNavigate();
  const scrollTo = useSmoothScroll();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  const closeMobileMenu = () => setMobileOpen(false);
  const linkClass = "hover:text-zinc-950 transition-colors";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Quinfosys Quantum Brain home">
          <img src={logo} alt="Quinfosys" className="h-9 w-auto object-contain" />
        </Link>

        <nav className="hidden items-center gap-4 text-xs font-medium text-zinc-600 md:flex sm:text-sm">
          <SectionLink href="#features" onNavigate={navigate} scrollTo={scrollTo} className={linkClass}>Quantum AI</SectionLink>
          {menus.map((menu) => (
            <div key={menu.label} className="group relative">
              <button type="button" className={`flex items-center gap-1 ${linkClass}`}>
                {menu.label}
                <svg className="h-3.5 w-3.5 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>
              <div className="invisible absolute left-0 top-full z-50 mt-3 w-56 rounded-xl border border-zinc-200 bg-white p-2 opacity-0 shadow-xl transition-all group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                {menu.links.map(([label, href]) => (
                  <SectionLink key={label} href={href} onNavigate={navigate} scrollTo={scrollTo} className="block rounded-lg px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-100 hover:text-zinc-950">
                    {label}
                  </SectionLink>
                ))}
              </div>
            </div>
          ))}
          <SectionLink href="#pricing" onNavigate={navigate} scrollTo={scrollTo} className={linkClass}>Pricing</SectionLink>
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="text-xs font-medium text-zinc-700 hover:text-zinc-950 sm:text-sm">
                {user?.name || "Dashboard"}
              </Link>
              <button type="button" onClick={() => { logout(); navigate("/"); }} className="rounded-full bg-zinc-100 px-4 py-2 text-xs font-semibold text-zinc-700 hover:bg-zinc-200">
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/signin" className="px-3 py-2 text-xs font-medium text-zinc-700 hover:text-zinc-950 sm:text-sm">Sign In</Link>
              <Link to="/signup" className="flex items-center gap-1.5 rounded-full bg-[#1677d2] px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-[#1266b4]">
                Get Started
                <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14m-7-7 7 7-7 7" /></svg>
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-zinc-600 hover:bg-zinc-100 hover:text-zinc-950 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((open) => !open)}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? <path d="m6 6 12 12M18 6 6 18" /> : <><path d="M3 6h18M3 12h18M3 18h18" /></>}
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <nav className="space-y-3 border-t border-black/10 bg-white px-4 py-4 md:hidden" aria-label="Mobile navigation">
          <SectionLink href="#features" onNavigate={navigate} scrollTo={scrollTo} className="block text-sm text-zinc-700" onClick={closeMobileMenu}>Quantum AI</SectionLink>
          {menus.map((menu) => (
            <details key={menu.label} className="group">
              <summary className="flex cursor-pointer list-none items-center justify-between text-sm text-zinc-700">
                {menu.label}<span className="transition-transform group-open:rotate-180">⌄</span>
              </summary>
              <div className="mt-2 ml-3 space-y-2 border-l border-zinc-200 pl-3">
                {menu.links.map(([label, href]) => (
                  <SectionLink key={label} href={href} onNavigate={navigate} scrollTo={scrollTo} className="block text-sm text-zinc-600" onClick={closeMobileMenu}>
                    {label}
                  </SectionLink>
                ))}
              </div>
            </details>
          ))}
          <SectionLink href="#pricing" onNavigate={navigate} scrollTo={scrollTo} className="block text-sm text-zinc-700">Pricing</SectionLink>
          <div className="flex gap-3 border-t border-black/10 pt-3">
            {isAuthenticated ? (
              <Link to="/dashboard" onClick={closeMobileMenu} className="flex-1 rounded-lg bg-zinc-100 py-2 text-center text-sm font-semibold text-zinc-800">Dashboard</Link>
            ) : (
              <>
                <Link to="/signin" onClick={closeMobileMenu} className="flex-1 rounded-lg bg-zinc-100 py-2 text-center text-sm font-semibold text-zinc-800">Sign In</Link>
                <Link to="/signup" onClick={closeMobileMenu} className="flex-1 rounded-lg bg-[#1677d2] py-2 text-center text-sm font-semibold text-white">Get Started</Link>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}
