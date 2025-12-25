'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Plus, X, Type, AlignLeft, List, CheckSquare, ChevronDown, Calendar, Clock, UploadCloud, Layout } from 'lucide-react'
import { QUESTION_TYPES, QUESTION_TYPE_LABELS } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface QuestionTypeSelectorProps {
  onSelect: (type: string) => void
}

const icons: Record<string, any> = {
  [QUESTION_TYPES.SHORT_TEXT]: Type,
  [QUESTION_TYPES.LONG_TEXT]: AlignLeft,
  [QUESTION_TYPES.MULTIPLE_CHOICE]: List,
  [QUESTION_TYPES.CHECKBOXES]: CheckSquare,
  [QUESTION_TYPES.DROPDOWN]: ChevronDown,
  [QUESTION_TYPES.DATE]: Calendar,
  [QUESTION_TYPES.TIME]: Clock,
  [QUESTION_TYPES.FILE_UPLOAD]: UploadCloud,
  [QUESTION_TYPES.SECTION_BREAK]: Layout,
}

export function QuestionTypeSelector({ onSelect }: QuestionTypeSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="mt-6 relative z-0">
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
          >
            <button
              onClick={() => setIsOpen(true)}
              className="w-full h-16 border-2 border-dashed border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white/50 hover:bg-black/5 dark:hover:bg-white/5 text-zinc-500 hover:text-black dark:hover:text-white transition-all rounded-xl font-bold flex items-center justify-center gap-2"
            >
              <Plus className="h-5 w-5" />
              Add Question
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
          >
            <div className="neo-card p-1 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo">
              <div className="p-3 pb-2 flex items-center justify-between">
                <span className="text-sm font-bold text-black dark:text-white ml-1">Select Question Type</span>
                <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} className="h-6 w-6 text-zinc-500 hover:text-black dark:hover:text-white rounded-lg">
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 p-2">
                {Object.entries(QUESTION_TYPE_LABELS).map(([key, label]) => {
                  const Icon = icons[key] || Type
                  return (
                    <button
                      key={key}
                      onClick={() => {
                        onSelect(key)
                        setIsOpen(false)
                      }}
                      className="flex flex-col items-center justify-center h-20 gap-2 hover:bg-zinc-100 dark:hover:bg-white/10 border-2 border-transparent hover:border-black dark:hover:border-white/20 rounded-xl transition-all group"
                    >
                      <div className="p-2 rounded-lg bg-zinc-100 dark:bg-white/5 group-hover:bg-white dark:group-hover:bg-black group-hover:border-2 group-hover:border-black dark:group-hover:border-white/20 transition-all text-black dark:text-white">
                        <Icon className="h-5 w-5" />
                      </div>
                      <span className="text-xs font-bold text-zinc-500 group-hover:text-black dark:group-hover:text-white text-center">
                        {label}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
