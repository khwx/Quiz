# Auditoria Completa do QuizVerse — Lista de Melhorias

> **Referência**: Dr.Why (o melhor quiz de Portugal)
> **Data**: Julho 2026
> **Status**: Projeto em desenvolvimento ativo (v3.0)

---

## SUMÁRIO EXECUTIVO

O QuizVerse é um projeto sólido com arquitetura moderna (Next.js 16, React 19, Supabase, IA dual Gemini+Groq). Tem funcionalidades impressionantes como geração de perguntas com IA, modo local, equipas, torneios, TTS, efeitos sonoros, deteção de duplicados e memória de perguntas.

No entanto, existem **bugs críticos**, **falhas de segurança**, **inconsistências de gameplay** e **muitas funcionalidades do Dr.Why que ainda não foram implementadas**.

---

## 1. BUGS CRÍTICOS (Corrigir Imediatamente)

### 1.1 Coluna `points` em falta na tabela `answers`
- **Problema**: O schema SQL da BD não tem a coluna `points` na tabela `answers`, mas a API `/api/answer/route.ts` INSERE `points` e PERGUNTA `player.score`
- **Impacto**: As respostas são inseridas mas os pontos não são guardados na BD. O score do jogador pode não ser atualizado corretamente.
- **Fix**: Adicionar `points INTEGER DEFAULT 0` à tabela `answers` no schema SQL. Executar migration no Supabase.

### 1.2 Coluna `user_id` em falta na tabela `players`
- **Problema**: O schema não tem `user_id` na tabela `players`, mas o código usa `player.user_id` para ligar jogadores a contas autenticadas.
- **Impacto**: Jogadores que entram com login não ficam ligados à sua conta. Perfil e estatísticas ficam incompletos.
- **Fix**: Adicionar `user_id UUID REFERENCES auth.users(id)` à tabela `players`.

### 1.3 RLS Policies demasiado permissivas
- **Problema**: Todas as tabelas têm políticas `USING (true)` — qualquer pessoa pode ler/escrever/apagar tudo.
- **Impacto**: Qualquer utilizador pode apagar todos os jogos, perguntas e respostas. Segurança crítica.
- **Fix**: Implementar RLS policies baseadas em `auth.uid()`. Apenas admins podem modificar perguntas. Jogadores só podem criar/ler os seus próprios dados.

### 1.4 Bug de pontuação inconsistente (Local vs Online)
- **Problema**: No modo local (`handleLocalAnswer`): `Math.max(10, Math.floor((timeLeft / timerDuration) * 100))` → max 100 pts
  Na API online: `Math.round(600 + (400 * timeRatio))` → 600-1000 pts
- **Impacto**: Pontuação completamente diferente entre modos. Injusto para jogadores.
- **Fix**: Usar a mesma fórmula em ambos os modos: `Math.round(600 + (400 * timeRatio))`.

### 1.5 Bug de pontuação no modo local
- **Problema**: `handleLocalAnswer` usa `timeLeft` no cálculo, mas `timeLeft` é um state que pode estar dessincronizado. Devia usar o timestamp de início (`startTime`) como na API.
- **Impacto**: Pontos podem ser calculados incorretamente no modo local.
- **Fix**: Calcular `timeTaken = Date.now() - startTime` e usar a mesma fórmula da API.

### 1.6 `timeUntilNext` reinicia inadequadamente
- **Problema**: Em `useQuestionFlowTimer`, sempre que o status muda para `QUESTION`, `timeUntilNext` é posto a 20. Mas também é posto a 20 quando status deixa de ser `REVEAL`.
- **Impacto**: O timer de "próxima pergunta" pode não funcionar corretamente.
- **Fix**: Separar os timers — o `timeUntilNext` deve ser gerido apenas no estado REVEAL.

### 1.7 Perda de respostas em transições rápidas
- **Problema**: Quando o auto-skip avança para REVEAL, as respostas que chegam no mesmo instante podem ser perdidas porque `setCurrentAnswers([])` é chamado em `STARTING`.
- **Impacto**: Jogadores que respondem exatamente no momento da transição perdem a resposta.
- **Fix**: Adicionar um buffer de 500ms antes de limpar respostas, ou verificar se todas as respostas foram processadas.

### 1.8 `useQuestionSync` nunca é usado
- **Problema**: O hook `useQuestionSync` existe mas não é importado ou usado em nenhum componente.
- **Impacto**: Código morto que pode causar confusão. A lógica de sync está replicada no `play/page.tsx`.
- **Fix**: Remover o hook não usado, ou integrá-lo no `play/page.tsx` para eliminar duplicação.

### 1.9 Profile Edit — botão "Guardar" não faz nada
- **Problema**: O botão "Guardar" no `profile/edit/page.tsx` não tem `onClick` nem lógica de guardar.
- **Impacto**: O utilizador não consegue guardar alterações no perfil.
- **Fix**: Adicionar lógica de update no Supabase (`profiles.update`) e feedback visual.

