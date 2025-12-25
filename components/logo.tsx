import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
    className?: string
    width?: number
    height?: number
}

export function Logo({ className, width = 40, height = 40 }: LogoProps) {
    return (
        <div className={cn("relative flex items-center", className)}>
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
}
