import React from 'react'

type SectionTitleProps = {
  eyebrow?: string
  title: string
  description?: string
  align?: 'left' | 'center'
}

export function SectionTitle({ eyebrow, title, description, align = 'center' }: SectionTitleProps) {
  return (
    <div className={`space-y-4 ${align === 'center' ? 'text-center' : 'text-left'}`}>
      {eyebrow && <p className="uppercase tracking-[0.3em] text-sm text-cyan-400">{eyebrow}</p>}
      <h2 className="text-3xl sm:text-4xl font-semibold text-slate-50">{title}</h2>
      {description && <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">{description}</p>}
    </div>
  )
}
