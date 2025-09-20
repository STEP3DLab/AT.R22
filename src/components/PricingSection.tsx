import React from 'react'
import { pricing } from '../data'
import { SectionTitle } from './SectionTitle'

export function PricingSection() {
  return (
    <section id="pricing" className="relative border-t border-white/5 bg-slate-950">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-purple-500/40 to-transparent" aria-hidden />
      <div className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
        <SectionTitle title={pricing.title} description={pricing.note} />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {pricing.plans.map((plan) => (
            <article
              key={plan.name}
              className={`relative overflow-hidden rounded-3xl border bg-slate-900/40 p-8 backdrop-blur transition ${
                plan.highlighted
                  ? 'border-cyan-400/60 shadow-xl shadow-cyan-500/20'
                  : 'border-white/5 hover:border-cyan-400/40'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute right-6 top-6 rounded-full bg-cyan-400 px-3 py-1 text-xs font-semibold text-slate-950">
                  Популярно
                </div>
              )}
              <h3 className="text-xl font-semibold text-slate-50">{plan.name}</h3>
              <p className="mt-2 text-3xl font-semibold text-cyan-300">{plan.price}</p>
              <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                {plan.perks.map((perk) => (
                  <li key={perk} className="flex items-start gap-3">
                    <span className="mt-1 h-2 w-2 flex-none rounded-full bg-cyan-400" aria-hidden />
                    <span>{perk}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 w-full rounded-full border border-cyan-400/60 bg-cyan-500/10 px-6 py-3 text-sm font-medium text-cyan-200 transition hover:bg-cyan-400 hover:text-slate-950">
                Записаться
              </button>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
