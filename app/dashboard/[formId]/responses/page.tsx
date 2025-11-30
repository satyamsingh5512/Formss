'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { formatDateTime } from '@/lib/utils'

export default function ResponsesPage() {
  const params = useParams()
  const formId = params.formId as string

  const [form, setForm] = useState<any>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [formId])

  const fetchData = async () => {
    try {
      const [formRes, responsesRes] = await Promise.all([
        fetch(`/api/forms/${formId}`),
        fetch(`/api/forms/${formId}/responses`),
      ])

      const formData = await formRes.json()
      const responsesData = await responsesRes.json()

      setForm(formData)
      setResponses(responsesData)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="p-8">Loading...</div>
  }

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <Link href="/dashboard">
            <Button variant="ghost">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>

        <h1 className="text-3xl font-bold mb-6">Responses</h1>

        {responses.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-muted-foreground">No responses yet</p>
          </Card>
        ) : (
          <div className="space-y-6">
            {responses.map((response, index) => (
              <Card key={response.id}>
                <CardHeader>
                  <CardTitle className="text-lg">
                    Response #{responses.length - index}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Submitted: {formatDateTime(response.createdAt)}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {form?.questions.map((question: any) => (
                      <div key={question.id}>
                        <p className="font-medium mb-1">{question.label}</p>
                        <p className="text-muted-foreground">
                          {Array.isArray(response.answers[question.id])
                            ? response.answers[question.id].join(', ')
                            : response.answers[question.id] || '—'}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
