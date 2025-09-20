import React from 'react'
import { faq } from '../data'
import { SectionTitle } from './SectionTitle'

export function FAQSection() {
  return (
    <section className="relative border-t border-white/5 bg-slate-950/95">
      <div className="mx-auto max-w-5xl px-6 py-20 sm:py-24">
        <SectionTitle title={faq.title} />
        <div className="mt-12 space-y-4">
          {faq.items.map((item) => (
            <details
              key={item.question}
              className="group overflow-hidden rounded-2xl border border-white/5 bg-slate-900/40 px-6 py-5 text-left backdrop-blur"
            >
              <summary className="flex cursor-pointer items-center justify-between text-base font-medium text-slate-50">
                {item.question}
                <span className="ml-4 rounded-full border border-cyan-400/40 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-200 transition group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm text-slate-300 leading-relaxed">{item.answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}