### 1.10 Team scoring soma todos os jogadores
- **Problema**: Em `tv/page.tsx`, o cálculo de pontuação da equipa soma `players` sem filtrar por membros da equipa (`return true`).
- **Impacto**: Se houver jogadores de outras equipas, a pontuação está errada.
- **Fix**: Filtrar `players` pelos membros da `teamId` atual.

### 1.11 Race condition no submit de resposta
- **Problema**: O `play/page.tsx` e `useAnswerHandler` chamam `setHasAnswered(true)` antes do fetch completar. Se o fetch falhar, revertem. Mas se o jogador clicar duas vezes rápido, o segundo clique é bloqueado após o primeiro `setHasAnswered(true)`.
- **Impacto**: Se a primeira resposta falhar (erro de rede), o jogador fica bloqueado.
- **Fix**: Usar um `submittingRef` em vez de `hasAnswered` para controlar o estado de envio, mantendo `hasAnswered` apenas para o estado visual.

---

## 2. SEGURANÇA

### 2.1 RLS Policies — CRÍTICO (ver 1.3)

### 2.2 API Keys expostas no cliente
- **Problema**: `@google/generative-ai` e `groq-sdk` são usados mas as chaves são server-side. No entanto, o código do cliente pode tentar aceder a endpoints se houver um misconfigure.
- **Fix**: Garantir que NUNCA há `NEXT_PUBLIC_GEMINI_API_KEY` ou `NEXT_PUBLIC_GROQ_API_KEY` no código. Adicionar validação no build.

### 2.3 Sem validação de PIN no cliente
- **Problema**: O PIN é gerado com `Math.random()` — não é criptograficamente seguro. Qualquer pessoa pode adivinhar PINs.
- **Fix**: Usar `crypto.getRandomValues()` para gerar PINs mais seguros. Ou usar UUIDs como identificadores de jogo em vez de PINs de 6 dígitos.

### 2.4 Sem autenticação para criar jogos
- **Problema**: Qualquer pessoa pode criar jogos sem autenticação. Isto pode ser usado para spam.
- **Fix**: Adicionar rate limiting por IP + opção de exigir login para criar jogos.

### 2.5 Input validation client-side insuficiente
- **Problema**: Apenas a API valida inputs. O cliente pode enviar dados malformados.
- **Fix**: Adicionar validação client-side antes de enviar (ex: `chosenOption` entre 0-3).

### 2.6 Sem CSP headers
- **Problema**: Não há Content-Security-Policy configurado.
- **Fix**: Adicionar CSP headers no `next.config.ts`.

### 2.7 Sem CORS configuração explícita
- **Problema**: As APIs aceitam pedidos de qualquer origem (padrão do Next.js).
- **Fix**: Configurar CORS explicitamente nas API routes se necessário.

---

## 3. JOGABILIDADE

### 3.1 Sem "vidas" ou "continues"
- **Dr.Why tem**: 3 vidas por jogo — se erras 3 perguntas, estás eliminado.
- **QuizVerse**: Podes errar todas as perguntas e continuar a jogar.
- **Fix**: Adicionar sistema de vidas. Mostrar corações no telemóvel e na TV. Se `lives === 0`, mostrar tela de eliminação.

### 3.2 Sem "50:50" ou outras dicas
- **Dr.Why tem**: Dicas como "50:50" (elimina 2 respostas erradas), "skip", "public".
- **QuizVerse**: Apenas tem dica textual (hint) e revelação de bandeira.
- **Fix**: Adicionar power-ups:
  - **50:50**: Elimina 2 opções erradas
  - **Skip**: Salta a pergunta sem penalização
  - **Public**: Mostra a percentagem de votos de outros jogadores (simulado ou real)
  - **Time Freeze**: Congela o cronómetro por 5 segundos

### 3.3 Sem modo "buzzer" / round-robin
- **Dr.Why tem**: Modo onde apenas um jogador responde de cada vez (buzzer).
- **QuizVerse**: Todos respondem simultaneamente.
- **Fix**: Adicionar modo de jogo "Buzzer" onde apenas o jogador mais rápido pode responder.

### 3.4 Sem penalização por resposta errada
- **Dr.Why tem**: Se errares, perdes pontos (ou não ganhas).
- **QuizVerse**: Se errares, ganhas 0 pontos (não perdes os que tinhas).
- **Fix**: Considerar adicionar penalização leve (ex: -100 pts por erro) para aumentar a tensão. OU manter o sistema atual mas adicionar "vidas".

### 3.5 Sem sistema de streaks/multipliers avançado
- **Problema**: Existe `streak` no código mas não é mostrado na TV, não dá bonuses, e reseta em REVEAL.
- **Fix**: Mostrar streak na TV e no telemóvel. Dar bonus de pontos por streak (ex: 2x em 3+ streak, 3x em 5+ streak).

