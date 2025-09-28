// Language support configuration
export type SupportedLanguage = "pt-BR" | "en";

export const LANGUAGE_OPTIONS: { value: SupportedLanguage; label: string }[] = [
  { value: "pt-BR", label: "Português (Brasil)" },
  { value: "en", label: "English" },
];

// Language management functions
export function getStoredLanguage(): SupportedLanguage {
  if (typeof window === "undefined") return "pt-BR";
  const stored = window.localStorage.getItem("lg:chat:language");
  if (stored && LANGUAGE_OPTIONS.find((lang) => lang.value === stored)) {
    return stored as SupportedLanguage;
  }
  return "pt-BR";
}

export function setStoredLanguage(language: SupportedLanguage) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem("lg:chat:language", language);
  }
}
