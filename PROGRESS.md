# 📈 Progress Log - QuizVerse

## [2026-09-05] Ciclo de Manutenção (16º ciclo, 8h) — Novas Perguntas + Dedupe Semanal

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+2 novas** via built-in (MATEMATICA). Backup: 3382 → 3384. Total na BD: 3.384.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 159 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 1.584 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.384.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-09-04] Ciclo de Manutenção (15º ciclo, 8h) — Novas Perguntas + Dedupe Semanal

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+3 novas** via built-in (CIENCIA, MATEMATICA). Backup: 3379 → 3382. Total na BD: 3.382.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 157 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 1.583 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.382.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-09-04] Ciclo de Manutenção (14º ciclo, 8h) — Novas Perguntas + Dedupe Semanal

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+4 novas** via built-in (CIENCIA, MATEMATICA). Backup: 3375 → 3379. Total na BD: 3.379.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 157 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 1.544 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.379.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-09-04] Ciclo de Manutenção (13º ciclo, 8h) — Novas Perguntas + Dedupe Semanal

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+4 novas** via built-in (CIENCIA, MATEMATICA). Backup: 3365 → 3369. Total na BD: 3.375.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 157 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 1.488 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.375.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-09-04] Ciclo de Manutenção (12º ciclo, 8h) — Novas Perguntas + Dedupe Semanal

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+4 novas** via built-in (CIENCIA, MATEMATICA). Backup: 3361 → 3365. Total na BD: 3.365.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 139 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 1.390 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.365.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-09-04] Ciclo de Manutenção (11º ciclo, 8h) — Novas Perguntas + Dedupe Semanal

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+4 novas** via built-in (CIENCIA, MATEMATICA). Backup: 3315 → 3319. Total na BD: 3.361.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 139 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 1.337 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.361.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-08-29] Ciclo de Manutenção (10º ciclo, 8h) — Modo Treino por Categoria no Solo + Novas Perguntas + Dedupe Semanal

- **MELHORIA — Modo Treino por Categoria no Solo (`src/components/mobile/SoloGame.tsx`)**:
  - Adicionado ecrã inicial de seleção de categoria antes de iniciar o jogo solo.
  - O jogador pode escolher **"Todas as Categorias"** (modo original) ou filtrar por uma categoria específica (ex: Ciência, História, Portugal & Freguesias, etc.).
  - Mostra contador de perguntas disponíveis por categoria (`categoryCounts`) obtido da BD em tempo real.
  - Categorias sem perguntas aparecem desativadas.
  - Botão "Escolher Categoria" no ecrã de erro permite voltar à seleção.
  - Lint clean, build OK, testes 15/15 passam.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+6 novas** via built-in (CIENCIA, MATEMATICA, PORTUGAL_FREGUESIAS). Backup: 3303 → 3309. Total na BD: 3.315.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria), 91 pares fuzzy (≥0.9) reais fora de BANDEIRAS, 972 pares de famílias de template ignorados como falsos positivos. Total na BD: 3.315.
  - Relatório gravado em `scripts/dedupe-report.json`.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros; lint clean no ficheiro alterado.

## [2026-08-29] Ciclo de Manutenção (9º ciclo, 8h) — Portugal & Freguesias + Controlos de Host na TV + Legendas Visuais + Dedupe & Novas Perguntas

- **MELHORIA — Nova Categoria `Portugal & Freguesias` (`PORTUGAL_FREGUESIAS`)**:
  - Adicionada aos seletores de categorias (`src/app/categories/page.tsx` e `src/hooks/useGameSetup.ts`) com ícone `Landmark` e cor âmbar.
  - Lote curado de 55 perguntas dedicado a freguesias, concelhos, distritos, ilhas e património de Portugal inserido com sucesso na BD via `scripts/add-portugal-freguesias.mjs`.
  - Integrado no gerador de factos incorporados (`scripts/builtin-facts.mjs`) e na rotina diária (`scripts/daily-questions.mjs`), permitindo crescimento sustentável e autónomo.
- **MELHORIA — Controlos do Host / Apresentador na TV (`src/app/tv/page.tsx`, `useQuestionFlowTimer.ts`, `useKeyboardShortcuts.ts`)**:
  - Barra flutuante de ações rápidas no ecrã de apresentador: **Pausar / Retomar** (tecla `P`), **Voltar Atrás** (tecla `B`) e **Saltar Pergunta** (tecla `S`).
  - Congelamento completo dos temporizadores de pergunta e de transição quando em pausa, acompanhado por overlay visual claro de pausa ("JOGO EM PAUSA").
