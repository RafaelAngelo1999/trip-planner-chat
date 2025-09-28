import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="mr-auto flex max-w-4xl items-start gap-3">
      <Avatar className="mt-1 h-8 w-8 bg-green-500">
        <AvatarFallback className="bg-green-500 text-white">
          <Bot className="h-4 w-4" />
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col gap-2">
        <div className="max-w-4xl rounded-2xl bg-gray-50 px-4 py-3 shadow-sm dark:bg-slate-800 dark:shadow-slate-900/20">
          <div className="flex items-center space-x-1">
            <div className="flex space-x-1">
              <div className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-slate-500"></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-slate-500"
                style={{ animationDelay: "0.1s" }}
              ></div>
              <div
                className="h-2 w-2 animate-bounce rounded-full bg-gray-400 dark:bg-slate-500"
                style={{ animationDelay: "0.2s" }}
              ></div>
            </div>
            <span className="ml-2 text-sm text-gray-500 dark:text-slate-400">
              IA está digitando...
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
