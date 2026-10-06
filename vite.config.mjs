import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

function routerFallbackMiddleware() {
  return (request, _response, next) => {
    const [pathname, query] = (request.url || "").split("?", 2);
    if (pathname === "/signin" || pathname === "/signup") {
      request.url = query ? `/?${query}` : "/";
    }
    next();
  };
}

const apiProxy = {
  "/api": {
    target: "http://localhost:3000",
    changeOrigin: true
  }
};

export default defineConfig({
  plugins: [
    {
      name: "quantum-brain-router-fallback",
      configureServer(server) {
        server.middlewares.use(routerFallbackMiddleware());
      },
      configurePreviewServer(server) {
        server.middlewares.use(routerFallbackMiddleware());
      }
    }
  ],
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, "index.html"),
        forgotPassword: resolve(root, "forgot-password.html")
      }
    }
  },
  server: {
    port: 5500,
    proxy: apiProxy,
    watch: {
      ignored: ["**/*.zip"]
    }
  },
  preview: {
    port: 5500,
    proxy: apiProxy
  }
});