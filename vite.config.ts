import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: "/src/engine/EntryPoint.ts",
      },
    },
  },
});
