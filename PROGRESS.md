# 📈 Progress Log - QuizVerse

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
