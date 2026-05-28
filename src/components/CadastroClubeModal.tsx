import React, { useState, useRef } from 'react';
import { Camera, Trophy, MapPin, User, Phone, Globe, X, Sparkles } from 'lucide-react';
import { uploadFileToStorage } from '../supabaseClient';

interface CadastroClubeModalProps {
  onAddClubeLocal: (data: any) => void;
  onClose: () => void;
  triggerToast?: (toast: { id: string; message: string; sub?: string; iconType?: string }) => void;
}

export default function CadastroClubeModal({ onAddClubeLocal, onClose, triggerToast }: CadastroClubeModalProps) {
  const [nome, setNome] = useState('');
  const [bairro, setBairro] = useState('');
  const [cidade, setCidade] = useState('');
  const [responsavel, setResponsavel] = useState('');
  const [telefone, setTelefone] = useState('');
  const [instagram, setInstagram] = useState('');
  const [escudoUrl, setEscudoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setEscudoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !bairro.trim() || !responsavel.trim() || !telefone.trim()) {
      alert('Por favor, preencha os campos obrigatórios.');
      return;
    }

    let finalEscudo = escudoUrl || 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=120&auto=format&fit=crop';

    if (selectedFile) {
      setIsUploading(true);
      try {
        const publicUrl = await uploadFileToStorage(selectedFile, 'times');
        finalEscudo = publicUrl;
        
        triggerToast?.({
          id: `upload-time-${Date.now()}`,
          message: '⚽ ESCUDO CARREGADO COM SUCESSO!',
          sub: 'O escudo do seu clube foi salvo no Supabase Storage.',
          iconType: 'sistema'
        });
      } catch (uploadErr) {
        console.error('Error during club shield upload:', uploadErr);
        triggerToast?.({
          id: `upload-time-err-${Date.now()}`,
          message: '❌ ERRO NO ESCUDO',
          sub: 'Não foi possível salvar o escudo no Supabase Storage.',
          iconType: 'sistema'
        });
        setIsUploading(false);
        alert('Falha ao enviar o escudo do clube para o Supabase Storage. Tente novamente.');
        return;
      }
      setIsUploading(false);
    }

    // Auto generate 3 letter acronym for logo display compatibility in ranking
    const sigla = (nome.replace(/[^a-zA-Z\s]/g, '').split(/\s+/).map(word => word[0] || '').join('').substring(0, 3) || 'VZA').toUpperCase();

    onAddClubeLocal({
      nome,
      sigla,
      bairro,
      estadio: 'Estádio ' + bairro + ' Comunitário',
      logo: finalEscudo,
      logo_url: finalEscudo,
      cores: ['#FF5500', '#000000'],
      fundacao: new Date().getFullYear().toString(),
      membros_count: 32 // initial members
    });

    // Generate specific text for WhatsApp
    const messageText = `Olá, quero cadastrar meu clube no Sócio Compra.

- Nome do Clube: ${nome}
- Bairro: ${bairro}
- Cidade: ${cidade}
- Responsável: ${responsavel}
- Telefone: ${telefone}
- Instagram: ${instagram || 'Não informado'}`;

    // Open WhatsApp link in new tab automatically
    const formattedUrl = `https://wa.me/5511915364827?text=${encodeURIComponent(messageText)}`;
    
    // Fallback if blocked
    window.open(formattedUrl, '_blank');

    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans">
      <div className="w-full max-w-md bg-[#0C0C0E] border border-zinc-900 rounded-3xl overflow-hidden shadow-2xl relative flex flex-col max-h-[92vh]">
        
        {/* Glow Header */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF5500]/60 to-transparent" />

        {/* Modal Title Action */}
        <div className="p-4.5 border-b border-zinc-900 bg-black flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Trophy className="w-4.5 h-4.5 text-[#FF5500]" />
            <div>
              <h2 className="text-xs font-black text-white tracking-wider uppercase font-display">
                CADASTRAR CLUBE
              </h2>
              <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none mt-1">Parceiro Ativo do Ecossistema</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="text-zinc-500 hover:text-white p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-lg cursor-pointer transition-all border border-zinc-800/80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Escudo upload block */}
            <div className="flex flex-col items-center justify-center space-y-1.5 pb-2 border-b border-zinc-900">
              <input 
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoSelect}
                className="hidden"
              />
              
              <div 
                onClick={triggerFilePicker}
                className="w-16 h-16 rounded-full border-2 border-dashed border-[#FF5500]/40 hover:border-[#FF5500] bg-zinc-950 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all group"
              >
                {escudoUrl ? (
                  <img 
                    src={escudoUrl} 
                    alt="preview escudo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-5 h-5 text-zinc-500 group-hover:text-white transition-all" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] font-bold uppercase text-center tracking-wide">
                  {escudoUrl ? 'Alterar' : 'Escudo'}
                </div>
              </div>

              <span className="text-[9px] font-semibold text-zinc-500 font-mono">
                Logotipo / Escudo do Clube (Câmera ou Galeria)
              </span>
            </div>

            {/* Field: Nome Clube */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                Nome do Clube *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Unidos da Vila FC"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Field: Bairro */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Bairro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Jardim Maria"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Field: Cidade */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Cidade *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: São Paulo"
                  value={cidade}
                  onChange={(e) => setCidade(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Field: Responsavel */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Responsável / Presidente *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Carlinhos Silva"
                  value={responsavel}
                  onChange={(e) => setResponsavel(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Field: Telefone */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Contato / Telefone *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: (11) 98888-5555"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>
            </div>

            {/* Field: Instagram */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                Instagram Oficial
              </label>
              <input
                type="text"
                placeholder="Ex: @unidosdavilafc"
                value={instagram}
                onChange={(e) => setInstagram(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
              />
            </div>

            {/* Submit layout button */}
            <button
              type="submit"
              disabled={isUploading}
              className="w-full bg-[#FF5500] hover:bg-orange-600 hover:shadow-lg transition-all border-0 py-3.5 rounded-xl text-xs font-black font-display uppercase tracking-widest text-white mt-4 flex items-center justify-center gap-2 cursor-pointer orange-glow text-orange-glow active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>ENVIANDO ESCUDO...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>CONFIRMAR CADASTRO</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Co-op Badge Indicator Footer */}
        <div className="p-3 bg-[#08080A] border-t border-zinc-900 flex justify-center text-center select-none">
          <p className="text-[8.5px] text-zinc-500 font-mono tracking-wide leading-relaxed">
            Seu cadastro enviará o formulário para o pilar financeiro via WhatsApp.
          </p>
        </div>

      </div>
    </div>
  );
}
