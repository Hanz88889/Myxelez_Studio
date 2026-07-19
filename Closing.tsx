import { Link } from 'react-router-dom'
import { ArrowRight, Check, Quote, Star } from 'lucide-react'
import { FAQS, FOOTER_COLS, PLANS, TESTIMONIALS } from '../../lib/data'
import { cn, formatIDR } from '../../lib/utils'
import { Accordion, Badge, Button, Card, Logo, Reveal, SectionHead } from '../../components/ui'

/* ─── Pricing ─── */
export function Pricing() {
  return (
    <section id="pricing" className="relative py-24 sm:py-32 border-t border-line">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-72 w-[46rem] rounded-full bg-[radial-gradient(ellipse,rgba(198,206,255,0.08),transparent_65%)] blur-3xl pointer-events-none" />
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        <SectionHead
          center
          kicker="Pay-as-you-go"
          title={<>No subscription. <span className="text-chrome">Just top up & create.</span></>}
          desc="No monthly bill, no renewal date. Buy CR (credits) once, spend them at your own pace, top up again whenever you need more."
        />

        <Reveal className="mt-10 mx-auto max-w-3xl grid sm:grid-cols-3 gap-4 text-center">
          {[
            { step: '1', title: 'Top up sekali', desc: 'Beli paket CR yang kamu mau — bayar sekali, langsung masuk saldo.' },
            { step: '2', title: 'Pakai buat generate', desc: 'Tiap generate motong CR sesuai tool & resolusi yang dipakai.' },
            { step: '3', title: 'Gak ada expired', desc: 'Sisa CR gak direset tiap bulan. Habis? Tinggal top up lagi.' },
          ].map((s) => (
            <div key={s.step} className="glass rounded-2xl p-5">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-full btn-chrome text-[12px] font-bold mb-3">{s.step}</span>
              <p className="text-[13.5px] font-semibold text-mist">{s.title}</p>
              <p className="text-[12px] text-ash mt-1.5 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-5 items-stretch">
          {PLANS.map((p, i) => (
            <Reveal key={p.id} delay={i * 0.09} className="h-full">
              <Card
                spotlight={false}
                hover
                className={cn(
                  'relative h-full flex flex-col p-6 sm:p-7',
                  p.featured && 'border-edge bg-glass2 shadow-[0_0_60px_-18px_rgba(198,206,255,0.35)]',
                )}
              >
                {p.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 btn-chrome h-6 px-3 rounded-full text-[10.5px] font-bold flex items-center gap-1">
                    <Star size={10} fill="currentColor" /> MOST POPULAR
                  </span>
                )}
                <h3 className="font-display text-lg font-medium text-mist">{p.name}</h3>
                <p className="text-[12.5px] text-ash mt-0.5">{p.tagline}</p>
                <div className="mt-5 flex items-end gap-1.5">
                  <span className="font-display text-[2.2rem] leading-none font-medium text-chrome">{formatIDR(p.price)}</span>
                </div>
                <p className="text-[12.5px] text-smoke mt-2">
                  <span className="font-semibold text-mist">{(p.credits + p.bonus).toLocaleString('id-ID')} CR</span>
                  {p.bonus > 0 && <span className="text-mint"> ({p.credits.toLocaleString('id-ID')} + {p.bonus.toLocaleString('id-ID')} bonus)</span>}
                  <span className="text-ash"> · sekali bayar, tanpa expired</span>
                </p>
                <div className="my-6 h-px bg-line" />
                <ul className="flex flex-col gap-2.5 flex-1">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-[13px] text-smoke">
                      <Check size={14} className="text-silver mt-0.5 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/studio/settings?tab=topup" className="mt-7">
                  <Button variant={p.featured ? 'chrome' : 'glass'} className="w-full">{p.cta}</Button>
                </Link>
              </Card>
            </Reveal>
          ))}
        </div>
        <Reveal className="mt-8 text-center">
          <p className="text-[12px] text-ash">Harga sudah termasuk PPN. Kredit tidak memiliki masa berlaku dan tidak direset tiap bulan.</p>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Testimonials ─── */
export function Testimonials() {
  return (
    <section className="relative py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          center
          kicker="Loved by creators"
          title={<>The word on <span className="text-chrome">the street.</span></>}
        />
        <div className="mt-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={(i % 3) * 0.08}>
              <Card hover className="p-6 h-full flex flex-col">
                <Quote size={18} className="text-ash mb-4" />
                <p className="text-[14px] leading-relaxed text-smoke flex-1">“{t.quote}”</p>
                <div className="flex items-center gap-3 mt-6 pt-5 border-t border-line">
                  <img src={t.avatar} alt={t.name} className="h-10 w-10 rounded-full object-cover ring-1 ring-edge" />
                  <div>
                    <p className="text-[13px] font-semibold text-mist">{t.name}</p>
                    <p className="text-[11.5px] text-ash">{t.role}</p>
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── FAQ ─── */
export function Faq() {
  return (
    <section id="faq" className="relative py-24 sm:py-32 border-t border-line">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <SectionHead center kicker="FAQ" title={<>Questions, <span className="text-chrome">answered.</span></>} />
        <div className="mt-12">
          <Accordion items={FAQS} />
        </div>
      </div>
    </section>
  )
}

/* ─── CTA ─── */
export function Cta() {
  return (
    <section className="relative py-24 sm:py-28">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Reveal>
          <div className="relative overflow-hidden rounded-[2rem] border border-edge">
            <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-35 [filter:grayscale(0.75)_brightness(0.5)_contrast(1.2)]">
              <source src="/media/hero-loop.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-to-b from-void/60 via-void/30 to-void/80" />
            <div className="absolute inset-0 bg-grid opacity-20" />
            <div className="relative px-6 py-20 sm:py-28 text-center">
              <Logo size={64} className="justify-center mx-auto" />
              <h2 className="mt-8 font-display text-4xl sm:text-6xl font-medium tracking-tight leading-[1.02]">
                Your next world is<br /><span className="text-chrome">one prompt away.</span>
              </h2>
              <p className="mt-5 text-smoke max-w-xl mx-auto text-[15px] leading-relaxed">
                Join 2.1 million creators rendering campaigns, films and worlds with Myxelez Studio. Free plan, no card required.
              </p>
              <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link to="/studio/generate"><Button variant="chrome" size="lg">Launch the Studio <ArrowRight size={15} /></Button></Link>
                <Link to="/studio/generate"><Button variant="glass" size="lg">Try a live generation</Button></Link>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}

/* ─── Footer ─── */
export function Footer() {
  return (
    <footer className="relative border-t border-line overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-16 pb-8">
        <div className="grid lg:grid-cols-[1.4fr_repeat(4,1fr)] gap-10">
          <div>
            <Logo size={40} withWordmark />
            <p className="mt-5 text-[13px] text-ash leading-relaxed max-w-xs">
              The cinematic AI creative platform. Image, video, face swap, editing, upscale and beyond — in liquid chrome.
            </p>
            <div className="flex items-center gap-2 mt-6">
              <Badge variant="mint">All systems operational</Badge>
            </div>
          </div>
          {FOOTER_COLS.map((col) => (
            <div key={col.title}>
              <p className="text-[10.5px] font-semibold uppercase tracking-[0.24em] text-ash mb-4">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((l) => (
                  <li key={l}>
                    <Link to="/studio" className="text-[13px] text-smoke hover:text-mist transition-colors">{l}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 select-none pointer-events-none overflow-hidden">
          <p className="font-display font-semibold text-center text-[16vw] leading-[0.85] tracking-[0.08em] outline-text opacity-60">MYXELEZ</p>
        </div>
        <div className="mt-8 pt-6 border-t border-line flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11.5px] text-ash">© 2026 Myxelez Studio. Crafted in liquid chrome.</p>
          <div className="flex items-center gap-5 text-[11.5px] text-ash">
            <span className="hover:text-mist transition-colors cursor-pointer">Privacy</span>
            <span className="hover:text-mist transition-colors cursor-pointer">Terms</span>
            <span className="hover:text-mist transition-colors cursor-pointer">Status</span>
            <span className="font-mono">v2.4.1</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
