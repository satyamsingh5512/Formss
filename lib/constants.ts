export const QUESTION_TYPES = {
  SHORT_TEXT: 'short_text',
  LONG_TEXT: 'long_text',
  MULTIPLE_CHOICE: 'multiple_choice',
  CHECKBOXES: 'checkboxes',
  DROPDOWN: 'dropdown',
  LINEAR_SCALE: 'linear_scale',
  DATE: 'date',
  TIME: 'time',
  FILE_UPLOAD: 'file_upload',
  SECTION_BREAK: 'section_break',
} as const

export const QUESTION_TYPE_LABELS = {
  [QUESTION_TYPES.SHORT_TEXT]: 'Short Text',
  [QUESTION_TYPES.LONG_TEXT]: 'Long Text',
  [QUESTION_TYPES.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QUESTION_TYPES.CHECKBOXES]: 'Checkboxes',
  [QUESTION_TYPES.DROPDOWN]: 'Dropdown',
  [QUESTION_TYPES.LINEAR_SCALE]: 'Linear Scale',
  [QUESTION_TYPES.DATE]: 'Date',
  [QUESTION_TYPES.TIME]: 'Time',
  [QUESTION_TYPES.FILE_UPLOAD]: 'File Upload',
  [QUESTION_TYPES.SECTION_BREAK]: 'Section Break',
}

export const DEFAULT_FORM_SETTINGS = {
  collectEmail: false,
  allowMultipleSubmissions: false,
  showProgressBar: true,
  shuffleQuestions: false,
  confirmationMessage: 'Thank you for your submission!',
}

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
]