### 3.6 Sem "hotseat" / pass-and-play
- **Dr.Why tem**: Modo onde passas o telemóvel entre jogadores no mesmo dispositivo.
- **QuizVerse**: Apenas modo local (todos respondem ao mesmo tempo) ou multiplayer online.
- **Fix**: Adicionar modo "Passa e Joga" onde cada jogador responde uma pergunta de cada vez no mesmo telemóvel.

### 3.7 Sem skip manual de pergunta pelo host
- **Problema**: O host pode saltar o timer (Espaço) mas não pode saltar a pergunta diretamente.
- **Fix**: Adicionar botão "Saltar Pergunta" nos controles do TV. Penalizar com 0 pontos.

### 3.8 Sem opção de "pedir empate"
- **Dr.Why tem**: No final, os jogadores podem pedir empate.
- **Fix**: Adicionar botão "Pedir Empate" no pódio.

### 3.9 Sem replay de jogada
- **Problema**: Depois do jogo acabar, não podes ver as perguntas e respostas novamente.
- **Fix**: Adicionar página de replay que mostra cada pergunta, quem acertou/errou, e o tempo de resposta.

### 3.10 Sem prática individual
- **Problema**: Não há modo "praticar" onde jogas sozinho sem PIN/TV.
- **Fix**: Adicionar modo "Praticar" no homepage que inicia um jogo solo instantâneo.

### 3.11 Sem leaderboard por categoria
- **Problema**: A leaderboard global mostra pontuação total, não por categoria.
- **Fix**: Adicionar filtros por categoria na leaderboard.

### 3.12 Sem sistema de níveis/XP
- **Problema**: Não há progressão de nível. Apenas achievements estáticos.
- **Fix**: Adicionar XP por resposta correta. Subir de nível a cada X XP. Mostrar nível no perfil.

---

## 4. PERGUNTAS E CONTEÚDO

### 4.1 Sem gestão de imagens nas perguntas
- **Problema**: As imagens de bandeiras são SVG locais. Não há upload de imagens para outras categorias.
- **Fix**: Adicionar upload de imagens no admin. Suportar imagens em perguntas de ciência, história, etc.

### 4.2 Sem níveis de dificuldade por pergunta
- **Problema**: Apenas há `age_rating` (idade). Não há dificuldade (fácil/médio/difícil).
- **Fix**: Adicionar campo `difficulty` (1-3) às perguntas. Permitir filtrar por dificuldade no jogo.

### 4.3 Sem categorias dinâmicas/expansíveis
- **Problema**: As 15 categorias são fixas no código.
- **Fix**: Permitir criar/gerir categorias no admin.

### 4.4 Sem "explicação" após resposta
- **Dr.Why tem**: Mostra uma explicação curta após cada pergunta.
- **QuizVerse**: Apenas mostra a resposta correta.
- **Fix**: Adicionar campo `explanation` às perguntas. Mostrar na fase REVEAL.

### 4.5 Sem validação de qualidade de perguntas geradas por IA
- **Problema**: A IA pode gerar perguntas com erros factuais, opções duplicadas, ou respostas ambíguas.
- **Fix**: Adicionar validação pós-geração:
  - Verificar que as 4 opções são diferentes
  - Verificar que a resposta correta existe nas opções
  - Verificar que a pergunta tem sentido
  - Permitir reportar e editar perguntas geradas por IA

### 4.6 Sem importação em massa de perguntas
- **Problema**: Apenas é possível criar perguntas uma a uma no admin.
- **Fix**: Adicionar importação via CSV/JSON no admin.

### 4.7 Sem versionamento de perguntas
- **Problema**: Quando uma pergunta é editada, não há histórico.
- **Fix**: Adicionar tabela `question_edits` com histórico de alterações.

### 4.8 Sem "favoritos" ou bookmark de perguntas
- **Fix**: Permitir marcar perguntas como favoritas no admin para usar em jogos especiais.

### 4.9 Sem perguntas de "imagem + texto" (mistas)
- **Problema**: Apenas há perguntas de texto OU de bandeira (imagem).
- **Fix**: Suportar perguntas com imagem + texto em qualquer categoria.

### 4.10 Sem tradução/multilíngue
- **Problema**: Apenas português de Portugal.
- **Fix**: Adicionar suporte multilíngue (PT, EN, ES) com campos `text_en`, `text_es`, etc.

---

## 5. UI/UX

### 5.1 Sem loading states consistentes
- **Problema**: Algumas páginas usam `Loader2`, outras usam spinners customizados, outras não têm loading.
- **Fix**: Criar componente `LoadingScreen` reutilizável.

### 5.2 Sem error boundary
- **Problema**: Se um componente crashar, a página inteira fica em branco.
- **Fix**: Adicionar `error.tsx` em cada página com fallback UI.

### 5.3 Sem not-found page customizada por rota
- **Problema**: Apenas existe `not-found.tsx` genérico.
- **Fix**: Manter como está, mas adicionar sugestões de navegação.

### 5.4 Transições entre estados muito rápidas
- **Problema**: A transição de REVEAL para QUESTION pode ser demasiado rápida. O host pode não ver a resposta correta.
- **Fix**: Adicionar delay mínimo de 3s na fase REVEAL antes de permitir avançar.