- **MELHORIA — Legendas e Apresentação Visual (`/modes`, `/categories`, `/tv`, `/play`)**:
  - **Página de Modos (`/modes`)**: Adicionados badges com estimativa de duração (~3 min, ~5 min, Por Rondas), formato (1 Jogador, 2 a 4 Jogadores, Competição Aberta) e tags destacadas.
  - **Página de Categorias (`/categories`)**: Legendas informativas, contadores de perguntas estilizados e tags de quiz.
  - **Ecrã de TV (`QuestionDisplay.tsx`)**: Legenda dinâmica indicando a fase ativa ("Responde no teu telemóvel" / "Revelação dos Resultados").
  - **Ecrã de Jogador (`QuestionView.tsx`)**: Legenda indicativa de bónus de pontuação por velocidade.
- **CORREÇÃO DE DADOS**:
  - Corrigido typo em `scripts/builtin-facts.mjs` (`GASTRONOMY` → `GASTRONOMIA`) e normalizados 20 registos no Supabase e `questions_backup.json`.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+8 novas** via built-in. Backup atualizado para 3.164.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **55 duplicados exatos removidos** pós-inserção de lote. 72 pares fuzzy e 922 famílias de template registados em `scripts/dedupe-report.json`. Total na BD: 3.294.
- **LINT/BUILD/TESTS**: `npm test` 15/15 passaram; `npm run build` gerou 40/40 páginas estáticas e rotas dinâmicas sem erros.

## [2026-08-24] Ciclo de Manutenção (8º ciclo, 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados + MELHORIA (reduced-motion global)

- **MELHORIA — `src/app/layout.tsx` (acessibilidade: `prefers-reduced-motion`)**: Embrulhado o `GameProvider` em `<MotionConfig reducedMotion="user">` do Framer Motion. Isto faz com que TODAS as animações do app (TV, telemóvel, espetador, transições) respeitem automaticamente a preferência de sistema "Reduzir Movimento" (acessibilidade, item 9.5 da auditoria). Alteração de uma linha + import, sem impacto visual para utilizadores normais. Lint clean.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+17 novas** (built-in fact-table em 15 categorias; pool curado e seed bank vazios, sem chaves de IA). Backup: 3139 → 3156. Total na BD: 3.167.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria) e 63 pares fuzzy (≥0.9) reais fora de BANDEIRAS + 499 pares de família de template excluídos como falsos positivos, registados em `scripts/dedupe-report.json`. Total na BD: 3.167.
- **LINT/BUILD/TESTS**: alteração restrita a `src/app/layout.tsx` (lint clean) + `questions_backup.json` e `dedupe-report.json` atualizados. Sem impacto no app.

## [2026-08-24] Ciclo de Manutenção (7º ciclo, 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados + MELHORIA (relatório de duplicados útil)

- **MELHORIA — `scripts/weekly-dedupe.mjs` (exclusão de falsos positivos de template)**: Adicionada a função `isTemplateFamily()` que deteta pares de perguntas que partilham um prefixo/sufixo longo (mesma família de template, ex: "Qual é o símbolo químico do elemento X?" para dezenas de elementos, ou "Qual é a capital de Y?"). Estes pares não são duplicados reais e inundavam o relatório fuzzy (513 pares na iteração anterior, quase todos ruído). Agora são contabilizados à parte (`templateFamilyPairs`) e excluídos do relatório de revisão manual. Resultado: **63 pares fuzzy reais** (candidatos a revisão manual) + **450 pares de família de template ignorados**. O relatório `scripts/dedupe-report.json` passa a incluir `templateFamilyPairs`.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+19 novas** (built-in fact-table em 15 categorias; pool curado e seed bank vazios, sem chaves de IA). Backup: 3120 → 3139. Total na BD: 3.150.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria) e 63 pares fuzzy (≥0.9) reais fora de BANDEIRAS + 450 pares de família de template excluídos como falsos positivos, registados em `scripts/dedupe-report.json`. Total na BD: 3.150.
- **LINT/BUILD/TESTS**: alterações restritas a `scripts/weekly-dedupe.mjs` (`node --check` OK) + `questions_backup.json` e `dedupe-report.json` atualizados. Sem impacto no app.

