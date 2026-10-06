export function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function formatError(error, fallback = "Something went wrong.") {
  return error instanceof Error ? error.message : fallback;
}
