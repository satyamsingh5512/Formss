import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();

        // In Quizo, options is an array of strings. 
        // In Formlytic, options is Json?

        // body.correctAnswer might be an index (0-3) in Quizo UI.
        // We should clarify how we store it. Prisma schema has `correctAnswer String`.
        // Quizo UI uses radio index.
        // Let's store the index as string "0", "1", etc or the value?
        // Quizo schema was: options: [string], correctAnswer: number (index) based on UI.
        // Let's stick to storing the index as string "0" to match simple logic or just the string value.
        // Quizo UI `updateQuestion(qIndex, 'correctAnswer', oIndex)` stores index (number).
        // I defined `correctAnswer String?` in Prisma. I can store "0".

        const question = await prisma.question.create({
            data: {
                formId: body.quizId,
                type: "multiple_choice", // Defaulting to MC for Quizo
                label: body.question,
                options: body.options, // Prisma Json handles array
                correctAnswer: String(body.correctAnswer), // "0", "1"...
                order: body.order || 0, // Need to handle order
            }
        });

        return NextResponse.json(question);
    } catch (error) {
        console.error('Error creating question:', error);
        return NextResponse.json({ error: 'Failed to create question' }, { status: 500 });
    }
}
