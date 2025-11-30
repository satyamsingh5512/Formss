'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { QuestionBlock } from '@/components/form-builder/question-block'
import { QuestionTypeSelector } from '@/components/form-builder/question-type-selector'
import { FormSettings } from '@/components/form-settings'
import { QUESTION_TYPES } from '@/lib/constants'
import { ArrowLeft, Eye, Save, Share2 } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import type { Question } from '@/types'

export default function FormBuilderPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const formId = params.formId as string

  const [form, setForm] = useState<any>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  useEffect(() => {
    fetchForm()
  }, [formId])

  const fetchForm = async () => {
    try {
      const response = await fetch(`/api/forms/${formId}`)
      const data = await response.json()
      setForm(data)
      setQuestions(data.questions || [])
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load form',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setQuestions((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id)
        const newIndex = items.findIndex((item) => item.id === over.id)
        const newOrder = arrayMove(items, oldIndex, newIndex)
        return newOrder.map((q, index) => ({ ...q, order: index }))
      })
    }
  }

  const addQuestion = (type: string) => {
    const newQuestion: any = {
      id: `temp-${Date.now()}`,
      type,
      label: 'New Question',
      required: false,
      order: questions.length,
      options: type === QUESTION_TYPES.MULTIPLE_CHOICE || 
                type === QUESTION_TYPES.CHECKBOXES || 
                type === QUESTION_TYPES.DROPDOWN
        ? { choices: ['Option 1', 'Option 2'] }
        : type === QUESTION_TYPES.LINEAR_SCALE
        ? { min: 1, max: 10, minLabel: '', maxLabel: '' }
        : null,
    }
    setQuestions([...questions, newQuestion])
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const duplicateQuestion = (id: string) => {
    const question = questions.find((q) => q.id === id)
    if (question) {
      const newQuestion = {
        ...question,
        id: `temp-${Date.now()}`,
        order: questions.length,
      }
      setQuestions([...questions, newQuestion])
    }
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id).map((q, index) => ({ ...q, order: index })))
  }

  const saveForm = async () => {
    setSaving(true)
    try {
      await fetch(`/api/forms/${formId}/questions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(questions),
      })
      toast({
        title: 'Saved',
        description: 'Form saved successfully',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to save form',
        variant: 'destructive',
      })
    } finally {
      setSaving(false)
    }
  }

  const publishForm = async () => {
    await saveForm()
    try {
      await fetch(`/api/forms/${formId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isPublished: true }),
      })
      toast({
        title: 'Published',
        description: 'Form is now live',
      })
      fetchForm()
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to publish form',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-12 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <div className="flex gap-2">
            <FormSettings
              formId={formId}
              settings={{
                logoUrl: form?.logoUrl,
                organizationName: form?.organizationName,
                headerColor: form?.headerColor,
                allowMultiple: form?.allowMultiple,
                showProgress: form?.showProgress,
                shuffleQuestions: form?.shuffleQuestions,
              }}
              onUpdate={(settings) => setForm({ ...form, ...settings })}
            />
            <Button variant="outline" onClick={saveForm} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
            <Link href={`/form/${form?.publicId}`} target="_blank">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            </Link>
            <Button onClick={publishForm}>
              <Share2 className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Form Header */}
        <Card className="p-8 mb-6">
          <Input
            className="text-3xl font-bold border-none focus:ring-0 p-0 mb-4"
            placeholder="Form Title"
            value={form?.title || ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <Textarea
            className="border-none focus:ring-0 p-0 resize-none"
            placeholder="Form description..."
            value={form?.description || ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={2}
          />
        </Card>

        {/* Questions */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-4">
              {questions.map((question) => (
                <QuestionBlock
                  key={question.id}
                  question={question}
                  onUpdate={updateQuestion}
                  onDuplicate={duplicateQuestion}
                  onDelete={deleteQuestion}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Question */}
        <QuestionTypeSelector onSelect={addQuestion} />
      </div>
    </div>
  )
}
