'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Trophy, ChevronRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import Link from 'next/link';

// Types (simplified for client)
interface Question {
    id: string;
    type: string; // 'multiple_choice' | 'text'
    label: string;
    options?: any; // Json
    points?: number | null;
    timeLimit?: number | null;
}

interface Quiz {
    id: string;
    title: string;
    description: string | null;
    questions: Question[];
    timerType: string | null; // 'none' | 'quiz' | 'question'
    timeLimit: number | null;
    perQuestionTime: number | null;
    allowSkip: boolean;
}

export function QuizClient({ quiz }: { quiz: Quiz }) {
    const [started, setStarted] = useState(false);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState<number>(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [result, setResult] = useState<{ score: number; maxScore: number; results: any } | null>(null);
    const [participantName, setParticipantName] = useState('');
    const [showNameInput, setShowNameInput] = useState(true);

    const { width, height } = useWindowSize();

    // Initialize Timer
    useEffect(() => {
        if (started && !result) {
            if (quiz.timerType === 'quiz' && quiz.timeLimit) {
                // Total quiz timer
                setTimeLeft(quiz.timeLimit);
            } else if (quiz.timerType === 'question' && quiz.perQuestionTime) {
                // Per question timer
                setTimeLeft(quiz.perQuestionTime);
            } else if (quiz.timerType === 'question' && quiz.questions[currentQuestionIndex].timeLimit) {
                // Override per question
                setTimeLeft(quiz.questions[currentQuestionIndex].timeLimit!);
            }
        }
    }, [started, quiz, currentQuestionIndex, result]);

    // Timer Logic
    useEffect(() => {
        if (!started || result || timeLeft <= 0 || quiz.timerType === 'none') return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    // Time's up
                    handleTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [started, result, timeLeft, quiz.timerType]);

    const handleTimeUp = () => {
        if (quiz.timerType === 'question') {
            handleNext();
        } else {
            handleSubmit();
        }
    };

    const handleStart = () => {
        if (!participantName.trim()) {
            alert("Please enter your name to start");
            return;
        }
        setStarted(true);
        setShowNameInput(false);
    };

    const handleAnswer = (option: string) => {
        const questionId = quiz.questions[currentQuestionIndex].id;
        setAnswers(prev => ({ ...prev, [questionId]: option }));
    };

    const handleNext = () => {
        if (currentQuestionIndex < quiz.questions.length - 1) {
            setCurrentQuestionIndex(prev => prev + 1);
            // Reset per-question timer if needed
            if (quiz.timerType === 'question' && quiz.perQuestionTime) {
                setTimeLeft(quiz.perQuestionTime);
            }
        } else {
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const res = await fetch('/api/quiz/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    formId: quiz.id,
                    answers,
                    timeTaken: 0, // Todo: calculate real time taken
                    participantInfo: { name: participantName }
                }),
            });
            const data = await res.json();
            setResult(data);
        } catch (error) {
            console.error(error);
            alert("Failed to submit quiz");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (result) {
        // Results View
        const percentage = Math.round((result.score / result.maxScore) * 100) || 0;

        return (
            <div className="min-h-screen bg-[#f0f0f0] p-4 flex flex-col items-center justify-center relative overflow-hidden">
                {percentage > 70 && <Confetti width={width} height={height} recycle={false} />}

                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-2xl bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-xl p-8 text-center relative z-10"
                >
                    <div className="flex justify-center mb-6">
                        <div className="bg-yellow-300 border-2 border-black p-4 rounded-full">
                            <Trophy size={48} className="text-black" />
                        </div>
                    </div>

                    <h1 className="text-4xl font-black mb-2">Quiz Completed!</h1>
                    <p className="text-xl text-zinc-600 font-bold mb-8">You scored</p>

                    <div className="text-6xl font-black mb-4 text-blue-600">
                        {result.score}/{result.maxScore}
                    </div>

                    <div className="w-full bg-zinc-200 rounded-full h-4 border-2 border-black mb-8 overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${percentage}%` }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className="h-full bg-blue-500"
                        />
                    </div>

                    <div className="grid gap-4 text-left">
                        {/* Simple Answer Review Listing */}
                        <h3 className="text-xl font-bold border-b-2 border-black pb-2">Review</h3>
                        {quiz.questions.map((q, idx) => {
                            const res = result.results[q.id];
                            const myAns = answers[q.id];
                            return (
                                <div key={q.id} className="p-4 bg-zinc-50 border-2 border-black rounded-lg">
                                    <div className="flex items-start gap-3">
                                        <span className="font-bold">{idx + 1}.</span>
                                        <div className="flex-1">
                                            <p className="font-bold mb-2">{q.label}</p>
                                            <div className="flex items-center gap-2 text-sm">
                                                {res?.correct ? (
                                                    <span className="text-green-600 flex items-center gap-1 font-bold"><CheckCircle2 size={16} /> Correct</span>
                                                ) : (
                                                    <span className="text-red-600 flex items-center gap-1 font-bold"><XCircle size={16} /> Incorrect</span>
                                                )}
                                                {!res?.correct && <span className="text-zinc-500">(Ans: {res?.correctAnswer})</span>}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    <Link href="/quizo">
                        <button className="mt-8 neo-button w-full py-4 text-xl">Create Your Own Quiz</button>
                    </Link>
                </motion.div>
            </div>
        );
    }

    if (!started) {
        return (
            <div className="min-h-screen bg-[#f0f0f0] p-4 flex items-center justify-center relative">
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="w-full max-w-md bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-xl p-8"
                >
                    <h1 className="text-4xl font-black mb-4">{quiz.title}</h1>
                    <p className="text-zinc-600 mb-8 font-medium">{quiz.description || "Get ready to test your knowledge!"}</p>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="font-bold">Enter your name</label>
                            <input
                                type="text"
                                value={participantName}
                                onChange={(e) => setParticipantName(e.target.value)}
                                className="w-full p-3 border-2 border-black rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                placeholder="Your Name"
                            />
                        </div>

                        <div className="flex items-center gap-4 text-sm font-bold text-zinc-500 bg-zinc-100 p-4 rounded-lg border-2 border-zinc-200">
                            {quiz.timeLimit ? (
                                <div className="flex items-center gap-2"><Clock size={16} /> {Math.floor(quiz.timeLimit / 60)} min</div>
                            ) : <div>No Time Limit</div>}
                            <div className="w-px h-4 bg-zinc-300" />
                            <div>{quiz.questions.length} Questions</div>
                        </div>

                        <button
                            onClick={handleStart}
                            className="neo-button-primary w-full py-4 text-lg"
                        >
                            Start Quiz
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    // Active Quiz View
    const currentQuestion = quiz.questions[currentQuestionIndex];
    if (!currentQuestion) return <div>Ending...</div>;

    const options = Array.isArray(currentQuestion.options)
        ? currentQuestion.options as string[]
        : [];

    return (
        <div className="min-h-screen bg-[#f0f0f0] flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 bg-[linear-gradient(#e5e5e5_1px,transparent_1px),linear-gradient(90deg,#e5e5e5_1px,transparent_1px)] bg-[size:20px_20px] opacity-40 pointer-events-none" />

            {/* Timer Header */}
            {quiz.timerType !== 'none' && (
                <div className="fixed top-0 left-0 right-0 p-4 flex justify-center z-50 pointer-events-none">
                    <div className={cn(
                        "bg-black text-white font-mono text-2xl px-6 py-2 rounded-lg border-2 border-white shadow-xl transition-colors",
                        timeLeft < 10 && "bg-red-500 animate-pulse"
                    )}>
                        {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                    </div>
                </div>
            )}

            <div className="w-full max-w-3xl relative z-10">
                {/* Progress Bar */}
                <div className="mb-6 flex items-center gap-4">
                    <div className="flex-1 h-4 bg-white border-2 border-black rounded-full overflow-hidden">
                        <motion.div
                            animate={{ width: `${((currentQuestionIndex) / quiz.questions.length) * 100}%` }}
                            className="h-full bg-yellow-400"
                        />
                    </div>
                    <span className="font-bold whitespace-nowrap">
                        {currentQuestionIndex + 1} / {quiz.questions.length}
                    </span>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentQuestion.id}
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -50, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000000] rounded-2xl p-6 md:p-10"
                    >
                        <h2 className="text-3xl font-black mb-8 leading-tight">
                            {currentQuestion.label}
                        </h2>

                        <div className="grid gap-4">
                            {options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleAnswer(option)}
                                    className={cn(
                                        "w-full text-left p-6 rounded-xl border-2 font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000000]",
                                        answers[currentQuestion.id] === option
                                            ? "bg-black text-white border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]"
                                            : "bg-white border-black hover:bg-zinc-50"
                                    )}
                                >
                                    <div className="flex items-center gap-4">
                                        <div className={cn(
                                            "w-8 h-8 flex items-center justify-center rounded-lg border-2 text-sm",
                                            answers[currentQuestion.id] === option
                                                ? "border-white"
                                                : "border-black"
                                        )}>
                                            {String.fromCharCode(65 + idx)}
                                        </div>
                                        {option}
                                    </div>
                                </button>
                            ))}
                        </div>

                        <div className="mt-8 flex justify-end items-center gap-4">
                            {/* Skip Button */}
                            {quiz.allowSkip && (
                                <button
                                    onClick={handleNext}
                                    className="text-zinc-500 font-bold hover:text-black underline"
                                >
                                    Skip
                                </button>
                            )}

                            <button
                                onClick={handleNext}
                                className="neo-button-primary px-8 py-3 text-lg flex items-center gap-2"
                            >
                                {currentQuestionIndex === quiz.questions.length - 1 ? 'Finish' : 'Next'}
                                <ChevronRight size={20} />
                            </button>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
