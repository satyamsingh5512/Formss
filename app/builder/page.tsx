'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { QuestionBlock } from '@/components/form-builder/question-block'
import { QuestionTypeSelector } from '@/components/form-builder/question-type-selector'
import { ThemeToggle } from '@/components/theme-toggle'
import { ArrowLeft, Save, Eye, LogIn } from 'lucide-react'
import Link from 'next/link'
import type { Question } from '@/types'

export default function GuestBuilderPage() {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState('Untitled Form')
  const [formDescription, setFormDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: `q-${Date.now()}`,
      type,
      label: '',
      required: false,
      order: questions.length,
      options: type === 'multiple_choice' || type === 'checkboxes' || type === 'dropdown'
        ? { choices: ['Option 1'] }
        : type === 'linear_scale'
        ? { min: 1, max: 5 }
        : undefined,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
  }

  const duplicateQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `q-${Date.now()}`,
        order: questions.length,
      }
      setQuestions([...questions, newQuestion])
    }
  }

  const handlePublish = () => {
    // Save to localStorage for guest users
    const guestForm = {
      title: formTitle,
      description: formDescription,
      questions,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('guestForm', JSON.stringify(guestForm))
    
    // Redirect to sign in with a message
    router.push('/auth/signin?redirect=publish')
  }

  const handlePreview = () => {
    // Save to localStorage
    const guestForm = {
      title: formTitle,
      description: formDescription,
      questions
    }
    localStorage.setItem('guestFormPreview', JSON.stringify(guestForm))
    window.open('/builder/preview', '_blank')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div>
              <h1 className="text-lg font-semibold">Form Builder (Guest Mode)</h1>
              <p className="text-xs text-muted-foreground">Sign in to save and publish</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="outline" size="sm" onClick={handlePreview} disabled={questions.length === 0}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button size="sm" onClick={handlePublish} disabled={questions.length === 0}>
              <LogIn className="h-4 w-4 mr-2" />
              Sign In to Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl mx-auto py-8 px-4 space-y-6">
        {/* Info Banner */}
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <LogIn className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <p className="font-medium">You're in guest mode</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Create your form freely. Sign in when ready to publish and collect responses.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Form Header */}
        <Card>
          <CardHeader>
            <Input
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              className="text-2xl font-bold border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Form Title"
            />
            <Input
              value={formDescription}
              onChange={(e) => setFormDescription(e.target.value)}
              className="text-muted-foreground border-none p-0 h-auto focus-visible:ring-0"
              placeholder="Form description (optional)"
            />
          </CardHeader>
        </Card>

        {/* Questions */}
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  onUpdate={updateQuestion}
                  onDelete={deleteQuestion}
                  onDuplicate={duplicateQuestion}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Question */}
        <QuestionTypeSelector onSelect={addQuestion} />

        {/* Empty State */}
        {questions.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="pt-12 pb-12 text-center">
              <p className="text-muted-foreground mb-4">No questions yet. Add your first question to get started.</p>
              <p className="text-sm text-muted-foreground">Click the button above to add a question</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
