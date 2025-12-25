'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DndContext, closestCenter, DragEndEvent, DragOverlay, useSensor, useSensors, PointerSensor } from '@dnd-kit/core'
import { arrayMove, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { QuestionBlock } from '@/components/form-builder/question-block'
import { QuestionTypeSelector } from '@/components/form-builder/question-type-selector'
import { ArrowLeft, Eye, Crown, Rocket } from 'lucide-react'
import Link from 'next/link'
import type { Question } from '@/types'
import { motion, AnimatePresence } from 'framer-motion'

export default function GuestBuilderPage() {
  const router = useRouter()
  const [formTitle, setFormTitle] = useState('Untitled Form')
  const [formDescription, setFormDescription] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  )

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id)
  }

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveId(null)
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
      formId: 'guest-form',
      type,
      label: '',
      required: false,
      order: questions.length,
      createdAt: new Date(),
      updatedAt: new Date(),
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
    const guestForm = {
      title: formTitle,
      description: formDescription,
      questions,
      createdAt: new Date().toISOString()
    }
    localStorage.setItem('guestForm', JSON.stringify(guestForm))
    router.push('/auth/signin?redirect=publish')
  }

  const handlePreview = () => {
    const guestForm = {
      title: formTitle,
      description: formDescription,
      questions
    }
    localStorage.setItem('guestFormPreview', JSON.stringify(guestForm))
    window.open('/builder/preview', '_blank')
  }

  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950 text-black dark:text-white transition-colors duration-300">

      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 border-b-2 border-black dark:border-white/20 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md"
      >
        <div className="container flex h-16 items-center justify-between px-4 max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="icon" className="text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold flex items-center gap-2">
                Guest Mode
                <span className="px-2 py-0.5 rounded-full bg-black dark:bg-white text-white dark:text-black text-[10px] font-black tracking-wider uppercase">
                  Builder
                </span>
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePreview}
              disabled={questions.length === 0}
              className="hidden sm:flex border-2 border-black dark:border-white/20 hover:bg-black/5 hover:text-black dark:hover:text-white text-zinc-600 dark:text-zinc-400 font-bold"
            >
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              disabled={questions.length === 0}
              className="neo-button-primary rounded-lg text-sm"
            >
              <Rocket className="h-4 w-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </motion.header>

      <div className="container max-w-3xl mx-auto py-12 px-4 space-y-8 relative z-10 pb-32">
        {/* Info Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="neo-card bg-indigo-50 dark:bg-indigo-950/30 border-2 border-black dark:border-indigo-500/30 shadow-neo-sm">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-black dark:bg-indigo-500 text-white">
                <Crown className="h-5 w-5" />
              </div>
              <div>
                <h3 className="font-bold text-black dark:text-white mb-1">Start building for free</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed font-medium">
                  Design your perfect form below. When you're ready to collect responses and unlock analytics, simply sign in to publish.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Form Header */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="neo-card border-t-[8px] border-t-black dark:border-t-white relative group">
            <div className="space-y-4">
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                className="text-3xl md:text-4xl font-black bg-transparent border-none p-0 h-auto focus-visible:ring-0 placeholder:text-zinc-400 text-black dark:text-white selection:bg-indigo-500/30"
                placeholder="Untitled Form"
              />
              <Input
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                className="text-zinc-500 dark:text-zinc-400 bg-transparent border-none p-0 h-auto focus-visible:ring-0 text-base placeholder:text-zinc-400 font-medium"
                placeholder="Form description"
              />
            </div>
            {/* Sticker */}
            <div className="absolute -top-6 -right-6 rotate-12 bg-yellow-300 border-2 border-black px-3 py-1 text-xs font-black shadow-neo-sm">
              DRAFT
            </div>
          </div>
        </motion.div>

        {/* Questions */}
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            <div className="space-y-6">
              <AnimatePresence>
                {questions.map((question) => (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                  >
                    <QuestionBlock
                      question={question}
                      onUpdate={updateQuestion}
                      onDelete={deleteQuestion}
                      onDuplicate={duplicateQuestion}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </SortableContext>

          <DragOverlay>
            {activeId ? (
              <div className="opacity-90 rotate-2 cursor-grabbing">
                <QuestionBlock
                  question={questions.find(q => q.id === activeId)!}
                  onUpdate={() => { }}
                  onDelete={() => { }}
                  onDuplicate={() => { }}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>

        {/* Add Question */}
        <QuestionTypeSelector onSelect={addQuestion} />

        {/* Empty State */}
        {questions.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 rounded-xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center mx-auto mb-4 border-2 border-black dark:border-white/20 shadow-neo-sm">
              <Rocket className="h-8 w-8 text-black dark:text-white" />
            </div>
            <p className="text-zinc-500 dark:text-zinc-400 mb-2 font-bold">Your form is empty</p>
            <p className="text-sm text-zinc-600 dark:text-zinc-500 font-medium">Add a question to get started</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