### 5.5 Sem indicador de "jogador a responder"
- **Problema**: Na TV, vês apenas os avatares dos jogadores que já responderam. Não vês quem está a responder em tempo real.
- **Fix**: Adicionar animação de "pensamento" nos avatares de jogadores que ainda não responderam.

### 5.6 Sem "confetti" na TV quando alguém acerta
- **Problema**: O confetti apenas aparece no pódio final.
- **Fix**: Adicionar confetti mini quando um jogador acerta uma resposta difícil (streak alto).

### 5.7 Sem zoom/sons na resposta correta
- **Problema**: A opção correta apenas fica verde. Não há efeito visual forte.
- **Fix**: Adicionar animação de "explosão" na opção correta. Som de "ding" mais satisfatório.

### 5.8 Sem toggle de TTS visível
- **Problema**: O botão TTS existe mas não tem indicação clara se está ativado ou não.
- **Fix**: Mostrar estado do TTS (ativado/desativado) com cor diferente.

### 5.9 Sem opção de tamanho de texto
- **Problema**: Em TVs grandes ou pequenas, o texto pode ser muito pequeno ou muito grande.
- **Fix**: Adicionar controlo de tamanho de texto nas definições.

### 5.10 Sem suporte a fullscreen
- **Problema**: O modo TV não força fullscreen automaticamente.
- **Fix**: Adicionar botão de fullscreen e tentar entrar em fullscreen automaticamente no modo TV.

### 5.11 Sem modo "ecrã dividido" para dois jogadores no mesmo dispositivo
- **Problema**: No modo local, ambos os jogadores veem o mesmo ecrã.
- **Fix**: Adicionar modo "ecrã dividido" para 2 jogadores no mesmo dispositivo (cada um vê metade).

### 5.12 Sem skip de onboarding
- **Problema**: O onboarding aparece sempre.
- **Fix**: Adicionar botão "Saltar" no onboarding. Guardar preferência no localStorage.

### 5.13 Sem "dark mode" explícito
- **Problema**: O tema é sempre escuro (cosmos). Não há opção de tema claro.
- **Fix**: Adicionar toggle de tema claro/escuro.

### 5.14 Sem animação de entrada de jogadores na TV
- **Problema**: Os jogadores aparecem de forma simples na lobby da TV.
- **Fix**: Adicionar animação de "teleporte" ou "chegada" quando um jogador entra.

---

## 6. PERFORMANCE E SINCRONIZAÇÃO

### 6.1 Polling desnecessário + Realtime
- **Problema**: `useAnswerSubscription` usa tanto Supabase Realtime como polling a cada 1.5s. Isto duplica as consultas à BD.
- **Impacto**: Custo de BD desnecessário. Latência potencial.
- **Fix**: Remover o polling. Confiar apenas no Realtime (que já tem fallback via polling no servidor).

### 6.2 Re-fetch de jogadores em cada pergunta
- **Problema**: Em `tv/page.tsx`, `syncPlayers` é chamado duas vezes (imediato + timeout 1.5s) em cada transição de pergunta.
- **Fix**: Confiar no Realtime para atualizar a lista de jogadores. Remover o re-fetch manual.

### 6.3 Sem otimização de re-renders
- **Problema**: Muitos componentes re-renderizam desnecessariamente (ex: `QuestionDisplay` recebe `answers` completo e filtra internamente).
- **Fix**: Usar `useMemo` para filtrar respostas. Usar `React.memo` em componentes pesados.

### 6.4 Sem virtualização de listas
- **Problema**: O admin mostra até 50 perguntas por página, mas se houver 1000+, a paginação é necessária.
- **Fix**: Implementar virtualização (ex: `@tanstack/react-virtual`) para listas grandes.

### 6.5 Sem cache de perguntas na BD
- **Problema**: As perguntas geradas por IA são guardadas na BD, mas não há cache de queries frequentes.
- **Fix**: Adicionar cache Redis ou usar Supabase cache para contagens de categorias.

### 6.6 Sem lazy loading de imagens
- **Problema**: As bandeiras SVG são carregadas todas de uma vez.
- **Fix**: Usar `loading="lazy"` nas imagens. Ou carregar apenas a bandeira da resposta correta.

### 6.7 Bundle size
- **Problema**: Framer Motion é muito pesado (~300KB). Está em quase todos os componentes.
- **Fix**: Considerar usar `motion` apenas onde necessário. Ou substituir por animações CSS nativas para animações simples.

---

## 7. FUNCIONALIDADES FALTANTES (vs Dr.Why)

### 7.1 Modo "Solo" / Praticar
- **Dr.Why tem**: Modo onde jogas sozinho contra o relógio.
- **QuizVerse**: Apenas multiplayer ou local (2 jogadores).
- **Fix**: Adicionar botão "Praticar" no homepage. Inicia jogo solo instantâneo.

