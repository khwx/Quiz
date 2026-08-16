# 📈 Progress Log - QuizVerse

## [2026-08-16] Sistema de Equipas Implementado
- Criado ecrã de ranking por equipas (`/teams/ranking`) com pódio, contagem de membros, pins e pontuações coletivas.
- Atualizado `/api/answer/route.ts` para somar pontos coletivos à tabela `teams.total_score` sempre que um membro da equipa responde corretamente.
- Adicionado acesso rápido ao ranking de equipas na página de equipas (`/teams`).
- Atualizado `TAREFAS.md` marcando o Sistema de Equipas como completo.
- Testes e build executados com sucesso (`npm test` e `npm run build`).
