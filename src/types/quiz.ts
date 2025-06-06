// src/types/quiz.ts

// Renomeado de 'TipoPergunta' para 'QuestionType'
export interface QuestionType {
    pergunta: string;
    opcoes: string[];
    respostaCorreta: string;
}