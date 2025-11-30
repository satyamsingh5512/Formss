'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { formatDate, formatRelativeTime } from '@/lib/utils'
import { BarChart3, Edit, Copy, Trash2, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import type { Form } from '@/types'
import { useState } from 'react'

export function FormCard({ form }: { form: Form & { _count?: { responses: number, questions: number } } }) {
  const [isActive, setIsActive] = useState(form.isActive)

  const toggleActive = async () => {
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      })
      if (response.ok) {
        setIsActive(!isActive)
      }
    } catch (error) {
      console.error('Failed to toggle form status:', error)
    }
  }

  return (
    <Card className="card-hover group">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold line-clamp-1 mb-1">
              {form.title}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {form.description || 'No description'}
            </p>
          </div>
          <Switch checked={isActive} onCheckedChange={toggleActive} />
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4" />
            <span>{form._count?.responses || 0} responses</span>
          </div>
          <div>
            {form._count?.questions || 0} questions
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          Updated {formatRelativeTime(form.updatedAt)}
        </div>
      </CardContent>

      <CardFooter className="pt-4 border-t gap-2">
        <Link href={`/dashboard/${form.id}/builder`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        </Link>
        <Link href={`/dashboard/${form.id}/analytics`} className="flex-1">
          <Button variant="outline" className="w-full" size="sm">
            <BarChart3 className="h-4 w-4 mr-2" />
            Analytics
          </Button>
        </Link>
        {form.isPublished && (
          <Link href={`/form/${form.publicId}`} target="_blank">
            <Button variant="ghost" size="sm">
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        )}
      </CardFooter>
    </Card>
  )
}
