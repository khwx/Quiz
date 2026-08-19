# 📈 Progress Log - QuizVerse

## [2026-08-20] TAREFA DIÁRIA — Novas perguntas + TAREFA SEMANAL — Duplicados + Melhoria de Pool

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+21 novas** (pool curado de 22; 1 duplicado ignorado por dedupe). Pool: 22 → 0. Banco: 2.578 → 2.599 (BD) / 2.596 (backup sincronizado).
  - `questions_backup.json` atualizado automaticamente pelo script (2.575 → 2.596).
- **MELHORIA — Reposição do pool curado**: como o pool esgotou (22 → 0), reposto com **75 novas perguntas** (5 por categoria × 15 categorias). Garante ~3-4 ciclos diários de +21 perguntas antes de necessidade de nova reposição. Todas as perguntas são originais, não-obvias e dedupadas contra a BD.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. Total na BD: 2.599 perguntas. **0 duplicados exatos removidos**. 26 grupos de duplicados aproximados detetados — esmagadoramente Bandeiras (texto genérico + opções/imanges diferentes = falsos positivos, não removidos).
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup; sem impacto no app. `node --check` OK.

## [2026-08-19] MELHORIA — `npm run daily` com pool curado (crescimento automático sem API keys)
- **MELHORIA — Geração diária sem depender de IA**: `scripts/daily-questions.mjs` agora, quando nenhuma API key de IA está definida (`NEXT_PUBLIC_GEMINI_API_KEY` / `GROQ_API_KEY`), recorre a um **pool curado** (`scripts/curated-pool.json`) em vez das antigas fallback de uma única pergunta por categoria (que quase sempre já existiam na BD → 0 novas).
  - O pool é baralhado, faz dedupe por `texto|category` contra a BD, e **encolhe automaticamente** (as perguntas usadas são removidas do ficheiro), garantindo que cada execução de `npm run daily` adiciona perguntas novas e distintas até o pool esgotar.
  - Após inserir, sincroniza `questions_backup.json` (antes só o `add-curated-batch.mjs` o fazia), mantendo o backup fiel à BD.
  - O caminho com IA (Gemini→Groq) mantém-se intacto.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+30 novas** (de um pool de 60; 8 já existiam e foram ignoradas por dedupe). Pool: 60 → 22. Banco: 2.545 → 2.575 (backup) / 2.578 (BD).
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. 0 duplicados exatos removidos. 25 grupos aproximados (esmagadoramente Bandeiras, falsos positivos — não removidos).
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup; sem impacto no app. `node --check` OK; lint/build não aplicáveis a mudanças fora de `src/`.

## [2026-08-19] MELHORIA — Distribuição de Respostas na REVEAL (audit 7.18)
- **MELHORIA — Estatísticas de resposta por opção no ecrã da TV** (`src/components/tv/QuestionDisplay.tsx`): na fase REVEAL, cada opção agora mostra uma barra de distribuição com a percentagem e o número de jogadores que escolheram essa opção (baseado em `answers`/`players` já disponíveis). Dá ao host e jogadores o "sabor" Dr.Why de ver onde a sala se divide, sem alterar a pontuação nem o fluxo de jogo.
  - Cálculo seguro: `totalAnswered` dedupica por `player_id`; `answerPct` só renderiza quando há respostas; respeita `blindMode` (não mostra no modo cego).
- **LINT/BUILD/TESTS**: sem novos erros (warnings/erros pré-existentes em `QuestionDisplay.tsx` mantidos); build OK; 15/15 testes passam.

## [2026-08-19] Ciclo de Manutenção — Lote Curado de Perguntas + Dedupe Semanal
- **MELHORIA — Crescimento do banco de perguntas (lote curado)**: como as API keys de IA continuam ausentes, o `npm run daily` gera 0 novas. Criado `scripts/add-curated-batch.mjs` (reutilizável por ciclo) com 30 perguntas curadas (2 por categoria), dedupe por `texto|category`, inserção em lotes e atualização do `questions_backup.json`.
  - Resultado: **17 novas perguntas inseridas** (13 já existiam na BD e foram ignoradas por dedupe). Banco continua a crescer de forma segura e sem duplicados.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → 0 (sem API keys). Lote curado `scripts/add-curated-batch.mjs` → +17.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. 0 duplicados exatos removidos. 24 grupos aproximados (esmagadoramente Bandeiras, falsos positivos — não removidos).
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup; sem impacto no app. Lint/build não aplicáveis a mudanças fora de `src/`.

