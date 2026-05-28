import { Trophy, RefreshCw, Zap, Users, ShieldAlert } from 'lucide-react';
import { Copa } from '../types';

interface LiveFootballTickerProps {
  copas: Copa[];
  activeConnectionsCount: number;
  triggerMockEvent: () => void;
  isSupabaseLive: boolean;
}

export default function LiveFootballTicker({ copas, activeConnectionsCount, triggerMockEvent, isSupabaseLive }: LiveFootballTickerProps) {
  const activeGames = copas.find(c => c.status === 'em_andamento')?.jogos_atrativos || [];

  return (
    <div className="bg-black/90 border-b border-[#FF5500]/15 font-display text-white relative">
      {/* Live Marquee Header */}
      <div className="flex items-center justify-between px-4 py-1.5 bg-[#FF5500]/5 text-[11px] border-b border-white/5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
          </span>
          <span className="font-mono text-[10px] text-zinc-400">
            TRANSMISSÃO AO VIVO DA VÁRZEA (RODADA COPA)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] text-zinc-500 flex items-center gap-1">
            <Users className="w-3 h-3 text-[#FFD700]" />
            <span className="font-mono text-white font-medium">{activeConnectionsCount}</span> online
          </span>
          <div className={`w-1.5 h-1.5 rounded-full ${isSupabaseLive ? 'bg-green-500' : 'bg-amber-500'}`} />
        </div>
      </div>

      {/* Score Ticker horizontal listing */}
      <div className="no-scrollbar overflow-x-auto flex items-center divide-x divide-white/10 px-2 py-3 select-none">
        {activeGames.length > 0 ? (
          activeGames.map((game, idx) => (
            <div key={game.id || idx} className="flex-shrink-0 px-4 flex items-center gap-4.5">
              {/* League tag */}
              <div className="flex flex-col">
                <span className="text-[9px] font-mono text-yellow-400 uppercase font-semibold">Copa Terrão</span>
                <span className="text-[11px] font-mono text-[#FF5500] font-bold animate-pulse">{game.tempo}</span>
              </div>

              {/* Match Teams & Score */}
              <div className="flex items-center gap-3">
                <div className="flex flex-col items-end">
                  <span className="text-xs font-bold font-display max-w-[100px] truncate">{game.time1}</span>
                </div>

                <div className="bg-[#121214] border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5">
                  <span className="text-sm font-extrabold text-[#FFD700] font-mono">{game.score1 ?? '-'}</span>
                  <span className="text-[10px] text-zinc-600 font-mono">x</span>
                  <span className="text-sm font-extrabold text-[#FFD700] font-mono">{game.score2 ?? '-'}</span>
                </div>

                <div className="flex flex-col items-start">
                  <span className="text-xs font-bold font-display max-w-[100px] truncate">{game.time2}</span>
                </div>
              </div>

              {/* Animated Live tag */}
              {game.ao_vivo && (
                <span className="bg-red-600/10 text-red-500 border border-red-500/20 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider animate-pulse flex items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-red-500 animate-ping" />
                  Live
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="px-4 py-1 text-xs text-zinc-400 font-medium">
            Nenhum jogo em andamento no momento. Próxima rodada no Sábado 14h!
          </div>
        )}

        {/* Quick simulator widget block */}
        <div className="flex-shrink-0 px-4 flex items-center">
          <button
            onClick={triggerMockEvent}
            className="text-[11px] bg-gradient-to-r from-[#FF5500]/20 to-[#FFD700]/20 hover:from-[#FF5500]/40 hover:to-[#FFD700]/40 border border-[#FF5500]/30 text-white font-bold py-1 px-3 rounded-full flex items-center gap-1.5 cursor-pointer select-none"
          >
            <RefreshCw className="w-3 h-3 text-[#FF5500] animate-spin" style={{ animationDuration: '4s' }} />
            <span>Verificar Novidades</span>
          </button>
        </div>
      </div>
    </div>
  );
}
