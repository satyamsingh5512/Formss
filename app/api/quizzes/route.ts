import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth'; // Ensure this path is correct for Formlytic
import { prisma } from '@/lib/prisma'; // Standard prisma import

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // Get user from database to ensure existence (optional, but good practice)
        const user = await prisma.user.findUnique({
            where: { email: session.user.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const quiz = await prisma.form.create({
            data: {
                title: body.title,
                description: body.description,
                creatorId: user.id,
                isQuiz: true,
                isActive: true,
                accessCode: body.accessCode, // Unique constraint handle?
                timerType: body.timerType,
                timeLimit: body.timeLimit,
                perQuestionTime: body.perQuestionTime,
                allowSkip: body.allowSkip,
                organizationName: body.college || '', // Mapping college to org
                // clubName: body.clubName // If I want to verify I added this field or use settings json
            }
        });

        return NextResponse.json(quiz);
    } catch (error) {
        console.error('Error creating quiz:', error);
        return NextResponse.json({ error: 'Failed to create quiz' }, { status: 500 });
    }
}
