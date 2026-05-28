// Types representing local business gamified marketplace & community football tables

export interface Time {
  id: string;
  nome: string;
  sigla: string;
  logo: string; // URL string
  logo_url?: string; // Supabase Storage public address
  cores: string[]; // hex colors, e.g. ["#FF5500", "#000000"]
  fundacao?: string;
  bairro?: string;
  estadio?: string;
  membros_count?: number;
  pontos?: number;
  vitorias?: number;
  empates?: number;
  derrotas?: number;
  gols_pro?: number;
  gols_contra?: number;
  saldo_gols?: number;
}

export interface Empresa {
  id: string;
  nome: string;
  razao_social?: string;
  cnpj?: string;
  categoria: string;
  logo: string;
  logo_url?: string; // Supabase Storage public address
  banner?: string;
  descricao?: string;
  endereco?: string;
  bairro?: string;
  telefone?: string;
  cashback_porcentagem: number; // e.g. 5 for 5% cashback
  destaque?: boolean;
  score?: number; // review rating e.g. 4.9
  pontos_por_real: number; // e.g. 10 points per R$ 1 spent
}

export interface Usuario {
  id: string;
  nome: string;
  email?: string;
  avatar_url?: string;
  foto_url?: string; // Supabase Storage profile image address
  time_coracao_id?: string; // relationship to Time
  saldo_cashback: number; // in R$
  saldo_pontos: number;
  ranking_posicao?: number;
  telefone?: string;
  cidade?: string;
  senha?: string;
  nivel: number; // user tier e.g. 1-10
  created_at?: string;
}

export interface Comprovante {
  id: string;
  usuario_id: string;
  empresa_id: string;
  time_id?: string; // club being supported in this purchase
  valor: number;
  data_compra: string;
  status: 'pendente' | 'aprovado' | 'rejeitado';
  chave_nfe?: string;
  imagem_url?: string;
  pontos_gerados: number;
  cashback_gerado: number;
  comissao_clube_gerado: number;
  created_at?: string;
  // Join references (optional)
  usuario_nome?: string;
  empresa_nome?: string;
  time_nome?: string;
}

export interface RankingItem {
  id: string;
  posicao: number;
  nome: string; // can be team name, user name or brand name based on context
  tipo: 'time' | 'usuario' | 'empresa';
  pontos: number;
  vitorias?: number;
  jogos?: number;
  avatar_logo?: string;
  sub_label?: string; // e.g., "120 Sócios" or "R$ 4.2k em compras"
}

export interface FinanceiroMovimentacao {
  id: string;
  usuario_id?: string;
  empresa_id?: string;
  time_id?: string;
  tipo: 'entrada' | 'saida' | 'cashback' | 'comissao_clube' | 'taxa_sistema';
  valor: number;
  descricao: string;
  status: 'concluido' | 'processando' | 'falhou';
  created_at: string;
  // join helpers
  usuario_nome?: string;
  time_nome?: string;
  empresa_nome?: string;
}

export interface Notificacao {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: 'gols' | 'promocao' | 'financeiro' | 'comprovante' | 'sistema';
  lida: boolean;
  meta_data?: Record<string, any>;
  created_at: string;
}

export interface Copa {
  id: string;
  nome: string;
  ano?: string;
  banner?: string;
  jogos_atrativos?: any[]; // details of recent games or upcoming games
  status: 'em_breve' | 'em_andamento' | 'finalizada';
  campeao_id?: string;
  premiacao_total?: string;
}

export interface MidiaVideo {
  id: string;
  empresa_id: string;
  empresa_nome: string;
  empresa_logo: string;
  video_url: string;
  descricao: string;
  curtidas: number;
  comentarios_count: number;
  cupom_codigo?: string;
  desconto_info?: string;
}

export interface Categoria {
  id: string;
  nome: string;
  subcategorias?: string[];
  emoji?: string;
  cor_gradient?: string;
}

