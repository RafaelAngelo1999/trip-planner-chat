import React from "react";
import { Button } from "../button";
import { X, Settings as SettingsIcon } from "lucide-react";

interface SettingsModalHeaderProps {
  onClose: () => void;
}

export function SettingsModalHeader({ onClose }: SettingsModalHeaderProps) {
  return (
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
  );
}
