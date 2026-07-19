import React, { createContext, useCallback, useContext, useEffect, useId, useRef, useState, type ReactNode } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import { Check, ChevronDown, Copy, Info, Plus, X } from 'lucide-react'
import { cn, copyText } from '../lib/utils'

/* ─── Logo ─── */
export function Logo({ size = 36, withWordmark = false, className }: { size?: number; withWordmark?: boolean; className?: string }) {
  return (
    <span className={cn('flex items-center gap-3', className)}>
      <img
        src="/uploads/logo.png"
        alt="Myxelez Studio"
        style={{ width: size, height: size }}
        className="rounded-[22%] object-cover ring-1 ring-edge shadow-[0_4px_16px_-4px_rgba(200,205,255,0.35)]"
      />
      {withWordmark && (
        <span className="flex flex-col leading-none">
          <span className="font-display font-semibold tracking-[0.32em] text-[13px] text-mist">MYXELEZ</span>
          <span className="text-[8.5px] tracking-[0.52em] text-ash mt-1">STUDIO</span>
        </span>
      )}
    </span>
  )
}

/* ─── Button ─── */
type BtnVariant = 'chrome' | 'glass' | 'outline' | 'ghost' | 'danger'
type BtnSize = 'sm' | 'md' | 'lg' | 'icon' | 'icon-sm'

const btnVariants: Record<BtnVariant, string> = {
  chrome: 'btn-chrome font-semibold',
  glass: 'glass text-mist hover:bg-glass2 hover:border-edge',
  outline: 'border border-edge text-mist hover:bg-glass',
  ghost: 'text-smoke hover:text-mist hover:bg-glass',
  danger: 'border border-blush/30 text-blush hover:bg-blush/10',
}
const btnSizes: Record<BtnSize, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-4.5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-6 text-sm rounded-xl gap-2.5',
  icon: 'h-10 w-10 rounded-xl',
  'icon-sm': 'h-8 w-8 rounded-lg',
}

export function Button({ variant = 'glass', size = 'md', className, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant; size?: BtnSize }) {
  return (
    <motion.button
      whileTap={{ scale: 0.965 }}
      className={cn('inline-flex items-center justify-center select-none transition-colors duration-200 cursor-pointer disabled:opacity-45 disabled:pointer-events-none', btnVariants[variant], btnSizes[size], className)}
      {...(props as Record<string, unknown>)}
    >
      {children}
    </motion.button>
  )
}

/* ─── Badge ─── */
const badgeVariants: Record<string, string> = {
  default: 'bg-glass2 text-smoke border-line',
  mint: 'bg-mint/10 text-mint border-mint/20',
  ember: 'bg-ember/10 text-ember border-ember/20',
  blush: 'bg-blush/10 text-blush border-blush/20',
  frost: 'bg-frost/10 text-frost border-frost/20',
  chrome: 'bg-gradient-to-b from-white/15 to-white/5 text-mist border-edge',
}
export function Badge({ variant = 'default', className, children }: { variant?: keyof typeof badgeVariants; className?: string; children: ReactNode }) {
  return <span className={cn('inline-flex items-center gap-1 h-5.5 px-2 rounded-full border text-[10.5px] font-medium tracking-wide whitespace-nowrap', badgeVariants[variant], className)}>{children}</span>
}

/* ─── Card ─── */
export function Card({ className, children, spotlight = true, hover = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { spotlight?: boolean; hover?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const onMove = (e: React.MouseEvent) => {
    const el = ref.current
    if (!el || !spotlight) return
    const r = el.getBoundingClientRect()
    el.style.setProperty('--mx', `${e.clientX - r.left}px`)
    el.style.setProperty('--my', `${e.clientY - r.top}px`)
  }
  return (
    <div ref={ref} onMouseMove={onMove} className={cn('glass rounded-2xl', spotlight && 'spotlight', hover && 'hover-lift', className)} {...props}>
      {children}
    </div>
  )
}

/* ─── Field / Input / Textarea ─── */
export function Field({ label, hint, children, className, right }: { label?: string; hint?: string; children: ReactNode; className?: string; right?: ReactNode }) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <div className="flex items-center justify-between">
          <label className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ash">{label}</label>
          {right}
        </div>
      )}
      {children}
      {hint && <p className="text-[11px] text-ash leading-relaxed">{hint}</p>}
    </div>
  )
}

export const Input = React.forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn('h-10 w-full rounded-xl bg-glass border border-line px-3.5 text-sm text-mist placeholder:text-ash outline-none transition-all focus:border-edge focus:ring-2 focus:ring-white/8', className)}
      {...props}
    />
  )
})

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn('w-full rounded-xl bg-glass border border-line px-3.5 py-3 text-sm text-mist placeholder:text-ash outline-none transition-all focus:border-edge focus:ring-2 focus:ring-white/8 resize-none leading-relaxed', className)}
      {...props}
    />
  )
}

