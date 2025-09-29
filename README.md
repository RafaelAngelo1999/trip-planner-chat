# 🧳 Trip Planner Chat - Assistente de Viagens com IA

**Trip Planner Chat** é uma aplicação Next.js avançada que oferece um assistente inteligente para planejamento de viagens. Utilizando tecnologia LangGraph e inteligência artificial, o sistema fornece recomendações personalizadas para voos, hotéis e roteiros de viagem através de uma interface de chat moderna e intuitiva.

## ✨ Características Principais

- 🤖 **Agentes Especializados**: Agentes dedicados para busca de voos e reserva de hotéis
- 🎨 **Interface Moderna**: Design responsivo com tema claro/escuro
- 💬 **Chat Inteligente**: Conversação natural com streaming de respostas em tempo real
- 🔄 **Auto-scroll**: Rolagem automática para acompanhar as mensagens
- 📱 **Responsivo**: Funciona perfeitamente em desktop, tablet e mobile
- 🌐 **Multilíngue**: Suporte para múltiplos idiomas
- 🎯 **UX Otimizada**: Dicas visuais de teclado e feedback imediato
- 📊 **Histórico**: Manutenção de conversas anteriores
- 🔧 **Configurável**: Configurações personalizáveis para cada usuário

## 🚀 Configuração e Instalação

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- **Node.js** (versão 18.x ou superior)
- **pnpm** (gerenciador de pacotes recomendado)
- **Git** para clonagem do repositório

### 📥 Clonagem e Instalação

1. **Clone o repositório:**

```bash
git clone https://github.com/RafaelAngelo1999/trip-planner-chat.git
cd trip-planner-chat
```

2. **Instale as dependências:**

```bash
pnpm install
```

3. **Configure as variáveis de ambiente:**

```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações específicas.

4. **Execute o projeto em modo de desenvolvimento:**

```bash
pnpm dev
```

5. **Acesse a aplicação:**
   Abra seu navegador em `http://localhost:3000`

### 🛠️ Scripts Disponíveis

```bash
# Desenvolvimento
pnpm dev          # Executa em modo desenvolvimento com hot-reload

# Produção
pnpm build        # Gera build otimizado para produção
pnpm start        # Executa a aplicação em modo produção

# Qualidade de Código
pnpm lint         # Executa ESLint para análise de código
pnpm type-check   # Verifica tipos TypeScript

# Testes
pnpm test         # Executa suíte de testes
pnpm test:watch   # Executa testes em modo watch
```

## 📖 Como Usar

### Interface Inicial

Ao acessar a aplicação, você será apresentado à tela de boas-vindas com dois agentes especializados:

1. **🛫 Agente de Voos**: Especializado em busca e comparação de passagens aéreas
2. **🏨 Agente de Hotéis**: Focado em reservas e recomendações de hospedagem

### Interação com o Chat

**Métodos de Entrada:**

- Clique em um dos cards dos agentes para começar com exemplos pré-definidos
- Digite diretamente sua consulta no campo de texto

**Controles de Teclado:**

- `Enter`: Envia a mensagem
- `Shift + Enter`: Quebra linha (permite mensagens multi-linha)

**Exemplos de Consultas:**

**Para Voos:**

```
Quero buscar voos de CNF para SFO, com ida em outubro de 2025, para 1 adulto.
```

**Para Hotéis:**

```
Preciso de um hotel em San Francisco para 3 noites, a partir de 15 de outubro.
```

### Funcionalidades Avançadas

- 🔄 **Auto-scroll**: O chat rola automaticamente para novas mensagens
- 📱 **Design Responsivo**: Interface se adapta a diferentes tamanhos de tela
- 🌙 **Tema Escuro/Claro**: Alternância automática baseada na preferência do sistema
- 💾 **Histórico**: Conversas são salvas automaticamente
- ⚙️ **Configurações**: Personalize notificações, sons e comportamento do scroll

## ⚙️ Variáveis de Ambiente

Configure as seguintes variáveis no arquivo `.env` para personalizar o comportamento da aplicação:

### Configurações Básicas

```bash
# URL do servidor LangGraph (desenvolvimento local)
NEXT_PUBLIC_API_URL=http://localhost:2024

# ID do assistente/agente principal
NEXT_PUBLIC_ASSISTANT_ID=agent

# Chave da API LangSmith (necessária para servidores em produção)
LANGSMITH_API_KEY=lsv2_sua_chave_aqui
```

### Configurações Avançadas

