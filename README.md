# 🎮 Family Quiz

Bem-vindo ao **Family Quiz**, uma experiência de jogo interativa estilo "Kahoot" para animar as tuas festas e reuniões familiares! Mostra perguntas na TV e os jogadores respondem pelo telemóvel em tempo real.

![Quiz Banner](https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop)

## ✨ Funcionalidades

### 🎮 Modo de Jogo
- **📺 Modo TV (Host)**: O ecrã principal que mostra as perguntas, cronómetro, respostas em tempo real e classificações.
- **📱 Modo Jogador (Remote)**: Entra com o teu telemóvel usando um PIN de 6 dígitos — vê a pergunta completa, opções A/B/C/D, cronómetro e dicas.
- **🏠 Modo Local**: Joga no mesmo dispositivo — seleciona jogadores e joga sem precisar de TV.
- **🎯 QR Code + PIN Rápido**: QR Code no ecrã da TV ou PIN de 6 dígitos na página inicial para entrar instantaneamente.

### 📂 15 Categorias com 1.692 Perguntas
Bandeiras (260) · Animais (127) · Ciência (126) · História (101) · Capitais do Mundo (101) · Arte (100) · Desporto (100) · Política (99) · Cinema (98) · Gastronomia (98) · Matemática (98) · Tecnologia (97) · Cultura Geral (97) · Música (96) · Geografia (94)

### 🤖 Inteligência Artificial
- **Geração Automática**: Gera perguntas sobre qualquer tema usando IA (Google Gemini + Groq Llama).
- **Fallback Automático**: Se um provedor de IA falhar, tenta automaticamente o seguinte.
- **Multi-Categoria**: Gera perguntas distribuídas por todas as categorias selecionadas.
- **Cache Inteligente**: Perguntas geradas são guardadas na base de dados para reutilização futura.

### ⚙️ Configurações do Jogo
- **🕐 Timer Configurável**: 10s, 15s, 20s ou 30s por pergunta.
- **📊 Número de Perguntas**: 3, 5, 7 ou 10 perguntas por volta.
- **👶 Faixas Etárias**: 7-9, 10-14, 15-17 ou adultos (≥16).
- **🎨 Seleção Múltipla**: Seleciona várias categorias para cada jogo.
- **🔄 Múltiplas Voltas**: Joga várias rondas sem repetir perguntas.

### 🏆 Experiência de Jogo
- **⚡ Realtime**: Sincronização instantânea entre todos os dispositivos via Supabase Realtime + polling de backup.
- **🏅 Pontuação Inteligente**: Quanto mais rápido responderes corretamente, mais pontos ganhas (600-1000 pts).
- **📊 Animação de Pontuação**: Mostra +XX pts animado ao acertar, +0 ao errar.
- **📈 Barra de Progresso**: Indicador visual X/Y (ex: 3/10) durante o jogo.
- **🏆 Pódio Animado**: Celebra os vencedores com confetti e efeitos visuais.
- **⌨️ Atalhos de Teclado (TV)**: `Espaço` avançar/pular timer, `R` reportar pergunta, `Esc` fechar modais.
- **🏳️ Bandeiras SVG**: 260+ bandeiras de países em formato SVG de alta qualidade incluídas localmente.

### 🛠️ Painel Admin (`/admin`)
- **📊 Estatísticas**: Total de perguntas e contagem por categoria.
- **🔍 Filtro por Categoria**: Filtra e navega perguntas por tema.
- **🔎 Detector de Duplicados**: Analisa automaticamente a base de dados e encontra perguntas similares.
- **🗑️ Gestão**: Apagar perguntas individuais ou todas de uma vez (com dupla confirmação de segurança).

## 📄 Páginas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com acesso rápido por PIN e acesso a todas as secções |
| `/categories` | Selecionar categorias e faixa etária antes de jogar |
| `/tv` | Ecrã do Host/TV — mostra perguntas, cronómetro, QR code e ranking |
| `/play` | Página do jogador — entrar com PIN e responder perguntas remotamente |
| `/play?pin=123456` | Entrada direta com PIN pré-preenchido |
| `/profile` | Perfil do utilizador com histórico de jogos e estatísticas |
| `/admin` | Painel de administração — gerir perguntas e duplicados |

## 🛠️ Tecnologias

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS v4 & Framer Motion
- **Backend & Realtime**: Supabase (PostgreSQL + Realtime)
- **AI**: Google Gemini + Groq Llama (com fallback automático e retry com backoff exponencial)
- **Deploy**: Vercel
- **Segurança**: Rate limiting por IP, validação de inputs (UUID, números, strings), API keys apenas server-side

## 🚀 Como Começar