## [2026-08-18] Torneios em Destaque + Notificações (Backlog TAREFAS.md)
- **MELHORIA — Torneios públicos em destaque com notificações**: implementada funcionalidade de destacar torneios públicos na página de descoberta e enviar notificações automáticas aos utilizadores.
  - Migração `supabase/migrations/017_add_tournament_featured.sql`: adiciona coluna `is_featured BOOLEAN DEFAULT false` à tabela `tournaments` com índice parcial para featured públicos.
  - Tipo `Tournament.is_featured?: boolean` adicionado em `src/types/index.ts`.
  - Formulário de criação (`src/app/tournaments/page.tsx`): novo toggle "Destacar na Página Inicial" (ícone Star) — só aparece quando "Torneio Público" está ativo; guardado no insert como `is_featured`.
  - Lista de torneios (`/tournaments`): nova secção "Em Destaque" no topo, antes de "Torneios Públicos", mostrando apenas torneios públicos featured em LOBBY/QUALIFYING/FINAL.
  - Cartões de torneio (`TournamentCard`): badge dourado "Destaque" e borda dourada quando `is_featured === true`.
  - Página de detalhe (`src/app/tournaments/[id]/page.tsx`): badge "Destaque" ao lado do badge "Público".
  - **Notificações automáticas**: ao criar um torneio público featured, a função `sendFeaturedTournamentNotification` insere notificações do tipo `tournament` para todos os perfis (exceto o criador) com título "Novo Torneio em Destaque!" e descrição convidando a juntar-se.
  - Sem a migração aplicada o app não quebra (coluna devolvida nula, featured tratado como false).
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily`. 0 novas (sem API keys; alerta emitido).
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. 2.532 perguntas, 1 exato removido, 25 grupos aproximados (Bandeiras, falsos positivos).
- **LINT/BUILD/TESTS**: sem novos erros nas mudanças (erros/warnings pré-existentes mantidos); build OK; 15/15 testes passam.

## [2026-08-18] Ciclo de Manutenção — Whitelist de Torneios + Manutenção Diária/Semanal
- **Melhoria — Torneios por convite (whitelist)**: implementada restrição de acesso a equipas específicas em torneios privados.
  - Migração `supabase/migrations/016_add_tournament_whitelist.sql`: adiciona coluna `whitelisted_team_ids UUID[]` (default `{}`) e índice GIN; idempotente com `IF NOT EXISTS`.
  - Tipo `Tournament.whitelisted_team_ids?: string[]` adicionado em `src/types/index.ts`.
  - Formulário de criação (`src/app/tournaments/page.tsx`): toggle "Limitar a equipas convidadas" (apenas para privados); multi-select das equipas do utilizador; guardado no insert. Estados resetados no cancelamento e no sucesso.
  - Guarda no `joinTournament` (lista) e indicador no detalhe (`ShieldCheck` badge); cartão da lista mostra badge "Invite" quando aplicável. Sem a migração aplicada o app não quebra (coluna devolvida nula).
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily`. 0 novas (sem API keys; alerta emitido).
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. 2.531 perguntas, 0 exatos removidos, 24 grupos aproximados (Bandeiras, falsos positivos).
- **LINT/BUILD/TESTS**: sem novos erros nas mudanças; build OK; 15/15 testes passam.

## [2026-08-18] Ciclo de Manutenção — Filtros/Pesquisa em Torneios + Robustez de Explicação
- **MELHORIA (backlog) — Filtros e pesquisa na lista de torneios** (`src/app/tournaments/page.tsx`):
  - Caixa de pesquisa que filtra torneios por **nome ou PIN** (case-insensitive) em todas as secções (Públicos, Ativos, Finalizados).
  - Chips de filtro por **estado** (Todos / Aguardando / Qualificação / Final / Finalizado).
  - Botão "limpar pesquisa" (X) e secção vazia "nenhum resultado" quando o filtro não devolve nada.
  - UI só aparece quando há torneios e o utilizador não está a criar/entrar num torneio.
