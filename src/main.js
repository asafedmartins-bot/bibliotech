import './style.css'
import { supabase } from './supabase.js'

// ==========================================
// 🎯 ELEMENTOS DO DOM
// ==========================================

// Autenticação & Barra do Topo
const secaoAuth = document.getElementById('secao-auth')
const conteudoPrincipal = document.getElementById('conteudo-principal')
const barraUsuario = document.getElementById('barra-usuario')
const textoUsuario = document.getElementById('texto-usuario')
const btnSair = document.getElementById('btn-sair')

const tabLogin = document.getElementById('tab-login')
const tabCadastro = document.getElementById('tab-cadastro')
const formLogin = document.getElementById('form-login')
const formCadastro = document.getElementById('form-cadastro')
const loginLembrar = document.getElementById('login-lembrar')

// Olhos de visualização de senha
const loginSenhaInput = document.getElementById('login-senha')
const cadSenhaInput = document.getElementById('cad-senha')
const btnToggleSenhaLogin = document.getElementById('btn-toggle-senha-login')
const btnToggleSenhaCad = document.getElementById('btn-toggle-senha-cad')

// Navegação por Abas
const navAbaCatalogo = document.getElementById('nav-aba-catalogo')
const navAbaMeusLivros = document.getElementById('nav-aba-meus-livros')
const navAbaAdminCatalogo = document.getElementById('nav-aba-admin-catalogo')
const navAbaAdminSolicitacoes = document.getElementById('nav-aba-admin-solicitacoes')
const navAbaRanking = document.getElementById('nav-aba-ranking')

// Seções de Conteúdo
const secaoCatalogo = document.getElementById('secao-catalogo')
const secaoMeusLivros = document.getElementById('secao-meus-livros')
const secaoAdminCadastro = document.getElementById('secao-admin-cadastro')
const secaoAdminSolicitacoes = document.getElementById('secao-admin-solicitacoes')
const secaoRanking = document.getElementById('secao-ranking')

// Contadores de Notificação
const contadorMeusLivros = document.getElementById('contador-meus-livros')
const contadorSolicitacoes = document.getElementById('contador-solicitacoes')

// Catálogo, Busca e Paginação
const listaLivros = document.getElementById('lista-livros')
const inputBusca = document.getElementById('input-busca')
const badgeTotalLivros = document.getElementById('badge-total-livros')
const pagInicio = document.getElementById('pag-inicio')
const pagFim = document.getElementById('pag-fim')
const pagTotal = document.getElementById('pag-total')
const paginaAtualTexto = document.getElementById('pagina-atual-texto')
const totalPaginasTexto = document.getElementById('total-paginas-texto')
const btnPagAnterior = document.getElementById('btn-pag-anterior')
const btnPagProxima = document.getElementById('btn-pag-proxima')
const numerosPaginas = document.getElementById('numeros-paginas')
const controlesPaginacao = document.getElementById('controles-paginacao')

// Minhas Leituras (Ativas e Histórico)
const statLivroAtivo = document.getElementById('stat-livro-ativo')
const statLivrosLidos = document.getElementById('stat-livros-lidos')
const statPosicaoRanking = document.getElementById('stat-posicao-ranking')
const listaLeituraAtiva = document.getElementById('lista-leitura-ativa')
const listaHistoricoLidos = document.getElementById('lista-historico-lidos')
const badgeHistoricoTotal = document.getElementById('badge-historico-total')

// Ranking Escolar (Hall da Fama)
const podio1Nome = document.getElementById('podio-1-nome')
const podio1Matricula = document.getElementById('podio-1-matricula')
const podio1Livros = document.getElementById('podio-1-livros')
const podio2Nome = document.getElementById('podio-2-nome')
const podio2Matricula = document.getElementById('podio-2-matricula')
const podio2Livros = document.getElementById('podio-2-livros')
const podio3Nome = document.getElementById('podio-3-nome')
const podio3Matricula = document.getElementById('podio-3-matricula')
const podio3Livros = document.getElementById('podio-3-livros')
const tabelaRankingCorpo = document.getElementById('tabela-ranking-corpo')
const badgeTotalRanqueados = document.getElementById('badge-total-ranqueados')

// Gestão Admin
const tabelaEmprestimos = document.getElementById('tabela-emprestimos')
const formLivro = document.getElementById('form-livro')
const btnSalvarLivro = document.getElementById('btn-salvar-livro')

// Modais em Tela
const modalConfirm = document.getElementById('modal-confirm')
const modalConfirmBox = document.getElementById('modal-confirm-box')
const modalConfirmTitulo = document.getElementById('modal-confirm-titulo')
const modalConfirmDesc = document.getElementById('modal-confirm-desc')
const modalConfirmBtnOk = document.getElementById('modal-confirm-btn-ok')
const modalConfirmBtnCancelar = document.getElementById('modal-confirm-btn-cancelar')

const modalData = document.getElementById('modal-data')
const modalDataBox = document.getElementById('modal-data-box')
const modalDataTitulo = document.getElementById('modal-data-titulo')
const modalDataDesc = document.getElementById('modal-data-desc')
const modalDataInput = document.getElementById('modal-data-input')
const modalDataBtnOk = document.getElementById('modal-data-btn-ok')
const modalDataBtnCancelar = document.getElementById('modal-data-btn-cancelar')

const toastContainer = document.getElementById('toast-container')

// Constantes e Estados
const CAPA_PADRAO = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=300&q=80'
const LIVROS_POR_PAGINA = 9 // 9 livros por página (3x3 grid)

let perfilAtual = null
let todosLivros = []
let livrosFiltrados = []
let paginaAtual = 1

// ==========================================
// 👁️ MOSTRAR / ESCONDER SENHA (OLHO)
// ==========================================

function alternarVisibilidadeSenha(input, botao) {
  const isPassword = input.type === 'password'
  input.type = isPassword ? 'text' : 'password'
  botao.innerHTML = `<i data-lucide="${isPassword ? 'eye-off' : 'eye'}" class="w-4 h-4"></i>`
  if (window.lucide) window.lucide.createIcons()
}

btnToggleSenhaLogin.addEventListener('click', () => alternarVisibilidadeSenha(loginSenhaInput, btnToggleSenhaLogin))
btnToggleSenhaCad.addEventListener('click', () => alternarVisibilidadeSenha(cadSenhaInput, btnToggleSenhaCad))

// ==========================================
// 🔔 MODAIS E TOASTS NA TELA
// ==========================================

function mostrarToast(mensagem, tipo = 'sucesso') {
  const toast = document.createElement('div')
  const cor = tipo === 'sucesso' ? 'bg-forest text-white' : 'bg-terracotta text-white'
  toast.className = `${cor} px-4 py-3 rounded-xl shadow-xl text-xs font-bold tracking-wide flex items-center gap-2 transform transition-all duration-300 translate-y-2 opacity-0 z-50`
  toast.innerHTML = `<i data-lucide="${tipo === 'sucesso' ? 'check-circle' : 'alert-circle'}" class="w-4 h-4"></i> ${mensagem}`

  toastContainer.appendChild(toast)
  if (window.lucide) window.lucide.createIcons()

  setTimeout(() => toast.classList.remove('translate-y-2', 'opacity-0'), 10)
  setTimeout(() => {
    toast.classList.add('translate-y-2', 'opacity-0')
    setTimeout(() => toast.remove(), 300)
  }, 4000)
}

