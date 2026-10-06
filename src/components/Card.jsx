export function Card({ as: Element = "div", className = "", children, ...props }) {
  return (
    <Element className={`bg-card-glass rounded-2xl border border-white/10 ${className}`} {...props}>
      {children}
    </Element>
  );
}
