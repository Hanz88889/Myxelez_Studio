import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowRight, AudioLines, Box, Clapperboard, Eraser, Expand, Image as ImageIcon,
  Layers, MousePointer2, PenTool, ScanFace, SlidersHorizontal, Wand2,
} from 'lucide-react'
import { GALLERY, MARQUEE_WORDS } from '../../lib/data'
import { Badge, Card, Marquee, Reveal, SectionHead } from '../../components/ui'

/* ─── Trust marquee ─── */
export function TrustStrip() {
  return (
    <section className="relative py-12 border-y border-line">
      <p className="text-center text-[10.5px] uppercase tracking-[0.34em] text-ash mb-7">Powering independent creators &amp; studios</p>
      <Marquee>
        {MARQUEE_WORDS.map((w) => (
          <span key={w} className="font-display text-lg sm:text-xl font-medium text-ash/70 tracking-[0.18em] uppercase whitespace-nowrap px-4 hover:text-smoke transition-colors">
            {w}
          </span>
        ))}
      </Marquee>
    </section>
  )
}

/* ─── Feature bento ─── */
const TOOLS = [
  { icon: ImageIcon, name: 'Image Generation', desc: 'Photon v2 renders gallery-grade stills with true-to-prompt fidelity.', img: '/media/gen-portrait.jpg', big: true },
  { icon: Clapperboard, name: 'Video Generation', desc: 'Motion v1 directs cinematic clips up to 8s at 1080p.', video: true },
  { icon: ScanFace, name: 'Face Swap', desc: 'Identity-preserving swaps with 98.7% landmark lock.', img: '/media/gen-fashion.jpg' },
  { icon: PenTool, name: 'Image Editing', desc: 'Inpaint, outpaint and relight with brush-level control.', img: '/media/gen-astro.jpg' },
  { icon: Expand, name: 'Upscale 4K', desc: 'Canvas HD reconstructs texture detail, not just pixels.', img: '/media/gen-arch.jpg' },
  { icon: Eraser, name: 'Background Removal', desc: 'Pixel-clean cutouts in one click — ready for compositing.', cutout: true },
]

