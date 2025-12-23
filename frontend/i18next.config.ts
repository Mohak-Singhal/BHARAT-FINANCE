import { defineConfig } from 'i18next-cli';

export default defineConfig({
  locales: [
    "en",
    "as",
    "bn",
    "gu",
    "hi",
    "kn",
    "ml",
    "mr",
    "or",
    "pa",
    "ta",
    "te"
  ],
  extract: {
    input: "src/**/*.{js,jsx,ts,tsx}",
    output: "public/locales/{{language}}/{{namespace}}.json"
  }
});