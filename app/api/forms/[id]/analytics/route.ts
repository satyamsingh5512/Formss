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

    const questions = await prisma.question.findMany({
      where: {
        formId: params.id,
      },
      orderBy: {
        order: 'asc',
      },
    })

    // Calculate analytics
    const totalResponses = responses.length
    const lastResponse = responses[0]?.createdAt || null

    // Per-question analytics
    const questionAnalytics = questions.map((question) => {
      const answers = responses
        .map((r) => {
          if (!r.answers || typeof r.answers !== 'object') return null
          return (r.answers as Record<string, any>)[question.id]
        })
        .filter(Boolean)

      if (question.type === 'multiple_choice' || question.type === 'dropdown') {
        const counts: Record<string, number> = {}
        answers.forEach((answer) => {
          counts[answer as string] = (counts[answer as string] || 0) + 1
        })
        return {
          questionId: question.id,
          label: question.label,
          type: question.type,
          totalAnswers: answers.length,
          data: Object.entries(counts).map(([label, count]) => ({
            label,
            count,
            percentage: (count / answers.length) * 100,
          })),
        }
      }

      if (question.type === 'checkboxes') {
        const counts: Record<string, number> = {}
        answers.forEach((answer) => {
          if (Array.isArray(answer)) {
            answer.forEach((item) => {
              counts[item] = (counts[item] || 0) + 1
            })
          }
        })
        return {
          questionId: question.id,
          label: question.label,
          type: question.type,
          totalAnswers: answers.length,
          data: Object.entries(counts).map(([label, count]) => ({
            label,
            count,
            percentage: (count / answers.length) * 100,
          })),
        }
      }

      if (question.type === 'linear_scale') {
        const counts: Record<string, number> = {}
        answers.forEach((answer) => {
          counts[answer as string] = (counts[answer as string] || 0) + 1
        })
        const average =
          answers.length > 0
            ? answers.reduce((sum, val) => sum + Number(val), 0) / answers.length
            : 0
        return {
          questionId: question.id,
          label: question.label,
          type: question.type,
          totalAnswers: answers.length,
          average,
          data: Object.entries(counts).map(([label, count]) => ({
            label,
            count,
            percentage: (count / answers.length) * 100,
          })),
        }
      }

      return {
        questionId: question.id,
        label: question.label,
        type: question.type,
        totalAnswers: answers.length,
        data: [],
      }
    })

    return NextResponse.json({
      overview: {
        totalResponses,
        lastResponse,
      },
      questions: questionAnalytics,
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