function abrirModalConfirmacao(titulo, descricao, onConfirm) {
  modalConfirmTitulo.innerText = titulo
  modalConfirmDesc.innerText = descricao

  modalConfirm.classList.remove('opacity-0', 'pointer-events-none')
  modalConfirmBox.classList.remove('scale-95')

  const fechar = () => {
    modalConfirm.classList.add('opacity-0', 'pointer-events-none')
    modalConfirmBox.classList.add('scale-95')
    modalConfirmBtnOk.onclick = null
    modalConfirmBtnCancelar.onclick = null
  }

  modalConfirmBtnCancelar.onclick = fechar
  modalConfirmBtnOk.onclick = () => {
    fechar()
    onConfirm()
  }
}

function abrirModalData(titulo, descricao, onConfirm) {
  modalDataTitulo.innerText = titulo
  modalDataDesc.innerText = descricao

  // Data padrão: hoje + 14 dias
  const dataSugerida = new Date()
  dataSugerida.setDate(dataSugerida.getDate() + 14)
  const ano = dataSugerida.getFullYear()
  const mes = String(dataSugerida.getMonth() + 1).padStart(2, '0')
  const dia = String(dataSugerida.getDate()).padStart(2, '0')
  modalDataInput.value = `${ano}-${mes}-${dia}`

  modalData.classList.remove('opacity-0', 'pointer-events-none')
  modalDataBox.classList.remove('scale-95')

  const fechar = () => {
    modalData.classList.add('opacity-0', 'pointer-events-none')
    modalDataBox.classList.add('scale-95')
    modalDataBtnOk.onclick = null
    modalDataBtnCancelar.onclick = null
  }

  modalDataBtnCancelar.onclick = fechar
  modalDataBtnOk.onclick = () => {
    const valorData = modalDataInput.value
    if (!valorData) {
      mostrarToast('Por favor, selecione uma data no calendário.', 'erro')
      return
    }
    const partes = valorData.split('-')
    const dataBR = `${partes[2]}/${partes[1]}/${partes[0]}`
    fechar()
    onConfirm(dataBR)
  }
}

// ==========================================
// 🔄 PERSISTÊNCIA DE SESSÃO ("MANTER CONECTADO")
// ==========================================

async function verificarSessaoInicial() {
  const lembrarAtivo = localStorage.getItem('bibliotech_lembrar') === 'true'
  const emailSalvo = localStorage.getItem('bibliotech_email')
  const usuarioCache = localStorage.getItem('bibliotech_usuario')

  // 1. CARREGAMENTO INSTANTÂNEO (ZERO FLASH):
  // Se o usuário marcou "Manter Conectado" e os dados estão salvos, entra na hora!
  if (lembrarAtivo && usuarioCache) {
    try {
      const usuario = JSON.parse(usuarioCache)
      iniciarSessao(usuario)
    } catch (e) {
      console.error('Erro ao ler cache do usuário:', e)
    }
  }

  // 2. Validação/Atualização com o Supabase em background
  if (lembrarAtivo && emailSalvo) {
    const { data: usuario, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', emailSalvo)
      .single()

    if (!error && usuario) {
      localStorage.setItem('bibliotech_usuario', JSON.stringify(usuario))
      if (!perfilAtual) {
        iniciarSessao(usuario)
      } else {
        perfilAtual = usuario
      }
      return
    } else if (error) {
      // Se não encontrou o usuário ou deu erro, limpa e exibe login
      document.documentElement.classList.remove('usuario-lembrado')
      localStorage.removeItem('bibliotech_lembrar')
      localStorage.removeItem('bibliotech_email')
      localStorage.removeItem('bibliotech_usuario')
      secaoAuth.style.display = 'block'
      conteudoPrincipal.style.display = 'none'
      barraUsuario.style.display = 'none'
      perfilAtual = null
      return
    }
  }

  // 3. Fallback: Checa sessão nativa do Supabase Auth
  const { data: { session } } = await supabase.auth.getSession()
  if (session && session.user) {
    const { data: usuario } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', session.user.email)
      .single()

    if (usuario) {
      iniciarSessao(usuario)
      return
    }
  }

  // Se não estiver logado, garante que a tela de login fique visível
  document.documentElement.classList.remove('usuario-lembrado')
  secaoAuth.style.display = 'block'
  if (window.lucide) window.lucide.createIcons()
}

function iniciarSessao(usuario) {
  perfilAtual = usuario
  secaoAuth.style.display = 'none'
  conteudoPrincipal.style.display = 'block'
  barraUsuario.style.display = 'flex'

  if (usuario.tipo === 'admin') {
    textoUsuario.innerHTML = `<span class="font-bold">${usuario.nome}</span> <span class="text-brass font-bold">(Administrador)</span>`
    configurarVisaoAdmin()
  } else {
    const cod = usuario.cod_aluno || usuario.matricula
    const codTexto = cod ? ` • Cód: ${cod}` : ''
    textoUsuario.innerHTML = `<span class="font-bold">${usuario.nome}</span><span class="text-zinc-500 font-normal">${codTexto}</span>`
    configurarVisaoAluno()
  }

  carregarLivros()
  if (window.lucide) window.lucide.createIcons()
}

btnSair.addEventListener('click', async () => {
  abrirModalConfirmacao('Encerrar Sessão', 'Deseja realmente sair da sua conta?', async () => {
    await supabase.auth.signOut()
    localStorage.removeItem('bibliotech_lembrar')
    localStorage.removeItem('bibliotech_email')
    localStorage.removeItem('bibliotech_usuario')
    document.documentElement.classList.remove('usuario-lembrado')
    perfilAtual = null
    window.location.reload()
  })
})

// ==========================================
// 🔀 CONTROLE DE ABAS (ALUNO, ADMIN & RANKING)
// ==========================================

function configurarVisaoAluno() {
  navAbaCatalogo.style.display = 'flex'
  navAbaMeusLivros.style.display = 'flex'
  navAbaRanking.style.display = 'flex'
  navAbaAdminCatalogo.style.display = 'none'
  navAbaAdminSolicitacoes.style.display = 'none'

  ativarAba('catalogo')
  carregarMeusLivros()
}

function configurarVisaoAdmin() {
  navAbaCatalogo.style.display = 'none'
  navAbaMeusLivros.style.display = 'none'
  navAbaAdminCatalogo.style.display = 'flex'
  navAbaAdminSolicitacoes.style.display = 'flex'
  navAbaRanking.style.display = 'flex'

  ativarAba('admin-catalogo')
  carregarEmprestimosAdmin()
}

function ativarAba(nomeAba) {
  const abas = [
    { id: 'catalogo', btn: navAbaCatalogo, sec: secaoCatalogo },
    { id: 'meus-livros', btn: navAbaMeusLivros, sec: secaoMeusLivros },
    { id: 'admin-catalogo', btn: navAbaAdminCatalogo, sec: secaoAdminCadastro },
    { id: 'admin-solicitacoes', btn: navAbaAdminSolicitacoes, sec: secaoAdminSolicitacoes },
    { id: 'ranking', btn: navAbaRanking, sec: secaoRanking }
  ]

  abas.forEach(item => {
    if (!item.btn || !item.sec) return
    const isAtiva = item.id === nomeAba
    item.sec.style.display = isAtiva ? 'block' : 'none'

    if (isAtiva) {
      item.btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-ink text-[#faf8f5] shadow-sm flex items-center gap-2 transition-all'
    } else {
      item.btn.className = 'px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-zinc-600 hover:text-ink hover:bg-white rounded-xl border border-transparent hover:border-[#ded9cd] transition-all flex items-center gap-2'
    }
  })

  // Trava de segurança: Se NÃO for administrador, NUNCA exibe telas de admin!
  if (!perfilAtual || perfilAtual.tipo !== 'admin') {
    if (secaoAdminCadastro) secaoAdminCadastro.style.display = 'none'
    if (secaoAdminSolicitacoes) secaoAdminSolicitacoes.style.display = 'none'
  }

  if (nomeAba === 'admin-catalogo' && perfilAtual && perfilAtual.tipo === 'admin') {
    secaoCatalogo.style.display = 'block'
  }

  if (nomeAba === 'ranking') {
    carregarRanking()
  }

  if (window.lucide) window.lucide.createIcons()
}

navAbaCatalogo.addEventListener('click', () => ativarAba('catalogo'))
navAbaMeusLivros.addEventListener('click', () => {
  ativarAba('meus-livros')
  carregarMeusLivros()
})
navAbaAdminCatalogo.addEventListener('click', () => ativarAba('admin-catalogo'))
navAbaAdminSolicitacoes.addEventListener('click', () => {
  ativarAba('admin-solicitacoes')
  carregarEmprestimosAdmin()
})
navAbaRanking.addEventListener('click', () => ativarAba('ranking'))

// Abas de Login / Cadastro
tabLogin.addEventListener('click', () => {
  tabLogin.className = 'flex-1 py-2.5 rounded-xl bg-white text-ink shadow-sm transition-all'
  tabCadastro.className = 'flex-1 py-2.5 rounded-xl text-zinc-500 hover:text-ink transition-all'
  formLogin.style.display = 'block'
  formCadastro.style.display = 'none'
  if (window.lucide) window.lucide.createIcons()
})

tabCadastro.addEventListener('click', () => {
  tabCadastro.className = 'flex-1 py-2.5 rounded-xl bg-white text-ink shadow-sm transition-all'
  tabLogin.className = 'flex-1 py-2.5 rounded-xl text-zinc-500 hover:text-ink transition-all'
  formCadastro.style.display = 'block'
  formLogin.style.display = 'none'
  if (window.lucide) window.lucide.createIcons()
})

// ==========================================
// 🔑 CADASTRO E LOGIN COM VALIDAÇÃO
// ==========================================

formCadastro.addEventListener('submit', async (e) => {
  e.preventDefault()

  const nome = document.getElementById('cad-nome').value.trim()
  const codAluno = document.getElementById('cad-matricula').value.trim()
  const email = document.getElementById('cad-email').value.trim().toLowerCase()
  const password = cadSenhaInput.value

  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password
  })

  if (authError && !authError.message.includes('already registered')) {
    return mostrarToast('Erro ao criar conta: ' + authError.message, 'erro')
  }

  const { error: profileError } = await supabase.from('usuarios').insert([{
    nome,
    cod_aluno: codAluno,
    email,
    tipo: 'aluno'
  }])

  if (profileError && !profileError.message.includes('duplicate')) {
    return mostrarToast('Erro ao registrar perfil: ' + profileError.message, 'erro')
  }

  mostrarToast('🎉 Carteirinha digital emitida! Bem-vindo(a)!')
  const { data: usuario } = await supabase.from('usuarios').select('*').eq('email', email).single()

  if (loginLembrar && loginLembrar.checked && usuario) {
    localStorage.setItem('bibliotech_lembrar', 'true')
    localStorage.setItem('bibliotech_email', email)
    localStorage.setItem('bibliotech_usuario', JSON.stringify(usuario))
    document.documentElement.classList.add('usuario-lembrado')
  }

  iniciarSessao(usuario)
})

