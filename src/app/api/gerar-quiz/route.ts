// app/api/gerar-quiz/route.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

// Função que lida com requisições POST para esta rota
export async function POST(request: Request) {
  // 1. Validar a chave da API
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'Chave da API do Gemini não configurada.' },
      { status: 500 }
    );
  }

  try {
    // 2. Extrair o tema do corpo da requisição
    const body = await request.json();
    const { tema } = body;

    if (!tema) {
      return NextResponse.json(
        { error: 'O tema do quiz é obrigatório.' },
        { status: 400 }
      );
    }

    // 3. Configurar e inicializar o modelo do Gemini
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: 'gemini-1.5-flash-latest',
    });

    // 4. Criar o prompt detalhado para a IA
    const prompt = `
      Crie um quiz sobre o tema "${tema}".
      O quiz deve conter exatamente 10 perguntas de múltipla escolha.
      Cada pergunta deve ter exatamente 4 alternativas.
      Apenas uma alternativa pode ser a correta.

      Retorne o resultado estritamente no seguinte formato JSON, sem nenhum texto ou formatação adicional antes ou depois do JSON.
      O JSON deve ser um array de objetos, onde cada objeto representa uma pergunta e tem a seguinte estrutura:
      {
        "pergunta": "Texto da pergunta aqui",
        "opcoes": ["Alternativa 1", "Alternativa 2", "Alternativa 3", "Alternativa 4"],
        "respostaCorreta": "O texto exato de uma das quatro alternativas"
      }
    `;

    // 5. Chamar a API do Gemini
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    
    // 6. Limpar e parsear a resposta para JSON
    // A API pode retornar o JSON dentro de um bloco de código markdown (```json ... ```)
    const cleanedText = text.replace(/^```json\s*|```$/g, '').trim();
    const quizJson = JSON.parse(cleanedText);

    // 7. Retornar o quiz para o frontend
    return NextResponse.json(quizJson);
    
  } catch (error) {
    console.error('Erro ao gerar o quiz:', error);
    return NextResponse.json(
      { error: 'Ocorreu um erro ao se comunicar com a IA.' },
      { status: 500 }
    );
  }
}