## [2026-08-24] Ciclo de Manutenção (6º ciclo, 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados + MELHORIA (centralização de bandeiras + robustez de pontuação)

- **MELHORIA — `src/lib/flags.ts` (resolução centralizada de bandeiras)**: Extraída a lógica de resolução de URL de bandeira (de `image_url` ou fallback por nome de país → código ISO) de `QuestionDisplay.tsx`, `QuestionView.tsx` e `SpectatorView.tsx` para um helper `getFlagUrl()`/`getFlagCode()` reutilizável, com `countryMap` alargado a ~150 países (Europa/Américas/Ásia-Oceânia/África). Remove duplicação e garante consistência visual das bandeiras em TV, telemóvel e espetador.
- **MELHORIA — Robustez de pontuação/correção em `src/app/api/answer/route.ts` e `src/app/play/page.tsx`**: `route.ts` passa a ler `correct_option` diretamente da BD (com fallback para `game.settings.current_correct_option`), eliminando dependência frágil do estado do jogo. `play/page.tsx` usa `questionData.correct_option` diretamente, sincroniza imediatamente ao selecionar e aplica os `points` devolvidos pela API (`setEarnedPoints` só sobrescreve se não houver valor positivo), evitando pontuação dupla/perdida.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+40 novas** no total do ciclo (2 lotes de 20 do built-in fact-table em 12 categorias: CIENCIA, CULTURA_GERAL, HISTÓRIA, GASTRONOMIA, TECNOLOGIA, DESPORTO, ARTE, MATEMATICA, CINEMA, POLITICA + fallback). O 1º lote (3080→3100) foi seguido de um `git pull --rebase` que revelou divergência do remoto em `questions_backup.json`; resolvido com a versão do remoto e re-executado `npm run daily` para re-sincronizar o backup com a BD real (3100→3120), sem duplicados exatos (dedupe por texto|categoria). Backup final: 3080 → 3120. Total na BD: 3.131.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados e 373 pares fuzzy (≥0.9) fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: 3.131.
- **LINT/BUILD/TESTS**: alterações restritas a `src/lib/flags.ts` (novo, lint-clean) + 5 ficheiros de componentes/API (erros de lint pré-existentes em `play/page.tsx` e `QuestionDisplay.tsx` mantidos; 0 erros novos introduzidos). `questions_backup.json` e `dedupe-report.json` atualizados.

## [2026-08-24] Ciclo de Manutenção (5º ciclo, 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados

- **CONTEXTO — Gerador built-in a funcionar**: O `builtin-facts.mjs` continua operacional com variantes combinatórias (forward/reverse) em todas as 13 categorias fact-table + CULTURA_GERAL (36 factos) + MATEMATICA (infinito) + CAPITAIS/GEOGRAFIA (45 países). Pool curado e seed bank vazios, sem chaves de IA — ciclo usa exclusivamente o gerador incorporado.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+23 novas** (built-in fact-table distribuídas por 12 categorias: CIENCIA, CULTURA_GERAL, ANIMAIS, HISTÓRIA, GASTRONOMIA, MUSICA, TECNOLOGIA, DESPORTO, ARTE, MATEMATICA, CINEMA, POLITICA). Backup: 3057 → 3080. Total na BD: ~3.060.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria) e 373 pares fuzzy (≥0.9) fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: 3.060.
- **LINT/BUILD/TESTS**: alterações restritas a scripts (backup + report + PROGRESS); sem impacto no app. `node --check` OK.

## [2026-08-23] Ciclo de Manutenção (4º ciclo, 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados

- **CONTEXTO — Melhorias consolidadas**: O `builtin-facts.mjs` já tem variantes combinatórias (forward/reverse) em todas as 13 categorias fact-table + CULTURA_GERAL (36 factos) + MATEMATICA (infinito) + CAPITAIS/GEOGRAFIA (45 países). Total de textos únicos geráveis: ~345. Pool curado vazio, seed bank esgotado (todas no BD), sem chaves de IA — o ciclo usa exclusivamente o gerador incorporado.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+24 novas** (built-in fact-table distribuídas por todas as 15 categorias: CIENCIA, CULTURA_GERAL, ANIMAIS, HISTÓRIA, GASTRONOMIA, MUSICA, TECNOLOGIA, DESPORTO, ARTE, MATEMATICA, CINEMA, POLITICA, CAPITAIS_DO_MUNDO, GEOGRAFIA, BANDEIRAS). Backup: 3033 → 3057. Total na BD: ~3.037.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria) e 353 pares fuzzy (≥0.9) fora de BANDEIRAS (ARTE, CINEMA, MUSICA, POLITICA) registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: 3.037.
- **LINT/BUILD/TESTS**: alterações restritas a scripts (backup + report + PROGRESS); sem impacto no app. `node --check` OK.

