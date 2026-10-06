const localApiOrigin = (() => {
  if (typeof window === "undefined") return "";
  if (window.location.protocol === "file:") return "http://localhost:3000";
  if (window.location.port === "8080") {
    return `${window.location.protocol}//${window.location.hostname}:3000`;
  }
  return "";
})();

const apiOrigin = import.meta.env.VITE_API_BASE_URL || localApiOrigin;

export async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiOrigin}${path}`, {
    ...options,
    headers: {
      ...(options.body && !(options.body instanceof FormData)
        ? { "Content-Type": "application/json" }
        : {}),
      ...options.headers,
    },
  });

  const contentType = response.headers.get("content-type") || "";
  const body = contentType.includes("application/json")
    ? await response.json()
    : await response.text();

  if (!response.ok) {
    const message =
      typeof body === "object" && body !== null && "message" in body
        ? body.message
        : `Request failed with status ${response.status}`;
    throw new Error(message);
  }

  return body;
}
