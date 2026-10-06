export function Button({
  as: Element = "button",
  children,
  className = "",
  type = "button",
  ...props
}) {
  return (
    <Element className={className} type={Element === "button" ? type : undefined} {...props}>
      {children}
    </Element>
  );
}
