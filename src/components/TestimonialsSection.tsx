import React from 'react'
import { testimonials } from '../data'
import { SectionTitle } from './SectionTitle'

export function TestimonialsSection() {
  return (
    <section className="relative border-t border-white/5 bg-slate-950/90">
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionTitle title={testimonials.title} />
        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {testimonials.list.map((testimonial) => (
            <figure
              key={testimonial.name}
              className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/50 p-8 text-left backdrop-blur"
            >
              <blockquote className="text-base text-slate-300 leading-relaxed">{testimonial.text}</blockquote>
              <figcaption className="mt-6">
                <p className="text-sm font-semibold text-slate-50">{testimonial.name}</p>
                <p className="text-xs uppercase tracking-wide text-slate-400">{testimonial.role}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
