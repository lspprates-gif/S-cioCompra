import { useEffect, useState } from 'react';
import { ShieldCheck, Flame, Zap, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onDismiss: () => void;
  isSupabaseLive: boolean;
}

export default function SplashScreen({ onDismiss, isSupabaseLive }: SplashScreenProps) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Aquecendo os motores...');

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onDismiss, 900);
          return 100;
        }
        
        // Dynamic messaging based on loaded chunk
        if (prev === 20) setStatusText('Iluminando refletores do Terrão...');
        if (prev === 50) setStatusText('Estabelecendo conexão Supabase Realtime...');
        if (prev === 80) setStatusText(isSupabaseLive ? '⚡ Conectado ao Supabase [Ativo]' : '⚠️ Executando com Cache do Sócio Compra [Estável]');
        
        return prev + 4;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onDismiss, isSupabaseLive]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex flex-col justify-between bg-black p-6 font-display"
    >
      {/* Stadium Background Overlay */}
      <div 
        className="absolute inset-0 opacity-15 bg-cover bg-center pointer-events-none"
        style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop")' }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/80 to-black pointer-events-none" />

      {/* Top logo header */}
      <div className="relative flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 border border-[#FF5500]/30 px-3 py-1 bg-black/60 rounded-full">
          <Database className="w-4 h-4 text-[#FF5500] animate-pulse" />
          <span className="text-white text-xs font-mono select-none tracking-wider font-semibold">
            {isSupabaseLive ? 'SUPABASE ONLINE' : 'OFFLINE MODE'}
          </span>
        </div>
        
        <div className="flex items-center gap-1.5 bg-[#FF5500]/10 text-[#FF5500] px-3 py-1 rounded-full text-xs font-semibold">
          <Zap className="w-3.5 h-3.5 text-yellow-400 animate-bounce" />
          <span>VÁRZEA PREMIUM</span>
        </div>
      </div>

      {/* Main Branding Logo block */}
      <div className="relative flex flex-col items-center justify-center flex-1 py-12">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: 'spring' }}
          className="relative flex items-center justify-center w-28 h-28 rounded-3xl bg-gradient-to-br from-[#FF5500] to-[#FFD700] p-[2px] orange-glow mb-6"
        >
          <div className="flex flex-col items-center justify-center w-full h-full bg-[#0A0A0B] rounded-[22px]">
            <Flame className="w-14 h-14 text-orange-500 fill-orange-500/10 animate-pulse" />
          </div>
          {/* Soccer ball icon decor on corner */}
          <div className="absolute -bottom-1 -right-1 bg-black p-1.5 rounded-full border border-orange-500/50">
            <ShieldCheck className="w-5 h-5 text-[#FFD700]" />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <h1 className="text-4xl font-extrabold tracking-tight text-white uppercase sm:text-5xl">
            FUTEBOL DE<span className="text-[#FF5500] text-orange-glow"> VÁRZEA</span>
          </h1>
          <p className="text-xs tracking-[0.2em] font-medium text-[#FFD700] uppercase mt-2 select-none">
            Programa de Apoiadores Locais
          </p>
        </motion.div>
      </div>

      {/* Bottom Loading Progress and copyright */}
      <div className="relative flex flex-col items-center mb-6">
        <p className="text-xs font-mono text-[#A0A0AB] mb-3 animate-pulse">
          {statusText}
        </p>

        <div className="w-full max-w-[280px] h-[6px] bg-[#1F1F23] rounded-full overflow-hidden border border-white/5">
          <motion.div
            className="h-full bg-gradient-to-r from-[#FF5500] to-[#FFD700]"
            initial={{ width: '0%' }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: 'easeOut' }}
          />
        </div>

        <p className="text-[10px] font-mono text-zinc-600 mt-6 tracking-wide select-none">
          SOCIO COMPRA LTDA v4.0.0 © 2026
        </p>
      </div>
    </motion.div>
  );
}
