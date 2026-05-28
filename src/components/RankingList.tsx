import { useState, useEffect } from 'react';
import { Trophy, Shield, TrendingUp, Users, ShoppingBag, Target } from 'lucide-react';
import { RankingItem, Time, Empresa, Usuario } from '../types';

interface RankingListProps {
  times: Time[];
  empresas: Empresa[];
  usuarios: Usuario[];
  isSupabaseLive: boolean;
  initialSegment?: 'times' | 'empresas' | 'usuarios';
}

export default function RankingList({ times, empresas, usuarios, isSupabaseLive, initialSegment }: RankingListProps) {
  const [activeSegment, setActiveSegment] = useState<'times' | 'empresas' | 'usuarios'>(initialSegment || 'times');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (initialSegment) {
      setActiveSegment(initialSegment);
    }
  }, [initialSegment]);

  // Reset search query when active tab/segment changes
  useEffect(() => {
    setSearchQuery('');
  }, [activeSegment]);

  // Compute stats on-the-fly to guarantee beautiful alignment
  const sortedTimes = [...times].sort((a, b) => (b.pontos ?? 0) - (a.pontos ?? 0));
  const sortedUsuarios = [...usuarios].sort((a, b) => (b.saldo_pontos ?? 0) - (a.saldo_pontos ?? 0));
  const sortedEmpresas = [...empresas].sort((a, b) => (b.score ?? 0.0) - (a.score ?? 0.0));

  const filteredSortedTimes = sortedTimes.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const name = (t.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const neighborhood = (t.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return name.includes(q) || neighborhood.includes(q);
  });

  const filteredSortedEmpresas = sortedEmpresas.filter(e => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const name = (e.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cat = (e.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const neighborhood = (e.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return name.includes(q) || cat.includes(q) || neighborhood.includes(q);
  });

  const filteredSortedUsuarios = sortedUsuarios.filter(usr => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const name = (usr.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const city = (usr.cidade || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return name.includes(q) || city.includes(q);
  });

  // SofaScore style round stats cards mockup
  const totalLeaguesPoints = times.reduce((sum, t) => sum + (t.pontos || 0), 0) * 100;
  const currentLeaderName = sortedTimes[0]?.nome || 'Laranja Mecânica';
  const currentLeaderLogo = sortedTimes[0]?.logo || '';

  return (
    <div className="flex-1 bg-[#050505] p-5 font-sans overflow-y-auto h-[calc(100vh-135px)] max-w-md mx-auto">
      {/* Title */}
      <div className="flex justify-between items-center mb-5">
        <div>
          <h2 className="text-xl font-extrabold text-white font-display uppercase tracking-wide flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-400 select-none animate-bounce" />
            <span>CLASSIFICAÇÃO</span>
          </h2>
          <p className="text-[10px] uppercase font-mono tracking-widest text-[#FF5500]">
            SOFASCORE DA QUEBRADA • AO VIVO
          </p>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] font-mono text-zinc-400">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          <span>Realtime</span>
        </div>
      </div>

      {/* SofaScore Header KPI Cards */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {/* Header 1 */}
        <div className="bg-[#0e0e11] border border-[#FF5500]/15 p-3 rounded-xl flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#FF5500] to-orange-600 p-2.5 rounded-lg text-white">
            <Target className="w-4 h-4" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Líder Atual</span>
            <span className="text-xs font-bold text-white font-display truncate">{currentLeaderName}</span>
          </div>
        </div>

        {/* Header 2 */}
        <div className="bg-[#0e0e11] border border-[#FFD700]/15 p-3 rounded-xl flex items-center gap-3">
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-2.5 rounded-lg text-black">
            <Trophy className="w-4 h-4 text-black" />
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Pontos Várzea</span>
            <span className="text-xs font-extrabold text-[#FFD700] font-mono">{totalLeaguesPoints} Pts</span>
          </div>
        </div>
      </div>

      {/* SofaScore segmented select pills */}
      <div className="bg-[#0E0E10] border border-zinc-800/80 p-1.5 rounded-xl flex gap-1 mb-5">
        {/* Times */}
        <button
          onClick={() => setActiveSegment('times')}
          className={`flex-1 py-2 rounded-lg cursor-pointer text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'times' 
              ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/25' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Clubes Sp</span>
        </button>

        {/* Empresas */}
        <button
          onClick={() => setActiveSegment('empresas')}
          className={`flex-1 py-2 rounded-lg cursor-pointer text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'empresas' 
              ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/25' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Parceiros</span>
        </button>

        {/* Torcedores */}
        <button
          onClick={() => setActiveSegment('usuarios')}
          className={`flex-1 py-2 rounded-lg cursor-pointer text-xs font-bold font-display uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
            activeSegment === 'usuarios' 
              ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/25' 
              : 'text-zinc-500 hover:text-zinc-300'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Fiel Torcedor</span>
        </button>
      </div>

      {/* 🔍 SofaScore style Search Input */}
      <div className="relative mb-4">
        <div className="relative flex items-center">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeSegment === 'times' ? "Buscar clubes por nome, bairro..." :
              activeSegment === 'empresas' ? "Buscar marcas por nome, bairro, categoria..." :
              "Buscar torcedores por nome..."
            }
            className="w-full bg-[#0c0c0e] border border-zinc-900 focus:border-[#FF5500]/60 focus:ring-1 focus:ring-[#FF5500]/30 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-zinc-550 transition-all font-medium font-sans shadow-inner outline-none"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-mono font-bold hover:scale-105 transition-all"
            >
              X
            </button>
          )}
        </div>
      </div>

      {/* LEADERBOARD VIEW */}
      <div className="bg-[#0E0E10] border border-zinc-900 rounded-2xl overflow-hidden shadow-lg">
        {activeSegment === 'times' && (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-black/60 border-b border-zinc-800 py-3.5 px-4 text-[10px] font-bold font-mono text-zinc-500 uppercase">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-6 text-left">CLUBE DA VÁRZEA</span>
              <span className="col-span-1 text-center">J</span>
              <span className="col-span-1 text-center">V</span>
              <span className="col-span-1 text-center font-semibold">SG</span>
              <span className="col-span-2 text-right text-yellow-500">PTS</span>
            </div>

            {/* Rows list */}
            <div className="divide-y divide-zinc-900">
              {filteredSortedTimes.map((time, index) => {
                const totalPlayed = (time.vitorias || 0) + (time.empates || 0) + (time.derrotas || 0);
                const isUserTeam = index === 0; // Highlight the leader or selected supporting team
                
                return (
                  <div 
                    key={time.id}
                    className={`grid grid-cols-12 items-center py-4.5 px-4 hover:bg-zinc-900/50 transition-colors ${
                      isUserTeam ? 'bg-[#FF5500]/5 border-l-2 border-[#FF5500]' : ''
                    }`}
                  >
                    {/* Position index */}
                    <div className="col-span-1 flex justify-center text-xs font-mono">
                      <span className={`w-5.5 h-5.5 rounded-full flex items-center justify-center font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black font-extrabold' : 
                        index === 1 ? 'bg-zinc-300 text-black' :
                        index === 2 ? 'bg-amber-700 text-white' : 'text-zinc-400'
                      }`}>
                        {index + 1}
                      </span>
                    </div>

                    {/* Logo and Name */}
                    <div className="col-span-6 flex items-center gap-2.5 min-w-0 pr-2">
                      <img 
                        src={time.logo} 
                        alt={time.nome} 
                        referrerPolicy="no-referrer"
                        className="w-7 h-7 rounded-lg border border-zinc-800 object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col min-w-0">
                        <span className="text-xs font-bold text-white font-display truncate">
                          {time.nome}
                        </span>
                        <span className="text-[9px] text-zinc-500 font-mono tracking-wider truncate">
                          {time.bairro}
                        </span>
                      </div>
                    </div>

                    {/* Games played */}
                    <span className="col-span-1 text-center text-xs font-mono font-medium text-zinc-400">{totalPlayed}</span>
                    
                    {/* Victories */}
                    <span className="col-span-1 text-center text-xs font-mono font-medium text-zinc-400">{time.vitorias || 0}</span>
                    
                    {/* Goal difference */}
                    <span className={`col-span-1 text-center text-xs font-mono font-medium ${
                      (time.saldo_gols ?? 0) > 0 ? 'text-green-500' : 'text-zinc-500'
                    }`}>
                      {(time.saldo_gols ?? 0) > 0 ? `+${time.saldo_gols}` : time.saldo_gols}
                    </span>

                    {/* Total points */}
                    <span className="col-span-2 text-right text-xs font-extrabold text-[#FFD700] pr-1 font-mono">
                      {time.pontos}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeSegment === 'empresas' && (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-black/60 border-b border-zinc-800 py-3.5 px-4 text-[10px] font-bold font-mono text-zinc-500 uppercase">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-7 text-left">PARCEIRO COMERCIAL</span>
              <span className="col-span-2 text-center">SCORE</span>
              <span className="col-span-2 text-right text-yellow-400">Pts/R$</span>
            </div>

            {/* Rows list */}
            <div className="divide-y divide-zinc-900">
              {filteredSortedEmpresas.map((emp, index) => (
                <div 
                  key={emp.id}
                  className="grid grid-cols-12 items-center py-4.5 px-4 hover:bg-zinc-900 transition-colors"
                >
                  {/* index */}
                  <span className="col-span-1 text-center text-xs font-mono text-zinc-500">{index + 1}</span>

                  {/* Merchant details */}
                  <div className="col-span-7 flex items-center gap-2.5 min-w-0 pr-1">
                    <img 
                      src={emp.logo} 
                      alt={emp.nome} 
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-lg border border-zinc-800 object-cover"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-bold text-white font-display truncate">{emp.nome}</span>
                      <span className="text-[9px] text-zinc-500 font-mono">{emp.categoria}</span>
                    </div>
                  </div>

                  {/* Rating score */}
                  <span className="col-span-2 text-center text-xs font-mono font-bold text-yellow-300">
                    ★ {emp.score || '4.5'}
                  </span>

                  {/* Points offered */}
                  <span className="col-span-2 text-right text-xs font-mono font-extrabold text-orange-400 pr-1">
                    +{emp.pontos_por_real || 15}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeSegment === 'usuarios' && (
          <div>
            {/* Table Header */}
            <div className="grid grid-cols-12 bg-black/60 border-b border-zinc-800 py-3.5 px-4 text-[10px] font-bold font-mono text-zinc-500 uppercase">
              <span className="col-span-1 text-center">#</span>
              <span className="col-span-7 text-left">SÓCIO FIEL</span>
              <span className="col-span-2 text-center">NÍVEL</span>
              <span className="col-span-2 text-right text-[#FFD700]">PONTOS</span>
            </div>

            {/* Rows list */}
            <div className="divide-y divide-zinc-900">
              {filteredSortedUsuarios.map((usr, index) => (
                <div 
                  key={usr.id}
                  className="grid grid-cols-12 items-center py-4 px-4 hover:bg-zinc-900/50 transition-colors"
                >
                  {/* Position */}
                  <span className="col-span-1 text-center text-xs font-mono text-zinc-500">{index + 1}</span>

                  {/* Avatar and name */}
                  <div className="col-span-7 flex items-center gap-2.5 min-w-0 pr-1">
                    <img 
                      src={usr.avatar_url} 
                      alt={usr.nome} 
                      referrerPolicy="no-referrer"
                      className="w-7 h-7 rounded-full border border-zinc-800 object-cover flex-shrink-0"
                    />
                    <div className="flex flex-col min-w-0">
                      <span className="text-xs font-extrabold text-white font-display truncate">
                        {usr.nome}
                      </span>
                      <span className="text-[9px] text-[#FF5500] font-bold">
                        {usr.id === 'u-1' ? 'Você' : 'Apoiador'}
                      </span>
                    </div>
                  </div>

                  {/* Level tier */}
                  <div className="col-span-2 flex justify-center">
                    <span className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-[10px] font-mono text-white font-semibold">
                      Lvl {usr.nivel || 1}
                    </span>
                  </div>

                  {/* Accumulated Points */}
                  <span className="col-span-2 text-right text-xs font-mono font-extrabold text-yellow-400 pr-1">
                    {usr.saldo_pontos?.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footnote information */}
      <div className="mt-4 p-3 bg-zinc-900/40 border border-zinc-800/80 rounded-xl text-center select-none text-[11px] text-zinc-500 leading-relaxed font-mono">
        ⚽ Regra da Rodada: comprovantes validados neste final de semana multiplicam os pontos de torcida por 1.5x! Repasses de apoio ao time acontecem em tempo real.
      </div>
    </div>
  );
}
