import { supabase } from './supabaseClient';
import { Time, Empresa, Usuario, Comprovante, RankingItem, FinanceiroMovimentacao, Notificacao, Copa, MidiaVideo, Categoria } from './types';

// ==========================================
// HIGH CONTEXTUAL BRAZILIAN VARZEA MOCK DATA
// (Used as premium fallback and structure template)
// ==========================================

export const MOCK_TIMES: Time[] = [
  {
    id: 't-1',
    nome: 'Laranja Mecânica da Zona Leste',
    sigla: 'LMZ',
    logo: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=120&auto=format&fit=crop',
    cores: ['#FF5500', '#000000'],
    fundacao: '2004',
    bairro: 'Itaquera',
    estadio: 'Arena da Várzea Central',
    membros_count: 512,
    pontos: 32,
    vitorias: 10,
    empates: 2,
    derrotas: 2,
    gols_pro: 34,
    gols_contra: 15,
    saldo_gols: 19
  },
  {
    id: 't-2',
    nome: 'Pau Ferro Futebol e Várzea',
    sigla: 'PFF',
    logo: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=120&auto=format&fit=crop',
    cores: ['#FFC107', '#0A0A0B'],
    fundacao: '1998',
    bairro: 'Capão Redondo',
    estadio: 'Campo do Terrão Sagrado',
    membros_count: 389,
    pontos: 29,
    vitorias: 9,
    empates: 2,
    derrotas: 3,
    gols_pro: 28,
    gols_contra: 18,
    saldo_gols: 10
  },
  {
    id: 't-3',
    nome: 'União do Morro FC',
    sigla: 'UMF',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=120&auto=format&fit=crop',
    cores: ['#00FF88', '#050505'],
    fundacao: '2010',
    bairro: 'Paraisópolis',
    estadio: 'Caldeirão dos Crias',
    membros_count: 745,
    pontos: 27,
    vitorias: 8,
    empates: 3,
    derrotas: 3,
    gols_pro: 31,
    gols_contra: 22,
    saldo_gols: 9
  },
  {
    id: 't-4',
    nome: 'Ajax da Favela',
    sigla: 'AJX',
    logo: 'https://images.unsplash.com/photo-1510563800743-aed2364902b8?q=80&w=120&auto=format&fit=crop',
    cores: ['#FF0055', '#FFFFFF'],
    fundacao: '1991',
    bairro: 'Heliópolis',
    estadio: 'Estádio Arena Vermelha',
    membros_count: 622,
    pontos: 24,
    vitorias: 7,
    empates: 3,
    derrotas: 4,
    gols_pro: 25,
    gols_contra: 20,
    saldo_gols: 5
  },
  {
    id: 't-5',
    nome: 'Dínamo Vila Maria',
    sigla: 'DVM',
    logo: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=120&auto=format&fit=crop',
    cores: ['#0099FF', '#FFFFFF'],
    fundacao: '2015',
    bairro: 'Vila Maria',
    estadio: 'Campo da Piscina',
    membros_count: 240,
    pontos: 18,
    vitorias: 5,
    empates: 3,
    derrotas: 6,
    gols_pro: 19,
    gols_contra: 21,
    saldo_gols: -2
  }
];

export const MOCK_EMPRESAS: Empresa[] = [
  {
    id: 'e-1',
    nome: 'Bar do Bigode & Gool de Placa',
    categoria: 'Bares e Lanches',
    logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=120&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
    descricao: 'O melhor churrasquinho da várzea e cerveja trincando após a rodada do terrão. Transmissão de jogos locais.',
    endereco: 'Rua das Chuteiras, 145',
    bairro: 'Itaquera',
    telefone: '(11) 98888-1234',
    cashback_porcentagem: 8,
    destaque: true,
    score: 4.9,
    pontos_por_real: 10
  },
  {
    id: 'e-2',
    nome: 'Corte do Crias - Barbearia Premium',
    categoria: 'Beleza e Estilo',
    logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=120&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?q=80&w=600&auto=format&fit=crop',
    descricao: 'Risco cirúrgico, pigmentação e o lifestyle da várzea. Sócios têm desconto especial e pontos extras.',
    endereco: 'Av. dos Campeões, 902',
    bairro: 'Paraisópolis',
    telefone: '(11) 97777-5678',
    cashback_porcentagem: 12,
    destaque: true,
    score: 4.8,
    pontos_por_real: 15
  },
  {
    id: 'e-3',
    nome: 'Supermercado Aliança Família',
    categoria: 'Mercados e Padarias',
    logo: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=120&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=600&auto=format&fit=crop',
    descricao: 'Economia e qualidade no seu bairro. Apoiando o futebol local com pontos e vantagens reais.',
    endereco: 'Rua XV de Novembro, 2521',
    bairro: 'Capão Redondo',
    telefone: '(11) 96123-0099',
    cashback_porcentagem: 5,
    destaque: false,
    score: 4.6,
    pontos_por_real: 5
  },
  {
    id: 'e-4',
    nome: 'Gool Fitness Academia - Terrão do Treino',
    categoria: 'Saúde e Fitness',
    logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=120&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=600&auto=format&fit=crop',
    descricao: 'Treine pesado para correr os 90 minutos do final de semana. Equipamentos modernos e plano sócio compra.',
    endereco: 'Rua do Canelamento, 12',
    bairro: 'Heliópolis',
    telefone: '(11) 95555-4422',
    cashback_porcentagem: 10,
    destaque: true,
    score: 4.7,
    pontos_por_real: 12
  },
  {
    id: 'e-5',
    nome: 'Pizzaria Camp Nou de Quebrada',
    categoria: 'Bares e Lanches',
    logo: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=120&auto=format&fit=crop',
    banner: 'https://images.unsplash.com/photo-1590947132387-155cc02f3212?q=80&w=600&auto=format&fit=crop',
    descricao: 'Pizzas generosas com nomes de lendas do clássico. Reúna a sua torcida aqui e reverta em saldo para o seu time.',
    endereco: 'Av. Brasiliense, 804',
    bairro: 'Vila Maria',
    telefone: '(11) 94444-1111',
    cashback_porcentagem: 6,
    destaque: false,
    score: 4.5,
    pontos_por_real: 8
  }
];

