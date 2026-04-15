# Melhorias na Geração de Perguntas com IA

## Data: 2026-04-XX

## Problemas Identificados

1. **Perguntas óbvias e repetitivas**: A IA gerava perguntas tipo "Qual é a cor do céu?" para o tema "Cores"
2. **Resposta correta mal alinhada**: A `correct_option` nem sempre correspondia à posição da resposta correta nas `options`
3. **Modelo desatualizado**: `gemini-2.0-flash` já não funcionava bem; sugerido `gemini-1.5-flash`

## Prompt Atual (buildPrompt em ai-service-fallback.ts)

```typescript
function buildPrompt(prompt: string, count: number, ageRating: string) {
  return `
    Gera ${count} perguntas de quiz em Português de Portugal para o seguinte tema: "${prompt}".
    
    Regras importantes para evitar repetições e aumentar a qualidade:
    1.  NÃO gere perguntas óbvias ou de conhecimento senso comum (ex: "Qual é a cor do céu?" para o tema "Cores").
    2.  Foque em fatos menos conhecidos, curiosidades, detalhes específicos ou aplicações práticas do tema.
    3.  Varie a estrutura das perguntas: use "Qual é...", "O que acontece se...", "Por que...", "Qual destes...".
    4.  As explicações devem ser breves mas informativas, adicionando valor além da simples resposta correta.
    5.  Se o tema for muito amplo, reduza-o a um sub-tema específico ou um aspecto menos óbvio.
    6.  A resposta correta DEVE estar sempre entre as "options" fornecidas.
    7.  O índice "correct_option" DEVE corresponder à posição da resposta correta nas "options".

    Público Alvo e Nível de Dificuldade:
    ${ageRating === "7-9" ? "- Crianças (7-9 anos): Perguntas muito simples, divertidas e educativas. Vocabulário básico. Evite abstrações." : ""}
    ${ageRating === "10-14" ? "- Jovens (10-14 anos): Nível escolar intermédio. Ligações ao currículo de ciências, história ou geografia." : ""}
    ${ageRating === "15-17" ? "- Adolescentes (15-17 anos): Nível secundário. Conceptos ligeiramente mais complexos, aplicações reais ou históricas." : ""}
    ${!["7-9", "10-14", "15-17"].includes(ageRating) ? "- Adultos: Nível geral de quiz show. Perguntas que exigem algum raciocínio ou conhecimento específico, não apenas sentido comum." : ""}

    Retorna APENAS um array JSON válido (sem markdown) com este formato exato:
    [
      {
        "text": "Pergunta? (deve terminar com interrogação)",
        "options": ["Texto da opção A", "Texto da opção B", "Texto da opção C", "Texto da opção D"],
        "correct_option": 0, // Índice da opção correta (0, 1, 2 ou 3)
        "category": "${prompt}",
        "explanation": "Explicação curta e informativa (1 frase) sobre por que a resposta está correta ou um fato interessante relacionado."
      }
    ]
  `;
}
```

## Modelos Recomendados

- **Gemini**: `gemini-1.5-flash` (recomendado), `gemini-2.0-flash-exp` (experimental)
- **Groq**: `llama-3.3-70b-versatile` (padrão)

## Próximos Passos

1. Testar o prompt com `node test-gemini.js`
2. Ajustar regras do prompt com base nos resultados
3. Considerar pedir múltiplas versões para validar consistência