formLogin.addEventListener('submit', async (e) => {
  e.preventDefault()

  const email = document.getElementById('login-email').value.trim().toLowerCase()
  const password = loginSenhaInput.value
  const manterConectado = loginLembrar.checked

  if (!email || !password) {
    return mostrarToast('Por favor, informe seu e-mail e senha.', 'erro')
  }

  // 1. Tenta autenticar pelo Supabase Auth (para usuários reais cadastrados)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })

  let usuarioLogado = null

  if (!authError && authData?.user) {
    // Autenticação oficial no Supabase Auth foi um sucesso!
    const { data: usuario, error: errUser } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (errUser || !usuario) {
      return mostrarToast('Perfil de usuário não encontrado no sistema.', 'erro')
    }
    usuarioLogado = usuario
  } else {
    // 2. Se falhou no Auth, pode ser:
    // A) Uma senha incorreta de um usuário que já existe
    // B) Ou uma conta demo/admin gerada direto pelo script SQL (ainda não sincronizada no Auth)
    const { data: usuarioDb } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single()

    if (!usuarioDb) {
      return mostrarToast('E-mail ou senha incorretos.', 'erro')
    }

    // Validação estrita para contas demo/SQL:
    // - Administrador: aceita 'admin123' ou '123456'
    // - Alunos do ranking: aceita '123456'
    const ehAdmin = usuarioDb.tipo === 'admin'
    const senhaValidaDemo = ehAdmin 
      ? (password === 'admin123' || password === '123456')
      : (password === '123456')

    if (senhaValidaDemo) {
      // Tenta registrar no Supabase Auth para oficializar a senha
      const { error: signUpError } = await supabase.auth.signUp({ email, password })
      
      // Se der erro de 'User already registered', significa que a conta já tinha sido criada no Auth com OUTRA senha,
      // logo a senha digitada agora está INCORRETA!
      if (signUpError && signUpError.message.toLowerCase().includes('already registered')) {
        return mostrarToast('E-mail ou senha incorretos.', 'erro')
      }

      usuarioLogado = usuarioDb
    } else {
      // SENHA INCORRETA! Bloqueia o acesso imediatamente!
      return mostrarToast('E-mail ou senha incorretos.', 'erro')
    }
  }

  if (!usuarioLogado) {
    return mostrarToast('E-mail ou senha incorretos.', 'erro')
  }

  // Persistência de sessão (se manter conectado estiver ativo)
  if (manterConectado) {
    localStorage.setItem('bibliotech_lembrar', 'true')
    localStorage.setItem('bibliotech_email', email)
    localStorage.setItem('bibliotech_usuario', JSON.stringify(usuarioLogado))
    document.documentElement.classList.add('usuario-lembrado')
  } else {
    localStorage.removeItem('bibliotech_lembrar')
    localStorage.removeItem('bibliotech_email')
    localStorage.removeItem('bibliotech_usuario')
    document.documentElement.classList.remove('usuario-lembrado')
  }

  mostrarToast(`Boas-vindas, ${usuarioLogado.nome}!`)
  iniciarSessao(usuarioLogado)
})

// ==========================================
// 📚 CATÁLOGO COM PAGINAÇÃO RESPONSIVA
// ==========================================

