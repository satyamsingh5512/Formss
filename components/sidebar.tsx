'use client'

import { signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import {
  LayoutDashboard,
  Plus,
  FileText,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'Forms', href: '/dashboard#forms' },
  { icon: BarChart3, label: 'Analytics', href: '/dashboard#analytics' },
  { icon: FileText, label: 'Quizo', href: '/quizo' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function Sidebar({ currentPath }: { currentPath: string }) {
  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-950 border-r-2 border-black dark:border-white/20 flex flex-col z-50 transition-colors duration-300">
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-8">
          <div className="flex items-center justify-start w-full">
            <Logo width={150} height={40} className="w-full h-auto" />
          </div>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-4 py-3 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black font-bold shadow-neo-sm dark:shadow-none translate-x-[2px] translate-y-[2px]'
                    : 'bg-transparent border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:border-black dark:hover:border-white/20 hover:text-black dark:hover:text-white hover:shadow-neo-sm dark:hover:shadow-none hover:-translate-y-0.5'
                )}
              >
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white dark:text-black" : "text-zinc-500 group-hover:text-black dark:group-hover:text-white")} />
                <span className="relative z-10">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 space-y-4">
        <div className="pt-4 border-t-2 border-black dark:border-white/20 flex items-center justify-between">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="text-zinc-500 hover:text-black dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800"
            onClick={() => signOut({ callbackUrl: '/auth/signin' })}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
