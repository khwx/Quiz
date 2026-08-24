# Quizverse - Lista de Tarefas e Melhorias

## ✅ JÁ IMPLEMENTADO E FUNCIONAL

### 🎮 Jogabilidade e Experiência Principal
- [x] **Multiplayer em Tempo Real (Mobile + TV)** via Supabase Realtime
- [x] **Modo Solo Offline/Online (`/play?solo=1`)** com 10 perguntas, power-ups e pontuação local
- [x] **Power-ups 50:50, Saltar (Skip) e Congelar Tempo (Freeze)** no telemóvel e solo
- [x] **Vibração Háptica Real** (`navigator.vibrate`) em cliques e respostas
- [x] **Eliminação Flexível:** Removido o bloqueio restritivo de 3 vidas para todos poderem jogar até ao fim
- [x] **Validação Exata no Reveal:** Resposta certa sincronizada 100% com a pergunta ativa (`questions.correct_option`)
- [x] **Fallback Resiliente de Perguntas:** Eliminação de erros 400 na carga de perguntas

### 🔐 Login e Autenticação
- [x] Página de login/registo com Supabase Auth real
- [x] Login Social com Google e Facebook OAuth
- [x] Criação automática de perfil de jogador (`profiles`) com avatar, nível e XP inicial
- [x] Botão de acesso Login/Perfil na barra superior da homepage

### 🏆 Perfil, Estatísticas e Conquistas
- [x] Perfil com dados em tempo real (email, nome, avatar, nível e XP)
- [x] Estatísticas reais agrupadas por partidas (`/history` e `/stats`)
- [x] Tabela oficial `achievements` no Supabase (migração `011`)
- [x] Catálogo partilhado de conquistas (`src/lib/achievements.ts`) ligado à página `/achievements`

### 👥 Equipas e Amigos
- [x] Criar e gerir equipas de 2-4 jogadores com código PIN
- [x] Pontuação coletiva em tempo real (`teams.total_score`)
- [x] Ranking de equipas (`/teams/ranking`)
- [x] Código único de convite e link partilhável por jogador (`/invite/[code]`)
- [x] Sistema de amizades (`/friends`)

### 🚩 Reportar Perguntas
- [x] Botão "Reportar" no telemóvel (`/play`), na TV (`/tv`) e no Admin
- [x] Registo automático de denúncias no `metadata.reports` da pergunta
- [x] Gestão de perguntas denunciadas no painel Admin (`/admin`)

---

## 🎯 TAREFAS PRIORITÁRIAS A IMPLEMENTAR (BACKLOG ATIVO)

### 🇵🇹 1. Geografia e Freguesias de Portugal
- [ ] Criar lote de ~50+ perguntas dedicadas a **Freguesias, Concelhos e Monumentos de Portugal**
- [ ] Adicionar categoria oficial **"Portugal & Freguesias"** em `CATEGORIES`
- [ ] Validar distribuição equilibrada de opções corretas (A, B, C, D)

### 🎨 2. Legendas e Apresentação Visual das Páginas
- [ ] **Página de Modos (`/modes`):** Adicionar legendas com duração estimada, formato (individual vs equipa) e nível de dinamismo
- [ ] **Página de Categorias (`/categories`):** Legendas explicativas com exemplos do tipo de perguntas e tags de dificuldade
- [ ] **Ecrã de Apresentador (`/tv`):** Legendas de estado (*"Aguardando respostas"*, *"Tempo a esgotar"*, *"Revelação de pontos"*)
- [ ] **Ecrã de Jogador (`/play`):** Legendas informativas sobre bónus de velocidade e multiplicadores de sequência

### 🎛️ 3. Controlos do Host / Apresentador na TV (`/tv`)
- [ ] Botão de **Pausa** (congelar timer da TV e telemóveis)
- [ ] Botão de **Voltar Atrás** (rever pergunta anterior)
- [ ] Botão de **Saltar Pergunta** (avançar sem atribuir pontos)

### ⚡ 4. Novos Power-ups & Modos
- [ ] Power-up **"Votação do Público" (Public Poll)**: Mostra percentagem de respostas da sala
- [ ] Modo **Treino por Categoria no Solo** (escolher categoria específica para praticar)
- [ ] Modo **Duelo 1v1 Rápido**

---

## 🐛 BUGS RECENTEMENTE CORRIGIDOS
- [x] **Erro 400 ao Carregar Pergunta:** Removida a coluna inexistente `explanation` das queries REST e implementada leitura via `metadata`.
- [x] **"Demasiado Lento" na 1ª Pergunta:** Removido reset prematuro de `selectedOption` na transição de estados e adicionado fallback de ID no `handleAnswer`.
- [x] **Desfasamento da Resposta Certa no Reveal:** `api/answer` e `RevealView` passam a ler `correct_option` diretamente da pergunta ativa na BD em vez do estado global do jogo.
- [x] **Bloqueio de 3 Vidas ("Fui Eliminado"):** Removido o overlay obstrutivo para permitir jogo contínuo.

---

## 🛠️ Stack Tecnológica
- **Framework:** Next.js 16 (App Router + Turbopack) & React 19
- **Estilos:** Tailwind CSS v4 & Framer Motion
- **Base de Dados & Realtime:** Supabase (PostgreSQL + Realtime Channels + Auth)
- **Testes:** Vitest
- **Deploy:** Vercel (CI/CD automático via GitHub `main`)

---
*Última atualização: Agosto 2026* 🚀