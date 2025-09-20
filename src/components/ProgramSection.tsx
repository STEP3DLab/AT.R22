import React from 'react'
import { program } from '../data'
import { SectionTitle } from './SectionTitle'

export function ProgramSection() {
  return (
    <section id="program" className="relative border-t border-white/5 bg-slate-950/80">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionTitle title={program.title} description={program.description} />
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {program.modules.map((module) => (
            <article
              key={module.title}
              className="relative overflow-hidden rounded-3xl border border-white/5 bg-slate-900/40 p-8 backdrop-blur transition hover:border-cyan-400/60"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-semibold text-slate-50">{module.title}</h3>
                <span className="rounded-full border border-cyan-400/60 bg-cyan-500/10 px-3 py-1 text-xs uppercase tracking-wide text-cyan-200">
                  {module.duration}
                </span>
              </div>
              <ul className="mt-6 space-y-3 text-slate-300">
                {module.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 flex-none rounded-full bg-cyan-400" aria-hidden />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
