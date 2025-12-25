import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { QuizClient } from './QuizClient';

interface Props {
    params: {
        id: string;
    };
}

export default async function TakeQuizPage({ params }: Props) {
    const form = await prisma.form.findUnique({
        where: {
            publicId: params.id // Using publicId for cleaner URLs
        },
        include: {
            questions: {
                orderBy: { order: 'asc' },
            },
        },
    });

    if (!form || !form.isQuiz) {
        // Try finding by internal ID if publicId search fails, or handle legacy URLs
        const formById = await prisma.form.findUnique({
            where: { id: params.id },
            include: { questions: { orderBy: { order: 'asc' } } }
        });

        if (!formById || !formById.isQuiz) {
            notFound();
        }

        // Strip correct answers for security
        const sanitizedQuestions = formById.questions.map(q => {
            const { correctAnswer, ...rest } = q;
            return rest;
        });

        return <QuizClient quiz={{ ...formById, questions: sanitizedQuestions }} />;
    }

    // Strip correct answers for security
    const sanitizedQuestions = form.questions.map(q => {
        const { correctAnswer, ...rest } = q;
        return rest;
    });

    return <QuizClient quiz={{ ...form, questions: sanitizedQuestions }} />;
}