function rolarParaCatalogo() {
  const secao = document.getElementById('secao-catalogo')
  if (secao) {
    secao.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

async function carregarLivros(filtro = '') {
  badgeTotalLivros.innerText = 'Consultando acervo...'
  
  const { data: livros, error } = await supabase
    .from('livros')
    .select('*')
    .order('id', { ascending: false })

  if (error) {
    console.error('Erro ao consultar livros:', error.message)
    mostrarToast('Erro ao carregar acervo: ' + error.message, 'erro')
    return
  }

  todosLivros = livros || []
  aplicarFiltroLivros(filtro)
}

function aplicarFiltroLivros(termo = '') {
  const termoLimpo = termo.trim().toLowerCase()
  if (!termoLimpo) {
    livrosFiltrados = [...todosLivros]
  } else {
    livrosFiltrados = todosLivros.filter(l => 
      (l.titulo && l.titulo.toLowerCase().includes(termoLimpo)) ||
      (l.autor && l.autor.toLowerCase().includes(termoLimpo)) ||
      (l.categoria && l.categoria.toLowerCase().includes(termoLimpo))
    )
  }

  paginaAtual = 1
  renderizarPaginaAtual()
}

function renderizarPaginaAtual() {
  listaLivros.innerHTML = ''

  if (livrosFiltrados.length === 0) {
    listaLivros.innerHTML = `
      <div class="col-span-full py-16 text-center border-2 border-dashed border-[#ded9cd] rounded-3xl bg-white/70">
        <i data-lucide="book-x" class="w-10 h-10 text-zinc-400 mx-auto mb-3"></i>
        <p class="font-serif text-lg font-bold text-ink">Nenhuma obra localizada</p>
        <p class="text-xs text-zinc-500 mt-1">Tente pesquisar por outro título, autor ou gênero literário.</p>
      </div>
    `
    badgeTotalLivros.innerText = '0 obras'
    pagInicio.innerText = '0'
    pagFim.innerText = '0'
    pagTotal.innerText = '0'
    paginaAtualTexto.innerText = '1'
    totalPaginasTexto.innerText = '1'
    controlesPaginacao.style.display = 'none'
    if (window.lucide) window.lucide.createIcons()
    return
  }

  const totalPaginas = Math.ceil(livrosFiltrados.length / LIVROS_POR_PAGINA) || 1
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas
  if (paginaAtual < 1) paginaAtual = 1

  const inicio = (paginaAtual - 1) * LIVROS_POR_PAGINA
  const fim = Math.min(inicio + LIVROS_POR_PAGINA, livrosFiltrados.length)
  const livrosDaPagina = livrosFiltrados.slice(inicio, fim)

  badgeTotalLivros.innerText = `${livrosFiltrados.length} ${livrosFiltrados.length === 1 ? 'obra' : 'obras'}`
  pagInicio.innerText = inicio + 1
  pagFim.innerText = fim
  pagTotal.innerText = livrosFiltrados.length
  paginaAtualTexto.innerText = paginaAtual
  totalPaginasTexto.innerText = totalPaginas

  livrosDaPagina.forEach((livro) => {
    const temEstoque = livro.quantidade_disponivel > 0
    const card = document.createElement('div')
    card.className = 'group bg-white rounded-3xl border border-[#e8e4db] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between'

    let botaoAcao = ''
    if (perfilAtual && perfilAtual.tipo === 'aluno') {
      if (temEstoque) {
        botaoAcao = `
          <button class="btn-reservar w-full h-10 px-4 text-xs font-bold uppercase tracking-wider bg-ink hover:bg-black text-[#faf8f5] rounded-xl transition-all shadow-sm flex items-center justify-center gap-2" data-id="${livro.id}">
            <i data-lucide="bookmark-plus" class="w-4 h-4 text-brass"></i>
            Reservar Exemplar
          </button>
        `
      } else {
        botaoAcao = `
          <button class="w-full h-10 px-4 text-xs font-semibold bg-[#f0ece2] text-zinc-400 rounded-xl cursor-not-allowed" disabled>
            Exemplares Esgotados
          </button>
        `
      }
    }

    card.innerHTML = `
      <div class="p-5 flex gap-4 items-start">
        <div class="relative flex-shrink-0 group-hover:-translate-y-1 transition-transform duration-300">
          <div class="w-24 h-36 rounded-xl overflow-hidden shadow-[2px_4px_12px_rgba(0,0,0,0.18)] border-l-2 border-l-black/30 bg-zinc-800">
            <img src="${livro.imagem_url || CAPA_PADRAO}" alt="Capa" class="w-full h-full object-cover" onerror="this.src='${CAPA_PADRAO}'" />
          </div>
        </div>

        <div class="flex flex-col justify-between h-36 flex-grow">
          <div>
            <div class="flex items-center gap-1.5 mb-1.5">
              <span class="w-2 h-2 rounded-full ${temEstoque ? 'bg-forest' : 'bg-terracotta'}"></span>
              <span class="text-[10px] uppercase font-bold tracking-wider ${temEstoque ? 'text-forest' : 'text-terracotta'}">
                ${temEstoque ? `${livro.quantidade_disponivel} de ${livro.quantidade_total} disponíveis` : 'Esgotado'}
              </span>
            </div>
            <h3 class="font-serif font-bold text-base text-ink line-clamp-2 leading-snug">${livro.titulo}</h3>
            <p class="text-xs text-zinc-500 mt-1 italic font-serif">${livro.autor}</p>
          </div>
          <div class="text-[10px] text-zinc-400 font-medium flex items-center gap-2">
            <span class="px-2 py-0.5 rounded-md bg-parchment text-zinc-700 font-semibold">${livro.categoria}</span>
            <span>${livro.ano}</span>
          </div>
        </div>
      </div>
      ${botaoAcao ? `<div class="p-3.5 border-t border-[#f4f0e6] bg-[#faf8f5]/80">${botaoAcao}</div>` : ''}
    `

    const btnReservar = card.querySelector('.btn-reservar')
    if (btnReservar) {
      btnReservar.addEventListener('click', () => reservarLivro(livro))
    }

    listaLivros.appendChild(card)
  })

  btnPagAnterior.disabled = (paginaAtual === 1)
  btnPagProxima.disabled = (paginaAtual >= totalPaginas)

  renderizarBotoesPaginacao(totalPaginas)

  if (window.lucide) window.lucide.createIcons()
}

function renderizarBotoesPaginacao(totalPaginas) {
  numerosPaginas.innerHTML = ''
  
  if (totalPaginas <= 1) {
    controlesPaginacao.style.display = 'none'
    return
  }
  controlesPaginacao.style.display = 'flex'

  let inicio = Math.max(1, paginaAtual - 2)
  let fim = Math.min(totalPaginas, paginaAtual + 2)

  if (inicio > 1) {
    numerosPaginas.appendChild(criarBotaoPagina(1))
    if (inicio > 2) {
      const elip = document.createElement('span')
      elip.className = 'px-1.5 text-xs text-zinc-400 select-none'
      elip.innerText = '...'
      numerosPaginas.appendChild(elip)
    }
  }

  for (let p = inicio; p <= fim; p++) {
    numerosPaginas.appendChild(criarBotaoPagina(p))
  }

  if (fim < totalPaginas) {
    if (fim < totalPaginas - 1) {
      const elip = document.createElement('span')
      elip.className = 'px-1.5 text-xs text-zinc-400 select-none'
      elip.innerText = '...'
      numerosPaginas.appendChild(elip)
    }
    numerosPaginas.appendChild(criarBotaoPagina(totalPaginas))
  }
}

function criarBotaoPagina(p) {
  const btn = document.createElement('button')
  const ativa = p === paginaAtual
  btn.className = `w-9 h-9 rounded-xl text-xs font-bold transition-all ${
    ativa
      ? 'bg-ink text-[#faf8f5] shadow-sm'
      : 'bg-white border border-[#ded9cd] text-zinc-700 hover:bg-parchment'
  }`
  btn.innerText = p
  btn.addEventListener('click', () => {
    if (paginaAtual !== p) {
      paginaAtual = p
      renderizarPaginaAtual()
      rolarParaCatalogo()
    }
  })
  return btn
}

btnPagAnterior.addEventListener('click', () => {
  if (paginaAtual > 1) {
    paginaAtual--
    renderizarPaginaAtual()
    rolarParaCatalogo()
  }
})

btnPagProxima.addEventListener('click', () => {
  const totalPaginas = Math.ceil(livrosFiltrados.length / LIVROS_POR_PAGINA)
  if (paginaAtual < totalPaginas) {
    paginaAtual++
    renderizarPaginaAtual()
    rolarParaCatalogo()
  }
})

inputBusca.addEventListener('input', (e) => {
  aplicarFiltroLivros(e.target.value)
})

// ==========================================
// 🛡️ REGRA DE BLOQUEIO: 1 LIVRO ATIVO POR VEZ
// (Livros já devolvidos NÃO bloqueiam!)
// ==========================================

async function reservarLivro(livro) {
  // Apenas 'reservado' ou 'emprestado' contam como bloqueio
  const { data: emprestimosAtivos, error: errCheck } = await supabase
    .from('emprestimos')
    .select('id, livro_titulo, status')
    .eq('aluno_email', perfilAtual.email)
    .in('status', ['reservado', 'emprestado'])

  if (errCheck) return mostrarToast('Erro ao consultar pendências: ' + errCheck.message, 'erro')

  if (emprestimosAtivos && emprestimosAtivos.length > 0) {
    const livroAtual = emprestimosAtivos[0]
    const situacao = livroAtual.status === 'reservado' ? 'reservado aguardando retirada' : 'em leitura com você'
    
    abrirModalConfirmacao(
      'Limite de 1 Livro Atingido',
      `Você já possui a obra "${livroAtual.livro_titulo}" (${situacao}). Pelas regras da escola, é permitido apenas 1 livro ativo por aluno por vez. Devolva o exemplar atual antes de reservar um novo!`,
      () => {}
    )
    return
  }

  abrirModalConfirmacao(
    'Confirmar Reserva',
    `Deseja reservar 1 exemplar de "${livro.titulo}" para retirar na biblioteca?`,
    async () => {
      const agora = new Date()
      const dataReservaBR = `${String(agora.getDate()).padStart(2, '0')}/${String(agora.getMonth() + 1).padStart(2, '0')}/${agora.getFullYear()}`

      await supabase.from('emprestimos').insert([{
        livro_id: livro.id,
        livro_titulo: livro.titulo,
        aluno_nome: perfilAtual.nome,
        aluno_email: perfilAtual.email,
        status: 'reservado',
        data_reserva: dataReservaBR
      }])

      await supabase.from('livros').update({ quantidade_disponivel: livro.quantidade_disponivel - 1 }).eq('id', livro.id)

      mostrarToast('🎉 Reserva realizada! Vá até a biblioteca para retirar.')
      carregarLivros()
      carregarMeusLivros()
    }
  )
}

// ==========================================
// 📖 MINHAS LEITURAS (ATIVAS & HISTÓRICO CONCLUÍDO)
// ==========================================

async function carregarMeusLivros() {
  if (!perfilAtual || perfilAtual.tipo !== 'aluno') return

  const { data: todosEmprestimos, error } = await supabase
    .from('emprestimos')
    .select('*')
    .eq('aluno_email', perfilAtual.email)
    .order('id', { ascending: false })

  if (error) return console.error(error)

  const ativas = (todosEmprestimos || []).filter(e => e.status === 'reservado' || e.status === 'emprestado')
  const concluidas = (todosEmprestimos || []).filter(e => e.status === 'devolvido')

  // Atualizar Estatísticas do Aluno
  statLivroAtivo.innerText = ativas.length
  statLivrosLidos.innerText = concluidas.length
  badgeHistoricoTotal.innerText = `${concluidas.length} ${concluidas.length === 1 ? 'obra' : 'obras'}`

  // Contador da aba do topo
  contadorMeusLivros.innerText = ativas.length
  contadorMeusLivros.style.display = ativas.length > 0 ? 'inline-block' : 'none'

  // Avisos de aprovação de renovação
  const temNovoAviso = ativas.some(l => l.aviso_aluno)
  if (temNovoAviso) {
    mostrarToast('✨ Você tem um novo prazo aprovado pela biblioteca!', 'sucesso')
  }

  // 1. RENDERIZAR LEITURA ATIVA
  listaLeituraAtiva.innerHTML = ''
  if (ativas.length === 0) {
    listaLeituraAtiva.innerHTML = `
      <div class="col-span-full py-8 text-center border-2 border-dashed border-[#ded9cd] rounded-3xl bg-white/70">
        <i data-lucide="book-open-check" class="w-8 h-8 text-zinc-400 mx-auto mb-2"></i>
        <p class="font-serif text-base font-bold text-ink">Nenhum livro em leitura no momento</p>
        <p class="text-xs text-zinc-500 mt-1">Consulte o acervo e reserve sua próxima aventura!</p>
      </div>
    `
  } else {
    ativas.forEach((item) => {
      const card = document.createElement('div')
      card.className = 'bg-white rounded-3xl border border-[#e8e4db] p-6 shadow-sm space-y-4'

      const isReservado = item.status === 'reservado'
      const pediuRenovacao = item.solicitacao_renovacao

      let statusHtml = isReservado
        ? '<span class="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Aguardando Retirada</span>'
        : '<span class="px-3 py-1 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Em Leitura com Você</span>'

      let bannerAvisoHtml = ''
      if (item.aviso_aluno) {
        bannerAvisoHtml = `
          <div class="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start justify-between gap-3 text-xs text-emerald-950">
            <div class="flex items-center gap-2">
              <i data-lucide="bell-ring" class="w-4 h-4 text-emerald-600 flex-shrink-0 animate-bounce"></i>
              <span><strong>Aviso:</strong> ${item.aviso_aluno}</span>
            </div>
            <button class="btn-dispensar-aviso text-[10px] underline font-bold text-emerald-800 hover:text-emerald-950" data-id="${item.id}">OK</button>
          </div>
        `
      }

      card.innerHTML = `
        <div class="flex items-start justify-between gap-4">
          <div>
            <span class="text-[10px] uppercase font-bold tracking-wider text-zinc-400 block mb-1">Exemplar Atual</span>
            <h3 class="font-serif text-xl font-bold text-ink">${item.livro_titulo}</h3>
          </div>
          ${statusHtml}
        </div>

        ${bannerAvisoHtml}

        <div class="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-[#faf8f5] border border-[#f0ece2] text-xs">
          <div>
            <span class="text-zinc-400 block text-[10px] uppercase font-bold">Data da Reserva</span>
            <span class="font-semibold text-zinc-700">${item.data_reserva || 'Não registrada'}</span>
          </div>
          <div>
            <span class="text-zinc-400 block text-[10px] uppercase font-bold">Prazo de Devolução</span>
            <span class="font-bold ${item.data_devolucao ? 'text-forest' : 'text-zinc-500'}">
              ${item.data_devolucao || 'Definido na retirada'}
            </span>
          </div>
        </div>

        ${
          !isReservado ? `
            <div class="pt-2 flex justify-end">
              ${pediuRenovacao ? `
                <span class="text-xs font-semibold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                  <i data-lucide="clock" class="w-3.5 h-3.5 animate-spin"></i>
                  Solicitação de prorrogação em análise
                </span>
              ` : `
                <button class="btn-pedir-renovacao px-4 py-2 text-xs font-bold rounded-xl border border-[#ded9cd] text-zinc-700 hover:bg-parchment transition-all flex items-center gap-1.5 shadow-sm" data-id="${item.id}" data-titulo="${item.livro_titulo}">
                  <i data-lucide="calendar-plus" class="w-3.5 h-3.5 text-brass"></i>
                  Pedir Mais Prazo (Renovação)
                </button>
              `}
            </div>
          ` : `
            <div class="pt-3 border-t border-[#f4f0e6] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <span class="text-xs text-amber-800 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200 flex items-center gap-1.5">
                <i data-lucide="info" class="w-3.5 h-3.5 text-amber-600 flex-shrink-0"></i>
                Vá até a biblioteca para retirar seu exemplar.
              </span>
              <button class="btn-cancelar-reserva px-3.5 py-2 text-xs font-bold rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all flex items-center justify-center gap-1.5 shadow-xs" data-id="${item.id}" data-livro-id="${item.livro_id}" data-titulo="${item.livro_titulo}">
                <i data-lucide="x-circle" class="w-3.5 h-3.5 text-red-500"></i>
                Cancelar Reserva
              </button>
            </div>
          `
        }
      `

      const btnAviso = card.querySelector('.btn-dispensar-aviso')
      if (btnAviso) {
        btnAviso.addEventListener('click', async () => {
          await supabase.from('emprestimos').update({ aviso_aluno: null }).eq('id', item.id)
          carregarMeusLivros()
        })
      }

      const btnRenovar = card.querySelector('.btn-pedir-renovacao')
      if (btnRenovar) {
        btnRenovar.addEventListener('click', () => {
          abrirModalConfirmacao(
            'Pedir Mais Prazo',
            `Deseja solicitar à biblioteca mais alguns dias para terminar a leitura de "${item.livro_titulo}"?`,
            async () => {
              await supabase.from('emprestimos').update({ solicitacao_renovacao: true }).eq('id', item.id)
              mostrarToast('Solicitação de renovação enviada para o bibliotecário!')
              carregarMeusLivros()
            }
          )
        })
      }

      // Cancelar Reserva (devolve o exemplar ao estoque e libera o aluno)
      const btnCancelar = card.querySelector('.btn-cancelar-reserva')
      if (btnCancelar) {
        btnCancelar.addEventListener('click', () => {
          abrirModalConfirmacao(
            'Cancelar Reserva',
            `Deseja realmente cancelar a reserva da obra "${item.livro_titulo}"? O exemplar voltará a ficar disponível no acervo para outros alunos.`,
            async () => {
              // 1. Remove o empréstimo pendente
              const { error: errDel } = await supabase.from('emprestimos').delete().eq('id', item.id)
              if (errDel) {
                return mostrarToast('Erro ao cancelar reserva: ' + errDel.message, 'erro')
              }

              // 2. Repõe o exemplar no estoque do livro
              if (item.livro_id) {
                const { data: livro } = await supabase.from('livros').select('quantidade_disponivel').eq('id', item.livro_id).single()
                if (livro) {
                  await supabase.from('livros').update({ quantidade_disponivel: livro.quantidade_disponivel + 1 }).eq('id', item.livro_id)
                }
              }

              mostrarToast('Reserva cancelada com sucesso! O exemplar voltou à estante.')
              carregarMeusLivros()
              carregarLivros()
            }
          )
        })
      }

      listaLeituraAtiva.appendChild(card)
    })
  }

  // 2. RENDERIZAR HISTÓRICO DE LEITURAS CONCLUÍDAS
  listaHistoricoLidos.innerHTML = ''
  if (concluidas.length === 0) {
    listaHistoricoLidos.innerHTML = `
      <div class="col-span-full py-10 text-center border-2 border-dashed border-[#ded9cd] rounded-3xl bg-white/50">
        <i data-lucide="award" class="w-8 h-8 text-zinc-300 mx-auto mb-2"></i>
        <p class="font-serif text-base font-semibold text-zinc-600">Nenhum livro concluído ainda</p>
        <p class="text-xs text-zinc-400 mt-0.5">Assim que devolver seu primeiro livro, ele aparecerá aqui e pontuará no seu ranking!</p>
      </div>
    `
  } else {
    concluidas.forEach((hist) => {
      const cardHist = document.createElement('div')
      cardHist.className = 'bg-white rounded-2xl border border-[#e8e4db] p-4 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between'

      cardHist.innerHTML = `
        <div class="space-y-2">
          <div class="flex items-center justify-between gap-2">
            <span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              <i data-lucide="check" class="w-3.5 h-3.5 text-emerald-600"></i>
              Lido e Devolvido
            </span>
            <span class="text-[10px] text-zinc-400">${hist.data_devolucao || 'Concluído'}</span>
          </div>

          <h4 class="font-serif font-bold text-base text-ink line-clamp-1">${hist.livro_titulo}</h4>
          <p class="text-xs text-zinc-500">Exemplar lido e catalogado no seu perfil de leitor.</p>
        </div>

        <div class="mt-4 pt-3 border-t border-[#f4f0e6] flex items-center justify-between">
          <span class="text-[10px] font-semibold text-brass flex items-center gap-1">
            <i data-lucide="star" class="w-3.5 h-3.5"></i>
            +1 Ponto no Ranking
          </span>
          <button class="btn-ler-novamente text-xs font-bold text-ink hover:text-forest flex items-center gap-1 transition-colors" data-titulo="${hist.livro_titulo}">
            <span>Ler Novamente</span>
            <i data-lucide="arrow-right" class="w-3.5 h-3.5"></i>
          </button>
        </div>
      `

      // Botão Ler Novamente
      const btnLerDeNovo = cardHist.querySelector('.btn-ler-novamente')
      if (btnLerDeNovo) {
        btnLerDeNovo.addEventListener('click', () => {
          // Procura o livro no acervo
          const livroNoAcervo = todosLivros.find(l => l.titulo.toLowerCase() === hist.livro_titulo.toLowerCase())
          if (livroNoAcervo) {
            reservarLivro(livroNoAcervo)
          } else {
            mostrarToast(`A obra "${hist.livro_titulo}" está cadastrada no acervo. Você pode pegá-la no catálogo!`)
            ativarAba('catalogo')
          }
        })
      }

      listaHistoricoLidos.appendChild(cardHist)
    })
  }

  // Atualizar posição do aluno no ranking
  atualizarPosicaoAlunoNoRanking(concluidas.length)

  if (window.lucide) window.lucide.createIcons()
}

// ==========================================
// 🏆 RANKING DE LEITORES (HALL DA FAMA)
// ==========================================

async function carregarRanking() {
  // 1. Buscar todos os empréstimos devolvidos
  const { data: emprestimosDevolvidos, error: errEmp } = await supabase
    .from('emprestimos')
    .select('aluno_nome, aluno_email')
    .eq('status', 'devolvido')

  if (errEmp) {
    console.error('Erro ao buscar dados do ranking:', errEmp)
    return
  }

  // 2. Buscar todos os alunos cadastrados
  const { data: alunosCadastrados, error: errAlunos } = await supabase
    .from('usuarios')
    .select('*')
    .eq('tipo', 'aluno')

  if (errAlunos) {
    console.error('Erro ao buscar alunos:', errAlunos)
    return
  }

  // 3. Contabilizar livros lidos por e-mail
  const contagem = {}
  ;(emprestimosDevolvidos || []).forEach(emp => {
    const email = emp.aluno_email ? emp.aluno_email.toLowerCase() : ''
    if (email) contagem[email] = (contagem[email] || 0) + 1
  })

  // 4. Mapear e ordenar ranking
  const mapaAlunos = new Map()
  ;(alunosCadastrados || []).forEach(aluno => {
    const email = aluno.email.toLowerCase()
    const codigo = aluno.cod_aluno || aluno.matricula || 'Escolar'
    mapaAlunos.set(email, {
      nome: aluno.nome,
      matricula: codigo,
      email: email,
      livrosLidos: contagem[email] || 0
    })
  })

  // Adiciona quem tiver empréstimo devolvido mas não estava na tabela usuarios
  Object.keys(contagem).forEach(email => {
    if (!mapaAlunos.has(email)) {
      const primeiro = (emprestimosDevolvidos || []).find(e => e.aluno_email && e.aluno_email.toLowerCase() === email)
      mapaAlunos.set(email, {
        nome: primeiro ? primeiro.aluno_nome : 'Leitor Escolar',
        matricula: 'Geral',
        email: email,
        livrosLidos: contagem[email]
      })
    }
  })

  const listaRanking = Array.from(mapaAlunos.values())
  listaRanking.sort((a, b) => b.livrosLidos - a.livrosLidos)

  badgeTotalRanqueados.innerText = `${listaRanking.length} alunos`

  // 5. Preencher o Pódio (1º, 2º e 3º colocados)
  const primeiro = listaRanking[0] || { nome: 'Aguardando leitor', matricula: '-', livrosLidos: 0 }
  const segundo = listaRanking[1] || { nome: 'Aguardando leitor', matricula: '-', livrosLidos: 0 }
  const terceiro = listaRanking[2] || { nome: 'Aguardando leitor', matricula: '-', livrosLidos: 0 }

  podio1Nome.innerText = primeiro.nome
  podio1Matricula.innerText = `Cód: ${primeiro.matricula}`
  podio1Livros.innerText = primeiro.livrosLidos

  podio2Nome.innerText = segundo.nome
  podio2Matricula.innerText = `Cód: ${segundo.matricula}`
  podio2Livros.innerText = segundo.livrosLidos

  podio3Nome.innerText = terceiro.nome
  podio3Matricula.innerText = `Cód: ${terceiro.matricula}`
  podio3Livros.innerText = terceiro.livrosLidos

  // 6. Preencher a Tabela do 4º colocado em diante
  tabelaRankingCorpo.innerHTML = ''
  const restantes = listaRanking.slice(3)

  if (restantes.length === 0) {
    tabelaRankingCorpo.innerHTML = `
      <tr>
        <td colspan="5" class="p-6 text-center text-zinc-400">Todos os leitores pontuados estão no pódio acima!</td>
      </tr>
    `
  } else {
    restantes.forEach((item, index) => {
      const posicao = index + 4
      const isUsuarioLogado = perfilAtual && perfilAtual.email && perfilAtual.email.toLowerCase() === item.email

      let badgeNivel = ''
      if (item.livrosLidos >= 10) {
        badgeNivel = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">Devorador Ouro 🌟</span>'
      } else if (item.livrosLidos >= 5) {
        badgeNivel = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700">Leitor Prata 🥈</span>'
      } else if (item.livrosLidos >= 1) {
        badgeNivel = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">Explorador Ativo 📖</span>'
      } else {
        badgeNivel = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-400">Iniciando Leitura</span>'
      }

      const tr = document.createElement('tr')
      tr.className = `transition-colors ${isUsuarioLogado ? 'bg-amber-50/70 font-semibold' : 'hover:bg-[#faf8f5]'}`

      tr.innerHTML = `
        <td class="p-3.5 text-center font-bold text-zinc-600">#${posicao}</td>
        <td class="p-3.5 font-bold text-ink">
          ${item.nome} ${isUsuarioLogado ? '<span class="ml-1.5 px-2 py-0.5 text-[10px] rounded-full bg-forest text-white">Você</span>' : ''}
        </td>
        <td class="p-3.5 text-zinc-500">${item.matricula}</td>
        <td class="p-3.5 text-center">${badgeNivel}</td>
        <td class="p-3.5 text-right font-serif font-bold text-base text-ink">${item.livrosLidos}</td>
      `
      tabelaRankingCorpo.appendChild(tr)
    })
  }

  if (window.lucide) window.lucide.createIcons()
}

async function atualizarPosicaoAlunoNoRanking() {
  if (!perfilAtual || !perfilAtual.email) return

  // 1. Buscar todos os empréstimos devolvidos
  const { data: emprestimosDevolvidos } = await supabase
    .from('emprestimos')
    .select('aluno_email')
    .eq('status', 'devolvido')

  // 2. Buscar todos os alunos cadastrados
  const { data: alunosCadastrados } = await supabase
    .from('usuarios')
    .select('email')
    .eq('tipo', 'aluno')

  const contagem = {}
  ;(emprestimosDevolvidos || []).forEach(emp => {
    const email = emp.aluno_email ? emp.aluno_email.toLowerCase() : ''
    if (email) contagem[email] = (contagem[email] || 0) + 1
  })

  const todosEmails = new Set()
  ;(alunosCadastrados || []).forEach(a => {
    if (a.email) todosEmails.add(a.email.toLowerCase())
  })
  Object.keys(contagem).forEach(e => todosEmails.add(e.toLowerCase()))
  if (perfilAtual.email) todosEmails.add(perfilAtual.email.toLowerCase())

  // Monta a lista completa com a pontuação de cada aluno
  const ranking = Array.from(todosEmails).map(email => ({
    email,
    pontos: contagem[email] || 0
  }))

  // Ordena por maior quantidade de livros lidos
  ranking.sort((a, b) => b.pontos - a.pontos)

  // Encontra a posição do aluno logado no ranking escolar
  const emailAtual = perfilAtual.email.toLowerCase()
  const index = ranking.findIndex(r => r.email === emailAtual)

  if (index !== -1) {
    statPosicaoRanking.innerText = `#${index + 1}º`
  } else {
    statPosicaoRanking.innerText = `#${ranking.length}º`
  }
}

// ==========================================
// 👩‍🏫 ÁREA DO ADMINISTRADOR / BIBLIOTECÁRIO
// ==========================================

async function carregarEmprestimosAdmin() {
  if (!perfilAtual || perfilAtual.tipo !== 'admin') return

  const { data: emprestimos, error } = await supabase
    .from('emprestimos')
    .select('*')
    .order('id', { ascending: false })

  if (error) return console.error(error)

  tabelaEmprestimos.innerHTML = ''
  
  const pendentes = (emprestimos || []).filter(e => e.status === 'reservado' || e.solicitacao_renovacao)
  contadorSolicitacoes.innerText = pendentes.length
  contadorSolicitacoes.style.display = pendentes.length > 0 ? 'inline-block' : 'none'

  if (!emprestimos || emprestimos.length === 0) {
    tabelaEmprestimos.innerHTML = `
      <tr>
        <td colspan="6" class="p-8 text-center text-zinc-400">Nenhuma movimentação registrada no sistema.</td>
      </tr>
    `
    return
  }

  emprestimos.forEach((item) => {
    const tr = document.createElement('tr')
    tr.className = 'hover:bg-[#faf8f5] transition-colors'

    let statusBadge = ''
    if (item.status === 'reservado') {
      statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Reserva Pendente</span>'
    } else if (item.status === 'emprestado') {
      statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Com o Leitor</span>'
    } else {
      statusBadge = '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-100 text-zinc-500">Devolvido</span>'
    }

    let colunaAcao = ''

    if (item.status === 'reservado') {
      colunaAcao = `
        <button class="btn-admin-entregar px-3 py-1.5 rounded-lg bg-ink text-[#faf8f5] text-xs font-bold hover:bg-black transition-all flex items-center gap-1 shadow-sm" data-id="${item.id}" data-titulo="${item.livro_titulo}">
          <i data-lucide="check" class="w-3.5 h-3.5"></i>
          Entregar Livro
        </button>
      `
    } else if (item.status === 'emprestado') {
      colunaAcao = `
        <div class="flex items-center justify-end gap-2">
          ${item.solicitacao_renovacao ? `
            <button class="btn-admin-renovar px-2.5 py-1.5 rounded-lg bg-amber-100 text-amber-800 text-xs font-bold hover:bg-amber-200 transition-all flex items-center gap-1" data-id="${item.id}" data-titulo="${item.livro_titulo}">
              <i data-lucide="clock" class="w-3.5 h-3.5"></i>
              Aceitar Prazo
            </button>
          ` : ''}
          <button class="btn-admin-devolver px-2.5 py-1.5 rounded-lg border border-[#ded9cd] text-zinc-600 hover:bg-white text-xs font-semibold transition-all" data-id="${item.id}">
            Dar Baixa
          </button>
        </div>
      `
    } else {
      colunaAcao = '<span class="text-zinc-400 text-xs">Concluído</span>'
    }

    tr.innerHTML = `
      <td class="p-3.5 font-bold text-ink">${item.livro_titulo}</td>
      <td class="p-3.5">
        <div class="font-semibold text-zinc-800">${item.aluno_nome}</div>
        <div class="text-[11px] text-zinc-400">${item.aluno_email}</div>
      </td>
      <td class="p-3.5">${statusBadge}</td>
      <td class="p-3.5 text-zinc-600">${item.data_reserva || '-'}</td>
      <td class="p-3.5 font-bold ${item.data_devolucao ? 'text-forest' : 'text-zinc-400'}">${item.data_devolucao || 'A definir'}</td>
      <td class="p-3.5 text-right">${colunaAcao}</td>
    `

    // Ação: Entregar Livro (com seletor de data brasileira DD/MM/AAAA)
    const btnEntregar = tr.querySelector('.btn-admin-entregar')
    if (btnEntregar) {
      btnEntregar.addEventListener('click', () => {
        abrirModalData(
          'Entregar Exemplar',
          `Defina a data limite para devolução de "${item.livro_titulo}" para o aluno:`,
          async (dataBR) => {
            await supabase.from('emprestimos').update({
              status: 'emprestado',
              data_devolucao: dataBR,
              aviso_aluno: `Livro entregue! Prazo máximo de devolução: ${dataBR}.`
            }).eq('id', item.id)

            mostrarToast(`Exemplar entregue com prazo até ${dataBR}!`)
            carregarEmprestimosAdmin()
            carregarLivros()
          }
        )
      })
    }

    // Ação: Aceitar Renovação de Prazo
    const btnAceitarPrazo = tr.querySelector('.btn-admin-renovar')
    if (btnAceitarPrazo) {
      btnAceitarPrazo.addEventListener('click', () => {
        abrirModalData(
          'Aprovar Mais Prazo',
          `Selecione a nova data prorrogada para "${item.livro_titulo}":`,
          async (novaDataBR) => {
            await supabase.from('emprestimos').update({
              data_devolucao: novaDataBR,
              solicitacao_renovacao: false,
              aviso_aluno: `Sua prorrogação foi APROVADA! Novo prazo: ${novaDataBR}.`
            }).eq('id', item.id)

            mostrarToast(`Prorrogação aprovada até ${novaDataBR}!`)
            carregarEmprestimosAdmin()
          }
        )
      })
    }

    // Ação: Dar Baixa (Devolver, Repor Estoque e Pontuar no Ranking)
    const btnDevolver = tr.querySelector('.btn-admin-devolver')
    if (btnDevolver) {
      btnDevolver.addEventListener('click', () => {
        abrirModalConfirmacao('Confirmar Devolução', `Deseja registrar a devolução física de "${item.livro_titulo}"? O estoque será reposto e o aluno pontuará no ranking.`, async () => {
          await supabase.from('emprestimos').update({ status: 'devolvido' }).eq('id', item.id)

          if (item.livro_id) {
            const { data: livro } = await supabase.from('livros').select('quantidade_disponivel').eq('id', item.livro_id).single()
            if (livro) {
              await supabase.from('livros').update({ quantidade_disponivel: livro.quantidade_disponivel + 1 }).eq('id', item.livro_id)
            }
          }

          mostrarToast('Obra devolvida, estoque reposto e pontuação somada!')
          carregarEmprestimosAdmin()
          carregarLivros()
        })
      })
    }

    tabelaEmprestimos.appendChild(tr)
  })

  if (window.lucide) window.lucide.createIcons()
}

// Cadastro de Livro pelo Bibliotecário
formLivro.addEventListener('submit', async (e) => {
  e.preventDefault()

  btnSalvarLivro.disabled = true
  btnSalvarLivro.innerText = 'Catalogando...'

  const titulo = document.getElementById('titulo').value.trim()
  const autor = document.getElementById('autor').value.trim()
  const categoria = document.getElementById('categoria').value.trim()
  const ano = parseInt(document.getElementById('ano').value, 10)
  const quantidade = parseInt(document.getElementById('quantidade').value, 10) || 1
  const arquivoCapa = document.getElementById('arquivo-capa').files[0]

  let imagem_url = null

  if (arquivoCapa) {
    const nomeUnico = `${Date.now()}-${arquivoCapa.name.replace(/\s+/g, '-')}`
    const { error: uploadError } = await supabase.storage.from('capas').upload(nomeUnico, arquivoCapa)

    if (!uploadError) {
      const { data: publicUrlData } = supabase.storage.from('capas').getPublicUrl(nomeUnico)
      imagem_url = publicUrlData.publicUrl
    }
  }

  const { error } = await supabase.from('livros').insert([{
    titulo,
    autor,
    categoria,
    ano,
    quantidade_total: quantidade,
    quantidade_disponivel: quantidade,
    imagem_url: imagem_url || null,
    status: 'disponivel'
  }])

  btnSalvarLivro.disabled = false
  btnSalvarLivro.innerText = 'Incorporar ao Acervo'

  if (error) {
    mostrarToast('Erro ao catalogar: ' + error.message, 'erro')
  } else {
    mostrarToast(`Obra catalogada com ${quantidade} exemplares!`)
    formLivro.reset()
    carregarLivros()
  }
})

// ==========================================
// 🚀 INICIALIZAÇÃO
// ==========================================
verificarSessaoInicial()
if (window.lucide) window.lucide.createIcons()
window.addEventListener('load', () => {
  if (window.lucide) window.lucide.createIcons()
})