## [2026-08-23] Ciclo de Manutenção (3º ciclo, 8h) — MELHORIA (variantes combinatórias + tabelas expandidas) + Novas perguntas + TAREFA SEMANAL — Duplicados

- **CONTEXTO — Banco estagnado no built-in**: Sem IA nem pool/seed, o ciclo de 8h recorria ao gerador fact-table. Mas as tabelas eram finitas e já largamente inseridas na BD: o 1º ciclo do dia produziu apenas **9 novas** (em vez das ~30 alvo). Cada fact gerava 1 única pergunta; esgotadas as tabelas, o banco parava de crescer.
- **MELHORIA — Variantes combinatórias + tabelas expandidas em `scripts/builtin-facts.mjs`**: Cada fact é agora perguntado em ≥2 direções (forward + reverse) onde faça sentido — ex.: CIENCIA "símbolo de X" ↔ "elemento com símbolo Y"; ANIMAIS/MUSICA "é um {classe}" ↔ "NÃO é um {classe}"; HISTÓRIA/GASTRONOMIA/ARTE/CINEMA/POLITICA/TECNOLOGIA/DESPORTO com pergunta inversa. Tabelas expandidas: ELEMENTS 20→39, ANIMAL_CLASSES +Inseto, HISTORY 10→20, GASTRONOMY 12→22, INSTRUMENTOS +teclas, TECH 8→15, SPORT 7→12, ART 8→14, FILM 8→15, POLITICS 7→13, CULTURA_GERAL 20→36. Total de textos únicos geráveis saltou de ~150 para **345** (validação: 5000 geradas, 0 inválidas, `node --check` OK).
- **TAREFA DIÁRIA — Novas perguntas (1º ciclo, pré-melhoria)**: `npm run daily` → **+9 novas** (fact-table esgotada). Backup: 3000 → 3009.
- **TAREFA DIÁRIA — Novas perguntas (3º ciclo, pós-melhoria)**: `npm run daily` → **+24 novas** (variantes combinatórias a atravessar todas as 15 categorias). Backup: 3009 → 3033. Sem IA nem pool/seed.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. Grupos aproximados (BANDEIRAS, falsos positivos) e pares fuzzy (≥0.9) fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: ~3.033.
- **LINT/BUILD/TESTS**: alterações restritas a scripts (`builtin-facts.mjs` + backup + report + PROGRESS); sem impacto no app. `node --check` OK; validação do gerador OK.

## [2026-08-23] Ciclo de Manutenção (2º ciclo, 8h) — MELHORIA (gerador CULTURA_GERAL) + Novas perguntas + TAREFA SEMANAL — Duplicados

- **CONTEXTO — CULTURA_GERAL sem gerador incorporado**: Dos 15 categorias, o `builtin-facts.mjs` cobria 13 (CIENCIA, ANIMAIS, HISTÓRIA, GASTRONOMIA, MUSICA, TECNOLOGIA, DESPORTO, ARTE, CINEMA, POLITICA, MATEMATICA, CAPITAIS_DO_MUNDO, GEOGRAFIA). `CULTURA_GERAL` e `BANDEIRAS` ficavam sem built-in (BANDEIRAS exige imagem e mantém-se de fora por segurança). Sem IA nem pool/seed, o ciclo de 8h produzia só ~16 perguntas em vez das 30 alvo, e CULTURA_GERAL parava de crescer.
- **MELHORIA — Gerador fact-table para CULTURA_GERAL**: Adicionado `CULTURA_GERAL()` a `FACT_GENERATORS` em `scripts/builtin-facts.mjs` com tabela de 20 factos curados (oceano/rio/montanha mais..., planetas, recordes, moedas, fusos, órgãos). Cada pergunta tem 4 opções únicas e `correct_option` calculado. Também corrigido/estendido a tabela `POLITICS` (ONU duplicada → substituída por Interpol/OMS). Validação isolada: 2000 perguntas geradas para CULTURA_GERAL, **0 inválidas**, 20 textos únicos; `node --check` OK.
- **TAREFA DIÁRIA — Novas perguntas (1º ciclo do dia)**: `npm run daily` → **+16 novas** (fact-table + built-in matemática/geografia/capitais). Backup: 2869 → 2885.
- **TAREFA DIÁRIA — Novas perguntas (2º ciclo, pós-melhoria)**: `npm run daily` → **+15 novas** (agora inclui CULTURA_GERAL: "montanha mais alta da Europa", "língua materna mais falada", etc.). Backup: 2885 → 2900. Sem IA nem pool/seed.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. Grupos aproximados e pares fuzzy (≥0.9) fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: 2.985.
- **LINT/BUILD/TESTS**: alterações restritas a scripts (`builtin-facts.mjs` + backup + report + PROGRESS); sem impacto no app. `node --check` OK; validação do gerador OK.

