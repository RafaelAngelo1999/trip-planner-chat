import { v4 as uuidv4 } from "uuid";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  useMediaQuery,
  useNotificationSound,
  useSettings,
  useStreamContext,
  Settings as SettingsType,
} from "@/hooks";
import { useState, FormEvent } from "react";
import { Checkpoint, Message } from "@langchain/langgraph-sdk";
import { AssistantMessage, AssistantMessageLoading } from "../messages/ai";
import { HumanMessage } from "../messages/human";
import { useQueryState, parseAsBoolean } from "nuqs";
import { StickToBottom } from "use-stick-to-bottom";
import ThreadHistory from "../history";
import {
  useArtifactOpen,
  ArtifactContent,
  ArtifactTitle,
  useArtifactContext,
} from "../artifact";
import { SettingsModal } from "../../ui/settings-modal";
// Subcomponentes
import { ThreadHeader } from "./ThreadHeader";
import { WelcomeScreen } from "./WelcomeScreen";
import { ThreadFooter } from "./ThreadFooter";
import { StickyToBottomContent, ScrollToBottom } from "./ThreadUtils";
import {
  cn,
  ensureToolCallsHaveResponses,
  DO_NOT_RENDER_ID_PREFIX,
} from "@/lib";

export function Thread() {
  const [artifactContext, setArtifactContext] = useArtifactContext();
  const [artifactOpen, closeArtifact] = useArtifactOpen();

  const { settings, updateSettings } = useSettings();
  const [threadId, _setThreadId] = useQueryState("threadId");
  const [chatHistoryOpen, setChatHistoryOpen] = useQueryState(
    "chatHistoryOpen",
    parseAsBoolean.withDefault(false),
  );

  const isLargeScreen = useMediaQuery("(min-width: 1024px)");
  const [input, setInput] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const { playNotificationSound } = useNotificationSound();

  const setThreadId = (id: string | null) => {
    if (id) {
      _setThreadId(id);
    } else {
      _setThreadId(null);
      closeArtifact();
      setArtifactContext({});
    }
  };

  const stream = useStreamContext();
  const { messages, isLoading } = stream;

  const prevMessageLength = useRef(messages.length);
  const [firstTokenReceived, setFirstTokenReceived] = useState(false);

  // Auto-scroll and notification sounds functionality
  const scrollToBottomRef = useRef<(() => void) | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const bottomAnchorRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    // Estratégia 1: usar a função do use-stick-to-bottom
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current();
    }

    // Estratégia 2: scroll direto no container com offset para o footer
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const footerHeight = 200; // Altura estimada do footer + margem de segurança
      container.scrollTop =
        container.scrollHeight - container.clientHeight + footerHeight;
    }

    // Estratégia 3: usar scrollIntoView no elemento âncora com margem
    if (bottomAnchorRef.current) {
      bottomAnchorRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
    }
  };

  useEffect(() => {
    if (messages.length > prevMessageLength.current) {
      const lastMessage = messages[messages.length - 1];

      if (lastMessage.type === "ai" && !firstTokenReceived) {
        setFirstTokenReceived(true);
        playNotificationSound(settings.enableSounds);
      }

      // Sempre fazer scroll para baixo quando há novas mensagens
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
    prevMessageLength.current = messages.length;
  }, [
    messages,
    firstTokenReceived,
    playNotificationSound,
    settings.enableSounds,
  ]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    if (!threadId) {
      const newThreadId = uuidv4();
      setThreadId(newThreadId);
    }

    setFirstTokenReceived(false);

    const newHumanMessage: Message = {
      id: uuidv4(),
      type: "human",
      content: input.trim(),
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

    // Scroll imediatamente após enviar a mensagem
    setTimeout(() => {
      scrollToBottom();
    }, 50);
  };

  const handleRegenerate = (
    parentCheckpoint: Checkpoint | null | undefined,
  ) => {
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
      {/* Sidebar do histórico */}
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
          {/* Header */}
          <ThreadHeader
            chatStarted={chatStarted}
            isLargeScreen={isLargeScreen}
            chatHistoryOpen={chatHistoryOpen}
            setChatHistoryOpen={setChatHistoryOpen}
            setThreadId={setThreadId}
            setSettingsOpen={setSettingsOpen}
            showThreadHistory={settings.showThreadHistory}
          />

          {/* Conteúdo principal */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            <StickToBottom className="flex-1">
              <StickyToBottomContent
                className="flex flex-col"
                contentClassName={cn(
                  "flex flex-col gap-4 px-4",
                  chatStarted
                    ? "pt-4 pb-48"
                    : "flex-1 justify-center items-center pb-48",
                )}
                onScrollContext={(isAtBottom, scrollToBottomFn) => {
                  scrollToBottomRef.current = scrollToBottomFn;
                  // Também armazenamos a ref do container de scroll
                  if (!scrollContainerRef.current) {
                    const scrollElement = document.querySelector(
                      "[data-scroll-container]",
                    );
                    if (scrollElement) {
                      scrollContainerRef.current =
                        scrollElement as HTMLDivElement;
                    }
                  }
                }}
                content={
                  <>
                    {!chatStarted && hasNoAIOrToolMessages ? (
                      <div className="mx-auto flex w-full max-w-6xl flex-1 items-center justify-center">
                        <WelcomeScreen
                          input={input}
                          setInput={setInput}
                          handleSubmit={handleSubmit}
                        />
                      </div>
                    ) : (
                      <div className="mx-auto flex w-full max-w-6xl flex-col gap-4">
                        {messages
                          .filter(
                            (m) => !m.id?.startsWith(DO_NOT_RENDER_ID_PREFIX),
                          )
                          .map((message, i, arr) => {
                            if (message.type === "human") {
                              return (
                                <HumanMessage
                                  key={message.id}
                                  message={message}
                                  isLoading={false}
                                />
                              );
                            } else if (message.type === "ai") {
                              const meta = stream.getMessagesMetadata(message);
                              const parentCheckpoint =
                                meta?.firstSeenState?.parent_checkpoint;
                              return (
                                <AssistantMessage
                                  key={message.id}
                                  message={message}
                                  isLoading={isLoading && i === arr.length - 1}
                                  handleRegenerate={() =>
                                    handleRegenerate(parentCheckpoint)
                                  }
                                />
                              );
                            }
                            return null;
                          })}

                        {isLoading && !firstTokenReceived && (
                          <AssistantMessageLoading />
                        )}

                        {/* Elemento âncora para scroll com espaço para o footer */}
                        <div
                          ref={bottomAnchorRef}
                          className="h-48"
                        />
                      </div>
                    )}
                  </>
                }
              />

              {/* ScrollToBottom dentro do contexto StickToBottom */}
              {chatStarted && (
                <ScrollToBottom className="animate-in fade-in-0 zoom-in-95 fixed bottom-48 left-1/2 z-10 mb-4 -translate-x-1/2" />
              )}
            </StickToBottom>
          </div>

          {/* Footer fixo na parte inferior da viewport */}
          <ThreadFooter
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
            stop={() => stream.stop()}
            threadId={threadId}
            chatStarted={chatStarted}
          />
        </motion.div>

        {/* Artifact Sidebar */}
        <motion.div
          className="bg-muted relative min-h-full border-l dark:border-slate-600/50"
          initial={false}
          animate={{
            width: artifactOpen ? "100%" : 0,
            opacity: artifactOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          style={{ overflow: "hidden" }}
        >
          {artifactOpen && (
            <div className="flex h-full flex-col">
              <ArtifactTitle />
              <ArtifactContent />
            </div>
          )}
        </motion.div>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        currentSettings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  );
}
