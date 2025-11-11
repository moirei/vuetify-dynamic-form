import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
      include: ["src/**/*", "runtime/**/*"],
      exclude: ["node_modules", "dist", "nuxt/**/*"],
    }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "VuetifyDynamicForm",
      formats: ["es", "cjs"],
      fileName: (format) => `index.${format === "es" ? "mjs" : "cjs"}`,
    },
    rollupOptions: {
      external: [
        "vue",
        "vuetify",
        "vee-validate",
        "defu",
        "@nuxt/kit",
        /^@nuxt/,
        /^nuxt/,
      ],
      output: {
        exports: "named",
        globals: {
          vue: "Vue",
          vuetify: "Vuetify",
          "vee-validate": "VeeValidate",
          defu: "defu",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"),
      "~": resolve(__dirname, "./runtime"),
    },
  },
});
