import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Check, Clapperboard, Eraser, Expand, Play, ScanFace, Sparkles, Wand2 } from 'lucide-react'
import { GALLERY } from '../../lib/data'
import { Badge, CountUp } from '../../components/ui'

function AppPreview() {
  const imgs = [GALLERY[0], GALLERY[1], GALLERY[2], GALLERY[6]]
  return (
    <div className="glass-2 rounded-2xl overflow-hidden shadow-[0_40px_120px_-30px_rgba(0,0,0,0.9)]">
      {/* window bar */}
      <div className="flex items-center gap-2 px-4 h-10 border-b border-line">
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/12" />
        <span className="ml-3 text-[10px] font-mono text-ash tracking-wider">myxelez.studio/workspace</span>
        <Badge variant="chrome" className="ml-auto">Photon v2</Badge>
      </div>
      <div className="flex">
        {/* mini rail */}
        <div className="hidden sm:flex flex-col items-center gap-3 py-4 px-3 border-r border-line">
          {[Wand2, Clapperboard, ScanFace, Eraser, Expand].map((I, i) => (
            <span key={i} className={`h-8 w-8 rounded-lg flex items-center justify-center ${i === 0 ? 'bg-glass2 border border-edge text-mist' : 'text-ash'}`}>
              <I size={14} />
            </span>
          ))}
        </div>
        <div className="flex-1 p-4">
          {/* prompt bar */}
          <div className="glass rounded-xl px-3.5 py-3 flex items-center gap-3">
            <Sparkles size={14} className="text-silver shrink-0" />
            <p className="text-[12px] text-smoke truncate flex-1">A woman draped in liquid silver light, futuristic noir, volumetric haze…</p>
            <span className="btn-chrome h-7 px-3 rounded-lg text-[11px] font-semibold flex items-center gap-1.5 shrink-0">Generate</span>
          </div>
          {/* results */}
          <div className="grid grid-cols-4 gap-2.5 mt-3">
            {imgs.map((g, i) => (
              <motion.div
                key={g.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1 + i * 0.14, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="relative rounded-lg overflow-hidden border border-line aspect-[3/4] group"
              >
                <img src={g.src} alt={g.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-3 text-[10px] font-mono text-ash">
            <span>seed 84120031 · cfg 7.5 · 32 steps</span>
            <span className="flex items-center gap-1 text-mint"><Check size={11} /> 4/4 complete · 6.2s</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export function Hero() {
  const ref = useRef<HTMLDivElement>(null)
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [5, -5]), { stiffness: 120, damping: 18 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 })
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yPreview = useTransform(scrollYProgress, [0, 1], [0, 140])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0.2])

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section ref={ref} onMouseMove={onMove} className="relative min-h-screen flex flex-col overflow-hidden pt-32 pb-16">
      {/* video + atmosphere */}
      <div className="absolute inset-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-45 [filter:grayscale(0.7)_brightness(0.42)_contrast(1.15)]">
          <source src="/media/hero-loop.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-void/80 via-void/40 to-void" />
        <div className="absolute inset-0 bg-grid opacity-35 mask-fade-b" />
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 h-[34rem] w-[54rem] rounded-full bg-[radial-gradient(ellipse,rgba(198,206,255,0.13),transparent_65%)] blur-3xl animate-drift" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="text-center max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <span className="inline-flex items-center gap-2 glass rounded-full pl-1.5 pr-4 py-1.5 text-xs text-smoke">
              <Badge variant="chrome">New</Badge>
              MYX Motion v1.2 — 8s cinematic video at 1080p
              <ArrowRight size={12} className="text-ash" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="mt-7 font-display font-medium tracking-tight leading-[0.98] text-[2.9rem] sm:text-7xl lg:text-[5.6rem]"
          >
            Create in
            <br />
            <span className="text-chrome">liquid chrome.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.38 }}
            className="mt-6 text-base sm:text-lg text-smoke leading-relaxed max-w-2xl mx-auto"
          >
            Myxelez Studio unifies image, video, face swap, editing, upscale and background removal
            in one cinematic workspace — with a creative resource system that remembers your style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <Link to="/studio/generate"><motion.button whileTap={{ scale: 0.97 }} className="btn-chrome h-12 px-7 rounded-xl text-sm font-semibold inline-flex items-center gap-2.5 cursor-pointer">Start creating — it's free <ArrowRight size={15} /></motion.button></Link>
            <a href="#showcase"><motion.button whileTap={{ scale: 0.97 }} className="glass h-12 px-7 rounded-xl text-sm font-medium text-mist inline-flex items-center gap-2.5 hover:bg-glass2 transition-colors cursor-pointer"><Play size={14} /> Watch the showcase</motion.button></a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-2xl mx-auto"
          >
            {[
              { v: 12.4, s: 'M+', label: 'Generations rendered', d: 1 },
              { v: 140, s: '+', label: 'Style presets', d: 0 },
              { v: 4, s: 'K', label: 'Max output resolution', d: 0 },
              { v: 99.98, s: '%', label: 'Render uptime', d: 2 },
            ].map((st) => (
              <div key={st.label}>
                <p className="font-display text-2xl sm:text-3xl font-medium text-chrome">
                  <CountUp to={st.v} suffix={st.s} decimals={st.d} />
                </p>
                <p className="text-[11px] text-ash mt-1 tracking-wide">{st.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* App preview with tilt */}
        <motion.div style={{ y: yPreview }} className="relative mt-16 sm:mt-20 max-w-4xl mx-auto [perspective:1400px]">
          <motion.div initial={{ opacity: 0, y: 60, rotateX: 14 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ duration: 1.1, delay: 0.65, ease: [0.22, 1, 0.36, 1] }} style={{ rotateX: rx, rotateY: ry }}>
            <AppPreview />
          </motion.div>

          {/* floating chips */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.4 }} className="absolute -left-4 sm:-left-14 top-10 glass-2 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl animate-floaty">
            <span className="h-7 w-7 rounded-lg bg-mint/15 text-mint flex items-center justify-center"><ScanFace size={14} /></span>
            <div><p className="text-[11px] font-semibold text-mist">Face Swap</p><p className="text-[9.5px] text-ash">identity locked · 98.7%</p></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.55 }} className="absolute -right-3 sm:-right-12 top-1/3 glass-2 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl animate-floaty" style={{ animationDelay: '-2.5s' }}>
            <span className="h-7 w-7 rounded-lg bg-frost/15 text-frost flex items-center justify-center"><Expand size={14} /></span>
            <div><p className="text-[11px] font-semibold text-mist">Upscale 4K</p><p className="text-[9.5px] text-ash">detail reconstructed</p></div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.7 }} className="absolute -left-2 sm:-left-10 bottom-6 glass-2 rounded-xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl animate-floaty" style={{ animationDelay: '-4.5s' }}>
            <span className="h-7 w-7 rounded-lg bg-ember/15 text-ember flex items-center justify-center"><Clapperboard size={14} /></span>
            <div><p className="text-[11px] font-semibold text-mist">Motion render</p><p className="text-[9.5px] text-ash">8s · 24fps · 1080p</p></div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
