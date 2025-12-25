import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json([]);
        }

        const quizzes = await prisma.form.findMany({
            where: {
                creatorId: user.id,
                isQuiz: true
            },
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                _count: {
                    select: { questions: true } // Formlytic doesn't track participantCount in Form model yet
                }
            }
        });

        return NextResponse.json(quizzes);
    } catch (error) {
        console.error('Error fetching my-quizzes:', error);
        return NextResponse.json({ error: 'Failed to fetch quizzes' }, { status: 500 });
    }
}
