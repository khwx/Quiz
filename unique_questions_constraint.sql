-- Adicionar constraint UNIQUE para evitar perguntas duplicadas na mesma categoria
-- Isto garante que não inserimos "Qual a cor do céu?" múltiplas vezes.

ALTER TABLE questions 
ADD CONSTRAINT unique_question_text_category 
UNIQUE (text, category);
