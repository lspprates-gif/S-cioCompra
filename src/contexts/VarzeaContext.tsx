import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { DataService, PREMIUM_CATEGORIES } from '../dataService';
import { checkTablesAvailability, TableStatus, supabase } from '../supabaseClient';
import { Time, Empresa, Usuario, Comprovante, Copa, Notificacao, MidiaVideo, Categoria } from '../types';
import { Contato } from '../components/ContactsManager';

interface ToastType {
  id: string;
  message: string;
  sub?: string;
  iconType?: string;
}

interface VarzeaContextProps {
  // Page Flow trackers
  cadastroEmpresaOpen: boolean;
  setCadastroEmpresaOpen: React.Dispatch<React.SetStateAction<boolean>>;
  cadastroClubeOpen: boolean;
  setCadastroClubeOpen: React.Dispatch<React.SetStateAction<boolean>>;
  splashActive: boolean;
  setSplashActive: React.Dispatch<React.SetStateAction<boolean>>;
  showLandingPage: boolean;
  setShowLandingPage: React.Dispatch<React.SetStateAction<boolean>>;
  loginScreenMode: 'initial' | 'login' | 'register';
  setLoginScreenMode: React.Dispatch<React.SetStateAction<'initial' | 'login' | 'register'>>;
  activeTab: 'home' | 'parceiros' | 'reels' | 'ranking' | 'perfil';
  setActiveTab: React.Dispatch<React.SetStateAction<'home' | 'parceiros' | 'reels' | 'ranking' | 'perfil'>>;
  activePersona: 'usuario' | 'empresa' | 'clube' | 'admin';
  setActivePersona: React.Dispatch<React.SetStateAction<'usuario' | 'empresa' | 'clube' | 'admin'>>;

  // Authentication and Session
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  currentUserId: string;
  setCurrentUserId: React.Dispatch<React.SetStateAction<string>>;
  currentEmpresaId: string;
  setCurrentEmpresaId: React.Dispatch<React.SetStateAction<string>>;
  currentTimeId: string;
  setCurrentTimeId: React.Dispatch<React.SetStateAction<string>>;
  activeUser: Usuario;
  getUserTierLabel: (lvl: number) => string;

  // Database States
  times: Time[];
  setTimes: React.Dispatch<React.SetStateAction<Time[]>>;
  empresas: Empresa[];
  setEmpresas: React.Dispatch<React.SetStateAction<Empresa[]>>;
  categorias: Categoria[];
  usuarios: Usuario[];
  setUsuarios: React.Dispatch<React.SetStateAction<Usuario[]>>;
  comprovantes: Comprovante[];
  setComprovantes: React.Dispatch<React.SetStateAction<Comprovante[]>>;
  copas: Copa[];
  setCopas: React.Dispatch<React.SetStateAction<Copa[]>>;
  videos: MidiaVideo[];
  setVideos: React.Dispatch<React.SetStateAction<MidiaVideo[]>>;
  notifications: Notificacao[];
  setNotifications: React.Dispatch<React.SetStateAction<Notificacao[]>>;

  // Contacts
  contatos: Contato[];
  setContatos: React.Dispatch<React.SetStateAction<Contato[]>>;

  // Diagnostics and live websocket states
  isSupabaseLive: boolean;
  connectionsCount: number;
  diagnosticStatus: TableStatus;
  diagnosticErrors: Record<string, string>;

  // Selection states
  selectedEmpresaSheet: Empresa | null;
  setSelectedEmpresaSheet: React.Dispatch<React.SetStateAction<Empresa | null>>;
  selectedClubeSheet: Time | null;
  setSelectedClubeSheet: React.Dispatch<React.SetStateAction<Time | null>>;
  selectedUsuarioSheet: Usuario | null;
  setSelectedUsuarioSheet: React.Dispatch<React.SetStateAction<Usuario | null>>;
  selectedHomeCategory: string;
  setSelectedHomeCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedHomeSubcategory: string;
  setSelectedHomeSubcategory: React.Dispatch<React.SetStateAction<string>>;
  homeVideoPlaying: MidiaVideo | null;
  setHomeVideoPlaying: React.Dispatch<React.SetStateAction<MidiaVideo | null>>;

