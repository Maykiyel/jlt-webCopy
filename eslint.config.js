import js from "@eslint/js";
import globals from "globals";
import importPlugin from "eslint-plugin-import";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/no-restricted-paths": [
        "error",
        {
          zones: [
            // Cross-feature boundaries
            {
              target: "./src/features/account-settings",
              from: "./src/features",
              except: ["./account-settings"],
            },
            {
              target: "./src/features/auth",
              from: "./src/features",
              except: ["./auth"],
            },
            {
              target: "./src/features/dashboard",
              from: "./src/features",
              except: ["./dashboard"],
            },
            {
              target: "./src/features/quotations",
              from: "./src/features",
              except: ["./quotations"],
            },

            // Unidirectional flow
            {
              target: "./src/features",
              from: "./src/app",
            },
            {
              target: [
                "./src/components",
                "./src/hooks",
                "./src/lib",
                "./src/stores",
                "./src/types",
                "./src/utils",
              ],
              from: ["./src/features", "./src/app"],
            },
          ],
        },
      ],
    },
  },
]);