- **ROBUSTEZ DE EXPLICAÇÃO** (mudanças pré-existentes não commitadas, agora integradas):
  - `RevealView.tsx` e `QuestionDisplay.tsx` lêem a explicação com fallback para `metadata.explanation` / `metadata.curiosidade` quando a coluna `explanation` não existe na BD.
  - `SoloGame.tsx` e `SpectatorView.tsx` deixam de selecionar a coluna `explanation` (evita erro 400 do PostgREST antes da migração 012 ser aplicada).
  - Migração `supabase/migrations/012_add_explanation_to_questions.sql`: adiciona colunas `explanation` e `hint` à tabela `questions` (idempotente com `IF NOT EXISTS`).
- **TAREFA DIÁRIA — Novas perguntas**: Executado `npm run daily`. 0 novas perguntas (API keys de IA não definidas; fallbacks já existem na BD). Script alerta claramente quando não há chaves de IA.
- **TAREFA SEMANAL — Verificação de duplicados**: Executado `scripts/weekly-dedupe.mjs`. Total na BD: 2.531 perguntas. **0 duplicados exatos removidos**. 24 grupos de duplicados aproximados detetados — esmagadoramente Bandeiras com texto genérico + imagens diferentes (falsos positivos, não removidos).
- **LINT**: sem novos erros (warnings/erros pré-existentes em `cache`/`tts`/`geo-service`/etc.). **BUILD: OK**.
- **AÇÃO PENDENTE (manual)**: aplicar as migrações 010–015 no Supabase (SQL Editor) quando houver acesso (sem CLI/config).

## [2026-08-16] Sistema de Equipas Implementado
- Criado ecrã de ranking por equipas (`/teams/ranking`) com pódio, contagem de membros, pins e pontuações coletivas.
- Atualizado `/api/answer/route.ts` para somar pontos coletivos à tabela `teams.total_score` sempre que um membro da equipa responde corretamente.
- Adicionado acesso rápido ao ranking de equipas na página de equipas (`/teams`).
- Atualizado `TAREFAS.md` marcando o Sistema de Equipas como completo.
- Testes e build executados com sucesso (`npm test` e `npm run build`).

## [2026-08-17] Código Único por Jogador (FASE 2)
- **TAREFA**: Implementar "Código único por jogador" (próxima tarefa pendente de maior valor em TAREFAS.md).
- Criada migração `supabase/migrations/010_add_invite_code.sql`:
  - Adiciona coluna `invite_code TEXT UNIQUE` a `profiles`.
  - Gera código único (8 chars, do id do user) no registo via `handle_new_user`.
  - Backfill de perfis existentes; índice `idx_profiles_invite_code`.
- API `src/app/api/invite/route.ts` (GET `?code=`) para procurar perfil por código.
- Página `src/app/invite/[code]/page.tsx`: QR Code, link copiável e botão "Adicionar como amigo" (usa API de amigos existente).
- Perfil (`src/app/profile/page.tsx`): card com o código e botão "Copiar link".
- Tipo `Profile.invite_code` adicionado em `src/types/index.ts`.
- `TAREFAS.md` atualizado: Código Único por Jogador marcado como COMPLETO; próximo = Torneios.
- **DECISÃO**: código derivado do `id` do utilizador (garante unicidade a 100%, sem risco de colisão no trigger). Sem login social (fora de escopo).
- **AÇÃO PENDENTE (manual)**: aplicar a migração 010 no Supabase (não há CLI/config nem service role key neste ambiente). Comando: `supabase db push` ou colar o SQL de `010_add_invite_code.sql` no SQL Editor. Sem a migração, a feature não ativa mas o app não quebra (a query simplesmente não devolve o código).
- Lint: 0 erros (2 warnings de estilo pré-existentes). Build: OK.

