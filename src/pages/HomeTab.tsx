import React from 'react';
import { motion } from 'motion/react';
import { Plus, ShoppingBag, X, MessageCircle, Play, Sparkles, MapPin } from 'lucide-react';
import { useVarzea } from '../hooks/useVarzea';

export const HomeTab: React.FC = () => {
  const {
    times,
    empresas,
    categorias,
    activeUser,
    comprovantes,
    setUploadModalOpen,
    setSelectedEmpresaSheet,
    setSelectedClubeSheet,
    setSelectedUsuarioSheet,
    selectedHomeCategory,
    setSelectedHomeCategory,
    selectedHomeSubcategory,
    setSelectedHomeSubcategory,
    setHomeVideoPlaying,
    homeSearchQuery,
    setHomeSearchQuery,
    setSelectedCategory,
    setActiveTab,
    videos,
    setRankingSegment
  } = useVarzea();

  return (
    <div className="flex-1 bg-[#050505] p-5 overflow-y-auto space-y-6 text-left font-sans no-scrollbar">
      
      {/* 1. TOPO DO APP - MODERN GIANT HERO ACCENT */}
      <div 
        className="relative overflow-hidden rounded-3xl p-6 border border-[#FF5500]/20 shadow-[0_4px_30px_rgba(255,85,0,0.15)] flex flex-col items-center justify-center text-center bg-cover bg-center min-h-[190px]"
        style={{ 
          backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.95) 15%, rgba(0, 0, 0, 0.5) 65%, rgba(255, 85, 0, 0.2) 100%), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop')`
        }}
      >
        {/* Glowing light bars from turf stadium style */}
        <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/50 to-transparent animate-pulse" />
        
        <motion.h1 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-6xl font-black font-display tracking-tight text-white uppercase text-orange-glow select-none leading-none drop-shadow-[0_2px_10px_rgba(255,85,0,0.6)]"
        >
          VÁRZEA
        </motion.h1>

        <p className="text-[11px] font-semibold text-zinc-300 max-w-[260px] leading-relaxed mt-2.5 font-display select-none">
          Compre, fortaleça seu time e ajude sua comunidade.
        </p>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => setUploadModalOpen(true)}
          className="mt-4 relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FFD700] p-[1px] cursor-pointer shadow-lg orange-glow active:scale-95 transition-all text-xs"
        >
          <div className="flex items-center gap-1.5 bg-black py-2.5 px-4 rounded-[11px] group-hover:bg-[#FF5500]/10 transition-all font-display font-black text-white tracking-widest uppercase">
            <Plus className="w-4 h-4 text-[#FFD700]" />
            <span>Enviar comprovante</span>
          </div>
        </motion.button>
      </div>

      {/* 3 HIGHLIGHT COMMERCE BLOCKS SIDE-BY-SIDE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-display">
        {/* Block 1: Hamburguer */}
        <div className="bg-[#0C0C0E] border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group p-2.5 relative">
          <div className="relative h-28 w-full overflow-hidden rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=260&auto=format&fit=crop" 
              alt="Hamburgueria do Terrão"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-[#FF5500] text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
              Sócio Burguer
            </span>
          </div>
          <div className="pt-2 text-left flex-1 flex flex-col justify-between">
            <div className="pb-2">
              <h4 className="text-xs font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-[#FF5500] transition-colors font-display">Burguer do Terrão</h4>
              <p className="text-[9px] text-[#FF5500] font-sans tracking-tight mt-0.5 font-mono">Itaquera • São Paulo</p>
            </div>
            <a 
              href="https://wa.me/5511999998888?text=Olá! Quero pedir um Hambúrguer Gourmet pelo aplicativo Sócio Compra."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[9px] font-black uppercase tracking-wider py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Block 2: Pizza */}
        <div className="bg-[#0C0C0E] border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group p-2.5 relative">
          <div className="relative h-28 w-full overflow-hidden rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=260&auto=format&fit=crop" 
              alt="Pizza da Arena"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
              Arena Pizza
            </span>
          </div>
          <div className="pt-2 text-left flex-1 flex flex-col justify-between">
            <div className="pb-2">
              <h4 className="text-xs font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-yellow-400 transition-colors font-display font-display">Pizza da Arena</h4>
              <p className="text-[9px] text-[#FF5500] font-sans tracking-tight mt-0.5 font-mono">São Miguel • São Paulo</p>
            </div>
            <a 
              href="https://wa.me/5511999998888?text=Olá! Quero pedir uma Pizza Forno á Lenha pelo aplicativo Sócio Compra."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[9px] font-black uppercase tracking-wider py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* Block 3: Barber */}
        <div className="bg-[#0C0C0E] border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group p-2.5 relative">
          <div className="relative h-28 w-full overflow-hidden rounded-xl">
            <img 
              src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=260&auto=format&fit=crop" 
              alt="Corte de Campeão"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-blue-500 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
              Corte de Campeão
            </span>
          </div>
          <div className="pt-2 text-left flex-1 flex flex-col justify-between">
            <div className="pb-2">
              <h4 className="text-xs font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-blue-400 transition-colors font-display">Corte de Campeão</h4>
              <p className="text-[9px] text-[#FF5500] font-sans tracking-tight mt-0.5 font-mono">Guaianases • São Paulo</p>
            </div>
            <a 
              href="https://wa.me/5511999998888?text=Olá! Quero agendar um corte pelo aplicativo Sócio Compra."
              target="_blank"
              rel="noopener noreferrer"
              className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[9px] font-black uppercase tracking-wider py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
            >
              <MessageCircle className="w-3.5 h-3.5 text-current" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* ADVANCED SEARCH INPUT BAR */}
      <div className="relative z-10">
        <div className="relative flex items-center">
          <ShoppingBag className="absolute left-3.5 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            value={homeSearchQuery}
            onChange={(e) => setHomeSearchQuery(e.target.value)}
            placeholder="Buscar times, empresas, bairros (ex: Itaquera, Terrão)..."
            className="w-full bg-[#0c0c0e] border border-zinc-900 focus:border-[#FF5500]/60 focus:ring-1 focus:ring-[#FF5500]/30 rounded-2xl pl-10 pr-10 py-3.5 text-xs text-white placeholder-zinc-550 transition-all font-medium font-sans shadow-inner"
          />
          {homeSearchQuery ? (
            <button 
              onClick={() => setHomeSearchQuery('')}
              className="absolute right-3 w-6 h-6 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
              title="Limpar pesquisa"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          ) : (
            <span className="absolute right-3.5 text-[9px] font-mono tracking-wider text-zinc-650 uppercase font-bold select-none">Busca</span>
          )}
        </div>
      </div>

      {homeSearchQuery.trim() ? (
        /* SEARCH RESULTS INTERACTIVE SCREEN */
        <div className="space-y-6 animate-fadeIn py-1">
          <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2.5">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5500] font-black">
              RESULTADOS PARA: "{homeSearchQuery}"
            </span>
            <button 
              onClick={() => setHomeSearchQuery('')}
              className="text-[10px] text-zinc-500 font-bold hover:text-white uppercase font-display cursor-pointer"
            >
              Limpar Resultados
            </button>
          </div>

          {/* A. MATCHING TIMES */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-yellow-400 pl-2">
              Times da Várzea ({
                times.filter(t => {
                  const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const name = (t.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const neighborhood = (t.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  return name.includes(q) || neighborhood.includes(q);
                }).length
              })
            </h4>

            {(() => {
              const filtered = times.filter(t => {
                const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const name = (t.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const neighborhood = (t.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return name.includes(q) || neighborhood.includes(q);
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#0C0C0E]/50 border border-zinc-950 rounded-2xl py-6 px-4 text-center">
                    <p className="text-xs text-zinc-500 font-medium font-sans">Nenhum clube ou time encontrado nesta região.</p>
                  </div>
                );
              }

              return (
                <div className="grid grid-cols-2 gap-3 text-left">
                  {filtered.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedClubeSheet(t)}
                      className="bg-gradient-to-br from-[#0c0c0e] to-[#050506] border border-zinc-900 hover:border-yellow-500/30 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 text-left"
                    >
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-900/60 flex-shrink-0"
                        style={{ background: `linear-gradient(135deg, ${t.cores?.[0] || '#121214'} 0%, ${t.cores?.[1] || '#000'} 100%)` }}
                      >
                        {t.logo_url ? (
                          <img src={t.logo_url} alt={t.nome} className="w-6.5 h-6.5 object-contain" />
                        ) : (
                          <span className="text-white text-xs font-black">{t.sigla}</span>
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h5 className="text-[11px] font-black uppercase text-zinc-100 truncate font-display">{t.nome}</h5>
                        <p className="text-[9px] text-zinc-500 font-mono tracking-tight font-medium mt-0.5">{t.bairro || 'Terrão'}</p>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* B. MATCHING EMPRESAS */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
              Parceiros & Credenciados ({
                empresas.filter(e => {
                  const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const name = (e.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const cat = (e.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const neighborhood = (e.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  const address = (e.endereco || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  return name.includes(q) || cat.includes(q) || neighborhood.includes(q) || address.includes(q);
                }).length
              })
            </h4>

            {(() => {
              const filtered = empresas.filter(e => {
                const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const name = (e.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const cat = (e.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const neighborhood = (e.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                const address = (e.endereco || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                return name.includes(q) || cat.includes(q) || neighborhood.includes(q) || address.includes(q);
              });

              if (filtered.length === 0) {
                return (
                  <div className="bg-[#0C0C0E]/50 border border-zinc-950 rounded-2xl py-6 px-4 text-center">
                    <p className="text-xs text-zinc-500 font-medium font-sans">Nenhum estabelecimento comercial encontrado no momento.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-2.5 text-left">
                  {filtered.map(emp => (
                    <div 
                      key={emp.id}
                      onClick={() => setSelectedEmpresaSheet(emp)}
                      className="bg-gradient-to-r from-[#0C0C0E] to-[#040405] border border-zinc-900 hover:border-[#FF5500]/30 rounded-2xl p-3 flex gap-3.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 text-left"
                    >
                      <img 
                        src={emp.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=120&auto=format&fit=crop'} 
                        alt={emp.nome} 
                        referrerPolicy="no-referrer"
                        className="w-12 h-12 rounded-xl object-cover border border-zinc-900 flex-shrink-0"
                      />
                      <div className="min-w-0 flex-1 flex flex-col justify-between">
                        <div>
                          <h5 className="text-[11.5px] font-black text-white leading-tight uppercase tracking-tight font-display">{emp.nome}</h5>
                          <p className="text-[8.5px] text-zinc-500 font-sans mt-0.5 uppercase tracking-wide">
                            {emp.categoria} • {emp.bairro || 'Terrão'}
                          </p>
                        </div>
                        <div className="flex justify-between items-center mt-1 select-none">
                          <span className="text-[8px] font-black px-1.5 py-0.5 bg-yellow-400/10 text-[#FF5500] border border-[#FF5500]/10 rounded-md font-mono">
                            SCORE {emp.score || '5.0'} ⭐
                          </span>
                          <span className="text-[8.5px] text-[#FF5500] font-black tracking-tighter uppercase font-mono">
                            {emp.cashback_porcentagem}% CASHBACK
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>
      ) : (
        <>
          {/* 2. CATEGORIAS - HORIZONTAL BAR SILOUHETTE IFOOD-STYLE */}
          <div className="space-y-2.5">
            <div className="flex justify-between items-center select-none">
              <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FFD700] pl-2 font-display">
                Categorias no Bairro
              </h4>
              <div className="flex items-center gap-2">
                {selectedHomeCategory !== 'Todos' && (
                  <button 
                    onClick={() => { setSelectedHomeCategory('Todos'); setSelectedHomeSubcategory('Todos'); }}
                    className="text-[10px] text-zinc-500 font-bold hover:text-white uppercase font-display cursor-pointer"
                  >
                    Limpar
                  </button>
                )}
                <span 
                  onClick={() => { setSelectedCategory('Todos'); setActiveTab('parceiros'); }}
                  className="text-[10px] text-orange-500 hover:text-orange-400 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                >
                  Ver todas
                </span>
              </div>
            </div>
            
            {/* Slider of premium marketplace/iFood style cards */}
            <div className="no-scrollbar overflow-x-auto flex gap-3.5 py-2 select-none">
              {[
                { id: 'todos', nome: 'Todos', emoji: '⚽', subcategorias: ['Todos os parceiros'], cor_gradient: 'from-orange-500/10 to-amber-500/10 hover:border-orange-500/40 text-[#FF5500]' },
                ...categorias
              ].map(cat => {
                const isActive = selectedHomeCategory === cat.nome;
                const hasGradientAndTextColors = cat.cor_gradient || 'from-zinc-900/40 to-black/40 hover:border-zinc-700/60 text-zinc-400';
                
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      if (isActive) {
                        setSelectedHomeCategory('Todos');
                        setSelectedHomeSubcategory('Todos');
                      } else {
                        setSelectedHomeCategory(cat.nome);
                        setSelectedHomeSubcategory('Todos');
                      }
                    }}
                    className={`flex-shrink-0 w-[140px] p-2.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between text-left group cursor-pointer active:scale-95 ${
                      isActive 
                        ? 'bg-gradient-to-br from-zinc-900/90 to-black border-[#FF5500]/50 shadow-[0_4px_16px_rgba(255,85,0,0.15)] translate-y-[-2px]' 
                        : `bg-gradient-to-br from-[#0c0c0e]/80 to-[#050506]/85 border-zinc-900/60 hover:border-zinc-700/40`
                    }`}
                  >
                    {isActive && (
                      <div className="absolute top-0 right-0 w-8 h-8 bg-[#FF5500]/10 rounded-full blur-md pointer-events-none" />
                    )}

                    <div className="flex items-center gap-2">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 ${
                        isActive 
                          ? 'bg-[#FF5500]/15 border border-[#FF5500]/30 scale-105' 
                          : `bg-gradient-to-br ${hasGradientAndTextColors.split(' ').slice(0, 2).join(' ')} border border-zinc-850 group-hover:scale-105`
                      }`}>
                        <span className={isActive ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}>{cat.emoji}</span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h5 className={`text-[10px] font-black font-display uppercase tracking-wider truncate leading-tight ${
                          isActive ? 'text-[#FFD700]' : 'text-zinc-200 group-hover:text-[#FF5500] transition-colors'
                        }`}>
                          {cat.nome}
                        </h5>
                        <p className="text-[7.5px] text-zinc-500 font-sans truncate tracking-tight mt-0.5">
                          {cat.subcategorias && cat.subcategorias.length > 0 ? cat.subcategorias.join(', ') : 'Parceiros locais'}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2.5 DYNAMIC PREMIUM SUBCATEGORIES SLIDER */}
          {selectedHomeCategory !== 'Todos' && (() => {
            const activeCatObj = categorias.find(c => c.nome === selectedHomeCategory);
            const subs = activeCatObj?.subcategorias || [];
            if (subs.length === 0) return null;
            
            return (
              <div className="space-y-2 bg-[#0C0C0E] border border-zinc-900 rounded-2xl p-3.5 mt-[-4px] select-none animate-fadeIn">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] uppercase font-black tracking-widest text-[#FFD700] font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full animate-ping"></span>
                    Subcategorias • {selectedHomeCategory}
                  </span>
                  {selectedHomeSubcategory !== 'Todos' && (
                    <button 
                      onClick={() => setSelectedHomeSubcategory('Todos')}
                      className="text-[8.5px] uppercase font-bold font-mono text-zinc-500 hover:text-[#FF5500] transition-colors"
                    >
                      Limpar
                    </button>
                  )}
                </div>
                
                <div className="no-scrollbar overflow-x-auto flex gap-2 py-1">
                  <button
                    onClick={() => setSelectedHomeSubcategory('Todos')}
                    className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl border text-[10.5px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                      selectedHomeSubcategory === 'Todos'
                        ? 'bg-[#FF5500] border-orange-500 text-white shadow-[0_2px_8px_rgba(255,85,0,0.25)]'
                        : 'bg-[#121214] border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    Ver Todas
                  </button>
                  
                  {subs.map(subCode => (
                    <button
                      key={subCode}
                      onClick={() => {
                        setSelectedHomeSubcategory(prev => prev === subCode ? 'Todos' : subCode);
                      }}
                      className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl border text-[10.5px] font-bold uppercase tracking-tight transition-all duration-200 cursor-pointer ${
                        selectedHomeSubcategory === subCode
                          ? 'bg-gradient-to-r from-[#FFD700] to-yellow-500 border-yellow-400 text-black shadow-[0_2px_8px_rgba(255,215,0,0.25)] font-black'
                          : 'bg-[#121214] border-zinc-900 hover:border-zinc-850 text-zinc-450 hover:text-white'
                      }`}
                    >
                      {subCode}
                    </button>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* Condition: if selected category is 'Todos', show carousels layout. Otherwise show list of filtered category items */}
          {selectedHomeCategory === 'Todos' ? (
            <div className="space-y-6">
              {/* A. TIMES PARCEIROS CAROUSEL */}
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-yellow-400 pl-2">
                    Times Parceiros
                  </h4>
                  <span 
                    onClick={() => { setRankingSegment('times'); setActiveTab('ranking'); }}
                    className="text-[10px] text-yellow-400 hover:text-yellow-300 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                  >
                    Ver todos
                  </span>
                </div>

                <div className="no-scrollbar overflow-x-auto flex gap-3.5 py-1.5 select-none scroll-smooth">
                  {times.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => setSelectedClubeSheet(t)}
                      className="flex-shrink-0 w-28 bg-[#0c0c0e] hover:bg-zinc-950 border border-zinc-900 hover:border-yellow-400 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer shadow-md transition-all group"
                    >
                      <div className="relative">
                        <img 
                          src={t.logo} 
                          alt={t.nome} 
                          referrerPolicy="no-referrer"
                          className="w-11 h-11 rounded-full object-cover border border-white/5 bg-zinc-950 p-1 group-hover:scale-110 transition-transform duration-300"
                        />
                        {t.id === activeUser.time_coracao_id && (
                          <span className="absolute -top-1 -right-1 bg-[#FF5500] text-black w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center">♥</span>
                        )}
                      </div>

                      <h5 className="text-[9px] font-black text-white font-display mt-2 truncate w-full">{t.nome}</h5>
                      <p className="text-[7.5px] text-zinc-500 font-mono mt-0.5 truncate w-full">{t.bairro || 'Varzea'}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* B. EMPRESAS PARCEIRAS CAROUSEL */}
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                    Empresas Parceiras
                  </h4>
                  <span 
                    onClick={() => { setSelectedCategory('Todos'); setActiveTab('parceiros'); }}
                    className="text-[10px] text-orange-400 hover:text-orange-300 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                  >
                    Ver todas
                  </span>
                </div>

                <div className="no-scrollbar overflow-x-auto flex gap-4 py-1.5 select-none scroll-smooth">
                  {empresas.map(emp => {
                    let defaultFoodImage = emp.banner;
                    const catLower = (emp.categoria || '').toLowerCase();
                    const nameLower = (emp.nome || '').toLowerCase();
                    if (catLower.includes('hamburguer') || catLower.includes('burg') || nameLower.includes('hamb')) {
                      defaultFoodImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=260&auto=format&fit=crop';
                    } else if (catLower.includes('pizza') || nameLower.includes('piz')) {
                      defaultFoodImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=260&auto=format&fit=crop';
                    } else if (catLower.includes('barb') || catLower.includes('corte') || nameLower.includes('barber')) {
                      defaultFoodImage = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=260&auto=format&fit=crop';
                    }

                    return (
                      <div 
                        key={emp.id}
                        onClick={() => setSelectedEmpresaSheet(emp)}
                        className="flex-shrink-0 w-44 bg-[#0c0c0e] hover:bg-zinc-950 border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all group flex flex-col justify-between"
                      >
                        <div className="relative h-20 w-full overflow-hidden">
                          <img 
                            src={defaultFoodImage} 
                            alt={emp.nome} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                          <span className="absolute top-1.5 right-1.5 bg-black/75 text-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                            ★ {emp.score || '4.8'}
                          </span>
                        </div>

                        <div className="p-2.5 text-left flex flex-col justify-between flex-1">
                          <div className="mb-2">
                            <h5 className="text-[10px] font-black text-white font-display truncate leading-tight group-hover:text-[#FF5500] transition-colors">{emp.nome}</h5>
                            <p className="text-[8px] text-zinc-500 font-sans mt-0.5 truncate uppercase">{emp.categoria} • {emp.bairro || 'Terrão'}</p>
                          </div>

                          <a 
                            href={`https://wa.me/${emp.telefone || '5511999998888'}?text=${encodeURIComponent(`Olá! Vi sua empresa no aplicativo Sócio Compra. Gostaria de fazer um pedido!`)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[8.5px] font-black uppercase tracking-wider py-1.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                          >
                            <MessageCircle className="w-3 h-3 text-current" />
                            <span>WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* C. REELS SÓCIO COMPRA CAROUSEL */}
              <div className="space-y-3">
                <div className="flex justify-between items-center select-none">
                  <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-orange-500 pl-2">
                    Reels Sócio Compra
                  </h4>
                  <span 
                    onClick={() => setActiveTab('reels')}
                    className="text-[10px] text-orange-400 hover:text-orange-300 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                  >
                    Ver todos
                  </span>
                </div>

                <div className="no-scrollbar overflow-x-auto flex gap-4 py-1.5 select-none scroll-smooth">
                  {videos.map((vid, ix) => (
                    <div 
                      key={vid.id || ix}
                      onClick={() => setHomeVideoPlaying(vid)}
                      className="flex-shrink-0 w-36 bg-[#0c0c0e] hover:bg-zinc-950 border border-zinc-900 hover:border-orange-500/50 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all group relative flex flex-col justify-between"
                    >
                      <div className="relative h-28 w-full bg-zinc-955 flex items-center justify-center overflow-hidden">
                        <div className="absolute inset-0 bg-cover bg-center brightness-50" style={{ backgroundImage: `url('${vid.empresa_logo}')` }} />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                        <span className="absolute top-1.5 left-1.5 bg-[#FF5500] text-black font-black text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider font-display select-none">
                          {ix % 2 === 0 ? 'Notícias' : 'Ação Social'}
                        </span>
                        <div className="absolute inset-x-2 bottom-2 text-center select-none z-10 font-display">
                          <p className="text-[8px] font-mono text-zinc-300 truncate">{vid.descricao}</p>
                        </div>
                        <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                          <div className="bg-black/60 p-2 rounded-full border border-white/10">
                            <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                          </div>
                        </div>
                      </div>

                      <div className="p-2 flex items-center gap-1.5 bg-[#09090b] text-[8px] text-zinc-400 select-none min-w-0">
                        <img 
                          src={vid.empresa_logo} 
                          alt="creator" 
                          className="w-4 h-4 rounded-md object-cover"
                        />
                        <span className="truncate flex-1 font-bold">{vid.empresa_nome}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* ORIGINAL FILTERED LIST DESIGN IF CATEGORY FILTER IS APPLIED */
            <div className="space-y-3.5 text-left">
              <div className="flex justify-between items-end select-none">
                <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                  Patrocinadores [{selectedHomeCategory}{selectedHomeSubcategory !== 'Todos' ? ` › ${selectedHomeSubcategory}` : ''}]
                </h4>
              </div>

              {(() => {
                const filtered = empresas.filter(e => {
                  const empLower = (e.categoria || '').toLowerCase();
                  const normEmp = empLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  
                  if (selectedHomeSubcategory !== 'Todos') {
                    const empSubLower = (e.subcategoria || '').toLowerCase();
                    const normEmpSub = empSubLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    const normSelectedSub = selectedHomeSubcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                    
                    const nameLower = (e.nome || '').toLowerCase();
                    const normName = nameLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                    if (normEmpSub.includes(normSelectedSub) || normSelectedSub.includes(normEmpSub) || normName.includes(normSelectedSub)) {
                      return true;
                    }
                    return false;
                  }

                  const targetCat = categorias.find(c => c.nome === selectedHomeCategory);
                  if (!targetCat) {
                    return empLower.includes(selectedHomeCategory.toLowerCase());
                  }
                  
                  const normCat = targetCat.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                  if (normEmp.includes(normCat) || normCat.includes(normEmp)) {
                    return true;
                  }
                  
                  if (targetCat.subcategorias) {
                    for (const sub of targetCat.subcategorias) {
                      const normSub = sub.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                      if (normEmp.includes(normSub) || normSub.includes(normEmp)) {
                        return true;
                      }
                    }
                  }
                  
                  return false;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-6 text-center bg-[#070709] border border-zinc-900 rounded-2xl">
                      <p className="text-[11px] text-zinc-500 font-mono">Nenhum patrocinador encontrado neste setor.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-4">
                    {filtered.map(emp => {
                      let defaultFoodImage = emp.banner;
                      const catLower = (emp.categoria || '').toLowerCase();
                      const nameLower = (emp.nome || '').toLowerCase();
                      if (catLower.includes('hamburguer') || catLower.includes('burg') || nameLower.includes('hamb')) {
                        defaultFoodImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop';
                      } else if (catLower.includes('pizza') || nameLower.includes('piz')) {
                        defaultFoodImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop';
                      } else if (catLower.includes('barb') || catLower.includes('corte') || nameLower.includes('barber')) {
                        defaultFoodImage = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop';
                      }

                      return (
                        <div 
                          key={emp.id}
                          className="group bg-[#0c0c0e] hover:bg-[#121215] border border-zinc-900 hover:border-[#FF5500]/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col cursor-pointer"
                          onClick={() => setSelectedEmpresaSheet(emp)}
                        >
                          <div className="relative h-32 w-full overflow-hidden">
                            <img 
                              src={defaultFoodImage} 
                              alt={emp.nome} 
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                            
                            <div className="absolute top-3 left-3 bg-[#FF5500] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md font-display flex items-center gap-1 select-none text-orange-glow">
                              <Sparkles className="w-3 h-3 text-black fill-black" />
                              <span>PARCEIRO DO TIME</span>
                            </div>

                            <div className="absolute top-2.5 right-2.5 bg-black/60 border border-white/10 text-yellow-400 font-black text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md select-none">
                              ★ {emp.score || '4.8'}
                            </div>
                          </div>

                          <div className="p-4 flex gap-3 items-center justify-between">
                            <div className="flex gap-3 items-center min-w-0 flex-1 text-left">
                              <img 
                                src={emp.logo} 
                                alt={emp.nome} 
                                referrerPolicy="no-referrer"
                                className="w-10 h-10 rounded-xl object-cover border border-[#FF5500]/30 flex-shrink-0"
                              />
                              <div className="min-w-0 flex-1 text-left">
                                <h5 className="text-sm font-black text-white truncate font-display group-hover:text-[#FF5500] transition-colors">{emp.nome}</h5>
                                <p className="text-[10px] text-zinc-500 font-medium font-sans mt-0.5 capitalize">{emp.categoria} • {emp.bairro || 'Itaquera'}</p>
                              </div>
                            </div>

                            <a
                              href={`https://wa.me/${emp.telefone || '5511999998888'}?text=${encodeURIComponent(`Olá! Vi sua empresa ${emp.nome} no aplicativo Sócio Compra. Gostaria de fazer um pedido!`)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="bg-[#25D366] hover:bg-[#1ebd53] text-black font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1 border-0 shadow-lg select-none active:scale-95 transition-all flex-shrink-0 animate-fadeIn"
                            >
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* 6. TRANSAÇÕES RECENTES FUTEBOL DE VÁRZEA */}
          <div className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-4 text-left">
            <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between select-none">
              <span>TRANSAÇÕES RECENTES FUTEBOL DE VÁRZEA</span>
              <span className="text-green-500 flex items-center gap-1 text-[9px] font-extrabold animate-pulse">
                ● ATIVIDADE RECENTE
              </span>
            </h4>

            <div className="space-y-2">
              {comprovantes.slice(0, 3).map(comp => (
                <div key={comp.id} className="flex justify-between items-center text-xs font-sans leading-relaxed border-b border-zinc-900/40 pb-1.5">
                  <div className="text-left min-w-0 pr-1 flex gap-2 items-center">
                    <span 
                      onClick={() => {
                        setSelectedUsuarioSheet({
                          id: comp.usuario_id || 'u-generic',
                          nome: comp.usuario_nome,
                          email: 'lsp.prates@gmail.com',
                          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
                          saldo_cashback: 142.50,
                          saldo_pontos: 12450,
                          nivel: 6,
                          time_coracao_id: comp.time_id
                        });
                      }}
                      className="font-bold text-white hover:text-[#FF5500] hover:underline cursor-pointer truncate max-w-[95px] select-all block"
                    >
                      {comp.usuario_nome}
                    </span>
                    <span className="text-[9px] text-zinc-500 truncate max-w-[85px] select-all">({comp.empresa_nome})</span>
                  </div>

                  <div className="text-right flex-shrink-0 flex flex-col font-mono">
                    <span className="font-extrabold text-[#FFD700] p-0 text-[10px]">+{comp.pontos_gerados} Pts</span>
                    <span className="text-[8px] text-[#FF5500] p-0 font-semibold">Repasse: R$ {comp.comissao_clube_gerado.toFixed(2)} {comp.time_nome ? `para ${comp.time_nome.split(' ')[0]}` : ''}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Disclaimer/Credit line footer */}
      <div className="p-3.5 bg-zinc-950/40 border border-zinc-900/60 rounded-xl text-center select-none text-[10px] text-zinc-600 leading-relaxed font-mono">
        🤝 Todo repasse é auditado pela comissão de arbitragem e repassado aos times de várzea para despesas de campeonato.
      </div>
    </div>
  );
};
export default HomeTab;
