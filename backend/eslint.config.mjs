import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] }, // Aplica a todos os arquivos JS/TS
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } }, // Define CommonJS para arquivos .js
  { languageOptions: { globals: globals.node } }, // Habilita variáveis globais do Node.js
  pluginJs.configs.recommended, // Configurações recomendadas do ESLint
  ...tseslint.configs.recommended, // Configurações recomendadas do TypeScript
];
