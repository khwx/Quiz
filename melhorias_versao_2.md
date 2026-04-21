# Melhorias do Jogo - Versão 2.0 (Estabilidade e Variabilidade)

Esta versão foca-se em corrigir bugs de dessincronização, melhorar a inteligência do jogo para evitar repetições e otimizar o fluxo da partida tanto na TV como no Telemóvel.

## 🎮 Fluidez do Jogo
1. **Auto-Skip Inteligente**: O jogo não fica mais à espera que o tempo termine se toda a gente já respondeu. Agora avança imediatamente para os resultados (com 2 segundos de segurança para criar suspense).
2. **Fim do "Avanço Fantasma"**: O jogo já não "responde sozinho" no início das rondas. As respostas antigas são limpas da base de dados e colocámos uma proteção nos primeiros instantes da pergunta.

## 🚩 Sistema de Bandeiras
3. **Imagens Automáticas (Fallback)**: Se uma pergunta sobre bandeiras não tiver a imagem guardada na BD, o jogo deteta qual é o país correto e vai buscar a bandeira oficial ao FlagCDN de forma autónoma.
4. **Proteção de Interface (Sem Vazios)**: Se, mesmo com o fallback, a internet falhar e não carregar a bandeira, o jogo escreve o nome do país de forma subtil, garantindo que a ronda não fica "em branco".
5. **Limpeza de Lixo na BD**: Limpeza de perguntas "estragadas" pela IA (ex: perguntas sobre os continentes inseridas na categoria de bandeiras, mas sem associação de imagem).

## 🧠 Inteligência e Variabilidade
6. **Memória de Longo Prazo (Local Storage)**: O jogo lembra-se das perguntas que já passaram. Acabou o terror das perguntas repetidas em loop ("Ditadura do Brasil 4x"). O jogo obriga-se a percorrer toda a base de dados (200+ perguntas) sem repetir nenhuma na mesma sessão de TV.
7. **Baralhar Respostas (Anti-Batota)**: Quer as perguntas venham da IA ou da Base de Dados, as opções A, B, C e D são sempre baralhadas de forma aleatória em cada jogo. A resposta correta já não é sistematicamente a opção A.

## 📱 Experiência no Telemóvel (Comando)
8. **Feedback Imediato no Toque**: Quando clicas numa resposta, o botão muda de cor e dá feedback sonoro imediatamente, removendo a sensação de que o ecrã "encravou".
9. **Recuperação de Erros na 1ª Pergunta**: Caso exista um atraso na rede e cliques na primeira pergunta antes de ela carregar totalmente o ID, o telemóvel avisa-te de forma clara ("Aguarde, a sincronizar...") em vez de não fazer nada e bloquear as respostas silenciosamente.

---
*Atualizado em: Abril de 2026*
