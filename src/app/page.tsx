import { Hero } from '@/components/sections/hero'
import { Features } from '@/components/sections/features'
import { HowItWorks } from '@/components/sections/how-it-works'
import { Testimonials } from '@/components/sections/testimonials'
import { CTA } from '@/components/sections/cta'
import { Navigation } from '@/components/layout/navigation'
import { Footer } from '@/components/layout/footer'

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
