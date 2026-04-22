# Family Quiz - Memória do Projeto

> Documento principal com toda a informação relevante sobre o projeto Family Quiz.

## 📋 Informações Gerais

- **Nome**: Family Quiz
- **Repo**: https://github.com/khwx/Quiz
- **URL**: https://quiz-two-zeta-67.vercel.app
- **Stack**: Next.js 16 + Supabase + TailwindCSS + TypeScript
- **Descrição**: Quiz multiplayer para famílias, jogado via TV (host) + telemóveis (jogadores)

## 🎯 Funcionalidades Principais

1. **Sistema de Jogo Multi-Jogador**
   - Host cria jogo com PIN único (6 dígitos)
   - Jogadores entram via `/play` com PIN
   - Tempo limite por pergunta (20s padrão)
   - Sistema de pontuação por velocidade

2. **Geração de Perguntas com IA**
   - Fallback: Gemini → Groq (automático)
   - Gera perguntas automaticamente por tema/categoria
   - Cache em memória (TTL 1h)
   - Retry com backoff exponencial (até 2 tentativas)
   - Timeout 10s por chamada
   - Modelo padrão: `gemini-1.5-flash`

3. **Tipos de Perguntas**
   - Escolha múltipla (4 opções A/B/C/D)
   - Correção em tempo real após resposta
   - 50/50 e V/F **REMOVIDOS** (bugs críticos)

4. **Sistema de Feedback**
   - Contador de respostas em tempo real
   - Avatares coloridos (verde=certas, cinzento=pendentes)
   - Leaderboard entre perguntas

## 🛡️ Segurança (Implementado)

1. **Rate Limiting**
   - 30 pedidos por minuto por IP
   - Aplica-se a `/api/answer` e `/api/questions/generate`
   - Headers `Retry-After` inclusos

2. **Validação de Inputs**
   - UUIDs validados (gameId, playerId, questionId)
   - Números validados com ranges (chosenOption: 0-3, timeTaken: 0-300)
   - Strings validadas com length limits
   - Erros detalhados retornados

3. **Timeouts nas Chamadas AI**
   - 10 segundos por chamada
   - Retry automático até 2 vezes com backoff exponencial

## 🗄️ Estrutura da Base de Dados (Supabase)

### Tabelas

```sql
-- games: id, pin, status, current_question_index, settings, created_at
-- players: id, game_id, name, score, avatar, color, is_host, joined_at
-- questions: id, text, image_url, options, correct_option, category, age_rating, country_code, created_at
-- answers: id, game_id, player_id, question_id, chosen_option, time_taken, is_correct, points, created_at
```

### Regras RLS

- Games: SELECT/INSERT/UPDATE público
- Players: SELECT/INSERT/UPDATE público
- Questions: SELECT público, INSERT restrito
- Answers: SELECT/INSERT público

### Realtime

Tabela `answers` 需要有 Replication ativado no Supabase para o contador funcionar.

