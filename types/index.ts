export interface Form {
  id: string
  title: string
  description?: string | null
  creatorId: string
  isActive: boolean
  isPublished: boolean
  publicId: string
  settings?: any
  createdAt: Date
  updatedAt: Date
  _count?: {
    responses: number
    questions: number
  }
}

export interface Question {
  id: string
  formId: string
  type: string
  label: string
  description?: string | null
  required: boolean
  options?: any
  validation?: any
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Response {
  id: string
  formId: string
  answers: Record<string, any>
  metadata?: any
  ipAddress?: string | null
  userAgent?: string | null
  createdAt: Date
}

export interface QuestionOption {
  id: string
  label: string
  value: string
}

export interface LinearScaleConfig {
  min: number
  max: number
  minLabel?: string
  maxLabel?: string
}

export interface FormSettings {
  collectEmail?: boolean
  allowMultipleSubmissions?: boolean
  showProgressBar?: boolean
  shuffleQuestions?: boolean
  confirmationMessage?: string
}
