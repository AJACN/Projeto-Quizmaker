// src/app/components/QuizForm.tsx

'use client';
import { useState } from "react";
import { QuestionType } from "@/types/quiz";
import QuizResult from "./QuizResult"; // Importa o novo componente

interface QuizFormProps {
    questions: QuestionType[];
    onFinish: () => void; // Adicionamos uma prop para reiniciar o quiz
}

export default function QuizForm({ questions, onFinish }: QuizFormProps) {
    // Estado para guardar as respostas do usuário {índice_da_pergunta: resposta}
    const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: string }>({});
    
    // Estado para guardar o resultado final
    const [result, setResult] = useState<{ score: number } | null>(null);

    // Atualiza o estado quando o usuário seleciona uma opção
    function handleOptionChange(questionIndex: number, option: string) {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: option,
        }));
    }

    // Processa o quiz ao enviar
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        let score = 0;
        for (let i = 0; i < questions.length; i++) {
            if (selectedAnswers[i] === questions[i].respostaCorreta) {
                score++;
            }
        }
        setResult({ score });
    }

    // Se o resultado já foi calculado, mostra o componente de resultado
    if (result) {
        return (
            <QuizResult
                score={result.score}
                questions={questions}
                userAnswers={selectedAnswers}
                onPlayAgain={onFinish}
            />
        );
    }

    // Senão, mostra o formulário do quiz
    return (
        <form onSubmit={handleSubmit} className="w-full max-w-3xl">
            {questions.map((item, index) => (
                <div key={index} className="mb-8 p-6 bg-gray-800 rounded-lg shadow-md">
                    <h3 className="text-xl font-semibold mb-4">{index + 1}. {item.pergunta}</h3>
                    <div className="flex flex-col gap-3">
                        {item.opcoes.map((opcao, i) => (
                            <label key={i} className="flex items-center p-3 bg-gray-700 rounded-lg cursor-pointer hover:bg-gray-600 transition-colors">
                                <input 
                                    type="radio"
                                    name={`pergunta-${index}`}
                                    value={opcao}
                                    onChange={() => handleOptionChange(index, opcao)}
                                    checked={selectedAnswers[index] === opcao}
                                    className="mr-3"
                                />
                                {opcao}
                            </label>
                        ))}
                    </div>
                </div>
            ))}
            <button type="submit" className="w-full p-4 mt-4 rounded-lg bg-green-600 hover:bg-green-700 font-bold text-lg transition-colors">
                Enviar Respostas
            </button>
        </form>
    );
}