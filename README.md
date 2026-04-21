# 🎮 Family Quiz

Bem-vindo ao **Family Quiz**, uma experiência de jogo interativa estilo "Kahoot" para animar as tuas festas e reuniões familiares! Mostra perguntas na TV e os jogadores respondem pelo telemóvel em tempo real.

![Quiz Banner](https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop)

## ✨ Funcionalidades

### 🎮 Modo de Jogo
- **📺 Modo TV (Host)**: O ecrã principal que mostra as perguntas, cronómetro, respostas em tempo real e classificações.
- **📱 Modo Jogador**: Entra com o teu telemóvel usando um PIN de 6 dígitos, escolhe o teu nome e avatar.
- **🎯 QR Code**: Mostra um QR Code no ecrã para os jogadores entrarem instantaneamente.
- **📡 Chromecast**: Suporte para enviar o ecrã do jogo para uma TV via Chromecast.

### 🤖 Inteligência Artificial
- **Geração Automática**: Gera perguntas sobre qualquer tema usando IA (Google Gemini + Groq Llama).
- **Fallback Automático**: Se um provedor de IA falhar, tenta automaticamente o seguinte.
- **Anti-Duplicados**: Sistema inteligente que evita gerar perguntas repetidas ou demasiado parecidas.
- **Cache Inteligente**: Perguntas geradas são guardadas na base de dados para reutilização futura.

### ⚙️ Configurações do Jogo
- **🕐 Timer Configurável**: 10s, 15s, 20s ou 30s por pergunta.
- **📊 Número de Perguntas**: 3, 5, 7 ou 10 perguntas por volta.
- **👶 Faixas Etárias**: 7-9, 10-14, 15-17 ou 18+ (adultos).
- **🎨 Temas Predefinidos**: Cultura Geral, Capitais do Mundo, Bandeiras, Cinema, Desporto, Ciência, Animais.
- **✏️ Temas Personalizados**: Escreve qualquer tema que quiseres!
- **🔄 Múltiplas Voltas**: Joga várias rondas sem repetir perguntas.

### 🏆 Experiência de Jogo
- **⚡ Realtime**: Sincronização instantânea entre todos os dispositivos via Supabase Realtime + polling de backup.
- **🏅 Pontuação Inteligente**: Quanto mais rápido responderes corretamente, mais pontos ganhas (600-1000 pts).
- **🏆 Pódio Animado**: Celebra os vencedores com animações e efeitos visuais.
- **🔊 Efeitos Sonoros**: Sons para tick-tock, resposta correta e resposta errada.
- **🏳️ Bandeiras SVG**: 252 bandeiras de países em formato SVG de alta qualidade incluídas localmente.

### 🛠️ Painel Admin (`/admin`)
- **📊 Estatísticas**: Total de perguntas e contagem por categoria.
- **🔍 Filtro por Categoria**: Filtra e navega perguntas por tema.
- **🔎 Detector de Duplicados**: Analisa automaticamente a base de dados e encontra perguntas similares ou inversas usando comparação de palavras-chave (Jaccard similarity).
- **🗑️ Gestão**: Apagar perguntas individuais ou todas de uma vez (com dupla confirmação de segurança).

## 📄 Páginas da Aplicação

| Rota | Descrição |
|------|-----------|
| `/` | Página inicial com links para todas as secções |
| `/tv` | Ecrã do Host/TV — mostra perguntas e QR code |
| `/play` | Página do jogador — entrar com PIN e responder |
| `/play?pin=123456` | Entrada direta com PIN pré-preenchido (via QR) |
| `/admin` | Painel de administração — gerir perguntas e duplicados |
| `/tutorial` | Tutorial interativo de como jogar |

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
│   │   │   ├── answer/        # API de submissão de respostas
│   │   │   └── questions/
│   │   │       └── generate/  # API de geração de perguntas com IA
│   │   ├── admin/             # Painel de administração
│   │   ├── tv/                # Página do Host/TV
│   │   ├── play/              # Página do Jogador
│   │   └── tutorial/          # Página de tutorial
│   ├── components/
│   │   ├── tv/                # Componentes TV (QuestionDisplay, Podium, Leaderboard)
│   │   ├── mobile/            # Componentes Mobile (AnswerController)
│   │   └── CastButton.tsx     # Botão de Chromecast
│   ├── context/
│   │   └── GameContext.tsx     # Estado global do jogo (Supabase Realtime)
│   ├── lib/
│   │   ├── supabase.ts        # Cliente Supabase
│   │   ├── ai-service.ts      # Cliente de geração de perguntas
│   │   ├── ai-service-fallback.ts  # Gemini + Groq com fallback e retry
│   │   ├── rate-limit.ts      # Rate limiting por IP
│   │   ├── validation.ts      # Validação de inputs
│   │   ├── cache.ts           # Cache de perguntas
│   │   ├── geo-service.ts     # Serviço de geolocalização
│   │   ├── avatars.ts         # Gerador de avatares
│   │   └── colors.ts          # Gerador de cores
│   └── hooks/
│       └── useSound.ts        # Hook de efeitos sonoros
├── public/
│   └── flags/                 # 252 bandeiras SVG de países
├── scripts/                   # Scripts SQL para semear dados
├── docs/                      # Documentação e notas
├── supabase_schema.sql        # Schema completo da base de dados
└── test-gemini.js             # Script de teste da API AI
```

## 🔒 Segurança

- **Rate Limiting**: 30 pedidos por minuto por IP nas APIs de resposta e geração.
- **Validação de Inputs**: Todos os UUIDs, números e strings são validados server-side.
- **API Keys Protegidas**: Chaves de IA são apenas server-side (`GEMINI_API_KEY`, `GROQ_API_KEY`).
- **Timeout**: Pedidos à IA têm timeout de 10 segundos com retry automático.

## 🐛 Problemas Conhecidos e Soluções

| Problema | Solução |
|----------|---------|
| Contador de respostas fica a 0/1 | Verifica se a coluna `points` existe na tabela `answers` |
| Realtime não funciona | Ativa a Replication nas tabelas `games`, `players` e `answers` no Supabase |
| Perguntas não geram | Verifica se `GEMINI_API_KEY` ou `GROQ_API_KEY` estão configuradas no `.env.local` |
| Bandeiras não aparecem | Executa `scripts/seed-flags-complete.sql` no Supabase |

## 📝 Licença

Este projeto é de código aberto. Sente-te à vontade para contribuir!
