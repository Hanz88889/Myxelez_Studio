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
    <section className="relative py-20 border-y border-white/[0.04] bg-black/40 backdrop-blur-2xl overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[150px] bg-white/[0.02] blur-[100px] rounded-full pointer-events-none" />
      <p className="text-center text-[11px] font-mono uppercase tracking-[0.4em] text-white/40 mb-10">
        Powering independent creators &amp; studios
      </p>
      <Marquee>
        {MARQUEE_WORDS.map((w) => (
          <span key={w} className="font-display text-lg sm:text-2xl font-light text-white/30 tracking-[0.2em] uppercase whitespace-nowrap px-8 hover:text-white transition-colors duration-500 cursor-default">
            {w}
          </span>
        ))}
      </Marquee>
    </section>
  )
}

/* ─── Feature bento ─── */
const TOOLS = [
  { icon: ImageIcon, name: 'Image Generation', desc: 'Photon v2 renders gallery-grade stills with true-to-prompt fidelity.', img: 'public/media/gen-potrait.jpg', big: true },
  { icon: Clapperboard, name: 'Video Generation', desc: 'Motion v1 directs cinematic clips up to 8s at 1080p.', video: true },
  { icon: ScanFace, name: 'Face Swap', desc: 'Identity-preserving swaps with 98.7% landmark lock.', img: 'public/media/gen-fashion.jpg' },
  { icon: PenTool, name: 'Image Editing', desc: 'Inpaint, outpaint and relight with brush-level control.', img: 'public/media/gen-astro.jpg' },
  { icon: Expand, name: 'Upscale 4K', desc: 'Canvas HD reconstructs texture detail, not just pixels.', img: 'public/media/gen-arch.jpg' },
  { icon: Eraser, name: 'Background Removal', desc: 'Pixel-clean cutouts in one click — ready for compositing.', cutout: true },
]

