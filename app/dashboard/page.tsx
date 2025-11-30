import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { FormCard } from '@/components/form-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Search, FileText, Crown, Zap, TrendingUp } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  const user = await prisma.user.findUnique({
    where: { id: session?.user?.id },
    include: {
      subscription: true,
      purchases: true,
    },
  })

  const forms = await prisma.form.findMany({
    where: {
      creatorId: session?.user?.id,
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

  const hasActiveSubscription = 
    user?.subscription?.status === 'active' && 
    new Date(user.subscription.endDate) > new Date()

  const paidFormsCount = forms.filter(f => f.isPaid).length
  const totalResponses = forms.reduce((acc, form) => acc + form._count.responses, 0)

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Forms</h1>
              <p className="text-muted-foreground">
                Create, manage, and analyze your forms
              </p>
            </div>
            {hasActiveSubscription && (
              <Badge className="gap-1 px-4 py-2">
                <Crown className="h-4 w-4" />
                Organization Plan
              </Badge>
            )}
          </div>
        </div>

        {/* Subscription Status Card */}
        {!hasActiveSubscription && (
          <Card className="mb-8 border-primary/50 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Zap className="h-5 w-5 text-primary" />
                    Unlock Premium Features
                  </CardTitle>
                  <CardDescription className="mt-2">
                    {paidFormsCount > 0 
                      ? `You have ${paidFormsCount} premium form${paidFormsCount > 1 ? 's' : ''}. Upgrade to unlock unlimited forms!`
                      : 'Get unlimited forms with all premium features for just ₹300/month'
                    }
                  </CardDescription>
                </div>
                <Link href="/pricing">
                  <Button className="gap-2">
                    <Crown className="h-4 w-4" />
                    Upgrade Now
                  </Button>
                </Link>
              </div>
            </CardHeader>
          </Card>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Forms</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{forms.length}</div>
              <p className="text-xs text-muted-foreground">
                {paidFormsCount} premium {hasActiveSubscription && '(unlimited)'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Responses</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResponses}</div>
              <p className="text-xs text-muted-foreground">
                Across all forms
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hasActiveSubscription ? 'Organization' : 'Free'}
              </div>
              <p className="text-xs text-muted-foreground">
                {hasActiveSubscription 
                  ? `Until ${new Date(user.subscription!.endDate).toLocaleDateString()}`
                  : 'Basic features'
                }
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Create */}
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search forms..."
              className="pl-10"
            />
          </div>
          <Link href="/dashboard/new">
            <Button size="lg" className="gap-2">
              <Plus className="h-5 w-5" />
              Create New Form
            </Button>
          </Link>
        </div>

        {/* Forms Grid */}
        {forms.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <FileText className="h-12 w-12 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No forms yet</h2>
            <p className="text-muted-foreground mb-6">
              Get started by creating your first form
            </p>
            <Link href="/dashboard/new">
              <Button size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Form
              </Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <FormCard key={form.id} form={form} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
