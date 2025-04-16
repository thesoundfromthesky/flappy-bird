/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_BASE_HREF: string;
  readonly VITE_DETERMINISTIC_LOCK_STEP: boolean;
  readonly VITE_AUTO_BIND: boolean;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
