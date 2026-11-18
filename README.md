# 📚 BiblioTech — Sistema de Gestão de Biblioteca Escolar

Sistema web moderno e responsivo para gestão e consulta de acervo escolar, desenvolvido com foco na autonomia dos alunos e incentivo à leitura.

---

## ✨ Principais Funcionalidades

- **Acesso de Leitores e Administradores:** Login e cadastro com matrícula escolar (cod_aluno) e e-mail.
- **Persistência de Sessão:** Opção "Manter conectado" com carregamento instantâneo.
- **Catálogo de Livros:** Paginação fluida (9 livros por página), busca dinâmica por título/autor e status de disponibilidade em tempo real.
- **Empréstimos e Devoluções:** Solicitação de livros com data limite configurável pelo administrador.
- **Histórico do Aluno:** Visualização separada de livros atualmente emprestados e livros já lidos.
- **🏆 Ranking dos Leitores:** Pódio interativo com medalhas (Ouro, Prata, Bronze) destacando os alunos que mais leram livros na escola para incentivar a leitura.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** HTML5, JavaScript (ES6+), Vite
- **Estilização:** Tailwind CSS (tema editorial com paleta de cores elegantes e fontes Lora / Plus Jakarta Sans)
- **Ícones:** Lucide Icons
- **Backend & Banco de Dados:** Supabase (PostgreSQL, Auth e Row Level Security)
- **Deploy:** Vercel

---

## 🚀 Como Executar Localmente

1. Clone o repositório:
   git clone https://github.com/asafedmartins-bot/bibliotech.git
   cd bibliotech

2. Instale as dependências:
   npm install

3. Configure as variáveis de ambiente:
   Crie um arquivo .env na raiz do projeto:
   VITE_SUPABASE_URL=https://seu-projeto.supabase.co
   VITE_SUPABASE_ANON_KEY=sua-chave-anonima-supabase

4. Inicie o servidor de desenvolvimento:
   npm run dev

5. Build para produção:
   npm run build

---

## 🗄️ Estrutura do Banco de Dados (Supabase)

Os scripts SQL para criar as tabelas e popular o acervo e o ranking estão disponíveis na raiz do projeto:
- popular_50_livros.sql: 50 livros clássicos da literatura com capas verificadas da Open Library.
- popular_ranking_alunos.sql: Estrutura das tabelas usuarios e emprestimos, políticas de RLS e dados fictícios para o ranking de leituras.
