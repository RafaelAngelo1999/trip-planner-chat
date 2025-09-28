// Common types used across the application

export interface Settings {
  autoScroll: boolean;
  enableSounds: boolean;
  hideToolCalls: boolean;
  showThreadHistory: boolean;
}

export type SupportedLanguage = "pt" | "en" | "es" | "fr" | "de";

// UI Component Props
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface ButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default" | "lg";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
}

// Thread and Message types
export interface ThreadMetadata {
  firstSeenState?: {
    parent_checkpoint?: any;
  };
}

export interface MessageContent {
  type: string;
  text?: string;
  [key: string]: any;
}
