'use client'

import { useEffect, useState, useCallback } from 'react'
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
import { ArrowLeft, Eye, Save, Share2, Crown } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'
import type { Question } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

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

  const fetchForm = useCallback(async () => {
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
  }, [formId, toast])

  useEffect(() => {
    fetchForm()
  }, [fetchForm])

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
      <div className="p-8 flex items-center justify-center min-h-screen bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="font-bold text-zinc-500">Loading Builder...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white pb-32 transition-colors duration-300">

      {/* Top Navigation Bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b-2 border-black dark:border-white/20 px-6 h-16 flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <button className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-colors border-2 border-transparent hover:border-black dark:hover:border-white/20">
              <ArrowLeft className="h-5 w-5" />
            </button>
          </Link>
          <div className="h-6 w-0.5 bg-zinc-300 dark:bg-zinc-800" />
          <h1 className="font-bold text-lg hidden sm:block">Form Builder</h1>
          <span className="px-2 py-0.5 rounded text-xs font-black bg-yellow-300 text-black border-2 border-black shadow-neo-sm transform rotate-2">
            PRO
          </span>
        </div>

        <div className="flex items-center gap-3">
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

          <button
            onClick={saveForm}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white font-bold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : 'Save'}
          </button>

          <Link href={`/form/${form?.publicId}`} target="_blank">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white font-bold rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              <Eye className="h-4 w-4" />
              Preview
            </button>
          </Link>

          <button
            onClick={publishForm}
            className="neo-button-primary flex items-center gap-2 rounded-lg"
          >
            <Share2 className="h-4 w-4" />
            Publish
          </button>
        </div>
      </motion.header>

      <div className="max-w-3xl mx-auto px-4 py-10 space-y-8">

        {/* Form Title Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="neo-card bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-8 shadow-neo group relative overflow-visible">
            <div className="space-y-4">
              <Input
                className="text-3xl md:text-4xl font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-zinc-400 text-black dark:text-white selection:bg-indigo-500/30"
                placeholder="Form Title"
                value={form?.title || ''}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <Textarea
                className="text-zinc-600 dark:text-zinc-400 bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-base placeholder:text-zinc-400 font-medium resize-none"
                placeholder="Form description..."
                value={form?.description || ''}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
              />
            </div>
            {/* Decorative Elements */}
            <div className="absolute -top-3 -left-3 w-6 h-6 bg-black dark:bg-white rounded-full border-2 border-black dark:border-white/20 z-10" />
            <div className="absolute -bottom-3 -right-3 w-6 h-6 bg-black dark:bg-white rounded-full border-2 border-black dark:border-white/20 z-10" />
          </div>
        </motion.div>

        {/* Questions List */}
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              <AnimatePresence>
                {questions.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                  >
                    <QuestionBlock
                      question={question}
                      onUpdate={updateQuestion}
                      onDuplicate={duplicateQuestion}
                      onDelete={deleteQuestion}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>
        </DndContext>

        {/* Add Question FAB / Area */}
        <div className="pt-4">
          <QuestionTypeSelector onSelect={addQuestion} />
        </div>
      </div>
    </div>
  )
}
