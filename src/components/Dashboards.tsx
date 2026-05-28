import { useState, useEffect } from 'react';
import { 
  Building, Shield, Coins, AlertCircle, CheckCircle, XCircle, TrendingUp, Users, 
  ArrowRightLeft, Wallet, ShieldAlert, Award, FileText, Check, X, ShieldCheck
} from 'lucide-react';
import { Time, Empresa, Usuario, Comprovante, FinanceiroMovimentacao } from '../types';

// ==========================================
// 1. DASHBOARD EMPRESA (BUSINESS SPONSOR)
// ==========================================

interface DashboardEmpresaProps {
  empresa: Empresa;
  comprovantes: Comprovante[];
  movimentacoes: FinanceiroMovimentacao[];
  onReviewComprovante: (id: string, status: 'aprovado' | 'rejeitado') => void;
}

export function DashboardEmpresa({ empresa, comprovantes, movimentacoes, onReviewComprovante }: DashboardEmpresaProps) {
  // Filter receipts matching this enterprise
  const mineComprovantes = comprovantes.filter(c => c.empresa_id === empresa.id);
  const pendingComprovantes = mineComprovantes.filter(c => c.status === 'pendente');
  const totalSales = mineComprovantes.filter(c => c.status === 'aprovado').reduce((sum, c) => sum + c.valor, 0);
  const totalCommissionClub = mineComprovantes.filter(c => c.status === 'aprovado').reduce((sum, c) => sum + c.comissao_clube_gerado, 0);

  return (
    <div className="space-y-5 text-white text-left font-sans max-w-md mx-auto">
      {/* Header Info */}
      <div className="flex items-center gap-3 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-900">
        <img 
          src={empresa.logo} 
          alt={empresa.nome} 
          referrerPolicy="no-referrer"
          className="w-11 h-11 rounded-xl object-cover border border-[#FF5500]" 
        />
        <div>
          <h3 className="font-extrabold text-sm tracking-tight font-display">{empresa.nome}</h3>
          <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-yellow-400">
            CNPJ: {empresa.cnpj || '35.260.517/0001-22'}
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-[#0e0e11] border border-zinc-900 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[8px] text-zinc-500 uppercase font-semibold">Vendas Aprov</span>
          <span className="text-sm font-bold text-white font-mono mt-1">
            R$ {totalSales.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#0e0e11] border border-zinc-900 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[8px] text-zinc-500 uppercase font-semibold">Apoio a Times</span>
          <span className="text-sm font-bold text-yellow-500 font-mono mt-1">
            R$ {totalCommissionClub.toFixed(2)}
          </span>
        </div>

        <div className="bg-[#FF5500]/10 border border-[#FF5500]/25 p-3 rounded-xl flex flex-col justify-between">
          <span className="text-[8px] text-orange-400 uppercase font-bold">Pendentes</span>
          <span className="text-sm font-bold text-white font-mono mt-1 animate-pulse">
            {pendingComprovantes.length} Guia
          </span>
        </div>
      </div>

      {/* Sales Graph Miniature (Custom SVG) */}
      <div className="bg-[#0C0C0E] border border-zinc-900 p-4 rounded-2xl">
        <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase mb-3 flex items-center justify-between">
          <span>VOLUME DE VENDAS DIÁRIO</span>
          <span className="text-[#FF5500]">REALTIME SECURE</span>
        </h4>
        
        {/* Custom SVG Bar charts */}
        <div className="h-28 flex items-end gap-3.5 pt-4">
          {[40, 75, 50, 90, 65, 80, 100].map((val, idx) => (
            <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
              <div 
                className="w-full bg-gradient-to-t from-orange-600 via-orange-500 to-[#FFD700] rounded-md relative group transition-all cursor-pointer"
                style={{ height: `${val}%` }}
              >
                {/* Hover value indicator */}
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-black border border-white/10 px-1 py-0.5 rounded text-[8px] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                  {val}%
                </div>
              </div>
              <span className="text-[8px] font-mono text-zinc-600">D-{6 - idx}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Review Section */}
      <div className="space-y-3.5">
        <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider border-l-2 border-[#FF5500] pl-2">
          COMPROVANTES AGUARDANDO AUDITORIA ({pendingComprovantes.length})
        </h4>

        {pendingComprovantes.length > 0 ? (
          <div className="space-y-3">
            {pendingComprovantes.map(comp => (
              <div 
                key={comp.id}
                className="bg-[#0e0e11] border border-zinc-850 p-4 rounded-xl flex flex-col gap-3"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h5 className="text-xs font-bold font-display text-white">{comp.usuario_nome}</h5>
                    <span className="text-[9px] text-[#FFD700] font-mono font-semibold uppercase mt-0.5 block">
                      Apoio: {comp.time_nome}
                    </span>
                  </div>
                  <span className="text-xs font-extrabold text-white font-mono bg-black/60 px-2.5 py-1 rounded-md">
                    R$ {comp.valor.toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-2 font-mono text-[9px] text-zinc-500 border-y border-zinc-900 py-1.5 leading-normal">
                  <span>NFE: {comp.chave_nfe?.substring(0, 15)}...</span>
                  <span className="text-zinc-700">•</span>
                  <span>Data: {new Date(comp.data_compra).toLocaleDateString('pt-BR')}</span>
                </div>

                {/* Audit Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => onReviewComprovante(comp.id, 'rejeitado')}
                    className="flex-1 bg-red-600/10 border border-red-500/20 hover:bg-red-500 hover:text-black py-2 rounded-lg cursor-pointer text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    <X className="w-3.5 h-3.5 text-red-500 hover:text-black" />
                    <span>Recusar</span>
                  </button>

                  <button
                    onClick={() => onReviewComprovante(comp.id, 'aprovado')}
                    className="flex-1 bg-green-600/10 border border-green-500/20 hover:bg-green-500 hover:text-black py-2 rounded-lg cursor-pointer text-[10px] font-bold uppercase transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5 text-green-500 hover:text-black" />
                    <span>Aprovar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-950/40 border border-zinc-900 rounded-xl">
            <CheckCircle className="w-8 h-8 text-green-500 mx-auto select-none animate-pulse" />
            <p className="text-xs text-zinc-500 font-semibold mt-2">Nenhum comprovante pendente! Seu comércio está atualizado.</p>
          </div>
        )}
      </div>
    </div>
  );
}


// ==========================================
// 2. DASHBOARD CLUBE (FOOTBALL CLUB DESK)
// ==========================================

interface DashboardClubeProps {
  time: Time;
  comprovantes: Comprovante[];
}

export function DashboardClube({ time, comprovantes }: DashboardClubeProps) {
  // Supports receipts
  const mineComprovantes = comprovantes.filter(c => c.time_id === time.id && c.status === 'aprovado');
  const supportersJoined = time.membros_count || 120;
  const cumulativeCommissions = mineComprovantes.reduce((sum, c) => sum + c.comissao_clube_gerado, 0);

  // Mock Squad list for community-vibe "Sócio Torcedor"
  const squads = [
    { name: 'Xandão da Meuca', pos: 'Camisa 10 (Meia)', points: 420 },
    { name: 'Cleitinho do Vácuo', pos: 'Ponta Esquerda', points: 310 },
    { name: 'Tião Canela de Aço', pos: 'Zagueiro Central', points: 190 }
  ];

  return (
    <div className="space-y-5 text-white text-left font-sans max-w-md mx-auto">
      {/* Header with Club Badge mockup */}
      <div className="flex items-center gap-3 bg-zinc-950/60 p-4 rounded-2xl border border-zinc-900 relative overflow-hidden">
        {/* Glow color background */}
        <div className="absolute -right-2 top-0 w-24 h-24 rounded-full bg-orange-600/10 blur-xl pointer-events-none" />
        
        <img 
          src={time.logo} 
          alt={time.nome} 
          referrerPolicy="no-referrer"
          className="w-11 h-11 rounded-full object-cover border border-yellow-400 flex-shrink-0" 
        />
        <div>
          <h3 className="font-extrabold text-sm tracking-tight font-display">{time.nome}</h3>
          <p className="text-[10px] text-zinc-500 font-mono">Bairro: {time.bairro} • Fundado em {time.fundacao || '2004'}</p>
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#0e0e11] border border-zinc-900 p-4.5 rounded-xl flex items-center gap-3">
          <div className="bg-yellow-400 p-2.5 rounded-lg text-black">
            <Users className="w-5 h-5 text-black" />
          </div>
          <div>
            <span className="text-[9px] text-[#A0A0AB] uppercase">Torcedores Ativos</span>
            <span className="text-sm font-extrabold text-white font-mono block tracking-tight mt-0.5">
              {supportersJoined} Sócios
            </span>
          </div>
        </div>

        <div className="bg-[#0e0e11] border border-zinc-900 p-4.5 rounded-xl flex items-center gap-3">
          <div className="bg-green-500/10 border border-green-500/20 p-2.5 rounded-lg">
            <Coins className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <span className="text-[9px] text-zinc-500 uppercase">Fundo Arrecadado</span>
            <span className="text-sm font-extrabold text-green-500 font-mono block tracking-tight mt-0.5">
              R$ {cumulativeCommissions.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Stadium details */}
      <div className="bg-[#0C0C0E] border border-zinc-900 p-4 rounded-2xl leading-normal text-xs space-y-2">
        <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-[#FFD700]" />
          <span>ESTÁDIO PARCEIRO</span>
        </h4>
        <p className="font-semibold text-white font-display text-sm">{time.estadio || 'Campo do Terrão Central'}</p>
        <p className="text-zinc-500 leading-relaxed text-[11px]">
          Fundo Sócio Compra reverte 5% de cada compra em bolas, coletes, reforma de alambrados e lavagem de uniformes oficiais.
        </p>
      </div>

      {/* Squad Supporter leaders review */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider border-l-2 border-yellow-400 pl-2">
          ELITE DO TIME DA VÁRZEA (DESTAQUES)
        </h4>

        <div className="space-y-2">
          {squads.map((player, idx) => (
            <div 
              key={idx}
              className="bg-[#0e0e11] border border-zinc-900 p-3.5 rounded-xl flex justify-between items-center"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-xs font-mono font-bold text-[#FF5500]">0{idx+1}</span>
                <div>
                  <h5 className="text-xs font-bold text-white">{player.name}</h5>
                  <span className="text-[10px] text-zinc-500 font-mono">{player.pos}</span>
                </div>
              </div>

              <span className="text-[11px] font-mono bg-zinc-900 border border-zinc-800 px-2 py-1 rounded text-yellow-400 font-bold">
                ✓ Ativo
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


// ==========================================
// 3. DASHBOARD USUÁRIO (PERSONAL WALLET)
// ==========================================

interface DashboardUsuarioProps {
  usuario: Usuario;
  comprovantes: Comprovante[];
}

export function DashboardUsuario({ usuario, comprovantes }: DashboardUsuarioProps) {
  // Filter receipts matching this user
  const mineComprovantes = comprovantes.filter(c => c.usuario_id === usuario.id);
  const totalVerifiedSpent = mineComprovantes.filter(c => c.status === 'aprovado').reduce((sum, c) => sum + c.valor, 0);

  return (
    <div className="space-y-5 text-white text-left font-sans max-w-md mx-auto">
      {/* Wallet balance display banner */}
      <div className="orange-glow bg-gradient-to-r from-zinc-950 to-zinc-900 border border-[#FF5500]/20 p-5 rounded-3xl relative overflow-hidden flex flex-col justify-between min-h-[140px]">
        
        {/* Absolute brand symbol in corner decor */}
        <Coins className="w-32 h-32 text-orange-500/10 absolute -right-6 -bottom-6 pointer-events-none stroke-[1]" />

        <div className="flex justify-between items-start z-10">
          <div>
            <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-black leading-none">
              PAINEL DO SÓCIO APOIADOR
            </span>
            <p className="text-xs text-zinc-400 font-semibold font-sans mt-1">Meus Pontos Acumulados</p>
          </div>

          <div className="bg-orange-500/10 text-[#FF5500] border border-[#FF5500]/25 px-3 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1 select-none">
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
            <span>PONTOS ATIVOS</span>
          </div>
        </div>

        <div className="mt-6 z-10 flex justify-between items-end">
          <div>
            <span className="text-3xl font-extrabold tracking-tight font-display text-white">
              {usuario.saldo_pontos?.toLocaleString() || 12450} <span className="text-xs text-zinc-400 font-mono font-normal">Pts</span>
            </span>
          </div>

          <button
            onClick={() => alert('Seus pontos contribuem diretamente para destacar seu time do coração no Ranking oficial da várzea!')}
            className="text-[11px] bg-[#FF5500] hover:bg-orange-600 text-white font-black font-display uppercase tracking-widest px-4 py-2 rounded-xl cursor-pointer select-none border-0 shadow-md transition-all active:scale-95"
          >
            COMO FUNCIONA?
          </button>
        </div>
      </div>

      {/* Tier Level Progression bar tracker */}
      <div className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between items-center select-none">
          <div className="flex items-center gap-1.5">
            <Award className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-[11px] font-mono uppercase font-bold text-white">Nível {usuario.nivel || 6}: Cria do Terrão</span>
          </div>
          <span className="text-[10px] font-mono text-yellow-400 font-bold">{usuario.saldo_pontos?.toLocaleString()} Pts</span>
        </div>

        {/* Real progress line */}
        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFD700] rounded-full"
            style={{ width: '65%' }}
          />
        </div>
        <p className="text-[9px] text-[#A0A0AB] leading-relaxed">
          Ganhe mais 750 pontos comprando em Bar de Bigode para subir para o Nível 7 (Cria Profissional) e aumentar seu multiplicador de pontos para 1.2x.
        </p>
      </div>

      {/* Verified receipts history feed */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold font-display text-white uppercase tracking-wider border-l-2 border-[#FF5500] pl-2">
          MEUS COMPROVANTES ENVIADOS ({mineComprovantes.length})
        </h4>

        {mineComprovantes.length > 0 ? (
          <div className="space-y-2.5">
            {mineComprovantes.map(comp => (
              <div 
                key={comp.id}
                className="bg-[#0e0e11] border border-zinc-900 p-3.5 rounded-xl flex items-center justify-between hover:bg-zinc-900/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 pr-1">
                  <div className="p-2 bg-zinc-900 rounded-lg flex-shrink-0">
                    <FileText className="w-4.5 h-4.5 text-[#FF5500]" />
                  </div>
                  <div className="text-left min-w-0">
                    <h5 className="text-xs font-bold text-white truncate max-w-[170px]">
                      {comp.empresa_nome}
                    </h5>
                    <p className="text-[9px] text-zinc-500 font-mono mt-0.5 truncate max-w-[150px]">
                      Time apoiado: {comp.time_nome}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end flex-shrink-0 font-mono">
                  <span className="text-xs font-extrabold text-white">R$ {comp.valor.toFixed(2)}</span>
                  
                  {/* Status Badge */}
                  <span className={`text-[8px] font-bold uppercase mt-1 px-1.5 py-0.5 rounded ${
                    comp.status === 'aprovado' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                    comp.status === 'rejeitado' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                    'bg-orange-500/10 text-orange-400 border border-orange-500/20 animate-pulse'
                  }`}>
                    {comp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-zinc-950/40 border border-zinc-900 rounded-xl">
            <p className="text-xs text-zinc-500 font-semibold">Nenhum comprovante enviado ainda. Envie comprovantes para ganhar pontos.</p>
          </div>
        )}
      </div>
    </div>
  );
}
