// src/app/components/QuizFormulario.tsx

'use client';

// Importação atualizada para o novo caminho e nome
import { QuestionType } from "@/types/quiz";

// Interface e props atualizadas para inglês
interface QuizFormProps {
    questions: QuestionType[];
}

export default function QuizForm({ questions }: QuizFormProps) {
    // Função renomeada para 'handleSubmit'
    function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        alert("Lógica de verificação de respostas a ser implementada!");
    }

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
    )
}