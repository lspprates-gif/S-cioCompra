import { useEffect, useState, useMemo } from 'react';
import { 
  Home as HomeIcon, ShoppingBag, Radio, Trophy, User, Bell, ChevronLeft, 
  MapPin, Plus, Sparkles, Smartphone, ShieldCheck, Flame, Coins, ShieldAlert,
  Volume2, Shield, X, Wrench, MessageCircle, Heart, Share2, Play, Pause, ExternalLink,
  LogOut, ListCollapse, Building, MoreVertical, Users, FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Data services and Supabase clients
import { DataService, PREMIUM_CATEGORIES } from './dataService';
import { checkTablesAvailability, TableStatus, supabase } from './supabaseClient';
import { Time, Empresa, Usuario, Comprovante, Copa, Notificacao, MidiaVideo, Categoria } from './types';

// Component layout imports
import SplashScreen from './components/SplashScreen';
import LandingPage from './components/LandingPage';
import VideoFeed from './components/VideoFeed';
import RankingList from './components/RankingList';
import UploadReceiptModal from './components/UploadReceiptModal';
import AdminPanel from './components/AdminPanel';
import { DashboardEmpresa, DashboardClube, DashboardUsuario } from './components/Dashboards';
import LoginScreen from './components/LoginScreen';
import ContactsManager, { Contato } from './components/ContactsManager';
import CadastroEmpresaModal from './components/CadastroEmpresaModal';
import CadastroClubeModal from './components/CadastroClubeModal';

export default function App() {
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
  const [categorias, setCategorias] = useState<Categoria[]>(PREMIUM_CATEGORIES);
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
  const [activeToasts, setActiveToasts] = useState<Array<{ id: string; message: string; sub?: string; iconType?: string }>>([]);

  // Category selection for Mercado shopping area
  const [selectedCategory, setSelectedCategory] = useState('Todos');

  // Search state variables for different sections
  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [partnersSearchQuery, setPartnersSearchQuery] = useState('');

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
    setCategorias(catData);
    setUsuarios(usrData);
    setComprovantes(compData);
    setCopas(copData);
    setNotifications(notData);
    setVideos(videoData);
  };

  // Helper trigger to append floating notification toasts
  const triggerVisualToast = (toast: { id: string; message: string; sub?: string; iconType?: string }) => {
    setActiveToasts(prev => [toast, ...prev].slice(0, 3)); // caps to max 3 simultaneous alerts
    
    // Auto erase toast
    setTimeout(() => {
      setActiveToasts(prev => prev.filter(t => t.id !== toast.id));
    }, 4500);
  };

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

  // ==========================================
  // REAL-TIME ACTIONS SIMULATIONS (ADMIN CENTER)
  // ==========================================

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

  // Categories grid lookup helpers
  const categoriesList = useMemo(() => {
    const existing = new Set<string>();
    // Pre-populate with legacy names to keep order clean
    const legacy = ['Bares e Lanches', 'Beleza e Estilo', 'Mercados e Padarias', 'Saúde e Fitness'];
    legacy.forEach(l => existing.add(l));
    
    // Add all of the premium category names
    categorias.forEach(c => {
      if (c.nome) {
        existing.add(c.nome);
      }
    });

    // Collect all other distinct category names from current actual database/mock empresas state
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

  const activeUser = usuarios.find(u => u.id === currentUserId) || usuarios[0] || {
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

  // Contact CRUD functions
  const handleAddContato = (nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => {
    const activeId = activePersona === 'usuario' ? currentUserId : (activePersona === 'empresa' ? currentEmpresaId : currentTimeId);
    const newContato: Contato = {
      id: `c-dyn-${Date.now()}`,
      entityId: activeId,
      entityType: (activePersona === 'clube' ? 'clube' : activePersona) as 'usuario' | 'empresa' | 'clube',
      nome,
      tipo,
      valor,
      descricao
    };
    setContatos(prev => [newContato, ...prev]);
    triggerVisualToast({
      id: `add-contact-${Date.now()}`,
      message: '📞 CONTATO REGISTRADO!',
      sub: `Contato "${nome}" foi associado ao seu perfil local.`,
      iconType: 'sistema'
    });
  };

  const handleUpdateContato = (id: string, nome: string, tipo: 'whatsapp' | 'telefone' | 'instagram' | 'email' | 'outro', valor: string, descricao?: string) => {
    setContatos(prev => prev.map(c => c.id === id ? { ...c, nome, tipo, valor, descricao } : c));
    triggerVisualToast({
      id: `update-contact-${Date.now()}`,
      message: '📞 CONTATO SALVO!',
      sub: `Contato "${nome}" foi atualizado com sucesso.`,
      iconType: 'sistema'
    });
  };

  const handleDeleteContato = (id: string) => {
    const matched = contatos.find(c => c.id === id);
    setContatos(prev => prev.filter(c => c.id !== id));
    triggerVisualToast({
      id: `delete-contact-${Date.now()}`,
      message: '🗑️ CONTATO DELETADO',
      sub: matched ? `Contato "${matched.nome}" foi removido do perfil.` : 'Contato removido.',
      iconType: 'sistema'
    });
  };

  // Auth Operations
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

  // Dynamic user tier title string based on points/levels
  const getUserTierLabel = (lvl: number) => {
    if (lvl >= 8) return 'Cria Profissional / Major';
    if (lvl >= 5) return 'Apoiador do Terrão Centenário';
    return 'Recruta do Alambrado';
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center font-sans relative antialiased">
      
      {/* Absolute Dynamic Canvas Toasts Alert Area */}
      <div className="fixed top-4 z-[99] max-w-xs w-full px-4 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {activeToasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 rounded-xl shadow-2xl pointer-events-auto border flex items-start gap-3 bg-black/95 text-left font-display z-50 orange-glow border-[#FF5500]/40"
            >
              {/* Animated Goal ball, Cash coin or alert bullet */}
              <div className="flex-shrink-0 bg-gradient-to-r from-[#FF5500] to-[#FFD700] text-black p-2 rounded-lg font-bold animate-pulse">
                {t.iconType === 'gols' ? '⚽' : t.iconType === 'financeiro' ? '💰' : '🔔'}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-extrabold text-white tracking-tight uppercase leading-snug">
                  {t.message}
                </p>
                <p className="text-[10px] text-zinc-400 mt-0.5 leading-normal font-sans">
                  {t.sub}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* 1. CINEMATIC SPLASH SCREEN (Fades away automatically) */}
      <AnimatePresence>
        {splashActive && (
          <SplashScreen 
            onDismiss={() => setSplashActive(false)} 
            isSupabaseLive={isSupabaseLive} 
          />
        )}
      </AnimatePresence>

      {/* 2. DYNAMIC PREMIUM VISUAL LANDING PAGE AREA */}
      {showLandingPage && !splashActive && (
        <LandingPage 
          onEnterApp={() => {
            setLoginScreenMode('login');
            setShowLandingPage(false);
            triggerVisualToast({
              id: `welcome-${Date.now()}`,
              message: '⚡ APRESENTAR CONTA!',
              sub: 'Insira seus dados ou faça login rápido.',
              iconType: 'sistema'
            });
          }} 
          onCriaConta={() => {
            setLoginScreenMode('register');
            setShowLandingPage(false);
            triggerVisualToast({
              id: `create-acct-${Date.now()}`,
              message: '📝 CRIAR CONTA!',
              sub: 'Crie sua ficha de sócio torcedor corporativo.',
              iconType: 'sistema'
            });
          }}
          onCadastrarEmpresa={() => {
            setCadastroEmpresaOpen(true);
          }}
          onCadastrarClube={() => {
            setCadastroClubeOpen(true);
          }}
          isSupabaseLive={isSupabaseLive}
        />
      )}

      {/* 3. CORE INTERACTIVE CONTAINER WITH LOGIN SCREEN OVERLAY */}
      {!showLandingPage && !splashActive && !isLoggedIn && (
        <div className="w-full min-h-screen flex items-center justify-center bg-[#050505] px-4 self-center py-8">
          <LoginScreen 
            times={times}
            empresas={empresas}
            usuarios={usuarios}
            onLogin={handleLogin}
            onRegister={handleRegister}
            triggerToast={triggerVisualToast}
            initialScreenMode={loginScreenMode}
          />
        </div>
      )}

      {/* 4. CORE INTERACTIVE SHELL WITH RESPONSIVE ADAPTATION */}
      {!showLandingPage && !splashActive && isLoggedIn && (
        <div className="w-full h-screen md:h-[92vh] md:max-w-6xl md:my-4 bg-[#050505] md:rounded-[36px] md:border-8 md:border-[#1A1A1E] md:shadow-2xl md:orange-glow relative flex flex-col md:flex-row overflow-hidden">
          
          {/* DESKTOP SIDEBAR MENU */}
          <div className="hidden md:flex flex-col w-68 bg-[#08080A] border-r border-zinc-900 p-5 justify-between flex-shrink-0 select-none relative z-20 text-left">
            <div className="space-y-6">
              {/* Brand Header */}
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#FF5500] to-[#FFD700] p-[1.5px] flex items-center justify-center">
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                    <Trophy className="w-4 h-4 text-[#FF5500]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-xs font-black text-white tracking-tight uppercase leading-none font-display">
                    FUTEBOL DE <span className="text-[#FF5500]">VÁRZEA</span>
                  </h1>
                </div>
              </div>

              {/* Logged profile Summary card */}
              <div className="p-3.5 bg-black border border-zinc-900 rounded-2xl space-y-3 text-left">
                <div className="flex items-center gap-2.5">
                  <img 
                    src={activeUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                    alt={activeUser.nome} 
                    referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-full border border-[#FF5500]/50 object-cover flex-shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-[9px] text-[#FFD700] font-mono font-bold block leading-none">TORCEDOR SOCIO</span>
                    <h2 className="text-xs font-black text-white truncate max-w-[130px] font-display mt-1 leading-tight">
                      {activeUser.nome}
                    </h2>
                  </div>
                </div>

                <div className="h-[1px] bg-zinc-900" />

                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="p-1.5 bg-zinc-950 rounded-xl border border-zinc-900/60">
                    <span className="text-[8px] text-zinc-500 font-bold block uppercase leading-none">Pontos</span>
                    <span className="text-[10px] font-extrabold text-white font-mono block mt-1">{activeUser.saldo_pontos} pt</span>
                  </div>
                  <div className="p-1.5 bg-zinc-950 rounded-xl border border-zinc-900/60">
                    <span className="text-[8px] text-zinc-500 font-bold block uppercase leading-none">Nível</span>
                    <span className="text-[10px] font-extrabold text-[#FF5500] font-mono block mt-1">{activeUser.nivel}º</span>
                  </div>
                </div>
              </div>

              {/* Navigation Tabs */}
              <div className="space-y-1.5 pt-2">
                <span className="text-[9px] font-mono text-zinc-500 font-bold uppercase tracking-wider block px-2">Menu Principal</span>
                {[
                  { id: 'home', label: 'Início', icon: HomeIcon },
                  { id: 'parceiros', label: 'Empresas', icon: ShoppingBag },
                  { id: 'comprovante', label: 'Comprovante', icon: FileText, onClick: () => setUploadModalOpen(true) },
                  { id: 'reels', label: 'Várzea Reels', icon: Play },
                  { id: 'ranking', label: 'Ranking Geral', icon: ListCollapse },
                  { id: 'perfil', label: 'Meus Dados & Contatos', icon: User }
                ].map(tab => {
                  const IconComp = tab.icon;
                  const isActive = tab.onClick ? uploadModalOpen : activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        if (tab.onClick) {
                          tab.onClick();
                        } else {
                          setActiveTab(tab.id as any);
                        }
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer text-xs font-extrabold ${
                        isActive 
                          ? 'bg-[#FF5500] text-white shadow-md shadow-[#FF5500]/10' 
                          : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick action + Sign out */}
            <div className="space-y-2 mt-auto">
              {activePersona === 'usuario' && (
                <button
                  onClick={() => setUploadModalOpen(true)}
                  className="w-full py-2.5 bg-[#FF5500]/10 hover:bg-[#FF5500]/20 border border-[#FF5500]/30 hover:border-[#FF5500]/65 rounded-xl text-xs font-bold font-mono text-[#FF5500] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Enviar Cupom</span>
                </button>
              )}

              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 justify-center py-2.5 text-zinc-500 hover:text-red-400 text-xs font-mono font-bold hover:bg-red-500/5 hover:border-red-500/10 border border-transparent rounded-xl transition-all cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Mudar de Perfil / Sair</span>
              </button>
            </div>
          </div>

          {/* MAIN COLUMN VIEWPORT */}
          <div className="flex-1 flex flex-col overflow-hidden w-full h-full relative">
            
            {/* Smartphone details decor for mobile only (hidden on desktop) */}
            <div className="hidden sm:block md:hidden absolute top-0 inset-x-0 h-6 bg-black z-30 flex items-center justify-center rounded-t-[28px]">
              <div className="w-20 h-4 bg-[#121215] rounded-full border border-white/5 flex items-center justify-center">
                <div className="w-10 h-[3px] bg-zinc-800 rounded-full mr-2" />
                <div className="w-2.5 h-2.5 bg-zinc-900 rounded-full border border-zinc-950" />
              </div>
            </div>

            {/* Spacer for smartphone earbar on mobile only */}
            <div className="hidden sm:block md:hidden h-6 bg-black flex-shrink-0 z-20" />

            {/* Header Action bar containing user profile summary & alerts */}
            <div className="p-4 bg-black border-b border-zinc-900 flex justify-between items-center relative z-20">
              <div className="flex items-center gap-2.5 text-left">
                <img 
                  src={activeUser.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                  alt={activeUser.nome} 
                  referrerPolicy="no-referrer"
                  className="w-8.5 h-8.5 rounded-full border border-[#FF5500] object-cover flex-shrink-0"
                />
                <div className="min-w-0 text-left cursor-pointer" onClick={() => setActiveTab('perfil')}>
                  <span className="text-zinc-500 text-[9px] uppercase font-mono font-bold block leading-none">SÓCIO ATIVO</span>
                  <span className="text-xs font-black text-white truncate max-w-[120px] font-display mt-1 block">
                    {activeUser.nome}
                  </span>
                </div>
              </div>

              {/* Futebol de Várzea Badge Logo */}
              <div className="flex flex-col items-center select-none cursor-pointer" onClick={() => { setShowLandingPage(true); }}>
                <span className="text-sm font-extrabold font-display tracking-tight text-white uppercase sm:text-base leading-none">
                  FUTEBOL DE <span className="text-[#FF5500]">VÁRZEA</span>
                </span>
              </div>

              {/* 3-DOTS FLOATING MENU DROPDOWN (TOP-RIGHT CORNER - REPLACING ALERTS BELL 🔔) */}
              <div className="relative z-50">
                <button
                  onClick={() => setThreeDotsMenuOpen(!threeDotsMenuOpen)}
                  className="p-1.5 bg-zinc-950 border border-zinc-900 text-[#FF5500] hover:text-white hover:border-[#FF5500]/60 rounded-xl cursor-pointer transition-colors relative flex items-center justify-center"
                  title="Menu de Ferramentas"
                >
                  <MoreVertical className="w-5 h-5 text-[#FF5500]" />
                </button>

                <AnimatePresence>
                  {threeDotsMenuOpen && (
                    <>
                      <div className="fixed inset-0 z-40 bg-transparent" onClick={() => setThreeDotsMenuOpen(false)} />
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 5 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 5 }}
                        className="absolute right-0 mt-2.5 w-60 bg-[#0A0A0E] border border-zinc-850/90 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.95)] p-3 z-50 text-left font-display text-xs divide-y divide-zinc-900 overflow-hidden"
                      >
                        {/* CADASTROS */}
                        <div className="pb-2.5 space-y-1">
                          <span className="px-2.5 text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block mb-1.5">Acesso de Parceiros</span>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setCadastroClubeOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#FFD700]/10 text-zinc-200 hover:text-white rounded-xl transition-all font-bold text-[11px]"
                          >
                            <Shield className="w-4 h-4 text-yellow-400" />
                            <span>Cadastrar Time</span>
                          </button>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setCadastroEmpresaOpen(true);
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-[#FF5500]/10 text-zinc-200 hover:text-white rounded-xl transition-all font-bold text-[11px]"
                          >
                            <Building className="w-4 h-4 text-[#FF5500]" />
                            <span>Cadastrar Empresa</span>
                          </button>
                        </div>

                        {/* RANKINGS */}
                        <div className="pt-2.5 space-y-1">
                          <span className="px-2.5 text-[8px] uppercase tracking-wider text-zinc-500 font-mono font-bold block mb-1.5">Classificação Várzea</span>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setRankingSegment('times');
                              setActiveTab('ranking');
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-yellow-500/10 text-zinc-200 hover:text-white rounded-xl transition-all text-[11px]"
                          >
                            <Trophy className="w-3.5 h-3.5 text-yellow-400" />
                            <span>Ranking Clubes / Times</span>
                          </button>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setRankingSegment('usuarios');
                              setActiveTab('ranking');
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-orange-500/10 text-zinc-200 hover:text-white rounded-xl transition-all text-[11px]"
                          >
                            <Users className="w-3.5 h-3.5 text-orange-400" />
                            <span>Ranking Usuários</span>
                          </button>
                          <button
                            onClick={() => {
                              setThreeDotsMenuOpen(false);
                              setRankingSegment('empresas');
                              setActiveTab('ranking');
                            }}
                            className="w-full flex items-center gap-2 px-2.5 py-2 hover:bg-blue-500/10 text-zinc-200 hover:text-white rounded-xl transition-all text-[11px]"
                          >
                            <ShoppingBag className="w-3.5 h-3.5 text-blue-400" />
                            <span>Ranking Empresas</span>
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </div>


          {/* ==========================================
              ACTIVE PANEL CONTENT DISPLAY SWITCH SCREEN
             ========================================== */}
          <div className="flex-1 overflow-hidden relative flex flex-col">
            
            {/* TAB 1: HOME PRINCIPAL (WIDGET MATRIX) */}
            {activeTab === 'home' && (
              <div className="flex-1 bg-[#050505] p-5 overflow-y-auto space-y-6 text-left font-sans no-scrollbar">
                
                {/* 1. TOPO DO APP - MODERN GIANT HERO ACCENT */}
                <div 
                  className="relative overflow-hidden rounded-3xl p-6 border border-[#FF5500]/20 shadow-[0_4px_30px_rgba(255,85,0,0.15)] flex flex-col items-center justify-center text-center bg-cover bg-center min-h-[190px]"
                  style={{ 
                    backgroundImage: `linear-gradient(to top, rgba(0, 0, 0, 0.95) 15%, rgba(0, 0, 0, 0.5) 65%, rgba(255, 85, 0, 0.2) 100%), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=600&auto=format&fit=crop')`
                  }}
                >
                  {/* Glowing light bars from turf stadium style */}
                  <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#FF5500]/50 to-transparent animate-pulse" />
                  
                  <motion.h1 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-6xl font-black font-display tracking-tight text-white uppercase text-orange-glow select-none leading-none drop-shadow-[0_2px_10px_rgba(255,85,0,0.6)]"
                  >
                    VÁRZEA
                  </motion.h1>

                  <p className="text-[11px] font-semibold text-zinc-300 max-w-[260px] leading-relaxed mt-2.5 font-display select-none">
                    Compre, fortaleça seu time e ajude sua comunidade.
                  </p>

                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setUploadModalOpen(true)}
                    className="mt-4 relative group overflow-hidden rounded-xl bg-gradient-to-r from-[#FF5500] to-[#FFD700] p-[1px] cursor-pointer shadow-lg orange-glow active:scale-95 transition-all text-xs"
                  >
                    <div className="flex items-center gap-1.5 bg-black py-2.5 px-4 rounded-[11px] group-hover:bg-[#FF5500]/10 transition-all font-display font-black text-white tracking-widest uppercase">
                      <Plus className="w-4 h-4 text-[#FFD700]" />
                      <span>Enviar comprovante</span>
                    </div>
                  </motion.button>
                </div>

                {/* 3 HIGHLIGHT COMMERCE BLOCKS SIDE-BY-SIDE */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-display">
                  {/* Block 1: Hamburguer */}
                  <div className="bg-[#0C0C0E] border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group p-2.5 relative">
                    <div className="relative h-28 w-full overflow-hidden rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=260&auto=format&fit=crop" 
                        alt="Hamburgueria do Terrão"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-[#FF5500] text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Sócio Burguer
                      </span>
                    </div>
                    <div className="pt-2 text-left flex-1 flex flex-col justify-between">
                      <div className="pb-2">
                        <h4 className="text-xs font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-[#FF5500] transition-colors">Burguer do Terrão</h4>
                        <p className="text-[9px] text-[#FF5500] font-sans tracking-tight mt-0.5 font-mono">Itaquera • São Paulo</p>
                      </div>
                      <a 
                        href="https://wa.me/5511999998888?text=Olá! Quero pedir um Hambúrguer Gourmet pelo aplicativo Sócio Compra."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[9px] font-black uppercase tracking-wider py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Block 2: Pizza */}
                  <div className="bg-[#0C0C0E] border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group p-2.5 relative">
                    <div className="relative h-28 w-full overflow-hidden rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=260&auto=format&fit=crop" 
                        alt="Pizza da Arena"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Arena Pizza
                      </span>
                    </div>
                    <div className="pt-2 text-left flex-1 flex flex-col justify-between">
                      <div className="pb-2">
                        <h4 className="text-xs font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-yellow-400 transition-colors">Pizza da Arena</h4>
                        <p className="text-[9px] text-[#FF5500] font-sans tracking-tight mt-0.5 font-mono">São Miguel • São Paulo</p>
                      </div>
                      <a 
                        href="https://wa.me/5511999998888?text=Olá! Quero pedir uma Pizza Forno á Lenha pelo aplicativo Sócio Compra."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[9px] font-black uppercase tracking-wider py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>

                  {/* Block 3: Barber */}
                  <div className="bg-[#0C0C0E] border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden shadow-xl transition-all flex flex-col group p-2.5 relative">
                    <div className="relative h-28 w-full overflow-hidden rounded-xl">
                      <img 
                        src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=260&auto=format&fit=crop" 
                        alt="Corte de Campeão"
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <span className="absolute bottom-2 left-2 text-[8px] font-mono bg-blue-500 text-white px-1.5 py-0.5 rounded font-black uppercase tracking-wider">
                        Corte de Campeão
                      </span>
                    </div>
                    <div className="pt-2 text-left flex-1 flex flex-col justify-between">
                      <div className="pb-2">
                        <h4 className="text-xs font-black text-white uppercase tracking-tight truncate leading-tight group-hover:text-blue-400 transition-colors">Corte de Campeão</h4>
                        <p className="text-[9px] text-[#FF5500] font-sans tracking-tight mt-0.5 font-mono">Guaianases • São Paulo</p>
                      </div>
                      <a 
                        href="https://wa.me/5511999998888?text=Olá! Quero agendar um corte pelo aplicativo Sócio Compra."
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[9px] font-black uppercase tracking-wider py-2 rounded-xl text-center flex items-center justify-center gap-1 transition-all shadow-md active:scale-95"
                      >
                        <MessageCircle className="w-3.5 h-3.5 text-current" />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* ADVANCED SEARCH INPUT BAR */}
                <div className="relative z-10">
                  <div className="relative flex items-center">
                    <ShoppingBag className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={homeSearchQuery}
                      onChange={(e) => setHomeSearchQuery(e.target.value)}
                      placeholder="Buscar times, empresas, bairros (ex: Itaquera, Terrão)..."
                      className="w-full bg-[#0c0c0e] border border-zinc-900 focus:border-[#FF5500]/60 focus:ring-1 focus:ring-[#FF5500]/30 rounded-2xl pl-10 pr-10 py-3.5 text-xs text-white placeholder-zinc-550 transition-all font-medium font-sans shadow-inner"
                    />
                    {homeSearchQuery ? (
                      <button 
                        onClick={() => setHomeSearchQuery('')}
                        className="absolute right-3 w-6 h-6 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Limpar pesquisa"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="absolute right-3.5 text-[9px] font-mono tracking-wider text-zinc-650 uppercase font-bold select-none">Busca</span>
                    )}
                  </div>
                </div>

                {homeSearchQuery.trim() ? (
                  /* SEARCH RESULTS INTERACTIVE SCREEN */
                  <div className="space-y-6 animate-fadeIn py-1">
                    <div className="flex justify-between items-center border-b border-zinc-900/40 pb-2.5">
                      <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5500] font-black">
                        RESULTADOS PARA: "{homeSearchQuery}"
                      </span>
                      <button 
                        onClick={() => setHomeSearchQuery('')}
                        className="text-[10px] text-zinc-500 font-bold hover:text-white uppercase font-display cursor-pointer"
                      >
                        Limpar Resultados
                      </button>
                    </div>

                    {/* A. MATCHING TIMES */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-yellow-400 pl-2">
                        Times da Várzea ({
                          times.filter(t => {
                            const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const name = (t.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const neighborhood = (t.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return name.includes(q) || neighborhood.includes(q);
                          }).length
                        })
                      </h4>

                      {(() => {
                        const filtered = times.filter(t => {
                          const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const name = (t.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const neighborhood = (t.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          return name.includes(q) || neighborhood.includes(q);
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="bg-[#0C0C0E]/50 border border-zinc-950 rounded-2xl py-6 px-4 text-center">
                              <p className="text-xs text-zinc-500 font-medium">Nenhum clube ou time encontrado nesta região.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="grid grid-cols-2 gap-3">
                            {filtered.map(t => (
                              <div 
                                key={t.id}
                                onClick={() => setSelectedClubeSheet(t)}
                                className="bg-gradient-to-br from-[#0c0c0e] to-[#050506] border border-zinc-900 hover:border-yellow-500/30 rounded-2xl p-3 flex items-center gap-3 cursor-pointer transition-all hover:scale-[1.02] active:scale-95 text-left"
                              >
                                <div 
                                  className="w-10 h-10 rounded-xl flex items-center justify-center border border-zinc-900/60 flex-shrink-0"
                                  style={{ background: `linear-gradient(135deg, ${t.cores?.[0] || '#121214'} 0%, ${t.cores?.[1] || '#000'} 100%)` }}
                                >
                                  {t.logo_url ? (
                                    <img src={t.logo_url} alt={t.nome} className="w-6.5 h-6.5 object-contain" />
                                  ) : (
                                    <span className="text-white text-xs font-black">{t.sigla}</span>
                                  )}
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h5 className="text-[11px] font-black uppercase text-zinc-100 truncate">{t.nome}</h5>
                                  <p className="text-[9px] text-zinc-500 font-mono tracking-tight font-medium mt-0.5">{t.bairro || 'Terrão'}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>

                    {/* B. MATCHING EMPRESAS */}
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                        Parceiros & Credenciados ({
                          empresas.filter(e => {
                            const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const name = (e.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const cat = (e.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const neighborhood = (e.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const address = (e.endereco || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return name.includes(q) || cat.includes(q) || neighborhood.includes(q) || address.includes(q);
                          }).length
                        })
                      </h4>

                      {(() => {
                        const filtered = empresas.filter(e => {
                          const q = homeSearchQuery.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const name = (e.nome || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const cat = (e.categoria || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const neighborhood = (e.bairro || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const address = (e.endereco || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          return name.includes(q) || cat.includes(q) || neighborhood.includes(q) || address.includes(q);
                        });

                        if (filtered.length === 0) {
                          return (
                            <div className="bg-[#0C0C0E]/50 border border-zinc-950 rounded-2xl py-6 px-4 text-center">
                              <p className="text-xs text-zinc-500 font-medium">Nenhum estabelecimento comercial encontrado no momento.</p>
                            </div>
                          );
                        }

                        return (
                          <div className="space-y-2.5">
                            {filtered.map(emp => (
                              <div 
                                key={emp.id}
                                onClick={() => setSelectedEmpresaSheet(emp)}
                                className="bg-gradient-to-r from-[#0C0C0E] to-[#040405] border border-zinc-900 hover:border-[#FF5500]/30 rounded-2xl p-3 flex gap-3.5 cursor-pointer transition-all hover:scale-[1.01] active:scale-95 text-left"
                              >
                                <img 
                                  src={emp.logo || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=120&auto=format&fit=crop'} 
                                  alt={emp.nome} 
                                  referrerPolicy="no-referrer"
                                  className="w-12 h-12 rounded-xl object-cover border border-zinc-900 flex-shrink-0"
                                />
                                <div className="min-w-0 flex-1 flex flex-col justify-between">
                                  <div>
                                    <h5 className="text-[11.5px] font-black text-white leading-tight uppercase tracking-tight">{emp.nome}</h5>
                                    <p className="text-[8.5px] text-zinc-500 font-sans mt-0.5 uppercase tracking-wide">
                                      {emp.categoria} • {emp.bairro || 'Terrão'}
                                    </p>
                                  </div>
                                  <div className="flex justify-between items-center mt-1 select-none">
                                    <span className="text-[8px] font-black px-1.5 py-0.5 bg-yellow-400/10 text-[#FF5500] border border-[#FF5500]/10 rounded-md font-mono">
                                      SCORE {emp.score || '5.0'} ⭐
                                    </span>
                                    <span className="text-[8.5px] text-[#FF5500] font-black tracking-tighter uppercase font-mono">
                                      {emp.cashback_porcentagem}% CASHBACK
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* 2. CATEGORIAS - HORIZONTAL BAR SILOUHETTE IFOOD-STYLE */}
                    <div className="space-y-2.5">
                  <div className="flex justify-between items-center select-none">
                    <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FFD700] pl-2">
                      Categorias no Bairro
                    </h4>
                    <div className="flex items-center gap-2">
                      {selectedHomeCategory !== 'Todos' && (
                        <button 
                          onClick={() => setSelectedHomeCategory('Todos')}
                          className="text-[10px] text-zinc-500 font-bold hover:text-white uppercase font-display cursor-pointer"
                        >
                          Limpar
                        </button>
                      )}
                      <span 
                        onClick={() => { setSelectedCategory('Todos'); setActiveTab('parceiros'); }}
                        className="text-[10px] text-orange-500 hover:text-orange-400 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                      >
                        Ver todas
                      </span>
                    </div>
                  </div>
                  
                  {/* Slider of premium marketplace/iFood style cards */}
                  <div className="no-scrollbar overflow-x-auto flex gap-3.5 py-2 select-none">
                    {[
                      { id: 'todos', nome: 'Todos', emoji: '⚽', subcategorias: ['Todos os parceiros'], cor_gradient: 'from-orange-500/10 to-amber-500/10 hover:border-orange-500/40 text-[#FF5500]' },
                      ...categorias
                    ].map(cat => {
                      const isActive = selectedHomeCategory === cat.nome;
                      const hasGradientAndTextColors = cat.cor_gradient || 'from-zinc-900/40 to-black/40 hover:border-zinc-700/60 text-zinc-400';
                      
                      return (
                        <button
                          key={cat.id}
                          onClick={() => {
                            if (isActive) {
                              setSelectedHomeCategory('Todos');
                              setSelectedHomeSubcategory('Todos');
                            } else {
                              setSelectedHomeCategory(cat.nome);
                              setSelectedHomeSubcategory('Todos');
                            }
                          }}
                          className={`flex-shrink-0 w-[140px] p-2.5 rounded-2xl border transition-all duration-300 relative overflow-hidden flex flex-col justify-between text-left group cursor-pointer active:scale-95 ${
                            isActive 
                              ? 'bg-gradient-to-br from-zinc-900/90 to-black border-[#FF5500]/50 shadow-[0_4px_16px_rgba(255,85,0,0.15)] translate-y-[-2px]' 
                              : `bg-gradient-to-br from-[#0c0c0e]/80 to-[#050506]/85 border-zinc-900/60 hover:border-zinc-700/40`
                          }`}
                        >
                          {/* Top-right subtle circle glow when active */}
                          {isActive && (
                            <div className="absolute top-0 right-0 w-8 h-8 bg-[#FF5500]/10 rounded-full blur-md pointer-events-none" />
                          )}

                          <div className="flex items-center gap-2">
                            {/* Icon frame */}
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg transition-transform duration-300 ${
                              isActive 
                                ? 'bg-[#FF5500]/15 border border-[#FF5500]/30 scale-105' 
                                : `bg-gradient-to-br ${hasGradientAndTextColors.split(' ').slice(0, 2).join(' ')} border border-zinc-850 group-hover:scale-105`
                            }`}>
                              <span className={isActive ? 'animate-bounce' : 'group-hover:rotate-12 transition-transform'}>{cat.emoji}</span>
                            </div>

                            <div className="flex-1 min-w-0">
                              <h5 className={`text-[10px] font-black font-display uppercase tracking-wider truncate leading-tight ${
                                isActive ? 'text-[#FFD700]' : 'text-zinc-200 group-hover:text-[#FF5500] transition-colors'
                              }`}>
                                {cat.nome}
                              </h5>
                              <p className="text-[7.5px] text-zinc-500 font-sans truncate tracking-tight mt-0.5">
                                {cat.subcategorias && cat.subcategorias.length > 0 ? cat.subcategorias.join(', ') : 'Parceiros locais'}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 2.5 DYNAMIC PREMIUM SUBCATEGORIES SLIDER */}
                {selectedHomeCategory !== 'Todos' && (() => {
                  const activeCatObj = categorias.find(c => c.nome === selectedHomeCategory);
                  const subs = activeCatObj?.subcategorias || [];
                  if (subs.length === 0) return null;
                  
                  return (
                    <div className="space-y-2 bg-[#0C0C0E] border border-zinc-900 rounded-2xl p-3.5 mt-[-4px] select-none animate-fadeIn">
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] uppercase font-black tracking-widest text-[#FFD700] font-mono flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 bg-[#FF5500] rounded-full animate-ping"></span>
                          Subcategorias • {selectedHomeCategory}
                        </span>
                        {selectedHomeSubcategory !== 'Todos' && (
                          <button 
                            onClick={() => setSelectedHomeSubcategory('Todos')}
                            className="text-[8.5px] uppercase font-bold font-mono text-zinc-500 hover:text-[#FF5500] transition-colors"
                          >
                            Limpar
                          </button>
                        )}
                      </div>
                      
                      <div className="no-scrollbar overflow-x-auto flex gap-2 py-1">
                        {/* 'Todos' Pill */}
                        <button
                          onClick={() => setSelectedHomeSubcategory('Todos')}
                          className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl border text-[10.5px] font-bold uppercase transition-all duration-200 cursor-pointer ${
                            selectedHomeSubcategory === 'Todos'
                              ? 'bg-[#FF5500] border-orange-500 text-white shadow-[0_2px_8px_rgba(255,85,0,0.25)]'
                              : 'bg-[#121214] border-zinc-900 hover:border-zinc-800 text-zinc-400 hover:text-white'
                          }`}
                        >
                          Ver Todas
                        </button>
                        
                        {/* Subcategory Pills */}
                        {subs.map(subCode => (
                          <button
                            key={subCode}
                            onClick={() => {
                              setSelectedHomeSubcategory(prev => prev === subCode ? 'Todos' : subCode);
                            }}
                            className={`flex-shrink-0 px-3.5 py-1.5 rounded-xl border text-[10.5px] font-bold uppercase tracking-tight transition-all duration-200 cursor-pointer ${
                              selectedHomeSubcategory === subCode
                                ? 'bg-gradient-to-r from-[#FFD700] to-yellow-500 border-yellow-400 text-black shadow-[0_2px_8px_rgba(255,215,0,0.25)] font-black'
                                : 'bg-[#121214] border-zinc-900 hover:border-zinc-850 text-zinc-450 hover:text-white'
                            }`}
                          >
                            {subCode}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })()}

                {/* Condition: if selected category is 'Todos', show carousels layout. Otherwise show list of filtered category items */}
                {selectedHomeCategory === 'Todos' ? (
                  <div className="space-y-6">
                    {/* A. TIMES PARCEIROS CAROUSEL */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center select-none">
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-yellow-400 pl-2">
                          Times Parceiros
                        </h4>
                        <span 
                          onClick={() => { setRankingSegment('times'); setActiveTab('ranking'); }}
                          className="text-[10px] text-yellow-400 hover:text-yellow-300 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                        >
                          Ver todos
                        </span>
                      </div>

                      {/* Horizontal carousel */}
                      <div className="no-scrollbar overflow-x-auto flex gap-3.5 py-1.5 select-none scroll-smooth">
                        {times.map(t => (
                          <div 
                            key={t.id}
                            onClick={() => setSelectedClubeSheet(t)}
                            className="flex-shrink-0 w-28 bg-[#0c0c0e] hover:bg-zinc-950 border border-zinc-900 hover:border-yellow-400 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer shadow-md transition-all group"
                          >
                            <div className="relative">
                              <img 
                                src={t.logo} 
                                alt={t.nome} 
                                referrerPolicy="no-referrer"
                                className="w-11 h-11 rounded-full object-cover border border-white/5 bg-zinc-950 p-1 group-hover:scale-110 transition-transform duration-300"
                              />
                              {t.id === activeUser.time_coracao_id && (
                                <span className="absolute -top-1 -right-1 bg-[#FF5500] text-black w-3.5 h-3.5 rounded-full text-[8px] font-black flex items-center justify-center">♥</span>
                              )}
                            </div>

                            <h5 className="text-[9px] font-black text-white font-display mt-2 truncate w-full">{t.nome}</h5>
                            <p className="text-[7.5px] text-zinc-500 font-mono mt-0.5 truncate w-full">{t.bairro || 'Varzea'}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* B. EMPRESAS PARCEIRAS CAROUSEL */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center select-none">
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                          Empresas Parceiras
                        </h4>
                        <span 
                          onClick={() => { setSelectedCategory('Todos'); setActiveTab('parceiros'); }}
                          className="text-[10px] text-orange-400 hover:text-orange-300 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                        >
                          Ver todas
                        </span>
                      </div>

                      {/* Horizontal carrossel */}
                      <div className="no-scrollbar overflow-x-auto flex gap-4 py-1.5 select-none scroll-smooth">
                        {empresas.map(emp => {
                          let defaultFoodImage = emp.banner;
                          const catLower = (emp.categoria || '').toLowerCase();
                          const nameLower = (emp.nome || '').toLowerCase();
                          if (catLower.includes('hamburguer') || catLower.includes('burg') || nameLower.includes('hamb')) {
                            defaultFoodImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=260&auto=format&fit=crop';
                          } else if (catLower.includes('pizza') || nameLower.includes('piz')) {
                            defaultFoodImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=260&auto=format&fit=crop';
                          } else if (catLower.includes('barb') || catLower.includes('corte') || nameLower.includes('barber')) {
                            defaultFoodImage = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=260&auto=format&fit=crop';
                          }

                          return (
                            <div 
                              key={emp.id}
                              onClick={() => setSelectedEmpresaSheet(emp)}
                              className="flex-shrink-0 w-44 bg-[#0c0c0e] hover:bg-zinc-950 border border-zinc-900 hover:border-[#FF5500]/50 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all group flex flex-col justify-between"
                            >
                              <div className="relative h-20 w-full overflow-hidden">
                                <img 
                                  src={defaultFoodImage} 
                                  alt={emp.nome} 
                                  referrerPolicy="no-referrer"
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
                                <span className="absolute top-1.5 right-1.5 bg-black/75 text-yellow-400 text-[8px] font-black px-1.5 py-0.5 rounded-full">
                                  ★ {emp.score || '4.8'}
                                </span>
                              </div>

                              <div className="p-2.5 text-left flex flex-col justify-between flex-1">
                                <div className="mb-2">
                                  <h5 className="text-[10px] font-black text-white font-display truncate leading-tight group-hover:text-[#FF5500] transition-colors">{emp.nome}</h5>
                                  <p className="text-[8px] text-zinc-500 font-sans mt-0.5 truncate uppercase">{emp.categoria} • {emp.bairro || 'Terrão'}</p>
                                </div>

                                <a 
                                  href={`https://wa.me/${emp.telefone || '5511999998888'}?text=${encodeURIComponent(`Olá! Vi sua empresa no aplicativo Sócio Compra. Gostaria de fazer um pedido!`)}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={(e) => e.stopPropagation()}
                                  className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black text-[8.5px] font-black uppercase tracking-wider py-1.5 rounded-xl text-center flex items-center justify-center gap-1 transition-all"
                                >
                                  <MessageCircle className="w-3 h-3 text-current" />
                                  <span>WhatsApp</span>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* C. REELS SÓCIO COMPRA CAROUSEL */}
                    <div className="space-y-3">
                      <div className="flex justify-between items-center select-none">
                        <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-orange-500 pl-2">
                          Reels Sócio Compra
                        </h4>
                        <span 
                          onClick={() => setActiveTab('reels')}
                          className="text-[10px] text-orange-400 hover:text-orange-300 font-extrabold uppercase cursor-pointer hover:underline font-display transition-all"
                        >
                          Ver todos
                        </span>
                      </div>

                      {/* Horizontal carrossel of videos/reels */}
                      <div className="no-scrollbar overflow-x-auto flex gap-4 py-1.5 select-none scroll-smooth">
                        {videos.map((vid, ix) => (
                          <div 
                            key={vid.id || ix}
                            onClick={() => setHomeVideoPlaying(vid)}
                            className="flex-shrink-0 w-36 bg-[#0c0c0e] hover:bg-zinc-950 border border-zinc-900 hover:border-orange-500/50 rounded-2xl overflow-hidden cursor-pointer shadow-lg transition-all group relative flex flex-col justify-between"
                          >
                            <div className="relative h-28 w-full bg-zinc-950 flex items-center justify-center overflow-hidden">
                              <div className="absolute inset-0 bg-cover bg-center brightness-50" style={{ backgroundImage: `url('${vid.empresa_logo}')` }} />
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
                              <span className="absolute top-1.5 left-1.5 bg-[#FF5500] text-black font-black text-[7px] px-1.5 py-0.5 rounded uppercase tracking-wider font-display select-none">
                                {ix % 2 === 0 ? 'Notícias' : 'Ação Social'}
                              </span>
                              <div className="absolute inset-x-2 bottom-2 text-center select-none z-10">
                                <p className="text-[8px] font-mono text-zinc-300 truncate">{vid.descricao}</p>
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all">
                                <div className="bg-black/60 p-2 rounded-full border border-white/10">
                                  <Play className="w-2.5 h-2.5 text-white fill-white ml-0.5" />
                                </div>
                              </div>
                            </div>

                            <div className="p-2 flex items-center gap-1.5 bg-[#09090b] text-[8px] text-zinc-400 select-none min-w-0">
                              <img 
                                src={vid.empresa_logo} 
                                alt="creator" 
                                className="w-4 h-4 rounded-md object-cover"
                              />
                              <span className="truncate flex-1 font-bold">{vid.empresa_nome}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ORIGINAL FILTERED LIST DESIGN IF CATEGORY FILTER IS APPLIED */
                  <div className="space-y-3.5">
                    <div className="flex justify-between items-end select-none">
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                        Patrocinadores [{selectedHomeCategory}{selectedHomeSubcategory !== 'Todos' ? ` › ${selectedHomeSubcategory}` : ''}]
                      </h4>
                    </div>

                    {(() => {
                      const filtered = empresas.filter(e => {
                        const empLower = (e.categoria || '').toLowerCase();
                        const normEmp = empLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        
                        if (selectedHomeSubcategory !== 'Todos') {
                          const empSubLower = (e.subcategoria || '').toLowerCase();
                          const normEmpSub = empSubLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          const normSelectedSub = selectedHomeSubcategory.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                          
                          const nameLower = (e.nome || '').toLowerCase();
                          const normName = nameLower.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

                          if (normEmpSub.includes(normSelectedSub) || normSelectedSub.includes(normEmpSub) || normName.includes(normSelectedSub)) {
                            return true;
                          }
                          return false;
                        }

                        const targetCat = categorias.find(c => c.nome === selectedHomeCategory);
                        if (!targetCat) {
                          return empLower.includes(selectedHomeCategory.toLowerCase());
                        }
                        
                        const normCat = targetCat.nome.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                        if (normEmp.includes(normCat) || normCat.includes(normEmp)) {
                          return true;
                        }
                        
                        if (targetCat.subcategorias) {
                          for (const sub of targetCat.subcategorias) {
                            const normSub = sub.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            if (normEmp.includes(normSub) || normSub.includes(normEmp)) {
                              return true;
                            }
                          }
                        }
                        
                        return false;
                      });

                      if (filtered.length === 0) {
                        return (
                          <div className="p-6 text-center bg-[#070709] border border-zinc-900 rounded-2xl">
                            <p className="text-[11px] text-zinc-500 font-mono">Nenhum patrocinador encontrado neste setor.</p>
                          </div>
                        );
                      }

                      return (
                        <div className="space-y-4">
                          {filtered.map(emp => {
                            let defaultFoodImage = emp.banner;
                            const catLower = (emp.categoria || '').toLowerCase();
                            const nameLower = (emp.nome || '').toLowerCase();
                            if (catLower.includes('hamburguer') || catLower.includes('burg') || nameLower.includes('hamb')) {
                              defaultFoodImage = 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop';
                            } else if (catLower.includes('pizza') || nameLower.includes('piz')) {
                              defaultFoodImage = 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop';
                            } else if (catLower.includes('barb') || catLower.includes('corte') || nameLower.includes('barber')) {
                              defaultFoodImage = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?q=80&w=400&auto=format&fit=crop';
                            }

                            return (
                              <div 
                                key={emp.id}
                                className="group bg-[#0c0c0e] hover:bg-[#121215] border border-zinc-900 hover:border-[#FF5500]/40 rounded-2xl overflow-hidden shadow-lg transition-all flex flex-col cursor-pointer"
                                onClick={() => setSelectedEmpresaSheet(emp)}
                              >
                                <div className="relative h-32 w-full overflow-hidden">
                                  <img 
                                    src={defaultFoodImage} 
                                    alt={emp.nome} 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                                  
                                  <div className="absolute top-3 left-3 bg-[#FF5500] text-black font-extrabold text-[10px] px-2.5 py-1 rounded-md uppercase tracking-wider shadow-md font-display flex items-center gap-1 select-none text-orange-glow">
                                    <Sparkles className="w-3 h-3 text-black fill-black" />
                                    <span>PARCEIRO DO TIME</span>
                                  </div>

                                  <div className="absolute top-2.5 right-2.5 bg-black/60 border border-white/10 text-yellow-400 font-black text-[10px] px-2 py-0.5 rounded-full backdrop-blur-md select-none">
                                    ★ {emp.score || '4.8'}
                                  </div>
                                </div>

                                <div className="p-4 flex gap-3 items-center justify-between">
                                  <div className="flex gap-3 items-center min-w-0 flex-1 text-left">
                                    <img 
                                      src={emp.logo} 
                                      alt={emp.nome} 
                                      referrerPolicy="no-referrer"
                                      className="w-10 h-10 rounded-xl object-cover border border-[#FF5500]/30 flex-shrink-0"
                                    />
                                    <div className="min-w-0 flex-1 text-left">
                                      <h5 className="text-sm font-black text-white truncate font-display group-hover:text-[#FF5500] transition-colors">{emp.nome}</h5>
                                      <p className="text-[10px] text-zinc-500 font-medium font-sans mt-0.5 capitalize">{emp.categoria} • {emp.bairro || 'Itaquera'}</p>
                                    </div>
                                  </div>

                                  <a
                                    href={`https://wa.me/${emp.telefone || '5511999998888'}?text=${encodeURIComponent(`Olá! Vi sua empresa ${emp.nome} no aplicativo Sócio Compra. Gostaria de fazer um pedido!`)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    className="bg-[#25D366] hover:bg-[#1ebd53] text-black font-extrabold text-[10px] px-3.5 py-2.5 rounded-xl uppercase tracking-wider flex items-center gap-1 border-0 shadow-lg select-none active:scale-95 transition-all flex-shrink-0"
                                  >
                                    <span>WhatsApp</span>
                                  </a>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* 6. TRANSAÇÕES RECENTES FUTEBOL DE VÁRZEA */}
                <div className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-4 text-left">
                  <h4 className="text-[10px] font-mono font-bold text-zinc-500 uppercase tracking-widest mb-3 flex items-center justify-between select-none">
                    <span>TRANSAÇÕES RECENTES FUTEBOL DE VÁRZEA</span>
                    <span className="text-green-500 flex items-center gap-1 text-[9px] font-extrabold animate-pulse">
                      ● ATIVIDADE RECENTE
                    </span>
                  </h4>

                  <div className="space-y-2">
                    {comprovantes.slice(0, 3).map(comp => (
                      <div key={comp.id} className="flex justify-between items-center text-xs font-sans leading-relaxed border-b border-zinc-900/40 pb-1.5">
                        <div className="text-left min-w-0 pr-1 flex gap-2 items-center">
                          <span 
                            onClick={() => {
                              // Trigger click list
                              setSelectedUsuarioSheet({
                                id: comp.usuario_id || 'u-generic',
                                nome: comp.usuario_nome,
                                email: 'lsp.prates@gmail.com',
                                avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop',
                                saldo_cashback: 142.50,
                                saldo_pontos: 12450,
                                nivel: 6,
                                time_coracao_id: comp.time_id
                              });
                            }}
                            className="font-bold text-white hover:text-[#FF5500] hover:underline cursor-pointer truncate max-w-[95px] select-all block"
                          >
                            {comp.usuario_nome}
                          </span>
                          <span className="text-[9px] text-zinc-500 truncate max-w-[85px] select-all">({comp.empresa_nome})</span>
                        </div>

                        <div className="text-right flex-shrink-0 flex flex-col">
                          <span className="font-extrabold text-[#FFD700] p-0 font-mono text-[10px]">+{comp.pontos_gerados} Pts</span>
                          <span className="text-[8px] text-[#FF5500] p-0 font-mono font-semibold">Repasse: R$ {comp.comissao_clube_gerado.toFixed(2)} {comp.time_nome ? `para ${comp.time_nome.split(' ')[0]}` : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                </>
              )}

                {/* Disclaimer/Credit line footer */}
                <div className="p-3.5 bg-zinc-950/40 border border-zinc-900/60 rounded-xl text-center select-none text-[10px] text-zinc-600 leading-relaxed font-mono">
                  🤝 Todo repasse é auditado pela comissão de arbitragem e repassado aos times de várzea para despesas de campeonato.
                </div>
              </div>
            )}

            {/* TAB 2: MERCADO / ESTABELECIMENTOS GRIDS */}
            {activeTab === 'parceiros' && (
              <div className="flex-1 bg-[#050505] p-5 overflow-y-auto space-y-5 text-left font-sans no-scrollbar">
                
                {/* Tab header title */}
                <div className="space-y-1">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF5500] font-black">SPONSORS & MARQUETESTE</span>
                  <h2 className="text-xl font-bold font-display text-white uppercase tracking-tight flex items-center gap-2">
                    <ShoppingBag className="w-5 h-5 text-yellow-400" />
                    <span>EMPRESAS CREDIADAS</span>
                  </h2>
                </div>

                {/* Horizontal sticky Categories selectors */}
                <div className="no-scrollbar overflow-x-auto flex gap-2 py-1 select-none sticky top-0 bg-[#050505] z-10">
                  {categoriesList.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`flex-shrink-0 px-3.5 py-1.5 border rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                        selectedCategory === cat 
                          ? 'bg-[#FF5500] border-orange-500 text-white' 
                          : 'bg-[#0E0E10] border-zinc-850 hover:border-zinc-700 text-zinc-400'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* ADVANCED SEB / SEARCH INPUT BAR */}
                <div className="relative z-10">
                  <div className="relative flex items-center">
                    <ShoppingBag className="absolute left-3.5 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      value={partnersSearchQuery}
                      onChange={(e) => setPartnersSearchQuery(e.target.value)}
                      placeholder="Buscar empresa por nome, bairro ou categoria..."
                      className="w-full bg-[#0c0c0e] border border-zinc-900 focus:border-[#FF5500]/60 focus:ring-1 focus:ring-[#FF5500]/30 rounded-2xl pl-10 pr-10 py-3.5 text-xs text-white placeholder-zinc-550 transition-all font-medium font-sans shadow-inner"
                    />
                    {partnersSearchQuery ? (
                      <button 
                        onClick={() => setPartnersSearchQuery('')}
                        className="absolute right-3 w-6 h-6 rounded-full hover:bg-zinc-800 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                        title="Limpar pesquisa"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <span className="absolute right-4 text-[9px] font-mono tracking-wider text-zinc-650 uppercase font-bold select-none">Busca</span>
                    )}
                  </div>
                </div>

                {/* Businesses list matches categories */}
                {filteredEmpresas.length > 0 ? (
                  <div className="space-y-4 pt-1">
                    {filteredEmpresas.map(emp => (
                      <div 
                        key={emp.id}
                        className="bg-[#0c0c0e] border border-zinc-900 rounded-2xl p-4 flex gap-4 hover:border-orange-500 transition-colors cursor-pointer text-left"
                        onClick={() => {
                          setSelectedCategory('Todos');
                          setActiveTab('perfil');
                          setActivePersona('empresa');
                        }}
                      >
                        {/* Company avatar */}
                        <img 
                          src={emp.logo} 
                          alt={emp.nome} 
                          referrerPolicy="no-referrer"
                          className="w-14 h-14 rounded-xl object-cover border border-[#FF5500]/25 flex-shrink-0"
                        />

                        {/* Details */}
                        <div className="min-w-0 flex-1 flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start gap-1">
                              <h3 className="font-extrabold text-sm tracking-tight font-display text-white truncate pr-1">
                                {emp.nome}
                              </h3>
                              <span className="text-yellow-400 text-xs font-bold font-mono">★ {emp.score || '4.5'}</span>
                            </div>

                            <p className="text-[10px] text-zinc-500 font-medium font-sans mt-0.5">{emp.categoria} • {emp.endereco}</p>
                            <p className="text-zinc-400 font-medium text-[11px] leading-relaxed mt-2.5 max-w-[90%]">
                              {emp.descricao}
                            </p>
                          </div>

                          <div className="mt-3.5 flex justify-between items-center">
                            {/* Supporting Sponsor Badge bullet */}
                            <span className="bg-[#FF5500]/10 border border-[#FF5500]/20 text-[#FF5500] font-black text-[10px] px-2.5 py-1 rounded-md tracking-wider">
                              PATROCINADOR ATIVO
                            </span>

                            <span className="text-[10px] font-mono text-zinc-650 flex items-center gap-1">
                              Fideliza: <span className="text-[#FFD700] font-bold">+{emp.pontos_por_real || 10} Pts/Spend</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-8 text-center bg-zinc-950/40 border border-zinc-900 rounded-xl">
                    <p className="text-xs text-zinc-500">Nenhum estabelecimento encontrado nesta categoria.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: VIDEO REELS (TIKTOK VIBE) */}
            {activeTab === 'reels' && (
              <VideoFeed 
                videos={videos} 
                onClaimCoupon={handleClaimCouponFromReels} 
              />
            )}

            {/* TAB 4: RANKING LEADERBOARD */}
            {activeTab === 'ranking' && (
              <RankingList 
                times={times} 
                empresas={empresas} 
                usuarios={usuarios} 
                isSupabaseLive={isSupabaseLive} 
                initialSegment={rankingSegment}
              />
            )}

            {/* TAB 5: PERFIL STATUS & SWITCHABLE PERSONAS */}
            {activeTab === 'perfil' && (
              <div className="flex-1 bg-[#050505] p-5 overflow-y-auto space-y-6 text-left font-sans no-scrollbar">
                
                {/* 🚀 QUICK ACTION FOR COMPANY & CLUB INTEGRATIONS */}
                <div className="bg-gradient-to-r from-[#0C0C0E] to-[#121215] border border-zinc-900 rounded-2xl p-4.5 space-y-3.5 relative overflow-hidden shadow-xl select-none">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-[#FF5500]/5 rounded-full blur-2xl pointer-events-none" />
                  
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <h4 className="text-[10px] font-mono font-bold text-white uppercase tracking-widest">
                      Seja um Parceiro Oficial
                    </h4>
                  </div>
                  
                  <p className="text-[11px] text-zinc-400 leading-relaxed max-w-[90%]">
                    Divulgue sua empresa para atrair novos clientes ou cadastre seu clube no nosso ecossistema de torcedores!
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2.5 pt-1">
                    <button
                      onClick={() => setCadastroEmpresaOpen(true)}
                      className="py-2.5 px-3 bg-[#FF5500]/10 hover:bg-[#FF5500]/20 border border-[#FF5500]/30 hover:border-[#FF5500]/70 rounded-xl text-xs font-black font-display text-[#FF5500] hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer text-center duration-200"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Cadastrar Empresa</span>
                    </button>
                    
                    <button
                      onClick={() => setCadastroClubeOpen(true)}
                      className="py-2.5 px-3 bg-[#FFD700]/5 hover:bg-[#FFD700]/15 border border-zinc-900 hover:border-[#FFD700]/40 rounded-xl text-xs font-black font-display text-[#FFD700] hover:text-yellow-300 transition-all flex items-center justify-center gap-2 cursor-pointer text-center duration-200"
                    >
                      <Trophy className="w-3.5 h-3.5" />
                      <span>Cadastrar Clube</span>
                    </button>
                  </div>
                </div>

                {/* Persona choice segments */}
                <div className="space-y-2">
                  <h4 className="text-[10px] font-mono font-bold text-[#FF5500] uppercase tracking-widest select-none">
                    MUDAR PAINEL DO SISTEMA
                  </h4>
                  
                  {/* Grid workspace selector selectors */}
                  <div className="grid grid-cols-4 gap-1 p-1 bg-[#0E0E10] border border-zinc-800/85 rounded-xl">
                    {/* Torcedor */}
                    <button
                      onClick={() => setActivePersona('usuario')}
                      className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
                        activePersona === 'usuario' 
                          ? 'bg-[#FF5500] text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Usuário
                    </button>

                    {/* Empresa */}
                    <button
                      onClick={() => setActivePersona('empresa')}
                      className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
                        activePersona === 'empresa' 
                          ? 'bg-[#FF5500] text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Pilar
                    </button>

                    {/* Clube */}
                    <button
                      onClick={() => setActivePersona('clube')}
                      className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
                        activePersona === 'clube' 
                          ? 'bg-[#FF5500] text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Clube
                    </button>

                    {/* Admin */}
                    <button
                      onClick={() => setActivePersona('admin')}
                      className={`py-1.5 rounded-lg cursor-pointer text-[9px] font-bold font-display uppercase tracking-wide transition-all ${
                        activePersona === 'admin' 
                          ? 'bg-[#FF5500] text-white shadow-md' 
                          : 'text-zinc-500 hover:text-zinc-300'
                      }`}
                    >
                      Controle
                    </button>
                  </div>
                </div>

                {/* Display respective dynamic dashboard views matches persona */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
                  <div className="space-y-6">
                    {activePersona === 'usuario' && (
                      <DashboardUsuario 
                        usuario={activeUser} 
                        comprovantes={comprovantes} 
                      />
                    )}

                    {activePersona === 'empresa' && empresas.length > 0 && (
                      <DashboardEmpresa 
                        empresa={empresas.find(e => e.id === currentEmpresaId) || empresas[0]}
                        comprovantes={comprovantes}
                        movimentacoes={[]}
                        onReviewComprovante={handleReviewComprovanteByEmployer}
                      />
                    )}

                    {activePersona === 'clube' && times.length > 0 && (
                      <DashboardClube 
                        time={times.find(t => t.id === currentTimeId) || times[0]}
                        comprovantes={comprovantes}
                      />
                    )}

                    {activePersona === 'admin' && (
                      <AdminPanel 
                        isSupabaseLive={isSupabaseLive}
                        diagnosticStatus={diagnosticStatus}
                        diagnosticErrors={diagnosticErrors}
                        recheckConnectivity={hydrateDatabase}
                        onTriggerGoalSimulation={simulateLiveGoalMatch}
                        onTriggerTransactionSimulation={simulateTransactionPulse}
                        onInsertPendingReceiptSimulation={simulatePendingReceiptInjection}
                        onResetDatabaseToMock={handleResetDatabaseToMock}
                      />
                    )}
                  </div>

                  {activePersona !== 'admin' && (
                    <ContactsManager 
                      entityId={activePersona === 'usuario' ? currentUserId : (activePersona === 'empresa' ? currentEmpresaId : currentTimeId)}
                      entityType={activePersona === 'usuario' ? 'usuario' : (activePersona === 'empresa' ? 'empresa' : 'clube')}
                      contatos={contatos}
                      onAddContato={handleAddContato}
                      onUpdateContato={handleUpdateContato}
                      onDeleteContato={handleDeleteContato}
                    />
                  )}
                </div>
              </div>
            )}

          </div>

          {/* ==========================================
              BOTTOM GLASSMORPHISM NAV BAR COMPONENT
             ========================================== */}
          <div className="p-3.5 bg-black/90 border-t border-zinc-900 pb-5 flex justify-around items-center select-none backdrop-blur-xl relative z-30 flex-shrink-0 md:hidden">
            {/* Tab 1: Home */}
            <button 
              onClick={() => { setActiveTab('home'); setNotificationsOpen(false); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'home' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <HomeIcon className="w-5.5 h-5.5" />
              <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Home</span>
            </button>

            {/* Tab 2: Empresas */}
            <button 
              onClick={() => { setActiveTab('parceiros'); setNotificationsOpen(false); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'parceiros' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <ShoppingBag className="w-5.5 h-5.5" />
              <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Empresas</span>
            </button>

            {/* Simulated central action: scanner popup QR (Comprovante) */}
            <button 
              onClick={() => setUploadModalOpen(true)}
              className="w-13 h-13 -mt-6 bg-[#FF5500] hover:bg-orange-600 border-2 border-black rounded-full flex items-center justify-center cursor-pointer text-white shadow-xl hover:scale-105 text-orange-glow transition-all"
              title="Scanner de Comprovante"
            >
              <Plus className="w-6.5 h-6.5 font-bold" />
            </button>

            {/* Tab 3: TikTok Reels */}
            <button 
              onClick={() => { setActiveTab('reels'); setNotificationsOpen(false); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all relative ${
                activeTab === 'reels' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Radio className="w-5.5 h-5.5" />
              {activeTab !== 'reels' && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#FFD700] animate-ping" />
              )}
              <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Reels</span>
            </button>

            {/* Tab 4: Classificação */}
            <button 
              onClick={() => { setActiveTab('ranking'); setNotificationsOpen(false); }}
              className={`flex flex-col items-center gap-1 cursor-pointer transition-all ${
                activeTab === 'ranking' ? 'text-orange-500 scale-105 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Trophy className="w-5.5 h-5.5" />
              <span className="text-[9px] tracking-wide uppercase font-mono font-bold leading-none">Várzea</span>
            </button>
          </div>

          {/* ==========================================
              MODAL DRAWERS & INTERCONNECTED VISUAL SHEETS
             ========================================== */}
          <AnimatePresence>
            {/* 1. Upload receipt drawer component */}
            {uploadModalOpen && (
              <UploadReceiptModal 
                times={times} 
                empresas={empresas} 
                onSubmit={handleUploadReceipt} 
                onClose={() => setUploadModalOpen(false)}
                defaultClubId={activeUser.time_coracao_id}
                triggerToast={triggerVisualToast}
              />
            )}

            {/* 1.1 Cadastro Empresa Modal Overlay */}
            {cadastroEmpresaOpen && (
              <CadastroEmpresaModal
                onAddEmpresaLocal={handleAddEmpresaLocal}
                onClose={() => setCadastroEmpresaOpen(false)}
                triggerToast={triggerVisualToast}
              />
            )}

            {/* 1.2 Cadastro Clube Modal Overlay */}
            {cadastroClubeOpen && (
              <CadastroClubeModal
                onAddClubeLocal={handleAddClubeLocal}
                onClose={() => setCadastroClubeOpen(false)}
                triggerToast={triggerVisualToast}
              />
            )}

            {/* 2. Patrocinador Empresa details sheet */}
            {selectedEmpresaSheet && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center p-4"
                onClick={() => setSelectedEmpresaSheet(null)}
              >
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-[#0b0b0d] border border-zinc-800 w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Banner */}
                  <div className="relative h-40 w-full bg-zinc-900">
                    <img 
                      src={selectedEmpresaSheet.banner} 
                      alt="banner" 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b0d] via-black/25 to-transparent" />
                    
                    {/* Close button */}
                    <button 
                      onClick={() => setSelectedEmpresaSheet(null)}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-[#FF5500] hover:text-black hover:scale-105 rounded-full p-2 text-white border border-white/10 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Sponsor badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FF5500] to-[#FFD700] p-[1px] rounded-lg shadow-md">
                      <div className="bg-black text-white font-extrabold text-[10px] uppercase font-display tracking-wider py-1 px-2.5 rounded-[7px]">
                        ★ PARCEIRO OFICIAL
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-5 text-left font-sans">
                    <div className="flex gap-4 items-center">
                      <img 
                        src={selectedEmpresaSheet.logo} 
                        alt="logo" 
                        referrerPolicy="no-referrer"
                        className="w-14 h-14 rounded-2xl object-cover border-2 border-[#FF5500]/50"
                      />
                      <div className="min-w-0 flex-1">
                        <span className="text-[9px] font-mono font-bold text-[#FFD700] uppercase tracking-widest">{selectedEmpresaSheet.categoria}</span>
                        <h3 className="text-xl font-black text-white tracking-tight leading-tight uppercase font-display mt-0.5">
                          {selectedEmpresaSheet.nome}
                        </h3>
                        <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#FF5500]" />
                          <span>{selectedEmpresaSheet.bairro || 'Itaquera'}, São Paulo</span>
                        </p>
                      </div>
                    </div>

                    {/* Highlights stats row */}
                    <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-center">
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest">COTA DE REPASSE DO TIME</span>
                        <p className="text-base font-black text-orange-500 mt-0.5">5.0%</p>
                      </div>
                      <div>
                        <span className="text-[8px] text-zinc-500 uppercase tracking-widest">MULTIPLIER DE PONTOS</span>
                        <p className="text-base font-black text-[#FFD700] mt-0.5">
                          {selectedEmpresaSheet.pontos_por_real || 15}x / R$
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-[#FF5500] pl-2">
                        Descrição do Patrocinador
                      </h4>
                      <p className="text-xs text-zinc-400 leading-relaxed font-sans">
                        Este patrocinador é credenciado oficialmente pelo ecossistema do Futebol de Várzea! Em cada nota de consumo enviada, pontos de lealdade são creditados na sua conta para fortalecer sua equipe de coração, impulsionando a comissão doada para equipar times do campeonato de várzea.
                      </p>
                    </div>

                    {/* Affiliated sponsors information */}
                    <div className="bg-orange-500/5 border border-orange-500/10 p-3 rounded-xl space-y-1">
                      <span className="text-[9px] font-mono tracking-wider font-extrabold text-[#FF5500] uppercase">BENEFÍCIOS COLETIVOS</span>
                      <p className="text-xs text-zinc-300 leading-relaxed font-sans">
                        Comprando aqui você financia diretamente bolas, chuteiras de treino e transporte do <strong className="text-[#FFD700]">Laranja Mecânica de Itaquera FC</strong> e de agremiações esportivas do terrão.
                      </p>
                    </div>

                    {/* Call to action message link */}
                    <div className="pt-2">
                      <a 
                        href={`https://wa.me/${selectedEmpresaSheet.telefone || '5511999998888'}?text=${encodeURIComponent(`Olá! Vi sua empresa ${selectedEmpresaSheet.nome} no app de Sócio-Torcedor de Várzea. Gostaria de solicitar um pedido!`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full bg-[#25D366] hover:bg-[#1ebd53] text-black font-extrabold uppercase py-3.5 px-4 rounded-xl text-center text-xs tracking-wider shadow-lg active:scale-95 transition-all flex items-center justify-center gap-2"
                      >
                        <MessageCircle className="w-4.5 h-4.5 text-black fill-current" />
                        <span>Fazer Pedido no WhatsApp</span>
                      </a>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

            {/* 3. Clube de Futebol Parceiro details sheet */}
            {selectedClubeSheet && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center p-4"
                onClick={() => setSelectedClubeSheet(null)}
              >
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-[#0b0b0d] border border-zinc-800 w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl relative p-6 space-y-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button 
                    onClick={() => setSelectedClubeSheet(null)}
                    className="absolute top-4 right-4 bg-zinc-900 hover:bg-[#FF5500] hover:text-black rounded-full p-1.5 text-zinc-500 hover:scale-105 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Header Crest */}
                  <div className="flex flex-col items-center text-center space-y-3 pt-4 select-none">
                    <img 
                      src={selectedClubeSheet.logo} 
                      alt="escudo" 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-4 border-yellow-400 bg-zinc-950 p-2 shadow-lg hover:rotate-6 transition-transform"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-yellow-400 uppercase tracking-widest">PATROCINADO VÁRZEA FC</span>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase font-display leading-none">
                        {selectedClubeSheet.nome}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium">Sede: {selectedClubeSheet.bairro || 'Terrão no Bairro'}</p>
                    </div>
                  </div>

                  {/* Stats columns */}
                  <div className="grid grid-cols-3 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase">CLASSIFICAÇÃO</span>
                      <p className="text-sm font-black text-white mt-0.5">{selectedClubeSheet.pontos || 0} Pts</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase">MEMBROS</span>
                      <p className="text-sm font-black text-white mt-0.5">850+</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase">REPASSADO</span>
                      <p className="text-sm font-black text-[#25D366] mt-0.5">R$ 1.250,00</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-left font-sans text-xs">
                    <span className="text-xs font-bold font-display uppercase tracking-wider text-white border-l-2 border-yellow-400 pl-2 block select-none">
                      Apoiado Comercialmente no Bairro
                    </span>
                    <p className="text-zinc-400 leading-relaxed font-sans">
                      Apoiar este time no aplicativo significa que todo cupom fiscal de hamburguerias, padarias ou barbearias que você carregar reverterá automaticamente auxílios em comissões de patrocínio para a escolinha e fardamentos desta comunidade esportiva.
                    </p>
                  </div>

                  {/* Confirm default support club button */}
                  <button
                    onClick={() => {
                      triggerVisualToast({
                        id: `support-${selectedClubeSheet.id}-${Date.now()}`,
                        message: `APOIANDO ${selectedClubeSheet.nome.toUpperCase()}!`,
                        sub: `Seus cupons doam prioridade para este time de várzea.`,
                        iconType: 'time'
                      });
                      setSelectedClubeSheet(null);
                    }}
                    className="w-full bg-[#FF5500] hover:bg-orange-600 text-white font-extrabold uppercase py-3.5 px-4 rounded-xl text-center text-xs tracking-wider shadow-md active:scale-95 transition-all flex items-center justify-center gap-2 text-orange-glow"
                  >
                    <Heart className="w-4.5 h-4.5 fill-current" />
                    <span>Apoiar Oficialmente este Time</span>
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* 4. Sócio Torcedor Usuario profile sheet context */}
            {selectedUsuarioSheet && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-50 flex items-end justify-center p-4"
                onClick={() => setSelectedUsuarioSheet(null)}
              >
                <motion.div 
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="bg-[#0b0b0d] border border-zinc-800 w-full max-w-md rounded-t-3xl overflow-hidden shadow-2xl relative p-6 space-y-5"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Close button */}
                  <button 
                    onClick={() => setSelectedUsuarioSheet(null)}
                    className="absolute top-4 right-4 bg-zinc-900 hover:bg-[#FF5500] hover:text-black rounded-full p-1.5 text-zinc-500 hover:scale-105 transition-all cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>

                  {/* Profile Header details */}
                  <div className="flex flex-col items-center text-center space-y-3 pt-4 select-none">
                    <img 
                      src={selectedUsuarioSheet.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120&auto=format&fit=crop'} 
                      alt="usuario-avatar" 
                      referrerPolicy="no-referrer"
                      className="w-20 h-20 rounded-full object-cover border-4 border-orange-500 bg-zinc-950 p-0.5 shadow-lg"
                    />
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-bold text-orange-500 uppercase tracking-widest">SÓCIO APOIADOR ATIVO</span>
                      <h3 className="text-2xl font-black text-white tracking-tight uppercase font-display leading-none">
                        {selectedUsuarioSheet.nome}
                      </h3>
                      <p className="text-xs text-zinc-400 font-medium">Apoiador do Bairro: Itaquera</p>
                    </div>
                  </div>

                  {/* Users stats profile dashboard */}
                  <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-900 font-mono text-center">
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase">NÍVEL DO SÓCIO</span>
                      <p className="text-base font-black text-[#FF5500] mt-0.5">Lvl {selectedUsuarioSheet.nivel}</p>
                    </div>
                    <div>
                      <span className="text-[8px] text-zinc-500 uppercase">PONTUAÇÃO COMUNITÁRIA</span>
                      <p className="text-base font-black text-[#FFD700] mt-0.5">{selectedUsuarioSheet.saldo_pontos || 12450} Pts</p>
                    </div>
                  </div>

                  <div className="space-y-2 text-left font-sans text-xs">
                    <span className="text-[9px] font-mono font-extrabold text-[#FFD700] uppercase tracking-widest block select-none">ESTATÍSTICA SOCIAL DOS JOGOS</span>
                    <p className="text-zinc-400 leading-relaxed font-sans">
                      Membros ativos escalam o nível de apoiador do ecossistema e pontuam nas tabelas de liderança de torcida. Quanto mais compras fortalecidas, mais recursos de apoio voltam para os times do terrão.
                    </p>
                  </div>

                  <button
                    onClick={() => setSelectedUsuarioSheet(null)}
                    className="w-full bg-[#FF5500] hover:bg-orange-600 text-white font-extrabold uppercase py-3 px-4 rounded-xl text-center text-xs tracking-wider shadow-md active:scale-95 transition-all text-orange-glow"
                  >
                    <span>Concluído</span>
                  </button>
                </motion.div>
              </motion.div>
            )}

            {/* 5. Home Video Playing overlay shorts modal */}
            {homeVideoPlaying && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/95 backdrop-blur-md z-50 flex items-center justify-center p-4"
                onClick={() => setHomeVideoPlaying(null)}
              >
                <div 
                  className="bg-[#09090b] border border-orange-500/30 w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Aspect-video structure */}
                  <div className="relative aspect-[9/16] bg-black max-h-[580px] w-full flex items-center justify-center overflow-hidden">
                    <video 
                      src={homeVideoPlaying.video_url} 
                      autoPlay 
                      loop 
                      playsInline 
                      muted={false}
                      className="w-full h-full object-cover"
                    />

                    {/* Dark gradient shadow overlays */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/80 pointer-events-none" />

                    {/* Back header context info */}
                    <div className="absolute top-4 left-4 flex items-center gap-2">
                      <img 
                        src={homeVideoPlaying.empresa_logo} 
                        alt="logo" 
                        referrerPolicy="no-referrer"
                        className="w-8 h-8 rounded-lg object-cover border border-[#FF5500]/50"
                      />
                      <div className="text-left leading-none">
                        <span className="text-[9px] font-mono tracking-widest text-[#FF5500] uppercase font-black block">REEL DO PATROCINADOR</span>
                        <h4 className="text-xs font-black text-white font-display uppercase">{homeVideoPlaying.empresa_nome}</h4>
                      </div>
                    </div>

                    <button 
                      onClick={() => setHomeVideoPlaying(null)}
                      className="absolute top-4 right-4 bg-black/60 hover:bg-[#FF5500] hover:text-black rounded-full p-2 text-white border border-white/15 transition-all cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Video specifications layout in overlay bottom bar */}
                    <div className="absolute bottom-16 inset-x-0 p-4 space-y-2.5 text-left z-15">
                      <p className="text-xs font-semibold font-sans text-zinc-200 leading-relaxed text-shadow shadow-black/80">
                        {homeVideoPlaying.descricao}
                      </p>

                      <div className="flex gap-2.5 items-center select-none bg-black/65 border border-white/10 px-3 py-2 rounded-xl backdrop-blur-md">
                        <div className="flex-1 min-w-0">
                          <span className="text-[7px] font-mono tracking-widest text-yellow-400 uppercase font-bold block">Cupom Exclusivo</span>
                          <span className="text-xs font-black text-white font-mono">{homeVideoPlaying.cupom_codigo || 'CRIASVARZEA'}</span>
                        </div>
                        <button 
                          onClick={() => {
                            triggerVisualToast({
                              id: `coupon-${Date.now()}`,
                              message: '🔥 CUPOM RESGATADO!',
                              sub: `Código [${homeVideoPlaying.cupom_codigo || 'CRIASVARZEA'}] copiado com sucesso!`,
                              iconType: 'promocao'
                            });
                            setHomeVideoPlaying(null);
                          }}
                          className="bg-[#FF5500] hover:bg-orange-600 text-white font-black font-display text-[9px] px-3 py-1.5 rounded-lg uppercase cursor-pointer transition-colors border-0"
                        >
                          Copiar Código
                        </button>
                      </div>
                    </div>

                    {/* Side action panel bars */}
                    <div className="absolute right-4 bottom-32 flex flex-col items-center gap-4 text-center z-20">
                      <div className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF5500]/20 flex items-center justify-center text-white border border-white/10">
                          <Heart className="w-4 h-4 text-red-500 fill-red-500" />
                        </div>
                        <span className="text-[9px] text-zinc-300 font-mono font-bold">{homeVideoPlaying.curtidas || 480}</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-black/60 hover:bg-[#FF5500]/20 flex items-center justify-center text-white border border-white/10">
                          <MessageCircle className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-[9px] text-zinc-300 font-mono font-bold">{homeVideoPlaying.comentarios_count || 12}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          </div>
        </div>
      )}
    </div>
  );
}