## [2026-08-17] Rotina Diária + Normalização de Categorias (FASE de Manutenção)
- **TAREFA DIÁRIA — Novas perguntas**: Executado `add-daily.mjs`. Adicionadas **24 novas perguntas** (302 detetadas como duplicados). Total na BD: **2.553 perguntas**.
- **TAREFA SEMANAL — Verificação de duplicados**: Script de deteção encontrou 354 pares candidatos (texto+categoria, case-insensitive). A esmagadora maioria (271+19) são perguntas de **Bandeiras** com texto genérico e imagens diferentes (falsos positivos). Duplicados reais (texto+opções idênticos): ~63.
- **BUG CRÍTICO DE GAMEPLAY CORRIGIDO — Categorias com casing inconsistente**:
  - A config de categorias do app usava `dbName: "Bandeiras"` e `dbName: "HISTORIA"`, mas os dados usam `BANDEIRAS` e `HISTÓRIA`.
  - Impacto: a categoria **"História" devolvia 0 perguntas** e **"Bandeiras" só devolvia 12 de 78**.
  - Corrigido em `useGameSetup.ts`, `useQuestionManagement.ts`, `categories/page.tsx` e `history/page.tsx` para usarem `BANDEIRAS` / `HISTÓRIA` (canónico dos dados).
- **MIGRAÇÃO 012** (`supabase/migrations/012_normalize_categories.sql`):
  - Normaliza linhas com casing errado (`Bandeiras`→`BANDEIRAS`, `HISTORIA`→`HISTÓRIA`).
  - Adiciona políticas UPDATE/DELETE à tabela `questions` (manutenção).
  - Remove duplicados exatos (texto+opções iguais), mantendo o id mais baixo — flags excluídas naturalmente (opções distintas).
  - **AÇÃO PENDENTE (manual)**: aplicar a migração 012 no Supabase (SQL Editor). Sem isso, as 12 linhas `Bandeiras` ficam órfãs e o app (agora a usar `BANDEIRAS`) não as lê — serão normalizadas pela migração.
- `add-daily.mjs`: corrigido casing `Bandeiras`→`BANDEIRAS` e dedupe agora trata categoria em uppercase (evita reintroduzir variantes).
- **MIGRAÇÃO 011** (achievements, bug 8.8) concluída e a compilar; falta aplicação manual no Supabase (igual à 010).
- Build: OK. Lint: sem novos erros.

## [2026-08-17] Ciclo de Manutenção Autónomo (Daily + Dedupe + Pipeline)
- **TAREFA DIÁRIA — Novas perguntas**: Criado `add-fresh-batch.mjs` com lote curado de 32 perguntas (2-4 por categoria). Inseridas **24 novas perguntas** (8 detetadas como duplicados e ignoradas). Total na BD: **2.577 perguntas**.
- **CORREÇÃO DE DADOS — Orfãos `Bandeiras`**: Encontradas 24 linhas com categoria `Bandeiras` (casing errado, órfãs — o app usa `BANDEIRAS`). Normalizadas para `BANDEIRAS` via update direto (passam a ser jogáveis).
- **TAREFA SEMANAL — Verificação de duplicados**: Script de limpeza removeu **49 duplicados exatos** (texto+categoria+opções idênticos). Total após limpeza: **2.528 perguntas**.
- **MELHORIA — Pipeline de geração diária** (`scripts/daily-questions.mjs`, usado por `npm run daily`):
  - Agora carrega `.env` (dotenv) e lê as chaves corretas (`NEXT_PUBLIC_GEMINI_API_KEY`, `GROQ_API_KEY`).
  - Geração por IA com **Gemini → fallback Groq** (igual à app) e fallback curado caso não haja chaves.
  - Prompt por categoria (mais específico) e `age_rating` aleatório; dedupe por `texto|category`; parâmetro `QUESTIONS_PER_CATEGORY`.
  - Fica pronto para gerar perguntas novas automaticamente assim que as API keys forem preenchidas no `.env`.
- `add-fresh-batch.mjs` reutilizável para adicionar lotes curados manualmente em cada ciclo.

