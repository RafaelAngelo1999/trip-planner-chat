import React from "react";
import { Button } from "../button";
import { Monitor, Moon, Sun } from "lucide-react";
import { Label } from "../label";
import { Settings } from "@/hooks/useSettings";

interface ThemeSelectorProps {
  currentTheme: Settings["theme"];
  onThemeChange: (theme: "light" | "dark" | "system") => void;
}

export function ThemeSelector({
  currentTheme,
  onThemeChange,
}: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <Label>Tema</Label>
      <div className="flex gap-2">
        <Button
          variant={currentTheme === "light" ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeChange("light")}
          className="flex items-center gap-2"
        >
          <Sun className="h-4 w-4" />
          Claro
        </Button>
        <Button
          variant={currentTheme === "dark" ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeChange("dark")}
          className="flex items-center gap-2"
        >
          <Moon className="h-4 w-4" />
          Escuro
        </Button>
        <Button
          variant={currentTheme === "system" ? "default" : "outline"}
          size="sm"
          onClick={() => onThemeChange("system")}
          className="flex items-center gap-2"
        >
          <Monitor className="h-4 w-4" />
          Sistema
        </Button>
      </div>
    </div>
  );
}
