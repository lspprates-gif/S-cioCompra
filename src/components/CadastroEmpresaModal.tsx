import React, { useState, useRef, useEffect } from 'react';
import { Camera, Building, Phone, MapPin, Tag, FileText, ArrowRight, MessageSquareCode, X, Sparkles, Loader2, DollarSign, Percent } from 'lucide-react';
import { uploadFileToStorage, supabase } from '../supabaseClient';
import { PREMIUM_CATEGORIES } from '../dataService';

interface CadastroEmpresaModalProps {
  onAddEmpresaLocal: (data: any) => void;
  onClose: () => void;
  triggerToast?: (toast: { id: string; message: string; sub?: string; iconType?: string }) => void;
}

export default function CadastroEmpresaModal({ onAddEmpresaLocal, onClose, triggerToast }: CadastroEmpresaModalProps) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Alimentação & Bebidas');
  const [subcategoria, setSubcategoria] = useState('Pizzaria');
  const [telefone, setTelefone] = useState('');
  const [cidade, setCidade] = useState('');
  const [bairro, setBairro] = useState('');
  const [descricao, setDescricao] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Subcategory Fee States
  const [taxaValor, setTaxaValor] = useState('5.5%');
  const [taxaTipoCalculo, setTaxaTipoCalculo] = useState('Comissão por Pedido');
  const [taxaTipoValor, setTaxaTipoValor] = useState('Percentual');
  const [isLoadingTaxa, setIsLoadingTaxa] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Subcategories calculation
  const currentCategoryObj = PREMIUM_CATEGORIES.find(c => c.nome === categoria) || PREMIUM_CATEGORIES[0];
  const availableSubcategories = currentCategoryObj ? currentCategoryObj.subcategorias || [] : [];

  // Reset subcategory when category changes
  useEffect(() => {
    if (availableSubcategories.length > 0) {
      setSubcategoria(availableSubcategories[0]);
    }
  }, [categoria]);

  // Fetch Subcategory Info from Supabase or Fallback
  useEffect(() => {
    let isMounted = true;
    async function loadRateInfo() {
      if (!subcategoria) return;
      setIsLoadingTaxa(true);
      try {
        const { data, error } = await supabase
          .from('subcategorias_taxas')
          .select('*')
          .eq('subcategoria', subcategoria)
          .single();

        if (isMounted) {
          if (!error && data) {
            setTaxaValor(data.valor || '5.0%');
            setTaxaTipoCalculo(data.tipo_calculo || 'Taxa por Transação');
            setTaxaTipoValor(data.tipo_valor || 'Percentual');
          } else {
            // Standard Brazilian commercial rules fallback mapping
            const subLower = subcategoria.toLowerCase();
            if (subLower.includes('barbearia')) {
              setTaxaValor('5.0%');
              setTaxaTipoCalculo('Taxa por Atendimento');
              setTaxaTipoValor('Percentual');
            } else if (subLower.includes('salão') || subLower.includes('salao') || subLower.includes('cabeleireiro')) {
              setTaxaValor('6.0%');
              setTaxaTipoCalculo('Taxa por Atendimento');
              setTaxaTipoValor('Percentual');
            } else if (subLower.includes('manicure') || subLower.includes('pedicure') || subLower.includes('estética') || subLower.includes('estetica') || subLower.includes('bronzeamento') || subLower.includes('maquiagem')) {
              setTaxaValor('7.0%');
              setTaxaTipoCalculo('Taxa por Agendamento');
              setTaxaTipoValor('Percentual');
            } else if (subLower.includes('pizza') || subLower.includes('hamburgueria') || subLower.includes('restaurante') || subLower.includes('marmitaria') || subLower.includes('espetinho') || subLower.includes('açai') || subLower.includes('acai') || subLower.includes('sorvete')) {
              setTaxaValor('5.5%');
              setTaxaTipoCalculo('Comissão por Pedido');
              setTaxaTipoValor('Percentual');
            } else if (subLower.includes('adega') || subLower.includes('bar') || subLower.includes('distribuidora') || subLower.includes('conveniência') || subLower.includes('conveniencia') || subLower.includes('cafeteria') || subLower.includes('lanchonete') || subLower.includes('food truck')) {
              setTaxaValor('4.5%');
              setTaxaTipoCalculo('Taxa por Transação');
              setTaxaTipoValor('Percentual');
            } else if (subLower.includes('mercado') || subLower.includes('mini mercado') || subLower.includes('padaria')) {
              setTaxaValor('2.5%');
              setTaxaTipoCalculo('Taxa por Transação');
              setTaxaTipoValor('Percentual');
            } else if (subLower.includes('advocacia') || subLower.includes('contabilidade') || subLower.includes('consultoria') || subLower.includes('seguros') || subLower.includes('academia') || subLower.includes('clinica') || subLower.includes('clínica') || subLower.includes('dentista') || subLower.includes('psicólogo') || subLower.includes('psicologo') || subLower.includes('desenvolvimento') || subLower.includes('informática') || subLower.includes('tecnologia')) {
              setTaxaValor('R$ 39,90');
              setTaxaTipoCalculo('Assinatura Mensal');
              setTaxaTipoValor('Valor Fixo');
            } else {
              setTaxaValor('5.0%');
              setTaxaTipoCalculo('Taxa por Transação');
              setTaxaTipoValor('Percentual');
            }
          }
        }
      } catch (err) {
        console.error('Failure obtaining rates from Supabase:', err);
      } finally {
        if (isMounted) setIsLoadingTaxa(false);
      }
    }
    loadRateInfo();
    return () => { isMounted = false; };
  }, [subcategoria]);

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!nome.trim() || !telefone.trim() || !cidade.trim() || !bairro.trim() || !categoria.trim() || !subcategoria.trim()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    let finalLogo = logoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=120&auto=format&fit=crop';

    if (selectedFile) {
      setIsUploading(true);
      try {
        const publicUrl = await uploadFileToStorage(selectedFile, 'empresas');
        finalLogo = publicUrl;
        
        triggerToast?.({
          id: `upload-emp-${Date.now()}`,
          message: '🏪 LOGOTIPO SALVO!',
          sub: 'O logotipo do cooperante foi armazenado no bucket de empresas.',
          iconType: 'sistema'
        });
      } catch (uploadErr) {
        console.error('Error during company logo upload:', uploadErr);
        triggerToast?.({
          id: `upload-emp-err-${Date.now()}`,
          message: '❌ FALHA NO LOGO',
          sub: 'Erro ao conectar ao bucket do Supabase Storage.',
          iconType: 'sistema'
        });
        setIsUploading(false);
        alert('Falha ao enviar o logotipo. Verifique o bucket "empresas" no seu Supabase.');
        return;
      }
      setIsUploading(false);
    }

    // Pass detailed payload back to app list and Supabase
    onAddEmpresaLocal({
      nome,
      categoria,
      subcategoria,
      telefone,
      endereco: `${bairro}, ${cidade}`,
      bairro,
      cidade,
      whatsapp,
      descricao: descricao || `Empresa cooperante cadastrada no segmento ${subcategoria}.`,
      logo: finalLogo,
      logo_url: finalLogo,
      banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600&auto=format&fit=crop',
      score: 5.0,
      pontos_por_real: taxaTipoValor === 'Percentual' ? 10 : 15,
      cashback_porcentagem: taxaTipoValor === 'Percentual' ? parseFloat(taxaValor.replace('%','')) || 5 : 5
    });

    // Formatting direct message for official manual approval number: 11978713463
    const messageText = `Olá, gostaria de cadastrar minha empresa parceira no Sócio Compra para aprovação manual.

- Nome: ${nome}
- Categoria: ${categoria}
- Subcategoria: ${subcategoria}
- Cidade: ${cidade}
- Telefone: ${telefone}`;

    // Standard WhatsApp link formulation
    const formattedUrl = `https://wa.me/5511978713463?text=${encodeURIComponent(messageText)}`;
    
    // Automatic redirection
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
            <Building className="w-4.5 h-4.5 text-[#FF5500]" />
            <div>
              <h2 className="text-xs font-black text-white tracking-wider uppercase font-display">
                CADASTRAR EMPRESA
              </h2>
              <p className="text-[9px] font-mono text-zinc-500 uppercase leading-none mt-1">Parceiro Comercial Sócio Compra</p>
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
            
            {/* Logo upload block */}
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
                className="w-16 h-16 rounded-2xl border-2 border-dashed border-[#FF5500]/40 hover:border-[#FF5500] bg-zinc-950 flex flex-col items-center justify-center cursor-pointer relative overflow-hidden transition-all group"
              >
                {logoUrl ? (
                  <img 
                    src={logoUrl} 
                    alt="preview logo" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-5 h-5 text-zinc-500 group-hover:text-white transition-all" />
                )}
                <div className="absolute inset-x-0 bottom-0 bg-black/60 py-0.5 text-[8px] font-bold uppercase text-center tracking-wide">
                  {logoUrl ? 'Alterar' : 'Logo'}
                </div>
              </div>

              <span className="text-[9px] font-semibold text-zinc-500 font-mono">
                Logotipo da Empresa (Bucket 'empresas' no Supabase)
              </span>
            </div>

            {/* Field: Nome Empresa */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                Nome da Empresa *
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Mercado e Rotisserie Favela"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Field: Telefone */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Telefone Comercial *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: (11) 91234-5678"
                  value={telefone}
                  onChange={(e) => setTelefone(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>

              {/* Field: WhatsApp */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  WhatsApp Contato *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: (11) 97871-3463"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
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

              {/* Field: Bairro */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Bairro *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Paraisópolis"
                  value={bairro}
                  onChange={(e) => setBairro(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* Field: Categoria */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Categoria *
                </label>
                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-colors"
                >
                  {PREMIUM_CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.nome}>{cat.nome}</option>
                  ))}
                </select>
              </div>

              {/* Field: Subcategoria */}
              <div className="space-y-1 text-left">
                <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                  Subcategoria *
                </label>
                <select
                  value={subcategoria}
                  onChange={(e) => setSubcategoria(e.target.value)}
                  className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3 text-xs text-white focus:outline-none transition-colors"
                >
                  {availableSubcategories.map(sub => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* DYNAMIC FEE AND TERMS BOX FROM SUPABASE */}
            <div className="bg-[#050507] border border-zinc-900 rounded-2xl p-4 space-y-3 relative overflow-hidden select-none">
              <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <Sparkles className="w-16 h-16 text-[#FF5500]" />
              </div>

              <div className="flex justify-between items-center mb-1">
                <span className="text-[9px] font-mono font-black text-zinc-500 uppercase tracking-wider">
                  Condição Comercial do Pilar
                </span>
                {isLoadingTaxa ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-[#FF5500]" />
                ) : (
                  <span className="text-[8px] font-mono bg-[#FF5500]/10 text-[#FF5500] px-2 py-0.5 rounded-full font-bold uppercase">
                    Buscado do Supabase
                  </span>
                )}
              </div>

              <div className="grid grid-cols-3 gap-2">
                {/* 1. Valor a Pagar */}
                <div className="bg-[#0c0c0e]/80 p-2.5 rounded-xl border border-zinc-900/40 text-left">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-tight leading-none">A Pagar</span>
                  <span className="text-sm font-black text-[#FFD700] uppercase font-display block mt-1">
                    {taxaValor}
                  </span>
                </div>

                {/* 2. Tipo de Cálculo */}
                <div className="bg-[#0c0c0e]/80 p-2.5 rounded-xl border border-zinc-900/40 text-left col-span-2">
                  <span className="text-[8px] font-mono text-zinc-500 uppercase block tracking-tight leading-none">{taxaTipoCalculo}</span>
                  <div className="flex items-center gap-1.5 mt-1">
                    {taxaTipoValor === 'Percentual' ? (
                      <Percent className="w-3.5 h-3.5 text-[#FF5500]" />
                    ) : (
                      <DollarSign className="w-3.5 h-3.5 text-green-500" />
                    )}
                    <span className="text-xs font-black text-white uppercase font-display block">
                      {taxaTipoValor}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Field: Descrição */}
            <div className="space-y-1 text-left">
              <label className="text-[9px] font-mono font-bold text-zinc-400 uppercase tracking-widest block">
                Sobre a Empresa / Divulgação
              </label>
              <textarea
                placeholder="Ex: Padaria tradicional apoiando o time de várzea da quebrada..."
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                rows={2}
                className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-2 px-3.5 text-xs text-white focus:outline-none placeholder-zinc-700 transition-colors resize-none"
              />
            </div>

            {/* Submit layout button */}
            <button
              type="submit"
              disabled={isUploading || isLoadingTaxa}
              className="w-full bg-[#FF5500] hover:bg-orange-600 mr-2 hover:shadow-lg transition-all border-0 py-3.5 rounded-xl text-xs font-black font-display uppercase tracking-widest text-white mt-4 flex items-center justify-center gap-2 cursor-pointer orange-glow text-orange-glow active:scale-95 duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>CADASTRANDO...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  <span>CONFIRMAR & ENVIAR WHATSAPP</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Co-op Badge Indicator Footer */}
        <div className="p-3 bg-[#08080A] border-t border-zinc-900 flex justify-center text-center select-none">
          <p className="text-[8.5px] text-zinc-500 font-mono tracking-wide leading-relaxed">
            Seu cadastro gerará um formulário de validação direta pelo número de suporte pilar (WhatsApp).
          </p>
        </div>

      </div>
    </div>
  );
}
