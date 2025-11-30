'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/lib/constants'

interface QuestionTypeSelectorProps {
  onSelect: (type: string) => void
}

export function QuestionTypeSelector({ onSelect }: QuestionTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6">
      {!isOpen ? (
        <Button
          onClick={() => setIsOpen(true)}
          variant="outline"
          className="w-full h-16 border-2 border-dashed hover:border-primary hover:bg-primary/5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add Question
        </Button>
      ) : (
        <Card className="p-4">
          <p className="text-sm font-medium mb-3">Select question type:</p>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => (
              <Button
                key={key}
                variant="outline"
                onClick={() => {
                  onSelect(key)
                  setIsOpen(false)
                }}
                className="justify-start"
              >
                {label}
              </Button>
            ))}
          </div>
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="w-full mt-3"
          >
            Cancel
          </Button>
        </Card>
      )}
    </div>
  )
}
