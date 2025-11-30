import { PremiumNavbar } from '@/components/landing/PremiumNavbar'
import { HeroSection } from '@/components/landing/HeroSection'
import { FeaturesSection } from '@/components/landing/FeaturesSection'
import { ComparisonSection } from '@/components/landing/ComparisonSection'
import { SocialProofSection } from '@/components/landing/SocialProofSection'
import { PricingSection } from '@/components/landing/PricingSection'

export default function Home() {
  return (
    <main className="relative bg-[#0F172A] min-h-screen">
      <PremiumNavbar />
      <HeroSection />
      <FeaturesSection />
      <ComparisonSection />
      <SocialProofSection />
      <PricingSection />
    </main>
  )
}