## [2026-08-17] Ciclo de Manutenção Autónomo (2º ciclo)
- **TAREFA DIÁRIA — Novas perguntas**: Executado `npm run daily` (pipeline `scripts/daily-questions.mjs`). Inseridas **4 novas perguntas** (as restantes 26 eram fallback já existentes e foram ignoradas por dedupe). Total na BD: **2.532 perguntas**.
- **TAREFA SEMANAL — Verificação de duplicados**: Criado `scripts/weekly-dedupe.mjs` (remove duplicados exatos texto+categoria+opções, mantém o id mais baixo; reporta duplicados aproximados para revisão manual). Executado: **1 duplicado exato removido**. 24 grupos de duplicados aproximados detetados — esmagadoramente Bandeiras (texto genérico + imagens diferentes = falsos positivos, não removidos).
- **MELHORIA DE UX**: Cartões de torneio na lista (`/tournaments`) agora são clicáveis e navegam para o detalhe `/tournaments/[id]` (antes não tinham ação de clique).
- **TAREFAS.md**: Torneios marcados como COMPLETO (já estavam implementados: criação, registo de equipas, fases LOBBY/QUALIFYING/FINAL/FINISHED, classificações em tempo real e ecrã de detalhe). Próximo = Login Social ou histórico de perfil.
- Pendente (manual, sem CLI Supabase): aplicar migrações 010 (invite_code), 011 (achievements), 012 (normalize categories) no Supabase.
- Lint pendente de verificação; build pendente.

## [2026-08-18] Prémios/loot para o Top 3 em Torneios (FASE 3)
- **TAREFA**: Implementar "Prémios/loot para o top 3 em Torneios" (próxima tarefa pendente de TAREFAS.md).
- **MUDANÇAS**:
  - Migração `supabase/migrations/014_add_tournament_prizes.sql`: adiciona coluna `prizes JSONB` à tabela `tournaments` (default `{first,second,third}` vazio) para guardar os prémios definidos pelo criador.
  - Tipo `Tournament.prizes` (`TournamentPrizes`) adicionado em `src/types/index.ts`.
  - Formulário de criação (`src/app/tournaments/page.tsx`): novos campos opcionais para definir o prémio de 1º, 2º e 3º lugar, guardados no insert do torneio.
  - Ecrã de detalhe (`src/app/tournaments/[id]/page.tsx`): nova secção "Prémios do Top 3" que lista os prémios definidos; quando o torneio está `FINISHED`, mostra a equipa vencedora de cada lugar (pódio com loot).
- **AÇÃO PENDENTE (manual)**: aplicar a migração 014 no Supabase (SQL Editor). Sem a migração, a coluna não existe mas o app não quebra (a query devolve `prizes` nulo e a secção não é renderizada).
- Lint: sem novos erros (warnings/erros pré-existentes em `caches`/`tts`/etc.). Build: OK.

## [2026-08-18] Melhoria de Histórico no Perfil (FASE 3)
- **TAREFA**: Melhorar o histórico de jogos no perfil (próxima tarefa de TAREFAS.md: "Melhorias de histórico no perfil").
- **MUDANÇAS**:
  - Estendido tipo `AnswerSummary` com campos `question_id`, `chosen_option` e `time_taken` (tipos mais ricos para análise).
  - Query do perfil agora busca `question_id, chosen_option, time_taken` além dos campos existentes.
  - **Novo UI do histórico**: cada jogo mostra agora barra de progresso visual (accuracy %), tempo médio de resposta, indicador de performance (★ Perfeito / Bom / Fraco), data formatada, e contagem total de respostas registadas.
  - Máximo de 15 jogos visíveis (antes eram 10), com cálculo de accuracy por jogo.
- **LINT**: 0 erros novos (warnings pré-existentes). Build: OK.

