import { PremiumNavbar } from '@/components/landing/PremiumNavbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { SocialProofSection } from '@/components/landing/SocialProofSection'

export default function Home() {
  return (
    <main className="relative bg-background min-h-screen">
      <PremiumNavbar />
      <HeroSection />
      <FeaturesSection />
      <SocialProofSection />
    </main>
  )
}
