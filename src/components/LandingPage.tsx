import { Flame, Star, ShoppingBag, Trophy, ArrowRight, Zap, RefreshCw, Smartphone, TrendingUp, UserPlus, LogIn, Building2, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onEnterApp: () => void;
  onCriaConta: () => void;
  onCadastrarEmpresa: () => void;
  onCadastrarClube: () => void;
  isSupabaseLive: boolean;
}

export default function LandingPage({ 
  onEnterApp, 
  onCriaConta, 
  onCadastrarEmpresa, 
  onCadastrarClube, 
  isSupabaseLive 
}: LandingPageProps) {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex flex-col justify-between">
      {/* Hero Banner Header */}
      <div className="relative overflow-hidden pt-12 pb-24 px-6 border-b border-[#FF5500]/10 bg-gradient-to-b from-black via-[#0A0A0C] to-[#050505]">
        {/* Abstract glowing background blobs */}
        <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-[#FF5500]/15 blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#FFD700]/10 blur-3xl pointer-events-none" />
        
        {/* Subtle grid lines */}
        <div 
          className="absolute inset-0 bg-repeat opacity-5 pointer-events-none"
          style={{ backgroundImage: 'radial-gradient(circle, #FF5500 1px, transparent 1px)', backgroundSize: '24px 24px' }}
        />

        {/* Content */}
        <div className="relative max-w-md mx-auto text-center flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex items-center gap-2 border border-yellow-400/20 bg-yellow-400/5 px-4.5 py-1.5 rounded-full mb-6 text-yellow-400 text-xs font-semibold uppercase tracking-wider"
          >
            <Trophy className="w-4 h-4" />
            <span>FUTEBOL DE VÁRZEA</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight uppercase sm:text-5xl font-display leading-[1.1]"
          >
            A ENERGIA DA <br />
            <span className="text-[#FF5500] text-orange-glow">VÁRZEA</span> COM TOQUE <br />
            <span className="text-[#FFD700] text-yellow-glow">BILIONÁRIO</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 0.9, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-content text-zinc-400 mt-5 text-sm leading-relaxed max-w-sm"
          >
            Apoie o time de futebol da sua comunidade comprando no comércio local. Ganhe pontos de apoio e fortaleça toda a várzea!
          </motion.p>

          {/* Active Database Badge status */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-4 flex items-center gap-2 bg-black/60 border border-zinc-800 rounded-full px-3.5 py-1 text-[11px] font-mono text-zinc-400"
          >
            <div className={`w-2 h-2 rounded-full ${isSupabaseLive ? 'bg-green-500 animate-pulse' : 'bg-orange-500 animate-pulse'}`} />
            <span>
              {isSupabaseLive ? 'Supabase Realtime: Conectado' : 'Supabase: Simulando Offline'}
            </span>
          </motion.div>

          {/* Core Call to action options - STACK OF FOUR LUXURY BUTTONS */}
          <div className="w-full max-w-sm mt-8 space-y-3.5 px-2 select-none">
            {/* 1. Entrar na Conta */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onEnterApp}
              className="w-full relative group overflow-hidden rounded-2xl bg-gradient-to-r from-[#FF5500] to-[#FFAA00] p-[1.5px] cursor-pointer shadow-[0_4px_16px_rgba(255,85,0,0.15)] duration-200"
            >
              <div className="flex items-center justify-between bg-black/95 py-3.5 px-5 rounded-[14px] group-hover:bg-[#FF5500]/10 transition-all font-display font-black text-white uppercase text-xs tracking-wider">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-[#FF5500]/20 rounded-lg text-[#FF5500]">
                    <LogIn className="w-4.5 h-4.5" />
                  </span>
                  <span>FAZER LOGIN / ENTRAR</span>
                </div>
                <ArrowRight className="w-4 h-4 text-[#FFAA00] group-hover:translate-x-1 duration-200" />
              </div>
            </motion.button>

            {/* 2. Criar Nova Conta */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={onCriaConta}
              className="w-full group overflow-hidden rounded-2xl border border-zinc-800 bg-[#0A0A0C] hover:border-zinc-700 py-3.5 px-5 cursor-pointer duration-200"
            >
              <div className="flex items-center justify-between font-display font-bold text-zinc-200 uppercase text-xs tracking-wider">
                <div className="flex items-center gap-3">
                  <span className="p-1.5 bg-zinc-900 rounded-lg text-zinc-400 group-hover:text-white transition-colors">
                    <UserPlus className="w-4.5 h-4.5" />
                  </span>
                  <span>CRIAR CONTA DE FILIADO</span>
                </div>
                <ArrowRight className="w-4 h-4 text-zinc-500 group-hover:text-white group-hover:translate-x-1 duration-200" />
              </div>
            </motion.button>

            <div className="grid grid-cols-2 gap-3">
              {/* 3. Cadastrar Empresa */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onCadastrarEmpresa}
                className="group relative overflow-hidden rounded-2xl border border-indigo-500/30 hover:border-indigo-500/50 bg-[#0C0C12] py-3.5 px-3.5 cursor-pointer duration-200 text-left flex flex-col justify-between h-[85px]"
              >
                <div className="flex justify-between w-full items-center">
                  <span className="p-1.5 bg-indigo-500/15 rounded-lg text-indigo-400">
                    <Building2 className="w-4.5 h-4.5" />
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold">EMPRESA</span>
                </div>
                <span className="font-display font-black text-white uppercase text-[10.5px] leading-tight group-hover:text-indigo-400 duration-200">
                  Cadastrar Cooperante
                </span>
              </motion.button>

              {/* 4. Cadastrar Clube */}
              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={onCadastrarClube}
                className="group relative overflow-hidden rounded-2xl border border-yellow-500/30 hover:border-yellow-500/50 bg-[#12120C] py-3.5 px-3.5 cursor-pointer duration-200 text-left flex flex-col justify-between h-[85px]"
              >
                <div className="flex justify-between w-full items-center">
                  <span className="p-1.5 bg-yellow-400/15 rounded-lg text-yellow-400">
                    <Trophy className="w-4.5 h-4.5" />
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono font-bold">CLUBE</span>
                </div>
                <span className="font-display font-black text-white uppercase text-[10.5px] leading-tight group-hover:text-yellow-400 duration-200">
                  Cadastrar Time de Várzea
                </span>
              </motion.button>
            </div>
          </div>
        </div>
      </div>

      {/* Dynamic Counter Metrics */}
      <div className="px-6 py-8 bg-[#0A0A0C] border-y border-[#FF5500]/10">
        <div className="max-w-md mx-auto grid grid-cols-3 gap-4 text-center">
          <div className="flex flex-col items-center">
            <span className="text-xl font-extrabold text-[#FF5500] font-display select-none">R$ 14.2k</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">Ajuda Enviada</span>
          </div>
          <div className="flex flex-col items-center border-x border-zinc-800">
            <span className="text-xl font-extrabold text-[#FFD700] font-display select-none">3.240</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">Sócios Fiéis</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-xl font-extrabold text-white font-display select-none">12 Bairros</span>
            <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold mt-1">Cobertos</span>
          </div>
        </div>
      </div>

      {/* Feature explanations */}
      <div className="px-6 py-12 max-w-md mx-auto space-y-10 flex-1">
        <h2 className="text-lg font-bold font-display uppercase tracking-widest text-[#FFD700] border-l-2 border-[#FFD700] pl-3">
          Como Funciona o Ecossistema?
        </h2>

        {/* Step 1 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-[#FF5500]/10 border border-[#FF5500]/30">
            <ShoppingBag className="w-5.5 h-5.5 text-[#FF5500]" />
          </div>
          <div>
            <h3 className="font-bold text-base font-display tracking-tight flex items-center gap-2">
              <span className="text-[#FF5500]">01.</span> Compre no Bairro
            </h3>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
              Vá a açougues, mercados, salões ou academias credenciados com selo Sócio Compra.
            </p>
          </div>
        </div>

        {/* Step 2 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-[#FFD700]/10 border border-[#FFD700]/30">
            <RefreshCw className="w-5.5 h-5.5 text-[#FFD700]" />
          </div>
          <div>
            <h3 className="font-bold text-base font-display tracking-tight flex items-center gap-2">
              <span className="text-[#FFD700]">02.</span> Envie o Cupom
            </h3>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
              Tire foto ou escaneie o cupom fiscal de compra no app. Nosso sistema audita instantaneamente.
            </p>
          </div>
        </div>

        {/* Step 3 */}
        <div className="flex gap-4">
          <div className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-xl bg-orange-500/10 border border-orange-500/30">
            <Trophy className="w-5.5 h-5.5 text-orange-400" />
          </div>
          <div>
            <h3 className="font-bold text-base font-display tracking-tight flex items-center gap-2">
              <span className="text-orange-400">03.</span> Ganhe Pontos + Fortaleça seu Clube
            </h3>
            <p className="text-zinc-400 text-xs mt-1.5 leading-relaxed">
              Você acumula pontos para subir no ranking de apoiadores e uma ajuda automática é doada para o seu time de várzea favorito!
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding Area */}
      <div className="p-6 text-center border-t border-zinc-900 bg-black">
        <p className="text-xs text-zinc-500">
          Usa tecnologia autônoma Supabase & React 19.
        </p>
        <button 
          onClick={onEnterApp}
          className="text-xs text-[#FF5500] font-semibold hover:underline mt-2 inline-flex items-center gap-1 select-none"
        >
          Iniciar Experiência Premium <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
