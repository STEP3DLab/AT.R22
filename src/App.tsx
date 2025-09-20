import React from 'react'
import { FAQSection } from './components/FAQSection'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { HighlightsSection } from './components/HighlightsSection'
import { PricingSection } from './components/PricingSection'
import { ProgramSection } from './components/ProgramSection'
import { TestimonialsSection } from './components/TestimonialsSection'

export default function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Hero />
      <HighlightsSection />
      <ProgramSection />
      <TestimonialsSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  )
}