## [2026-08-23] Ciclo de Manutenção (rotina de 8h) — Novas perguntas + MELHORIA (geradores fact-table modulares) + TAREFA SEMANAL — Duplicados

- **CONTEXTO — Integração dos geradores fact-table quebrada**: A melhoria anterior moveu os geradores determinísticos para `scripts/builtin-facts.mjs` e importou-os em `scripts/daily-questions.mjs`, mas ficaram declarações duplicadas (`CATEGORIES` e `FACT_GENERATORS`) que impedim o script de correr (`SyntaxError`). Sem isto, o ciclo de 8h não executava.
- **MELHORIA — Consolidação do módulo fact-table**: Removidas as declarações duplicadas em `scripts/daily-questions.mjs` (bloco inline que redefinia `FACT_GENERATORS` e as helpers `pick`/`factOptions`/`factQuestion`). Agora `daily-questions.mjs` importa `FACT_GENERATORS` de `scripts/builtin-facts.mjs`. Os 10 geradores (CIENCIA, ANIMAIS, HISTÓRIA, GASTRONOMIA, MUSICA, TECNOLOGIA, DESPORTO, ARTE, CINEMA, POLITICA) produzem perguntas verificadas (4 opções únicas, índice `correct_option` calculado, nunca hardcoded). Validação isolada: 2000 perguntas geradas (200×categoria), 0 inválidas.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+22 novas** (built-in fact-table distribuídas por CIENCIA, ANIMAIS, HISTÓRIA, GASTRONOMIA, MUSICA, TECNOLOGIA, DESPORTO, ARTE, MATEMATICA, CINEMA, POLITICA + fallbacks de CULTURA_GERAL/BANDEIRAS). Backup: 2847 → 2869. Pool: 0 (sem IA nem seed).
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 28 grupos aproximados (texto+categoria) e 379 pares fuzzy (≥0.9) fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: 2.939.
- **LINT/BUILD/TESTS**: alterações restritas a scripts (`builtin-facts.mjs` novo + fix em `daily-questions.mjs`) + backup + report + PROGRESS; sem impacto no app. `node --check` OK em ambos os ficheiros.

## [2026-08-22] Ciclo de Manutenção (rotina de 8h) — Novas perguntas + MELHORIA (diversidade do seed bank) + TAREFA SEMANAL — Duplicados

- **CONTEXTO — built-in só cobria 3 categorias**: O `builtinBatch()` (usado quando pool+seed estão esgotados) só produz perguntas para **MATEMATICA / CAPITAIS_DO_MUNDO / GEOGRAFIA**; as restantes 12 categorias ficavam limitadas a 1 fallback cada (já na BD → deduped → 0 crescimento). O banco crescia, mas de forma enviesada.
- **MELHORIA — Seed bank diversificado**: Adicionadas **45 perguntas curadas novas** (3 por categoria × 15 categorias) a `scripts/curated-seed.json` (128 → 173). Isto devolve material fresco ao auto-replenish do pool `curated-pool.json` para TODAS as categorias, não só as 3 do built-in. Validação: JSON OK, índices `correct_option` corretos, 4 opções únicas por pergunta.
  - `node -e` confirmou 173 perguntas no seed e correção dos índices.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+26 novas** (pool auto-reposto do seed com 26 perguntas DISTRIBUÍDAS por CIENCIA, CULTURA_GERAL, ANIMAIS, HISTÓRIA, GASTRONOMIA, MUSICA, TECNOLOGIA, DESPORTO, ARTE, GEOGRAFIA, MATEMATICA, CINEMA, POLITICA, CAPITAIS_DO_MUNDO, BANDEIRAS — não só as 3 do built-in). Backup: 2786 → 2812. Pool: 0 → 26 (seed) → 0 (usadas).
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. Grupos aproximados (BANDEIRAS, falsos positivos) e pares fuzzy fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: ~2.882.
- **LINT/BUILD/TESTS**: alterações restritas a scripts (seed) + backup + PROGRESS; sem impacto no app. `node --check` OK em `daily-questions.mjs`; validação de seed OK.

