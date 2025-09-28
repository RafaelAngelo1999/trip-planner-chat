import React, { useState } from "react";
import { Button } from "./button";
import { Label } from "./label";
import { Switch } from "./switch";
import { LANGUAGE_OPTIONS, SupportedLanguage } from "@/lib/language";
import { X, Settings as SettingsIcon, Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Settings } from "@/hooks/useSettings";

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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-background mx-4 max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl border shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b p-6">
          <div className="flex items-center gap-3">
            <SettingsIcon className="h-6 w-6" />
            <h2 className="text-xl font-semibold">Configurações</h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="space-y-8 p-6">
          {/* Interface Settings */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              🎨 Interface
            </h3>
            <div className="grid gap-4">
              <div className="space-y-2">
                <Label htmlFor="language">Idioma</Label>
                <select
                  id="language"
                  value={settings.language}
                  onChange={(e) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      language: e.target.value as SupportedLanguage,
                    }))
                  }
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

              <div className="space-y-3">
                <Label>Tema</Label>
                <div className="flex gap-2">
                  <Button
                    variant={settings.theme === "light" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("light")}
                    className="flex items-center gap-2"
                  >
                    <Sun className="h-4 w-4" />
                    Claro
                  </Button>
                  <Button
                    variant={settings.theme === "dark" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleThemeChange("dark")}
                    className="flex items-center gap-2"
                  >
                    <Moon className="h-4 w-4" />
                    Escuro
                  </Button>
                  <Button
                    variant={
                      settings.theme === "system" ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handleThemeChange("system")}
                    className="flex items-center gap-2"
                  >
                    <Monitor className="h-4 w-4" />
                    Sistema
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Chat Settings */}
          <div className="space-y-4">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              💬 Chat
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>🔧 Ocultar Tool Calls</Label>
                  <p className="text-muted-foreground text-sm">
                    Esconde as chamadas de ferramentas nas mensagens
                  </p>
                </div>
                <Switch
                  checked={settings.hideToolCalls}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      hideToolCalls: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>📜 Auto-scroll</Label>
                  <p className="text-muted-foreground text-sm">
                    Rola automaticamente para novas mensagens do chat
                  </p>
                </div>
                <Switch
                  checked={settings.autoScroll}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      autoScroll: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>🔔 Sons de notificação</Label>
                  <p className="text-muted-foreground text-sm">
                    Reproduz som quando recebe respostas do assistente
                  </p>
                </div>
                <Switch
                  checked={settings.enableSounds}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      enableSounds: checked,
                    }))
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>📚 Mostrar Histórico de Conversas</Label>
                  <p className="text-muted-foreground text-sm">
                    Exibe o painel lateral com o histórico de threads
                  </p>
                </div>
                <Switch
                  checked={settings.showThreadHistory}
                  onCheckedChange={(checked) =>
                    setSettings((prev: Settings) => ({
                      ...prev,
                      showThreadHistory: checked,
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-muted/20 flex items-center justify-end gap-3 border-t p-6">
          <Button
            variant="outline"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button onClick={handleSave}>Salvar Configurações</Button>
        </div>
      </div>
    </div>
  );
}
