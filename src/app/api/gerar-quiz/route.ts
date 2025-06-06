// src/app/api/gerar-quiz/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chave da API do Gemini não configurada.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    // No frontend, renomeamos 'tema' para 'topic', mas a API continua recebendo 'tema'
    const { tema } = body;

    if (!tema) {
      return NextResponse.json(
        { error: 'O tema do quiz é obrigatório.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    const prompt = `
      Crie um quiz sobre o tema "${tema}".
      O quiz deve conter exatamente 10 perguntas de múltipla escolha.
      Cada pergunta deve ter exatamente 4 alternativas.
      Apenas uma alternativa pode ser a correta.
      As perguntas e respostas devem ser verídicas e fiéis ao assunto.

      Retorne o resultado estritamente no seguinte formato JSON, como um array de objetos.
      Não adicione nenhum texto, comentário ou formatação markdown como \`\`\`json antes ou depois do array JSON.
      A resposta deve ser apenas o array JSON puro.
      
      Formato esperado:
      [
        {
          "pergunta": "Texto da pergunta aqui",
          "opcoes": ["Alternativa 1", "Alternativa 2", "Alternativa 3", "Alternativa 4"],
          "respostaCorreta": "O texto exato de uma das quatro alternativas"
        }
      ]
    `;

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // ===================================================================
    // LÓGICA DE EXTRAÇÃO DE JSON ATUALIZADA E MAIS ROBUSTA
    // ===================================================================
    // Em vez de limpar o texto, procuramos o início e o fim do array JSON.
    const startIndex = text.indexOf('[');
    const endIndex = text.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1) {
        // Log da resposta completa para depuração, caso não encontre o JSON
        console.error("Resposta da IA não continha um array JSON válido:", text);
        throw new Error("A resposta da IA não estava no formato esperado.");
    }
    
    // Extrai apenas a string do array JSON
    const jsonString = text.substring(startIndex, endIndex + 1);
    
    // Tenta parsear a string extraída
    const quizJson = JSON.parse(jsonString);
    // ===================================================================

    return NextResponse.json(quizJson);
    
  } catch (error) {
    console.error('Erro detalhado ao gerar o quiz:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao se comunicar com a IA.' },
      { status: 500 }
    );
  }
}