## [2026-08-22] Ciclo de Manutenção (rotina de 8h) — Novas perguntas + MELHORIA (built-in batch) + TAREFA SEMANAL — Duplicados

- **CONTEXTO — Pool curado + seed bank esgotados**: O `scripts/curated-pool.json` está a 0 e o `scripts/curated-seed.json` (128 perguntas) já está **100% na BD** (todas consumidas pelo auto-replenish dos ciclos anteriores). Sem chaves de IA (`.env` tem `NEXT_PUBLIC_GEMINI_API_KEY`/`GROQ_API_KEY` vazias), o ciclo caiu no gerador incorporado (built-in), que antes produzia apenas **3 perguntas/ciclo** (1 por categoria suportada) — crescimento diário insustentavelmente baixo.
- **MELHORIA — `builtinBatch()` no gerador incorporado**: `scripts/daily-questions.mjs` agora tem `builtinBatch()` que, quando pool+seed estão vazios, gera um lote saudável e dedupado: **MATEMATICA** (até `PER_CATEGORY` por ciclo, operandos aleatórios → únicas e praticamente infinitas), **CAPITAIS_DO_MUNDO/GEOGRAFIA** (percorre toda a tabela de ~45 países, uma pergunta por país) e as **restantes 12 categorias** (1 fallback segura cada, adicionada uma vez e depois deduped). Teto de segurança `maxTotal = max(15×PER_CATEGORY, 40)` evita runaway. O banco continua a crescer de forma robusta mesmo sem IA nem pool curado.
  - `node --check` OK em `daily-questions.mjs`.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+40 novas** (built-in batch: GEOGRAFIA + MATEMATICA + CAPITAIS). Banco: ~2816 → 2856 (total na BD confirmado pelo dedupe). `questions_backup.json` atualizado automaticamente (2754 → 2794, incluindo o +3 do 1º ensaio do ciclo).
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. 27 grupos aproximados (texto+categoria) e 325 pares fuzzy (≥0.9) fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos). Total na BD: 2.856.
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup + report + PROGRESS; sem impacto no app. `node --check` OK; `npm test` 15/15 passam.

## [2026-08-21] Ciclo de Manutenção (rotina de 8h) — Novas perguntas + MELHORIA (sustentabilidade do bank) + TAREFA SEMANAL — Duplicados

- **CONTEXTO — Banco congelado**: O `scripts/curated-seed.json` (60 perguntas) estava **98% consumido** (59/60 já na BD), pelo que o `npm run daily` passou a produzir **0 perguntas** — o ciclo de 8h tinha ficado sem material, mesmo com o auto-replenish do pool a partir do seed.
- **MELHORIA — Seed bank expandido**: Adicionadas **68 novas perguntas curadas** (de 91 candidatas; 23 já existiam na BD e foram ignoradas por dedupe) ao `scripts/curated-seed.json` → agora **128 perguntas**. Isto devolve sustentabilidade ao ciclo de 8h por vários ciclos.
- **MELHORIA — Gerador incorporado (built-in) como rede de segurança**: `scripts/daily-questions.mjs` agora tem um `builtinGenerate()` usado quando o pool curado **e** o seed bank estão vazios (sem chaves de IA). Gera perguntas determinísticas e verificáveis: **MATEMATICA** (adição, subtração, multiplicação, divisão, raiz, potência, percentagem — operandos aleatórios → praticamente infinitas e únicas) e **CAPITAIS_DO_MUNDO/GEOGRAFIA** (tabela de ~45 países com distratores). O banco **nunca mais congela** por falta de material, mesmo sem IA.
  - Validação isolada: 2000 perguntas de MATEMATICA + 200 de CAPITAIS geradas sem erros estruturais (4 opções únicas, índice correto).
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+30 novas** (pool auto-reposto do seed com 30 e inseridas; 0 duplicados). Backup: 2718 → 2748. Pool: 0 → 30 (seed) → 0 (usadas). BD: ~2772.
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. Grupos aproximados (BANDEIRAS, falsos positivos) e pares fuzzy fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos).
- **PENDENTE (working tree, não incluído neste commit)**: `src/app/api/answer/route.ts`, `src/app/play/page.tsx`, `src/components/mobile/QuestionView.tsx`, `src/components/mobile/RevealView.tsx` continuam com alterações não comitadas (desativação de mecanismo de eliminação/vidas), inconsistentes com `GameContext.tsx`/`SoloGame.tsx` — mantidas fora do commit para revisão manual.
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup + seed; sem impacto no app. `node --check` OK em `daily-questions.mjs`.

