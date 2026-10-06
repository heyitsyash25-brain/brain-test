export function SearchBar({ value, onChange, placeholder = "Search", ...props }) {
  return (
    <label className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-zinc-300">
      <span aria-hidden="true">⌕</span>
      <input
        {...props}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-500"
      />
    </label>
  );
}
