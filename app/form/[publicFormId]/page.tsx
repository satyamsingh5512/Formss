'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { QUESTION_TYPES } from '@/lib/constants'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, CheckCircle2, AlertCircle, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function PublicFormPage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const { data: session, status: sessionStatus } = useSession()
  const publicId = params.publicFormId as string

  const [form, setForm] = useState<any>(null)
  const [answers, setAnswers] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [requiresSignIn, setRequiresSignIn] = useState(false)

  const fetchForm = useCallback(async () => {
    try {
      const response = await fetch(`/api/public/${publicId}`)
      if (!response.ok) throw new Error('Form not found')
      const data = await response.json()
      setForm(data)

      // Check if sign-in is required
      if (data.requireSignIn) {
        setRequiresSignIn(true)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Form not found or unavailable',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [publicId, toast])

  useEffect(() => {
    fetchForm()
  }, [fetchForm])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!form?.questions) return

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
            className="neo-input bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-black rounded-lg transition-all"
          />
        )

      case QUESTION_TYPES.LONG_TEXT:
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
            placeholder="Your answer"
            rows={4}
            className="neo-textarea bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-black rounded-lg transition-all resize-none"
          />
        )

      case QUESTION_TYPES.MULTIPLE_CHOICE:
        return (
          <RadioGroup
            value={value}
            onValueChange={(val: string) => setAnswers({ ...answers, [question.id]: val })}
            className="space-y-3"
          >
            {question.options?.choices?.map((choice: string, index: number) => (
              <div key={index} className={cn(
                "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                value === choice
                  ? "bg-black/5 dark:bg-white/10 border-black dark:border-white shadow-neo-sm"
                  : "bg-white dark:bg-zinc-900 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
              )}>
                <RadioGroupItem value={choice} id={`${question.id}-${index}`} className="border-black dark:border-white text-black dark:text-white" />
                <Label htmlFor={`${question.id}-${index}`} className="font-bold text-black dark:text-white cursor-pointer flex-1">
                  {choice}
                </Label>
              </div>
            ))}
          </RadioGroup>
        )

      case QUESTION_TYPES.CHECKBOXES:
        return (
          <div className="space-y-3">
            {question.options?.choices?.map((choice: string, index: number) => {
              const checked = (value || []).includes(choice)
              return (
                <div key={index} className={cn(
                  "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all cursor-pointer",
                  checked
                    ? "bg-black/5 dark:bg-white/10 border-black dark:border-white shadow-neo-sm"
                    : "bg-white dark:bg-zinc-900 border-black/20 dark:border-white/20 hover:border-black dark:hover:border-white"
                )}>
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(isChecked) => {
                      const current = value || []
                      const updated = isChecked
                        ? [...current, choice]
                        : current.filter((c: string) => c !== choice)
                      setAnswers({ ...answers, [question.id]: updated })
                    }}
                    id={`${question.id}-${index}`}
                    className="border-black dark:border-white data-[state=checked]:bg-black dark:data-[state=checked]:bg-white data-[state=checked]:text-white dark:data-[state=checked]:text-black"
                  />
                  <Label htmlFor={`${question.id}-${index}`} className="font-bold text-black dark:text-white cursor-pointer flex-1">
                    {choice}
                  </Label>
                </div>
              )
            })}
          </div>
        )

      case QUESTION_TYPES.DROPDOWN:
        return (
          <Select
            value={value}
            onValueChange={(val) => setAnswers({ ...answers, [question.id]: val })}
          >
            <SelectTrigger className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white font-medium focus:ring-0">
              <SelectValue placeholder="Choose an option" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-zinc-950 border-2 border-black dark:border-white/20 text-black dark:text-white shadow-neo">
              {question.options?.choices?.map((choice: string, index: number) => (
                <SelectItem key={index} value={choice} className="focus:bg-black focus:text-white dark:focus:bg-white dark:focus:text-black cursor-pointer font-medium">
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
          <div className="space-y-6 pt-2">
            <RadioGroup
              value={value?.toString()}
              onValueChange={(val: string) => setAnswers({ ...answers, [question.id]: parseInt(val) })}
              className="flex justify-between gap-2 overflow-x-auto pb-4"
            >
              {Array.from({ length: max - min + 1 }, (_, i) => min + i).map((num) => (
                <div key={num} className="flex flex-col items-center gap-2">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all cursor-pointer font-bold",
                    value?.toString() === num.toString()
                      ? "bg-black dark:bg-white border-black dark:border-white text-white dark:text-black shadow-neo-sm transform -translate-y-1"
                      : "bg-white dark:bg-zinc-900 border-black/20 dark:border-white/20 text-zinc-500 hover:border-black dark:hover:border-white"
                  )}
                    onClick={() => setAnswers({ ...answers, [question.id]: parseInt(num.toString()) })}
                  >
                    <span>{num}</span>
                  </div>
                  <RadioGroupItem value={num.toString()} id={`${question.id}-${num}`} className="sr-only" />
                </div>
              ))}
            </RadioGroup>
            {(question.options?.minLabel || question.options?.maxLabel) && (
              <div className="flex justify-between text-xs font-bold text-zinc-500 px-1">
                <span>{question.options?.minLabel}</span>
                <span>{question.options?.maxLabel}</span>
              </div>
            )}
          </div>
        )

      case QUESTION_TYPES.DATE:
        return (
          <div className="relative max-w-[200px]">
            <Input
              type="date"
              value={value || ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white font-medium rounded-lg"
            />
          </div>
        )

      case QUESTION_TYPES.TIME:
        return (
          <div className="relative max-w-[150px]">
            <Input
              type="time"
              value={value || ''}
              onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
              className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white font-medium rounded-lg"
            />
          </div>
        )

      case QUESTION_TYPES.FILE_UPLOAD:
        return (
          <div className="border-2 border-dashed border-black/20 dark:border-white/20 rounded-xl p-8 text-center bg-zinc-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 hover:border-black dark:hover:border-white transition-all cursor-pointer group">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) {
                  setAnswers({ ...answers, [question.id]: file.name })
                }
              }}
              className="hidden"
              id={`file-${question.id}`}
            />
            <Label htmlFor={`file-${question.id}`} className="cursor-pointer block">
              <div className="w-12 h-12 bg-white dark:bg-black border-2 border-black dark:border-white/20 rounded-full flex items-center justify-center mx-auto mb-3 shadow-neo-sm group-hover:-translate-y-1 transition-transform">
                <UploadCloud className="h-6 w-6 text-black dark:text-white" />
              </div>
              <p className="text-sm font-bold text-black dark:text-white mb-1">
                {value ? `Selected: ${value}` : 'Click to upload'}
              </p>
              <p className="text-xs text-zinc-500 font-medium">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </Label>
          </div>
        )

      case QUESTION_TYPES.SECTION_BREAK:
        return <div className="h-0.5 bg-black/10 dark:bg-white/10 my-6 w-full"></div>

      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-4 border-black dark:border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-zinc-500 font-bold">Loading form...</p>
        </div>
      </div>
    )
  }

  if (!form) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4">
        <div className="neo-card max-w-md w-full text-center p-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-lg">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-black">
            <AlertCircle className="h-6 w-6 text-red-500" />
          </div>
          <h2 className="text-xl font-black text-black dark:text-white mb-2">Form Not Found</h2>
          <p className="text-zinc-500 font-medium">This form is unavailable or has been deleted.</p>
        </div>
      </div>
    )
  }

  // Check if sign-in is required
  if (requiresSignIn && !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4">
        <div className="neo-card max-w-md w-full text-center p-8 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-lg">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black">
            <LogIn className="h-8 w-8 text-yellow-600" />
          </div>
          <h2 className="text-2xl font-black text-black dark:text-white mb-2">Sign In Required</h2>
          <p className="text-zinc-500 font-medium mb-6">
            The creator of this form requires you to sign in before submitting your response.
          </p>
          <Link href={`/auth/signin?callbackUrl=/form/${publicId}`}>
            <button className="neo-button-primary w-full py-3 text-lg flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5" />
              Sign In to Continue
            </button>
          </Link>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-zinc-950 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <div className="neo-card max-w-md w-full bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-center p-12 shadow-neo-lg text-black dark:text-white">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-black shadow-neo-sm"
            >
              <CheckCircle2 className="w-10 h-10 text-black" />
            </motion.div>
            <h2 className="text-3xl font-black mb-4">Thank You!</h2>
            <p className="text-zinc-600 dark:text-zinc-400 text-lg leading-relaxed font-medium">
              {form.settings?.confirmationMessage || 'Your response has been recorded successfully.'}
            </p>
            <Button
              className="mt-8 neo-button w-full"
              onClick={() => window.location.reload()}
            >
              Submit another response
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-16 px-4 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto space-y-6 relative z-10"
      >
        {/* Progress Bar */}
        {form.showProgress && (
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-full h-3 border-2 border-black dark:border-white/20 overflow-hidden mb-8">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(Object.keys(answers).length / form.questions.length) * 100}%` }}
              className="h-full transition-all duration-300 border-r-2 border-black"
              style={{
                backgroundColor: form.headerColor || '#000'
              }}
            />
          </div>
        )}

        {/* Branded Header - Organization Name Only */}
        {form.organizationName && (
          <div className="text-center mb-6">
            <h3 className="text-lg font-bold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">{form.organizationName}</h3>
          </div>
        )}

        {/* Form Header Card */}
        <div className="neo-card bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo-lg overflow-hidden p-0">
          <div
            className="h-3 w-full border-b-2 border-black"
            style={{
              backgroundColor: form.headerColor || '#000'
            }}
          />
          <div className="p-8 md:p-10">
            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center mb-6">
              {form.logoUrl && (
                <div className="flex-shrink-0 bg-white p-2 rounded-xl border-2 border-black/10 dark:border-white/10 shadow-sm">
                  <img
                    src={form.logoUrl}
                    alt="Organization Logo"
                    className="h-16 w-16 object-contain"
                  />
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-black text-black dark:text-white leading-tight">{form.title}</h1>
            </div>
            {form.description && (
              <p className="text-lg text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium">{form.description}</p>
            )}
          </div>
        </div>

        {/* Questions */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <AnimatePresence>
            {form.questions.map((question: any, index: number) => (
              <motion.div
                key={question.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="neo-card bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 p-8 shadow-neo hover:-translate-y-1 transition-transform duration-300">
                  <div className="space-y-6">
                    <div>
                      <Label className="text-xl font-bold text-black dark:text-white mb-2 block leading-relaxed">
                        {question.label}
                        {question.required && <span className="text-red-500 ml-1">*</span>}
                      </Label>
                      {question.description && (
                        <p className="text-sm text-zinc-500 font-medium">{question.description}</p>
                      )}
                    </div>
                    {renderQuestion(question)}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Submit */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pt-6"
          >
            <button
              type="submit"
              disabled={submitting}
              className="neo-button-primary w-full h-14 text-lg rounded-xl flex items-center justify-center gap-2"
              style={{
                backgroundColor: form.headerColor || '#000',
                borderColor: '#000',
                color: '#fff'
              }}
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Submitting...</span>
                </div>
              ) : 'Submit Form'}
            </button>
            <div className="text-center mt-6">
              <p className="text-xs text-zinc-500 font-bold">
                Powered by <span className="font-black text-black dark:text-white">Formlytic</span>
              </p>
            </div>
          </motion.div>
        </form>
      </motion.div>
    </div>
  )
}
