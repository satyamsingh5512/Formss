'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Eye, Settings, Clock, Hash, Users } from 'lucide-react';
import Link from 'next/link';

export default function MyQuizzesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [quizzes, setQuizzes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/signin');
        } else if (status === 'authenticated') {
            fetchQuizzes();
        }
    }, [status, router]);

    const fetchQuizzes = async () => {
        try {
            const res = await fetch('/api/quizzes/my-quizzes');
            const data = await res.json();
            setQuizzes(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error('Error fetching quizzes:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-black dark:border-white"></div>
            </div>
        );
    }

    return (
        <div className="flex-1 space-y-8 p-8 pt-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quizo Dashboard</h2>
                    <p className="text-zinc-500">Manage your interactive quizzes.</p>
                </div>
                <Link href="/quizo/new">
                    <button className="neo-button-primary flex items-center gap-2">
                        <Plus size={20} />
                        Create Quiz
                    </button>
                </Link>
            </div>

            {quizzes.length === 0 ? (
                <div className="neo-card bg-zinc-50 dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-12 text-center">
                    <h3 className="text-xl font-bold mb-2">No quizzes created yet</h3>
                    <p className="text-zinc-500 mb-6">Create your first quiz to engage your audience.</p>
                    <Link href="/quizo/new">
                        <button className="neo-button flex items-center gap-2 mx-auto">
                            <Plus size={20} />
                            Get Started
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {quizzes.map((quiz, i) => (
                        <motion.div
                            key={quiz.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="neo-card flex flex-col justify-between"
                        >
                            <div className="space-y-4 mb-4">
                                <div className="flex justify-between items-start">
                                    <h3 className="text-xl font-bold line-clamp-1">{quiz.title}</h3>
                                    {quiz.accessCode && (
                                        <span className="text-xs font-bold px-2 py-1 bg-zinc-100 dark:bg-zinc-800 border border-black dark:border-white/20 rounded-md">
                                            {quiz.accessCode}
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-zinc-500 line-clamp-2 h-10">{quiz.description || "No description provided."}</p>

                                <div className="flex items-center gap-4 text-xs font-medium text-zinc-500">
                                    <div className="flex items-center gap-1">
                                        <Hash size={14} />
                                        {quiz._count?.questions || 0} Questions
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock size={14} />
                                        {quiz.timeLimit ? `${quiz.timeLimit}m` : 'Unlimited'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2 pt-4 border-t-2 border-black/10 dark:border-white/10">
                                {/* Share Link */}
                                <div className="flex items-center gap-2 bg-zinc-100 dark:bg-zinc-800 rounded-lg p-2 text-xs">
                                    <span className="text-zinc-500 font-medium">Share:</span>
                                    <code className="flex-1 truncate font-mono text-black dark:text-white">
                                        {typeof window !== 'undefined' ? `${window.location.origin}/quiz/${quiz.publicId}` : `/quiz/${quiz.publicId}`}
                                    </code>
                                    <button
                                        onClick={() => {
                                            navigator.clipboard.writeText(`${window.location.origin}/quiz/${quiz.publicId}`);
                                            alert('Link copied!');
                                        }}
                                        className="text-xs font-bold text-blue-600 hover:underline"
                                    >
                                        Copy
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <Link href={`/quiz/${quiz.publicId}`} className="flex-1">
                                        <button className="w-full neo-button text-sm py-2 flex items-center justify-center gap-2">
                                            <Eye size={16} />
                                            Preview
                                        </button>
                                    </Link>
                                    <Link href={`/dashboard/${quiz.id}/responses`} className="flex-1">
                                        <button className="w-full neo-button text-sm py-2 flex items-center justify-center gap-2">
                                            <Users size={16} />
                                            {quiz._count?.responses || 0} Responses
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
