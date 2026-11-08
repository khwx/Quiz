TAREFA: Adicionar 2 novas perguntas diárias via built-in (MATEMATICA) e executar dedupe semanal; atualizar questions_backup.json e deduplication report

TESTES: npm run lint → 0 erros (113 warnings pré-existentes); npm run typecheck → limpo; npm test → 15/15 passaram

COMMIT: daca14e maintenance: daily questions + weekly dedupe - 2026-11-08 (2 ficheiros: questions_backup.json, scripts/dedupe-report.json)

PUSH: OK (confirmado: git log origin/main --oneline -1 → daca14e, push para main successful)

PRÓXIMO: Continuar próximo ciclo de manutenção (8h): executar npm run daily e npm run dedupe, ou implementar pequena tarefa do backlog TAREFAS.md