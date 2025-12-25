import './globals.css'
import type { Metadata } from 'next'
import { Space_Grotesk, Outfit } from 'next/font/google'
import { Providers } from '@/components/providers'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space',
  display: 'swap',
})

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Formlytic - Modern Form Builder',
  description: 'Create beautiful forms, collect responses, and analyze data with ease',
  keywords: ['forms', 'survey', 'questionnaire', 'data collection'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${spaceGrotesk.variable} ${outfit.variable} font-sans`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
