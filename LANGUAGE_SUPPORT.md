# Suporte a Idiomas no Agent Chat UI

Esta implementação adiciona suporte completo para múltiplos idiomas no Agent Chat UI, permitindo que as respostas do LangGraph sejam retornadas no idioma preferido do usuário.

## Como Funciona

### 1. Configuração de Idioma

- O usuário pode selecionar o idioma preferido diretamente na tela principal através de um seletor na barra superior
- Os idiomas suportados incluem: Português (Brasil), English, Español, Français, Deutsch, Italiano, 日本語, 한국어, 中文
- A preferência é salva no localStorage do navegador para persistir entre sessões
- **IMPORTANTE**: O modal de configuração inicial foi removido - todas as configurações de ambiente devem ser feitas via .env

### 2. Envio do Idioma para o LangGraph

O idioma selecionado é enviado automaticamente no contexto de todas as mensagens para o LangGraph:

```typescript
const context = {
  language: stream.language, // e.g., 'pt-br', 'en', 'es'
  // outros campos de contexto...
};

stream.submit({ messages: [...messages], context }, options);
```

### 3. Arquivos Modificados

#### `/src/lib/language.ts` (novo)

- Define os tipos e constantes para idiomas suportados
- Funções para gerenciar persistência no localStorage

#### `/src/hooks/useStreamContext.ts` (novo)

- Hook customizado para acessar o contexto do stream
- Resolve problemas de Fast Refresh do React

#### `/src/providers/Stream.tsx`

- Adiciona estado de idioma ao contexto
- **REFATORADO**: Removido formulário de configuração - agora usa sempre variáveis de ambiente
- Integração com localStorage

#### `/src/components/ui/language-selector.tsx` (novo)

- Componente de seleção de idioma para a tela principal
- Interface simples e compacta

#### `/src/components/thread/index.tsx`

- Inclui idioma no contexto das mensagens principais
- Atualiza função `handleSubmit` e `handleRegenerate`
- **NOVO**: Inclui o seletor de idioma na barra superior

#### `/src/components/thread/messages/human.tsx`

- Inclui idioma no contexto quando editando mensagens humanas

### 4. Como o LangGraph Pode Usar o Idioma

No seu servidor LangGraph, você pode acessar o idioma através do contexto:

```python
# Python
def my_node(state):
    language = state.get("context", {}).get("language", "en")

    if language == "pt-br":
        return {"messages": [AIMessage("Olá! Como posso ajudar?")]}
    elif language == "es":
        return {"messages": [AIMessage("¡Hola! ¿Cómo puedo ayudar?")]}
    else:
        return {"messages": [AIMessage("Hello! How can I help?")]}
```

```typescript
// TypeScript
function myNode(state: StateType) {
  const language = state.context?.language || "en";

  const responses = {
    "pt-br": "Olá! Como posso ajudar?",
    es: "¡Hola! ¿Cómo puedo ayudar?",
    en: "Hello! How can I help?",
  };

  return {
    messages: [new AIMessage(responses[language] || responses.en)],
  };
}
```

### 5. Persistência

- A escolha do idioma é salva automaticamente no localStorage
- Persiste entre sessões do navegador
- Pode ser alterada a qualquer momento recarregando a página e mudando no formulário

### 6. Idiomas Suportados

| Código | Idioma             |
| ------ | ------------------ |
| pt-br  | Português (Brasil) |
| en     | English            |
| es     | Español            |
| fr     | Français           |
| de     | Deutsch            |
| it     | Italiano           |
| ja     | 日本語             |
| ko     | 한국어             |
| zh     | 中文               |

## Configuração de Ambiente

### Variáveis de Ambiente Obrigatórias

Agora é **obrigatório** definir as seguintes variáveis no arquivo `.env.local`:

```env
# LangGraph Configuration - REQUIRED
NEXT_PUBLIC_API_URL=http://localhost:2024
NEXT_PUBLIC_ASSISTANT_ID=agent

# LangSmith API Key (opcional para desenvolvimento local)
LANGSMITH_API_KEY=
```

### Configuração para Produção

```env
NEXT_PUBLIC_API_URL=https://meu-website.com/api
NEXT_PUBLIC_ASSISTANT_ID=meu-assistente
LANGSMITH_API_KEY=lsv2_...
```

## Exemplos de Uso

### Configurando o Idioma

1. Acesse a aplicação (certifique-se de que as variáveis de ambiente estão configuradas)
2. Na barra superior, clique no seletor de idioma
3. Escolha seu idioma preferido
4. A configuração é salva automaticamente

### Mudando o Idioma

1. Na barra superior da interface, clique no seletor de idioma
2. Selecione o novo idioma desejado
3. A mudança é aplicada imediatamente

### No Código do LangGraph

```python
# Exemplo de nó que responde no idioma correto
def responder_node(state):
    language = state.get("context", {}).get("language", "en")
    user_message = state["messages"][-1].content

    # Use o idioma para personalizar a resposta
    if language == "pt-br":
        response = f"Entendi sua mensagem: {user_message}. Como posso ajudar?"
    elif language == "es":
        response = f"Entendí tu mensaje: {user_message}. ¿Cómo puedo ayudar?"
    else:
        response = f"I understand your message: {user_message}. How can I help?"

    return {"messages": [AIMessage(response)]}
```

## Benefícios

1. **Experiência Localizada**: Usuários recebem respostas no seu idioma preferido
2. **Persistência**: Configuração salva automaticamente
3. **Flexibilidade**: Fácil de adicionar novos idiomas
4. **Compatibilidade**: Funciona com qualquer LangGraph que leia o contexto
5. **Transparência**: O idioma é enviado automaticamente sem intervenção do usuário