### 7.2 Modo "Espectador"
- **Dr.Why tem**: Alguém pode ver o jogo sem participar.
- **QuizVerse**: Não há espectadores.
- **Fix**: Adicionar modo espectador na TV (mostra perguntas e respostas sem participar).

### 7.3 "Power-ups" / Dicas especiais
- **Dr.Why tem**: 50:50, Skip, Public, Time Freeze.
- **QuizVerse**: Apenas hint textual.
- **Fix**: Ver secção 3.2.

### 7.4 Sistema de vidas
- **Dr.Why tem**: 3 vidas. Se perdes todas, estás eliminado.
- **QuizVerse**: Sem vidas.
- **Fix**: Ver secção 3.1.

### 7.5 Variação de perguntas — "duelo"
- **Dr.Why tem**: Modo duelo onde 2 jogadores competem diretamente.
- **QuizVerse**: Apenas todos- contra-todos.
- **Fix**: Adicionar modo "Duelo" (1v1).

### 7.6 Modo "Equipa vs Equipa"
- **Dr.Why tem**: Equipas de 4 que competem contra outras equipas.
- **QuizVerse**: Tem equipas mas o jogo é sempre todos-juntos.
- **Fix**: Adicionar modo de jogo onde equipas competem entre si (soma de pontos por equipa).

### 7.7 Perguntas de "completar"
- **Dr.Why tem**: Perguntas do tipo "Complete a frase".
- **QuizVerse**: Apenas múltipla escolha (A/B/C/D).
- **Fix**: Adicionar suporte para perguntas de resposta livre (texto) com validação fuzzy.

### 7.8 "MegaPergunta" / pergunta final
- **Dr.Why tem**: Última pergunta vale dobro dos pontos.
- **QuizVerse**: Todas as perguntas valem o mesmo (baseado no tempo).
- **Fix**: Adicionar opção "MegaPergunta" na última questão (2x pontos).

### 7.9 Classificação por tempo (além de pontos)
- **Dr.Why tem**: Mostra o tempo de resposta de cada jogador.
- **QuizVerse**: Mostra pontos mas não o tempo de resposta por jogador.
- **Fix**: Mostrar tempo de resposta de cada jogador na fase REVEAL.

### 7.10 Histórico de jogos com replay
- **Dr.Why tem**: Podes ver jogos anteriores com todas as perguntas e respostas.
- **QuizVerse**: Apenas mostra pontuação final.
- **Fix**: Adicionar página de replay com timeline de perguntas/respostas.

### 7.11 Convites por link/QR
- **Dr.Why tem**: Podes enviar um link de convite para amigos.
- **QuizVerse**: Apenas PIN de 6 dígitos.
- **Fix**: Adicionar geração de link de convite (`/play?pin=XXXXXX`) com partilha nativa (Web Share API).

### 7.12 Notificações push
- **Dr.Why tem**: Notifica quando um torneio começa.
- **QuizVerse**: Sem notificações push.
- **Fix**: Adicionar Web Push Notifications para torneios e lembretes.

### 7.13 Modo "treino" com categorias específicas
- **Dr.Why tem**: Podes treinar apenas uma categoria.
- **QuizVerse**: Não há modo de treino isolado.
- **Fix**: Adicionar modo "Treino" por categoria.

### 7.14 Perguntas "image reveal"
- **Dr.Why tem**: Perguntas onde a imagem é revelada progressivamente.
- **QuizVerse**: Imagens são mostradas de imediato.
- **Fix**: Adicionar suporte para "reveal progressivo" de imagens (ex: mostrar só uma parte e revelar mais com o tempo).

### 7.15 Modo "caça ao tesouro"
- **Fix**: Adicionar modo de jogo especial onde as perguntas guiam os jogadores por "pistas".

### 7.16 Perguntas de "ordenação"
- **Dr.Why tem**: Perguntas onde tens de ordenar itens.
- **QuizVerse**: Apenas múltipla escolha.
- **Fix**: Adicionar suporte para perguntas de ordenação (drag-and-drop).

### 7.17 Modo "blitz" / rapid fire
- **Dr.Why tem**: Modo com perguntas muito rápidas (5s cada).
- **QuizVerse**: Timer mínimo é 10s.
- **Fix**: Adicionar timer de 5s como opção. Modo "Blitz" com 10 perguntas de 5s cada.

### 7.18 Estatísticas de resposta por opção
- **Problema**: Na fase REVEAL, não mostra quantos jogadores escolheram cada opção.
- **Fix**: Mostrar barra de distribuição de respostas (A: 30%, B: 20%, etc.).

### 7.19 "Streak" global por jogador
- **Problema**: O streak é apenas local (na página play) e não persiste entre jogos.
- **Fix**: Guardar streak global no perfil do utilizador. Mostrar badge de streak.

### 7.20 Modo "ceguinho" (sem ver as respostas dos outros)
- **Problema**: Na fase REVEAL, todos veem as respostas de todos.
- **Fix**: Adicionar modo "cego" onde apenas o host vê as respostas (para torneios competitivos).

