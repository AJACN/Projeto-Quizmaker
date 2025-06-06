// src/app/page.tsx

'use client';

import { useState } from 'react';
// Importações atualizadas
import { QuestionType } from '@/types/quiz';
import QuizForm from '@/app/components/QuizFormulario'; // O nome do arquivo não muda

export default function Home() {
    // Variáveis de estado renomeadas para inglês
    const [topic, setTopic] = useState<string>('');
    const [questions, setQuestions] = useState<QuestionType[] | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Função renomeada para 'handleGenerateQuiz'
    async function handleGenerateQuiz(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!topic.trim()) {
            alert('Por favor, digite um tema!');
            return;
        }

        setLoading(true);
        setError(null);
        setQuestions(null);

        try {
            const response = await fetch('/api/gerar-quiz', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ tema: topic }), // A API ainda espera 'tema'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Falha ao buscar dados do quiz.');
            }

            const data: QuestionType[] = await response.json();
            setQuestions(data);

        } catch (err: any) {
            console.error(err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
            <div className="w-full max-w-3xl text-center">
                <h1 className="text-4xl md:text-5xl font-bold mb-4">Gerador de Quiz Personalizado</h1>
                
                {/* Lógica de renderização condicional com as novas variáveis */}
                {!questions && (
                    <>
                        <p className="text-lg text-gray-400 mb-8">
                            Digite um assunto, e a nossa IA gerará um quiz com 10 perguntas para você!
                        </p>
                        <div className="w-full max-w-xl mx-auto rounded-lg bg-gray-800 shadow-xl p-8">
                            <form onSubmit={handleGenerateQuiz} className="flex flex-col gap-4">
                                <input
                                    type="text"
                                    value={topic}
                                    onChange={(e) => setTopic(e.target.value)}
                                    placeholder="Ex: Planets of the Solar System"
                                    className="p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-colors"
                                    disabled={loading}
                                />
                                <button
                                    type="submit"
                                    className="p-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-lg transition-colors duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed"
                                    disabled={loading}
                                >
                                    {loading ? 'Generating...' : 'Gerar Quiz'}
                                </button>
                            </form>
                        </div>
                    </>
                )}

                {loading && <p className="text-xl mt-8">Carregando o seu quiz... Por favor, aguarde.</p>}
                {error && <p className="text-xl mt-8 text-red-500">Erro: {error}</p>}

                {/* Passando a prop 'questions' para o componente QuizForm */}
                {questions && <div className="mt-10"><QuizForm questions={questions} /></div>}

            </div>
        </main>
    );
}