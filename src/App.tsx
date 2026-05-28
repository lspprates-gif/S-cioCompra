import { 
  Home as HomeIcon, ShoppingBag, User, Plus, Play, ListCollapse, FileText,
  LogOut, MoreVertical, Shield, Building, Trophy, Users, X, MapPin, MessageCircle, Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Context provider & custom hooks
import { VarzeaProvider, useVarzea } from './contexts/VarzeaContext';

// Extracted presentational pages
import { HomeTab } from './pages/HomeTab';
import { ParceirosTab } from './pages/ParceirosTab';
import { ReelsTab } from './pages/ReelsTab';
import { RankingTab } from './pages/RankingTab';
import { PerfilTab } from './pages/PerfilTab';

// Modal and drawer level overlays
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import LoginScreen from './components/LoginScreen';
import UploadReceiptModal from './components/UploadReceiptModal';
import CadastroEmpresaModal from './components/CadastroEmpresaModal';
import CadastroClubeModal from './components/CadastroClubeModal';

function VarzeaApp() {
  const {
    cadastroEmpresaOpen, setCadastroEmpresaOpen,
    cadastroClubeOpen, setCadastroClubeOpen,
    splashActive, setSplashActive,
    showLandingPage, setShowLandingPage,
    loginScreenMode, setLoginScreenMode,
    activeTab, setActiveTab,
    activePersona, setActivePersona,
    
    isLoggedIn,
    activeUser,

    times,
    empresas,
    usuarios,
    isSupabaseLive,

    selectedEmpresaSheet, setSelectedEmpresaSheet,
    selectedClubeSheet, setSelectedClubeSheet,
    selectedUsuarioSheet, setSelectedUsuarioSheet,
    homeVideoPlaying, setHomeVideoPlaying,

    uploadModalOpen, setUploadModalOpen,
    threeDotsMenuOpen, setThreeDotsMenuOpen,
    setRankingSegment,
    activeToasts,

    triggerVisualToast,
    handleUploadReceipt,
    handleLogin,
    handleRegister,
    handleLogout,
    handleAddEmpresaLocal,
    handleAddClubeLocal
  } = useVarzea();

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans relative antialiased">
      
      {/* Absolute Dynamic Canvas Toasts Alert Area */}
      <div className="fixed top-4 z-[99] max-w-xs w-full px-4 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {activeToasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-xl shadow-2xl pointer-events-auto border flex items-start gap-3 bg-black/95 text-left font-display z-50 orange-glow border-[#FF5500]/40"
            >
              <div className="flex-shrink-0 bg-gradient-to-r from-[#FF5500] to-[#FFD700] text-black p-2 rounded-lg font-bold animate-pulse">
                {t.iconType === 'gols' ? '⚽' : t.iconType === 'financeiro' ? '💰' : '🔔'}
              </div>
              <div className="min-w-0 flex-1 text-left">
                <p className="text-[11px] font-extrabold text-white tracking-tight uppercase leading-snug">
                  {t.message}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal font-sans">
                  {t.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. CINEMATIC SPLASH SCREEN (Fades away automatically) */}
      <AnimatePresence>
        {splashActive && (
          <SplashScreen 
            onDismiss={() => setSplashActive(false)} 
            isSupabaseLive={isSupabaseLive} 
          />
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC PREMIUM VISUAL LANDING PAGE AREA */}
      {showLandingPage && !splashActive && (
        <LandingPage 
          onEnterApp={() => {
            setLoginScreenMode('login');
            setShowLandingPage(false);
            triggerVisualToast({
              id: `welcome-${Date.now()}`,
              message: '⚡ APRESENTAR CONTA!',
              sub: 'Insira seus dados ou faça login rápido.',
              iconType: 'sistema'
            });
          }} 
          onCriaConta={() => {
            setLoginScreenMode('register');
            setShowLandingPage(false);
            triggerVisualToast({
              id: `create-acct-${Date.now()}`,
              message: '📝 CRIAR CONTA!',
              sub: 'Crie sua ficha de sócio torcedor corporativo.',
              iconType: 'sistema'
            });
          }}
          onCadastrarEmpresa={() => {
            setCadastroEmpresaOpen(true);
          }}
          onCadastrarClube={() => {
            setCadastroClubeOpen(true);
          }}
          isSupabaseLive={isSupabaseLive}
        />
      )}

      {/* 3. CORE INTERACTIVE CONTAINER WITH LOGIN SCREEN OVERLAY */}
      {!showLandingPage && !splashActive && !isLoggedIn && (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#050505] px-4 self-center py-8">
          <LoginScreen 
            times={times}
            empresas={empresas}
            usuarios={usuarios}
            onLogin={handleLogin}
            onRegister={handleRegister}
            triggerToast={triggerVisualToast}
            initialScreenMode={loginScreenMode}
          />
        </div>
      )}

      {/* 4. CORE INTERACTIVE SHELL WITH RESPONSIVE ADAPTATION */}
      {!showLandingPage && !splashActive && isLoggedIn && (
        <div className="w-full h-screen md:h-[92vh] md:max-w-6xl md:my-4 bg-[#050505] md:rounded-[36px] md:border-8 md:border-[#1A1A1E] md:shadow-2xl md:orange-glow relative flex flex-col md:flex-row overflow-hidden">
          
          {/* DESKTOP SIDEBAR MENU */}
          <div className="hidden md:flex flex-col w-68 bg-[#08080A] border-r border-zinc-900 p-5 justify-between flex-shrink-0 select-none relative z-20 text-left">
            <div className="space-y-6">
              {/* Brand Header */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFD700] p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-[#FF5500]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xs font-black text-white tracking-tight uppercase leading-none font-display">
                    FUTEBOL DE <span className="text-[#FF5500]">VÁRZEA</span>
                  </h1>
                </div>
              </div>

              {/* Logged profile Summary card */}
              <div className="p-3.5 bg-black border border-zinc-900 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={activeUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                    alt={activeUser.nome} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-[#FF5500]/50 object-cover flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1 text-left">
                    <span className="text-[9px] text-[#FFD700] font-mono font-bold block leading-none">TORCEDOR SOCIO</span>
                    <h2 className="text-xs font-black text-white truncate max-w-[130px] font-display mt-1 leading-tight">
                      {activeUser.nome}
                    </h2>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-900" />

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-1.5 bg-zinc-950 rounded-xl border border-zinc-900/60 font-mono">
                    <span className="text-[8px] text-zinc-500 font-bold block uppercase leading-none">Pontos</span>
                    <span className="text-[10px] font-extrabold text-white block mt-1">{activeUser.saldo_pontos} pt</span>
                  </div>
                  <div className="p-1.5 bg-zinc-950 rounded-xl border border-zinc-900/60 font-mono">
                    <span className="text-[8px] text-zinc-500 font-bold block uppercase leading-none">Nível</span>
                    <span className="text-[10px] font-extrabold text-[#FF5500] block mt-1">{activeUser.nivel}º</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block px-2">Menu Principal</span>
                {[
                  { id: 'home', label: 'Início', icon: HomeIcon },
                  { id: 'parceiros', label: 'Empresas', icon: ShoppingBag },
                  { id: 'comprovante', label: 'Comprovante', icon: FileText, onClick: () => setUploadModalOpen(true) },
                  { id: 'reels', label: 'Várzea Reels', icon: Play },
                  { id: 'ranking', label: 'Ranking Geral', icon: ListCollapse },
                  { id: 'perfil', label: 'Meus Dados & Contatos', icon: User }
                ].map(tab => {
                  const IconComp = tab.icon;
                  const isActive = tab.onClick ? uploadModalOpen : activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.onClick) {
                          tab.onClick();
                        } else {
                          setActiveTab(tab.id as any);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-xs font-extrabold ${
                        isActive 
                          ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/10' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick action + Sign out */}
            <div className="space-y-2 mt-auto">
              {activePersona === 'usuario' && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full py-2.5 bg-[#FF5500]/10 hover:bg-[#FF5500]/20 border border-[#FF5500]/30 hover:border-[#FF5500]/65 rounded-xl text-xs font-bold font-mono text-[#FF5500] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enviar Cupom</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center py-2.5 text-zinc-500 hover:text-red-400 text-xs font-mono font-bold hover:bg-red-500/5 hover:border-red-500/10 border border-transparent rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Mudar de Perfil / Sair</span>
              </button>
            </div>
          </div>

          {/* MAIN COLUMN VIEWPORT */}
          <div className="flex-1 flex flex-col overflow-hidden w-full h-full relative">
            
            {/* Smartphone details decor for mobile only (hidden on desktop) */}
            <div className="hidden sm:block md:hidden absolute top-0 inset-x-0 h-6 bg-black z-30 flex items-center justify-center rounded-t-[28px]">
              <div className="w-20 h-4 bg-[#121215] rounded-full border border-white/5 flex items-center justify-center animate-pulse">
                <div className="w-10 h-[3px] bg-zinc-800 rounded-full mr-2" />
                <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-950" />
              </div>
            </div>

            {/* Spacer for smartphone earbar on mobile only */}
            <div className="hidden sm:block md:hidden h-6 bg-black flex-shrink-0 z-20" />

            {/* Header Action bar containing user profile summary & alerts */}
            <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center relative z-20">
              <div className="flex items-center gap-2.5 text-left">
                <img 
                  src={activeUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                  alt={activeUser.nome} 
                  referrerPolicy="no-referrer"
                  className="w-8.5 h-8.5 rounded-full border border-[#FF5500] object-cover flex-shrink-0"
                />
                <div className="min-w-0 text-left cursor-pointer" onClick={() => setActiveTab('perfil')}>
                  <span className="text-zinc-500 text-[9px] uppercase font-mono font-bold block leading-none">SÓCIO ATIVO</span>
                  <span className="text-xs font-black text-white truncate max-w-[120px] font-display mt-1 block">
                    {activeUser.nome}
                  </span>
                </div>
              </div>

              {/* Futebol de Várzea Badge Logo */}
              <div className="flex flex-col items-center select-none cursor-pointer" onClick={() => { setShowLandingPage(true); }}>
                <span className="text-sm font-extrabold font-display tracking-tight text-white uppercase sm:text-base leading-none">
                  FUTEBOL DE <span className="text-[#FF5500]">VÁRZEA</span>
                </span>
              </div>

              {/* 3-DOTS FLOATING MENU DROPDOWN */}
              <div className="relative z-50">
                <button
                  onClick={() => setThreeDotsMenuOpen(!threeDotsMenuOpen)}
                  className="p-1.5 bg-zinc-950 border border-zinc-900 text-[#FF5500] hover:text-white hover:border-[#FF5500]/60 rounded-xl cursor-pointer transition-colors relative flex items-center justify-center p-2.5"
                  title="Menu de Ferramentas"
                >
                  <MoreVertical className="w-5 h-5 text-[#FF5500]" />
                </button>

                <AnimatePresence>
                  {threeDotsMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setThreeDotsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-0 mt-2.5 w-60 bg-[#0A0A0E] border border-zinc-850/90 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.95)] p-3 z-50 text-left font-display text-xs divide-y divide-zinc-900 overflow-hidden"
                      >
                        {/* CADASTROS */}
                        <div className="pb-2.5 space-y-1">
                          <span className="px-2.5 text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block mb-1.5">Acesso de Parceiros</span>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setCadastroClubeOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#FFD700]/10 text-zinc-200 hover:text-white rounded-xl transition-all font-bold text-[11px] cursor-pointer"
                          >
                            <Shield className="w-4 h-4 text-yellow-400" />
                            <span>Cadastrar Time</span>
                          </button>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setCadastroEmpresaOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#FF5500]/10 text-zinc-200 hover:text-white rounded-xl transition-all font-bold text-[11px] cursor-pointer"
                          >
                            <Building className="w-4 h-4 text-[#FF5500]" />
                            <span>Cadastrar Empresa</span>
                          </button>
                        </div>

                        {/* RANKINGS */}
                        <div className="pt-2.5 space-y-1">
                          <span className="px-2.5 text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block mb-1.5">Classificação Várzea</span>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setRankingSegment('times');
                              setActiveTab('ranking');
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-yellow-500/10 text-zinc-200 hover:text-white rounded-xl transition-all text-[11px] cursor-pointer"
                          >
                            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                            <span>Ranking Clubes / Times</span>
                          </button>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setRankingSegment('usuarios');
                              setActiveTab('ranking');
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-orange-500/10 text-zinc-200 hover:text-white rounded-xl transition-all text-[11px] cursor-pointer"
                          >
                            <Users className="w-3.5 h-3.5 text-orange-400" />
                            <span>Ranking Usuários</span>
                          </button>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setRankingSegment('empresas');
                              setActiveTab('ranking');
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-blue-500/10 text-zinc-200 hover:text-white rounded-xl transition-all text-[11px] cursor-pointer"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                            <span>Ranking Empresas</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* ==========================================
                ACTIVE PANEL CONTENT DISPLAY SWITCH SCREEN
               ========================================== */}
            <div className="flex-1 overflow-hidden relative flex flex-col">
              
              {activeTab === 'home' && <HomeTab />}
              
              {activeTab === 'parceiros' && <ParceirosTab />}
              
              {activeTab === 'reels' && <ReelsTab />}
              
              {activeTab === 'ranking' && <RankingTab />}
              
              {activeTab === 'perfil' && <PerfilTab />}

            </div>

            {/* ==========================================
                BOTTOM GLASSMORPHISM NAV BAR COMPONENT
               ========================================== */}
            <div className="p-3.5 bg-black/90 border-t border-zinc-900 pb-5 flex justify-around items-center select-none backdrop-blur-xl relative z-30 flex-shrink-0 md:hidden animate-fadeIn">
              {/* Tab 1: Home */}
              <button 
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'home' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <HomeIcon className="w-5.5 h-5.5" />
                <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Home</span>
              </button>

              {/* Tab 2: Empresas */}
              <button 
                onClick={() => setActiveTab('parceiros')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'parceiros' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <ShoppingBag className="w-5.5 h-5.5" />
                <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Empresas</span>
              </button>

              {/* Tab 3: Enviar Comprovante */}
              <button 
                onClick={() => setUploadModalOpen(true)}
                className="flex flex-col items-center gap-1 cursor-pointer text-zinc-500 hover:text-zinc-300 relative"
                title="Enviar Comprovante"
              >
                <div className="w-10 h-10 bg-[#FF5500] rounded-full flex items-center justify-center text-black border border-orange-500 shadow-md translate-y-[-18px] absolute z-40 transition-transform active:scale-95">
                  <Plus className="w-6 h-6 text-white" />
                </div>
                <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none mt-7">Cupom</span>
              </button>

              {/* Tab 4: Reels */}
              <button 
                onClick={() => setActiveTab('reels')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'reels' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <Play className="w-5.5 h-5.5" />
                <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Reels</span>
              </button>

              {/* Tab 5: Perfil */}
              <button 
                onClick={() => setActiveTab('perfil')}
                className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                  activeTab === 'perfil' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <User className="w-5.5 h-5.5" />
                <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Perfil</span>
              </button>
            </div>

            {/* ==========================================
                MODAL DRAWERS & INTERCONNECTED VISUAL SHEETS
               ========================================== */}
            <AnimatePresence>
              {/* 1. Upload receipt drawer component */}
              {uploadModalOpen && (
                <UploadReceiptModal 
                  times={times} 
                  empresas={empresas} 
                  onSubmit={handleUploadReceipt} 
                  onClose={() => setUploadModalOpen(false)}
                  defaultClubId={activeUser.time_coracao_id}
                  triggerToast={triggerVisualToast}
                />
              )}

              {/* 1.1 Cadastro Empresa Modal Overlay */}
              {cadastroEmpresaOpen && (
                <CadastroEmpresaModal
                  onAddEmpresaLocal={handleAddEmpresaLocal}
                  onClose={() => setCadastroEmpresaOpen(false)}
                  triggerToast={triggerVisualToast}
                />
              )}

              {/* 1.2 Cadastro Clube Modal Overlay */}
              {cadastroClubeOpen && (
                <CadastroClubeModal
                  onAddClubeLocal={handleAddClubeLocal}
                  onClose={() => setCadastroClubeOpen(false)}
                  triggerToast={triggerVisualToast}
                />
              )}

              {/* 2. Patrocinador Empresa details sheet */}
              {selectedEmpresaSheet && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center p-4"
                  onClick={() => setSelectedEmpresaSheet(null)}
                >
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#0b0b0d] border border-zinc-800 w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Banner */}
                    <div className="relative h-40 w-full bg-zinc-900 select-none">
                      <img 
                        src={selectedEmpresaSheet.banner} 
                        alt="banner" 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/25 to-transparent" />
                      
                      {/* Close button */}
                      <button 
                        onClick={() => setSelectedEmpresaSheet(null)}
                        className="absolute top-4 right-4 bg-black/60 hover:bg-[#FF5500] hover:text-black hover:scale-105 rounded-full p-2 text-white border border-white/10 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Sponsor badge */}
                      <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FF5500] to-[#FFD700] p-[1px] rounded-lg shadow-md">
                        <div className="bg-black text-white font-extrabold text-[10px] uppercase font-display tracking-wider py-1 px-2.5 rounded-[7px]">
                          ★ PARCEIRO OFICIAL
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-6 space-y-5 text-left font-sans">
                      <div className="flex gap-4 items-center">
                        <img 
                          src={selectedEmpresaSheet.logo} 
                          alt="logo" 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF5500]/50"
                        />
                        <div className="min-w-0 flex-1">
                          <span className="text-[9px] font-mono font-bold text-[#FFD700] uppercase tracking-widest">{selectedEmpresaSheet.categoria}</span>
                          <h3 className="text-xl font-black text-white tracking-tight leading-tight uppercase font-display mt-0.5">
                            {selectedEmpresaSheet.nome}
                          </h3>
                          <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FF5500]" />
                            <span>{selectedEmpresaSheet.bairro || 'Itaquera'}, São Paulo</span>
                          </p>
                        </div>
                      </div>

                      {/* Highlights stats row */}
                      <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-center">
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest">COTA DE REPASSE DO TIME</span>
                          <p className="text-base font-black text-orange-500 mt-0.5">5.0%</p>
                        </div>
                        <div>
                          <span className="text-[8px] text-zinc-500 uppercase tracking-widest">MULTIPLIER DE PONTOS</span>
                          <p className="text-base font-black text-[#FFD700] mt-0.5">
                            {selectedEmpresaSheet.pontos_por_real || 15}x / R$
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                          Descrição do Patrocinador
                        </h4>
                        <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                          Este patrocinador é credenciado oficialmente pelo ecossistema do Futebol de Várzea! Em cada nota de consumo enviada, pontos de lealdade são creditados na sua conta para fortalecer sua equipe de coração, impulsionando a comissão doada para equipar times do campeonato de várzea.
                        </p>
                      </div>

                      {/* Affiliated sponsors information */}
                      <div className="bg-orange-500/5 border border-orange-500/10 p-3 rounded-xl space-y-1">
                        <span className="text-[9px] font-mono tracking-wider font-extrabold text-[#FF5500] uppercase">BENEFÍCIOS COLETIVOS</span>
                        <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                          Comprando aqui você financia diretamente bolas, chuteiras de treino e transporte do <strong className="text-[#FFD700]">Laranja Mecânica de Itaquera FC</strong> e de agremiações esportivas do terrão.
                        </p>
                      </div>

                      {/* Call to action message link */}
                      <div className="pt-2">
                        <a 
                          href={`https://wa.me/${selectedEmpresaSheet.telefone || '5511999998888'}?text=${encodeURIComponent(`Olá! Vi sua empresa ${selectedEmpresaSheet.nome} no app de Sócio-Torcedor de Várzea. Gostaria de solicitar um pedido!`)}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black font-extrabold uppercase py-3.5 px-4 rounded-xl text-center text-xs tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4.5 h-4.5 text-black fill-current" />
                          <span>Fazer Pedido no WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {/* 3. Clube de Futebol Parceiro details sheet */}
              {selectedClubeSheet && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center p-4"
                  onClick={() => setSelectedClubeSheet(null)}
                >
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#0b0b0d] border border-zinc-800 w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl relative p-6 space-y-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button 
                      onClick={() => setSelectedClubeSheet(null)}
                      className="absolute top-4 right-4 bg-zinc-900 hover:bg-[#FF5500] hover:text-black rounded-full p-1.5 text-zinc-500 hover:scale-105 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Header Crest */}
                    <div className="flex flex-col items-center text-center space-y-3 pt-4 select-none">
                      <img 
                        src={selectedClubeSheet.logo} 
                        alt="escudo" 
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 bg-zinc-950 p-2 shadow-lg hover:rotate-6 transition-transform"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest">PATROCINADO VÁRZEA FC</span>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase font-display leading-none">
                          {selectedClubeSheet.nome}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">Sede: {selectedClubeSheet.bairro || 'Terrão no Bairro'}</p>
                      </div>
                    </div>

                    {/* Stats columns */}
                    <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-center">
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase">CLASSIFICAÇÃO</span>
                        <p className="text-sm font-black text-white mt-0.5">{selectedClubeSheet.pontos || 0} Pts</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase">MEMBROS</span>
                        <p className="text-sm font-black text-white mt-0.5 font-sans">850+</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase">REPASSADO</span>
                        <p className="text-sm font-black text-[#25D366] mt-0.5">R$ 1.250,00</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-left font-sans text-xs">
                      <span className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-yellow-400 pl-2 block select-none">
                        Apoiado Comercialmente no Bairro
                      </span>
                      <p className="text-zinc-400 leading-relaxed font-sans">
                        Apoiar este time no aplicativo significa que todo cupom fiscal de hamburguerias, padarias ou barbearias que você carregar reverterá automaticamente auxílios em comissões de patrocínio para a escolinha e fardamentos desta comunidade esportiva.
                      </p>
                    </div>

                    {/* Confirm default support club button */}
                    <button
                      onClick={() => {
                        triggerVisualToast({
                          id: `support-${selectedClubeSheet.id}-${Date.now()}`,
                          message: `APOIANDO ${selectedClubeSheet.nome.toUpperCase()}!`,
                          sub: `Seus cupons doam prioridade para este time de várzea.`,
                          iconType: 'time'
                        });
                        setSelectedClubeSheet(null);
                      }}
                      className="w-full bg-[#FF5500] hover:bg-orange-600 text-white font-extrabold uppercase py-3.5 px-4 rounded-xl text-center text-xs tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-orange-glow"
                    >
                      <Heart className="w-4.5 h-4.5 fill-current" />
                      <span>Apoiar Oficialmente este Time</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* 4. Sócio Torcedor Usuario profile sheet context */}
              {selectedUsuarioSheet && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center p-4"
                  onClick={() => setSelectedUsuarioSheet(null)}
                >
                  <motion.div 
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 300 }}
                    className="bg-[#0b0b0d] border border-zinc-800 w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl relative p-6 space-y-5"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Close button */}
                    <button 
                      onClick={() => setSelectedUsuarioSheet(null)}
                      className="absolute top-4 right-4 bg-zinc-900 hover:bg-[#FF5500] hover:text-black rounded-full p-1.5 text-zinc-500 hover:scale-105 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Profile Header details */}
                    <div className="flex flex-col items-center text-center space-y-3 pt-4 select-none">
                      <img 
                        src={selectedUsuarioSheet.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                        alt="usuario-avatar" 
                        referrerPolicy="no-referrer"
                        className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 bg-zinc-950 p-0.5 shadow-lg"
                      />
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest leading-none">SÓCIO APOIADOR ATIVO</span>
                        <h3 className="text-2xl font-black text-white tracking-tight uppercase font-display leading-none mt-1">
                          {selectedUsuarioSheet.nome}
                        </h3>
                        <p className="text-xs text-zinc-400 font-medium">Apoiador do Bairro: Itaquera</p>
                      </div>
                    </div>

                    {/* Users stats profile dashboard */}
                    <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-center">
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase">NÍVEL DO SÓCIO</span>
                        <p className="text-base font-black text-[#FF5500] mt-0.5">Lvl {selectedUsuarioSheet.nivel}</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase">PONTUAÇÃO COMUNITÁRIA</span>
                        <p className="text-base font-black text-[#FFD700] mt-0.5">{selectedUsuarioSheet.saldo_pontos || 12450} Pts</p>
                      </div>
                    </div>

                    <div className="space-y-2 text-left font-sans text-xs">
                      <span className="text-[9px] font-mono font-extrabold text-[#FFD700] uppercase tracking-widest block select-none">ESTATÍSTICA SOCIAL DOS JOGOS</span>
                      <p className="text-zinc-400 leading-relaxed font-sans">
                        Membros ativos escalam o nível de apoiador do ecossistema e pontuam nas tabelas de liderança de torcida. Quanto mais compras compras fortalecidas, mais recursos de apoio voltam para os times do terrão.
                      </p>
                    </div>

                    <button
                      onClick={() => setSelectedUsuarioSheet(null)}
                      className="w-full bg-[#FF5500] hover:bg-orange-600 text-white font-extrabold uppercase py-3 px-4 rounded-xl text-center text-xs tracking-wider shadow-md active:scale-95 transition-all text-orange-glow"
                    >
                      <span>Concluído</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {/* 5. Home Video Playing overlay shorts modal */}
              {homeVideoPlaying && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-scaleUp"
                  onClick={() => setHomeVideoPlaying(null)}
                >
                  <div 
                    className="bg-[#09090b] border border-orange-500/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Aspect-video structure */}
                    <div className="relative aspect-[9/16] bg-black max-h-[580px] w-full flex items-center justify-center overflow-hidden">
                      <video 
                        src={homeVideoPlaying.video_url} 
                        autoPlay 
                        loop 
                        playsInline 
                        muted={false}
                        className="w-full h-full object-cover animate-pulse"
                      />

                      {/* Dark gradient shadow overlays */}
                      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                      {/* Back header context info */}
                      <div className="absolute top-4 left-4 flex items-center gap-2 select-none">
                        <img 
                          src={homeVideoPlaying.empresa_logo} 
                          alt="logo" 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-lg object-cover border border-[#FF5500]/50"
                        />
                        <div className="text-left leading-none">
                          <span className="text-[9px] font-mono tracking-widest text-[#FF5500] uppercase font-black block">REEL DO PATROCINADOR</span>
                          <h4 className="text-xs font-black text-white font-display uppercase mt-0.5">{homeVideoPlaying.empresa_nome}</h4>
                        </div>
                      </div>

                      <button 
                        onClick={() => setHomeVideoPlaying(null)}
                        className="absolute top-4 right-4 bg-black/60 hover:bg-[#FF5500] hover:text-black rounded-full p-2 text-white border border-white/15 transition-all cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      {/* Video specifications layout in overlay bottom bar */}
                      <div className="absolute bottom-16 inset-x-0 p-4 space-y-2.5 text-left z-15 select-none">
                        <p className="text-xs font-semibold font-sans text-zinc-200 leading-relaxed text-shadow shadow-black/80">
                          {homeVideoPlaying.descricao}
                        </p>

                        <div className="flex gap-2.5 items-center bg-black/65 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                          <div className="flex-1 min-w-0">
                            <span className="text-[7px] font-mono tracking-widest text-yellow-400 uppercase font-bold block">Cupom Exclusivo</span>
                            <span className="text-xs font-black text-white font-mono mt-0.5 block">{homeVideoPlaying.cupom_codigo || 'CRIASVARZEA'}</span>
                          </div>
                          <button 
                            onClick={() => {
                              triggerVisualToast({
                                id: `coupon-${Date.now()}`,
                                message: '🔥 CUPOM RESGATADO!',
                                sub: `Código [${homeVideoPlaying.cupom_codigo || 'CRIASVARZEA'}] copiado com sucesso!`,
                                iconType: 'promocao'
                              });
                              setHomeVideoPlaying(null);
                            }}
                            className="bg-[#FF5500] hover:bg-orange-600 text-white font-black font-display text-[9px] px-3 py-1.5 rounded-lg uppercase cursor-pointer transition-colors border-0 animate-bounce"
                          >
                            Copiar Código
                          </button>
                        </div>
                      </div>

                      {/* Side action panel bars */}
                      <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 text-center z-20 select-none">
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF5500]/20 flex items-center justify-center text-white border border-white/10">
                            <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                          </div>
                          <span className="text-[9px] text-zinc-300 font-mono font-bold">{homeVideoPlaying.curtidas || 480}</span>
                        </div>
                        <div className="flex flex-col items-center gap-1 cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF5500]/20 flex items-center justify-center text-white border border-white/10">
                            <MessageCircle className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[9px] text-zinc-300 font-mono font-bold">{homeVideoPlaying.comentarios_count || 12}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <VarzeaProvider>
      <VarzeaApp />
    </VarzeaProvider>
  );
}
