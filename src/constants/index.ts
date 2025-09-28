// Application constants

export const SUPPORTED_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/gif",
  "image/webp",
  "application/pdf",
] as const;

export const DEFAULT_SETTINGS = {
  autoScroll: true,
  enableSounds: true,
  hideToolCalls: false,
  showThreadHistory: true,
} as const;

export const SUPPORTED_LANGUAGES = ["pt", "en", "es", "fr", "de"] as const;

export const DO_NOT_RENDER_ID_PREFIX = "do-not-render:";

// Theme constants
export const THEMES = ["light", "dark", "system"] as const;

// API constants
export const DEFAULT_PORT = 3001;
export const DEFAULT_API_TIMEOUT = 30000;