---

## 8. BASE DE DADOS

### 8.1 Schema incompleto (ver bugs 1.1 e 1.2)

### 8.2 Sem índices para queries frequentes
- **Problema**: Queries como `SELECT * FROM questions WHERE category = X AND age_rating >= Y` não têm índices.
- **Fix**: Adicionar índices em `questions(category)`, `questions(age_rating)`, `answers(game_id)`, `answers(player_id)`.

### 8.3 Sem índices composto para queries de jogo
- **Problema**: A query `SELECT * FROM answers WHERE game_id = X AND question_id = Y` é frequente mas não tem índice composto.
- **Fix**: Adicionar índice composto `(game_id, question_id)` na tabela `answers`.

### 8.4 Sem soft delete
- **Problema**: Quando uma pergunta é apagada, desaparece para sempre.
- **Fix**: Adicionar `deleted_at TIMESTAMP` e usar soft delete.

### 8.5 Sem auditoria
- **Problema**: Não há log de quem criou/alterou/apagou perguntas.
- **Fix**: Adicionar tabela `audit_log` ou usar `created_by`, `updated_by` nas tabelas.

### 8.6 Sem tabela de `game_settings` separada
- **Problema**: As configurações do jogo estão em JSONB dentro da tabela `games`. Difícil de consultar.
- **Fix**: Criar tabela `game_settings` com colunas separadas para timer, question_count, etc.

### 8.7 Sem tabela de `notifications`
- **Problema**: As notificações são mockadas.
- **Fix**: Criar tabela `notifications` com `user_id`, `type`, `message`, `read`, `created_at`.

### 8.8 Sem tabela de `achievements`
- **Problema**: As conquistas são hardcoded no componente.
- **Fix**: Criar tabela `achievements` e `user_achievements` para persistir conquistas desbloqueadas.

### 8.9 Sem tabela de `game_history`
- **Problema**: O histórico é construído a partir de `answers`, não há registo dedicado.
- **Fix**: Criar tabela `game_history` com `game_id`, `player_id`, `score`, `rank`, `duration`, `finished_at`.

### 8.10 Sem foreign keys em `tournaments.created_by`
- **Problema**: `created_by` na tabela `tournaments` é um UUID sem referência a `auth.users`.
- **Fix**: Adicionar `REFERENCES auth.users(id)`.

---

## 9. ACESSIBILIDADE

### 9.1 Sem ARIA labels
- **Problema**: Botões importantes não têm `aria-label`. Inputs não têm `aria-describedby`.
- **Fix**: Adicionar ARIA labels em todos os botões e inputs.

### 9.2 Sem suporte de teclado completo
- **Problema**: Apenas Espaço, R e Escape funcionam. Não há navegação por Tab.
- **Fix**: Garantir que todos os elementos interativos são focáveis e respondem a Enter.

### 9.3 Sem contraste suficiente
- **Problema**: Alguns textos cinza claro sobre fundo escuro podem ter contraste insuficiente (< 4.5:1).
- **Fix**: Verificar contraste com ferramenta. Aumentar opacidade de textos pequenos.

### 9.4 Sem suporte a leitores de ecrã
- **Problema**: Animações e mudanças de estado não são anunciadas.
- **Fix**: Adicionar `aria-live` regions para anúncios de pontuação, mudança de pergunta, etc.

### 9.5 Sem suporte a `prefers-reduced-motion`
- **Problema**: As animações do Framer Motion não respeitam a preferência do utilizador.
- **Fix**: Adicionar `prefers-reduced-motion` media query e desativar animações quando ativado.

---

## 10. MOBILE E RESPONSIVO

### 10.1 Sem PWA
- **Problema**: Não é instalável como app. Não funciona offline.
- **Fix**: Adicionar `manifest.json` e Service Worker. Cache de assets estáticos.

### 10.2 Sem offline support
- **Problema**: Se a internet cair durante o jogo, o telemóvel deixa de funcionar.
- **Fix**: Adicionar indicador de "offline" e permitir que o jogador continue a ver a pergunta (que já está carregada).

### 10.3 Sem otimização para tablets
- **Problema**: O layout é "mobile-first" mas não tem optimizações específicas para tablets (iPad, Android tablets).
- **Fix**: Adicionar breakpoints para tablets. Layout diferente em `768px - 1024px`.

### 10.4 Sem suporte a gestos
- **Problema**: Apenas toques simples. Não há swipe para mudar de pergunta ou pull-to-refresh.
- **Fix**: Adicionar gestos: swipe up para revelar resposta, swipe down para próxima pergunta.

### 10.5 Sem vibração/haptics real
- **Problema**: O toggle de haptics existe mas não está implementado (não há `navigator.vibrate`).
- **Fix**: Implementar vibração em eventos: acertar, errar, streak, timer baixo.

### 10.6 Sem orientação de ecrã
- **Problema**: O jogo não avisa que deve ser jogado em horizontal na TV.
- **Fix**: Adicionar aviso para rodar o telemóvel em modo paisagem (opcional).