  // Drawer/Notification/Menu states
  notificationsOpen: boolean;
  setNotificationsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  uploadModalOpen: boolean;
  setUploadModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  threeDotsMenuOpen: boolean;
  setThreeDotsMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rankingSegment: 'times' | 'empresas' | 'usuarios';
  setRankingSegment: React.Dispatch<React.SetStateAction<'times' | 'empresas' | 'usuarios'>>;
  activeToasts: ToastType[];
  setActiveToasts: React.Dispatch<React.SetStateAction<ToastType[]>>;

  // Category & search fields
  selectedCategory: string;
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  homeSearchQuery: string;
  setHomeSearchQuery: React.Dispatch<React.SetStateAction<string>>;
  partnersSearchQuery: string;
  setPartnersSearchQuery: React.Dispatch<React.SetStateAction<string>>;

  // Derived lookups
  categoriesList: string[];
  filteredEmpresas: Empresa[];

  // Action methods
  triggerVisualToast: (toast: ToastType) => void;
  hydrateDatabase: () => Promise<void>;
  handleUploadReceipt: (proof: Omit<Comprovante, 'id' | 'created_at'>) => Promise<void>;
  handleReviewComprovanteByEmployer: (id: string, status: 'aprovado' | 'rejeitado') => void;
  handleClaimCouponFromReels: (couponCode: string, discount: string) => void;
  simulateLiveGoalMatch: () => void;
  simulateTransactionPulse: () => void;
  simulatePendingReceiptInjection: () => void;
  handleResetDatabaseToMock: () => void;
  handleAddContato: (nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => void;
  handleUpdateContato: (id: string, nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => void;
  handleDeleteContato: (id: string) => void;
  handleLogin: (role: 'usuario' | 'empresa' | 'clube', id: string) => void;
  handleRegister: (role: 'usuario' | 'empresa' | 'clube', data: any) => Promise<void>;
  handleLogout: () => void;
  handleAddEmpresaLocal: (newEmpData: any) => Promise<void>;
  handleAddClubeLocal: (newClubData: any) => Promise<void>;
}

const VarzeaContext = createContext<VarzeaContextProps | undefined>(undefined);

export const VarzeaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Page Flow trackers
  const [cadastroEmpresaOpen, setCadastroEmpresaOpen] = useState(false);
  const [cadastroClubeOpen, setCadastroClubeOpen] = useState(false);
  const [splashActive, setSplashActive] = useState(true);
  const [showLandingPage, setShowLandingPage] = useState(true);
  const [loginScreenMode, setLoginScreenMode] = useState<'initial' | 'login' | 'register'>('initial');
  const [activeTab, setActiveTab] = useState<'home' | 'parceiros' | 'reels' | 'ranking' | 'perfil'>('home');
  const [activePersona, setActivePersona] = useState<'usuario' | 'empresa' | 'clube' | 'admin'>('usuario');

  // Multi-profile Authentication and Session
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('varzea_is_logged_in') !== 'false';
  });
  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    return localStorage.getItem('varzea_current_user_id') || 'u-1';
  });
  const [currentEmpresaId, setCurrentEmpresaId] = useState<string>(() => {
    return localStorage.getItem('varzea_current_empresa_id') || 'e-1';
  });
  const [currentTimeId, setCurrentTimeId] = useState<string>(() => {
    return localStorage.getItem('varzea_current_clube_id') || 't-1';
  });

  // Persisted contact registry for CRM and details
  const [contatos, setContatos] = useState<Contato[]>(() => {
    const saved = localStorage.getItem('varzea_contatos');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return [
      { id: 'c-1', entityId: 'u-1', entityType: 'usuario', nome: 'Luiz Prates', tipo: 'whatsapp', valor: '(11) 98888-1234', descricao: 'Presidente torcedor' },
      { id: 'c-2', entityId: 'u-1', entityType: 'usuario', nome: 'Sócio Financeiro', tipo: 'email', valor: 'lsp.prates@gmail.com', descricao: 'Faturamento de apoio' },
      { id: 'c-3', entityId: 't-1', entityType: 'clube', nome: 'Diretoria de Esportes', tipo: 'whatsapp', valor: '(11) 97777-1111', descricao: 'Agendar jogos e amistosos' },
      { id: 'c-4', entityId: 't-1', entityType: 'clube', nome: 'Instagram Oficial', tipo: 'instagram', valor: '@laranjamecanicazl', descricao: 'Postagens e transmissões' },
      { id: 'c-5', entityId: 'e-1', entityType: 'empresa', nome: 'Bar do Bigode & Gool de Placa', tipo: 'whatsapp', valor: '(11) 98888-1234', descricao: 'Reservas do buffet' },
      { id: 'c-6', entityId: 'e-1', entityType: 'empresa', nome: 'Administração', tipo: 'email', valor: 'contato@bardobigode.com', descricao: 'Parcerias' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('varzea_current_user_id', currentUserId);
  }, [currentUserId]);

  useEffect(() => {
    localStorage.setItem('varzea_current_empresa_id', currentEmpresaId);
  }, [currentEmpresaId]);

  useEffect(() => {
    localStorage.setItem('varzea_current_clube_id', currentTimeId);
  }, [currentTimeId]);

  useEffect(() => {
    localStorage.setItem('varzea_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  useEffect(() => {
    localStorage.setItem('varzea_contatos', JSON.stringify(contatos));
  }, [contatos]);

  // Database States loaded from Supabase
  const [times, setTimes] = useState<Time[]>([]);
  const [empresas, setEmpresas] = useState<Empresa[]>([]);
  const [categorias] = useState<Categoria[]>(PREMIUM_CATEGORIES);
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [comprovantes, setComprovantes] = useState<Comprovante[]>([]);
  const [copas, setCopas] = useState<Copa[]>([]);
  const [videos, setVideos] = useState<MidiaVideo[]>([]);
  const [notifications, setNotifications] = useState<Notificacao[]>([]);

  // Diagnostics and live websocket states
  const [isSupabaseLive, setIsSupabaseLive] = useState(false);
  const [connectionsCount, setConnectionsCount] = useState(38); // Simulated concurrent fans online
  const [diagnosticStatus, setDiagnosticStatus] = useState<TableStatus>({
    times: false, empresas: false, usuarios: false, comprovantes: false,
    ranking: false, financeiro: false, notificacoes: false, copas: false,
    videos: false
  });
  const [diagnosticErrors, setDiagnosticErrors] = useState<Record<string, string>>({});

  // Dynamic connected sheets states
  const [selectedEmpresaSheet, setSelectedEmpresaSheet] = useState<Empresa | null>(null);
  const [selectedClubeSheet, setSelectedClubeSheet] = useState<Time | null>(null);
  const [selectedUsuarioSheet, setSelectedUsuarioSheet] = useState<Usuario | null>(null);
  const [selectedHomeCategory, setSelectedHomeCategory] = useState<string>('Todos');
  const [selectedHomeSubcategory, setSelectedHomeSubcategory] = useState<string>('Todos');
  const [homeVideoPlaying, setHomeVideoPlaying] = useState<MidiaVideo | null>(null);

  // Floating notifications/drawers
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [threeDotsMenuOpen, setThreeDotsMenuOpen] = useState(false);
  const [rankingSegment, setRankingSegment] = useState<'times' | 'empresas' | 'usuarios'>('times');
  const [activeToasts, setActiveToasts] = useState<ToastType[]>([]);

  // Category selection for Mercado shopping area
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Search state variables for different sections
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [partnersSearchQuery, setPartnersSearchQuery] = useState('');

  // Helper trigger to append floating notification toasts
  const triggerVisualToast = (toast: ToastType) => {
    setActiveToasts(prev => [toast, ...prev].slice(0, 3)); // caps to max 3 simultaneous alerts
    
    // Auto erase toast
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4500);
  };

  const hydrateDatabase = async () => {
    // 1. Run physical availability check for tables on client credentials
    const check = await checkTablesAvailability();
    setDiagnosticStatus(check.status);
    setDiagnosticErrors(check.errors);

    // Determine if we are live (if at least times was read cleanly)
    const anyAvailable = Object.values(check.status).some(v => v === true);
    setIsSupabaseLive(anyAvailable);

    // 2. Fetch records
    const timeData = await DataService.getTimes();
    const empData = await DataService.getEmpresas();
    const usrData = await DataService.getUsuarios();
    const compData = await DataService.getComprovantes();
    const copData = await DataService.getCopas();
    const notData = await DataService.getNotificacoes();
    const catData = await DataService.getCategorias();
    const videoData = await DataService.getVideos();
    
    setTimes(timeData);
    setEmpresas(empData);
    setUsuarios(usrData);
    setComprovantes(compData);
    setCopas(copData);
    setNotifications(notData);
    setVideos(videoData);
  };

  // Trigger loading & hydration sequentially on boot
  useEffect(() => {
    hydrateDatabase();

    // Setup active real-time postgres websocket channel bindings
    const unsubscribe = DataService.subscribeToAllUpdates((payload) => {
      triggerVisualToast({
        id: `realtime-${Date.now()}`,
        message: '🔴 SINC_SUPABASE: Transição capturada via Realtime!',
        sub: `Nova entrada na tabela: [${payload.table}]`,
        iconType: 'database'
      });
      // Re-hydrate the state to show the updated list immediately
      hydrateDatabase();
    });

    // Subtly simulate fluctuating fans count (for the "Torcida Viva" feeling)
    const onlineInterval = setInterval(() => {
      setConnectionsCount(prev => Math.max(12, prev + (Math.random() > 0.5 ? 1 : -1)));
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(onlineInterval);
    };
  }, []);

  // Direct proof upload submissions
  const handleUploadReceipt = async (proof: Omit<Comprovante, 'id' | 'created_at'>) => {
    // Save record with Supabase
    const saved = await DataService.insertComprovante(proof);
    
    // Append to our active react state listing
    setComprovantes(prev => [saved, ...prev]);

    // Credit Points to Active default User 'Luiz Prates'
    setUsuarios(prev => prev.map(u => {
      if (u.id === 'u-1') {
        const nextPoints = u.saldo_pontos + proof.pontos_gerados;
        return {
          ...u,
          saldo_pontos: nextPoints
        };
      }
      return u;
    }));

    // Trigger instant toast notification
    triggerVisualToast({
      id: `proof-${Date.now()}`,
      message: '💰 COMPROVANTE ENVIADO!',
      sub: `Crédito de +${proof.pontos_gerados} pontos lançado p/ você e comissão p/ ${proof.time_nome}!`,
      iconType: 'financeiro'
    });

    // Also inject notification inside live notifications drawer
    const newNotif: Notificacao = {
      id: `notif-${Date.now()}`,
      titulo: '💰 COMPROVANTE SUBMETIDO!',
      mensagem: `Você recebeu +${proof.pontos_gerados} pontos e arrecadou R$ ${proof.comissao_clube_gerado.toFixed(2)} para o ${proof.time_nome}!`,
      tipo: 'financeiro',
      lida: false,
      created_at: new Date().toISOString()
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Status updates for vouchers via corporate Review list
  const handleReviewComprovanteByEmployer = (id: string, status: 'aprovado' | 'rejeitado') => {
    setComprovantes(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, status };
      }
      return c;
    }));

    triggerVisualToast({
      id: `review-${id}`,
      message: status === 'aprovado' ? '✅ COMPROVANTE CONFIRMADO!' : '❌ COMPROVANTE REJEITADO',
      sub: status === 'aprovado' ? 'O caixa da empresa homologou os pontos e apoio ao time.' : 'Fora das diretrizes ou duplicado.',
      iconType: 'comprovante'
    });
  };

  // Claims coupon reels vertical tiktok slide
  const handleClaimCouponFromReels = (couponCode: string, discount: string) => {
    // Inject reward points & add dynamic notification
    setUsuarios(prev => prev.map(u => {
      if (u.id === 'u-1') {
        return { ...u, saldo_pontos: u.saldo_pontos + 500 }; // 500 gift points!
      }
      return u;
    }));

    triggerVisualToast({
      id: `coupon-${Date.now()}`,
      message: '🔥 NOVO CUPOM RESGATADO!',
      sub: `Código [${couponCode}] ativo! Você faturou +500 pontos de torcida grátis!`,
      iconType: 'promocao'
    });

    setNotifications(prev => [
      {
        id: `notif-${Date.now()}`,
        titulo: `🎟️ CUPOM ${couponCode} ATIVADO!`,
        mensagem: `Parabéns! Você resgatou a oferta (${discount}) e gerou 500 pontos promocionais.`,
        tipo: 'promocao',
        lida: false,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const simulateLiveGoalMatch = () => {
    // 1. Randomly update scoreboard matching em_andamento
    setCopas(prev => prev.map(c => {
      if (c.status === 'em_andamento' && c.jogos_atrativos) {
        return {
          ...c,
          jogos_atrativos: c.jogos_atrativos.map(game => {
            if (game.id === 'g-1') {
              const currentScore = game.score1 || 0;
              return { ...game, score1: currentScore + 1, tempo: 'Prorrogação (ST)' };
            }
            return game;
          })
        };
      }
      return c;
    }));

    // 2. Add beautiful stadium audio event warning
    triggerVisualToast({
      id: `live-goal-${Date.now()}`,
      message: '⚽ GOOOOOOL NA VÁRZEA!',
      sub: 'Laranja Mecânica de Itaquera amplia o placar para 3 x 1!',
      iconType: 'gols'
    });

    // 3. Inject notification
    setNotifications(prev => [
      {
        id: `notif-goal-${Date.now()}`,
        titulo: '⚽ GOL DO LARANJA MECÂNICA!',
        mensagem: 'Cleitinho acertou um balaço direto no ângulo! Torcida inflamada no terrão central sintonizada realtime!',
        tipo: 'gols',
        lida: false,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const simulateTransactionPulse = () => {
    // Generates a mock direct credit transaction
    setUsuarios(prev => prev.map(u => {
      if (u.id === 'u-1') {
        return {
          ...u,
          saldo_pontos: u.saldo_pontos + 250
        };
      }
      return u;
    }));

    triggerVisualToast({
      id: `simulate-tx-${Date.now()}`,
      message: '💰 NOVO BÔNUS DE LEALDADE!',
      sub: 'Crédito espontâneo de +250 pontos por indicação de amigos!',
      iconType: 'financeiro'
    });

    setNotifications(prev => [
      {
        id: `notif-tx-${Date.now()}`,
        titulo: '🎁 BÔNUS DE LEALDADE!',
        mensagem: 'Foram adicionados 250 pontos de apoio na sua carteira digital por trazer novos torcedores.',
        tipo: 'financeiro',
        lida: false,
        created_at: new Date().toISOString()
      },
      ...prev
    ]);
  };

  const simulatePendingReceiptInjection = () => {
    const randomUser = ['Neymar dos Santos', 'Thiago Mota Várzea', 'Aline Santos Quebrada'][Math.floor(Math.random() * 3)];
    const randomValue = Math.floor(25 + Math.random() * 200);
    const mockPendingId = `comp-p-${Math.floor(Math.random() * 9000)}`;

    const newPending: Comprovante = {
      id: mockPendingId,
      usuario_id: 'u-2',
      empresa_id: 'e-1', // Bar do Bigode
      time_id: 't-1',
      valor: randomValue,
      data_compra: new Date().toISOString(),
      status: 'pendente',
      chave_nfe: '3526051775614228' + Math.floor(1000 + Math.random() * 9000),
      pontos_gerados: randomValue * 10,
      cashback_gerado: Number((randomValue * 0.08).toFixed(2)),
      comissao_clube_gerado: Number((randomValue * 0.05).toFixed(2)),
      usuario_nome: randomUser,
      empresa_nome: 'Bar do Bigode & Gool de Placa',
      time_nome: 'Laranja Mecânica da Zona Leste'
    };

    setComprovantes(prev => [newPending, ...prev]);

    triggerVisualToast({
      id: `simulate-proof-${Date.now()}`,
      message: '📂 NOVA FISCAL ENVIADA!',
      sub: `${randomUser} enviou R$ ${randomValue.toFixed(2)} para auditoria do Bar do Bigode.`,
      iconType: 'comprovante'
    });
  };

  const handleResetDatabaseToMock = () => {
    setComprovantes([]);
    hydrateDatabase();
    triggerVisualToast({
      id: `reset-${Date.now()}`,
      message: '♻️ BD REINICIADO',
      sub: 'Os cupons locais da sessão foram restaurados para o mock inicial.',
      iconType: 'sistema'
    });
  };

  const handleAddContato = (nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => {
    const generatedId = `c-dyn-${Date.now()}`;
    const newContato: Contato = {
      id: generatedId,
      entityId: activePersona === 'usuario' ? currentUserId : (activePersona === 'empresa' ? currentEmpresaId : currentTimeId),
      entityType: activePersona === 'usuario' ? 'usuario' : (activePersona === 'empresa' ? 'empresa' : 'clube'),
      nome,
      tipo,
      valor,
      descricao
    };
    setContatos(prev => [...prev, newContato]);
    triggerVisualToast({
      id: `cont-add-${Date.now()}`,
      message: '📞 CONTATO E MENSAGEM ADICIONADO!',
      sub: `Visualização de "${nome}" atualizada nos cadastros.`,
      iconType: 'sistema'
    });
  };

  const handleUpdateContato = (id: string, nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => {
    setContatos(prev => prev.map(c => {
      if (c.id === id) {
        return { ...c, nome, tipo, valor, descricao };
      }
      return c;
    }));
    triggerVisualToast({
      id: `cont-upd-${id}`,
      message: '📝 CONTATO REFORMULADO!',
      sub: `Sincronia realizada para o registro "${nome}".`,
      iconType: 'sistema'
    });
  };

  const handleDeleteContato = (id: string) => {
    setContatos(prev => prev.filter(c => c.id !== id));
    triggerVisualToast({
      id: `cont-del-${id}`,
      message: '🗑️ CONTATO APAGADO',
      sub: 'O registro foi removido com sucesso.',
      iconType: 'sistema'
    });
  };

  const handleLogin = (role: 'usuario' | 'empresa' | 'clube', id: string) => {
    if (role === 'usuario') {
      setCurrentUserId(id);
      setActivePersona('usuario');
    } else if (role === 'empresa') {
      setCurrentEmpresaId(id);
      setActivePersona('empresa');
    } else if (role === 'clube') {
      setCurrentTimeId(id);
      setActivePersona('clube');
    }
    setIsLoggedIn(true);
    triggerVisualToast({
      id: `login-${Date.now()}`,
      message: '🔓 LOGIN REALIZADO!',
      sub: `Bem-vindo de volta! Seu painel foi sincronizado com sucesso.`,
      iconType: 'sistema'
    });
  };

  const handleRegister = async (role: 'usuario' | 'empresa' | 'clube', data: any) => {
    const generatedId = `${role === 'usuario' ? 'u' : (role === 'empresa' ? 'e' : 't')}-dyn-${Date.now()}`;
    
    // Auto add a contact from registration input
    const initialContact: Contato = {
      id: `c-init-${Date.now()}`,
      entityId: generatedId,
      entityType: role,
      nome: role === 'usuario' ? 'WhatsApp Pessoal' : 'WhatsApp Comercial',
      tipo: 'whatsapp',
      valor: data.telefone || '(11) 99999-0000',
      descricao: 'Contato informado no cadastro'
    };
    
    if (role === 'usuario') {
      const newUser: Usuario = {
        id: generatedId,
        nome: data.nome,
        email: data.email,
        avatar_url: data.avatar_url,
        time_coracao_id: data.time_coracao_id,
        saldo_cashback: 0,
        saldo_pontos: 1500, // starting credit as bonus registration!
        nivel: 1
      };
      setUsuarios(prev => [...prev, newUser]);
      setCurrentUserId(generatedId);
      setActivePersona('usuario');

      // Sync user insert with Supabase database table
      try {
        await supabase.from('usuarios').insert([{
          id: generatedId,
          nome: data.nome,
          email: data.email,
          avatar_url: data.avatar_url,
          foto_url: data.foto_url || data.avatar_url,
          time_coracao_id: data.time_coracao_id,
          saldo_cashback: 0,
          saldo_pontos: 1500,
          nivel: 1,
          telefone: data.telefone,
          cidade: data.cidade,
          senha: data.senha
        }]);
      } catch (err) {
        console.error('Failed to sync new user to Supabase:', err);
      }

    } else if (role === 'empresa') {
      const newEmp: Empresa = {
        id: generatedId,
        nome: data.nome,
        categoria: data.categoria,
        endereco: data.endereco,
        bairro: data.bairro,
        telefone: data.telefone,
        logo: data.logo,
        banner: data.banner,
        descricao: data.descricao,
        score: data.score,
        pontos_por_real: data.pontos_por_real,
        cashback_porcentagem: 5
      };
      setEmpresas(prev => [...prev, newEmp]);
      setCurrentEmpresaId(generatedId);
      setActivePersona('empresa');

      // Sync company insert with Supabase database table
      try {
        await supabase.from('empresas').insert([{
          id: generatedId,
          nome: data.nome,
          categoria: data.categoria,
          endereco: data.endereco,
          bairro: data.bairro,
          telefone: data.telefone,
          logo: data.logo,
          logo_url: data.logo_url || data.logo,
          banner: data.banner,
          descricao: data.descricao,
          score: data.score,
          pontos_por_real: data.pontos_por_real,
          cashback_porcentagem: 5
        }]);
      } catch (err) {
        console.error('Failed to sync new company to Supabase:', err);
      }

    } else if (role === 'clube') {
      const newTime: Time = {
        id: generatedId,
        nome: data.nome,
        sigla: data.sigla,
        estadio: data.estadio,
        bairro: data.bairro,
        logo: data.logo,
        cores: data.cores,
        fundacao: data.fundacao,
        membros_count: data.membros_count,
        pontos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols_pro: 0,
        gols_contra: 0,
        saldo_gols: 0
      };
      setTimes(prev => [...prev, newTime]);
      setCurrentTimeId(generatedId);
      setActivePersona('clube');

      // Sync club insert with Supabase database table
      try {
        await supabase.from('times').insert([{
          id: generatedId,
          nome: data.nome,
          sigla: data.sigla,
          estadio: data.estadio,
          bairro: data.bairro,
          logo: data.logo,
          logo_url: data.logo_url || data.logo,
          cores: data.cores,
          fundacao: data.fundacao,
          membros_count: data.membros_count,
          pontos: 0,
          vitorias: 0,
          empates: 0,
          derrotas: 0,
          gols_pro: 0,
          gols_contra: 0,
          saldo_gols: 0
        }]);
      } catch (err) {
        console.error('Failed to sync new club to Supabase:', err);
      }
    }

    setContatos(prev => [initialContact, ...prev]);
    setIsLoggedIn(true);
    triggerVisualToast({
      id: `register-${Date.now()}`,
      message: '✨ CONTA CRIADA COM SUCESSO!',
      sub: `Sua conta e contato inicial foram ativados no ecossistema da Várzea!`,
      iconType: 'sistema'
    });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    triggerVisualToast({
      id: `logout-${Date.now()}`,
      message: '🔒 SESSÃO ENCERRADA',
      sub: 'Você saiu da sua conta local. Faça login para gerenciar seus dados.',
      iconType: 'sistema'
    });
  };

  const handleAddEmpresaLocal = async (newEmpData: any) => {
    const generatedId = `e-dyn-${Date.now()}`;
    const formatted: Empresa = {
      id: generatedId,
      ...newEmpData
    };
    setEmpresas(prev => [...prev, formatted]);
    triggerVisualToast({
      id: `emp-reg-${Date.now()}`,
      message: '🏪 EMPRESA CADASTRADA!',
      sub: `Sua empresa "${newEmpData.nome}" foi pré-registrada e o link do WhatsApp gerado.`,
      iconType: 'sistema'
    });

    // Sync to Supabase
    try {
      await supabase.from('empresas').insert([{
        id: generatedId,
        nome: formatted.nome,
        categoria: formatted.categoria,
        endereco: formatted.endereco,
        bairro: formatted.bairro,
        telefone: formatted.telefone,
        logo: formatted.logo,
        logo_url: formatted.logo_url || formatted.logo,
        banner: formatted.banner,
        descricao: formatted.descricao,
        score: formatted.score,
        pontos_por_real: formatted.pontos_por_real,
        cashback_porcentagem: formatted.cashback_porcentagem
      }]);
    } catch (err) {
      console.error('Failed to write company to Supabase:', err);
    }
  };

  const handleAddClubeLocal = async (newClubData: any) => {
    const generatedId = `t-dyn-${Date.now()}`;
    const formatted: Time = {
      id: generatedId,
      ...newClubData,
      pontos: 0,
      vitorias: 0,
      empates: 0,
      derrotas: 0,
      gols_pro: 0,
      gols_contra: 0,
      saldo_gols: 0
    };
    setTimes(prev => [...prev, formatted]);
    triggerVisualToast({
      id: `clube-reg-${Date.now()}`,
      message: '⚽ CLUBE CADASTRADO!',
      sub: `Seu clube "${newClubData.nome}" foi pré-registrado e o link do WhatsApp gerado.`,
      iconType: 'sistema'
    });

    // Sync to Supabase
    try {
      await supabase.from('times').insert([{
        id: generatedId,
        nome: formatted.nome,
        sigla: formatted.sigla,
        estadio: formatted.estadio,
        bairro: formatted.bairro,
        logo: formatted.logo,
        logo_url: formatted.logo_url || formatted.logo,
        cores: formatted.cores,
        fundacao: formatted.fundacao,
        membros_count: formatted.membros_count,
        pontos: 0,
        vitorias: 0,
        empates: 0,
        derrotas: 0,
        gols_pro: 0,
        gols_contra: 0,
        saldo_gols: 0
      }]);
    } catch (err) {
      console.error('Failed to write club to Supabase:', err);
    }
  };

  // Dynamic values
  const activeUser = useMemo(() => {
    return usuarios.find(u => u.id === currentUserId) || usuarios[0] || {
      id: 'u-1',
      nome: 'Luiz Prates (Você)',
      email: 'lsp.prates@gmail.com',
      avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
      time_coracao_id: 't-1',
      saldo_cashback: 142.50,
      saldo_pontos: 12450,
      ranking_posicao: 4,
      nivel: 6
    };
  }, [usuarios, currentUserId]);

  const getUserTierLabel = (lvl: number) => {
    if (lvl >= 8) return 'Cria Profissional / Major';
    if (lvl >= 5) return 'Apoiador do Terrão Centenário';
    return 'Recruta do Alambrado';
  };

  // Categories grid lookup helpers
  const categoriesList = useMemo(() => {
    const existing = new Set<string>();
    const legacy = ['Bares e Lanches', 'Beleza e Estilo', 'Mercados e Padarias', 'Saúde e Fitness'];
    legacy.forEach(l => existing.add(l));
    
    categorias.forEach(c => {
      if (c.nome) {
        existing.add(c.nome);
      }
    });

    empresas.forEach(e => {
      if (e.categoria) {
        existing.add(e.categoria);
      }
    });

    return ['Todos', ...Array.from(existing)];
  }, [empresas, categorias]);

  const filteredEmpresas = useMemo(() => {
    let result = selectedCategory === 'Todos' 
      ? empresas 
      : empresas.filter(e => e.categoria === selectedCategory);

    if (partnersSearchQuery.trim()) {
      const q = partnersSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      result = result.filter(e => {
        const name = (e.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const cat = (e.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const neighborhood = (e.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const address = (e.endereco || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        return name.includes(q) || cat.includes(q) || neighborhood.includes(q) || address.includes(q);
      });
    }
    return result;
  }, [empresas, selectedCategory, partnersSearchQuery]);

  return (
    <VarzeaContext.Provider value={{
      cadastroEmpresaOpen, setCadastroEmpresaOpen,
      cadastroClubeOpen, setCadastroClubeOpen,
      splashActive, setSplashActive,
      showLandingPage, setShowLandingPage,
      loginScreenMode, setLoginScreenMode,
      activeTab, setActiveTab,
      activePersona, setActivePersona,
      
      isLoggedIn, setIsLoggedIn,
      currentUserId, setCurrentUserId,
      currentEmpresaId, setCurrentEmpresaId,
      currentTimeId, setCurrentTimeId,
      activeUser,
      getUserTierLabel,

      times, setTimes,
      empresas, setEmpresas,
      categorias,
      usuarios, setUsuarios,
      comprovantes, setComprovantes,
      copas, setCopas,
      videos, setVideos,
      notifications, setNotifications,
      
      contatos, setContatos,
      isSupabaseLive,
      connectionsCount,
      diagnosticStatus,
      diagnosticErrors,

      selectedEmpresaSheet, setSelectedEmpresaSheet,
      selectedClubeSheet, setSelectedClubeSheet,
      selectedUsuarioSheet, setSelectedUsuarioSheet,
      selectedHomeCategory, setSelectedHomeCategory,
      selectedHomeSubcategory, setSelectedHomeSubcategory,
      homeVideoPlaying, setHomeVideoPlaying,

      notificationsOpen, setNotificationsOpen,
      uploadModalOpen, setUploadModalOpen,
      threeDotsMenuOpen, setThreeDotsMenuOpen,
      rankingSegment, setRankingSegment,
      activeToasts, setActiveToasts,

      selectedCategory, setSelectedCategory,
      homeSearchQuery, setHomeSearchQuery,
      partnersSearchQuery, setPartnersSearchQuery,

      categoriesList,
      filteredEmpresas,

      triggerVisualToast,
      hydrateDatabase,
      handleUploadReceipt,
      handleReviewComprovanteByEmployer,
      handleClaimCouponFromReels,
      simulateLiveGoalMatch,
      simulateTransactionPulse,
      simulatePendingReceiptInjection,
      handleResetDatabaseToMock,
      handleAddContato,
      handleUpdateContato,
      handleDeleteContato,
      handleLogin,
      handleRegister,
      handleLogout,
      handleAddEmpresaLocal,
      handleAddClubeLocal
    }}>
      {children}
    </VarzeaContext.Provider>
  );
};

export const useVarzea = () => {
  const context = useContext(VarzeaContext);
  if (!context) {
    throw new Error('useVarzea must be used within a VarzeaProvider');
  }
  return context;
};
