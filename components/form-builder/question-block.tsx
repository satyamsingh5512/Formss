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
import { GripVertical, Copy, Trash2, Plus, X } from 'lucide-react'
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/lib/constants'
import type { Question } from '@/types'

interface QuestionBlockProps {
  question: Question
  onUpdate: (id: string, updates: Partial<Question>) => void
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

export function QuestionBlock({ question, onUpdate, onDuplicate, onDelete }: QuestionBlockProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: question.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  const renderQuestionInput = () => {
    switch (question.type) {
      case QUESTION_TYPES.SHORT_TEXT:
        return <Input disabled placeholder="Short answer text" className="max-w-md" />

      case QUESTION_TYPES.LONG_TEXT:
        return <Textarea disabled placeholder="Long answer text" rows={4} />

      case QUESTION_TYPES.MULTIPLE_CHOICE:
      case QUESTION_TYPES.CHECKBOXES:
      case QUESTION_TYPES.DROPDOWN:
        const choices = question.options?.choices || []
        return (
          <div className="space-y-2">
            {choices.map((choice: string, index: number) => (
              <div key={index} className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full border-2 border-gray-400"></div>
                <Input
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...choices]
                    newChoices[index] = e.target.value
                    onUpdate(question.id, { options: { ...question.options, choices: newChoices } })
                  }}
                  className="flex-1"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const newChoices = choices.filter((_: any, i: number) => i !== index)
                    onUpdate(question.id, { options: { ...question.options, choices: newChoices } })
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const newChoices = [...choices, `Option ${choices.length + 1}`]
                onUpdate(question.id, { options: { ...question.options, choices: newChoices } })
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Option
            </Button>
          </div>
        )

      case QUESTION_TYPES.LINEAR_SCALE:
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <Input
                type="number"
                value={question.options?.min || 1}
                onChange={(e) => onUpdate(question.id, { options: { ...question.options, min: parseInt(e.target.value) } })}
                className="w-20"
              />
              <span>to</span>
              <Input
                type="number"
                value={question.options?.max || 10}
                onChange={(e) => onUpdate(question.id, { options: { ...question.options, max: parseInt(e.target.value) } })}
                className="w-20"
              />
            </div>
            <div className="flex gap-4">
              <Input
                placeholder="Min label (optional)"
                value={question.options?.minLabel || ''}
                onChange={(e) => onUpdate(question.id, { options: { ...question.options, minLabel: e.target.value } })}
              />
              <Input
                placeholder="Max label (optional)"
                value={question.options?.maxLabel || ''}
                onChange={(e) => onUpdate(question.id, { options: { ...question.options, maxLabel: e.target.value } })}
              />
            </div>
          </div>
        )

      case QUESTION_TYPES.DATE:
        return <Input type="date" disabled className="max-w-xs" />

      case QUESTION_TYPES.TIME:
        return <Input type="time" disabled className="max-w-xs" />

      case QUESTION_TYPES.FILE_UPLOAD:
        return (
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <p className="text-muted-foreground">File upload area</p>
          </div>
        )

      case QUESTION_TYPES.SECTION_BREAK:
        return <div className="border-t-2 border-gray-300 my-4"></div>

      default:
        return null
    }
  }

  return (
    <Card ref={setNodeRef} style={style} className="p-6 group hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Drag Handle */}
        <div
          {...attributes}
          {...listeners}
          className="flex-shrink-0 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        {/* Content */}
        <div className="flex-1 space-y-4">
          <div className="flex gap-4 items-start">
            <Input
              value={question.label}
              onChange={(e) => onUpdate(question.id, { label: e.target.value })}
              placeholder="Question"
              className="text-lg font-medium flex-1"
            />
            <Select
              value={question.type}
              onValueChange={(value) => onUpdate(question.id, { type: value })}
            >
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {question.description !== undefined && (
            <Input
              value={question.description || ''}
              onChange={(e) => onUpdate(question.id, { description: e.target.value })}
              placeholder="Description (optional)"
              className="text-sm"
            />
          )}

          {renderQuestionInput()}

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Switch
                checked={question.required}
                onCheckedChange={(checked) => onUpdate(question.id, { required: checked })}
              />
              <Label>Required</Label>
            </div>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => onDuplicate(question.id)}>
                <Copy className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(question.id)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
