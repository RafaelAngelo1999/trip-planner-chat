import { useState, useEffect } from "react";
import {
  SupportedLanguage,
  getStoredLanguage,
  setStoredLanguage,
} from "@/lib/language";

export interface Settings {
  language: SupportedLanguage;
  hideToolCalls: boolean;
  theme: "light" | "dark" | "system";
  autoScroll: boolean;
  enableSounds: boolean;
  showThreadHistory: boolean;
}

const DEFAULT_SETTINGS: Settings = {
  language: "pt-BR",
  hideToolCalls: false,
  theme: "system",
  autoScroll: true,
  enableSounds: false,
  showThreadHistory: true,
};

export function useSettings() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadedSettings: Settings = {
      language: getStoredLanguage(),
      hideToolCalls:
        localStorage.getItem("lg:settings:hideToolCalls") === "true",
      theme:
        (localStorage.getItem("lg:settings:theme") as Settings["theme"]) ||
        "system",
      autoScroll: localStorage.getItem("lg:settings:autoScroll") !== "false",
      enableSounds: localStorage.getItem("lg:settings:enableSounds") === "true",
      showThreadHistory:
        localStorage.getItem("lg:settings:showThreadHistory") !== "false",
    };

    setSettings(loadedSettings);
    setIsLoaded(true);
  }, []);

  const updateSettings = (newSettings: Partial<Settings>) => {
    if (typeof window === "undefined") return;

    const updatedSettings = { ...settings, ...newSettings };

    // Save to localStorage
    if (newSettings.language !== undefined) {
      setStoredLanguage(newSettings.language);
    }
    if (newSettings.hideToolCalls !== undefined) {
      localStorage.setItem(
        "lg:settings:hideToolCalls",
        newSettings.hideToolCalls.toString(),
      );
    }
    if (newSettings.theme !== undefined) {
      localStorage.setItem("lg:settings:theme", newSettings.theme);
    }
    if (newSettings.autoScroll !== undefined) {
      localStorage.setItem(
        "lg:settings:autoScroll",
        newSettings.autoScroll.toString(),
      );
    }
    if (newSettings.enableSounds !== undefined) {
      localStorage.setItem(
        "lg:settings:enableSounds",
        newSettings.enableSounds.toString(),
      );
    }
    if (newSettings.showThreadHistory !== undefined) {
      localStorage.setItem(
        "lg:settings:showThreadHistory",
        newSettings.showThreadHistory.toString(),
      );
    }

    setSettings(updatedSettings);
  };

  const resetSettings = () => {
    if (typeof window === "undefined") return;

    // Clear localStorage
    Object.keys(localStorage)
      .filter((key) => key.startsWith("lg:settings:"))
      .forEach((key) => localStorage.removeItem(key));

    setSettings(DEFAULT_SETTINGS);
  };

  return {
    settings,
    updateSettings,
    resetSettings,
    isLoaded,
  };
}