---

## 11. SOM E MULTIMÉDIA

### 11.1 Sons muito básicos
- **Problema**: Os sons são gerados por osciladores Web Audio API — muito básicos e não imersivos.
- **Fix**: Substituir por samples de áudio reais (ou gerar com Web Audio mais elaborado). Adicionar música de fundo.

### 11.2 Sem música de fundo
- **Dr.Why tem**: Música ambiente durante o jogo.
- **QuizVerse**: Apenas efeitos sonoros.
- **Fix**: Adicionar música de fundo opcional (com toggle). Loop suave.

### 11.3 Sem volume master
- **Problema**: O volume é controlado individualmente por tipo de som.
- **Fix**: Adicionar slider de volume master + volume separado para música/efeitos.

### 11.4 Sem TTS para perguntas em voz alta (melhorar)
- **Problema**: O TTS lê a pergunta e opções, mas a voz é a padrão do sistema (pode ser má).
- **Fix**: Usar voz PT-PT de qualidade (ex: `Microsoft_Pedro` ou `Google_português`). Adicionar controlo de velocidade.

### 11.5 Sem legendas/subtítulos para TTS
- **Fix**: Adicionar highlighting do texto sendo lido.

---

## 12. SOCIAL E MULTIPLAYER

### 12.1 Sem chat
- **Problema**: Não há comunicação entre jogadores durante o jogo.
- **Fix**: Adicionar chat simples na lobby e durante o jogo.

### 12.2 Sem emojis/reactions
- **Fix**: Adicionar reactions rápidas (🔥, 👏, 😂) durante o jogo.

### 12.3 Sem "rematch" automático
- **Problema**: Depois do jogo, cada jogador tem de entrar novamente com o PIN.
- **Fix**: Adicionar botão "Revanche" que mantém os mesmos jogadores e reinicia.

### 12.4 Sem partilha de resultados nas redes sociais
- **Problema**: Apenas partilha nativa (clipboard/Web Share).
- **Fix**: Adicionar botões de partilha para WhatsApp, Instagram Stories, Twitter.

### 12.5 Sem amigos/lista de amigos
- **Problema**: Não há forma de adicionar amigos ou ver os seus jogos.
- **Fix**: Adicionar sistema de amigos (seguir utilizador).

### 12.6 Sem convites directos
- **Problema**: Os convites são apenas por PIN/código.
- **Fix**: Adicionar convites por link direto com nome do anfitrião.

---

## 13. ANALYTICS E ESTATÍSTICAS

### 13.1 Dados hardcoded nas páginas
- **Problema**: `stats/page.tsx` tem categorias e achievements com dados fixos (`accuracy: 88`, `missionsCompleted: 0`, etc.).
- **Fix**: Substituir todos os dados hardcoded por queries reais à BD.

### 13.2 Sem analytics de jogo
- **Problema**: Não há métricas de: taxa de abandono, pergunta mais difícil, média de tempo por categoria.
- **Fix**: Adicionar tabela `game_analytics` ou usar eventos no Supabase.

### 13.3 Sem dashboard de admin com gráficos
- **Problema**: O admin mostra apenas contagens. Não há gráficos de crescimento, perguntas mais reportadas, etc.
- **Fix**: Adicionar charts (ex: Recharts) no admin.

### 13.4 Sem exportação de dados
- **Problema**: O admin não pode exportar perguntas ou estatísticas.
- **Fix**: Adicionar botão "Exportar CSV" para perguntas e estatísticas.

### 13.5 Sem A/B testing
- **Fix**: Permitir criar versões de perguntas e medir qual tem melhor taxa de acerto.

---

## 14. QUALIDADE DE CÓDIGO

### 14.1 Código duplicado
- **Problema**: A lógica de `fetchQuestion` está em `play/page.tsx` E em `useQuestionSync.ts`.
- **Fix**: Extrair para um hook partilhado.

### 14.2 useEffect dependencies inconsistentes
- **Problema**: Alguns `useEffect` têm dependencies incompletas (ex: `useQuestionFlowTimer` usa `useRef` mas não os lista).
- **Fix**: Revisar todas as dependencies dos `useEffect`. Usar `exhaustive-deps` rule do ESLint.

### 14.3 Sem testes
- **Problema**: Apenas existe `vitest.config.ts` e `__tests__/` vazio. Não há testes.
- **Fix**: Adicionar testes unitários para:
  - `validateAnswerPayload`
  - `normalizeQuestions`
  - `findDuplicates`
  - Cálculo de pontos
  - Lógica de shuffling de respostas

### 14.4 Sem types para API responses
- **Problema**: As API responses são `any` em muitos lugares.
- **Fix**: Criar tipos para todas as responses de API (`ApiResponse<T>`, `AnswerResponse`, etc.).

### 14.5 Error handling inconsistente
- **Problema**: Alguns erros são `console.error`, outros mostram toast, outros são silenciosos.
- **Fix**: Padronizar error handling. Usar um `ErrorBoundary` global.

