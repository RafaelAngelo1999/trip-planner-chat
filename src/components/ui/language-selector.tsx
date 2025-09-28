import React from "react";
import { LANGUAGE_OPTIONS, SupportedLanguage } from "@/lib/language";
import { useStreamContext } from "@/hooks/useStreamContext";

interface LanguageSelectorProps {
  className?: string;
}

export function LanguageSelector({ className = "" }: LanguageSelectorProps) {
  const { language, setLanguage } = useStreamContext();

  const handleLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = event.target.value as SupportedLanguage;
    setLanguage(newLanguage);
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <label htmlFor="language-selector" className="text-sm font-medium">
        Idioma:
      </label>
      <select
        id="language-selector"
        value={language}
        onChange={handleLanguageChange}
        className="bg-background border-input ring-offset-background text-foreground focus-visible:ring-ring flex h-8 rounded-md border px-2 py-1 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}