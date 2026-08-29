import js from "@eslint/js"
import globals from "globals"
import tseslint from "typescript-eslint"
import { defineConfig } from "eslint/config"
import { config as baseConfig } from "@bchat/eslint-config/base"

export default defineConfig([
    ...baseConfig,
    {
        files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
        plugins: { js },
        extends: ["js/recommended"],
        languageOptions: { globals: globals.node },
    },
    tseslint.configs.recommended,
])
