import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Attempt a simple query
        const userCount = await prisma.user.count();
        return NextResponse.json({
            status: 'ok',
            message: 'Database connected successfully',
            userCount,
            env_db_url_exists: !!process.env.DATABASE_URL
        });
    } catch (error: any) {
        console.error('Database Connection Error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Failed to connect to database',
            error: error.message,
            stack: error.stack
        }, { status: 500 });
    }
}
