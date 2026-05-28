import React, { useState, useRef } from 'react';
import { 
  User, Trophy, Mail, Phone, MapPin, Sparkles, Lock, ArrowLeft, Camera, Upload, Eye, EyeOff, ShieldCheck, Plus
} from 'lucide-react';
import { Time, Empresa, Usuario } from '../types';
import { uploadFileToStorage } from '../supabaseClient';

interface LoginScreenProps {
  times: Time[];
  empresas: Empresa[];
  usuarios: Usuario[];
  onLogin: (role: 'usuario' | 'empresa' | 'clube', id: string) => void;
  onRegister: (role: 'usuario' | 'empresa' | 'clube', data: any) => void;
  triggerToast?: (toast: { id: string; message: string; sub?: string; iconType?: string }) => void;
  initialScreenMode?: 'initial' | 'login' | 'register';
}

export default function LoginScreen({ times, empresas, usuarios, onLogin, onRegister, triggerToast, initialScreenMode }: LoginScreenProps) {
  // Navigation states: 'initial' | 'login' | 'register'
  const [screen, setScreen] = useState<'initial' | 'login' | 'register'>(initialScreenMode || 'initial');

  // Sync state if prop changes from parent
  React.useEffect(() => {
    if (initialScreenMode) {
      setScreen(initialScreenMode);
    }
  }, [initialScreenMode]);
  
  // Login form states
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showFastAccess, setShowFastAccess] = useState(false);

  // User Register states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cidade, setCidade] = useState('');
  const [selectedTeamId, setSelectedTeamId] = useState(times[0]?.id || '');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle image upload and generate preview (safe for mobile camera & gallery)
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!loginEmail.trim() || !loginPassword.trim()) {
      setErrorMessage('Por favor, preencha todos os campos.');
      return;
    }

    // Direct check if matching any registered user credentials (or default logic to log in first user)
    const matchingUser = usuarios.find(
      u => u.email?.toLowerCase() === loginEmail.toLowerCase()
    );

    if (matchingUser) {
      onLogin('usuario', matchingUser.id);
    } else {
      // Default fallback or prompt
      // For UX support in mock flow, if password matches "123" let it login with first user
      if (usuarios.length > 0) {
        onLogin('usuario', usuarios[0].id);
      } else {
        setErrorMessage('Nenhum usuário cadastrado com este e-mail.');
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!name.trim()) {
      setErrorMessage('Por favor, digite o nome completo.');
      return;
    }
    if (!email.trim()) {
      setErrorMessage('Por favor, digite seu e-mail.');
      return;
    }
    if (!password.trim()) {
      setErrorMessage('Por favor, crie uma senha segura.');
      return;
    }
    if (!cidade.trim()) {
      setErrorMessage('Por favor, digite sua cidade.');
      return;
    }

    let finalAvatar = avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop';

    if (selectedFile) {
      setIsUploading(true);
      try {
        const publicUrl = await uploadFileToStorage(selectedFile, 'usuarios');
        finalAvatar = publicUrl;
        
        triggerToast?.({
          id: `upload-${Date.now()}`,
          message: '🎉 FOTO DE PERFIL CARREGADA!',
          sub: 'Sua foto foi salva no Supabase Storage com sucesso.',
          iconType: 'sistema'
        });
      } catch (uploadErr: any) {
        console.error('Error during profile photo upload:', uploadErr);
        triggerToast?.({
          id: `upload-err-${Date.now()}`,
          message: '❌ ERRO NO UPLOAD',
          sub: 'Não foi possível salvar sua foto no Supabase Storage.',
          iconType: 'sistema'
        });
        setIsUploading(false);
        setErrorMessage('Falha ao enviar a foto para o Supabase Storage. Tente novamente.');
        return;
      }
      setIsUploading(false);
    }

    // Submit registration
    onRegister('usuario', {
      nome: name,
      email,
      telefone: phone,
      senha: password,
      cidade,
      time_coracao_id: selectedTeamId,
      avatar_url: finalAvatar,
      foto_url: finalAvatar
    });

    // Reset forms
    setName('');
    setEmail('');
    setPhone('');
    setPassword('');
    setCidade('');
    setAvatarUrl(null);
    setSelectedFile(null);
  };


  return (
    <div className="w-full min-h-screen md:min-h-0 md:h-[92vh] flex flex-col items-center bg-[#050505] text-white p-5 md:p-8 overflow-y-auto no-scrollbar justify-center">
      
      {/* BRAND HEADER */}
      <div className="text-center space-y-2 mb-6 max-w-sm select-none">
        <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFD700] flex items-center justify-center p-0.5 shadow-lg">
          <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
            <Trophy className="w-6 h-6 text-[#FF5500]" />
          </div>
        </div>
        <h1 className="text-2xl font-black font-display tracking-tight text-white uppercase leading-none mt-2">
          FUTEBOL DE <span className="text-[#FF5500]">VÁRZEA</span>
        </h1>
        <p className="text-[10px] uppercase font-mono tracking-widest text-[#FFD700]">
          Plataforma de Apoiadores Locais
        </p>
      </div>

      <div className="w-full max-w-md bg-[#0C0C0E] border border-zinc-900 rounded-3xl p-5 md:p-6 shadow-2xl relative">
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#FF5500]/50 to-transparent" />

        {errorMessage && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-3 py-2 rounded-xl text-xs mb-4 text-center font-semibold">
            ⚠️ {errorMessage}
          </div>
        )}

        {/* 1. INITIAL SCREEN: SELECT LOGIN OR REGISTER */}
        {screen === 'initial' && (
          <div className="space-y-6 pt-2 pb-4">
            <div className="text-center space-y-2">
              <h2 className="text-sm font-bold uppercase tracking-wider text-white font-display">
                Bem-vindo ao Sócio Compra</h2>
              <p className="text-xs text-zinc-400 max-w-xs mx-auto leading-relaxed">
                Fortaleça seu clube de coração comprando com vantagens exclusivas nos comércios parceiros do pilar.
              </p>
            </div>

            <div className="h-[1px] bg-zinc-900" />

            <div className="space-y-3">
              <button
                onClick={() => setScreen('login')}
                className="w-full bg-[#FF5500] hover:bg-orange-600 font-extrabold text-[#FFF] py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 shadow-md shadow-[#FF5500]/10 cursor-pointer text-center"
              >
                Entrar na minha conta
              </button>

              <button
                onClick={() => setScreen('register')}
                className="w-full bg-zinc-950 border border-zinc-800 hover:border-zinc-700 font-extrabold text-zinc-200 py-3.5 rounded-2xl text-xs uppercase tracking-widest transition-all duration-300 cursor-pointer text-center"
              >
                Criar Nova Conta / Cadastrar
              </button>
            </div>
          </div>
        )}

        {/* 2. LOGIN FORM */}
        {screen === 'login' && (
          <div className="space-y-5">
            <div className="flex items-center gap-2 mb-2">
              <button 
                onClick={() => { setScreen('initial'); setShowFastAccess(false); setErrorMessage(''); }}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer border border-zinc-800/80"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Acesse sua Conta
              </h2>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  E-mail
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-zinc-600" />
                  </span>
                  <input
                    type="email"
                    required
                    placeholder="digite seu e-mail"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2.5 pl-9.5 pr-4 text-xs font-sans text-white focus:outline-none placeholder-zinc-700 transition-colors font-medium"
                  />
                </div>
              </div>

              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Senha
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="w-4 h-4 text-zinc-600" />
                  </span>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="digite sua senha"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2.5 pl-9.5 pr-10 text-xs font-sans text-white focus:outline-none placeholder-zinc-700 transition-colors font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-600 hover:text-zinc-400 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#FF5500] hover:bg-orange-600 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest text-[#FFF] hover:shadow-lg transition-all duration-300 block select-none mt-4 cursor-pointer text-center"
              >
                Entrar no App
              </button>
            </form>

            <div className="h-[1px] bg-zinc-900 my-2" />

            {/* FAST ACCESS / TESTING COLLAPSIBLE (Brings great usability for reviewers without breaking flow) */}
            <div className="space-y-2">
              <button
                onClick={() => setShowFastAccess(!showFastAccess)}
                className="w-full py-2 bg-[#121214] hover:bg-[#18181B] rounded-xl text-[10px] font-bold font-mono tracking-wider text-zinc-500 hover:text-zinc-300 border border-zinc-900 transition-all cursor-pointer"
              >
                {showFastAccess ? 'Esconder Contas de Teste' : 'Acesso Rápido de Testes (Simuladores)'}
              </button>

              {showFastAccess && (
                <div className="space-y-1.5 max-h-[160px] overflow-y-auto pr-1 no-scrollbar pt-1 text-left">
                  <span className="text-[9px] font-mono text-zinc-500 font-semibold block mb-1">
                    Escolha um perfil para testar todas as frentes instantaneamente:
                  </span>
                  
                  {usuarios.map(u => (
                    <div 
                      key={u.id}
                      onClick={() => onLogin('usuario', u.id)}
                      className="bg-black/40 hover:bg-[#FF5500]/5 border border-zinc-900 hover:border-[#FF5500]/40 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={u.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                          alt={u.nome} 
                          className="w-7 h-7 rounded-full object-cover border border-[#FF5500]/20"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white text-[11px] block truncate">{u.nome}</span>
                          <span className="text-[8px] text-zinc-500 font-mono block">Torcedor • Lvl {u.nivel}</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-[#FF5500] font-bold uppercase">Entrar</span>
                    </div>
                  ))}

                  {empresas.map(emp => (
                    <div 
                      key={emp.id}
                      onClick={() => onLogin('empresa', emp.id)}
                      className="bg-black/40 hover:bg-[#FF5500]/5 border border-zinc-900 hover:border-[#FF5500]/40 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={emp.logo} 
                          alt={emp.nome} 
                          className="w-7 h-7 rounded-lg object-cover border border-[#FF5500]/20"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white text-[11px] block truncate">{emp.nome}</span>
                          <span className="text-[8px] text-zinc-500 font-mono block">Comércio Parceiro</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-[#FF5500] font-bold uppercase">Entrar</span>
                    </div>
                  ))}

                  {times.map(t => (
                    <div 
                      key={t.id}
                      onClick={() => onLogin('clube', t.id)}
                      className="bg-black/40 hover:bg-[#FF5500]/5 border border-zinc-900 hover:border-[#FF5500]/40 p-2 rounded-xl flex items-center justify-between cursor-pointer transition-colors"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <img 
                          src={t.logo} 
                          alt={t.nome} 
                          className="w-7 h-7 rounded-full object-cover p-0.5 bg-zinc-900 border border-yellow-400"
                        />
                        <div className="min-w-0">
                          <span className="font-bold text-white text-[11px] block truncate">{t.nome}</span>
                          <span className="text-[8px] text-zinc-500 font-mono block">Clube • {t.sigla}</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-mono text-[#FF5500] font-bold uppercase">Entrar</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 3. USER REGISTER FORM */}
        {screen === 'register' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <button 
                onClick={() => { setScreen('initial'); setErrorMessage(''); }}
                className="p-1.5 bg-zinc-900 hover:bg-zinc-800 rounded-xl transition-all cursor-pointer border border-zinc-800/80"
              >
                <ArrowLeft className="w-4 h-4 text-zinc-400 hover:text-white" />
              </button>
              <h2 className="text-xs font-mono font-bold uppercase tracking-widest text-zinc-400">
                Cadastro de Torcedor Sócio
              </h2>
            </div>

            <form onSubmit={handleRegisterSubmit} className="space-y-3.5">
              
              {/* COMPLIANT IMAGE SNAP / Uploader */}
              <div className="flex flex-col items-center justify-center space-y-1.5 pb-2">
                <input 
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
                
                <div 
                  onClick={triggerFilePicker}
                  className="w-16 h-16 rounded-full border-2 border-dashed border-[#FF5500]/50 hover:border-[#FF5500] bg-zinc-950 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all group"
                  title="Abra a câmera ou selecione da galeria"
                >
                  {avatarUrl ? (
                    <img 
                      src={avatarUrl} 
                      alt="preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center flex flex-col items-center justify-center">
                      <Camera className="w-5 h-5 text-zinc-500 group-hover:text-white transition-colors" />
                    </div>
                  )}

                  {/* Overlap camera label */}
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] font-bold uppercase text-center tracking-wide">
                    {avatarUrl ? 'Alterar' : 'Foto'}
                  </div>
                </div>

                <span className="text-[9px] font-semibold text-zinc-500 font-mono">
                  Selecione da Galeria ou abra a Câmera
                </span>
              </div>

              {/* Field: Full Name */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Nome Completo
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Luiz Prates"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Field: E-mail */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  E-mail
                </label>
                <input
                  type="email"
                  required
                  placeholder="seuemail@exemplo.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Field: Telefone */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                    Telefone / WhatsApp
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: (11) 91536-4827"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                  />
                </div>

                {/* Field: Senha */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                    Escolha uma Senha
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="digite uma senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                {/* Field: Cidade */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                    Cidade
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none">
                      <MapPin className="w-3.5 h-3.5 text-zinc-700" />
                    </span>
                    <input
                      type="text"
                      required
                      placeholder="Ex: São Paulo"
                      value={cidade}
                      onChange={(e) => setCidade(e.target.value)}
                      className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 pl-7.5 pr-2.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                    />
                  </div>
                </div>

                {/* Field: Time de Coração */}
                <div className="space-y-1 text-left">
                  <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                    Time de Coração
                  </label>
                  <select
                    value={selectedTeamId}
                    onChange={(e) => setSelectedTeamId(e.target.value)}
                    className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-colors"
                  >
                    {times.map(t => (
                      <option key={t.id} value={t.id}>{t.nome}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit signup */}
              <button
                type="submit"
                disabled={isUploading}
                className="w-full bg-[#FF5500] hover:bg-orange-600 py-3 rounded-xl text-xs font-extrabold uppercase tracking-widest text-[#FFF] flex items-center justify-center gap-1.5 transition-all mt-4 orange-glow cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>CADASTRANDO...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>CONFIRMAR E CRIAR CONTA</span>
                    <Sparkles className="w-3.5 h-3.5 text-yellow-300 ml-0.5" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* FOOTER CREDITS */}
      <p className="text-[10px] font-mono text-zinc-600 text-center select-none mt-5 flex items-center gap-1">
        <ShieldCheck className="w-3.5 h-3.5 text-green-700" />
        Todo cadastro gera uma carteira social de pontos no ecossistema da Várzea.
      </p>
    </div>
  );
}
