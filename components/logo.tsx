'use client'

import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    width?: number
    height?: number
    linkToHome?: boolean
}

export function Logo({ className, width = 40, height = 40, linkToHome = true }: LogoProps) {
    const logoContent = (
        <div className={cn("relative flex items-center cursor-pointer", className)}>
            <Image
                src="/logo-light.png"
                alt="Formlytic Logo"
                width={width}
                height={height}
                className="object-contain object-left dark:hidden"
                priority
            />
            <Image
                src="/logo-dark.png"
                alt="Formlytic Logo"
                width={width}
                height={height}
                className="object-contain object-left hidden dark:block"
                priority
            />
        </div>
    )

    if (linkToHome) {
        return (
            <Link href="/" className="hover:opacity-90 transition-opacity">
                {logoContent}
            </Link>
        )
    }

    return logoContent
}
