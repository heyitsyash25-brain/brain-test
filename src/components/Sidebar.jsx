import { NavLink } from "react-router-dom";

const links = [
  { href: "/dashboard#dashboard-subview", label: "Research dashboard" },
  { href: "/dashboard#projects-grid", label: "Current investigations" },
];

export function Sidebar() {
  return (
    <aside className="w-full border-b border-white/10 bg-[#080808] p-4 text-sm text-zinc-300 lg:w-64 lg:border-b-0 lg:border-r">
      <nav aria-label="Dashboard navigation" className="flex gap-3 lg:flex-col">
        {links.map(({ href, label }) => (
          <NavLink
            key={href}
            to={href}
            className="rounded-lg px-3 py-2 transition-colors hover:bg-white/10 hover:text-white"
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
