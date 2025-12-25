import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const questionSchema = z.object({
  type: z.string(),
  label: z.string().min(1),
  description: z.string().optional(),
  required: z.boolean().default(false),
  options: z.any().optional(),
  validation: z.any().optional(),
  order: z.number(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await prisma.form.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const body = await request.json()
    const validatedData = questionSchema.parse(body)

    const question = await prisma.question.create({
      data: {
        ...validatedData,
        formId: id,
      },
    })

    return NextResponse.json(question, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error creating question:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const form = await prisma.form.findFirst({
      where: {
        id,
        creatorId: session.user.id,
      },
    })

    if (!form) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const body = await request.json()
    const questions = z.array(questionSchema.extend({ id: z.string().optional() })).parse(body)

    // Use a transaction for atomic delete + create (much faster)
    const result = await prisma.$transaction(async (tx) => {
      // Delete all existing questions in one operation
      await tx.question.deleteMany({
        where: { formId: id },
      })

      // Create all new questions in one batch operation
      // Note: MongoDB doesn't support createMany with return, so we use a workaround
      const createdQuestions = await Promise.all(
        questions.map((q, index) =>
          tx.question.create({
            data: {
              type: q.type,
              label: q.label,
              description: q.description,
              required: q.required,
              options: q.options,
              validation: q.validation,
              order: index,
              formId: id,
            },
          })
        )
      )

      return createdQuestions
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    console.error('Error updating questions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

