import { parsePartialJson } from "@langchain/core/output_parsers";
import { useStreamContext } from "@/hooks";
import { AIMessage, Checkpoint, Message } from "@langchain/langgraph-sdk";
import { getContentString } from "../utils";
import { BranchSwitcher, CommandBar } from "./shared";
import { MarkdownText } from "../markdown-text";
import { LoadExternalComponent } from "@langchain/langgraph-sdk/react-ui";
import { cn } from "@/lib";
import { ToolCalls, ToolResult } from "./tool-calls";
import { MessageContentComplex } from "@langchain/core/messages";
import { Fragment } from "react/jsx-runtime";
import { isAgentInboxInterruptSchema } from "@/lib";
import { ThreadView } from "../agent-inbox";
import { GenericInterruptView } from "./generic-interrupt";
import { useArtifact } from "../artifact";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { useSettings } from "@/hooks";

function CopyButton({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="absolute top-2 right-2 h-6 w-6 p-0 opacity-0 transition-opacity group-hover/message:opacity-100"
    >
      {copied ? (
        <Check className="h-3 w-3 text-green-600" />
      ) : (
        <Copy className="h-3 w-3" />
      )}
    </Button>
  );
}

// Safe wrapper for LoadExternalComponent to handle runtime errors
function SafeLoadExternalComponent({
  customComponent,
  thread,
  artifact,
}: {
  customComponent: any;
  thread: ReturnType<typeof useStreamContext>;
  artifact: any;
}) {
  // Add a defensive wrapper to catch runtime errors (hooks must be at top)
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Use useEffect to catch async errors
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      if (
        event.error &&
        event.error.message &&
        (event.error.message.includes("Cannot read properties of undefined") ||
          event.error.message.includes("convertApiFlightToItinerary") ||
          event.error.message.includes("getFlightDetails") ||
          event.error.message.includes("fetchFlight"))
      ) {
        setHasError(true);
        setErrorMessage(event.error.message);
        event.preventDefault();
      }
    };

    window.addEventListener("error", handleError);
    return () => window.removeEventListener("error", handleError);
  }, []);

  // Validate that required data is present
  if (!customComponent) {
    console.warn(
      "SafeLoadExternalComponent: customComponent is undefined or null",
    );
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-700/50 dark:bg-yellow-900/20 dark:text-yellow-300">
        <p className="font-medium">Missing Component Data</p>
        <p className="text-xs opacity-75">
          Component data is missing or invalid.
        </p>
      </div>
    );
  }

  // Validate component has required properties
  if (!customComponent.id) {
    console.warn(
      "SafeLoadExternalComponent: customComponent missing 'id' property",
      customComponent,
    );
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-800 dark:border-yellow-700/50 dark:bg-yellow-900/20 dark:text-yellow-300">
        <p className="font-medium">Invalid Component Data</p>
        <p className="text-xs opacity-75">
          Component is missing required 'id' property.
        </p>
      </div>
    );
  }

  if (hasError) {
    const isFlightError =
      errorMessage.includes("convertApiFlightToItinerary") ||
      errorMessage.includes("getFlightDetails") ||
      errorMessage.includes("fetchFlight");

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
        <div className="mb-2 flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium">
            {isFlightError
              ? "Flight Data Processing Error"
              : "Component Loading Failed"}
          </p>
        </div>
        <p className="mb-2 text-xs opacity-75">
          {isFlightError
            ? "There was an issue processing the flight data. The flight information may be incomplete or missing required fields."
            : "External component could not be loaded. This might be due to a network issue or missing dependencies."}
        </p>
        <details className="text-xs opacity-60">
          <summary className="cursor-pointer hover:opacity-80">
            Error details
          </summary>
          <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">
            {errorMessage}
          </pre>
        </details>
      </div>
    );
  }

  try {
    return (
      <LoadExternalComponent
        key={customComponent.id}
        stream={thread}
        message={customComponent}
        meta={{ ui: customComponent, artifact }}
      />
    );
  } catch (error) {
    console.error("Failed to load external component:", error);
    const syncErrorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const isFlightError =
      syncErrorMessage.includes("convertApiFlightToItinerary") ||
      syncErrorMessage.includes("getFlightDetails") ||
      syncErrorMessage.includes("fetchFlight");

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
        <div className="mb-2 flex items-center gap-2">
          <svg
            className="h-4 w-4"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          <p className="font-medium">
            {isFlightError
              ? "Flight Data Processing Error"
              : "Component Loading Failed"}
          </p>
        </div>
        <p className="mb-2 text-xs opacity-75">
          {isFlightError
            ? "There was an issue processing the flight data. The flight information may be incomplete or missing required fields."
            : "External component could not be loaded. This might be due to a network issue or missing dependencies."}
        </p>
        <details className="text-xs opacity-60">
          <summary className="cursor-pointer hover:opacity-80">
            Error details
          </summary>
          <pre className="mt-2 font-mono text-xs whitespace-pre-wrap">
            {syncErrorMessage}
          </pre>
        </details>
      </div>
    );
  }
}