## [2026-08-17] Ciclo de Manutenção — Login Social + Correção de Dados + Lint
- **Login Social (Facebook)**: Implementado na página `/login` (`handleOAuthLogin` genérico para Google e Facebook). Dois botões OAuth lado a lado com ícones SVG respetivos. O provider é parametrizado para facilitar adição de novos provedores. `redirectTo` aponta para `/profile`.
- **Lint + Build**: A página de login foi limada de erros. Removidos `any` types dos `catch` (usado `err: unknown` + `instanceof Error`) e variável `router` não usada. Removidos `data` não usados no destructuring. Página agora lint-clean (0 erros, 0 warnings). Build: OK.
- **Correção de Dados — Typo `GEGRAFIA`**: Encontrada 1 linha com categoria `GEGRAFIA` (erro de digitação — faltando 'O'). Normalizada para `GEOGRAFIA` via update direto. Criada migração `013_normalize_geografia.sql` para registo/documentação.
- **Migrações 002 + 003**: Adicionados `DROP POLICY IF EXISTS` antes de cada `CREATE POLICY` para tornar as migrações idempotentes (seguro re-aplicar sem erros de "policy already exists").
- **TAREFA DIÁRIA — Novas perguntas**: Executado `npm run daily` (`scripts/daily-questions.mjs`). 0 novas perguntas (API keys de IA não definidas; todos os fallbacks já existiam na BD). Script alerta claramente quando não há chaves de IA configuradas.
- **TAREFA SEMANAL — Verificação de duplicados**: Executado `scripts/weekly-dedupe.mjs`. Total na BD: 2.532 perguntas. 0 duplicados exatos removidos. 24 grupos de duplicados aproximados detectados — a maioria são Bandeiras com texto genérico + imagens diferentes (falsos positivos, não removidos).

## [2026-08-18] Torneios Públicos vs Privados (FASE 3 — item 8 da ordem de trabalho)
- **TAREFA**: Implementar "Torneios públicos vs privados" (próxima tarefa pendente de TAREFAS.md).
- **MUDANÇAS**:
  - Migração `supabase/migrations/015_add_tournament_is_public.sql`: adiciona coluna `is_public BOOLEAN DEFAULT false` à tabela `tournaments`.
  - Tipo `Tournament.is_public` adicionado em `src/types/index.ts`.
  - Formulário de criação (`src/app/tournaments/page.tsx`): novo toggle "Torneio Público" (ícone Globo/Cadeado) que define `is_public` no insert; texto explicativo contextual.
  - Lista de torneios (`/tournaments`): dividida em secções "Torneios Públicos" (descoberta, com botão "Entrar no Torneio Público" direto, sem PIN) e "Torneios Ativos" (privados, entrada por código). Cartões mostram badge Público/Privado.
  - Fluxo de entrada pública: painel de seleção de equipa + "Entrar" sem necessitar de PIN (função `joinPublicTournament` na lista e no detalhe).
  - Página de detalhe (`src/app/tournaments/[id]/page.tsx`): badge "Público", secção "Entrar no Torneio Público" com seleção de equipa e botão de entrada (estado LOBBY); desativa equipas já inscritas.
- **AÇÃO PENDENTE (manual)**: aplicar a migração 015 no Supabase (SQL Editor). Sem a migração, a coluna não existe mas o app não quebra (a query devolve `is_public` nulo e todos os torneios comportam-se como privados).
- **LINT**: 0 novos erros (3 warnings/erros pré-existentes de `any` em catch de funções já existentes mantidos por consistência). **BUILD: OK**.
- **TAREFAS.md**: item 8 marcado como COMPLETO; adicionado backlog de sugestões. Próximas sugestões: notificações para públicos, filtros/pesquisa, torneios por whitelist de equipas.

## [2026-08-18] Ciclo de Manutenção — Perguntas Diárias + Dedupe Semanal
- **TAREFA DIÁRIA — Novas perguntas**: Executado `npm run daily` (`scripts/daily-questions.mjs`). 0 novas perguntas (API keys de IA não definidas; todos os fallbacks já existiam na BD). Script alerta claramente quando não há chaves de IA configuradas.
- **TAREFA SEMANAL — Verificação de duplicados**: Executado `scripts/weekly-dedupe.mjs`. Total na BD: 2.532 perguntas. **1 duplicado exato removido**. 25 grupos de duplicados aproximados detetados — esmagadoramente Bandeiras com texto genérico + imagens diferentes (falsos positivos, não removidos).
