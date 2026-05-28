import React, { useState, useRef } from 'react';
import { Heart, MessageCircle, Share2, Volume2, VolumeX, Play, Pause, Gift, Sparkles } from 'lucide-react';
import { MidiaVideo } from '../types';

interface VideoFeedProps {
  videos: MidiaVideo[];
  onClaimCoupon: (couponCode: string, discount: string) => void;
}

export default function VideoFeed({ videos, onClaimCoupon }: VideoFeedProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [mutedStates, setMutedStates] = useState<Record<string, boolean>>({
    'v-1': true,
    'v-2': true,
    'v-3': true,
  });
  const [playStates, setPlayStates] = useState<Record<string, boolean>>({
    'v-1': true,
    'v-2': true,
    'v-3': true,
  });
  const [likes, setLikes] = useState<Record<string, number>>({});
  const [likedList, setLikedList] = useState<Record<string, boolean>>({});

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});

  const toggleMute = (id: string) => {
    const isCurrentlyMuted = mutedStates[id] !== false; // defaults to true
    
    // Toggle state
    setMutedStates(prev => ({ ...prev, [id]: !isCurrentlyMuted }));
    
    // Update real video element
    const video = videoRefs.current[id];
    if (video) {
      video.muted = !isCurrentlyMuted;
    }
  };

  const togglePlay = (id: string) => {
    const isCurrentlyPlaying = playStates[id] !== false; // defaults to true
    
    setPlayStates(prev => ({ ...prev, [id]: !isCurrentlyPlaying }));
    
    const video = videoRefs.current[id];
    if (video) {
      if (isCurrentlyPlaying) {
        video.pause();
      } else {
        video.play().catch(() => {});
      }
    }
  };

  const handleLike = (id: string, initialLikesCount: number) => {
    const hasLiked = likedList[id] || false;
    const currentLikes = likes[id] ?? initialLikesCount;

    if (hasLiked) {
      setLikes(prev => ({ ...prev, [id]: currentLikes - 1 }));
      setLikedList(prev => ({ ...prev, [id]: false }));
    } else {
      setLikes(prev => ({ ...prev, [id]: currentLikes + 1 }));
      setLikedList(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const index = Math.round(container.scrollTop / container.clientHeight);
    if (index !== currentIdx && index >= 0 && index < videos.length) {
      setCurrentIdx(index);
      
      // Pause other videos when scrolling away
      videos.forEach((v, idx) => {
        const video = videoRefs.current[v.id];
        if (video) {
          if (idx === index) {
            video.currentTime = 0;
            video.play().catch(() => {});
            setPlayStates(prev => ({ ...prev, [v.id]: true }));
          } else {
            video.pause();
            setPlayStates(prev => ({ ...prev, [v.id]: false }));
          }
        }
      });
    }
  };

  return (
    <div className="flex-1 bg-black flex flex-col relative h-[calc(100vh-135px)] text-white font-sans max-w-md mx-auto">
      {/* Title Header overlay */}
      <div className="absolute top-0 inset-x-0 z-20 bg-gradient-to-b from-black/80 to-transparent p-4 flex justify-between items-center pointer-events-none">
        <h2 className="text-sm font-extrabold tracking-wide uppercase font-display text-[#FF5500] text-orange-glow pointer-events-auto">
          🔥 REELS DA VÁRZEA
        </h2>
        <div className="bg-black/40 border border-white/10 px-2.5 py-1 rounded-full text-[10px] pointer-events-auto">
          Comércio Parceiro
        </div>
      </div>

      {/* Vertical scroll contain */}
      <div 
        onScroll={handleScroll}
        className="flex-1 overflow-y-scroll snap-y snap-mandatory select-none no-scrollbar"
        style={{ scrollBehavior: 'smooth' }}
      >
        {videos.map((vid, index) => {
          const isCurrent = index === currentIdx;
          const isMuted = mutedStates[vid.id] !== false;
          const isPlaying = playStates[vid.id] !== false;
          const totalLikes = likes[vid.id] ?? vid.curtidas;
          const hasLiked = likedList[vid.id] || false;

          return (
            <div 
              key={vid.id}
              className="h-[calc(100vh-135px)] snap-start snap-always w-full bg-zinc-950 relative overflow-hidden flex flex-col justify-end"
            >
              {/* Actual Video Tag Background */}
              <video
                ref={(el) => { videoRefs.current[vid.id] = el; }}
                src={vid.video_url}
                loop
                muted={isMuted}
                autoPlay={index === 0}
                playsInline
                className="absolute inset-0 w-full h-full object-cover pointer-events-auto cursor-pointer"
                onClick={() => togglePlay(vid.id)}
              />

              {/* Shadows to provide contrast to text overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-black/40 pointer-events-none" />

              {/* Pause Centered HUD Indicator */}
              {!isPlaying && (
                <div 
                  className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center justify-center pointer-events-none"
                >
                  <div className="bg-black/60 p-5 rounded-full border border-white/10 animate-ping">
                    <Play className="w-8 h-8 text-[#FF5500] fill-[#FF5500]" />
                  </div>
                </div>
              )}

              {/* Sound/Mute HUD hover */}
              <div className="absolute right-4 top-16 z-20">
                <button
                  onClick={() => toggleMute(vid.id)}
                  className="p-3 bg-black/60 border border-white/10 hover:border-[#FF5500]/50 rounded-full cursor-pointer text-white shadow-lg backdrop-blur-md transition-all"
                >
                  {isMuted ? (
                    <VolumeX className="w-5.5 h-5.5 text-zinc-400" />
                  ) : (
                    <Volume2 className="w-5.5 h-5.5 text-orange-400" />
                  )}
                </button>
              </div>

              {/* Side Interactivity Column (Likes, Comments, Share) */}
              <div className="absolute right-4 bottom-24 z-20 flex flex-col items-center gap-5">
                {/* Like Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => handleLike(vid.id, vid.curtidas)}
                    className={`p-3 bg-black/60 border rounded-full backdrop-blur-sm cursor-pointer shadow-md transition-all ${
                      hasLiked ? 'border-red-500 text-red-500 scale-110' : 'border-white/10 text-white hover:border-red-500'
                    }`}
                  >
                    <Heart className={`w-5.5 h-5.5 ${hasLiked ? 'fill-red-500' : ''}`} />
                  </button>
                  <span className="text-[11px] font-mono font-semibold text-zinc-300 mt-1.5 select-none text-shadow">
                    {totalLikes}
                  </span>
                </div>

                {/* Comment Mockup Link */}
                <div className="flex flex-col items-center">
                  <button
                    className="p-3 bg-black/60 border border-white/10 rounded-full backdrop-blur-sm cursor-pointer shadow-md text-white hover:border-yellow-400 transition-all"
                    onClick={() => alert(`Participe d'a Torcida no Sócio Compra! ${vid.comentarios_count} comentários ativos.`)}
                  >
                    <MessageCircle className="w-5.5 h-5.5" />
                  </button>
                  <span className="text-[11px] font-mono font-semibold text-zinc-300 mt-1.5 select-none text-shadow">
                    {vid.comentarios_count}
                  </span>
                </div>

                {/* Share Link */}
                <div className="flex flex-col items-center">
                  <button
                    className="p-3 bg-black/60 border border-white/10 rounded-full backdrop-blur-sm cursor-pointer shadow-md text-white hover:border-[#FF5500] transition-all"
                    onClick={() => alert('Parceria copiada! Encaminhe para a galera do seu time.')}
                  >
                    <Share2 className="w-5.5 h-5.5" />
                  </button>
                  <span className="text-[10px] text-zinc-400 mt-1 uppercase select-none">Compart</span>
                </div>
              </div>

              {/* Bottom Info Details Area */}
              <div className="relative p-5 z-10 flex flex-col gap-3 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <img 
                    src={vid.empresa_logo} 
                    alt={vid.empresa_nome} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-xl border border-orange-500 object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-sm tracking-tight text-white font-display">
                      {vid.empresa_nome}
                    </h3>
                    <p className="text-[10px] text-[#FFD700] uppercase font-bold tracking-wide">
                      Parceiro Oficial da Várzea
                    </p>
                  </div>
                </div>

                <p className="text-xs text-zinc-200 leading-relaxed font-sans max-w-[85%]">
                  {vid.descricao}
                </p>

                {/* Direct Partner Support CTA Box */}
                <div className="mt-2 text-left bg-gradient-to-r from-orange-500/20 to-transparent border border-orange-500/15 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="bg-[#FF5500]/20 p-1.5 rounded-lg text-[#FF5500]">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div className="flex flex-col text-left">
                      <span className="text-[9px] tracking-wide text-zinc-500 font-semibold uppercase font-mono">PARCERIA SOCIAL</span>
                      <span className="text-[11px] font-bold text-white font-sans">
                        Consuma aqui e fortaleça o futebol!
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Envie mensagem para ${vid.empresa_nome} pelo WhatsApp ou visite a loja para ganhar pontos!`)}
                    className="text-[10px] bg-[#FF5500] text-white hover:bg-orange-600 font-bold px-3 py-1.5 rounded-lg cursor-pointer uppercase select-none transition-all font-display"
                  >
                    Apoiar
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
