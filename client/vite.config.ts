/// <reference types="vitest/config" />
import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), tailwindcss()],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    },
    server: {
        proxy: {
            "/api": {
                target: "http://localhost:3000",
                changeOrigin: true,
            },
        },
    },
    test: {
        environment: "jsdom",
        include: ["src/**/*.{test,spec}.?(c|m)[jt]s?(x)"],
        globals: true,
        setupFiles: ["./src/test/setup.ts"],
    },
    esbuild: {
        drop: ["debugger"],
        pure: ["console.log", "console.debug", "console.info"],
    },
})