/* ─── Select ─── */
export interface SelectOption { value: string; label: string; hint?: string; badge?: string }
export function Select({ value, onChange, options, className, align = 'left' }: { value: string; onChange: (v: string) => void; options: SelectOption[]; className?: string; align?: 'left' | 'right' }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', esc)
    return () => { document.removeEventListener('mousedown', close); document.removeEventListener('keydown', esc) }
  }, [])
  const current = options.find((o) => o.value === value)
  return (
    <div ref={ref} className={cn('relative', className)}>
      <button type="button" onClick={() => setOpen((o) => !o)} className="h-10 w-full rounded-xl bg-glass border border-line px-3.5 flex items-center justify-between gap-2 text-sm text-mist hover:border-edge transition-colors cursor-pointer">
        <span className="truncate">{current?.label ?? 'Select…'}</span>
        <ChevronDown size={14} className={cn('text-ash transition-transform duration-300 shrink-0', open && 'rotate-180')} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className={cn('absolute z-50 mt-2 min-w-full w-max max-w-72 glass-2 rounded-xl p-1.5 shadow-2xl shadow-black/50', align === 'right' ? 'right-0' : 'left-0')}
          >
            {options.map((o) => (
              <button
                key={o.value}
                type="button"
                onClick={() => { onChange(o.value); setOpen(false) }}
                className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer', o.value === value ? 'bg-glass2 text-mist' : 'text-smoke hover:text-mist hover:bg-glass')}
              >
                <span className="flex-1 min-w-0">
                  <span className="block truncate">{o.label}</span>
                  {o.hint && <span className="block text-[11px] text-ash truncate">{o.hint}</span>}
                </span>
                {o.badge && <Badge variant="chrome">{o.badge}</Badge>}
                {o.value === value && <Check size={14} className="text-silver shrink-0" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Slider ─── */
export function Slider({ value, min, max, step = 1, onChange, format }: { value: number; min: number; max: number; step?: number; onChange: (v: number) => void; format?: (v: number) => string }) {
  const pct = ((value - min) / (max - min)) * 100
  return (
    <div className="flex items-center gap-3">
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mx-range flex-1"
        style={{ '--p': `${pct}%` } as React.CSSProperties}
      />
      <span className="text-xs font-mono text-smoke w-12 text-right tabular-nums">{format ? format(value) : value}</span>
    </div>
  )
}

/* ─── Switch ─── */
export function Switch({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={cn('relative h-6 w-11 rounded-full border transition-colors duration-300 cursor-pointer shrink-0', checked ? 'bg-gradient-to-b from-white/90 to-zinc-400 border-white/40' : 'bg-haze border-line')}
    >
      <motion.span
        layout
        transition={{ type: 'spring', stiffness: 500, damping: 32 }}
        className={cn('absolute top-1/2 -translate-y-1/2 h-4.5 w-4.5 rounded-full shadow', checked ? 'right-[3px] bg-void' : 'left-[3px] bg-ash')}
      />
    </button>
  )
}

/* ─── Tabs ─── */
export interface TabItem { id: string; label: string; icon?: ReactNode; badge?: string; disabled?: boolean }
export function Tabs({ items, value, onChange, className, size = 'md' }: { items: TabItem[]; value: string; onChange: (v: string) => void; className?: string; size?: 'sm' | 'md' }) {
  const id = useId()
  return (
    <div className={cn('flex items-center gap-1 p-1 glass rounded-xl w-fit max-w-full overflow-x-auto no-scrollbar', className)}>
      {items.map((it) => (
        <button
          key={it.id}
          type="button"
          disabled={it.disabled}
          onClick={() => onChange(it.id)}
          className={cn('relative flex items-center gap-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed',
            size === 'sm' ? 'h-7.5 px-3 text-xs' : 'h-9 px-4 text-[13px]',
            value === it.id ? 'text-mist' : 'text-ash hover:text-smoke')}
        >
          {value === it.id && <motion.span layoutId={`tab-${id}`} className="absolute inset-0 bg-glass2 border border-edge rounded-lg" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
          <span className="relative z-10 flex items-center gap-1.5">{it.icon}{it.label}{it.badge && <Badge variant="chrome" className="ml-0.5">{it.badge}</Badge>}</span>
        </button>
      ))}
    </div>
  )
}

/* ─── Modal ─── */
export function Modal({ open, onClose, children, className, wide }: { open: boolean; onClose: () => void; children: ReactNode; className?: string; wide?: boolean }) {
  useEffect(() => {
    const esc = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    if (open) {
      document.addEventListener('keydown', esc)
      document.body.style.overflow = 'hidden'
    }
    return () => { document.removeEventListener('keydown', esc); document.body.style.overflow = '' }
  }, [open, onClose])
  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-8">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 10 }}
            transition={{ type: 'spring', stiffness: 380, damping: 32 }}
            className={cn('relative glass-2 rounded-2xl shadow-2xl shadow-black/60 max-h-full overflow-hidden', wide ? 'w-full max-w-6xl' : 'w-full max-w-lg', className)}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/* ─── Dropdown Menu ─── */
export interface MenuEntry { label?: string; icon?: ReactNode; onClick?: () => void; danger?: boolean; divider?: boolean; hint?: string }
export function Menu({ trigger, items, align = 'right', width = 'w-56' }: { trigger: ReactNode; items: MenuEntry[]; align?: 'left' | 'right'; width?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className={cn('absolute z-50 mt-2 glass-2 rounded-xl p-1.5 shadow-2xl shadow-black/50', width, align === 'right' ? 'right-0' : 'left-0')}
          >
            {items.map((it, i) =>
              it.divider ? (
                <div key={i} className="my-1.5 h-px bg-line" />
              ) : (
                <button
                  key={i}
                  type="button"
                  onClick={() => { it.onClick?.(); setOpen(false) }}
                  className={cn('w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors cursor-pointer', it.danger ? 'text-blush hover:bg-blush/10' : 'text-smoke hover:text-mist hover:bg-glass')}
                >
                  {it.icon}
                  <span className="flex-1 text-left">{it.label}</span>
                  {it.hint && <span className="text-[10px] font-mono text-ash">{it.hint}</span>}
                </button>
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─── Tooltip ─── */
export function Tooltip({ label, children, side = 'top' }: { label: string; children: ReactNode; side?: 'top' | 'bottom' | 'left' | 'right' }) {
  const pos = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  }
  return (
    <span className="relative group/tt inline-flex">
      {children}
      <span className={cn('pointer-events-none absolute z-[60] px-2 py-1 rounded-md bg-ink border border-edge text-[10.5px] font-medium text-mist whitespace-nowrap opacity-0 scale-95 transition-all duration-200 group-hover/tt:opacity-100 group-hover/tt:scale-100 shadow-xl', pos[side])}>
        {label}
      </span>
    </span>
  )
}

/* ─── Skeleton ─── */
export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('shimmer bg-glass rounded-xl border border-line', className)} />
}

/* ─── Progress Ring ─── */
export function Ring({ value, size = 84, stroke = 7, children }: { value: number; size?: number; stroke?: number; children?: ReactNode }) {
  const id = useId().replace(/:/g, '')
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff"/>
            <stop offset="60%" stopColor="#c6c9d6"/>
            <stop offset="100%" stopColor="#83869a"/>
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} className="ring-track" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" strokeWidth={stroke} strokeLinecap="round" stroke={`url(#${id})`} strokeDasharray={c} strokeDashoffset={c - (c * value) / 100} style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.22,1,0.36,1)' }} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  )
}

/* ─── Sparkline ─── */
export function Sparkline({ data, width = 120, height = 36, className }: { data: number[]; width?: number; height?: number; className?: string }) {
  const max = Math.max(...data)
  const min = Math.min(...data)
  const pts = data.map((v, i) => `${(i / (data.length - 1)) * width},${height - 3 - ((v - min) / (max - min || 1)) * (height - 6)}`).join(' ')
  return (
    <svg width={width} height={height} className={className}>
      <polyline points={pts} fill="none" stroke="url(#sparkG)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <linearGradient id="sparkG" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#83869a"/>
          <stop offset="100%" stopColor="#f2f3f7"/>
        </linearGradient>
      </defs>
    </svg>
  )
}

/* ─── Marquee ─── */
export function Marquee({ children, fast = false, className }: { children: ReactNode; fast?: boolean; className?: string }) {
  return (
    <div className={cn('overflow-hidden mask-fade-x marquee-hover', className)}>
      <div className={cn('flex w-max gap-6', fast ? 'animate-marquee-fast' : 'animate-marquee')}>
        {children}
        {children}
      </div>
    </div>
  )
}

/* ─── CountUp ─── */
export function CountUp({ to, suffix = '', decimals = 0, className }: { to: number; suffix?: string; decimals?: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-40px' })
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const dur = 1600
    let raf = 0
    const tick = (t: number) => {
      const p = Math.min((t - start) / dur, 1)
      const eased = 1 - Math.pow(1 - p, 4)
      setVal(to * eased)
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to])
  return (
    <span ref={ref} className={cn('tabular-nums', className)}>
      {val.toFixed(decimals)}{suffix}
    </span>
  )
}

/* ─── Accordion ─── */
export function Accordion({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0)
  return (
    <div className="flex flex-col gap-3">
      {items.map((it, i) => (
        <Card key={i} spotlight={false} className={cn('overflow-hidden transition-colors', open === i && 'border-edge')}>
          <button type="button" onClick={() => setOpen(open === i ? null : i)} className="w-full flex items-center justify-between gap-4 px-5 sm:px-6 py-4.5 text-left cursor-pointer">
            <span className="text-[15px] font-medium text-mist">{it.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25 }} className={cn('shrink-0 transition-colors', open === i ? 'text-mist' : 'text-ash')}>
              <Plus size={16} />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}>
                <p clas
