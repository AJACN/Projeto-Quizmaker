// src/app/components/QuizResult.tsx

'use client';
import { QuestionType } from "@/types/quiz";

interface QuizResultProps {
    questions: QuestionType[];
    userAnswers: { [key: number]: string };
    score: number;
    onPlayAgain: () => void; // Função para jogar novamente
}

export default function QuizResult({ questions, userAnswers, score, onPlayAgain }: QuizResultProps) {
    return (
        <div className="w-full max-w-3xl">
            <div className="text-center mb-8 bg-gray-800 p-6 rounded-lg shadow-xl">
                <h2 className="text-3xl font-bold mb-2">Quiz Finalizado!</h2>
                <p className="text-2xl text-blue-400">
                    Sua pontuação: {score} de {questions.length}
                </p>
            </div>

            {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.respostaCorreta;
                const resultClass = isCorrect ? 'border-green-500 bg-green-900/50' : 'border-red-500 bg-red-900/50';

                return (
                    <div key={index} className={`mb-6 p-4 border-2 rounded-lg ${resultClass}`}>
                        <h3 className="text-lg font-semibold mb-3">{index + 1}. {question.pergunta}</h3>
                        <p className="mb-1 text-sm">Sua resposta: <span className="font-bold">{userAnswer || "Não respondida"}</span></p>
                        {!isCorrect && (
                            <p className="text-sm">Resposta correta: <span className="font-bold">{question.respostaCorreta}</span></p>
                        )}
                    </div>
                );
            })}

            <button 
                onClick={onPlayAgain}
                className="w-full p-4 mt-6 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-lg transition-colors"
            >
                Jogar Novamente
            </button>
        </div>
    );
}