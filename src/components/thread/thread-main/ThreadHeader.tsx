import { Button } from "../../ui/button";
import { TripIAIcon } from "../../icons/trip-ia";
import { Settings, History, Plus } from "lucide-react";
import { motion } from "framer-motion";

interface ThreadHeaderProps {
  chatStarted: boolean;
  isLargeScreen: boolean;
  chatHistoryOpen: boolean;
  setChatHistoryOpen: (value: boolean | ((prev: boolean) => boolean)) => void;
  setThreadId: (id: string | null) => void;
  setSettingsOpen: (open: boolean) => void;
  showThreadHistory: boolean;
}

export function ThreadHeader({
  chatStarted,
  isLargeScreen,
  chatHistoryOpen,
  setChatHistoryOpen,
  setThreadId,
  setSettingsOpen,
  showThreadHistory,
}: ThreadHeaderProps) {
  if (!chatStarted) {
    return (
      <div className="absolute top-0 left-0 z-10 flex h-[72px] w-full items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:border-slate-600/30 dark:from-slate-900/95 dark:to-slate-800/95">
        <div className="flex items-center gap-1">
          {showThreadHistory && (!chatHistoryOpen || !isLargeScreen) && (
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
    );
  }

  return (
    <div className="relative z-10 flex h-[72px] items-center justify-between gap-3 border-b border-blue-100 bg-gradient-to-r from-blue-50 to-cyan-50 p-4 dark:border-slate-600/30 dark:from-slate-900/95 dark:to-slate-800/95">
      <div className="relative flex items-center justify-start gap-3">
        <div className="flex items-center gap-1">
          {showThreadHistory && (!chatHistoryOpen || !isLargeScreen) && (
            <Button
              className="hover:bg-blue-100 dark:hover:bg-slate-700/50"
              variant="ghost"
              size="sm"
              onClick={() => setChatHistoryOpen((p) => !p)}
            >
              <History className="mr-1 size-4" />
              {isLargeScreen ? (chatHistoryOpen ? "Fechar" : "Histórico") : ""}
            </Button>
          )}
        </div>
        <motion.button
          className="flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-blue-100 dark:hover:bg-slate-700/50"
          onClick={() => setThreadId(null)}
          animate={{
            marginLeft: !chatHistoryOpen && showThreadHistory ? 0 : 0,
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
  );
}
