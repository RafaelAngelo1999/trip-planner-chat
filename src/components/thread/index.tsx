import { v4 as uuidv4 } from "uuid";
import { ReactNode, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useStreamContext } from "@/hooks";
import { useState, FormEvent } from "react";
import { Button } from "../ui/button";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { AssistantMessage, AssistantMessageLoading } from "./messages/ai";
import { HumanMessage } from "./messages/human";
import { TripIAIcon } from "../icons/trip-ia";
import {
  ArrowDown,
  LoaderCircle,
  XIcon,
  Settings,
  History,
  Plus,
} from "lucide-react";
import { useQueryState, parseAsBoolean } from "nuqs";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import ThreadHistory from "./history";
import { toast } from "sonner";

import {
  useArtifactOpen,
  ArtifactContent,
  ArtifactTitle,
  useArtifactContext,
} from "./artifact";
import { SettingsModal } from "../ui/settings-modal";
import {
  cn,
  DO_NOT_RENDER_ID_PREFIX,
  ensureToolCallsHaveResponses,
} from "@/lib";
import {
  useMediaQuery,
  useNotificationSound,
  useSettings,
  Settings as SettingsType,
} from "@/hooks";

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
  onScrollContext?: (isAtBottom: boolean, scrollToBottom: () => void) => void;
}) {
  const context = useStickToBottomContext();
  const { isAtBottom, scrollToBottom } = context;
  const { onScrollContext } = props;

  // Expose scroll context to parent component
  useEffect(() => {
    onScrollContext?.(isAtBottom, scrollToBottom);
  }, [isAtBottom, scrollToBottom, onScrollContext]);

  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={props.className}
    >
      <div
        ref={context.contentRef}
        className={props.contentClassName}
      >
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

export function Thread() {
  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();

  const { settings, updateSettings } = useSettings();
  const [threadId, _setThreadId] = useQueryState("threadId");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  const [input, setInput] = useState("");
  // Content blocks state for future multimodal support
  const [contentBlocks] = useState<any[]>([]);
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const isLargeScreen = useMediaQuery("(min-width: 1024px)");

  const stream = useStreamContext();
  const messages = stream.messages;
  const isLoading = stream.isLoading;

  const lastError = useRef<string | undefined>(undefined);

  const setThreadId = (id: string | null) => {
    _setThreadId(id);

    // close artifact and reset artifact context
    closeArtifact();
    setArtifactContext({});
  };

  useEffect(() => {
    if (!stream.error) {
      lastError.current = undefined;
      return;
    }
    try {
      const message = (stream.error as any).message;
      if (!message || lastError.current === message) {
        // Message has already been logged. do not modify ref, return early.
        return;
      }

      // Message is defined, and it has not been logged yet. Save it, and send the error
      lastError.current = message;
      toast.error("An error occurred. Please try again.", {
        description: (
          <p>
            <strong>Error:</strong> <code>{message}</code>
          </p>
        ),
        richColors: true,
        closeButton: true,
      });
    } catch {
      // no-op
    }
  }, [stream.error]);

  // Auto-scroll and notification sounds functionality
  const { playNotificationSound } = useNotificationSound();
  const prevMessageLength = useRef(0);
  const scrollToBottomRef = useRef<(() => void) | null>(null);
  const isAtBottomRef = useRef<boolean>(true);

  useEffect(() => {
    const hasNewMessage =
      messages.length !== prevMessageLength.current && messages?.length;
    const lastMessage = messages[messages.length - 1];

    if (hasNewMessage) {
      if (lastMessage?.type === "ai") {
        setFirstTokenReceived(true);

        // Play notification sound if enabled (only for AI messages)
        playNotificationSound(settings.enableSounds);
      }

      // Auto-scroll if enabled and user is near bottom (for both AI and human messages)
      if (
        settings.autoScroll &&
        (isAtBottomRef.current || messages.length === 1)
      ) {
        // Small delay to ensure content is rendered
        setTimeout(() => {
          scrollToBottomRef.current?.();
        }, 100);
      }
    }

    prevMessageLength.current = messages.length;
  }, [
    messages,
    settings.enableSounds,
    settings.autoScroll,
    playNotificationSound,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if ((input.trim().length === 0 && contentBlocks.length === 0) || isLoading)
      return;
    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: [
        ...(input.trim().length > 0 ? [{ type: "text", text: input }] : []),
        ...contentBlocks,
      ] as Message["content"],
    };

    const toolMessages = ensureToolCallsHaveResponses(stream.messages);

    const context = {
      ...(Object.keys(artifactContext).length > 0 ? artifactContext : {}),
      language: stream.language,
    };

    stream.submit(
      { messages: [...toolMessages, newHumanMessage], context },
      {
        streamMode: ["values"],
        streamSubgraphs: true,
        streamResumable: true,
        optimisticValues: (prev) => ({
          ...prev,
          context,
          messages: [
            ...(prev.messages ?? []),
            ...toolMessages,
            newHumanMessage,
          ],
        }),
      },
    );

    setInput("");
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
    // Do this so the loading state is correct
    prevMessageLength.current = prevMessageLength.current - 1;
    setFirstTokenReceived(false);

    const context = {
      language: stream.language,
    };

    stream.submit(
      { context },
      {
        checkpoint: parentCheckpoint,
        streamMode: ["values"],
        streamSubgraphs: true,
        streamResumable: true,
      },
    );
  };

  const handleSaveSettings = (newSettings: SettingsType) => {
    updateSettings(newSettings);
  };

  const chatStarted = !!threadId || !!messages.length;
  const hasNoAIOrToolMessages = !messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div className="relative hidden lg:flex">
        <motion.div
          className="absolute z-20 h-full overflow-hidden border-r bg-white shadow-xl dark:border-slate-600/50 dark:bg-slate-900 dark:shadow-2xl dark:shadow-slate-900/40"
          style={{ width: 300 }}
          animate={
            isLargeScreen
              ? { x: chatHistoryOpen ? 0 : -300 }
              : { x: chatHistoryOpen ? 0 : -300 }
          }
          initial={{ x: -300 }}
          transition={
            isLargeScreen
              ? { type: "spring", stiffness: 300, damping: 30 }
              : { duration: 0 }
          }
        >
          <div
            className="relative h-full"
            style={{ width: 300 }}
          >
            <ThreadHistory />
          </div>
        </motion.div>
      </div>

      <div
        className={cn(
          "grid w-full grid-cols-[1fr_0fr] transition-all duration-500",
          artifactOpen && "grid-cols-[3fr_2fr]",
        )}
      >
        <motion.div
          className={cn(
            "relative flex min-w-0 flex-1 flex-col overflow-hidden",
            !chatStarted && "grid-rows-[1fr]",
          )}
          layout={isLargeScreen}
          animate={{
            marginLeft: chatHistoryOpen ? (isLargeScreen ? 300 : 0) : 0,
            width: chatHistoryOpen
              ? isLargeScreen
                ? "calc(100% - 300px)"
                : "100%"
              : "100%",
          }}
          transition={
            isLargeScreen
              ? { type: "spring", stiffness: 300, damping: 30 }
              : { duration: 0 }
          }
        >
          {!chatStarted && (
            <div className="absolute top-0 left-0 z-10 flex h-[72px] w-full items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:border-slate-600/30 dark:from-slate-900/95 dark:to-slate-800/95">
              <div className="flex items-center gap-1">
                {settings.showThreadHistory &&
                  (!chatHistoryOpen || !isLargeScreen) && (
                    <Button
                      className="hover:bg-blue-100 dark:hover:bg-slate-700/50"
                      variant="ghost"
                      size="sm"
                      onClick={() => setChatHistoryOpen((p) => !p)}
                    >
                      <History className="mr-1 size-4" />
                      {chatHistoryOpen ? "Fechar Histórico" : "Histórico"}
                    </Button>
                  )}
              </div>

              {/* Título principal centralizado */}
              <div className="absolute left-1/2 flex -translate-x-1/2 transform items-center gap-3">
                <TripIAIcon
                  width={32}
                  height={32}
                />
                <div className="text-center">
                  <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-lg font-bold text-transparent">
                    Trip-IA Agent
                  </h1>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    Assistente de Viagens
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 dark:border-slate-600/50 dark:hover:bg-slate-700/50"
                >
                  <Settings className="size-4" />
                  <span className="hidden text-sm font-medium lg:inline">
                    Configurações
                  </span>
                  <span className="text-sm font-medium lg:hidden">Config</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setThreadId(null)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 font-medium text-white hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="mr-1 size-4" />
                  {isLargeScreen ? "Novo Chat" : "Novo"}
                </Button>
              </div>
            </div>
          )}
          {chatStarted && (
            <div className="relative z-10 flex h-[72px] items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:border-slate-600/30 dark:from-slate-900/95 dark:to-slate-800/95">
              <div className="relative flex items-center justify-start gap-3">
                <div className="flex items-center gap-1">
                  {settings.showThreadHistory &&
                    (!chatHistoryOpen || !isLargeScreen) && (
                      <Button
                        className="hover:bg-blue-100 dark:hover:bg-slate-700/50"
                        variant="ghost"
                        size="sm"
                        onClick={() => setChatHistoryOpen((p) => !p)}
                      >
                        <History className="mr-1 size-4" />
                        {isLargeScreen
                          ? chatHistoryOpen
                            ? "Fechar"
                            : "Histórico"
                          : ""}
                      </Button>
                    )}
                </div>
                <motion.button
                  className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100 dark:hover:bg-slate-700/50"
                  onClick={() => setThreadId(null)}
                  animate={{
                    marginLeft:
                      !chatHistoryOpen && settings.showThreadHistory ? 0 : 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <TripIAIcon
                    width={32}
                    height={32}
                  />
                  <div className="text-left">
                    <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-lg font-bold text-transparent">
                      Trip-IA Agent
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      Assistente de Viagens
                    </span>
                  </div>
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="default"
                  onClick={() => setSettingsOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-blue-100 dark:border-slate-600/50 dark:hover:bg-slate-700/50"
                >
                  <Settings className="size-4" />
                  <span className="hidden text-sm font-medium lg:inline">
                    Configurações
                  </span>
                  <span className="text-sm font-medium lg:hidden">Config</span>
                </Button>
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => setThreadId(null)}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 px-3 font-medium text-white hover:from-blue-600 hover:to-cyan-600"
                >
                  <Plus className="mr-1 size-4" />
                  {isLargeScreen ? "Novo Chat" : "Novo"}
                </Button>
              </div>

              <div className="from-background to-background/0 absolute inset-x-0 top-full h-3 bg-gradient-to-b" />
            </div>
          )}

          <StickToBottom className="relative flex-1 overflow-hidden">
            <StickyToBottomContent
              className={cn(
                "absolute inset-0 overflow-y-scroll bg-gradient-to-br from-gray-50/20 via-white/10 to-gray-50/20 px-4 dark:from-slate-800/30 dark:via-slate-700/15 dark:to-slate-800/30",
                "[&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-500 [&::-webkit-scrollbar-track]:bg-transparent",
                "[&::-webkit-scrollbar-thumb]:transition-colors [&::-webkit-scrollbar-thumb]:hover:bg-gray-400 dark:[&::-webkit-scrollbar-thumb]:hover:bg-slate-400",
                !chatStarted && "mt-[20vh] flex flex-col items-stretch",
                chatStarted && "grid grid-rows-[1fr_auto]",
              )}
              contentClassName="pt-8 pb-16  max-w-5xl mx-auto flex flex-col gap-4 w-full"
              onScrollContext={(isAtBottom, scrollToBottom) => {
                isAtBottomRef.current = isAtBottom;
                scrollToBottomRef.current = scrollToBottom;
              }}
              content={
                <>
                  {messages
                    .filter((m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX))
                    .map((message, index) =>
                      message.type === "human" ? (
                        <HumanMessage
                          key={message.id || `${message.type}-${index}`}
                          message={message}
                          isLoading={isLoading}
                        />
                      ) : (
                        <AssistantMessage
                          key={message.id || `${message.type}-${index}`}
                          message={message}
                          isLoading={isLoading}
                          handleRegenerate={handleRegenerate}
                        />
                      ),
                    )}
                  {/* Special rendering case where there are no AI/tool messages, but there is an interrupt.
                    We need to render it outside of the messages list, since there are no messages to render */}
                  {hasNoAIOrToolMessages && !!stream.interrupt && (
                    <AssistantMessage
                      key="interrupt-msg"
                      message={undefined}
                      isLoading={isLoading}
                      handleRegenerate={handleRegenerate}
                    />
                  )}
                  {isLoading && !firstTokenReceived && (
                    <AssistantMessageLoading />
                  )}
                </>
              }
              footer={
                <div className="sticky bottom-0 flex flex-col items-center gap-6 bg-white/95 backdrop-blur-sm dark:bg-slate-900/95">
                  {!chatStarted && (
                    <div className="mx-auto w-full max-w-4xl px-4">
                      {/* Header Principal */}
                      <div className="mb-6 text-center">
                        <div className="mb-3 flex items-center justify-center gap-4">
                          <TripIAIcon
                            width={48}
                            height={48}
                          />
                          <div>
                            <h1 className="bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-3xl font-bold text-transparent">
                              Trip-IA Agent
                            </h1>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                              Sua central de viagens inteligente
                            </p>
                          </div>
                        </div>
                        <p className="mx-auto max-w-2xl text-sm text-gray-700 dark:text-gray-300">
                          Conecte-se aos nossos agentes especializados para
                          planejar sua viagem perfeita.
                        </p>
                      </div>

                      {/* Cards dos Agentes - Com mais contexto */}
                      <div className="mb-6 grid gap-6 md:grid-cols-2">
                        {/* Agent Voos */}
                        <motion.div
                          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-blue-700/50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900/80"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setInput(
                              "Quero buscar voos de CNF para SFO, ida em 01/10/2025 e volta em 10/10/2025, para 1 adulto",
                            );
                            setTimeout(() => {
                              const form = document.querySelector("form");
                              form?.requestSubmit();
                            }, 100);
                          }}
                        >
                          {/* Efeito de brilho decorativo */}
                          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-400/20 opacity-70 blur-lg" />

                          <div className="relative z-10">
                            <div className="mb-4 flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <span className="text-2xl text-white">✈️</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 transition-colors group-hover:text-blue-600 dark:text-gray-100 dark:group-hover:text-blue-400">
                                  Agent Voos
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Especialista em aviação comercial
                                </p>
                              </div>
                            </div>

                            <div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                <span>
                                  <strong className="text-blue-600 dark:text-blue-400">
                                    Buscar:
                                  </strong>{" "}
                                  Compare voos, horários e preços
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                                <span>
                                  <strong className="text-cyan-600 dark:text-cyan-400">
                                    Reservar:
                                  </strong>{" "}
                                  Confirme com PNR e status
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                                <span>
                                  <strong className="text-blue-600 dark:text-blue-400">
                                    Cancelar:
                                  </strong>{" "}
                                  Gerencie suas reservas
                                </span>
                              </div>
                            </div>

                            <div className="rounded-xl border border-blue-200/50 bg-white/80 p-3 transition-all group-hover:bg-white dark:border-blue-600/30 dark:bg-slate-700/70 dark:group-hover:bg-slate-600/80">
                              <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                💡 Exemplo de uso:
                              </p>
                              <p className="text-sm leading-relaxed text-gray-700 italic dark:text-gray-300">
                                "Quero buscar voos de CNF para SFO, ida em
                                01/10/2025 e volta em 10/10/2025, para 1 adulto"
                              </p>
                            </div>
                          </div>
                        </motion.div>

                        {/* Agent Hotéis */}
                        <motion.div
                          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-purple-200/60 bg-gradient-to-br from-purple-50 via-pink-50 to-purple-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-purple-700/50 dark:from-slate-800 dark:via-slate-700 dark:to-purple-900/80"
                          whileHover={{ scale: 1.03, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setInput(
                              "Quero buscar hotéis em SFO para check-in em 01/10/2025 e check-out em 10/10/2025",
                            );
                            setTimeout(() => {
                              const form = document.querySelector("form");
                              form?.requestSubmit();
                            }, 100);
                          }}
                        >
                          {/* Efeito de brilho decorativo */}
                          <div className="absolute -top-4 -right-4 h-20 w-20 rounded-full bg-gradient-to-br from-purple-400/20 to-pink-400/20 opacity-70 blur-lg" />

                          <div className="relative z-10">
                            <div className="mb-4 flex items-center gap-4">
                              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                                <span className="text-2xl text-white">🏨</span>
                              </div>
                              <div>
                                <h3 className="text-xl font-bold text-gray-800 transition-colors group-hover:text-purple-600 dark:text-gray-100 dark:group-hover:text-purple-400">
                                  Agent Hotéis
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  Especialista em hospedagem
                                </p>
                              </div>
                            </div>

                            <div className="mb-4 space-y-2 text-sm text-gray-700 dark:text-gray-300">
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                                <span>
                                  <strong className="text-purple-600 dark:text-purple-400">
                                    Buscar:
                                  </strong>{" "}
                                  Hotéis com avaliações e preços
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-pink-500"></div>
                                <span>
                                  <strong className="text-pink-600 dark:text-pink-400">
                                    Reservar:
                                  </strong>{" "}
                                  Confirme sua estadia
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-purple-500"></div>
                                <span>
                                  <strong className="text-purple-600 dark:text-purple-400">
                                    Avaliar:
                                  </strong>{" "}
                                  Compare opções disponíveis
                                </span>
                              </div>
                            </div>

                            <div className="rounded-xl border border-purple-200/50 bg-white/80 p-3 transition-all group-hover:bg-white dark:border-purple-600/30 dark:bg-slate-700/70 dark:group-hover:bg-slate-600/80">
                              <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                                💡 Exemplo de uso:
                              </p>
                              <p className="text-sm leading-relaxed text-gray-700 italic dark:text-gray-300">
                                "Quero buscar hotéis em SFO para check-in em
                                01/10/2025 e check-out em 10/10/2025"
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      </div>

                      {/* Dica adicional */}
                      <div className="mb-4 text-center">
                        <p className="inline-block rounded-full bg-gray-100/80 px-4 py-2 text-xs text-gray-500 dark:bg-slate-700/80 dark:text-slate-300">
                          💬 <strong>Dica:</strong> Clique em um agente ou
                          digite diretamente sua solicitação
                        </p>
                      </div>
                    </div>
                  )}

                  <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 absolute bottom-full left-1/2 mb-4 -translate-x-1/2" />

                  <div className="bg-muted relative z-10 mx-auto mb-6 w-full max-w-5xl rounded-2xl border border-solid shadow-sm backdrop-blur-sm transition-all dark:border-slate-600/60 dark:bg-slate-800/95 dark:shadow-lg dark:shadow-slate-900/30">
                    <form
                      onSubmit={handleSubmit}
                      className="mx-auto grid max-w-5xl grid-rows-[1fr_auto] gap-2"
                    >
                      <textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (
                            e.key === "Enter" &&
                            !e.shiftKey &&
                            !e.metaKey &&
                            !e.nativeEvent.isComposing
                          ) {
                            e.preventDefault();
                            const el = e.target as HTMLElement | undefined;
                            const form = el?.closest("form");
                            form?.requestSubmit();
                          }
                        }}
                        placeholder="Type your message..."
                        className="field-sizing-content resize-none border-none bg-transparent p-3.5 pb-0 shadow-none ring-0 outline-none focus:ring-0 focus:outline-none"
                      />

                      <div className="flex items-center justify-between p-2 pt-4">
                        <div className="text-xs text-gray-500">
                          <span className="font-medium">Shift + Enter</span>{" "}
                          para quebrar linha •{" "}
                          <span className="font-medium">Enter</span> para enviar
                        </div>
                        {stream.isLoading ? (
                          <Button
                            key="stop"
                            onClick={() => stream.stop()}
                            className="ml-auto"
                          >
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                            Cancel
                          </Button>
                        ) : (
                          <Button
                            type="submit"
                            className="ml-auto shadow-md transition-all"
                            disabled={isLoading || !input.trim()}
                          >
                            Send
                          </Button>
                        )}
                      </div>
                    </form>
                  </div>
                </div>
              }
            />
          </StickToBottom>
        </motion.div>
        <div className="relative flex flex-col border-l">
          <div className="absolute inset-0 flex min-w-[30vw] flex-col">
            <div className="grid grid-cols-[1fr_auto] border-b p-4">
              <ArtifactTitle className="truncate overflow-hidden" />
              <button
                onClick={closeArtifact}
                className="cursor-pointer"
              >
                <XIcon className="size-5" />
              </button>
            </div>
            <ArtifactContent className="relative flex-grow" />
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        onSave={handleSaveSettings}
        currentSettings={settings}
      />
    </div>
  );
}
