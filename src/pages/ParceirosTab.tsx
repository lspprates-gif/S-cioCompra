import React from 'react';
import { ShoppingBag, X } from 'lucide-react';
import { useVarzea } from '../hooks/useVarzea';

export const ParceirosTab: React.FC = () => {
  const {
    categoriesList,
    selectedCategory,
    setSelectedCategory,
    partnersSearchQuery,
    setPartnersSearchQuery,
    filteredEmpresas,
    setActiveTab,
    setActivePersona
  } = useVarzea();

  return (
    <div className="flex-1 bg-[#050505] p-5 overflow-y-auto space-y-5 text-left font-sans no-scrollbar">
      
      {/* Tab header title */}
      <div className="space-y-1">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5500] font-black">SPONSORS & MARQUETESTE</span>
        <h2 className="text-xl font-bold font-display text-white uppercase tracking-tight flex items-center gap-2">
          <ShoppingBag className="w-5 h-5 text-yellow-400" />
          <span>EMPRESAS CREDIADAS</span>
        </h2>
      </div>

      {/* Horizontal sticky Categories selectors */}
      <div className="no-scrollbar overflow-x-auto flex gap-2 py-1 select-none sticky top-0 bg-[#050505] z-10">
        {categoriesList.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`flex-shrink-0 px-3.5 py-1.5 border rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
              selectedCategory === cat 
                ? 'bg-[#FF5500] border-orange-500 text-white' 
                : 'bg-[#0E0E10] border-zinc-850 hover:border-zinc-700 text-zinc-400'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* ADVANCED SEB / SEARCH INPUT BAR */}
      <div className="relative z-10">
        <div className="relative flex items-center">
          <ShoppingBag className="absolute left-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={partnersSearchQuery}
            onChange={(e) => setPartnersSearchQuery(e.target.value)}
            placeholder="Buscar empresa por nome, bairro ou categoria..."
            className="w-full bg-[#0c0c0e] border border-zinc-900 focus:border-[#FF5500]/60 focus:ring-1 focus:ring-[#FF5500]/30 rounded-2xl pl-10 pr-10 py-3.5 text-xs text-white placeholder-zinc-550 transition-all font-medium font-sans shadow-inner"
          />
          {partnersSearchQuery ? (
            <button 
              onClick={() => setPartnersSearchQuery('')}
              className="absolute right-3 w-6 h-6 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-4 text-[9px] font-mono tracking-wider text-zinc-650 uppercase font-bold select-none">Busca</span>
          )}
        </div>
      </div>

      {/* Businesses list matches categories */}
      {filteredEmpresas.length > 0 ? (
        <div className="space-y-4 pt-1">
          {filteredEmpresas.map(emp => (
            <div 
              key={emp.id}
              className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-4 flex gap-4 hover:border-orange-500 transition-colors cursor-pointer text-left"
              onClick={() => {
                setSelectedCategory('Todos');
                setActiveTab('perfil');
                setActivePersona('empresa');
              }}
            >
              {/* Company avatar */}
              <img 
                src={emp.logo} 
                alt={emp.nome} 
                referrerPolicy="no-referrer"
                className="w-14 h-14 rounded-xl object-cover border border-[#FF5500]/25 flex-shrink-0"
              />

              {/* Details */}
              <div className="min-w-0 flex-1 flex flex-col justify-between text-left">
                <div>
                  <div className="flex justify-between items-start gap-1">
                    <h3 className="font-extrabold text-sm tracking-tight font-display text-white truncate pr-1">
                      {emp.nome}
                    </h3>
                    <span className="text-yellow-400 text-xs font-bold font-mono">★ {emp.score || '4.5'}</span>
                  </div>

                  <p className="text-[10px] text-zinc-500 font-medium font-sans mt-0.5">{emp.categoria} • {emp.endereco}</p>
                  <p className="text-zinc-400 font-medium text-[11px] leading-relaxed mt-2.5 max-w-[90%]">
                    {emp.descricao}
                  </p>
                </div>

                <div className="mt-3.5 flex justify-between items-center">
                  {/* Supporting Sponsor Badge bullet */}
                  <span className="bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] font-black text-[10px] px-2.5 py-1 rounded-md tracking-wider">
                    PATROCINADOR ATIVO
                  </span>

                  <span className="text-[10px] font-mono text-zinc-650 flex items-center gap-1">
                    Fideliza: <span className="text-[#FFD700] font-bold">+{emp.pontos_por_real || 10} Pts/Spend</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-8 text-center bg-zinc-950/40 border border-zinc-900 rounded-xl">
          <p className="text-xs text-zinc-500">Nenhum estabelecimento encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  );
};
export default ParceirosTab;
