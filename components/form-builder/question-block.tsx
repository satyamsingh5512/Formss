'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { GripVertical, Copy, Trash2, Plus, X, UploadCloud, Calendar, Clock, Type, List, CheckSquare, AlignLeft, ChevronDown } from 'lucide-react'
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/lib/constants'
import type { Question } from '@/types'
import { cn } from '@/lib/utils'

interface QuestionBlockProps {
  question: Question
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

const QuestionTypeIcon = ({ type }: { type: string }) => {
  switch (type) {
    case QUESTION_TYPES.SHORT_TEXT: return <Type className="h-4 w-4" />
    case QUESTION_TYPES.LONG_TEXT: return <AlignLeft className="h-4 w-4" />
    case QUESTION_TYPES.MULTIPLE_CHOICE: return <List className="h-4 w-4" />
    case QUESTION_TYPES.CHECKBOXES: return <CheckSquare className="h-4 w-4" />
    case QUESTION_TYPES.DROPDOWN: return <ChevronDown className="h-4 w-4" />
    case QUESTION_TYPES.FILE_UPLOAD: return <UploadCloud className="h-4 w-4" />
    case QUESTION_TYPES.DATE: return <Calendar className="h-4 w-4" />
    case QUESTION_TYPES.TIME: return <Clock className="h-4 w-4" />
    default: return <Type className="h-4 w-4" />
  }
}

export function QuestionBlock({ question, onUpdate, onDuplicate, onDelete }: QuestionBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : 1,
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case QUESTION_TYPES.SHORT_TEXT:
        return <Input disabled placeholder="Short answer text" className="bg-zinc-100 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 text-zinc-500 max-w-md rounded-lg" />

      case QUESTION_TYPES.LONG_TEXT:
        return <Textarea disabled placeholder="Long answer text" rows={3} className="bg-zinc-100 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 text-zinc-500 resize-none rounded-lg" />

      case QUESTION_TYPES.MULTIPLE_CHOICE:
      case QUESTION_TYPES.CHECKBOXES:
      case QUESTION_TYPES.DROPDOWN:
        const choices = question.options?.choices || []
        return (
          <div className="space-y-3">
            {choices.map((choice: string, index: number) => (
              <div key={index} className="flex items-center gap-3 group/option">
                <div className={cn(
                  "w-4 h-4 rounded-full border-2 border-zinc-400 mt-1 flex-shrink-0 cursor-not-allowed",
                  question.type === QUESTION_TYPES.CHECKBOXES && "rounded-sm"
                )}></div>
                <Input
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...choices]
                    newChoices[index] = e.target.value
                    onUpdate(question.id, { options: { ...question.options, choices: newChoices } })
                  }}
                  className="flex-1 bg-transparent border-transparent hover:border-black/10 dark:hover:border-white/10 focus:bg-white dark:focus:bg-white/5 focus:border-black dark:focus:border-white transition-all h-9 rounded-lg"
                  placeholder={`Option ${index + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover/option:opacity-100 h-8 w-8 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all rounded-lg"
                  disabled={choices.length <= 1}
                  onClick={() => {
                    if (choices.length <= 1) return
                    const newChoices = choices.filter((_: any, i: number) => i !== index)
                    onUpdate(question.id, { options: { ...question.options, choices: newChoices } })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                const newChoices = [...choices, `Option ${choices.length + 1}`]
                onUpdate(question.id, { options: { ...question.options, choices: newChoices } })
              }}
              className="ml-7 text-black dark:text-white font-bold hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )

      case QUESTION_TYPES.LINEAR_SCALE:
        return (
          <div className="space-y-4 pt-2">
            <div className="flex items-center gap-4">
              <Select
                value={String(question.options?.min || 1)}
                onValueChange={(val) => onUpdate(question.id, { options: { ...question.options, min: parseInt(val) } })}
              >
                <SelectTrigger className="w-20 bg-white dark:bg-white/5 border-2 border-black dark:border-white/20 text-black dark:text-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">0</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-zinc-500 font-bold text-sm">to</span>
              <Select
                value={String(question.options?.max || 5)}
                onValueChange={(val) => onUpdate(question.id, { options: { ...question.options, max: parseInt(val) } })}
              >
                <SelectTrigger className="w-20 bg-white dark:bg-white/5 border-2 border-black dark:border-white/20 text-black dark:text-white rounded-lg">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <SelectItem key={num} value={String(num)}>{num}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-zinc-500 w-8 text-right">{question.options?.min || 1}</span>
              <Input
                placeholder="Label (optional)"
                value={question.options?.minLabel || ''}
                onChange={(e) => onUpdate(question.id, { options: { ...question.options, minLabel: e.target.value } })}
                className="max-w-[150px] h-8 text-xs bg-transparent border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white rounded-lg"
              />
            </div>
            <div className="flex gap-4 items-center">
              <span className="text-xs font-bold text-zinc-500 w-8 text-right">{question.options?.max || 5}</span>
              <Input
                placeholder="Label (optional)"
                value={question.options?.maxLabel || ''}
                onChange={(e) => onUpdate(question.id, { options: { ...question.options, maxLabel: e.target.value } })}
                className="max-w-[150px] h-8 text-xs bg-transparent border-black/10 dark:border-white/10 focus:border-black dark:focus:border-white rounded-lg"
              />
            </div>
          </div>
        )

      case QUESTION_TYPES.DATE:
        return (
          <div className="relative max-w-[180px]">
            <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input disabled placeholder="Select date" className="pl-9 bg-zinc-100 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 text-zinc-400 rounded-lg" />
          </div>
        )

      case QUESTION_TYPES.TIME:
        return (
          <div className="relative max-w-[150px]">
            <Clock className="absolute left-3 top-2.5 h-4 w-4 text-zinc-400" />
            <Input disabled placeholder="Select time" className="pl-9 bg-zinc-100 dark:bg-white/5 border-2 border-black/10 dark:border-white/10 text-zinc-400 rounded-lg" />
          </div>
        )

      case QUESTION_TYPES.FILE_UPLOAD:
        return (
          <div className="border-2 border-dashed border-black/10 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center text-zinc-400 bg-zinc-50 dark:bg-white/5">
            <UploadCloud className="h-8 w-8 mb-2 opacity-50" />
            <p className="text-xs font-bold">File upload preview</p>
          </div>
        )

      case QUESTION_TYPES.SECTION_BREAK:
        return <div className="h-0.5 bg-black/10 dark:bg-white/10 my-4 w-full"></div>

      default:
        return null
    }
  }

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative transition-all duration-300 group border-2 border-black dark:border-white/20",
        isDragging ? "shadow-neo-lg scale-[1.02] bg-white dark:bg-zinc-900 z-50" : "bg-white dark:bg-zinc-900 hover:shadow-neo dark:shadow-none"
      )}
    >
      {/* Drag Handle Overlay */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-0 left-0 w-full h-6 flex justify-center cursor-grab active:cursor-grabbing hover:bg-zinc-100 dark:hover:bg-white/5 transition-colors -mt-3 pt-3 opacity-0 group-hover:opacity-100 z-10"
      >
        <GripVertical className="h-4 w-4 text-zinc-400 rotate-90" />
      </div>

      <div className="p-6 pt-8 flex gap-5">
        <div className="flex-1 space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start">
            <Input
              value={question.label}
              onChange={(e) => onUpdate(question.id, { label: e.target.value })}
              placeholder="Question Text"
              className="text-lg font-bold border-0 border-b-2 border-transparent bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white w-full md:w-3/5 transition-colors placeholder:text-zinc-400 text-black dark:text-white"
            />

            <Select
              value={question.type}
              onValueChange={(value) => onUpdate(question.id, { type: value })}
            >
              <SelectTrigger className="w-full md:w-[220px] bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white h-10 rounded-lg font-bold">
                <div className="flex items-center gap-2">
                  <QuestionTypeIcon type={question.type} />
                  <SelectValue />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-white/20 text-black dark:text-white shadow-neo">
                {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black font-medium">
                    <div className="flex items-center gap-2">
                      <QuestionTypeIcon type={key} />
                      {label}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {(question.description !== undefined || question.label.length > 0) && (
            <Input
              value={question.description || ''}
              onChange={(e) => onUpdate(question.id, { description: e.target.value })}
              placeholder="Description (optional)"
              className="text-sm text-zinc-500 border-0 border-b border-transparent bg-transparent rounded-none px-0 focus-visible:ring-0 focus-visible:border-black/50 dark:focus-visible:border-white/50 h-8 placeholder:text-zinc-400"
            />
          )}

          <div className="pt-2">
            {renderQuestionInput()}
          </div>

          <div className="flex items-center justify-end pt-4 border-t-2 border-black/5 dark:border-white/5 gap-4">
            <div className="flex items-center gap-2 border-r-2 border-black/5 dark:border-white/5 pr-4 mr-2">
              <Label className="text-xs font-bold text-zinc-500 cursor-pointer" htmlFor={`req-${question.id}`}>Required</Label>
              <Switch
                id={`req-${question.id}`}
                checked={question.required}
                onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
                className="data-[state=checked]:bg-black dark:data-[state=checked]:bg-white"
              />
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDuplicate(question.id)}
              className="text-zinc-400 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-white/10 h-8 w-8 rounded-lg"
              title="Duplicate"
            >
              <Copy className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onDelete(question.id)}
              className="text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 h-8 w-8 rounded-lg"
              title="Delete"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}
