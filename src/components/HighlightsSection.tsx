import React from 'react'
import { highlights } from '../data'
import { SectionTitle } from './SectionTitle'

export function HighlightsSection() {
  return (
    <section className="relative border-t border-white/5 bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.15),_transparent_50%)]" aria-hidden />
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <SectionTitle title={highlights.title} />
        <div className="mt-12 grid gap-8 sm:grid-cols-3">
          {highlights.items.map((item) => (
            <div key={item.title} className="space-y-4 rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur">
              <div className="h-10 w-10 rounded-full bg-cyan-500/10 ring-1 ring-cyan-500/30" aria-hidden />
              <h3 className="text-xl font-semibold text-slate-50">{item.title}</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
