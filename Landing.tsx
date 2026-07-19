import { LandingNav } from './landing/Nav'
import { Hero } from './landing/Hero'
import { Features, Showcase, TrustStrip, Workflow } from './landing/Sections'
import { Cta, Faq, Footer, Pricing, Testimonials } from './landing/Closing'

export default function Landing() {
  return (
    <div className="relative min-h-screen bg-void text-mist noise">
      <LandingNav />
      <Hero />
      <TrustStrip />
      <Features />
      <Workflow />
      <Showcase />
      <Pricing />
      <Testimonials />
      <Faq />
      <Cta />
      <Footer />
    </div>
  )
}
