'use client'

import { signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/theme-toggle'
import { Logo } from '@/components/logo'
import {
  LayoutDashboard,
  FileText,
  LogOut,
  Brain,
  Menu,
  X,
} from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: FileText, label: 'My Forms', href: '/dashboard' },
  { icon: Brain, label: 'Quizo', href: '/quizo' },
]

export function Sidebar({ currentPath }: { currentPath: string }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileOpen(false)
  }, [pathname])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen])

  const SidebarContent = () => (
    <>
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center justify-start">
            <Logo width={120} height={32} className="md:w-[150px]" />
          </div>
          {/* Close button for mobile */}
          <button
            className="md:hidden p-2 text-black dark:text-white"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="space-y-1 md:space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = currentPath === item.href
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  'flex items-center space-x-3 px-3 py-2.5 md:px-4 md:py-3 rounded-xl border-2 transition-all duration-200 group relative overflow-hidden',
                  isActive
                    ? 'bg-black dark:bg-white border-black dark:border-white text-white dark:text-black font-bold shadow-neo-sm dark:shadow-none translate-x-[2px] translate-y-[2px]'
                    : 'bg-transparent border-transparent text-zinc-600 dark:text-zinc-400 hover:bg-white dark:hover:bg-zinc-900 hover:border-black dark:hover:border-white/20 hover:text-black dark:hover:text-white hover:shadow-neo-sm dark:hover:shadow-none hover:-translate-y-0.5'
                )}
                onClick={() => setIsMobileOpen(false)}
              >
                <Icon className={cn("h-5 w-5 transition-colors", isActive ? "text-white dark:text-black" : "text-zinc-500 group-hover:text-black dark:group-hover:text-white")} />
                <span className="relative z-10 text-sm md:text-base">{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      <div className="mt-auto p-4 md:p-6 space-y-4">
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
    </>
  )

  return (
    <>
      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-zinc-950 border-b-2 border-black dark:border-white/20 flex items-center justify-between px-4 z-40 md:hidden">
        <Logo width={100} height={28} />
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            className="p-2 text-black dark:text-white border-2 border-black dark:border-white/20 rounded-lg shadow-neo-sm"
            onClick={() => setIsMobileOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          "fixed top-0 left-0 h-screen w-72 max-w-[85vw] bg-white dark:bg-zinc-950 border-r-2 border-black dark:border-white/20 flex flex-col z-50 transition-transform duration-300 md:hidden",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <SidebarContent />
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed left-0 top-0 h-screen w-64 bg-white dark:bg-zinc-950 border-r-2 border-black dark:border-white/20 flex-col z-50 transition-colors duration-300">
        <SidebarContent />
      </div>
    </>
  )
}
