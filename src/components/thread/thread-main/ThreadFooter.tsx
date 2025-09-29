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
    <div className="fixed right-0 bottom-0 left-0 z-20 border-t border-gray-200 bg-white/95 p-4 backdrop-blur-sm dark:border-slate-700 dark:bg-slate-900/95">
      <div className="mx-auto w-full max-w-6xl">
        <div className="bg-muted rounded-2xl border border-solid shadow-sm backdrop-blur-sm transition-all dark:border-slate-600/60 dark:bg-slate-800/95 dark:shadow-lg dark:shadow-slate-900/30">
          <form
            onSubmit={handleSubmit}
            className="grid grid-rows-[1fr_auto] gap-2"
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

        {/* Dicas de teclado */}
        <div className="mt-2 flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:border-gray-600 dark:bg-gray-700">
              Enter
            </kbd>
            <span>enviar</span>
          </div>
          <div className="h-3 w-px bg-gray-300 dark:bg-gray-600"></div>
          <div className="flex items-center gap-1">
            <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:border-gray-600 dark:bg-gray-700">
              Shift
            </kbd>
            <span>+</span>
            <kbd className="rounded border border-gray-300 bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:border-gray-600 dark:bg-gray-700">
              Enter
            </kbd>
            <span>nova linha</span>
          </div>
        </div>
      </div>
    </div>
  );
}
