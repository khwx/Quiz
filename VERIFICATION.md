TAREFA: Ciclo de manutenção 8h — +2 novas perguntas diárias via built-in (MATEMATICA) e dedupe semanal; atualizar questions_backup.json (3969 → 3971), scripts/dedupe-report.json e PROGRESS.md

TESTES: npm test → 15/15 passaram; npm run lint → 0 erros (113 warnings pré-existentes); npm run typecheck → limpo

COMMIT: dd194f1 maintenance: daily questions + weekly dedupe - 2026-11-08 (5th cycle) (3 ficheiros: questions_backup.json, scripts/dedupe-report.json, PROGRESS.md)

PUSH: OK (confirmado: git log origin/main --oneline -1 → dd194f1; trabalho sujo anterior também fechado em f413df9)

PRÓXIMO: Continuar próximo ciclo de manutenção (8h): npm run daily + npm run dedupe + verificação, ou implementar pequena melhoria do backlog em TAREFAS.md