export function Features() {
  return (
    <section id="features" className="relative py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          center
          kicker="The Engine Room"
          title={<>Every tool. <span className="text-chrome">One workspace.</span></>}
          desc="Eight creation engines share one prompt language, one history, one style system. No exports, no round-trips — everything talks to everything."
        />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TOOLS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.06} className={t.big ? 'sm:col-span-2 sm:row-span-2' : ''}>
              <Card hover className={`group relative overflow-hidden h-full ${t.big ? 'min-h-[26rem]' : 'min-h-56'}`}>
                {t.video ? (
                  <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:opacity-80 group-hover:scale-[1.04] [filter:grayscale(0.5)_brightness(0.7)]">
                    <source src="/media/hero-loop.mp4" type="video/mp4" />
                  </video>
                ) : t.cutout ? (
                  <div className="absolute inset-0 checkerboard flex items-center justify-center">
                    <img src="/media/product-cut.png" alt="Cutout" className="h-[78%] object-contain drop-shadow-[0_20px_30px_rgba(0,0,0,0.6)] transition-transform duration-700 group-hover:scale-105" />
                  </div>
                ) : (
                  <img src={t.img} alt={t.name} className="absolute inset-0 h-full w-full object-cover opacity-55 transition-all duration-700 group-hover:opacity-75 group-hover:scale-[1.04]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-void via-void/35 to-transparent" />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <span className="h-9 w-9 rounded-xl glass-2 flex items-center justify-center text-silver mb-3">
                    <t.icon size={16} />
                  </span>
                  <h3 className="font-display text-lg font-medium text-mist">{t.name}</h3>
                  <p className="text-[13px] text-smoke mt-1 leading-relaxed max-w-xs">{t.desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}

          {/* future: audio + 3D */}
          {[
            { icon: AudioLines, name: 'Audio Synthesis', desc: 'Score, voice and sound design.', tag: 'Q3 2026' },
            { icon: Box, name: '3D Generation', desc: 'Text-to-mesh with PBR materials.', tag: 'In lab' },
          ].map((f, i) => (
            <Reveal key={f.name} delay={0.3 + i * 0.08}>
              <Card className="relative overflow-hidden h-full min-h-44 border-dashed">
                <div className="absolute -top-10 -right-10 h-28 w-28 rounded-full bg-white/5 blur-2xl animate-pulse-soft" />
                <div className="relative h-full flex flex-col justify-end p-5">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span className="h-9 w-9 rounded-xl glass-2 flex items-center justify-center text-ash"><f.icon size={16} /></span>
                    <Badge variant="frost">{f.tag}</Badge>
                  </div>
                  <h3 className="font-display text-lg font-medium text-smoke">{f.name}</h3>
                  <p className="text-[13px] text-ash mt-1">{f.desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─── Workflow ─── */
const STEPS = [
  { n: '01', icon: Wand2, title: 'Describe', desc: 'Prompt in natural language — or pull a battle-tested starting point from the Prompt Library. Negative prompts and references included.', meta: 'Prompt · Negative · References' },
  { n: '02', icon: SlidersHorizontal, title: 'Direct', desc: 'Choose your engine, dial CFG, steps and seed. Apply a style preset or your own Brand Kit for a signature look.', meta: 'Model · CFG · Steps · Seed' },
  { n: '03', icon: Layers, title: 'Refine', desc: 'Batch variations, compare side-by-side, swap faces, erase backgrounds and upscale — all without leaving the canvas.', meta: 'Batch · Compare · Edit · 4K' },
  { n: '04', icon: MousePointer2, title: 'Deliver', desc: 'Organize into projects, save the workflow for next time, and ship via link, download or API webhook.', meta: 'Projects · Workflows · API' },
]

export function Workflow() {
  const [active, setActive] = useState(0)
  return (
    <section id="workflow" className="relative py-24 sm:py-32 border-t border-line">
      <div className="absolute inset-0 bg-grid opacity-25 mask-fade-b pointer-events-none" />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="The Myxelez Way"
          title={<>A workflow that feels <span className="text-chrome">like directing.</span></>}
          desc="Stop pulling levers on a machine. Myxelez treats generation like a film set — you describe the shot, direct the take, and refine until it's right."
        />
        <div className="mt-14 grid lg:grid-cols-2 gap-6 items-start">
          <div className="flex flex-col gap-3">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.07}>
                <button type="button" onClick={() => setActive(i)} className="w-full text-left cursor-pointer">
                  <Card spotlight={false} className={`p-5 transition-all duration-300 ${active === i ? 'border-edge bg-glass2' : 'hover:border-edge'}`}>
                    <div className="flex items-start gap-4">
                      <span className={`font-display text-sm font-medium mt-0.5 ${active === i ? 'text-chrome' : 'text-ash'}`}>{s.n}</span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-lg font-medium text-mist">{s.title}</h3>
                          <s.icon size={17} className={active === i ? 'text-silver' : 'text-ash'} />
                        </div>
                        <AnimatePresence initial={false}>
                          {active === i && (
                            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}>
                              <p className="text-sm text-smoke leading-relaxed mt-2">{s.desc}</p>
                              <p className="text-[10.5px] font-mono text-ash tracking-wider mt-3">{s.meta}</p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>
                  </Card>
                </button>
              </Reveal>
            ))}
          </div>
          <Reveal delay={0.15} className="lg:sticky lg:top-24">
            <Card className="overflow-hidden">
              <div className="relative aspect-[4/3]">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={[GALLERY[0].src, GALLERY[1].src, GALLERY[3].src, GALLERY[5].src][active]}
                    alt={STEPS[active].title}
                    initial={{ opacity: 0, scale: 1.06 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6 }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-void via-transparent to-transparent" />
                <div className="absolute bottom-0 inset-x-0 p-5 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-[0.3em] text-silver">Step {STEPS[active].n}</p>
                    <p className="font-display text-xl font-medium text-white mt-1">{STEPS[active].title}</p>
                  </div>
                  <div className="flex gap-1.5">
                    {STEPS.map((_, i) => (
                      <span key={i} className={`h-1 rounded-full transition-all duration-400 ${i === active ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

/* ─── Showcase marquee ─── */
function ShotCard({ src, title, meta }: { src: string; title: string; meta: string }) {
  return (
    <div className="relative h-64 w-44 sm:h-72 sm:w-52 rounded-2xl overflow-hidden border border-line shrink-0 group">
      <img src={src} alt={title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
      <div className="absolute bottom-0 p-3.5">
        <p className="text-[12px] font-semibold text-white">{title}</p>
        <p className="text-[10px] text-white/60 font-mono">{meta}</p>
      </div>
    </div>
  )
}

export function Showcase() {
  const rowA = GALLERY.slice(0, 6)
  const rowB = GALLERY.slice(6, 12)
  return (
    <section id="showcase" className="relative py-24 sm:py-32 border-t border-line overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          center
          kicker="Community Showcase"
          title={<>Made with <span className="text-chrome">Myxelez.</span></>}
          desc="A rolling feed from creators shipping campaigns, key art, editorials and worlds — every piece generated, refined and delivered inside the Studio."
        />
      </div>
      <div className="mt-14 flex flex-col gap-4">
        <Marquee>
          {rowA.map((g) => <ShotCard key={g.id} src={g.src} title={g.title} meta={`${g.style} · ${g.model}`} />)}
        </Marquee>
        <div className="[direction:rtl]">
          <Marquee fast>
            {rowB.map((g) => <ShotCard key={g.id} src={g.src} title={g.title} meta={`${g.style} · ${g.model}`} />)}
          </Marquee>
        </div>
      </div>
      <div className="mt-12 text-center">
        <Link to="/studio/generate" className="inline-flex items-center gap-2 text-sm font-medium text-silver hover:text-mist transition-colors group">
          Start your own gallery <ArrowRight size={14} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
