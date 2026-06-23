/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_DEFAULT_ORGANIZATION_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.css'
declare module 'react-day-picker/style.css'
