'use client'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { formatRelativeTime } from '@/lib/utils'
import { BarChart3, Edit, MoreVertical, FileText, Trash2 } from 'lucide-react'
import Link from 'next/link'
import type { Form } from '@/types'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function FormCard({ form }: { form: Form & { _count?: { responses: number, questions: number } } }) {
  const [isActive, setIsActive] = useState(form.isActive)
  const [isDeleting, setIsDeleting] = useState(false)
  const router = useRouter()

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

  const deleteForm = async () => {
    if (!confirm('Are you sure you want to delete this form? This cannot be undone.')) {
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch(`/api/forms/${form.id}`, {
        method: 'DELETE',
      })
      if (response.ok) {
        router.refresh() // Refresh the page to update the list
      } else {
        alert('Failed to delete form')
      }
    } catch (error) {
      console.error('Failed to delete form:', error)
      alert('Failed to delete form')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className={`neo-card group hover:-translate-y-1 transition-all duration-300 dark:shadow-neo-lg-dark relative flex flex-col h-full ${isDeleting ? 'opacity-50 pointer-events-none' : ''}`}>
      {/* Active Status Badge */}
      <div className={`absolute -top-3 -right-3 px-2 py-1 border-2 border-black dark:border-white/20 text-xs font-bold shadow-neo-sm transform rotate-3 z-10 ${isActive ? 'bg-green-300 text-black' : 'bg-zinc-200 text-zinc-500'}`}>
        {isActive ? 'ACTIVE' : 'INACTIVE'}
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg border-2 border-black dark:border-white/20 flex items-center justify-center shadow-neo-sm ${isActive ? 'bg-indigo-100 text-indigo-600' : 'bg-zinc-100 text-zinc-500'}`}>
              <FileText className="h-5 w-5" />
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-black dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 -mr-2">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 shadow-neo">
              <DropdownMenuItem onClick={toggleActive} className="focus:bg-zinc-100 dark:focus:bg-zinc-800 cursor-pointer text-black dark:text-white font-medium">
                {isActive ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={deleteForm} className="focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer text-red-600 font-medium focus:text-red-700">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-xl font-bold text-black dark:text-white mb-2 line-clamp-1 group-hover:underline decoration-2 underline-offset-4">
          {form.title}
        </h3>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-2 h-10 font-medium">
          {form.description || 'No description provided'}
        </p>
      </div>

      <div className="pt-6 mt-4 border-t-2 border-black/10 dark:border-white/10 flex items-center gap-2">
        <Link href={`/dashboard/${form.id}/builder`} className="flex-1">
          <button className="w-full py-2 px-3 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 rounded-lg font-bold text-sm text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex items-center justify-center gap-2">
            <Edit className="h-3.5 w-3.5" />
            Edit
          </button>
        </Link>
        <Link href={`/dashboard/${form.id}/analytics`} className="flex-1">
          <button className="w-full py-2 px-3 bg-zinc-100 dark:bg-zinc-800 border-2 border-transparent hover:border-black dark:hover:border-white/20 rounded-lg font-bold text-sm text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all flex items-center justify-center gap-2">
            <BarChart3 className="h-3.5 w-3.5" />
            Stats
          </button>
        </Link>
      </div>

      <div className="absolute bottom-3 left-4 text-[10px] font-bold text-zinc-400 bg-white dark:bg-zinc-950 px-1">
        {formatRelativeTime(form.updatedAt)}
      </div>
    </div>
  )
}

