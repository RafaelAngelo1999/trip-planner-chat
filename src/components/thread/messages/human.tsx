import { useStreamContext } from "@/hooks";
import { Message } from "@langchain/langgraph-sdk";
import { useState } from "react";
import { getContentString } from "../utils";
import { cn } from "@/lib";
import { Textarea } from "@/components/ui/textarea";
import { BranchSwitcher, CommandBar } from "./shared";
import { MultimodalPreview } from "@/components/thread/multimodal-preview";
import { isBase64ContentBlock } from "@/lib/multimodal-utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, AlertCircle, CheckCircle, Clock, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

function EditableContent({
  value,
  setValue,
  onSubmit,
}: {
  value: string;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  onSubmit: () => void;
}) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <Textarea
      value={value}
      onChange={(e) => setValue(e.target.value)}
      onKeyDown={handleKeyDown}
      className="focus-visible:ring-0"
    />
  );
}

export function HumanMessage({
  message,
  isLoading,
}: {
  message: Message;
  isLoading: boolean;
}) {
  const thread = useStreamContext();
  const meta = thread.getMessagesMetadata(message);
  const parentCheckpoint = meta?.firstSeenState?.parent_checkpoint;

  const [isEditing, setIsEditing] = useState(false);
  const [value, setValue] = useState("");
  const [messageStatus, setMessageStatus] = useState<
    "sent" | "sending" | "error"
  >("sent");
  const contentString = getContentString(message.content);

  const handleSubmitEdit = () => {
    setIsEditing(false);
    setMessageStatus("sending");

    const newMessage: Message = { type: "human", content: value };
    const context = { language: thread.language };

    thread
      .submit(
        { messages: [newMessage], context },
        {
          checkpoint: parentCheckpoint,
          streamMode: ["values"],
          streamSubgraphs: true,
          streamResumable: true,
          optimisticValues: (prev) => {
            const values = meta?.firstSeenState?.values;
            if (!values) return prev;

            return {
              ...values,
              messages: [...(values.messages ?? []), newMessage],
            };
          },
        },
      )
      .then(() => setMessageStatus("sent"))
      .catch(() => setMessageStatus("error"));
  };

  const handleRetry = () => {
    setMessageStatus("sending");
    const context = { language: thread.language };

    thread
      .submit(
        { messages: [message], context },
        {
          checkpoint: parentCheckpoint,
          streamMode: ["values"],
          streamSubgraphs: true,
          streamResumable: true,
        },
      )
      .then(() => setMessageStatus("sent"))
      .catch(() => setMessageStatus("error"));
  };

  return (
    <div
      className={cn(
        "group ml-auto flex max-w-4xl items-start gap-3",
        isEditing && "w-full",
      )}
    >
      <div className={cn("flex flex-1 flex-col gap-2", isEditing && "w-full")}>
        {isEditing ? (
          <EditableContent
            value={value}
            setValue={setValue}
            onSubmit={handleSubmitEdit}
          />
        ) : (
          <div className="flex flex-col gap-2">
            {/* Render images and files if no text */}
            {Array.isArray(message.content) && message.content.length > 0 && (
              <div className="flex flex-wrap items-end justify-end gap-2">
                {message.content.reduce<React.ReactNode[]>(
                  (acc, block, idx) => {
                    if (isBase64ContentBlock(block)) {
                      acc.push(
                        <MultimodalPreview
                          key={idx}
                          block={block}
                          size="md"
                        />,
                      );
                    }
                    return acc;
                  },
                  [],
                )}
              </div>
            )}
            {/* Render text if present, otherwise fallback to file/image name */}
            {contentString ? (
              <div className="ml-auto w-fit max-w-md rounded-2xl bg-blue-500 px-4 py-3 text-right whitespace-pre-wrap text-white shadow-sm">
                {contentString}
              </div>
            ) : null}
          </div>
        )}

        {/* Timestamp sempre visível */}
        <div className="mb-1 ml-auto">
          <div className="flex items-center justify-end gap-2">
            <div className="text-xs text-gray-500">
              {new Date().toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
            {messageStatus === "sending" && (
              <Clock className="h-3 w-3 animate-pulse text-blue-500" />
            )}
            {messageStatus === "sent" && (
              <CheckCircle className="h-3 w-3 text-green-500" />
            )}
            {messageStatus === "error" && (
              <div className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3 text-red-500" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleRetry}
                  className="h-5 px-2 text-xs text-red-500 hover:text-red-700"
                >
                  <RotateCcw className="mr-1 h-3 w-3" />
                  Retry
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Controles (só aparecem no hover) */}
        <div
          className={cn(
            "ml-auto flex items-center gap-2 transition-opacity",
            "opacity-0 group-focus-within:opacity-100 group-hover:opacity-100",
            isEditing && "opacity-100",
          )}
        >
          <BranchSwitcher
            branch={meta?.branch}
            branchOptions={meta?.branchOptions}
            onSelect={(branch) => thread.setBranch(branch)}
            isLoading={isLoading}
          />
          <CommandBar
            isLoading={isLoading}
            content={contentString}
            isEditing={isEditing}
            setIsEditing={(c) => {
              if (c) {
                setValue(contentString);
              }
              setIsEditing(c);
            }}
            handleSubmitEdit={handleSubmitEdit}
            isHumanMessage={true}
          />
        </div>
      </div>
      <Avatar className="h-8 w-8 bg-blue-500">
        <AvatarFallback className="bg-blue-500 text-white">
          <User className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
