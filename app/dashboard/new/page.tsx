'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useToast } from '@/hooks/use-toast'

export default function NewFormPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    // Restore guest form if redirected from sign in
    if (searchParams.get('restore') === 'guest') {
      const guestForm = localStorage.getItem('guestForm')
      if (guestForm) {
        const parsed = JSON.parse(guestForm)
        setTitle(parsed.title)
        setDescription(parsed.description)
      }
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get guest form questions if available
      const guestForm = localStorage.getItem('guestForm')
      const guestQuestions = guestForm ? JSON.parse(guestForm).questions : []

      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      })

      if (!response.ok) throw new Error('Failed to create form')

      const form = await response.json()
      
      // If there are guest questions, save them
      if (guestQuestions.length > 0) {
        const questionsResponse = await fetch(`/api/forms/${form.id}/questions`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(guestQuestions),
        })

        if (!questionsResponse.ok) {
          console.error('Failed to save questions')
        }
        
        // Clear guest form from localStorage
        localStorage.removeItem('guestForm')
      }

      toast({
        title: 'Form created',
        description: guestQuestions.length > 0 
          ? 'Your form and questions have been saved'
          : 'Your form has been created successfully',
      })
      router.push(`/dashboard/${form.id}/builder`)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create form',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <Link href="/dashboard">
          <Button variant="ghost" className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>

        <Card>
          <CardHeader>
            <CardTitle>Create New Form</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Form Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Customer Feedback Survey"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tell respondents what this form is about..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="flex gap-3">
                <Button type="submit" disabled={loading || !title}>
                  {loading ? 'Creating...' : 'Create Form'}
                </Button>
                <Link href="/dashboard">
                  <Button type="button" variant="outline">
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
