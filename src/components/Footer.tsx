import React from 'react'
import { footer } from '../data'

export function Footer() {
  return (
    <footer className="relative border-t border-white/5 bg-slate-950">
      <div className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="grid gap-10 sm:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            <p className="text-xl font-semibold text-slate-50">{footer.company}</p>
            <p className="text-sm text-slate-300">Пишите и звоните — ответим в течение рабочего дня.</p>
            <div className="space-y-1 text-sm text-slate-200">
              <a className="block transition hover:text-cyan-300" href={`mailto:${footer.contacts.email}`}>
                {footer.contacts.email}
              </a>
              <a className="block transition hover:text-cyan-300" href={`tel:${footer.contacts.phone.replace(/[^+\d]/g, '')}`}>
                {footer.contacts.phone}
              </a>
            </div>
          </div>
          <div className="space-y-4 sm:justify-self-end text-right">
            <div className="flex flex-wrap justify-end gap-3 text-sm text-slate-300">
              {footer.socials.map((social) => (
                <a key={social.label} className="transition hover:text-cyan-300" href={social.url}>
                  {social.label}
                </a>
              ))}
            </div>
            <div className="text-xs text-slate-500">
              {footer.legal.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-10 text-center text-xs text-slate-600">© {new Date().getFullYear()} Step3D. Все права защищены.</div>
      </div>
    </footer>
  )
}
