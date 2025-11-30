'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { QUESTION_TYPES } from '@/lib/constants'
import type { Question } from '@/types'

interface GuestForm {
  title: string
  description: string
  questions: Question[]
}

export default function PreviewPage() {
  const [form, setForm] = useState<GuestForm | null>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})

  useEffect(() => {
    const stored = localStorage.getItem('guestFormPreview')
    if (stored) {
      setForm(JSON.parse(stored))
    }
  }, [])

  const renderQuestion = (question: Question) => {
    const value = answers[question.id]

    switch (question.type) {
      case QUESTION_TYPES.SHORT_TEXT:
        return (
          <Input
            placeholder="Your answer"
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
          />
        )

      case QUESTION_TYPES.LONG_TEXT:
        return (
          <Textarea
            placeholder="Your answer"
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
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
                  id={`${question.id}-${index}`}
                  checked={value?.includes(choice)}
                  onCheckedChange={(checked) => {
                    const current = value || []
                    const updated = checked
                      ? [...current, choice]
                      : current.filter((c: string) => c !== choice)
                    setAnswers({ ...answers, [question.id]: updated })
                  }}
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
          <Select value={value} onValueChange={(val) => setAnswers({ ...answers, [question.id]: val })}>
            <SelectTrigger>
              <SelectValue placeholder="Select an option" />
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
          </div>
        )

      default:
        return null
    }
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Loading preview...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-12 px-4">
      <div className="container max-w-3xl mx-auto space-y-6">
        <Card className="shadow-lg">
          <CardHeader className="space-y-3 pb-8">
            <CardTitle className="text-3xl">{form.title}</CardTitle>
            {form.description && (
              <CardDescription className="text-base">{form.description}</CardDescription>
            )}
            <div className="pt-2 px-4 py-2 bg-muted/50 rounded-md border">
              <p className="text-sm text-muted-foreground">
                ✨ This is a preview. Responses won't be saved.
              </p>
            </div>
          </CardHeader>
        </Card>

        {form.questions.map((question, index) => (
          <Card key={question.id} className="shadow-sm">
            <CardContent className="pt-6 space-y-4">
              <div className="space-y-2">
                <Label className="text-base font-medium">
                  {index + 1}. {question.label || 'Untitled Question'}
                  {question.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
              </div>
              {renderQuestion(question)}
            </CardContent>
          </Card>
        ))}

        <Card className="shadow-sm">
          <CardContent className="pt-6">
            <Button disabled className="w-full">
              Preview Mode - Sign in to collect real responses
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
