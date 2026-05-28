import React, { useState } from 'react';
import { 
  Plus, Edit2, Trash2, Phone, Mail, MessageCircle, Instagram, Link, MapPin, Search, Check, X, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export interface Contato {
  id: string;
  entityId: string;
  entityType: 'usuario' | 'empresa' | 'clube';
  nome: string;
  tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro';
  valor: string;
  descricao?: string;
}

interface ContactsManagerProps {
  entityId: string;
  entityType: 'usuario' | 'empresa' | 'clube';
  contatos: Contato[];
  onAddContato: (nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => void;
  onUpdateContato: (id: string, nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => void;
  onDeleteContato: (id: string) => void;
}

export default function ContactsManager({ 
  entityId, 
  entityType, 
  contatos, 
  onAddContato, 
  onUpdateContato, 
  onDeleteContato 
}: ContactsManagerProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form states (Add/Edit)
  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState<'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro'>('whatsapp');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');

  // Filter contacts matching the active logged-in persona
  const activeContacts = contatos.filter(
    c => c.entityId === entityId && c.entityType === entityType
  );

  const filteredContacts = activeContacts.filter(c => 
    c.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.valor.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.descricao || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startAdd = () => {
    setNome('');
    setTipo('whatsapp');
    setValor('');
    setDescricao('');
    setIsAdding(true);
    setEditingId(null);
  };

  const startEdit = (c: Contato) => {
    setEditingId(c.id);
    setIsAdding(false);
    setNome(c.nome);
    setTipo(c.tipo);
    setValor(c.valor);
    setDescricao(c.descricao || '');
  };

  const resetForm = () => {
    setIsAdding(false);
    setEditingId(null);
    setNome('');
    setValor('');
    setDescricao('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim() || !valor.trim()) return;

    if (isAdding) {
      onAddContato(nome, tipo, valor, descricao);
    } else if (editingId) {
      onUpdateContato(editingId, nome, tipo, valor, descricao);
    }
    resetForm();
  };

  const renderContactIcon = (type: string) => {
    switch (type) {
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4 text-green-500 fill-green-500/10" />;
      case 'telefone':
        return <Phone className="w-4 h-4 text-[#FFD700]" />;
      case 'instagram':
        return <Instagram className="w-4 h-4 text-pink-500" />;
      case 'email':
        return <Mail className="w-4 h-4 text-cyan-400" />;
      default:
        return <Link className="w-4 h-4 text-zinc-400" />;
    }
  };

  return (
    <div className="bg-[#0C0C0E] border border-zinc-900 rounded-3xl p-5 shadow-lg space-y-4 text-left font-sans">
      
      {/* Title with metadata */}
      <div className="flex justify-between items-center select-none border-b border-zinc-900 pb-3">
        <div>
          <span className="text-[10px] font-mono text-[#FF5500] font-black uppercase tracking-widest block">ADMINISTRAR CONTATOS</span>
          <h3 className="text-sm font-black text-white font-display mt-0.5">Meus Canais de Comunicação</h3>
        </div>
        
        {!isAdding && !editingId && (
          <button
            onClick={startAdd}
            className="bg-[#FF5500] hover:bg-orange-600 text-white font-black text-[10px] uppercase py-2 px-3 rounded-lg flex items-center gap-1 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Adicionar</span>
          </button>
        )}
      </div>

      {/* SEARCH OR FORM INLINE */}
      {!isAdding && !editingId ? (
        <div className="relative">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-600" />
          <input
            type="text"
            placeholder="Buscar nos meus contatos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black border border-zinc-900 focus:border-[#FF5500]/70 rounded-xl py-2 pl-9.5 pr-4 text-xs font-sans text-white focus:outline-none placeholder-zinc-700 transition-colors"
          />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-black/40 border border-zinc-900 rounded-2xl p-4 space-y-3.5">
          <div className="flex justify-between items-center pb-1.5 border-b border-zinc-900/60">
            <h4 className="text-[11px] font-mono font-bold text-zinc-400 uppercase tracking-wider">
              {isAdding ? '🚀 Novo Contato' : '📝 Editar Contato'}
            </h4>
            <button 
              type="button" 
              onClick={resetForm}
              className="text-zinc-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Nome do Contato</label>
              <input
                type="text"
                required
                placeholder="Ex: WhatsApp Comercial"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Tipo</label>
              <select
                value={tipo}
                onChange={(e) => setTipo(e.target.value as any)}
                className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-1.5 px-2 text-xs text-white focus:outline-none"
              >
                <option value="whatsapp">WhatsApp</option>
                <option value="telefone">Telefone</option>
                <option value="instagram">Instagram</option>
                <option value="email">E-mail</option>
                <option value="outro">Outro Link/Endereço</option>
              </select>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Valor do Contato</label>
            <input
              type="text"
              required
              placeholder={tipo === 'instagram' ? 'Ex: @nome_da_empresa' : (tipo === 'email' ? 'Ex: contato@seucomercio.com' : 'Ex: (11) 99999-9999')}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[8px] font-mono font-bold text-zinc-500 uppercase tracking-widest">Descrição Curta (Opcional)</label>
            <input
              type="text"
              placeholder="Ex: Falar com Carlinhos no faturamento"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full bg-black border border-zinc-900 focus:border-[#FF5500] rounded-xl py-1.5 px-2.5 text-xs text-white focus:outline-none"
            />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={resetForm}
              className="flex-1 bg-zinc-900 border border-zinc-850 text-zinc-400 py-2 rounded-xl text-xs font-bold uppercase transition-all"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#FF5500] hover:bg-orange-600 text-white py-2 rounded-xl text-xs font-bold uppercase transition-all flex items-center justify-center gap-1"
            >
              <Check className="w-4 h-4" />
              <span>Salvar</span>
            </button>
          </div>
        </form>
      )}

      {/* CONTACTS LIST */}
      <div className="space-y-2 max-h-[280px] overflow-y-auto pr-1 no-scrollbar">
        {filteredContacts.length > 0 ? (
          filteredContacts.map(c => (
            <div 
              key={c.id} 
              className="bg-[#121214] border border-zinc-900 rounded-2xl p-3.5 flex items-start justify-between gap-3 group/item hover:border-zinc-800 transition-colors"
            >
              <div className="flex items-start gap-2.5 min-w-0">
                <div className="mt-0.5 p-2 bg-black border border-zinc-900 group-hover/item:border-orange-500/20 rounded-xl flex-shrink-0 transition-colors">
                  {renderContactIcon(c.tipo)}
                </div>
                <div className="min-w-0">
                  <span className="font-extrabold text-white text-xs block truncate leading-tight">{c.nome}</span>
                  <span className="text-[11px] font-mono font-bold text-orange-400 mt-0.5 block truncate select-all">{c.valor}</span>
                  {c.descricao && (
                    <span className="text-[9px] text-zinc-500 font-medium block leading-normal mt-0.5">{c.descricao}</span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1.5 opacity-70 group-hover/item:opacity-100 transition-opacity">
                <button
                  onClick={() => startEdit(c)}
                  className="p-1.5 bg-black border border-zinc-900 hover:border-blue-500 rounded-lg text-zinc-500 hover:text-blue-400 transition-colors"
                  title="Editar"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => onDeleteContato(c.id)}
                  className="p-1.5 bg-black border border-zinc-900 hover:border-red-500 rounded-lg text-zinc-500 hover:text-red-500 transition-colors"
                  title="Excluir"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="p-6 text-center bg-zinc-950/40 border border-zinc-900 rounded-2xl flex flex-col items-center justify-center gap-2 select-none">
            <ShieldAlert className="w-6 h-6 text-zinc-650" />
            <p className="text-[11px] text-zinc-500 font-medium max-w-[180px] text-center leading-normal">
              {searchTerm ? 'Nenhum canal de contato bate com sua busca.' : 'Você não cadastrou nenhum contato para este perfil.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
