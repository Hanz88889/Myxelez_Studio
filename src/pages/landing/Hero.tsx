import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, Check, Clapperboard, Eraser, Expand, Play, ScanFace, Sparkles, Wand2 } from 'lucide-react'
import { GALLERY } from '../../lib/data'
import { Badge, CountUp } from '../../components/ui'

function AppPreview() {
  const imgs = [GALLERY[0], GALLERY[1], GALLERY[2], GALLERY[6]]
  
  return (
    <div className="relative rounded-2xl overflow-hidden bg-black/40 backdrop-blur-3xl border border-white/10 shadow-[0_0_80px_-20px_rgba(255,255,255,0.08)] ring-1 ring-white/5">
      {/* Window bar */}
      <div className="flex items-center px-4 h-11 border-b border-white/5 bg-white/[0.02]">
        <div className="flex gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/50" />
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-700/50" />
        </div>
        <span className="ml-4 text-[11px] font-mono text-zinc-500 tracking-wider">myxelez.studio/workspace</span>
        <div className="ml-auto">
          <Badge variant="chrome">Photon v2</Badge>
        </div>
      </div>
      
      <div className="flex">
        {/* Mini rail sidebar */}
        <div className="hidden sm:flex flex-col items-center gap-4 py-5 px-3 border-r border-white/5 bg-white/[0.01]">
          {[Wand2, Clapperboard, ScanFace, Eraser, Expand].map((Icon, i) => (
            <span 
              key={i} 
              className={`h-9 w-9 rounded-xl flex items-center justify-center transition-all duration-300 ${
                i === 0 
                  ? 'bg-white/10 text-white shadow-sm ring-1 ring-white/20' 
                  : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              <Icon size={16} />
            </span>
          ))}
        </div>
        
        <div className="flex-1 p-5 lg:p-6">
          {/* Prompt bar */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 flex items-center gap-3 backdrop-blur-md shadow-inner">
            <Sparkles size={15} className="text-zinc-400 shrink-0" />
            <p className="text-[13px] text-zinc-200 truncate flex-1 font-medium tracking-wide">
              A woman draped in liquid silver light, futuristic noir, volumetric haze…
            </p>
            <button className="bg-white text-black h-8 px-4 rounded-lg text-[12px] font-semibold flex items-center gap-1.5 shrink-0 hover:bg-zinc-200 transition-colors">
              Generate
            </button>
          </div>
          
          {/* Results grid */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {imgs.map((g, i) => (
              <motion.div
                key={g?.id || i}
                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                className="relative rounded-xl overflow-hidden border border-white/10 aspect-[3/4] group bg-zinc-900"
              >
                {/* Fallback abstract UI layer for missing assets */}
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-zinc-800 via-zinc-900 to-black" />
                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:12px_12px]" />
                
                {g?.src && (
                  <img 
                    src={g.src} 
                    alt={g.title || 'Generated image'} 
                    className="relative z-10 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
                    onError={(e) => { e.currentTarget.style.opacity = '0' }}
                  />
                )}
                
                <div className="absolute z-20 inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </motion.div>
            ))}
          </div>
          
          <div className="flex items-center justify-between mt-4 text-[11px] font-mono text-zinc-500">
            <span>seed 84120031 · cfg 7.5 · 32 steps</span>
            <span className="flex items-center gap-1.5 text-emerald-400/90 font-medium tracking-wide">
              <Check size={12} /> 4/4 complete · 6.2s
            </span>
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
  
  // Smoother, Apple-like spring physics
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 100, damping: 20 })
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 100, damping: 20 })
  
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const yPreview = useTransform(scrollYProgress, [0, 1], [0, 180])
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top) / r.height - 0.5)
  }

  return (
    <section 
      ref={ref} 
      onMouseMove={onMove} 
      className="relative min-h-screen flex flex-col overflow-hidden pt-32 sm:pt-40 pb-20 bg-black selection:bg-white/20"
    >
      {/* Background & Atmosphere */}
      <div className="absolute inset-0 pointer-events-none">
        <video 
          autoPlay 
          muted 
          loop 
          playsInline 
          className="h-full w-full object-cover opacity-20 mix-blend-screen [filter:grayscale(1)_contrast(1.2)]"
        >
          <source src="/media/hero-loop.mp4" type="video/mp4" />
        </video>
        {/* Luxury gradient masks */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,black_100%)]" />
        
        {/* Subtle top glow */}
        <div className="absolute -top-[40%] left-1/2 -translate-x-1/2 h-[50rem] w-[70rem] rounded-full bg-[radial-gradient(ellipse,rgba(255,255,255,0.04),transparent_60%)] blur-3xl" />
      </div>

      <motion.div style={{ opacity }} className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 w-full">
        <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/5 pl-1.5 pr-4 py-1.5 text-xs text-zinc-300 backdrop-blur-md shadow-[0_0_20px_rgba(255,255,255,0.03)] hover:bg-white/10 transition-colors cursor-pointer">
              <Badge variant="chrome">New</Badge>
              <span className="font-medium tracking-wide">MYX Motion v1.2 — 8s cinematic video at 1080p</span>
              <ArrowRight size={14} className="text-zinc-500" />
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 font-display font-medium tracking-tighter leading-[1.05] text-[3.2rem] sm:text-7xl lg:text-[6rem] text-white"
          >
            Create in
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-200 via-white to-zinc-500">
              liquid chrome.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-base sm:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto tracking-wide font-light"
          >
            Myxelez Studio unifies image, video, face swap, editing, upscale and background removal
            in one cinematic workspace — with a creative resource system that remembers your style.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
          >
            <Link to="/studio" className="w-full sm:w-auto">
              <motion.button 
                whileTap={{ scale: 0.98 }} 
                className="w-full sm:w-auto bg-white text-black h-12 px-8 rounded-full text-sm font-semibold inline-flex items-center justify-center gap-2 hover:bg-zinc-200 hover:scale-[1.02] transition-all duration-300"
              >
                Start creating — it's free <ArrowRight size={16} />
              </motion.button>
            </Link>
            <a href="#showcase" className="w-full sm:w-auto">
              <motion.button 
                whileTap={{ scale: 0.98 }} 
                className="w-full sm:w-auto bg-white/5 border border-white/10 text-white h-12 px-8 rounded-full text-sm font-medium inline-flex items-center justify-center gap-2.5 hover:bg-white/10 hover:border-white/20 transition-all duration-300 backdrop-blur-md"
              >
                <Play size={14} className="fill-white/80" /> Watch the showcase
              </motion.button>
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.8 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 sm:gap-12 max-w-3xl mx-auto border-t border-white/10 pt-10"
          >
            {[
              { v: 12.4, s: 'M+', label: 'Generations rendered', d: 1 },
              { v: 140, s: '+', label: 'Style presets', d: 0 },
              { v: 4, s: 'K', label: 'Max output resolution', d: 0 },
              { v: 99.98, s: '%', label: 'Render uptime', d: 2 },
            ].map((st, idx) => (
              <div key={st.label} className="flex flex-col items-center sm:items-start text-center sm:text-left">
                <p className="font-display text-3xl sm:text-4xl font-semibold text-white tracking-tight">
                  <CountUp to={st.v} suffix={st.s} decimals={st.d} />
                </p>
                <p className="text-[12px] text-zinc-500 mt-1.5 tracking-wider uppercase font-medium">{st.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* 3D App preview composition */}
        <motion.div 
          style={{ y: yPreview }} 
          className="relative mt-20 sm:mt-28 max-w-[1000px] mx-auto [perspective:2000px] z-20"
        >
          <motion.div 
            initial={{ opacity: 0, y: 100, rotateX: 15, scale: 0.9 }} 
            animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }} 
            transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }} 
            style={{ rotateX: rx, rotateY: ry }}
          >
            <AppPreview />
          </motion.div>

          {/* Premium Floating Chips */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: 20 }} 
            animate={{ opacity: 1, scale: 1, x: 0 }} 
            transition={{ delay: 1.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="absolute -left-4 sm:-left-16 top-12 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl animate-floaty"
          >
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center">
              <ScanFace size={16} />
            </span>
            <div className="pr-2">
              <p className="text-[12px] font-semibold text-zinc-100 tracking-wide">Face Swap</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">identity locked · 98.7%</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, x: -20 }} 
            animate={{ opacity: 1, scale: 1, x: 0 }} 
            transition={{ delay: 1.8, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="absolute -right-3 sm:-right-14 top-1/3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl animate-floaty" 
            style={{ animationDelay: '-2s' }}
          >
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Expand size={16} />
            </span>
            <div className="pr-2">
              <p className="text-[12px] font-semibold text-zinc-100 tracking-wide">Upscale 4K</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">detail reconstructed</p>
            </div>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            transition={{ delay: 2.0, duration: 0.8, ease: [0.16, 1, 0.3, 1] }} 
            className="absolute -left-2 sm:-left-12 bottom-10 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-3 flex items-center gap-3 shadow-2xl animate-floaty" 
            style={{ animationDelay: '-4s' }}
          >
            <span className="h-9 w-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-rose-500/20 border border-orange-500/30 text-orange-400 flex items-center justify-center">
              <Clapperboard size={16} />
            </span>
            <div className="pr-2">
              <p className="text-[12px] font-semibold text-zinc-100 tracking-wide">Motion render</p>
              <p className="text-[10px] text-zinc-500 font-mono mt-0.5">8s · 24fps · 1080p</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  )
}