function CustomComponent({
  message,
  thread,
}: {
  message: Message;
  thread: ReturnType<typeof useStreamContext>;
}) {
  const artifact = useArtifact();
  const { values } = useStreamContext();
  const customComponents = values.ui?.filter(
    (ui) => ui.metadata?.message_id === message.id,
  );

  if (!customComponents?.length) return null;
  return (
    <Fragment key={message.id}>
      {customComponents.map((customComponent) => (
        <ErrorBoundary
          key={customComponent?.id || "unknown"}
          fallback={
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800 dark:border-red-700/50 dark:bg-red-900/20 dark:text-red-300">
              <div className="mb-2 flex items-center gap-2">
                <svg
                  className="h-4 w-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="font-medium">Flight Component Error</p>
              </div>
              <p className="text-xs opacity-75">
                There was an error rendering the flight component. This might be
                due to missing or invalid flight data.
              </p>
            </div>
          }
          onError={(error, errorInfo) => {
            console.error(
              "CustomComponent Error Boundary caught error:",
              error,
              errorInfo,
            );
          }}
        >
          <SafeLoadExternalComponent
            customComponent={customComponent}
            thread={thread}
            artifact={artifact}
          />
        </ErrorBoundary>
      ))}
    </Fragment>
  );
}

function parseAnthropicStreamedToolCalls(
  content: MessageContentComplex[],
): AIMessage["tool_calls"] {
  const toolCallContents = content.filter((c) => c.type === "tool_use" && c.id);

  return toolCallContents.map((tc) => {
    const toolCall = tc as Record<string, any>;
    let json: Record<string, any> = {};
    if (toolCall?.input) {
      try {
        json = parsePartialJson(toolCall.input) ?? {};
      } catch {
        // Pass
      }
    }
    return {
      name: toolCall.name ?? "",
      id: toolCall.id ?? "",
      args: json,
      type: "tool_call",
    };
  });
}

interface InterruptProps {
  interruptValue?: unknown;
  isLastMessage: boolean;
  hasNoAIOrToolMessages: boolean;
}

function Interrupt({
  interruptValue,
  isLastMessage,
  hasNoAIOrToolMessages,
}: InterruptProps) {
  return (
    <>
      {isAgentInboxInterruptSchema(interruptValue) &&
        (isLastMessage || hasNoAIOrToolMessages) && (
          <ThreadView interrupt={interruptValue} />
        )}
      {interruptValue &&
      !isAgentInboxInterruptSchema(interruptValue) &&
      (isLastMessage || hasNoAIOrToolMessages) ? (
        <GenericInterruptView interrupt={interruptValue} />
      ) : null}
    </>
  );
}