```bash
# URL do servidor LangGraph em produção
LANGGRAPH_API_URL=https://sua-aplicacao.langgraph.app

# Configurações de tema e aparência
NEXT_PUBLIC_DEFAULT_THEME=system  # light, dark, ou system

# Configurações de funcionalidades
NEXT_PUBLIC_ENABLE_SOUND=true     # Habilita notificações sonoras
NEXT_PUBLIC_AUTO_SCROLL=true      # Habilita scroll automático

# Debug e desenvolvimento
NEXT_PUBLIC_DEBUG_MODE=false      # Modo debug para desenvolvimento
```

### Como Configurar:

1. Copie o arquivo de exemplo:

```bash
cp .env.example .env
```

2. Edite o arquivo `.env` com suas configurações específicas

3. Reinicie a aplicação:

```bash
pnpm dev
```

> **💡 Dica:** Para conectar a um servidor LangGraph em produção, consulte a seção [Configuração para Produção](#-configuração-para-produção).

Restart the application

When these environment variables are set, the application will use them instead of showing the setup form.

## 🏗️ Arquitetura e Tecnologias

### Stack Tecnológico

**Frontend:**

- ⚛️ **Next.js 15.3.2** - Framework React com App Router
- 🎨 **Tailwind CSS** - Framework CSS utilitário para estilização
- 🎭 **Framer Motion** - Biblioteca para animações fluidas
- 📱 **Responsive Design** - Interface adaptável para todos os dispositivos

**Backend e IA:**

- 🤖 **LangGraph SDK** - Orquestração de agentes de IA
- 🧠 **LangChain** - Framework para aplicações de IA
- 📊 **LangSmith** - Observabilidade e monitoramento

**Desenvolvimento:**

- 🔷 **TypeScript** - Tipagem estática para JavaScript
- 🧪 **Vitest** - Framework de testes moderno
- 📏 **ESLint + Prettier** - Linting e formatação de código
- 🔧 **pnpm** - Gerenciador de pacotes eficiente

### Estrutura do Projeto

```
src/
├── app/                    # App Router do Next.js
├── components/             # Componentes React reutilizáveis
│   ├── thread/            # Componentes do chat
│   │   └── thread-main/   # Componentes principais do thread
│   └── ui/                # Componentes de interface base
├── hooks/                 # Hooks customizados
│   ├── api/              # Hooks para chamadas de API
│   ├── business/         # Lógica de negócio
│   └── ui/               # Hooks de interface
├── lib/                  # Utilitários e configurações
├── providers/            # Context providers do React
├── types/                # Definições de tipos TypeScript
└── constants/            # Constantes da aplicação
```

### Componentes Principais

**Thread System:**

- `Thread.tsx` - Container principal do chat
- `ThreadHeader.tsx` - Cabeçalho com navegação
- `ThreadFooter.tsx` - Input de mensagens com dicas
- `WelcomeScreen.tsx` - Tela inicial com agentes

**Mensagens:**

- `HumanMessage.tsx` - Mensagens do usuário
- `AssistantMessage.tsx` - Respostas da IA
- `ToolCalls.tsx` - Visualização de chamadas de ferramentas

## 🎯 Recursos Avançados

### Sistema de Agentes

A aplicação utiliza um sistema de agentes especializados que podem:

- 🔍 Processar linguagem natural para entender intenções
- 🌐 Fazer chamadas para APIs externas de voos e hotéis
- 📊 Apresentar dados estruturados de forma amigável
- 🔄 Manter contexto entre diferentes interações

### Interface Inteligente

- **Auto-scroll Inteligente**: Acompanha automaticamente novas mensagens
- **Indicadores Visuais**: Loading states e progress indicators
- **Feedback Tátil**: Animações e transições suaves
- **Acessibilidade**: Suporte a leitores de tela e navegação por teclado

## Hiding Messages in the Chat

You can control the visibility of messages within the Agent Chat UI in two main ways:

**1. Prevent Live Streaming:**

To stop messages from being displayed _as they stream_ from an LLM call, add the `langsmith:nostream` tag to the chat model's configuration. The UI normally uses `on_chat_model_stream` events to render streaming messages; this tag prevents those events from being emitted for the tagged model.

_Python Example:_

```python
from langchain_anthropic import ChatAnthropic

# Add tags via the .with_config method
model = ChatAnthropic().with_config(
    config={"tags": ["langsmith:nostream"]}
)
```

_TypeScript Example:_

```typescript
import { ChatAnthropic } from "@langchain/anthropic";

const model = new ChatAnthropic()
  // Add tags via the .withConfig method
  .withConfig({ tags: ["langsmith:nostream"] });
```

**Note:** Even if streaming is hidden this way, the message will still appear after the LLM call completes if it's saved to the graph's state without further modification.

**2. Hide Messages Permanently:**

To ensure a message is _never_ displayed in the chat UI (neither during streaming nor after being saved to state), prefix its `id` field with `do-not-render-` _before_ adding it to the graph's state, along with adding the `langsmith:do-not-render` tag to the chat model's configuration. The UI explicitly filters out any message whose `id` starts with this prefix.

_Python Example:_

```python
result = model.invoke([messages])
# Prefix the ID before saving to state
result.id = f"do-not-render-{result.id}"
return {"messages": [result]}
```

_TypeScript Example:_

```typescript
const result = await model.invoke([messages]);
// Prefix the ID before saving to state
result.id = `do-not-render-${result.id}`;
return { messages: [result] };
```

This approach guarantees the message remains completely hidden from the user interface.

## Rendering Artifacts

The Agent Chat UI supports rendering artifacts in the chat. Artifacts are rendered in a side panel to the right of the chat. To render an artifact, you can obtain the artifact context from the `thread.meta.artifact` field. Here's a sample utility hook for obtaining the artifact context:

```tsx
export function useArtifact<TContext = Record<string, unknown>>() {
  type Component = (props: {
    children: React.ReactNode;
    title?: React.ReactNode;
  }) => React.ReactNode;

  type Context = TContext | undefined;

  type Bag = {
    open: boolean;
    setOpen: (value: boolean | ((prev: boolean) => boolean)) => void;

    context: Context;
    setContext: (value: Context | ((prev: Context) => Context)) => void;
  };

  const thread = useStreamContext<
    { messages: Message[]; ui: UIMessage[] },
    { MetaType: { artifact: [Component, Bag] } }
  >();

  return thread.meta?.artifact;
}
```

After which you can render additional content using the `Artifact` component from the `useArtifact` hook:

```tsx
import { useArtifact } from "../utils/use-artifact";
import { LoaderIcon } from "lucide-react";

export function Writer(props: {
  title?: string;
  content?: string;
  description?: string;
}) {
  const [Artifact, { open, setOpen }] = useArtifact();

  return (
    <>
      <div
        onClick={() => setOpen(!open)}
        className="cursor-pointer rounded-lg border p-4"
      >
        <p className="font-medium">{props.title}</p>
        <p className="text-sm text-gray-500">{props.description}</p>
      </div>

      <Artifact title={props.title}>
        <p className="whitespace-pre-wrap p-4">{props.content}</p>
      </Artifact>
    </>
  );
}
```

## 🚀 Configuração para Produção

Quando estiver pronto para levar a aplicação para produção, você precisará configurar a autenticação e conexão com seu servidor LangGraph implantado. Por padrão, a aplicação está configurada para desenvolvimento local, conectando-se diretamente ao servidor LangGraph pelo cliente.

### Preparação para Produção

Para colocar o Trip Planner Chat em produção, você tem duas opções principais de autenticação:

### 📋 Checklist de Produção

Antes de fazer o deploy, certifique-se de:

- [ ] Configurar variáveis de ambiente de produção
- [ ] Configurar servidor LangGraph em produção
- [ ] Configurar autenticação (LangSmith API Key ou custom)
- [ ] Testar todas as funcionalidades em ambiente de staging
- [ ] Configurar monitoramento e logs
- [ ] Configurar domínio personalizado (opcional)

### 🚀 Opção 1: API Passthrough (Recomendado)

A maneira mais rápida de colocar o Trip Planner Chat em produção é usando o pacote [API Passthrough](https://github.com/bracesproul/langgraph-nextjs-api-passthrough). Este pacote fornece uma forma simples de proxy das requisições para seu servidor LangGraph, gerenciando a autenticação automaticamente.

**Vantagens:**

- ✅ Configuração rápida e simples
- ✅ Autenticação centralizada no servidor
- ✅ Não expõe chaves API para o cliente
- ✅ Código já incluído no repositório

Este repositório já contém todo o código necessário. Você só precisa configurar as variáveis de ambiente adequadas:

```bash
NEXT_PUBLIC_ASSISTANT_ID="agent"
# This should be the deployment URL of your LangGraph server
LANGGRAPH_API_URL="https://my-agent.default.us.langgraph.app"
# This should be the URL of your website + "/api". This is how you connect to the API proxy
NEXT_PUBLIC_API_URL="https://my-website.com/api"
# Your LangSmith API key which is injected into requests inside the API proxy
LANGSMITH_API_KEY="lsv2_..."
```

Let's cover what each of these environment variables does:

- `NEXT_PUBLIC_ASSISTANT_ID`: The ID of the assistant you want to use when fetching, and submitting runs via the chat interface. This still needs the `NEXT_PUBLIC_` prefix, since it's not a secret, and we use it on the client when submitting requests.
- `LANGGRAPH_API_URL`: The URL of your LangGraph server. This should be the production deployment URL.
- `NEXT_PUBLIC_API_URL`: The URL of your website + `/api`. This is how you connect to the API proxy. For the [Agent Chat demo](https://agentchat.vercel.app), this would be set as `https://agentchat.vercel.app/api`. You should set this to whatever your production URL is.
- `LANGSMITH_API_KEY`: Your LangSmith API key to use when authenticating requests sent to LangGraph servers. Once again, do _not_ prefix this with `NEXT_PUBLIC_` since it's a secret, and is only used on the server when the API proxy injects it into the request to your deployed LangGraph server.

For in depth documentation, consult the [LangGraph Next.js API Passthrough](https://www.npmjs.com/package/langgraph-nextjs-api-passthrough) docs.

### Advanced Setup - Custom Authentication

Custom authentication in your LangGraph deployment is an advanced, and more robust way of authenticating requests to your LangGraph server. Using custom authentication, you can allow requests to be made from the client, without the need for a LangSmith API key. Additionally, you can specify custom access controls on requests.

To set this up in your LangGraph deployment, please read the LangGraph custom authentication docs for [Python](https://langchain-ai.github.io/langgraph/tutorials/auth/getting_started/), and [TypeScript here](https://langchain-ai.github.io/langgraphjs/how-tos/auth/custom_auth/).

Once you've set it up on your deployment, you should make the following changes to the Agent Chat UI:

1. Configure any additional API requests to fetch the authentication token from your LangGraph deployment which will be used to authenticate requests from the client.
2. Set the `NEXT_PUBLIC_API_URL` environment variable to your production LangGraph deployment URL.
3. Set the `NEXT_PUBLIC_ASSISTANT_ID` environment variable to the ID of the assistant you want to use when fetching, and submitting runs via the chat interface.
4. Modify the [`useTypedStream`](src/providers/Stream.tsx) (extension of `useStream`) hook to pass your authentication token through headers to the LangGraph server:

```tsx
const streamValue = useTypedStream({
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  assistantId: process.env.NEXT_PUBLIC_ASSISTANT_ID,
  // ... other fields
  defaultHeaders: {
    Authentication: `Bearer ${addYourTokenHere}`, // this is where you would pass your authentication token
  },
});
```

## 🧪 Desenvolvimento e Testes

### Executando Testes

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com coverage
pnpm test:coverage
```

### Estrutura de Testes

Os testes estão organizados em:

- `__tests__/components/` - Testes de componentes React
- `__tests__/hooks/` - Testes de hooks customizados
- `__tests__/lib/` - Testes de utilitários

### Debugging

Para debugar a aplicação:

1. **Modo Debug**: Configure `NEXT_PUBLIC_DEBUG_MODE=true` no `.env`
2. **DevTools**: Use React DevTools e Redux DevTools
3. **Console Logs**: Verifique o console do navegador para logs detalhados
4. **Network Tab**: Monitore requisições para o servidor LangGraph

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor, siga estas diretrizes:

### Como Contribuir

1. **Fork** o repositório
2. **Clone** seu fork localmente
3. **Crie** uma branch para sua feature: `git checkout -b minha-nova-feature`
4. **Faça** suas alterações seguindo os padrões de código
5. **Teste** suas alterações: `pnpm test`
6. **Commit** suas mudanças: `git commit -m 'Adiciona nova feature'`
7. **Push** para sua branch: `git push origin minha-nova-feature`
8. **Abra** um Pull Request

### Padrões de Código

- ✅ Use TypeScript para tipagem estática
- ✅ Siga os padrões do ESLint e Prettier
- ✅ Escreva testes para novas funcionalidades
- ✅ Documente mudanças significativas
- ✅ Use conventional commits

### Reportando Bugs

Para reportar bugs, abra uma issue incluindo:

- 🐛 Descrição detalhada do problema
- 📱 Dispositivo/navegador onde ocorre
- 🔄 Passos para reproduzir
- 📷 Screenshots (se aplicável)
- 🔍 Logs de erro

## 📄 Licença

Este projeto está licenciado sob a [MIT License](LICENSE) - veja o arquivo LICENSE para detalhes.

## 👥 Autor

**Rafael Angelo** - [@RafaelAngelo1999](https://github.com/RafaelAngelo1999)

## 🙏 Agradecimentos

- [LangChain](https://langchain.com/) pela tecnologia de IA
- [Next.js](https://nextjs.org/) pelo framework React
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS
- [Vercel](https://vercel.com/) pela plataforma de deploy

---

**🚀 Pronto para planejar sua próxima viagem com IA? Comece agora!**
