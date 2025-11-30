import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await prisma.form.findFirst({
      where: {
        id: params.id,
        creatorId: session.user.id,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const responses = await prisma.response.findMany({
      where: {
        formId: params.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    // Generate CSV
    const headers = ['Response ID', 'Submitted At', ...form.questions.map((q) => q.label)]
    const rows = responses.map((response) => [
      response.id,
      new Date(response.createdAt).toISOString(),
      ...form.questions.map((q) => {
        if (!response.answers || typeof response.answers !== 'object') return ''
        const answer = (response.answers as Record<string, any>)[q.id]
        if (Array.isArray(answer)) {
          return answer.join(', ')
        }
        return answer?.toString() || ''
      }),
    ])

    const csv = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n')

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="form-${params.id}-responses.csv"`,
      },
    })
  } catch (error) {
    console.error('Error exporting responses:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
