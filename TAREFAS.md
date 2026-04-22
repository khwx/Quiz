# Quizverse - Lista Completa de Tarefas e Melhorias

## 🎯 Funcionalidades Principais (A Implementar)

### 1. Sistema de Equipas (Team-Based Games) - 💎 ALTA PRIORIDADE
- [ ] Permitir criar equipas de 2-4 jogadores no lobby
- [ ] Cada equipa responde em conjunto (consulta entre membros)
- [ ] Pontuação coletiva por equipa
- [ ] Ecrã de ranking por equipas
- [ ] Criar jogo "equipa vs equipa"

### 2. Código Único por Jogador (Multiplayer) - 💎 ALTA PRIORIDADE
- [ ] Cada jogador recebe código único de referência
- [ ] Tracking individual de pontuações
- [ ] Histórico pessoal de jogos
- [ ] Estatísticas pessoais (taxa de acerto, média de pontos)
- [ ] Perfil de jogador com achievements

### 3. Sistema de Campeonatos/Torneios - 📋 MÉDIA PRIORIDADE
- [ ] Criar torneios com múltiplas rondas
- [ ] Phase de qualificação + fase final
- [ ] Classificações automática em tempo real
- [ ] Prémios para top 3 (medalhas)
- [ ] Histórico de torneios passados
- [ ] Torneios públicos vs privados

---

## 🎨 Melhorias de UI/UX

### 4. Categorias - ✅ FEITO (parcial)
- [x] Página de categorias (/categories)
- [x] Botão "Ver Todas" funcional
- [ ] Filtros por idade/dificuldade
- [ ] Barra de pesquisa de categorias
- [ ] Categorias populares em destaque

### 5. Tema Escuro/Light - 📋 BAIXA PRIORIDADE
- [ ] Toggle para mudar tema
- [ ] Guardar preferência no localStorage

### 6. Animações - 📋 BAIXA PRIORIDADE
- [ ] Mais micro-interações
- [ ] Efeitos visuais nas perguntas
- [ ] Transições entre perguntas

---

## 🔌 Modo Offline

### 7. Suporte Offline - 📋 MÉDIA PRIORIDADE
- [ ] Jogar sem internet (perguntas em cache)
- [ ] Guardar respostas localmente
- [ ] Sincronizar quando conectar
- [ ] Indicador de modo offline

---

## 🐛 Bugs e Correções

### 8. Auto-Skip - ✅ FEITO
- [x] Melhorar detecção quando todos respondem
- [ ] Log mais claro para debug

### 9. Admin - ✅ FEITO (parcial)
- [x] Proteção com password
- [ ] Estatísticas completas
- [ ] Gráficos de progresso
- [ ] Exportar perguntas (CSV/JSON)

### 10. Áudio - ✅ FEITO
- [x] Som automático no primeiro clique
- [ ] Mais sons (aplausos,效果)
- [ ] Volume ajustável

---

## 📱 Novas Páginas

### 11. Perfil do Jogador - 📋 MÉDIA PRIORIDADE
- [ ] Ver estatísticas pessoais
- [ ] Histórico de jogos
- [ ] Achievements conquistados
- [ ] editar nome/avatar

### 12. Leaderboard Global - 📋 BAIXA PRIORIDADE
- [ ] Top 100 jogadores
- [ ] Por categoria
- [ ] Por região (futuro)

### 13. Tutorial Interativo - 📋 BAIXA PRIORIDADE
- [ ] Explicar como jogar com imagens
- [ ] Passo a passo

---

## 🗄️ Base de Dados

### 14. Melhorias na DB
- [ ] Adicionar tabela de equipas (teams)
- [ ] Adicionar tabela de torneios (tournaments)
- [ ] Adicionar tabela de histórico (game_history)
- [ ] Adicionar achievements

---

## 📋 Ordem de Implementação Sugerida

1. **Fase 1** (Agora):
   - código único por jogador
   - Estatísticas no perfil

2. **Fase 2** (Próximo):
   - Sistema de equipas
   - Rankings

3. **Fase 3** (Futuro):
   - Campeonatos
   - Modo offline

---

## 🛠️ Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- Supabase (DB + Auth)
- Framer Motion (animações)
- Vercel (hosting)

---

*Lista actualizada em Abril 2026*