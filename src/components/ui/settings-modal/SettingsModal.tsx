import React, { useState } from "react";
import { useTheme } from "next-themes";
import { Settings } from "@/hooks/useSettings";
import { SupportedLanguage } from "@/lib/language";

import { SettingsModalHeader } from "./SettingsModalHeader";
import { ModalLanguageSelector } from "./ModalLanguageSelector";
import { ThemeSelector } from "./ThemeSelector";
import { ChatSettings } from "./ChatSettings";
import { SettingsModalFooter } from "./SettingsModalFooter";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  currentSettings: Settings;
}

export function SettingsModal({
  isOpen,
  onClose,
  onSave,
  currentSettings,
}: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(currentSettings);
  const { setTheme } = useTheme();

  if (!isOpen) return null;

  const handleSave = () => {
    onSave(settings);
    onClose();
  };

  const handleThemeChange = (newTheme: "light" | "dark" | "system") => {
    setSettings((prev: Settings) => ({ ...prev, theme: newTheme }));
    setTheme(newTheme);
  };

  const handleLanguageChange = (language: SupportedLanguage) => {
    setSettings((prev: Settings) => ({ ...prev, language }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border shadow-2xl">
        <SettingsModalHeader onClose={onClose} />

        {/* Content */}
        <div className="space-y-8 p-6">
          {/* Interface Settings */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              🎨 Interface
            </h3>
            <div className="grid gap-4">
              <ModalLanguageSelector
                currentLanguage={settings.language}
                onLanguageChange={handleLanguageChange}
              />
              <ThemeSelector
                currentTheme={settings.theme}
                onThemeChange={handleThemeChange}
              />
            </div>
          </div>

          <ChatSettings
            settings={settings}
            onSettingsChange={setSettings}
          />
        </div>

        <SettingsModalFooter
          onCancel={onClose}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
