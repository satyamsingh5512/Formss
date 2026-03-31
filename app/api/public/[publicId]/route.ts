import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

export const revalidate = 30

const submitSchema = z.object({
  answers: z.record(z.string(), z.any()),
})

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getClientIp(request: NextRequest): string | null {
  const forwardedFor = request.headers.get('x-forwarded-for')
  if (forwardedFor) {
    const firstIp = forwardedFor.split(',')[0]?.trim()
    if (firstIp) {
      return firstIp
    }
  }

  const realIp = request.headers.get('x-real-ip')?.trim()
  if (realIp) {
    return realIp
  }

  return null
}

function getAllowedEmailDomains(settings: unknown): string[] {
  if (!settings || typeof settings !== 'object' || Array.isArray(settings)) {
    return []
  }

  const rawDomains = (settings as { allowedEmailDomains?: unknown }).allowedEmailDomains
  if (!Array.isArray(rawDomains)) {
    return []
  }

  return rawDomains
    .filter((domain): domain is string => typeof domain === 'string')
    .map((domain) => domain.trim().toLowerCase().replace(/^@/, ''))
    .filter(Boolean)
}

function findEmailInAnswers(answers: Record<string, unknown>): string | null {
  for (const value of Object.values(answers)) {
    if (typeof value === 'string' && emailRegex.test(value.trim())) {
      return value.trim().toLowerCase()
    }
  }

  return null
}

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

    // Return the form data - Next.js will handle ISR based on 'revalidate' export
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
    const { answers } = submitSchema.parse(body)
    const clientIp = getClientIp(request)
    const allowedEmailDomains = getAllowedEmailDomains(form.settings)

    if (allowedEmailDomains.length > 0) {
      const submittedEmail = findEmailInAnswers(answers)

      if (!submittedEmail) {
        return NextResponse.json(
          { error: 'A valid email is required for this form' },
          { status: 400 }
        )
      }

      const submittedDomain = submittedEmail.split('@')[1]
      if (!submittedDomain || !allowedEmailDomains.includes(submittedDomain)) {
        return NextResponse.json(
          {
            error: `Only these email domains are allowed: ${allowedEmailDomains.map((domain) => `@${domain}`).join(', ')}`,
          },
          { status: 403 }
        )
      }
    }

    if (clientIp) {
      const existingResponse = await prisma.response.findFirst({
        where: {
          formId: form.id,
          ipAddress: clientIp,
        },
        select: {
          id: true,
        },
      })

      if (existingResponse) {
        return NextResponse.json(
          { error: 'You have already submitted this form from this IP address' },
          { status: 409 }
        )
      }
    }

    const response = await prisma.response.create({
      data: {
        formId: form.id,
        answers,
        metadata: {
          submittedAt: new Date().toISOString(),
        },
        ipAddress: clientIp,
        userAgent: request.headers.get('user-agent'),
      },
    })

    return NextResponse.json({ success: true, responseId: response.id }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid submission payload' }, { status: 400 })
    }
    console.error('Error submitting response:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