## [2026-08-21] Ciclo de Manutenção (rotina de 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+17 novas** (pool auto-reposto a partir do seed bank com 17; todas inseridas). Pool: 0 → 17 (seed) → 0 (usadas). Backup: 2701 → 2718. BD: ~2742.
  - `questions_backup.json` atualizado automaticamente pelo script (2701 → 2718).
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. Total na BD: 2.742 perguntas. **0 duplicados exatos removidos**. 26 grupos de duplicados aproximados detetados (esmagadoramente BANDEIRAS, falsos positivos). 292 pares fuzzy fora de BANDEIRAS (candidatos a revisão manual, não removidos).
- **PENDENTE (working tree, não incluído neste commit)**: `src/app/api/answer/route.ts`, `src/app/play/page.tsx`, `src/components/mobile/QuestionView.tsx`, `src/components/mobile/RevealView.tsx` continuam com alterações não comitadas (desativação de mecanismo de eliminação/vidas). Inconsistentes com `GameContext.tsx`/`SoloGame.tsx`, mantidas fora do commit para revisão manual.
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup; sem impacto no app. `node --check` OK em `daily-questions.mjs` e `weekly-dedupe.mjs`.

## [2026-08-20] Ciclo de Manutenção (rotina de 8h) — Novas perguntas + TAREFA SEMANAL — Duplicados + MELHORIA (auto-reposição do pool)

