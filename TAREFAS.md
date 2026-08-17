# Quizverse - Lista de Tarefas

## ✅ JÁ FEITO (Última Atualização)

### Login e Autenticação
- [x] Página login com Supabase Auth real
- [x] Sistema de registo de contas
- [x] Perfil ligado à conta do utilizador
- [x] Botão Login/Perfil na homepage
- [x] **Fixed**: Ícones sobrepostos nos inputs do login

### Perfil e Estatísticas
- [x] Perfil mostra dados do utilizador (email, nome)
- [x] Estatísticas reais: Total de jogos, Vitórias, Pontos, Taxa de acerto
- [x] Achievements básicos (desbloqueiam conforme joga)
- [x] Logout funcional

### Reportar Perguntas
- [x] Botão "Reportar" no Play (telemóvel)
- [x] Botão "Reportar" na TV
- [x] Botão "Reportar" no Admin
- [x] Lista de perguntas reportadas no Admin
- [x] Guarda relato no metadata da pergunta

### UI/UX Melhorias
- [x] **Fixed**: Ícones material-symbols substituídos por Lucide
- [x] Inputs com padding correto para não sobrepor texto
- [x] Ícones com `pointer-events-none` para não bloquear input

---

## 🎯 FASE 1: Login + Perfil COMPLETA ✅

Tudo implementado e funcional!

---

## 🎯 FASE 2: Jogar com Amigos (EM CURSO)

### Sistema de Equipas 🟢 (COMPLETO)
- [x] Criar equipas de 2-4 jogadores
- [x] Cada equipa responde em conjunto
- [x] Pontuação coletiva por equipa (`teams.total_score` atualizada em tempo real)
- [x] Ecrã de ranking por equipas (`/teams/ranking`)

### Código Único por Jogador 🟢 (COMPLETO)
- [x] Cada jogador recebe código/link único para convites (`profiles.invite_code`, gerado no registo)
- [x] Página de convite `/invite/[code]` com QR Code, link copiável e botão "Adicionar como amigo"
- [x] Código visível no Perfil com botão "Copiar link"
- [x] Tracking individual de pontuações (`game_history` + estatísticas no perfil)
- [x] Histórico pessoal (tab "Histórico" no perfil)

---

## 🎯 FASE 3: Campeonatos (EM CURSO)

### Torneios 🟢 (COMPLETO)
- [x] Criar torneios com PIN único (6 carateres)
- [x] Registo de equipas no torneio (lobby + capacidade)
- [x] Fases: LOBBY → QUALIFYING → FINAL → FINISHED
- [x] Classificações em tempo real (realtime via Supabase)
- [x] Ecrã de detalhe `/tournaments/[id]` com pódio e definições
- [x] Modo Cego (anfitrião não vê respostas) e definições de timer/perguntas
- [ ] Prémios/loot para o top 3 (PENDENTE)
- [ ] Torneios públicos vs privados (PENDENTE)

---

## 📋 ORDEM DE TRABALHO

1️⃣ **COMPLETO ✅**: Login + Perfil com estatísticas
2️⃣ **COMPLETO ✅**: Sistema de equipas (Equipas, respostas em conjunto, pontuação coletiva e ranking)
3️⃣ **COMPLETO ✅**: Código único por jogador (código/link de convite + convites por código)
4️⃣ **COMPLETO ✅**: Torneios (criação, registo de equipas, fases, classificações, ecrã de detalhe)
5️⃣ **COMPLETO ✅**: Login Social (Google + Facebook OAuth em `/login` — `handleOAuthLogin` parametrizado, build OK)
6️⃣ **PRÓXIMO**: Melhorias de histórico no perfil ou prêmios/loot para top 3 em Torneios

---

## 🐛 Bugs Corrigidos
- [x] Ícones sobrepostos nos inputs do login
- [x] Botão "Ver Todas" nas categorias
- [x] Autenticação no Supabase
- [x] **Categorias com casing errado**: `História` devolvia 0 perguntas e `Bandeiras` só 12 — alinhado o app a `BANDEIRAS`/`HISTÓRIA` (ver migração 012)
- [x] **Typo de categoria `GEGRAFIA`**: 1 pergunta orfã com categoria `GEGRAFIA` (falta de 'O') normalizada para `GEOGRAFIA` (ver migração 013)

---

## 🛠️ Tech Stack
- Next.js 16 (App Router)
- Tailwind CSS v4
- Supabase (DB + Auth)
- Framer Motion (animações)
- Vercel (hosting)

---

*Última atualização: 17 Agosto 2026* 🎉

**O que achas de implementar agora?**

1. **Sistema de Equipas** (jogar em equipa)
2. **Código único por jogador** (convites personalizados)
3. **Login social** (Google/Facebook)
4. **Melhorar histórico de jogos** no perfil