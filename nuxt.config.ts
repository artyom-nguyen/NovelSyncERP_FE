// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  css: ["~/assets/styles/main.css"],

  app: {
    head: {
      link: [
        {
          rel: "stylesheet",
          href: "/vendor/bootstrap.min.css",
        },
        {
          rel: "stylesheet",
          href: "/vendor/swiper.min.css",
        },
      ],
      script: [
        {
          src: "/vendor/jquery-3.4.1.min.js",
          tagPosition: "bodyClose",
        },
        {
          src: "/vendor/bootstrap.min.js",
          tagPosition: "bodyClose",
        },
        {
          src: "/vendor/swiper.min.js",
          tagPosition: "bodyClose",
        },
        {
          src: "/vendor/library.js",
          tagPosition: "bodyClose",
        },
      ],
    },
  },
  vite: {
    server: {
      proxy: {
        "/proxy-ws": {
          target: "http://localhost:8080",
          changeOrigin: true,
          ws: true,
          rewrite: (path) => path.replace(/^\/proxy-ws/, ""),
        },
      },
    },
  },
  modules: ["@nuxt/fonts"],
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || "",
    },
  },
});