## 🔧 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
GEMINI_API_KEY=           # Server-only (não NEXT_PUBLIC_)
GROQ_API_KEY=            # Server-only
GEMINI_MODEL=gemini-1.5-flash
GROQ_MODEL=llama-3.3-70b-versatile
```

## 📁 Estrutura do Projeto

```
quiz/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── answer/route.ts       # Recebe respostas dos jogadores
│   │   │   └── questions/generate/route.ts  # Gera perguntas com IA
│   │   ├── tv/page.tsx              # Página principal do Host/TV
│   │   ├── play/page.tsx            # Página do jogador (mobile)
│   │   ├── host/page.tsx            # Redireciona para /tv
│   │   └── tutorial/page.tsx         # Página de tutorial
│   ├── components/
│   │   ├── tv/
│   │   │   ├── QuestionDisplay.tsx  # Mostra pergunta + contador
│   │   │   ├── Podium.tsx           # Ecrã de pódio final
│   │   │   └── LiveLeaderboard.tsx  # Leaderboard em tempo real
│   │   └── mobile/
│   │       └── AnswerController.tsx # Controlo de respostas mobile
│   ├── context/
│   │   └── GameContext.tsx          # Estado global do jogo
│   ├── lib/
│   │   ├── ai-service-fallback.ts   # Lógica de fallback IA + cache + retry
│   │   ├── ai-service.ts           # Cliente para API de geração
│   │   ├── supabase.ts             # Cliente Supabase
│   │   ├── rate-limit.ts           # Rate limiting por IP
│   │   ├── validation.ts           # Validação de inputs
│   │   ├── cache.ts                # Cache de perguntas geradas
│   │   └── ... outras libs
│   └── hooks/
│       └── useSound.ts             # Efeitos sonoros
├── docs/
│   ├── ai_generation_notes.md      # Notas sobre geração de perguntas
│   ├── market_research_notes.md    # Pesquisa de mercado
│   └── MEMORY.md                   # Este ficheiro
├── test-gemini.js                  # Script de teste da API Gemini
└── supabase_schema.sql             # Schema da base de dados
```

## 🐛 Problemas Resolvidos

1. **Contador 0/1**: Causas múltiplas
   - Falta de `points` column na tabela `answers`
   - Falta de Realtime ativado na tabela `answers`
   - Código duplicado na subscrição realtime
   - Polling parado no status "LOBBY"

2. **Build error**: `</div>` extra no tv/page.tsx

3. **Resposta correta mal alinhada**: Prompt melhorado com validação explícita

4. **Modelo Gemini desatualizado**: `gemini-2.0-flash` → `gemini-1.5-flash`

5. **Bug 50/50**: Removido porque causava auto-resposta e state não resetava

6. **Bug V/F**: Removido porque causava problemas de state entre perguntas

7. **Incidente Vercel Abril 2026**: Recomendada mudança de API keys

## 🚧 Funcionalidades a Implementar

### Alta Prioridade ✅ FEITO
- [x] **Corrigir layout dos botões no TV para mobile**
- [x] **Adicionar flagcdn.com para imagens de bandeiras**
- [x] **Criar tema: Capitais do Mundo**
- [x] **Criar tema: Qual é a Bandeira?**
- [x] Melhorar prompt AI para gerar perguntas com imagens
- [x] Adicionar novos temas ao seletor
- [x] Adicionar seletor de número de perguntas (3, 5, 7, 10)
- [x] Script SQL para pré-carregar bandeiras
- [x] **252 bandeiras locais SVG** (alta qualidade)
- [x] **TTS** - Ler questões em voz alta
- [x] **Respostas randomizadas** - Não sempre A é correta
- [x] **Modo Local** - Jogar sem telemóveis
- [x] **Botão limpar memória** - Evitar perguntas repetidas
- [x] **Sistema de Login** - Supabase Auth

### Sistema de Login e Competições ✅ NOVO
- [x] Tabela `profiles` - Perfis de utilizadores
- [x] Tabela `game_sessions` - Histórico de jogos
- [x] Tabela `leaderboard` - Ranking global
- [x] Tabela `achievements` - Conquistas
- [ ] Página de Login/Register
- [ ] Página de Perfil
- [ ] Leaderboard Global
- [ ] Guardar jogos no histórico

### Média Prioridade
- [x] Timer configurável (10s, 15s, 20s, 30s) - ✅ já existe
- [ ] Pista "50/50" (eliminar 2 opções) - **pendente bugfix**
- [ ] Leaderboard entre perguntas
- [ ] Perguntas V/F - **pendente bugfix**
- [ ] Sistema de achievements/badges

### Baixa Prioridade
- [ ] Modo equipas
- [ ] Página de admin para estatísticas
- [ ] Guardar cache na BD (atualmente em memória)
- [ ] Adicionar sons feedback adicionais
- [ ] Tutorial para novos jogadores
- [ ] Perguntas com sons/música
- [ ] Dificuldade adaptativa

### 🐛 Bugs para Corrigir
- [x] Auto-resposta nas perguntas repetidas - ✅ tem botão limpar memória

## 📝Notas de Desenvolvimento

- Autores: khwx (utilizador GitHub)
- O projeto usa commits com author `khwx <khwx@users.noreply.github.com>` para evitar bloqueios Vercel
- Deploy automático via Vercel ao fazer push para `main`
- **Último commit**: `0906b16` (question count selector + flag scripts)
- flagcdn.com é gratis para bandeiras - sem API key necessária

## 📂 Scripts Úteis

- `scripts/seed-flags.sql` - 22 perguntas de bandeiras
- `scripts/seed-flags-full.sql` - 50 perguntas de bandeiras completas

## 🔗 Links Úteis

- [Vercel Dashboard](https://vercel.com)
- [Supabase Dashboard](https://supabase.com)
- [Google AI Studio](https://aistudio.google.com) - Para criar chave Gemini
- [Groq Console](https://console.groq.com) - Para criar chave Groq