### 1. Clonar o Repositório
```bash
git clone https://github.com/khwx/Quiz.git
cd Quiz
```

### 2. Configurar Variáveis de Ambiente
Cria um ficheiro `.env.local` na raiz do projeto:

```env
# Supabase (obrigatório)
NEXT_PUBLIC_SUPABASE_URL=a_tua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=a_tua_key_supabase

# IA - pelo menos um é necessário
GEMINI_API_KEY=a_tua_api_key_google
GROQ_API_KEY=a_tua_api_key_groq
```

> ⚠️ **Segurança**: Usa `GEMINI_API_KEY` (sem `NEXT_PUBLIC_`) para que a chave nunca seja exposta no browser.

### 3. Configurar a Base de Dados
Executa o SQL do ficheiro `supabase_schema.sql` no teu painel do Supabase para criar as tabelas.

**Tabelas necessárias:**
- `games` — sessões de jogo (PIN, status, perguntas atuais)
- `players` — jogadores (nome, avatar, cor, pontuação)
- `questions` — banco de perguntas (texto, opções, categoria, idade)
- `answers` — respostas dos jogadores (escolha, tempo, pontos)

**Ativar Realtime:**
Vai a Database → Replication no Supabase Dashboard e ativa a replicação para as tabelas `games`, `players` e `answers`.

### 4. Semear Bandeiras (Opcional)
```bash
# Executar no Supabase SQL Editor
# scripts/seed-flags-complete.sql
```

### 5. Instalar e Correr
```bash
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:3000`.

## 📊 Estrutura do Projeto

```
quiz/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── answer/          # API de submissão de respostas
│   │   │   └── questions/
│   │   │       └── generate/    # API de geração de perguntas com IA
│   │   ├── admin/               # Painel de administração
│   │   ├── categories/          # Seleção de categorias
│   │   ├── login/               # Login e registo
│   │   ├── play/                # Página do Jogador (remote)
│   │   ├── profile/             # Perfil com histórico de jogos
│   │   └── tv/                  # Página do Host/TV
│   ├── components/
│   │   ├── tv/                  # Componentes TV (QuestionDisplay, Podium, LiveLeaderboard)
│   │   ├── ConfirmModal.tsx     # Modal de confirmação
│   │   ├── MobileNav.tsx        # Navegação mobile partilhada
│   │   ├── ReportModal.tsx      # Modal de reportar perguntas
│   │   ├── Toast.tsx            # Sistema de notificações
│   │   └── CastButton.tsx       # Botão de Chromecast
│   ├── context/
│   │   └── GameContext.tsx       # Estado global do jogo (Supabase Realtime)
│   ├── hooks/
│   │   ├── useSound.ts          # Hook de efeitos sonoros
│   │   └── useToast.ts          # Hook de notificações Toast
│   └── lib/
│       ├── supabase.ts          # Cliente Supabase
│       ├── ai-service.ts        # Geração de perguntas com IA
│       ├── ai-service-fallback.ts # Gemini + Groq com fallback
│       ├── rate-limit.ts        # Rate limiting por IP
│       ├── validation.ts        # Validação de inputs
│       ├── cache.ts             # Cache de perguntas
│       └── avatars.ts           # Gerador de avatares
├── public/
│   └── flags/                   # 260+ bandeiras SVG de países
├── supabase_schema.sql          # Schema completo da base de dados
└── questions_backup.json        # Backup de todas as perguntas
```

## 🔒 Segurança

- **Rate Limiting**: 30 pedidos por minuto por IP nas APIs de resposta e geração.
- **Validação de Inputs**: Todos os UUIDs, números e strings são validados server-side.
- **API Keys Protegidas**: Chaves de IA são apenas server-side (`GEMINI_API_KEY`, `GROQ_API_KEY`).
- **Timeout**: Pedidos à IA têm timeout de 10 segundos com retry automático.
- **Zero Native Dialogs**: Sem `alert()`, `prompt()` ou `confirm()` no fluxo do utilizador — usa Toast, ReportModal e ConfirmModal.

## 🐛 Problemas Conhecidos e Soluções

| Problema | Solução |
|----------|---------|
| Contador de respostas fica a 0/1 | Verifica se a coluna `points` existe na tabela `answers` |
| Realtime não funciona | Ativa a Replication nas tabelas `games`, `players` e `answers` no Supabase |
| Perguntas não geram | Verifica se `GEMINI_API_KEY` ou `GROQ_API_KEY` estão configuradas no `.env.local` |
| Bandeiras não aparecem | Executa `scripts/seed-flags-complete.sql` no Supabase |

## 📝 Licença

Este projeto é de código aberto. Sente-te à vontade para contribuir!
