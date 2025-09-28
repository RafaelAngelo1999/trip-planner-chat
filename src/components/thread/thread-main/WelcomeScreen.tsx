import { motion } from "framer-motion";
import { FormEvent } from "react";

interface WelcomeScreenProps {
  input: string;
  setInput: (value: string) => void;
  handleSubmit: (e: FormEvent) => void;
}

export function WelcomeScreen({
  input,
  setInput,
  handleSubmit,
}: WelcomeScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-4">
      {/* Header principal */}
      <div className="text-center">
        <h1 className="mb-2 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-4xl font-bold text-transparent">
          Trip-IA Agent
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Seu assistente inteligente para planejamento de viagens
        </p>
      </div>

      {/* Cards dos agentes */}
      <div className="grid w-full max-w-4xl grid-cols-1 gap-6 md:grid-cols-2">
        {/* Agent Voos */}
        <motion.div
          className="group relative cursor-pointer overflow-hidden rounded-2xl border border-blue-200/60 bg-gradient-to-br from-blue-50 via-cyan-50 to-blue-100 p-6 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-blue-700/50 dark:from-slate-800 dark:via-slate-700 dark:to-blue-900/80"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setInput(
              "Quero buscar voos de GIG para LIS saindo em 01/10/2025 e voltando em 10/10/2025",
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
                  Especialista em viagens aéreas
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
                  Voos com melhores preços e horários
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-cyan-500"></div>
                <span>
                  <strong className="text-cyan-600 dark:text-cyan-400">
                    Comparar:
                  </strong>{" "}
                  Diferentes companhias aéreas
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 rounded-full bg-blue-500"></div>
                <span>
                  <strong className="text-blue-600 dark:text-blue-400">
                    Reservar:
                  </strong>{" "}
                  Processo de reserva simplificado
                </span>
              </div>
            </div>

            <div className="rounded-xl border border-blue-200/50 bg-white/80 p-3 transition-all group-hover:bg-white dark:border-blue-600/30 dark:bg-slate-700/70 dark:group-hover:bg-slate-600/80">
              <p className="mb-1 text-xs font-semibold text-gray-600 dark:text-gray-400">
                💡 Exemplo de uso:
              </p>
              <p className="text-sm leading-relaxed text-gray-700 italic dark:text-gray-300">
                "Quero buscar voos de GIG para LIS saindo em 01/10/2025 e
                voltando em 10/10/2025"
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
                "Quero buscar hotéis em SFO para check-in em 01/10/2025 e
                check-out em 10/10/2025"
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Dica adicional */}
      <div className="mb-4 text-center">
        <p className="inline-block rounded-full bg-gray-100/80 px-4 py-2 text-xs text-gray-500 dark:bg-slate-700/80 dark:text-slate-300">
          💬 <strong>Dica:</strong> Clique em um agente ou digite diretamente
          sua solicitação
        </p>
      </div>
    </div>
  );
}
