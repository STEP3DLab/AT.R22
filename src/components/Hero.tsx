import React from 'react'
import { hero } from '../data'

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900" />
      <div className="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="absolute -right-32 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-purple-500/10 blur-3xl" />
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="space-y-8 text-center">
          <p className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-1 text-sm text-slate-200 shadow-lg shadow-cyan-500/10">
            <span className="h-2 w-2 rounded-full bg-cyan-400" aria-hidden />
            {hero.eyebrow}
          </p>
          <h1 className="text-4xl sm:text-6xl font-semibold text-slate-50 leading-tight max-w-3xl mx-auto">
            {hero.title}
          </h1>
          <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto">{hero.description}</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#pricing"
              className="inline-flex items-center justify-center rounded-full bg-cyan-400 px-6 py-3 text-base font-medium text-slate-950 transition hover:bg-cyan-300"
            >
              {hero.ctaPrimary}
            </a>
            <a
              href="#program"
              className="inline-flex items-center justify-center rounded-full border border-slate-600 px-6 py-3 text-base font-medium text-slate-100 transition hover:border-slate-400"
            >
              {hero.ctaSecondary}
            </a>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs sm:text-sm text-slate-300">
            {hero.badges.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-slate-700/60 bg-slate-900/40 px-4 py-2 backdrop-blur"
              >
                {badge}
              </span>
            ))}
          </div>
          <dl className="grid gap-6 pt-10 sm:grid-cols-3">
            {hero.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-white/5 bg-slate-900/50 p-6 text-left backdrop-blur shadow-lg shadow-cyan-500/5"
              >
                <dt className="text-sm uppercase tracking-wide text-slate-400">{stat.label}</dt>
                <dd className="mt-2 text-xl font-semibold text-slate-50">{stat.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  )
}
