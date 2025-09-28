import React from "react";
import { Label } from "../label";
import { Switch } from "../switch";
import { Settings } from "@/hooks/useSettings";

interface SettingItemProps {
  label: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}

function SettingItem({
  label,
  description,
  checked,
  onCheckedChange,
}: SettingItemProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
      />
    </div>
  );
}

interface ChatSettingsProps {
  settings: Settings;
  onSettingsChange: React.Dispatch<React.SetStateAction<Settings>>;
}

export function ChatSettings({
  settings,
  onSettingsChange,
}: ChatSettingsProps) {
  const updateSetting = <K extends keyof Settings>(
    key: K,
    value: Settings[K],
  ) => {
    onSettingsChange((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <h3 className="flex items-center gap-2 text-lg font-medium">💬 Chat</h3>
      <div className="space-y-4">
        <SettingItem
          label="🔧 Ocultar Tool Calls"
          description="Esconde as chamadas de ferramentas nas mensagens"
          checked={settings.hideToolCalls}
          onCheckedChange={(checked) => updateSetting("hideToolCalls", checked)}
        />

        <SettingItem
          label="📜 Auto-scroll"
          description="Rola automaticamente para novas mensagens do chat"
          checked={settings.autoScroll}
          onCheckedChange={(checked) => updateSetting("autoScroll", checked)}
        />

        <SettingItem
          label="🔔 Sons de notificação"
          description="Reproduz som quando recebe respostas do assistente"
          checked={settings.enableSounds}
          onCheckedChange={(checked) => updateSetting("enableSounds", checked)}
        />

        <SettingItem
          label="📚 Mostrar Histórico de Conversas"
          description="Exibe o painel lateral com o histórico de threads"
          checked={settings.showThreadHistory}
          onCheckedChange={(checked) =>
            updateSetting("showThreadHistory", checked)
          }
        />
      </div>
    </div>
  );
}
