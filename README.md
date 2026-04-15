# 🎮 Family Quiz

Bem-vindo ao **Family Quiz**, uma experiência de jogo interativa estilo "Kahoot" para animar as tuas festas e reuniões familiares!

![Quiz Banner](https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=2070&auto=format&fit=crop)

## ✨ Funcionalidades

- **📺 Modo TV (Host)**: O ecrã principal que mostra as perguntas, cronómetro e classificações.
- **📱 Modo Jogador**: Entra com o teu telemóvel usando um PIN, escolhe o teu nome e avatar.
- **🤖 Perguntas por IA**: Gera perguntas automaticamente sobre qualquer tema usando inteligência artificial (Gemini + Groq).
- **⚡ Realtime**: Sincronização instantânea entre todos os dispositivos via Supabase Realtime.
- **🏆 Pódio**: Celebra os vencedores com animações!
- **⏱️ Timer Inteligente**: Quando todos os jogadores respondem, o timer avança automaticamente para a próxima pergunta.

## 🛠️ Tecnologias

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript
- **Estilos**: Tailwind CSS v4 & Framer Motion
- **Backend & Realtime**: Supabase (PostgreSQL + Realtime)
- **AI**: Google Gemini + Groq Llama (com fallback automático)
- **Deploy**: Vercel

## 🚀 Como Começar

### 1. Clonar o Repositório
```bash
git clone https://github.com/khwx/Quiz.git
cd Quiz
```

### 2. Configurar Variáveis de Ambiente
Cria um ficheiro `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=a_tua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=a_tua_key_supabase
NEXT_PUBLIC_GEMINI_API_KEY=a_tua_api_key_google
GROQ_API_KEY=a_tua_api_key_groq
GEMINI_MODEL=gemini-1.5-flash
GROQ_MODEL=llama-3.3-70b-versatile
```

### 3. Configurar a Base de Dados
Executa o SQL do ficheiro `supabase_schema.sql` no teu painel do Supabase para criar as tabelas.

### 4. Instalar e Correr
```bash
npm install
npm run dev
```

## 📊 Estrutura do Projeto

```
quiz/
├── src/
│   ├── app/
│   │   ├── api/          # APIs (answer, questions/generate)
│   │   ├── tv/          # Página do Host/TV
│   │   ├── play/        # Página do Jogador
│   │   └── tutorial/     # Página de tutorial
│   ├── components/       # Componentes reutilizáveis
│   ├── context/         # Estado global (GameContext)
│   ├── lib/             # Serviços (Supabase, AI, etc.)
│   └── hooks/           # Hooks personalizados
├── docs/                # Documentação e notas
├── supabase_schema.sql  # Schema da base de dados
└── test-gemini.js       # Script de teste da API AI
```

## 🐛 Problemas Conhecidos e Soluções

1. **Contador de respostas fica a 0/1**: Verifica se a coluna `points` existe na tabela `answers` no Supabase.
2. **Realtime não funciona**: Ativa a Replication na tabela `answers` no Supabase Dashboard.

## 🚧 Em Desenvolvimento

- Timer configurável (10s, 15s, 20s, 30s)
- Pista "50/50" para eliminar opções
- Leaderboard entre perguntas
- Mais tipos de perguntas (V/F, com imagem)

## 📝 Licença

Este projeto é de código aberto. Sente-te à vontade para contribuir!