### 14.6 Sem logging estruturado
- **Problema**: Os logs são `console.error` e `console.warn` sem formato.
- **Fix**: Adicionar logger estruturado (ex: `pino`) para production.

### 14.7 Magic numbers
- **Problema**: Números como `3000` (ms de proteção), `1500` (ms de timeout), `8000` (ms de loading) estão hardcoded.
- **Fix**: Criar constants em `lib/constants.ts`.

### 14.8 Estado global disperso
- **Problema**: O `GameContext` tem estado, mas há muito estado local em `tv/page.tsx` e `play/page.tsx`.
- **Fix**: Considerar usar `zustand` ou `jotai` para estado mais granular. Ou mover mais estado para o `GameContext`.

---

## 15. EXPERIÊNCIA DO ANFITRIÃO (HOST)

### 15.1 Sem painel de controlo do host
- **Problema**: O host não pode ver quem está a responder, pausar o jogo, ou voltar atrás.
- **Fix**: Adicionar painel de controlo com: lista de jogadores, quem já respondeu, botão pausa, skip, voltar à pergunta anterior.

### 15.2 Sem pausa
- **Dr.Why tem**: O host pode pausar o jogo.
- **Fix**: Adicionar botão de pausa que congela o timer.

### 15.3 Sem "voltar atrás"
- **Problema**: Se o host avançar sem querer, não pode voltar.
- **Fix**: Adicionar botão "Voltar" durante REVEAL.

### 15.4 Sem edição de pergunta durante o jogo
- **Problema**: Se uma pergunta estiver errada, o host não pode corrigi-la sem parar o jogo.
- **Fix**: Adicionar opção "Editar Pergunta" nos controles do TV (apenas para admin/host).

### 15.5 Sem skip de perguntas sem penalização
- **Fix**: Adicionar opção de saltar pergunta (com aviso de que não dá pontos).

---

## 16. FEEDBACK E NOTIFICAÇÕES

### 16.1 Sem notificações no jogo
- **Problema**: A página `/notifications` existe mas não tem dados reais.
- **Fix**: Implementar sistema de notificações reais (torneios a começar, conquistas desbloqueadas, etc.).

### 16.2 Sem email notifications
- **Fix**: Adicionar emails para: convite de torneio, resultado de jogo, conquista desbloqueada.

### 16.3 Sem feedback pós-jogo detalhado
- **Problema**: No final do jogo, apenas vês o pódio. Não vês em que perguntas erraste.
- **Fix**: Adicionar página de resultados detalhada com cada pergunta, resposta escolhida, resposta correta, e pontos ganhos.

---

## 17. INTERNAZIONALIZAÇÃO (i18n)

### 17.1 Apenas português
- **Problema**: Todo o texto está hardcoded em PT-PT.
- **Fix**: Usar `next-intl` ou `react-i18next` para suportar múltiplos idiomas.

---

## 18. MONETIZAÇÃO (Futuro)

### 18.1 Sem modelo de monetização
- **Fix**: Considerar:
  - Versão gratuita com anúncios
  - Versão premium sem anúncios + power-ups exclusivos
  - Venda de pacotes de perguntas premium
  - Patrocínios de marcas

---

## PRIORIZAÇÃO DAS MELHORIAS

### 🔴 CRÍTICO (fazer esta semana)
1. Corrigir schema da BD (colunas `points` e `user_id`)
2. Corrigir RLS policies
3. Corrigir bug de pontuação local vs online
4. Corrigir bug de team scoring
5. Implementar save do profile edit
6. Corrigir race condition no submit de resposta

### 🟡 IMPORTANTE (fazer no próximo sprint)
7. Adicionar sistema de vidas
8. Adicionar power-ups (50:50, Skip)
9. Adicionar modo Solo/Praticar
10. Corrigir dados hardcoded nas páginas
11. Adicionar explicação após resposta
12. Melhorar sons (substituir osciladores)
13. Adicionar modo "cego" para torneios
14. Replay de jogos

### 🟢 DESEJÁVEL (fazer no futuro)
15. Modo Buzzer / Duelo
16. Chat e social features
17. PWA + offline
18. Internacionalização
19. Analytics dashboard
20. Exportação de dados

---

## NOTA FINAL

O QuizVerse é um projeto muito bem estruturado e com uma base sólida. A combinação de IA para geração de perguntas, modo local, equipas e torneios é impressionante. As melhorias mais impactantes são:

1. **Corrigir os bugs críticos de BD e segurança** — sem isto, o jogo não é confiável.
2. **Adicionar o "sabor" do Dr.Why** — vidas, power-ups, explicações, música.
3. **Melhorar a experiência do host** — controlo total sobre o jogo.
4. **Profundizar as estatísticas** — dados reais em vez de mockados.
5. **Polir a UI/UX** — loading states, acessibilidade, offline, PWA.

Com estas melhorias, o QuizVerse pode competir diretamente com o Dr.Why em qualidade de experiência de jogo.
