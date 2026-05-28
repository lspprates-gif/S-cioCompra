import React from 'react';
import { Sparkles, ShoppingBag, Trophy } from 'lucide-react';
import { useVarzea } from '../hooks/useVarzea';
import { DashboardUsuario, DashboardEmpresa, DashboardClube } from '../components/Dashboards';
import AdminPanel from '../components/AdminPanel';
import ContactsManager from '../components/ContactsManager';

export const PerfilTab: React.FC = () => {
  const {
    setCadastroEmpresaOpen,
    setCadastroClubeOpen,
    activePersona,
    setActivePersona,
    activeUser,
    comprovantes,
    empresas,
    currentEmpresaId,
    handleReviewComprovanteByEmployer,
    times,
    currentTimeId,
    isSupabaseLive,
    diagnosticStatus,
    diagnosticErrors,
    hydrateDatabase,
    simulateLiveGoalMatch,
    simulateTransactionPulse,
    simulatePendingReceiptInjection,
    handleResetDatabaseToMock,
    currentUserId,
    contatos,
    handleAddContato,
    handleUpdateContato,
    handleDeleteContato
  } = useVarzea();

  return (
    <div className="flex-1 bg-[#050505] p-5 overflow-y-auto space-y-6 text-left font-sans no-scrollbar">
      
      {/* 🚀 QUICK ACTION FOR COMPANY & CLUB INTEGRATIONS */}
      <div className="bg-gradient-to-r from-[#0C0C0E] to-[#121215] border border-zinc-900 rounded-2xl p-4.5 space-y-3.5 relative overflow-hidden shadow-xl select-none">
        <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5500]/5 rounded-full blur-2xl pointer-events-none" />
        
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
          <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest leading-none">
            Seja um Parceiro Oficial
          </h4>
        </div>
        
        <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[90%]">
          Divulgue sua empresa para atrair novos clientes ou cadastre seu clube no nosso ecossistema de torcedores!
        </p>
        
        <div className="grid grid-cols-2 gap-2.5 pt-1">
          <button
            onClick={() => setCadastroEmpresaOpen(true)}
            className="py-2.5 px-3 bg-[#FF5500]/10 hover:bg-[#FF5500]/20 border border-[#FF5500]/30 hover:border-[#FF5500]/70 rounded-xl text-xs font-black font-display text-[#FF5500] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-center duration-200"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Cadastrar Empresa</span>
          </button>
          
          <button
            onClick={() => setCadastroClubeOpen(true)}
            className="py-2.5 px-3 bg-[#FFD700]/5 hover:bg-[#FFD700]/15 border border-zinc-900 hover:border-[#FFD700]/40 rounded-xl text-xs font-black font-display text-[#FFD700] hover:text-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer text-center duration-200"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>Cadastrar Clube</span>
          </button>
        </div>
      </div>

      {/* Persona choice segments */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-mono font-bold text-[#FF5500] uppercase tracking-widest select-none">
          MUDAR PAINEL DO SISTEMA
        </h4>
        
        {/* Grid workspace selector selectors */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-[#0E0E10] border border-zinc-800/85 rounded-xl">
          {/* Torcedor */}
          <button
            onClick={() => setActivePersona('usuario')}
            className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
              activePersona === 'usuario' 
                ? 'bg-[#FF5500] text-white shadow-md font-black animate-fadeIn' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Usuário
          </button>

          {/* Empresa */}
          <button
            onClick={() => setActivePersona('empresa')}
            className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
              activePersona === 'empresa' 
                ? 'bg-[#FF5500] text-white shadow-md font-black animate-fadeIn' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Pilar
          </button>

          {/* Clube */}
          <button
            onClick={() => setActivePersona('clube')}
            className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
              activePersona === 'clube' 
                ? 'bg-[#FF5500] text-white shadow-md font-black animate-fadeIn' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Clube
          </button>

          {/* Admin */}
          <button
            onClick={() => setActivePersona('admin')}
            className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
              activePersona === 'admin' 
                ? 'bg-[#FF5500] text-white shadow-md font-black animate-fadeIn' 
                : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Controle
          </button>
        </div>
      </div>

      {/* Display respective dynamic dashboard views matches persona */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
        <div className="space-y-6">
          {activePersona === 'usuario' && (
            <DashboardUsuario 
              usuario={activeUser} 
              comprovantes={comprovantes} 
            />
          )}

          {activePersona === 'empresa' && empresas.length > 0 && (
            <DashboardEmpresa 
              empresa={empresas.find(e => e.id === currentEmpresaId) || empresas[0]}
              comprovantes={comprovantes}
              movimentacoes={[]}
              onReviewComprovante={handleReviewComprovanteByEmployer}
            />
          )}

          {activePersona === 'clube' && times.length > 0 && (
            <DashboardClube 
              time={times.find(t => t.id === currentTimeId) || times[0]}
              comprovantes={comprovantes}
            />
          )}

          {activePersona === 'admin' && (
            <AdminPanel 
              isSupabaseLive={isSupabaseLive}
              diagnosticStatus={diagnosticStatus}
              diagnosticErrors={diagnosticErrors}
              recheckConnectivity={hydrateDatabase}
              onTriggerGoalSimulation={simulateLiveGoalMatch}
              onTriggerTransactionSimulation={simulateTransactionPulse}
              onInsertPendingReceiptSimulation={simulatePendingReceiptInjection}
              onResetDatabaseToMock={handleResetDatabaseToMock}
            />
          )}
        </div>

        {activePersona !== 'admin' && (
          <ContactsManager 
            entityId={activePersona === 'usuario' ? currentUserId : (activePersona === 'empresa' ? currentEmpresaId : currentTimeId)}
            entityType={activePersona === 'usuario' ? 'usuario' : (activePersona === 'empresa' ? 'empresa' : 'clube')}
            contatos={contatos}
            onAddContato={handleAddContato}
            onUpdateContato={handleUpdateContato}
            onDeleteContato={handleDeleteContato}
          />
        )}
      </div>
    </div>
  );
};
export default PerfilTab;