export function Features() {
  return (
    <section id="features" className="relative py-32 sm:py-40 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          center
          kicker="The Engine Room"
          title={<>Every tool. <span className="text-white/40">One workspace.</span></>}
          desc="Eight creation engines share one prompt language, one history, one style system. No exports, no round-trips — everything talks to everything."
        />
        <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {TOOLS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08} className={t.big ? 'sm:col-span-2 sm:row-span-2' : ''}>
              <Card hover className={`group relative overflow-hidden h-full rounded-3xl border border-white/[0.06] bg-white/[0.01] shadow-[0_0_0_1px_rgba(255,255,255,0.02)] transition-all duration-700 hover:border-white/[0.12] hover:bg-white/[0.02] ${t.big ? 'min-h-[28rem]' : 'min-h-[18rem]'}`}>
                {/* Fallback elegant gradient if image is missing */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-neutral-800/40 via-neutral-950 to-black z-0" />
                
                {t.video ? (
                  <video autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover opacity-50 mix-blend-lighten transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-80 group-hover:scale-105 z-10">
                    <source src="/media/hero-loop.mp4" type="video/mp4" />
                  </video>
                ) : t.cutout ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white/[0.03] to-transparent z-10">
                    <img src="/media/product-cut.png" alt="Cutout" className="h-[75%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 text-transparent" />
                  </div>
                ) : (
                  <img src={t.img} alt={t.name} className="absolute inset-0 h-full w-full object-cover opacity-40 mix-blend-lighten transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:opacity-70 group-hover:scale-105 text-transparent z-10" />
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-20" />
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-8 z-30">
                  <span className="h-10 w-10 rounded-2xl bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl flex items-center justify-center text-white mb-4 shadow-[0_4px_24px_rgba(0,0,0,0.4)]">
                    <t.icon size={18} strokeWidth={1.5} />
                  </span>
                  <h3 className="font-display text-xl font-medium text-white tracking-tight">{t.name}</h3>
                  <p className="text-[14px] text-white/50 mt-2 leading-relaxed max-w-[280px]">{t.desc}</p>
                </div>
              </Card>
            </Reveal>
          ))}

          {/* Future: audio + 3D */}
          {[
            { icon: AudioLines, name: 'Audio Synthesis', desc: 'Score, voice and sound design.', tag: 'Q3 2026' },
            { icon: Box, name: '3D Generation', desc: 'Text-to-mesh with PBR materials.', tag: 'In lab' },
          ].map((f, i) => (
            <Reveal key={f.name} delay={0.4 + i * 0.1}>
              <Card className="group relative overflow-hidden h-full min-h-[14rem] rounded-3xl border border-white/[0.04] border-dashed bg-white/[0.01] hover:bg-white/[0.02] transition-colors duration-500">
                <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/[0.03] blur-3xl group-hover:bg-white/[0.05] transition-colors duration-700" />
                <div className="relative h-full flex flex-col justify-end p-6 sm:p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="h-10 w-10 rounded-2xl bg-white/[0.02] border border-white/[0.04] flex items-center justify-center text-white/40">
                      <f.icon size={18} strokeWidth={1.5} />
                    </span>
                    <Badge variant="frost" className="bg-white/[0.03] text-white/40 border-white/[0.05]">{f.tag}</Badge>
                  </div>
                  <h3 className="font-display text-xl font-medium text-white/70 tracking-tight">{f.name}</h3>
                  <p className="text-[14px] text-white/40 mt-2 leading-relaxed">{f.desc}</p>
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
    <section id="workflow" className="relative py-32 sm:py-40 border-t border-white/[0.04] bg-black overflow-hidden">
      {/* Luxury Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/[0.02] to-transparent pointer-events-none" />
      <div className="absolute -left-[20%] top-[20%] w-[50%] h-[50%] bg-[radial-gradient(circle,_rgba(255,255,255,0.03)_0%,_transparent_70%)] pointer-events-none blur-3xl" />
      
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          kicker="The Myxelez Way"
          title={<>A workflow that feels <span className="text-white/40">like directing.</span></>}
          desc="Stop pulling levers on a machine. Myxelez treats generation like a film set — you describe the shot, direct the take, and refine until it's right."
        />
        <div className="mt-20 grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          <div className="lg:col-span-5 flex flex-col gap-4">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 0.08}>
                <button type="button" onClick={() => setActive(i)} className="w-full text-left cursor-pointer group outline-none">
                  <Card spotlight={false} className={`p-6 sm:p-7 rounded-3xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${active === i ? 'bg-white/[0.03] border-white/[0.12] shadow-[0_8px_32px_rgba(0,0,0,0.4)]' : 'bg-transparent border-transparent hover:bg-white/[0.01] hover:border-white/[0.04]'}`}>
                    <div className="flex items-start gap-5">
                      <span className={`font-mono text-[13px] font-medium mt-1 transition-colors duration-300 ${active === i ? 'text-white' : 'text-white/30 group-hover:text-white/50'}`}>
                        {s.n}
                      </span>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <h3 className={`font-display text-xl font-medium tracking-tight transition-colors duration-300 ${active === i ? 'text-white' : 'text-white/50 group-hover:text-white/80'}`}>
                            {s.title}
                          </h3>
                          <s.icon size={18} strokeWidth={1.5} className={`transition-colors duration-300 ${active === i ? 'text-white' : 'text-white/20 group-hover:text-white/40'}`} />
                        </div>
                        <AnimatePresence initial={false}>
                          {active === i && (
                            <motion.div 
                              initial={{ height: 0, opacity: 0 }} 
                              animate={{ height: 'auto', opacity: 1 }} 
                              exit={{ height: 0, opacity: 0 }} 
                              transition={{ type: "spring", bounce: 0, duration: 0.6 }}
                              className="overflow-hidden"
                            >
                              <p className="text-[15px] text-white/60 leading-relaxed mt-3">{s.desc}</p>
                              <div className="mt-5 flex items-center gap-2">
                                <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-white/30">{s.meta}</p>
                              </div>
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
          <Reveal delay={0.2} className="lg:col-span-7 lg:sticky lg:top-32 mt-8 lg:mt-0">
            <Card className="overflow-hidden rounded-[2rem] border border-white/[0.08] bg-neutral-950 shadow-2xl p-2 sm:p-3">
              <div className="relative aspect-[4/3] rounded-[1.5rem] overflow-hidden bg-black">
                {/* Fallback gradient background */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-neutral-800 to-black z-0" />
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={[GALLERY[0].src, GALLERY[1].src, GALLERY[3].src, GALLERY[5].src][active]}
                    alt={STEPS[active].title}
                    initial={{ opacity: 0, scale: 1.05, filter: 'blur(10px)' }}
                    animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                    exit={{ opacity: 0, scale: 0.98, filter: 'blur(5px)' }}
                    transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover text-transparent z-10"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent z-20" />
                <div className="absolute bottom-0 inset-x-0 p-6 sm:p-8 flex items-end justify-between z-30">
                  <div>
                    <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-white/50 mb-2">Step {STEPS[active].n}</p>
                    <p className="font-display text-2xl font-medium text-white tracking-tight">{STEPS[active].title}</p>
                  </div>
                  <div className="flex gap-2">
                    {STEPS.map((_, i) => (
                      <span 
                        key={i} 
                        className={`h-1.5 rounded-full transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${i === active ? 'w-8 bg-white' : 'w-2 bg-white/20'}`} 
                      />
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
    <div className="relative h-[22rem] w-[15rem] sm:h-[28rem] sm:w-[19rem] rounded-[2rem] overflow-hidden border border-white/[0.06] bg-neutral-900 shrink-0 group mx-2 sm:mx-3 shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-br from-neutral-800 to-black z-0" />
      <img src={src} alt={title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110 text-transparent z-10" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-700 z-20" />
      <div className="absolute bottom-0 inset-x-0 p-6 z-30 translate-y-2 group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]">
        <p className="text-[15px] font-medium text-white tracking-tight leading-snug">{title}</p>
        <p className="text-[11px] text-white/50 font-mono tracking-widest mt-2 uppercase">{meta}</p>
      </div>
    </div>
  )
}

export function Showcase() {
  const rowA = GALLERY.slice(0, 6)
  const rowB = GALLERY.slice(6, 12)
  return (
    <section id="showcase" className="relative py-32 sm:py-40 border-t border-white/[0.04] bg-black overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <SectionHead
          center
          kicker="Community Showcase"
          title={<>Made with <span className="text-white/40">Myxelez.</span></>}
          desc="A rolling feed from creators shipping campaigns, key art, editorials and worlds — every piece generated, refined and delivered inside the Studio."
        />
      </div>
      <div className="mt-20 flex flex-col gap-6 sm:gap-8">
        <Marquee>
          {rowA.map((g) => <ShotCard key={g.id} src={g.src} title={g.title} meta={`${g.style} · ${g.model}`} />)}
        </Marquee>
        <div className="[direction:rtl]">
          <Marquee fast>
            {rowB.map((g) => <ShotCard key={g.id} src={g.src} title={g.title} meta={`${g.style} · ${g.model}`} />)}
          </Marquee>
        </div>
      </div>
      <div className="mt-20 text-center relative z-10">
        <Link to="/studio/generate" className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black text-sm font-semibold hover:bg-neutral-200 hover:scale-105 transition-all duration-300 ease-out shadow-[0_0_40px_rgba(255,255,255,0.15)] group">
          Start your own gallery <ArrowRight size={16} strokeWidth={2.5} className="transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
