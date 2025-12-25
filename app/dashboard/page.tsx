import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, FileText, TrendingUp, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { FormGrid } from '@/components/dashboard/form-grid'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  })

  const forms = await prisma.form.findMany({
    where: {
      creatorId: session.user.id,
    },
    include: {
      _count: {
        select: {
          responses: true,
          questions: true,
        },
      },
    },
    orderBy: {
      updatedAt: 'desc',
    },
  })

  const totalResponses = forms.reduce((acc, form) => acc + form._count.responses, 0)

  return (
    <div className="p-4 md:p-8 space-y-6 md:space-y-8 animate-fade-in relative z-10 w-full overflow-hidden">
      {/* Background decoration - hidden on mobile */}
      <div className="hidden md:block fixed top-0 left-64 right-0 h-64 bg-zinc-100 dark:bg-zinc-900 border-b-2 border-black dark:border-white/20 -z-10" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-4">
        <div>
          <h1 className="text-4xl font-black text-black dark:text-white tracking-tight mb-2">Dashboard</h1>
          <p className="text-zinc-600 dark:text-zinc-400 font-medium">
            Welcome back, {session.user.name?.split(' ')[0]} 👋
          </p>
        </div>

        <Link href="/dashboard/new">
          <button className="neo-button-primary rounded-lg flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Create New Form
          </button>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <div className="neo-card flex flex-col justify-between dark:shadow-neo-lg-dark">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Forms</h3>
            <div className="p-2 rounded-lg bg-black dark:bg-white text-white dark:text-black">
              <FileText className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-black dark:text-white">{forms.length}</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-bold">
              Active forms
            </p>
          </div>
        </div>

        <div className="neo-card flex flex-col justify-between dark:shadow-neo-lg-dark">
          <div className="flex flex-row items-center justify-between pb-2">
            <h3 className="text-sm font-bold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Total Responses</h3>
            <div className="p-2 rounded-lg bg-green-500 text-black border-2 border-black dark:border-transparent">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
          <div>
            <div className="text-4xl font-black text-black dark:text-white">{totalResponses}</div>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 font-bold">
              Across all forms
            </p>
          </div>
        </div>
      </div>

      {/* Forms Section */}
      <div className="space-y-6 pt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-black dark:text-white">Your Forms</h2>
          <div className="relative w-64 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
            <Input
              placeholder="Search forms..."
              className="pl-10 bg-white dark:bg-zinc-900 border-2 border-black dark:border-white/20 text-black dark:text-white placeholder:text-zinc-500 focus-visible:ring-0 focus-visible:border-black dark:focus-visible:border-white rounded-lg shadow-neo-sm dark:shadow-none transition-all"
            />
          </div>
        </div>

        {forms.length === 0 ? (
          <div className="text-center py-20 rounded-xl border-2 border-dashed border-black/20 dark:border-white/20 bg-white/50 dark:bg-zinc-900/50">
            <div className="mx-auto w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 border-2 border-black dark:border-white/10">
              <FileText className="h-8 w-8 text-black dark:text-white" />
            </div>
            <h3 className="text-xl font-bold text-black dark:text-white mb-2">No forms created yet</h3>
            <p className="text-zinc-500 dark:text-zinc-400 mb-6 max-w-sm mx-auto font-medium">
              Start collecting responses by creating your first form. It only takes a minute.
            </p>
            <Link href="/dashboard/new">
              <button className="neo-button rounded-lg">
                Create First Form
              </button>
            </Link>
          </div>
        ) : (
          <FormGrid forms={forms} />
        )}
      </div>
    </div>
  )
}
