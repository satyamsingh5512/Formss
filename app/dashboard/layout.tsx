import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Sidebar } from '@/components/sidebar'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen">
      <Sidebar currentPath="/dashboard" />
      {/* pt-16 for mobile header, md:pt-0 and md:ml-64 for desktop sidebar */}
      <div className="pt-16 md:pt-0 md:ml-64 min-h-screen bg-transparent transition-colors duration-300">
        {children}
      </div>
    </div>
  )
}

