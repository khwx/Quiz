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
