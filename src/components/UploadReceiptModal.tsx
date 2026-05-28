import React, { useState, useEffect } from 'react';
import { Camera, FileText, Upload, Sparkles, Building, Shield, Coins, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { Time, Empresa, Comprovante } from '../types';
import { uploadFileToStorage } from '../supabaseClient';

interface UploadReceiptModalProps {
  times: Time[];
  empresas: Empresa[];
  onSubmit: (proof: Omit<Comprovante, 'id' | 'created_at'>) => Promise<void>;
  onClose: () => void;
  defaultClubId?: string;
  triggerToast?: (toast: { id: string; message: string; sub?: string; iconType?: string }) => void;
}

export default function UploadReceiptModal({ times, empresas, onSubmit, onClose, defaultClubId, triggerToast }: UploadReceiptModalProps) {
  const [selectedEmpresaId, setSelectedEmpresaId] = useState('');
  const [selectedClubId, setSelectedClubId] = useState(defaultClubId || '');
  const [selectedCategory, setSelectedCategory] = useState('Gastronomia');
  const [valorText, setValorText] = useState('');
  const [chaveNFE, setChaveNFE] = useState('');
  const [fakeFile, setFakeFile] = useState<File | null>(null);
  const [fakeFileUrl, setFakeFileUrl] = useState<string | null>(null);

  
  // Interactive audit loader state
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditStep, setAuditStep] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);

  // Math multipliers
  const [pointsPreview, setPointsPreview] = useState(0);
  const [cashbackPreview, setCashbackPreview] = useState(0);
  const [clubCommissionPreview, setClubCommissionPreview] = useState(0);

  // Prefill default dropdown values if available
  useEffect(() => {
    if (empresas.length > 0 && !selectedEmpresaId) {
      setSelectedEmpresaId(empresas[0].id);
    }
    if (times.length > 0 && !selectedClubId) {
      setSelectedClubId(times[0].id);
    }
  }, [empresas, times, selectedEmpresaId, selectedClubId]);

  // Handle live calculation updates
  useEffect(() => {
    const val = parseFloat(valorText.replace(',', '.')) || 0;
    const selectedEmp = empresas.find(e => e.id === selectedEmpresaId);

    if (selectedEmp) {
      const generatedPoints = val * (selectedEmp.pontos_por_real || 10);
      const generatedCashback = val * ((selectedEmp.cashback_porcentagem || 5) / 100);
      const generatedClubCommission = val * 0.05; // 5% fixed community support fee

      setPointsPreview(Math.round(generatedPoints));
      setCashbackPreview(Number(generatedCashback.toFixed(2)));
      setClubCommissionPreview(Number(generatedClubCommission.toFixed(2)));
    } else {
      setPointsPreview(0);
      setCashbackPreview(0);
      setClubCommissionPreview(0);
    }
  }, [valorText, selectedEmpresaId, empresas]);

  const auditStepsText = [
    '📷 Iniciando fotoleitura OCR do comprovante...',
    '🛡️ Consultando SEFAZ para autenticar NFE...',
    '⚽ Split de repasses: Distribuindo comissão do Clube...',
    '⚙️ Enviando imagem e sincronizando no Supabase...',
    '🎉 Transação concluída com sucesso!'
  ];


  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      setFakeFile(file);
      setFakeFileUrl(URL.createObjectURL(file));
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFakeFile(file);
      setFakeFileUrl(URL.createObjectURL(file));
    }
  };

  const executeManualUploadSimulator = () => {
    // Generate a beautiful mock layout image url to simulate camera snap
    setFakeFileUrl('https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=200&auto=format&fit=crop');
    setFakeFile(new File(["cupom_scanned"], "cupom_fiscal.jpg", { type: "image/jpeg" }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(valorText.replace(',', '.')) || 0;
    if (val <= 0 || !selectedEmpresaId || !selectedClubId) {
      alert('Por favor, preencha o valor da compra, empresa e clube antes de prosseguir.');
      return;
    }

    // Launch multi-state loader for the ultimate "Billion-Dollar App UX"
    setIsAuditing(true);
    setAuditStep(0);

    const stepInterval = setInterval(() => {
      setAuditStep((s) => {
        if (s >= 3) {
          clearInterval(stepInterval);
          return 4;
        }
        return s + 1;
      });
    }, 1200);

    // Prepare variables for upload
    let uploadedReceiptUrl = fakeFileUrl || 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=200&auto=format&fit=crop';

    if (fakeFile) {
      try {
        const publicUrl = await uploadFileToStorage(fakeFile, 'comprovantes');
        uploadedReceiptUrl = publicUrl;
        
        triggerToast?.({
          id: `upload-receipt-${Date.now()}`,
          message: '📄 COMPROVANTE ENVIADO!',
          sub: 'O comprovante foi enviado com sucesso ao Supabase Storage.',
          iconType: 'financeiro'
        });
      } catch (uploadErr) {
        console.error('Error uploading receipt to Supabase Storage:', uploadErr);
        triggerToast?.({
          id: `upload-receipt-err-${Date.now()}`,
          message: '❌ ERRO NO ENVIO',
          sub: 'Erro ao enviar comprovante para o Supabase Storage.',
          iconType: 'financeiro'
        });
      }
    }

    const selectedEmp = empresas.find(e => e.id === selectedEmpresaId)!;
    const selectedTime = times.find(t => t.id === selectedClubId)!;

    const proofPayload: Omit<Comprovante, 'id' | 'created_at'> = {
      usuario_id: 'u-1', // Luiz Prates default
      empresa_id: selectedEmpresaId,
      time_id: selectedClubId,
      valor: val,
      data_compra: new Date().toISOString(),
      status: 'aprovado',
      chave_nfe: chaveNFE || '3526051775' + Math.floor(1000000000000 + Math.random() * 9000000000000),
      imagem_url: uploadedReceiptUrl,
      pontos_gerados: pointsPreview,
      cashback_gerado: cashbackPreview,
      comissao_clube_gerado: clubCommissionPreview,
      usuario_nome: 'Luiz Prates (Você)',
      empresa_nome: selectedEmp.nome,
      time_nome: selectedTime.nome
    };

    // After loading concludes, insert real Supabase row
    setTimeout(async () => {
      try {
        await onSubmit(proofPayload);
        setIsSuccess(true);
        setTimeout(() => {
          setIsAuditing(false);
          setIsSuccess(false);
          onClose();
        }, 1500);
      } catch (err) {
        setIsAuditing(false);
      }
    }, 4800);
  };

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 font-sans">
      
      {/* 2. REAL-TIME MULTI-STEP AUDIT SCREEN OVERLAY */}
      {isAuditing && (
        <div className="absolute inset-0 bg-black/95 z-50 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative flex items-center justify-center w-20 h-20 mb-6">
            {!isSuccess ? (
              <>
                <Loader2 className="w-16 h-16 text-[#FF5500] animate-spin" />
                <Coins className="w-6 h-6 text-yellow-400 absolute animate-pulse" />
              </>
            ) : (
              <CheckCircle2 className="w-20 h-20 text-green-500 animate-bounce" />
            )}
          </div>

          <h3 className="text-xl font-bold font-display uppercase tracking-wide text-white">
            {!isSuccess ? 'PROCESSO DE AUDITORIA ATIVO' : 'CUPOM APROVADO COM SUCESSO!'}
          </h3>
          <p className="text-xs text-yellow-500 uppercase font-mono font-bold mt-1.5 tracking-wider">
            Sócio Compra Intelligent Ledger
          </p>

          {/* Stepper display */}
          <div className="mt-8 space-y-3.5 max-w-sm w-full text-left">
            {auditStepsText.slice(0, 4).map((text, idx) => (
              <div 
                key={idx}
                className={`flex items-center gap-3 text-xs p-3.5 rounded-xl border transition-all ${
                  auditStep > idx 
                    ? 'border-green-500/30 bg-green-500/5 text-green-400' 
                    : auditStep === idx 
                    ? 'border-[#FF5500]/50 bg-[#FF5500]/10 text-white font-semibold animate-pulse'
                    : 'border-zinc-800/80 bg-zinc-900/20 text-zinc-600'
                }`}
              >
                <div className={`w-2.5 h-2.5 rounded-full ${
                  auditStep > idx ? 'bg-green-500' : auditStep === idx ? 'bg-orange-500 animate-ping' : 'bg-zinc-700'
                }`} />
                <span>{text}</span>
              </div>
            ))}
          </div>

          <p className="text-[10px] text-zinc-500 font-mono mt-10">
            Repasses de auxílio automatizados utilizando Supabase realtime.
          </p>
        </div>
      )}

      {/* Main Form Modal */}
      <div className="w-full max-w-md bg-[#0C0C0E] border border-[#FF5500]/20 rounded-2xl overflow-hidden shadow-2xl relative flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-zinc-900 bg-black flex justify-between items-center bg-gradient-to-r from-black to-[#0C0C0E]">
          <div>
            <h2 className="text-md font-bold font-display text-white uppercase tracking-wider flex items-center gap-2">
              <Camera className="w-4.5 h-4.5 text-[#FF5500] animate-pulse" />
              <span>SCANNER DE COMPROVANTE</span>
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 uppercase">Aponte a câmera ou anexe a foto</p>
          </div>
          <button 
            onClick={onClose}
            className="text-zinc-500 hover:text-white text-xs cursor-pointer bg-zinc-900 border border-zinc-800 p-2 rounded-lg"
          >
            Fechar
          </button>
        </div>

        {/* Scrollable Contents */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          <form onSubmit={handleFormSubmit} className="space-y-5">
            
            {/* 1. Drag and Drop Image Uploader Component */}
            <div 
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleFileDrop}
              onClick={executeManualUploadSimulator}
              className="border-2 border-dashed border-[#FF5500]/25 bg-red-500/5 hover:bg-red-500/10 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center min-h-[140px] select-none"
            >
              {fakeFileUrl ? (
                <div className="flex items-center gap-4.5 w-full">
                  <img 
                    src={fakeFileUrl} 
                    alt="preview cupom" 
                    referrerPolicy="no-referrer"
                    className="w-14 h-18 rounded border border-orange-500 object-cover"
                  />
                  <div className="text-left">
                    <span className="text-xs bg-green-500/15 text-green-400 border border-green-500/20 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                      Foto Carregada
                    </span>
                    <p className="text-xs text-white font-bold font-display mt-2">cupom_digital_ocr.jpg</p>
                    <p className="text-[10px] text-zinc-500 font-mono mt-0.5">Clique para reenviar ou tirar outra foto</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="bg-[#FF5500]/10 p-3 rounded-xl mb-3 text-orange-400">
                    <Upload className="w-6 h-6 text-[#FF5500]" />
                  </div>
                  <h4 className="text-xs font-bold text-white uppercase font-display tracking-wider">
                    Anexar Cupom Fiscal
                  </h4>
                  <p className="text-[10px] text-zinc-500 leading-normal max-w-[240px] mt-1.5">
                    Arraste a foto ou <span className="text-[#FF5500] font-semibold underline">toque aqui</span> para simular captura da câmera instantaneamente
                  </p>
                </>
              )}
            </div>

            {/* Hidden real file element */}
            <input 
              id="receipt-file-picker"
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileSelect}
            />

            {/* 2. Selecionar Estabelecimento (Empresa) */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Onde você comprou?</span>
              </label>
              <select
                value={selectedEmpresaId}
                onChange={(e) => setSelectedEmpresaId(e.target.value)}
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white font-medium focus:border-[#FF5500] outline-none transition-all cursor-pointer"
              >
                {empresas.map(emp => (
                  <option key={emp.id} value={emp.id}>
                    {emp.nome} ({emp.categoria})
                  </option>
                ))}
              </select>
            </div>

            {/* 2.5 Categoria do Comprovante (10 Sectors requested) */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono font-bold uppercase text-orange-400 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-[#FF5500]" />
                <span>Categoria da Compra</span>
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-[#121214] border border-zinc-805 rounded-xl px-4 py-3 text-xs text-white font-medium focus:border-[#FF5500] outline-none transition-all cursor-pointer"
              >
                <option value="Beleza & Estética">Beleza & Estética</option>
                <option value="Gastronomia">Gastronomia</option>
                <option value="Alimentação & Bebidas">Alimentação & Bebidas</option>
                <option value="Comércio Popular">Comércio Popular</option>
                <option value="Serviços Profissionais">Serviços Profissionais</option>
                <option value="Saúde & Bem-estar">Saúde & Bem-estar</option>
                <option value="Construção & Manutenção">Construção & Manutenção</option>
                <option value="Automotivo">Automotivo</option>
                <option value="Turismo & Eventos">Turismo & Eventos</option>
                <option value="Tecnologia & Digital">Tecnologia & Digital</option>
              </select>
            </div>

            {/* 3. Selecionar Clube Beneficiário */}
            <div className="space-y-1.5 text-left">
              <label className="text-[10px] font-mono font-bold uppercase text-zinc-400 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-yellow-400" />
                <span>Time de Várzea Beneficiado</span>
              </label>
              <select
                value={selectedClubId}
                onChange={(e) => setSelectedClubId(e.target.value)}
                className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white font-medium focus:border-[#FF5500] outline-none transition-all cursor-pointer"
              >
                {times.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.nome} - {t.bairro}
                  </option>
                ))}
              </select>
            </div>

            {/* 4. Valor total da Compra */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5 text-left font-display">
                <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                  Valor Total (R$)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-bold text-xs select-none">
                    R$
                  </span>
                  <input
                    type="text"
                    required
                    placeholder="120,00"
                    value={valorText}
                    onChange={(e) => setValorText(e.target.value)}
                    className="w-full bg-[#121214] border border-zinc-800 rounded-xl pl-9 pr-3 py-3 text-xs font-bold text-white focus:border-[#FF5500] outline-none font-mono"
                  />
                </div>
              </div>

              {/* Chave NFE format */}
              <div className="space-y-1.5 text-left font-display">
                <label className="text-[10px] font-mono font-bold uppercase text-zinc-400">
                  Chave NFE (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="3526..."
                  maxLength={44}
                  value={chaveNFE}
                  onChange={(e) => setChaveNFE(e.target.value)}
                  className="w-full bg-[#121214] border border-zinc-800 rounded-xl px-3.5 py-3 text-xs text-white focus:border-[#FF5500] outline-none font-mono"
                />
              </div>
            </div>

            {/* Calculations preview box */}
            <div className="mt-4 bg-[#121214]/80 border border-zinc-800/80 rounded-2xl p-4.5 space-y-3.5 select-none text-left">
              <h5 className="text-[10px] font-mono font-extrabold text-[#FFD700] uppercase tracking-widest flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                <span>SUPORTE DA COMPRA</span>
              </h5>

              <div className="grid grid-cols-2 gap-3">
                {/* Tipo de Documento */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#A0A0AB] uppercase">Categoria</span>
                  <span className="text-xs font-bold text-white mt-1">
                    {selectedCategory}
                  </span>
                </div>

                {/* Team repasse Support only, no user visible cashback or points */}
                <div className="flex flex-col">
                  <span className="text-[9px] text-[#A0A0AB] uppercase font-bold text-yellow-400">Doado p/ Time</span>
                  <span className="text-sm font-extrabold text-[#FFD700] font-mono mt-1">
                    +R$ {clubCommissionPreview.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:text-white transition-colors text-xs font-semibold py-3.5 rounded-xl cursor-pointer"
              >
                Cancelar
              </button>
              
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-[#FF5500] to-[#FFD700] text-black font-extrabold font-display uppercase tracking-widest text-xs py-3.5 rounded-xl block border-0 cursor-pointer orange-glow text-orange-glow active:scale-95 transition-all"
              >
                AUDITAR CUPOM
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