export function AssistantMessage({
  message,
  isLoading,
  handleRegenerate,
}: {
  message: Message | undefined;
  isLoading: boolean;
  handleRegenerate: (parentCheckpoint: Checkpoint | null | undefined) => void;
}) {
  const content = message?.content ?? [];
  const contentString = getContentString(content);
  const { settings } = useSettings();
  const hideToolCalls = settings.hideToolCalls;

  const thread = useStreamContext();
  const isLastMessage =
    thread.messages[thread.messages.length - 1].id === message?.id;
  const hasNoAIOrToolMessages = !thread.messages.find(
    (m) => m.type === "ai" || m.type === "tool",
  );
  const meta = message ? thread.getMessagesMetadata(message) : undefined;
  const threadInterrupt = thread.interrupt;

  const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;
  const anthropicStreamedToolCalls = Array.isArray(content)
    ? parseAnthropicStreamedToolCalls(content)
    : undefined;

  const hasToolCalls =
    message &&
    "tool_calls" in message &&
    message.tool_calls &&
    message.tool_calls.length > 0;
  const toolCallsHaveContents =
    hasToolCalls &&
    message.tool_calls?.some(
      (tc) => tc.args && Object.keys(tc.args).length > 0,
    );
  const hasAnthropicToolCalls = !!anthropicStreamedToolCalls?.length;
  const isToolResult = message?.type === "tool";

  if (isToolResult && hideToolCalls) {
    return null;
  }

  return (
    <div className="group mr-auto flex max-w-4xl items-start gap-3">
      <Avatar className="mt-1 h-8 w-8 bg-green-500">
        <AvatarFallback className="bg-green-500 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-1 flex-col gap-2">
        {isToolResult ? (
          <>
            <ToolResult message={message} />
            <Interrupt
              interruptValue={threadInterrupt?.value}
              isLastMessage={isLastMessage}
              hasNoAIOrToolMessages={hasNoAIOrToolMessages}
            />
          </>
        ) : (
          <>
            {contentString.length > 0 && (
              <div className="group/message relative max-w-4xl rounded-2xl bg-gray-50 px-4 py-3 shadow-sm dark:bg-slate-800 dark:shadow-slate-900/20">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <MarkdownText>{contentString}</MarkdownText>
                </div>
                <CopyButton content={contentString} />
              </div>
            )}

            {!hideToolCalls && (
              <>
                {(hasToolCalls && toolCallsHaveContents && (
                  <ToolCalls toolCalls={message.tool_calls} />
                )) ||
                  (hasAnthropicToolCalls && (
                    <ToolCalls toolCalls={anthropicStreamedToolCalls} />
                  )) ||
                  (hasToolCalls && (
                    <ToolCalls toolCalls={message.tool_calls} />
                  ))}
              </>
            )}

            {message && (
              <CustomComponent
                message={message}
                thread={thread}
              />
            )}
            <Interrupt
              interruptValue={threadInterrupt?.value}
              isLastMessage={isLastMessage}
              hasNoAIOrToolMessages={hasNoAIOrToolMessages}
            />
            {/* Timestamp sempre visível */}
            <div className="mt-1 mr-auto">
              <div className="text-xs text-gray-500">
                {new Date().toLocaleTimeString("pt-BR", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Controles (só aparecem no hover) */}
            <div
              className={cn(
                "mr-auto flex items-center gap-2 transition-opacity",
                "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
              )}
            >
              <BranchSwitcher
                branch={meta?.branch}
                branchOptions={meta?.branchOptions}
                onSelect={(branch) => thread.setBranch(branch)}
                isLoading={isLoading}
              />
              <CommandBar
                content={contentString}
                isLoading={isLoading}
                isAiMessage={true}
                handleRegenerate={() => handleRegenerate(parentCheckpoint)}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function AssistantMessageLoading() {
  return (
    <div className="mr-auto flex max-w-4xl items-start gap-3">
      <Avatar className="mt-1 h-8 w-8 bg-green-500">
        <AvatarFallback className="bg-green-500 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="bg-muted flex h-8 items-center gap-1 rounded-2xl px-4 py-2">
          <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_infinite] rounded-full"></div>
          <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_0.5s_infinite] rounded-full"></div>
          <div className="bg-foreground/50 h-1.5 w-1.5 animate-[pulse_1.5s_ease-in-out_1s_infinite] rounded-full"></div>
        </div>
        <div className="text-xs text-gray-500 opacity-60">
          IA está pensando...
        </div>
      </div>
    </div>
  );
}