export const MOCK_NOTIFICACOES: Notificacao[] = [
  {
    id: 'n-1',
    titulo: '⚽ GOL DO LARANJA MECÂNICA!',
    mensagem: 'Cleitinho fuzilou de fora da área! Placar ao vivo: Laranja Mecânica 2 x 1 Ajax Heliópolis.',
    tipo: 'gols',
    lida: false,
    created_at: new Date(Date.now() - 2 * 60 * 1000).toISOString()
  },
  {
    id: 'n-2',
    titulo: '💰 APOIO CONFIRMADO!',
    mensagem: 'Seu comprovante de R$ 85,00 no Bar do Bigode gerou 850 pontos de torcida para você e R$ 4,25 para o Pau Ferro FC.',
    tipo: 'financeiro',
    lida: false,
    created_at: new Date(Date.now() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 'n-3',
    titulo: '🔥 PARCERIA DO DIA',
    mensagem: 'Barbearia Corte do Crias com dobro de pontos apenas para filiados do União do Morro!',
    tipo: 'promocao',
    lida: true,
    created_at: new Date(Date.now() - 3 * 3600 * 1000).toISOString()
  },
  {
    id: 'n-4',
    titulo: '🛡️ COMPROVANTE REVISADO',
    mensagem: 'O comprovante fiscal emitido em Supermercado Aliança foi aprovado com auditoria Supabase.',
    tipo: 'comprovante',
    lida: true,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  }
];

export const MOCK_COPAS: Copa[] = [
  {
    id: 'c-1',
    nome: 'Copa Terrão da Várzea Premium 2026',
    ano: '2026',
    banner: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop',
    status: 'em_andamento',
    premiacao_total: 'R$ 15.000,00 mais Chuteira de Ouro',
    jogos_atrativos: [
      { id: 'g-1', time1: 'Laranja Mecânica', score1: 2, time2: 'Ajax da Favela', score2: 1, tempo: '85 Minutos (ST)', ao_vivo: true },
      { id: 'g-2', time1: 'União do Morro', score1: 0, time2: 'Pau Ferro FC', score2: 0, tempo: 'Prorrogação', ao_vivo: true }
    ]
  },
  {
    id: 'c-2',
    nome: 'Super Liga Interbairros de São Paulo',
    ano: '2026',
    banner: 'https://images.unsplash.com/photo-1543351611-58f69d7c1781?q=80&w=400&auto=format&fit=crop',
    status: 'em_breve',
    premiacao_total: 'R$ 25.000,00',
    jogos_atrativos: [
      { id: 'g-3', time1: 'Dínamo Vila Maria', score1: null, time2: 'Laranja Mecânica', score2: null, tempo: 'Amanhã 15h', ao_vivo: false }
    ]
  }
];

export const MOCK_USUARIOS: Usuario[] = [
  {
    id: 'u-1',
    nome: 'Luiz Prates (Você)',
    email: 'lsp.prates@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
    time_coracao_id: 't-1',
    saldo_cashback: 142.50,
    saldo_pontos: 12450,
    ranking_posicao: 4,
    telefone: '(11) 99999-8888',
    nivel: 6,
    created_at: new Date().toISOString()
  },
  {
    id: 'u-2',
    nome: 'Neymar dos Santos',
    email: 'ney@santos.org',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop',
    time_coracao_id: 't-3',
    saldo_cashback: 1250.40,
    saldo_pontos: 84300,
    ranking_posicao: 1,
    telefone: '(13) 91111-1234',
    nivel: 10,
    created_at: new Date().toISOString()
  },
  {
    id: 'u-3',
    nome: 'Thiago Mota Várzea',
    email: 'thiagov@gmail.com',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop',
    time_coracao_id: 't-1',
    saldo_cashback: 320.00,
    saldo_pontos: 24100,
    ranking_posicao: 2,
    telefone: '(11) 92222-3333',
    nivel: 8,
    created_at: new Date().toISOString()
  },
  {
    id: 'u-4',
    nome: 'Aline Santos Quebrada',
    email: 'aline_k@yahoo.com',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop',
    time_coracao_id: 't-2',
    saldo_cashback: 215.10,
    saldo_pontos: 18900,
    ranking_posicao: 3,
    telefone: '(11) 93333-4444',
    nivel: 7,
    created_at: new Date().toISOString()
  }
];

export const MOCK_COMPROVANTES: Comprovante[] = [
  {
    id: 'comp-1',
    usuario_id: 'u-1',
    empresa_id: 'e-1',
    time_id: 't-1',
    valor: 154.00,
    data_compra: new Date(Date.now() - 3600 * 1000).toISOString(),
    status: 'aprovado',
    chave_nfe: '35260517756142280099550010002456422851234567',
    imagem_url: 'https://images.unsplash.com/photo-1554415707-6e8cfc93fe23?q=80&w=200&auto=format&fit=crop',
    pontos_gerados: 1540,
    cashback_gerado: 12.32,
    comissao_clube_gerado: 7.70,
    usuario_nome: 'Luiz Prates (Você)',
    empresa_nome: 'Bar do Bigode & Gool de Placa',
    time_nome: 'Laranja Mecânica da Zona Leste'
  },
  {
    id: 'comp-2',
    usuario_id: 'u-3',
    empresa_id: 'e-2',
    time_id: 't-1',
    valor: 75.00,
    data_compra: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    status: 'aprovado',
    chave_nfe: '35260517756142280099550010002456422851231111',
    pontos_gerados: 1125,
    cashback_gerado: 9.00,
    comissao_clube_gerado: 3.75,
    usuario_nome: 'Thiago Mota Várzea',
    empresa_nome: 'Corte do Crias - Barbearia Premium',
    time_nome: 'Laranja Mecânica da Zona Leste'
  },
  {
    id: 'comp-3',
    usuario_id: 'u-4',
    empresa_id: 'e-3',
    time_id: 't-2',
    valor: 350.00,
    data_compra: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    status: 'pendente',
    chave_nfe: '35260517756142280099550010002456422851239999',
    pontos_gerados: 1750,
    cashback_gerado: 17.50,
    comissao_clube_gerado: 17.50,
    usuario_nome: 'Aline Santos Quebrada',
    empresa_nome: 'Supermercado Aliança Família',
    time_nome: 'Pau Ferro Futebol e Várzea'
  },
  {
    id: 'comp-4',
    usuario_id: 'u-1',
    empresa_id: 'e-4',
    time_id: 't-1',
    valor: 120.00,
    data_compra: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    status: 'aprovado',
    chave_nfe: '35260517756142280099550010002456422851238888',
    pontos_gerados: 1440,
    cashback_gerado: 12.00,
    comissao_clube_gerado: 6.00,
    usuario_nome: 'Luiz Prates (Você)',
    empresa_nome: 'Gool Fitness Academia',
    time_nome: 'Laranja Mecânica da Zona Leste'
  }
];

export const MOCK_VIDEOS: MidiaVideo[] = [
  {
    id: 'v-1',
    empresa_id: 'e-2',
    empresa_nome: 'Corte do Crias - Barbearia',
    empresa_logo: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=120&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-hand-cutting-hair-with-scissors-close-up-34359-large.mp4',
    descricao: 'Aquele risco insano de artilheiro pro jogo de domingo! ⚡ Agende pelo app e ganhe 15 pontos por Real! Apoie seu time de coração no terrão.',
    curtidas: 1420,
    comentarios_count: 89,
    cupom_codigo: 'CRIASVARZEA',
    desconto_info: 'R$ 10 de Desconto + Pontos'
  },
  {
    id: 'v-2',
    empresa_id: 'e-1',
    empresa_nome: 'Bar do Bigode & Gool de Placa',
    empresa_logo: 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=120&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-serving-beer-from-a-tap-in-a-pub-41584-large.mp4',
    descricao: 'Cerveja gelada pós treino? Temos! ⚽ Nosso buffet ajuda seu clube de várzea a comprar redes e coletes.',
    curtidas: 2310,
    comentarios_count: 140,
    cupom_codigo: 'BIGODE8',
    desconto_info: 'Cerveja de Boas-Vindas'
  },
  {
    id: 'v-3',
    empresa_id: 'e-4',
    empresa_nome: 'Gool Fitness Academia',
    empresa_logo: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=120&auto=format&fit=crop',
    video_url: 'https://assets.mixkit.co/videos/preview/mixkit-athlete-training-on-heavy-ropes-at-the-gym-40501-large.mp4',
    descricao: 'Preparação física de elite para campeonatos locais. Fortaleça o joelho pro final de semana. 🏋️‍♂️ Ganhe pontos em dobro ao treinar conosco!',
    curtidas: 980,
    comentarios_count: 42,
    cupom_codigo: 'FORCAVARZEA',
    desconto_info: 'Avaliação Grátis'
  }
];


// ==========================================
// CENTRAL SERVICES WITH SUPABASE COMPATIBILITY
// ==========================================

export const DataService = {
  // Flag indicating Supabase connectivity state
  isUsingRealSupabase: false,
  diagnosticErrorLog: {} as Record<string, string>,

  async loadAll() {
    try {
      // Test times queries
      const { data, error } = await supabase.from('times').select('*').limit(1);
      if (!error) {
        this.isUsingRealSupabase = true;
      }
    } catch (e) {
      this.isUsingRealSupabase = false;
    }
  },

  // 1. TIMES / CLUBS
  async getTimes(): Promise<Time[]> {
    try {
      const { data, error } = await supabase
        .from('times')
        .select('*')
        .order('pontos', { ascending: false });
      
      if (error) {
        this.diagnosticErrorLog['times'] = error.message;
        return MOCK_TIMES;
      }
      
      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        // Map with fallbacks for optional fields
        return data.map(item => ({
          id: item.id || item.time_id,
          nome: item.nome || item.name || 'Time Sem Nome',
          sigla: item.sigla || item.code || 'VAR',
          logo: item.logo || item.logo_url || 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=120&auto=format&fit=crop',
          cores: item.cores || (item.color ? [item.color] : ['#FF5500', '#000000']),
          fundacao: item.fundacao || item.founded,
          bairro: item.bairro || 'Várzea',
          estadio: item.estadio || item.field || 'Campo Local',
          membros_count: item.membros_count || item.members || 100,
          pontos: item.pontos !== undefined ? item.pontos : 10,
          vitorias: item.vitorias || 0,
          empates: item.empates || 0,
          derrotas: item.derrotas || 0,
          gols_pro: item.gols_pro || 0,
          gols_contra: item.gols_contra || 0,
          saldo_gols: item.saldo_gols !== undefined ? item.saldo_gols : 0
        }));
      }
      return MOCK_TIMES;
    } catch (e: any) {
      this.diagnosticErrorLog['times'] = e.message || 'Erro de conexão';
      return MOCK_TIMES;
    }
  },

  // 2. EMPRESAS / SPONSORS
  async getEmpresas(): Promise<Empresa[]> {
    try {
      const { data, error } = await supabase
        .from('empresas')
        .select('*');
      
      if (error) {
        this.diagnosticErrorLog['empresas'] = error.message;
        return MOCK_EMPRESAS;
      }
      
      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id,
          nome: item.nome || item.name || 'Estabelecimento',
          categoria: item.categoria || item.category || 'Varejo',
          logo: item.logo || item.logo_url || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=120&auto=format&fit=crop',
          banner: item.banner || item.banner_url || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
          descricao: item.descricao || item.description || '',
          endereco: item.endereco || item.address || '',
          bairro: item.bairro || '',
          telefone: item.telefone || item.phone || '',
          cashback_porcentagem: item.cashback_porcentagem !== undefined ? item.cashback_porcentagem : 5,
          destaque: item.destaque || false,
          score: item.score || 4.5,
          pontos_por_real: item.pontos_por_real || 10
        }));
      }
      return MOCK_EMPRESAS;
    } catch (e: any) {
      this.diagnosticErrorLog['empresas'] = e.message;
      return MOCK_EMPRESAS;
    }
  },

  // 3. REGULAR USERS
  async getUsuarios(): Promise<Usuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*');
      
      if (error) {
        this.diagnosticErrorLog['usuarios'] = error.message;
        return MOCK_USUARIOS;
      }
      
      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id,
          nome: item.nome || item.name || item.username || 'Sócio Fiel',
          email: item.email || '',
          avatar_url: item.avatar_url || item.photo_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
          time_coracao_id: item.time_coracao_id || item.team_id || 't-1',
          saldo_cashback: item.saldo_cashback !== undefined ? item.saldo_cashback : 0,
          saldo_pontos: item.saldo_pontos !== undefined ? item.saldo_pontos : 0,
          ranking_posicao: item.ranking_posicao || item.rank_index || 10,
          telefone: item.telefone || '',
          nivel: item.nivel || 1
        }));
      }
      return MOCK_USUARIOS;
    } catch (e: any) {
      this.diagnosticErrorLog['usuarios'] = e.message;
      return MOCK_USUARIOS;
    }
  },

  // 4. RECEIPT VERIFICATION (COMPROVANTES)
  async getComprovantes(): Promise<Comprovante[]> {
    try {
      const { data, error } = await supabase
        .from('comprovantes')
        .select(`
          *,
          usuarios(nome),
          empresas(nome),
          times(nome)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        // Retry without nesting (sometimes nesting isn't defined on foreign keys)
        const { data: rawData, error: err2 } = await supabase
          .from('comprovantes')
          .select('*')
          .order('created_at', { ascending: false });

        if (err2 || !rawData) {
          this.diagnosticErrorLog['comprovantes'] = err2?.message || error.message;
          return MOCK_COMPROVANTES;
        }

        return rawData.map(item => ({
          id: item.id,
          usuario_id: item.usuario_id,
          empresa_id: item.empresa_id,
          time_id: item.time_id,
          valor: item.valor || 0,
          data_compra: item.data_compra || item.created_at || new Date().toISOString(),
          status: item.status || 'pendente',
          chave_nfe: item.chave_nfe || '',
          imagem_url: item.imagem_url || '',
          pontos_gerados: item.pontos_gerados || 0,
          cashback_gerado: item.cashback_gerado || 0,
          comissao_clube_gerado: item.comissao_clube_gerado || 0,
          usuario_nome: item.usuario_nome || 'Usuário Local',
          empresa_nome: item.empresa_nome || 'Empresa Próxima',
          time_nome: item.time_nome || 'Clube de Coração'
        }));
      }

      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id,
          usuario_id: item.usuario_id,
          empresa_id: item.empresa_id,
          time_id: item.time_id,
          valor: item.valor || 0,
          data_compra: item.data_compra || item.created_at || new Date().toISOString(),
          status: item.status || 'pendente',
          chave_nfe: item.chave_nfe || '',
          imagem_url: item.imagem_url || '',
          pontos_gerados: item.pontos_gerados || 0,
          cashback_gerado: item.cashback_gerado || 0,
          comissao_clube_gerado: item.comissao_clube_gerado || 0,
          usuario_nome: item.usuarios?.nome || item.usuario_nome || 'Usuário Local',
          empresa_nome: item.empresas?.nome || item.empresa_nome || 'Empresa Próxima',
          time_nome: item.times?.nome || item.time_nome || 'Clube de Coração'
        }));
      }

      return MOCK_COMPROVANTES;
    } catch (e: any) {
      this.diagnosticErrorLog['comprovantes'] = e.message;
      return MOCK_COMPROVANTES;
    }
  },

  // 5. INSERT PROOF REAL
  async insertComprovante(proof: Omit<Comprovante, 'id' | 'created_at'>): Promise<Comprovante> {
    const newId = `comp-${Math.floor(Math.random() * 1000000)}`;
    const newRecord: Comprovante = {
      ...proof,
      id: newId,
      created_at: new Date().toISOString()
    };

    try {
      const { data, error } = await supabase
        .from('comprovantes')
        .insert([
          {
            id: newId,
            usuario_id: proof.usuario_id,
            empresa_id: proof.empresa_id,
            time_id: proof.time_id,
            valor: proof.valor,
            data_compra: proof.data_compra,
            status: proof.status,
            chave_nfe: proof.chave_nfe,
            imagem_url: proof.imagem_url,
            pontos_gerados: proof.pontos_gerados,
            cashback_gerado: proof.cashback_gerado,
            comissao_clube_gerado: proof.comissao_clube_gerado
          }
        ])
        .select();

      if (error) {
        console.warn('Insersão direta no Supabase falhou, guardando na sessão. Detalhes:', error.message);
        this.diagnosticErrorLog['comprovantes_insert'] = error.message;
      } else {
        console.log('Inserido no Supabase com sucesso!', data);
        this.isUsingRealSupabase = true;
      }
    } catch (e: any) {
      this.diagnosticErrorLog['comprovantes_insert'] = e.message;
    }

    // Local execution update to the active simulator as well to guarantee perfect UI flow
    return newRecord;
  },

  // 6. RANKINGS (SofaScore Vibe)
  async getRankings(): Promise<RankingItem[]> {
    try {
      const { data, error } = await supabase
        .from('ranking')
        .select('*')
        .order('pontos', { ascending: false });

      if (error) {
        this.diagnosticErrorLog['ranking'] = error.message;
        // Generate dynamically from falling back to Times sorted
        const times = await this.getTimes();
        return times.map((t, idx) => ({
          id: t.id,
          posicao: idx + 1,
          nome: t.nome,
          tipo: 'time',
          pontos: t.pontos || 0,
          vitorias: t.vitorias,
          jogos: (t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0),
          avatar_logo: t.logo,
          sub_label: `${t.membros_count || 120} Sócios Compra ativos`
        }));
      }

      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map((item, idx) => ({
          id: item.id,
          posicao: item.posicao || idx + 1,
          nome: item.nome || 'Pilar da Quebrada',
          tipo: item.tipo || 'time',
          pontos: item.pontos || 0,
          vitorias: item.vitorias,
          jogos: item.jogos,
          avatar_logo: item.avatar_logo || item.logo_url,
          sub_label: item.sub_label || `${item.pontos} Pts`
        }));
      }

      // Generate from falling back if empty
      const times = await this.getTimes();
      return times.map((t, idx) => ({
        id: t.id,
        posicao: idx + 1,
        nome: t.nome,
        tipo: 'time',
        pontos: t.pontos || 0,
        vitorias: t.vitorias,
        jogos: (t.vitorias || 0) + (t.empates || 0) + (t.derrotas || 0),
        avatar_logo: t.logo,
        sub_label: `${t.membros_count} torcedores filiados`
      }));
    } catch (e: any) {
      this.diagnosticErrorLog['ranking'] = e.message;
      return [];
    }
  },

  // 7. FINANCIAL LEDGERS
  async getFinanceiro(): Promise<FinanceiroMovimentacao[]> {
    try {
      const { data, error } = await supabase
        .from('financeiro')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.diagnosticErrorLog['financeiro'] = error.message;
        // return mock mapped transfers
        return [
          { id: 'f-1', tipo: 'cashback', valor: 12.32, descricao: 'Pontos Creditados no Bar do Bigode', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString(), usuario_nome: 'Luiz Prates' },
          { id: 'f-2', tipo: 'comissao_clube', valor: 7.70, descricao: 'Repasse Automático - Suporte Laranja Mecânica', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString(), time_nome: 'Laranja Mecânica' },
          { id: 'f-3', tipo: 'entrada', valor: 154.00, descricao: 'Compra física registrada na Maquininha Futebol de Várzea', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString(), empresa_nome: 'Bar do Bigode' },
          { id: 'f-4', tipo: 'taxa_sistema', valor: 3.08, descricao: 'FEE Processamento Rede Futebol de Várzea (2%)', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString() }
        ];
      }

      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id,
          tipo: item.tipo || 'entrada',
          valor: item.valor || 0,
          descricao: item.descricao || 'Simulação Financeira',
          status: item.status || 'concluido',
          created_at: item.created_at || new Date().toISOString(),
          usuario_nome: item.usuario_nome,
          time_nome: item.time_nome,
          empresa_nome: item.empresa_nome
        }));
      }

      return [
        { id: 'f-1', tipo: 'cashback', valor: 12.32, descricao: 'Pontos Creditados no Bar do Bigode', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString(), usuario_nome: 'Luiz Prates' },
        { id: 'f-2', tipo: 'comissao_clube', valor: 7.70, descricao: 'Repasse Automático - Suporte Laranja Mecânica', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString(), time_nome: 'Laranja Mecânica' },
        { id: 'f-3', tipo: 'entrada', valor: 154.00, descricao: 'Compra física registrada na Maquininha Futebol de Várzea', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString(), empresa_nome: 'Bar do Bigode' },
        { id: 'f-4', tipo: 'taxa_sistema', valor: 3.08, descricao: 'FEE Processamento Rede Futebol de Várzea (2%)', status: 'concluido', created_at: new Date(Date.now() - 3600 * 1000).toISOString() }
      ];
    } catch (e: any) {
      this.diagnosticErrorLog['financeiro'] = e.message;
      return [];
    }
  },

  // 8. NOTIFICATIONS
  async getNotificacoes(): Promise<Notificacao[]> {
    try {
      const { data, error } = await supabase
        .from('notificacoes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        this.diagnosticErrorLog['notificacoes'] = error.message;
        return MOCK_NOTIFICACOES;
      }

      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id,
          titulo: item.titulo || 'Notificação',
          mensagem: item.mensagem || '',
          tipo: item.tipo || 'sistema',
          lida: item.lida !== undefined ? item.lida : false,
          created_at: item.created_at || new Date().toISOString()
        }));
      }

      return MOCK_NOTIFICACOES;
    } catch (e: any) {
      this.diagnosticErrorLog['notificacoes'] = e.message;
      return MOCK_NOTIFICACOES;
    }
  },

  // 9. LEAGUE COPAS
  async getCopas(): Promise<Copa[]> {
    try {
      const { data, error } = await supabase
        .from('copas')
        .select('*');

      if (error) {
        this.diagnosticErrorLog['copas'] = error.message;
        return MOCK_COPAS;
      }

      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id,
          nome: item.nome || 'Campeonato local',
          ano: item.ano || '2026',
          banner: item.banner || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=400&auto=format&fit=crop',
          status: item.status || 'em_andamento',
          premiacao_total: item.premiacao_total || 'Medalhas e Troféus',
          jogos_atrativos: item.jogos_atrativos || []
        }));
      }
      return MOCK_COPAS;
    } catch (e: any) {
      this.diagnosticErrorLog['copas'] = e.message;
      return MOCK_COPAS;
    }
  },

  // 11. VIDEOS / REELS
  async getVideos(): Promise<MidiaVideo[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select('*');

      if (error) {
        this.diagnosticErrorLog['videos'] = error.message;
        return MOCK_VIDEOS;
      }

      if (data && data.length > 0) {
        this.isUsingRealSupabase = true;
        return data.map(item => ({
          id: item.id || `v-${item.id}`,
          empresa_id: item.empresa_id || '',
          empresa_nome: item.empresa_nome || 'Parceiro',
          empresa_logo: item.empresa_logo || 'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=120&auto=format&fit=crop',
          video_url: item.video_url || 'https://assets.mixkit.co/videos/preview/mixkit-hand-cutting-hair-with-scissors-close-up-34359-large.mp4',
          descricao: item.descricao || item.description || '',
          curtidas: item.curtidas !== undefined ? item.curtidas : 100,
          comentarios_count: item.comentarios_count !== undefined ? item.comentarios_count : 10,
          cupom_codigo: item.cupom_codigo || item.coupon_code || '',
          desconto_info: item.desconto_info || item.discount_info || ''
        }));
      }
      return MOCK_VIDEOS;
    } catch (e: any) {
      this.diagnosticErrorLog['videos'] = e.message;
      return MOCK_VIDEOS;
    }
  },

  // 12. CATEGORIAS PREMIUM
  async getCategorias(): Promise<Categoria[]> {
    try {
      const { data, error } = await supabase
        .from('categorias')
        .select('*');

      if (error) {
        this.diagnosticErrorLog['categorias'] = error.message;
        return PREMIUM_CATEGORIES;
      }

      if (data && data.length > 0) {
        return data.map(item => ({
          id: item.id || `cat-${item.id}`,
          nome: item.nome || item.name,
          subcategorias: Array.isArray(item.subcategorias) ? item.subcategorias : (item.subcategorias ? JSON.parse(item.subcategorias) : []),
          emoji: item.emoji || '🏬',
          cor_gradient: item.cor_gradient || 'from-zinc-800/10 to-zinc-900/10 hover:border-zinc-700'
        }));
      }
      return PREMIUM_CATEGORIES;
    } catch (e: any) {
      this.diagnosticErrorLog['categorias'] = e.message;
      return PREMIUM_CATEGORIES;
    }
  },

  async getSubcategoryFeeInfo(categoria: string, subcategoria: string): Promise<{ valor: string; tipo_calculo: string; tipo_valor: string }> {
    try {
      // Direct dynamic query from supabase on subcategorias or similar table
      const { data, error } = await supabase
        .from('subcategorias_taxas')
        .select('*')
        .eq('subcategoria', subcategoria)
        .single();
      
      if (!error && data) {
        return {
          valor: data.valor || '5.0%',
          tipo_calculo: data.tipo_calculo || 'Percentual',
          tipo_valor: data.tipo_valor || 'Taxa por Transação'
        };
      }
    } catch (err) {
      // Failsafe fallback below
    }

    // Default commercial values based on Brazilian marketplace averages
    const subLower = (subcategoria || '').toLowerCase();
    
    // BEAUTY & ESTHETICS (Beleza & Estética)
    if (subLower.includes('barbearia')) {
      return { valor: '5.0%', tipo_calculo: 'Taxa por Agendamento', tipo_valor: 'Percentual' };
    }
    if (subLower.includes('salão') || subLower.includes('salao') || subLower.includes('cabeleireiro')) {
      return { valor: '6.0%', tipo_calculo: 'Taxa por Agendamento', tipo_valor: 'Percentual' };
    }
    if (subLower.includes('manicure') || subLower.includes('pedicure') || subLower.includes('estética') || subLower.includes('estetica') || subLower.includes('bronzeamento') || subLower.includes('maquiagem')) {
      return { valor: '7.0%', tipo_calculo: 'Taxa por Agendamento', tipo_valor: 'Percentual' };
    }

    // FOOD & BEVERAGES / GASTRONOMY (Gastronomia / Alimentação & Bebidas)
    if (subLower.includes('pizza') || subLower.includes('hamburgueria') || subLower.includes('restaurante') || subLower.includes('marmitaria') || subLower.includes('espetinho') || subLower.includes('açai') || subLower.includes('acai') || subLower.includes('sorvete')) {
      return { valor: '5.5%', tipo_calculo: 'Comissão por Pedido', tipo_valor: 'Percentual' };
    }
    if (subLower.includes('adega') || subLower.includes('bar') || subLower.includes('distribuidora') || subLower.includes('conveniência') || subLower.includes('conveniencia')) {
      return { valor: '4.5%', tipo_calculo: 'Taxa por Transação', tipo_valor: 'Percentual' };
    }
    if (subLower.includes('mercado') || subLower.includes('mini mercado') || subLower.includes('padaria')) {
      return { valor: '2.5%', tipo_calculo: 'Taxa por Transação', tipo_valor: 'Percentual' };
    }

    // SERVICES & BUSINESS (Serviços Profissionais / Tecnologia & Digital)
    if (subLower.includes('advocacia') || subLower.includes('contabilidade') || subLower.includes('consultoria') || subLower.includes('seguros')) {
      return { valor: 'R$ 59,90', tipo_calculo: 'Assinatura Mensal', tipo_valor: 'Valor Fixo' };
    }
    if (subLower.includes('marketing') || subLower.includes('agência') || subLower.includes('agencia') || subLower.includes('designer') || subLower.includes('programação') || subLower.includes('programacao') || subLower.includes('desenvolvimento')) {
      return { valor: '5.0%', tipo_calculo: 'Taxa por Serviço realizado', tipo_valor: 'Percentual' };
    }

    // HEALTH & WELLNESS (Saúde & Bem-estar)
    if (subLower.includes('academia') || subLower.includes('clinica') || subLower.includes('clínica') || subLower.includes('dentista') || subLower.includes('psicólogo') || subLower.includes('psicologo')) {
      return { valor: 'R$ 39,90', tipo_calculo: 'Assinatura Mensal', tipo_valor: 'Valor Fixo' };
    }

    // OTHER SECTORS
    if (subLower.includes('elétrica') || subLower.includes('eletricista') || subLower.includes('hidráulica') || subLower.includes('encanador') || subLower.includes('pintor') || subLower.includes('construção') || subLower.includes('construcao')) {
      return { valor: 'R$ 29,90', tipo_calculo: 'Mensalidade Fixa', tipo_valor: 'Valor Fixo' };
    }
    if (subLower.includes('oficina') || subLower.includes('mecânica') || subLower.includes('mecanica') || subLower.includes('peças') || subLower.includes('pecas') || subLower.includes('lava') || subLower.includes('auto')) {
      return { valor: '4.8%', tipo_calculo: 'Taxa por Serviço realizado', tipo_valor: 'Percentual' };
    }

    // GENERAL DEFAULT
    return { valor: '5.0%', tipo_calculo: 'Taxa por Transação', tipo_valor: 'Percentual' };
  },

  // 10. REALTIME CHANNELS PROVIDERS
  // We provide live subscriptions to easily update the UI when events trigger
  subscribeToAllUpdates(callback: (payload: { table: string; newRecord: any }) => void) {
    const channel1 = supabase
      .channel('realtime_marketplace')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comprovantes' }, (p) => {
        callback({ table: 'comprovantes', newRecord: p.new });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notificacoes' }, (p) => {
        callback({ table: 'notificacoes', newRecord: p.new });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'financeiro' }, (p) => {
        callback({ table: 'financeiro', newRecord: p.new });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'ranking' }, (p) => {
        callback({ table: 'ranking', newRecord: p.new });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel1);
    };
  }
};

export const PREMIUM_CATEGORIES: Categoria[] = [
  {
    id: 'cat-1',
    nome: 'Beleza & Estética',
    emoji: '💇',
    subcategorias: ['Barbearia', 'Salão de Beleza', 'Cabeleireiro', 'Manicure', 'Pedicure', 'Maquiagem', 'Bronzeamento', 'Estética Facial'],
    cor_gradient: 'from-pink-500/10 to-purple-500/10 hover:border-pink-500/40 text-pink-500'
  },
  {
    id: 'cat-2',
    nome: 'Gastronomia',
    emoji: '🍕',
    subcategorias: [
      'Pizzaria', 'Hamburgueria', 'Restaurante', 'Marmitaria', 'Lanchonete', 'Adega', 'Bar', 'Mercado', 
      'Padaria', 'Cafeteria', 'Açaiteria', 'Food Truck', 'Conveniência', 'Distribuidora', 'Churrascaria', 
      'Espetinho', 'Sorveteria'
    ],
    cor_gradient: 'from-amber-600/10 to-red-600/10 hover:border-amber-500/40 text-amber-500'
  },
  {
    id: 'cat-3',
    nome: 'Alimentação & Bebidas',
    emoji: '🍺',
    subcategorias: [
      'Pizzaria', 'Hamburgueria', 'Restaurante', 'Restaurante Parceiro', 'Marmitaria', 'Lanchonete', 'Açaiteria', 
      'Sorveteria', 'Cafeteria', 'Churrascaria', 'Food Truck', 'Padaria', 'Mercado', 'Mini Mercado', 
      'Conveniência', 'Adega', 'Bar', 'Distribuidora', 'Espetinho'
    ],
    cor_gradient: 'from-yellow-500/10 to-amber-700/10 hover:border-yellow-400/40 text-yellow-500'
  },
  {
    id: 'cat-4',
    nome: 'Comércio Popular',
    emoji: '🛍️',
    subcategorias: ['Roupas', 'Calçados', 'Acessórios', 'Utilidades', 'Presentes', 'Brechó'],
    cor_gradient: 'from-emerald-500/10 to-teal-500/10 hover:border-emerald-500/40 text-emerald-500'
  },
  {
    id: 'cat-5',
    nome: 'Serviços Profissionais',
    emoji: '👔',
    subcategorias: ['Advocacia', 'Contabilidade', 'Consultoria', 'Marketing', 'Designer', 'Agência Digital'],
    cor_gradient: 'from-blue-600/10 to-slate-600/10 hover:border-blue-500/40 text-blue-500'
  },
  {
    id: 'cat-6',
    nome: 'Saúde & Bem-estar',
    emoji: '💪',
    subcategorias: ['Academia', 'Clínica', 'Dentista', 'Psicólogo'],
    cor_gradient: 'from-violet-500/10 to-indigo-500/10 hover:border-violet-500/40 text-violet-500'
  },
  {
    id: 'cat-7',
    nome: 'Construção & Manutenção',
    emoji: '🔧',
    subcategorias: ['Construção Civil', 'Eletricista', 'Encanador', 'Pintor'],
    cor_gradient: 'from-orange-500/10 to-yellow-600/10 hover:border-orange-500/40 text-orange-500'
  },
  {
    id: 'cat-8',
    nome: 'Automotivo',
    emoji: '🚗',
    subcategorias: ['Mecânica', 'Auto Elétrica', 'Lava Rápido'],
    cor_gradient: 'from-gray-500/10 to-slate-800/10 hover:border-gray-500/40 text-gray-400'
  },
  {
    id: 'cat-9',
    nome: 'Turismo & Eventos',
    emoji: '✈️',
    subcategorias: ['Hotel', 'Turismo', 'Buffet'],
    cor_gradient: 'from-cyan-500/10 to-blue-500/10 hover:border-cyan-500/40 text-cyan-500'
  },
  {
    id: 'cat-10',
    nome: 'Tecnologia & Digital',
    emoji: '💻',
    subcategorias: ['Programação', 'Desenvolvimento Web', 'Informática', 'Assistência Técnica'],
    cor_gradient: 'from-purple-600/10 to-fuchsia-600/10 hover:border-purple-500/40 text-[#FF5500]'
  }
];
