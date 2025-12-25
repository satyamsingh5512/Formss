import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { formId, answers, timeTaken, participantInfo } = body;

        if (!formId || !answers) {
            return NextResponse.json({ error: 'Missing formId or answers' }, { status: 400 });
        }

        // Fetch form and questions
        const form = await prisma.form.findUnique({
            where: { id: formId },
            include: {
                questions: {
                    orderBy: { order: 'asc' }
                }
            }
        });

        if (!form) {
            return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
        }

        let score = 0;
        let maxScore = 0;
        const results: Record<string, { correct: boolean; correctAnswer: string }> = {};

        // Calculate score
        form.questions.forEach((question) => {
            const questionId = question.id;
            const userAnswer = answers[questionId];
            const correctAnswer = question.correctAnswer;
            const points = question.points || 1;

            if (question.type === 'multiple_choice' || question.type === 'text') { // Add other types if needed
                maxScore += points;

                const isCorrect = userAnswer === correctAnswer;
                if (isCorrect) {
                    score += points;
                }

                results[questionId] = {
                    correct: isCorrect,
                    correctAnswer: correctAnswer || 'N/A' // Return correct answer for review
                };
            }
        });

        // Save response
        const responseReference = await prisma.response.create({
            data: {
                formId: formId,
                answers: answers, // Store raw answers
                metadata: participantInfo || {}, // e.g. { name: "John" }
                isQuizAttempt: true,
                score: score,
                maxScore: maxScore,
                timeTaken: timeTaken || 0,
                completedAt: new Date()
            }
        });

        return NextResponse.json({
            success: true,
            score,
            maxScore,
            responseId: responseReference.id,
            results // Send back which were correct/incorrect and the right answers
        });

    } catch (error) {
        console.error('Error submitting quiz:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
