# UI Components Structure

A estrutura dos componentes UI foi refatorada para melhor organização e modularidade.

## Nova Estrutura

```
src/components/ui/
├── index.ts                     # Exports centralizados
├── avatar/index.tsx
├── button/index.tsx
├── card/index.tsx
├── input/index.tsx
├── label/index.tsx
├── password-input/index.tsx
├── separator/index.tsx
├── sheet/index.tsx
├── skeleton/index.tsx
├── sonner/index.tsx
├── switch/index.tsx
├── textarea/index.tsx
├── tooltip/index.tsx
├── language-selector/
│   ├── index.ts
│   └── LanguageSelector.tsx
└── settings-modal/
    ├── index.ts
    ├── SettingsModal.tsx
    ├── SettingsModalHeader.tsx
    ├── ThemeSelector.tsx
    ├── LanguageSelector.tsx
    ├── ChatSettings.tsx
    └── SettingsModalFooter.tsx
```

## Como Usar

### Importação Simples (Recomendado)

```tsx
import { Button, Avatar, SettingsModal } from "@/components/ui";
```

### Importação Específica

```tsx
import { Button } from "@/components/ui/button";
import { SettingsModal } from "@/components/ui/settings-modal";
```

### Importação de Subcomponentes

```tsx
import {
  SettingsModal,
  ThemeSelector,
  ChatSettings,
} from "@/components/ui/settings-modal";
```

## Benefícios

1. **Modularidade**: Cada componente tem sua própria pasta
2. **Subcomponentes**: Componentes complexos são divididos em partes menores
3. **Exports Centralizados**: Importação simplificada através do index.ts
4. **Manutenibilidade**: Código mais organizado e fácil de manter
5. **Reutilização**: Subcomponentes podem ser usados independentemente

## Componentes Refatorados

- **SettingsModal**: Dividido em 5 subcomponentes
  - SettingsModalHeader
  - ThemeSelector
  - LanguageSelector
  - ChatSettings
  - SettingsModalFooter
