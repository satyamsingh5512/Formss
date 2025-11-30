'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { QUESTION_TYPES } from '@/lib/constants'

export default function PublicFormPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const publicId = params.publicFormId as string

  const [form, setForm] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    fetchForm()
  }, [publicId])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/public/${publicId}`)
      if (!response.ok) throw new Error('Form not found')
      const data = await response.json()
      setForm(data)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Form not found or unavailable',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate required fields
    const missingFields = form.questions
      .filter((q: any) => q.required && !answers[q.id])
      .map((q: any) => q.label)

    if (missingFields.length > 0) {
      toast({
        title: 'Missing required fields',
        description: `Please fill in: ${missingFields.join(', ')}`,
        variant: 'destructive',
      })
      return
    }

    setSubmitting(true)
    try {
      const response = await fetch(`/api/public/${publicId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answers }),
      })

      if (!response.ok) throw new Error('Submission failed')

      setSubmitted(true)
      toast({
        title: 'Success',
        description: 'Your response has been recorded',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit form',
        variant: 'destructive',
      })
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question: any) => {
    const value = answers[question.id]

    switch (question.type) {
      case QUESTION_TYPES.SHORT_TEXT:
        return (
          <Input
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder="Your answer"
          />
        )

      case QUESTION_TYPES.LONG_TEXT:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder="Your answer"
            rows={4}
          />
        )

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <RadioGroup
            value={value}
            onValueChange={(val: string) => setAnswers({ ...answers, [question.id]: val })}
          >
            {question.options?.choices?.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={choice} id={`${question.id}-${index}`} />
                <Label htmlFor={`${question.id}-${index}`} className="font-normal">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case QUESTION_TYPES.CHECKBOXES:
        return (
          <div className="space-y-2">
            {question.options?.choices?.map((choice: string, index: number) => (
              <div key={index} className="flex items-center space-x-2">
                <Checkbox
                  checked={(value || []).includes(choice)}
                  onCheckedChange={(checked) => {
                    const current = value || []
                    const updated = checked
                      ? [...current, choice]
                      : current.filter((c: string) => c !== choice)
                    setAnswers({ ...answers, [question.id]: updated })
                  }}
                  id={`${question.id}-${index}`}
                />
                <Label htmlFor={`${question.id}-${index}`} className="font-normal">
                  {choice}
                </Label>
              </div>
            ))}
          </div>
        )

      case QUESTION_TYPES.DROPDOWN:
        return (
          <Select
            value={value}
            onValueChange={(val) => setAnswers({ ...answers, [question.id]: val })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent>
              {question.options?.choices?.map((choice: string, index: number) => (
                <SelectItem key={index} value={choice}>
                  {choice}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )

      case QUESTION_TYPES.LINEAR_SCALE:
        const min = question.options?.min || 1
        const max = question.options?.max || 10
        return (
          <div className="space-y-3">
            <RadioGroup
              value={value?.toString()}
              onValueChange={(val: string) => setAnswers({ ...answers, [question.id]: parseInt(val) })}
              className="flex gap-2"
            >
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
                <div key={num} className="flex flex-col items-center">
                  <RadioGroupItem value={num.toString()} id={`${question.id}-${num}`} />
                  <Label htmlFor={`${question.id}-${num}`} className="text-xs mt-1">
                    {num}
                  </Label>
                </div>
              ))}
            </RadioGroup>
            {(question.options?.minLabel || question.options?.maxLabel) && (
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{question.options?.minLabel}</span>
                <span>{question.options?.maxLabel}</span>
              </div>
            )}
          </div>
        )

      case QUESTION_TYPES.DATE:
        return (
          <Input
            type="date"
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
          />
        )

      case QUESTION_TYPES.TIME:
        return (
          <Input
            type="time"
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
          />
        )

      case QUESTION_TYPES.SECTION_BREAK:
        return <div className="border-t-2 my-4"></div>

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-pulse">Loading...</div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
          <p className="text-muted-foreground">This form is unavailable or has been deleted.</p>
        </Card>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-secondary-50">
        <Card className="p-12 text-center max-w-md">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
          <p className="text-muted-foreground">
            {form.settings?.confirmationMessage || 'Your response has been recorded.'}
          </p>
        </Card>
      </div>
    )
  }

  return (
    <div 
      className="min-h-screen py-12 px-4"
      style={{
        background: form.headerColor 
          ? `linear-gradient(135deg, ${form.headerColor}15 0%, transparent 50%), linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--muted)/30) 100%)`
          : 'linear-gradient(to bottom, hsl(var(--background)) 0%, hsl(var(--muted)/30) 100%)'
      }}
    >
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Branded Header */}
        {(form.logoUrl || form.organizationName) && (
          <Card className="shadow-sm">
            <CardContent className="pt-8 pb-8">
              <div className="flex flex-col items-center justify-center gap-3">
                {form.logoUrl && (
                  <img
                    src={form.logoUrl}
                    alt="Organization Logo"
                    className="h-16 w-auto object-contain"
                  />
                )}
                {form.organizationName && (
                  <h3 className="text-xl font-semibold text-center">{form.organizationName}</h3>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress Bar */}
        {form.showProgress && (
          <div className="bg-card rounded-full h-2 overflow-hidden border shadow-sm">
            <div
              className="h-full transition-all duration-300"
              style={{
                width: `${(Object.keys(answers).length / form.questions.length) * 100}%`,
                backgroundColor: form.headerColor || '#2563EB'
              }}
            />
          </div>
        )}

        {/* Form Header */}
        <Card 
          className="mb-6 p-8 shadow-lg" 
          style={{ 
            borderTop: form.headerColor ? `4px solid ${form.headerColor}` : '4px solid #2563EB'
          }}
        >
          <h1 className="text-3xl font-bold mb-2">{form.title}</h1>
          {form.description && (
            <p className="text-muted-foreground">{form.description}</p>
          )}
        </Card>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {form.questions.map((question: any, index: number) => (
            <Card key={question.id} className="p-6">
              <CardContent className="p-0">
                <Label className="text-base font-medium mb-3 block">
                  {index + 1}. {question.label}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                {question.description && (
                  <p className="text-sm text-muted-foreground mb-3">{question.description}</p>
                )}
                {renderQuestion(question)}
              </CardContent>
            </Card>
          ))}

          {/* Submit */}
          <Card className="p-6">
            <Button type="submit" disabled={submitting} size="lg" className="w-full md:w-auto">
              {submitting ? 'Submitting...' : 'Submit'}
            </Button>
          </Card>
        </form>
      </div>
    </div>
  )
}
