import { FormEvent, useRef } from "react";
import { Button } from "../../ui/button";
import { LoaderCircle, XIcon } from "lucide-react";

interface ThreadFooterProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
  isLoading: boolean;
  stop: () => void;
  threadId: string | null;
  chatStarted: boolean;
}

export function ThreadFooter({
  input,
  setInput,
  handleSubmit,
  isLoading,
  stop,
  threadId,
  chatStarted,
}: ThreadFooterProps) {
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    const textarea = inputRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) {
        const form = document.querySelector("form");
        form?.requestSubmit();
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    adjustTextareaHeight();
  };

  return (
    <div className="bg-muted relative z-10 mx-auto mb-6 w-full max-w-5xl rounded-2xl border border-solid shadow-sm backdrop-blur-sm transition-all dark:border-slate-600/60 dark:bg-slate-800/95 dark:shadow-lg dark:shadow-slate-900/30">
      <form
        onSubmit={handleSubmit}
        className="mx-auto grid max-w-5xl grid-rows-[1fr_auto] gap-2"
      >
        <textarea
          ref={inputRef}
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          rows={1}
          className="w-full resize-none rounded-2xl border-0 bg-transparent p-4 text-base placeholder:text-gray-500 focus:ring-0 focus:outline-none dark:text-white dark:placeholder:text-gray-400"
          placeholder={
            !threadId
              ? "Digite sua pergunta sobre viagens ou clique em um dos agentes acima..."
              : "Digite sua mensagem..."
          }
          style={{ minHeight: "52px", maxHeight: "120px" }}
        />

        <div className="flex items-center justify-end gap-2 p-2">
          <div className="flex items-center gap-2">
            {isLoading && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={stop}
                className="flex items-center gap-2"
              >
                <XIcon className="h-4 w-4" />
                Parar
              </Button>
            )}

            <Button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600 disabled:opacity-50"
            >
              {isLoading ? (
                <LoaderCircle className="h-4 w-4 animate-spin" />
              ) : (
                "Enviar"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
