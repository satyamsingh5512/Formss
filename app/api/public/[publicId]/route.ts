import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params
    const form = await prisma.form.findUnique({
      where: {
        publicId,
      },
      include: {
        questions: {
          orderBy: {
            order: 'asc',
          },
        },
      },
    })

    if (!form || !form.isPublished || !form.isActive) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    return NextResponse.json(form)
  } catch (error) {
    console.error('Error fetching public form:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ publicId: string }> }
) {
  try {
    const { publicId } = await params
    const form = await prisma.form.findUnique({
      where: {
        publicId,
      },
    })

    if (!form || !form.isPublished || !form.isActive) {
      return NextResponse.json({ error: 'Form not found' }, { status: 404 })
    }

    const body = await request.json()
    const { answers } = body

    const response = await prisma.response.create({
      data: {
        formId: form.id,
        answers,
        metadata: {
          submittedAt: new Date().toISOString(),
        },
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip'),
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({ success: true, responseId: response.id }, { status: 201 })
  } catch (error) {
    console.error('Error submitting response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