- **CONTEXTO**: As API keys de IA (`.env`) continuam vazias, pelo que o `npm run daily` usa o pool curado. O pool estava esgotado (30 → 0 no ciclo anterior) e produziu 0 perguntas.
- **MELHORIA — Seed bank + auto-reposição do pool**: Criado `scripts/curated-seed.json` (60 perguntas, 4 por categoria × 15 categorias, com `metadata.explanation` para o ecrã de revelação da TV) e alterado `scripts/daily-questions.mjs` para **auto-repor** `scripts/curated-pool.json` a partir do seed bank quando este fica abaixo do alvo. Isto torna o ciclo de 8h autossustentável (nunca fica a 0 por falta de material) mesmo sem chaves de IA.
- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+54 novas** (repós o pool a partir do seed bank e inseriu 24 + 30; 6 duplicados ignorados por dedupe no 1º lote). Backup: 2647 → 2701. Pool: 30 → 0 (reposto automaticamente a partir do seed para o próximo ciclo).
  - `questions_backup.json` atualizado automaticamente pelo script.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs` → **0 duplicados exatos removidos**. Grupos de duplicados aproximados detetados (esmagadoramente BANDEIRAS, falsos positivos por desenho) e pares fuzzy fora de BANDEIRAS registados em `scripts/dedupe-report.json` para revisão manual (não removidos automaticamente).
- **PENDENTE (working tree, não incluído neste commit)**: `src/app/api/answer/route.ts`, `src/app/play/page.tsx`, `src/components/mobile/QuestionView.tsx`, `src/components/mobile/RevealView.tsx` têm alterações não comitadas que desativam o mecanismo de eliminação (vidas). São inconsistentes com `GameContext.tsx`/`SoloGame.tsx` e foram deixadas de fora deste commit para revisão manual.
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup + seed + PROGRESS; sem impacto no app. `node --check` OK em `daily-questions.mjs` e `weekly-dedupe.mjs`.

## [2026-08-20] TAREFA DIÁRIA — Novas perguntas + TAREFA SEMANAL — Duplicados + MELHORIA (curiosidades no pool + tooling)

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+21 novas** (pool reposto com 30; 9 duplicados ignorados por dedupe). Pool: 30 → 0. Banco: ~2.668 (BD) / backup 2.626 → 2.647.
  - `questions_backup.json` atualizado automaticamente pelo script (2.626 → 2.647).
- **MELHORIA — Curiosidades na REVEAL**: `scripts/curated-pool.json` enriquecido com `metadata.explanation` (curiosidade) em todas as 30 perguntas, para que o ecrã de revelação da TV mostre contexto extra (já lê `metadata.explanation`). Novo `scripts/backfill-explanations.mjs` preencheu explicações em **31 perguntas** da BD (as 21 inseridas hoje + duplicados correspondentes), tornando a melhoria visível de imediato.
- **MELHORIA — Tooling de manutenção**: `package.json` com novos scripts `dedupe` (`weekly-dedupe.mjs`) e `maintain` (`daily` + `dedupe`) para facilitar o ciclo automático de 8h.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. Total na BD: ~2.668 perguntas. **0 duplicados exatos removidos**. 26 grupos de duplicados aproximados (esmagadoramente Bandeiras, falsos positivos — não removidos). `dedupe-report.json` atualizado.
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup + package.json; sem impacto no app. `node --check` OK; testes (`npm test`) 15/15 passam; pool curado reposto com 30 para o próximo ciclo.

## [2026-08-20] TAREFA DIÁRIA — Novas perguntas + TAREFA SEMANAL — Duplicados (com deteção fuzzy) + MELHORIA dedupe

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+26 novas** (pool curado reposto com 30; 4 duplicados ignorados por dedupe). Pool: 30 → 0. Banco: 2.600 → 2.626 (backup sincronizado) / ~2.650 (BD).
  - `questions_backup.json` atualizado automaticamente pelo script (2.600 → 2.626).
- **MELHORIA — Reposição do pool curado**: pool esgotado (30 → 0 no ciclo anterior) reposto com **30 novas perguntas** (2 por categoria × 15 categorias), tópicos menos comuns e não-óbvios. Próximo ciclo reabastecerá quando esgotar.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. Total na BD: 2.650 perguntas. **0 duplicados exatos removidos**. 26 grupos de duplicados aproximados (texto+categoria) — esmagadoramente Bandeiras (falsos positivos, não removidos).
- **MELHORIA — Deteção fuzzy de duplicados (audit dedupe)**: `scripts/weekly-dedupe.mjs` agora também faz deteção fuzzy (similaridade de Levenshtein ≥ 0.9) **dentro da mesma categoria**, **excluindo BANDEIRAS** (cujas perguntas são semelhantes por desenho → fonte dos falsos positivos). Gera `scripts/dedupe-report.json` (machine-readable) com data, total, exatos removidos, grupos aproximados e pares fuzzy para revisão manual. Resultado: 284 pares fuzzy / 343 perguntas afetadas fora de Bandeiras (candidatos a revisão, não removidos automaticamente).
- **LINT/BUILD/TESTS**: alterações restritas a scripts + backup; sem impacto no app. `node --check` OK; testes (`npm test`) 15/15 passam.

## [2026-08-20] TAREFA DIÁRIA — Novas perguntas + TAREFA SEMANAL — Duplicados + Reposição de Pool Curado

- **TAREFA DIÁRIA — Novas perguntas**: `npm run daily` → **+21 novas** (pool curado de 30; 9 duplicados ignorados por dedupe). Pool: 30 → 0. Banco: 2.579 → 2.600 (backup sincronizado) / ~2.624 (BD).
  - `questions_backup.json` atualizado automaticamente pelo script (2.579 → 2.600).
- **MELHORIA — Reposição do pool curado**: como o pool esgotou (30 → 0), reposto com **30 novas perguntas** (2 por categoria × 15 categorias). Perguntas originais, não-óbvias e variadas (tópicos menos comuns). Próximo ciclo terá +21 novas até esgotar.
- **TAREFA SEMANAL — Duplicados**: `scripts/weekly-dedupe.mjs`. Total na BD: 2.624 perguntas. **0 duplicados exatos removidos**. 26 grupos de duplicados aproximados detetados — esmagadoramente Bandeiras (texto genérico + opções/imagens diferentes = falsos positivos, não removidos).
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
