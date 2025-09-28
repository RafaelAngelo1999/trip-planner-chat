import React from "react";
import { Button } from "../button";

interface SettingsModalFooterProps {
  onCancel: () => void;
  onSave: () => void;
}

export function SettingsModalFooter({
  onCancel,
  onSave,
}: SettingsModalFooterProps) {
  return (
    <div className="bg-muted/20 flex items-center justify-end gap-3 border-t p-6">
      <Button
        variant="outline"
        onClick={onCancel}
      >
        Cancelar
      </Button>
      <Button onClick={onSave}>Salvar Configurações</Button>
    </div>
  );
}
