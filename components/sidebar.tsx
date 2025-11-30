'use client'

import { getSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import {
  LayoutDashboard,
  Plus,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  Crown,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Forms', href: '/dashboard' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard#analytics' },
  { icon: Crown, label: 'Pricing', href: '/pricing' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 border-r bg-card shadow-sm flex flex-col">
      <div className="p-6 border-b">
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-md">
            <span className="text-xl font-bold text-white">F</span>
          </div>
          <div>
            <h1 className="text-xl font-bold">FormSS</h1>
            <p className="text-xs text-muted-foreground">Form Builder</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = currentPath === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 px-4 py-3 rounded-md transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t space-y-2">
        <ThemeToggle />
        <Button
          variant="ghost"
          className="w-full justify-start text-muted-foreground hover:text-foreground transition-colors duration-200"
          onClick={() => signOut({ callbackUrl: '/auth/signin' })}
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Button>
      </div>
    </div>
  )
}
