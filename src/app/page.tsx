// app/page.tsx

// Importante: Adicionar 'use client' no topo para usar hooks como o useState.
'use client';

import { useState } from 'react';

// O nome da nossa página principal será "Home".
export default function Home() {
    // Estado para armazenar o tema do quiz digitado pelo usuário.
    const [tema, setTema] = useState<string>('');

    // Função que será chamada quando o formulário for enviado.
    // Por enquanto, ela apenas impede o recarregamento da página e mostra o tema no console.
    function manipularGerarQuiz(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault(); // Impede o recarregamento padrão da página ao enviar o form.
        
        if (!tema.trim()) {
            alert('Por favor, digite um tema para o quiz!');
            return;
        }

        console.log('Tema escolhido:', tema);
        // Nos próximos passos, faremos a chamada para nossa API aqui.
    }

    return (
        <main className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white p-8">
            <div className="w-full max-w-xl rounded-lg bg-gray-800 shadow-xl p-8">
                <div className="text-center">
                    <h1 className="text-4xl font-bold mb-4">Gerador de Quiz Personalizado</h1>
                    <p className="text-lg text-gray-400 mb-8">
                        Digite um assunto, e a nossa IA gerará um quiz com 10 perguntas para você!
                    </p>
                </div>

                <form onSubmit={manipularGerarQuiz} className="flex flex-col gap-4">
                    <input
                        type="text"
                        value={tema}
                        onChange={(e) => setTema(e.target.value)}
                        placeholder="Ex: História do Brasil na Segunda Guerra"
                        className="p-4 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg transition-colors"
                    />
                    <button
                        type="submit"
                        className="p-4 rounded-lg bg-blue-600 hover:bg-blue-700 font-bold text-lg transition-colors duration-300"
                    >
                        Gerar Quiz
                    </button>
                </form>
            </div>
        </main>
    );
}