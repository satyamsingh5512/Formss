'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Trash2, Clock, Play, SkipForward, Layout } from 'lucide-react';

export default function CreateQuizPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [accessCode, setAccessCode] = useState('');
    const [timerType, setTimerType] = useState<'none' | 'whole' | 'perQuestion'>('none');
    const [wholeQuizTime, setWholeQuizTime] = useState(10);
    const [perQuestionTime, setPerQuestionTime] = useState(30);
    const [allowSkip, setAllowSkip] = useState(true);
    const [questions, setQuestions] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        }
    }, [status, router]);

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: '',
                options: ['', '', '', ''],
                correctAnswer: 0,
            },
        ]);
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const updateOption = (qIndex: number, oIndex: number, value: string) => {
        const updated = [...questions];
        updated[qIndex].options[oIndex] = value;
        setQuestions(updated);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (questions.length === 0) {
            alert('Please add at least one question');
            return;
        }

        setLoading(true);

        try {
            // Create quiz
            const quizRes = await fetch('/api/quizzes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title,
                    description,
                    accessCode,
                    timerType,
                    timeLimit: timerType === 'whole' ? wholeQuizTime : 0,
                    perQuestionTime: timerType === 'perQuestion' ? perQuestionTime : 0,
                    allowSkip,
                }),
            });

            if (!quizRes.ok) {
                const error = await quizRes.json();
                throw new Error(error.error || 'Failed to create quiz');
            }

            const quiz = await quizRes.json();

            // Add questions
            for (const [index, q] of questions.entries()) {
                const questionRes = await fetch('/api/questions', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        quizId: quiz.id, // Prisma uses id, mongo _id
                        question: q.question,
                        options: q.options,
                        correctAnswer: q.correctAnswer,
                        order: index
                    }),
                });
            }

            alert('Quiz created successfully!');
            router.push('/quizo');
        } catch (error) {
            console.error('Error creating quiz:', error);
            alert(error instanceof Error ? error.message : 'Failed to create quiz');
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-8 pb-32">
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold mb-2">Create New Quiz</h1>
                    <p className="text-zinc-600 dark:text-zinc-400">Design an interactive quiz with timers and custom logic.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">

                    {/* General Info Card */}
                    <div className="neo-card bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Layout className="w-6 h-6" />
                            <h3 className="text-xl font-bold">General Information</h3>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block font-bold mb-2">Quiz Title</label>
                                <input
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    className="w-full bg-transparent border-2 border-black dark:border-white/20 p-3 font-medium outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                                    placeholder="e.g. History of Web Design"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-2">Description</label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-transparent border-2 border-black dark:border-white/20 p-3 font-medium outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
                                    placeholder="What is this quiz about?"
                                    rows={3}
                                />
                            </div>

                            <div>
                                <label className="block font-bold mb-2">Access Code (Optional)</label>
                                <input
                                    type="text"
                                    value={accessCode}
                                    onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                                    className="w-full bg-transparent border-2 border-black dark:border-white/20 p-3 font-medium outline-none uppercase"
                                    placeholder="e.g. QUIZ2024"
                                    maxLength={10}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Settings Card */}
                    <div className="neo-card bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-8">
                        <div className="flex items-center gap-3 mb-6">
                            <Clock className="w-6 h-6" />
                            <h3 className="text-xl font-bold">Quiz Settings</h3>
                        </div>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <label className="block font-bold mb-3">Timer Config</label>
                                <div className="space-y-3">
                                    {[
                                        { id: 'none', label: 'No Timer', desc: 'Self-paced' },
                                        { id: 'whole', label: 'Whole Quiz', desc: 'Total limit' },
                                        { id: 'perQuestion', label: 'Per Question', desc: 'Speed run' }
                                    ].map((type) => (
                                        <div
                                            key={type.id}
                                            onClick={() => setTimerType(type.id as any)}
                                            className={`cursor-pointer border-2 p-4 flex justify-between items-center transition-all ${timerType === type.id ? 'bg-black text-white border-black dark:bg-white dark:text-black' : 'border-zinc-200 dark:border-zinc-800 hover:border-black dark:hover:border-white'}`}
                                        >
                                            <div>
                                                <div className="font-bold">{type.label}</div>
                                                <div className={`text-xs ${timerType === type.id ? 'text-zinc-300 dark:text-zinc-600' : 'text-zinc-500'}`}>{type.desc}</div>
                                            </div>
                                            {timerType === type.id && <Play size={16} fill="currentColor" />}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-6">
                                {timerType === 'whole' && (
                                    <div>
                                        <label className="block font-bold mb-2">Total Time (Minutes)</label>
                                        <input
                                            type="number"
                                            value={wholeQuizTime}
                                            onChange={(e) => setWholeQuizTime(parseInt(e.target.value) || 1)}
                                            className="w-full bg-transparent border-2 border-black dark:border-white/20 p-3 font-bold"
                                        />
                                    </div>
                                )}
                                {timerType === 'perQuestion' && (
                                    <div>
                                        <label className="block font-bold mb-2">Time Per Question (Seconds)</label>
                                        <input
                                            type="number"
                                            value={perQuestionTime}
                                            onChange={(e) => setPerQuestionTime(parseInt(e.target.value) || 5)}
                                            className="w-full bg-transparent border-2 border-black dark:border-white/20 p-3 font-bold"
                                        />
                                    </div>
                                )}

                                <div className="flex items-center justify-between border-2 border-black dark:border-white/20 p-4">
                                    <div className="flex items-center gap-3">
                                        <SkipForward size={20} />
                                        <span className="font-bold">Allow Skipping</span>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setAllowSkip(!allowSkip)}
                                        className={`w-12 h-6 rounded-full border-2 border-black dark:border-white/20 relative transition-colors ${allowSkip ? 'bg-black dark:bg-white' : 'bg-transparent'}`}
                                    >
                                        <div className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-white dark:bg-black rounded-full border-2 border-black transition-all ${allowSkip ? 'left-[calc(100%-20px)]' : 'left-[2px]'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Question Builder */}
                    <div className="space-y-6">
                        {questions.map((q, qIndex) => (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                key={qIndex}
                                className="neo-card bg-zinc-50 dark:bg-zinc-800/50 border-2 border-black dark:border-white/20 p-8 relative"
                            >
                                <div className="absolute top-4 right-4">
                                    <button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 rounded-full transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>

                                <h4 className="font-bold mb-4">Question {qIndex + 1}</h4>

                                <div className="mb-6">
                                    <input
                                        type="text"
                                        value={q.question}
                                        onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                                        className="w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-4 font-medium text-lg outline-none"
                                        placeholder="Type your question here..."
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {q.options.map((option: string, oIndex: number) => (
                                        <div key={oIndex} className="flex items-center gap-3 group">
                                            <div
                                                onClick={() => updateQuestion(qIndex, 'correctAnswer', oIndex)}
                                                className={`w-8 h-8 rounded-full border-2 border-black dark:border-white/20 flex items-center justify-center cursor-pointer transition-colors ${q.correctAnswer === oIndex ? 'bg-black text-white dark:bg-white dark:text-black' : 'hover:bg-zinc-200 dark:hover:bg-zinc-700'}`}
                                            >
                                                {q.correctAnswer === oIndex && <div className="w-3 h-3 bg-white dark:bg-black rounded-full" />}
                                            </div>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                className={`flex-1 bg-white dark:bg-zinc-900 border-b-2 p-2 outline-none transition-colors ${q.correctAnswer === oIndex ? 'border-black dark:border-white font-bold' : 'border-zinc-200 dark:border-zinc-700 focus:border-black dark:focus:border-white'}`}
                                                placeholder={`Option ${oIndex + 1}`}
                                                required
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        ))}

                        <button
                            type="button"
                            onClick={addQuestion}
                            className="w-full py-6 border-2 border-dashed border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-all font-bold text-zinc-500 hover:text-black dark:hover:text-white flex items-center justify-center gap-2"
                        >
                            <Plus size={24} />
                            Add Another Question
                        </button>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-4 pt-8 border-t-2 border-black dark:border-white/10">
                        <button
                            type="button"
                            onClick={() => router.push('/quizo')}
                            className="neo-button bg-white text-black"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="neo-button-primary"
                        >
                            {loading ? 'Creating...' : 'Create Quiz'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
