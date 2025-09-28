import React from "react";
import { Label } from "../label";
import { LANGUAGE_OPTIONS, SupportedLanguage } from "@/lib/language";

interface ModalLanguageSelectorProps {
  currentLanguage: SupportedLanguage;
  onLanguageChange: (language: SupportedLanguage) => void;
}

export function ModalLanguageSelector({
  currentLanguage,
  onLanguageChange,
}: ModalLanguageSelectorProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="language">Idioma</Label>
      <select
        id="language"
        value={currentLanguage}
        onChange={(e) => onLanguageChange(e.target.value as SupportedLanguage)}
        className="bg-background border-input ring-offset-background text-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
      >
        {LANGUAGE_OPTIONS.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
