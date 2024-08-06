/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HOLIDAY_API_KEY: string;
  readonly VITE_HOLIDAY_API_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
