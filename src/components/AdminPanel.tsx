import { useState } from 'react';
import { 
  Database, RefreshCw, Zap, Bell, Plus, Award, AlertTriangle, Play, HelpCircle, 
  Settings, CheckCircle, ShieldAlert, FileText, ChevronRight
} from 'lucide-react';
import { TableStatus } from '../supabaseClient';
import { Comprovante, Notificacao } from '../types';

interface AdminPanelProps {
  isSupabaseLive: boolean;
  diagnosticStatus: TableStatus;
  diagnosticErrors: Record<string, string>;
  recheckConnectivity: () => Promise<void>;
  onTriggerGoalSimulation: () => void;
  onTriggerTransactionSimulation: () => void;
  onInsertPendingReceiptSimulation: () => void;
  onResetDatabaseToMock: () => void;
}

export default function AdminPanel({
  isSupabaseLive,
  diagnosticStatus,
  diagnosticErrors,
  recheckConnectivity,
  onTriggerGoalSimulation,
  onTriggerTransactionSimulation,
  onInsertPendingReceiptSimulation,
  onResetDatabaseToMock
}: AdminPanelProps) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleManualRecheck = async () => {
    setIsRefreshing(true);
    await recheckConnectivity();
    setTimeout(() => setIsRefreshing(false), 800);
  };

  return (
    <div className="flex-1 bg-[#050505] p-5 font-sans overflow-y-auto h-[calc(100vh-135px)] max-w-md mx-auto text-white text-left">
      {/* Header section with orange glow */}
      <div className="flex justify-between items-center mb-5 pb-4 border-b border-zinc-900">
        <div>
          <h2 className="text-xl font-extrabold font-display uppercase tracking-wide flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#FF5500] animate-spin" style={{ animationDuration: '6s' }} />
            <span>PAINEL ADMINISTRATIVO</span>
          </h2>
          <p className="text-[10px] font-mono tracking-widest text-[#FFD700] uppercase">
            CONTROLE SUPABASE REALTIME & AUDITORIA
          </p>
        </div>
      </div>

      {/* 1. CONNECTION DIAGNOSTICS & TELEMETRY */}
      <div className="bg-[#0e0e11] border border-zinc-900 rounded-2xl p-4 space-y-4 mb-5">
        <h3 className="text-[11px] font-mono font-bold text-zinc-500 uppercase tracking-widest">
          TELEMETRIA DE INTEGRAÇÃO SUPABASE
        </h3>

        {/* Global Connection Badge card */}
        <div className="flex items-center justify-between bg-black/60 border border-zinc-850 p-3.5 rounded-xl">
          <div className="flex items-center gap-3">
            <div className={`w-3 h-3 rounded-full ${isSupabaseLive ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-pulse'}`} />
            <div>
              <p className="text-xs font-bold font-display">Conexão com PostgreSQL</p>
              <p className="text-[9px] text-zinc-500 font-mono mt-0.5">
                URL: uotyxjztir...co
              </p>
            </div>
          </div>

          <button
            onClick={handleManualRecheck}
            disabled={isRefreshing}
            className="p-2 bg-zinc-900 border border-zinc-800 rounded-lg hover:bg-zinc-800 text-white cursor-pointer transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {/* Dynamic Schema Tables checklist status indicator */}
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          {Object.entries(diagnosticStatus).map(([tableName, exists]) => (
            <div 
              key={tableName}
              className={`p-2.5 rounded-xl border flex items-center justify-between ${
                exists 
                  ? 'bg-green-500/10 border-green-500/15 text-green-400' 
                  : 'bg-orange-500/5 border-orange-500/15 text-orange-400/80'
              }`}
            >
              <span className="capitalize">{tableName}</span>
              <span className="text-[10px] font-bold">
                {exists ? '✓ OK' : '⚠ FALLBACK'}
              </span>
            </div>
          ))}
        </div>

        {/* Graceful alerts */}
        {!isSupabaseLive && (
          <div className="bg-[#FF5500]/5 border border-[#FF5500]/15 p-3.5 rounded-xl flex items-start gap-2.5 text-[10px] leading-normal text-zinc-400">
            <AlertTriangle className="w-5 h-5 text-[#FF5500] flex-shrink-0" />
            <p>
              O Supabase está ativado no código do applet. Caso alguma tabela física ainda não exista, o aplicativo faz o chaveamento inteligente e serve dados simulados para garantir funcionamento 100% verde!
            </p>
          </div>
        )}
      </div>

      {/* 2. REALTIME SIMULATION EVENT TRIGGER CONTROL CENTER */}
      <div className="space-y-3.5 mb-6">
        <h3 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
          CENTRO DE SIMULAÇÕES E DISPAROS
        </h3>
        <p className="text-[11px] text-zinc-500 leading-normal">
          Use os botões para simular o recebimento de dados em tempo real ou injetar registros para demonstração rápida do dashboard:
        </p>

        <div className="space-y-2.5">
          {/* Action 1 */}
          <button
            onClick={onTriggerGoalSimulation}
            className="w-full bg-[#121214] border border-zinc-850 hover:border-yellow-400/40 p-4.5 rounded-2xl text-left flex items-center justify-between group transition-all select-none cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="bg-yellow-400 p-2.5 rounded-xl text-black">
                <Play className="w-4.5 h-4.5 fill-black" />
              </div>
              <div>
                <h4 className="text-xs font-bold group-hover:text-[#FFD700] transition-colors font-display">Apoiar Gol na Copa da Várzea</h4>
                <p className="text-[10px] text-zinc-500 mt-1 font-sans">Muda placar da copa e dispara alerta vibratório flutuante.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Action 2 */}
          <button
            onClick={onTriggerTransactionSimulation}
            className="w-full bg-[#121214] border border-zinc-850 hover:border-[#FF5500]/40 p-4.5 rounded-2xl text-left flex items-center justify-between group transition-all select-none cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="bg-[#FF5500] p-2.5 rounded-xl text-white">
                <Plus className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <h4 className="text-xs font-bold group-hover:text-orange-500 transition-colors font-display">Forçar Alerta de Pontos</h4>
                <p className="text-[10px] text-zinc-500 mt-1 font-sans">Simula o ganho de pontos de apoio na carteira digital de Luiz Prates.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
          </button>

          {/* Action 3 */}
          <button
            onClick={onInsertPendingReceiptSimulation}
            className="w-full bg-[#121214] border border-zinc-850 hover:border-green-500/40 p-4.5 rounded-2xl text-left flex items-center justify-between group transition-all select-none cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-xl text-green-500">
                <FileText className="w-4.5 h-4.5 text-green-500" />
              </div>
              <div>
                <h4 className="text-xs font-bold group-hover:text-green-400 transition-colors font-display">Injetar Cupom Pendente</h4>
                <p className="text-[10px] text-zinc-500 mt-1 font-sans">Adiciona uma guia fiscal para auditoria ativa do Bar do Bigode.</p>
              </div>
            </div>
            <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 3. DIAGNOSTIC ERRORS COLLAPSIBLE PANEL */}
      {Object.keys(diagnosticErrors).length > 0 && (
        <div className="bg-zinc-950 border border-zinc-900 rounded-2xl p-4">
          <h4 className="text-[10px] font-mono font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-red-500 animate-pulse" />
            <span>LOGS DE BANCO DETECTADOS</span>
          </h4>

          <div className="space-y-2 text-[10px] font-mono border-t border-zinc-900 pt-3 text-zinc-400 max-h-40 overflow-y-auto">
            {Object.entries(diagnosticErrors).map(([tbl, errMsg]) => (
              <div key={tbl} className="leading-relaxed border-b border-zinc-900/40 pb-2">
                <span className="text-yellow-400 font-bold uppercase">{tbl}:</span> {errMsg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reset button section */}
      <div className="mt-5 text-center leading-normal">
        <button
          onClick={onResetDatabaseToMock}
          className="text-xs text-zinc-600 hover:text-[#FF5500] font-mono tracking-wider hover:underline transition-all select-none cursor-pointer"
        >
          Limpar Comprovantes Locais (Restaurar Mock Inicial)
        </button>
      </div>
    </div>
  );
}
