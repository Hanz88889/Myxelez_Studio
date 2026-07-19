import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft, Check, Clapperboard, Columns2, Download, History, Link2, Maximize2,
  Minimize2, Minus, Play, Plus, RotateCcw, Share2, Sparkles,
} from 'lucide-react'
import { cn, copyText, downloadFile } from '../../lib/utils'
import { Button, Tooltip, useToast } from '../../components/ui'
import type { ResultItem, ToolId } from './shared'
import { TOOLS } from './shared'

const STATUS_LINES = ['Allocating render node…', 'Encoding prompt tokens…', 'Diffusing latents…', 'Sampling steps…', 'Refining details…', 'Color grading…', 'Finalizing output…']

function CompareSlider({ a, b, checkerB }: { a: string; b: string; checkerB?: boolean }) {
  const ref = useRef<HTMLDivElement>(null)
  const [pct, setPct] = useState(50)
  const dragging = useRef(false)
  const update = (clientX: number) => {
    const r = ref.current?.getBoundingClientRect()
    if (!r) return
    setPct(Math.min(96, Math.max(4, ((clientX - r.left) / r.width) * 100)))
  }
  return (
    <div
      ref={ref}
      className="relative h-full w-full overflow-hidden select-none cursor-ew-resize touch-none"
      onPointerDown={(e) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); update(e.clientX) }}
      onPointerMove={(e) => dragging.current && update(e.clientX)}
      onPointerUp={() => { dragging.current = false }}
    >
      <img src={a} alt="Before" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      <div className={cn('absolute inset-0', checkerB && 'checkerboard')} style={{ clipPath: `inset(0 0 0 ${pct}%)` }}>
        <img src={b} alt="After" className="absolute inset-0 h-full w-full object-contain" draggable={false} />
      </div>
      <span className="absolute top-3 left-3 text-[10px] font-mono uppercase tracking-widest bg-black/55 backdrop-blur text-white px-2 py-1 rounded-md">A · Original</span>
      <span className="absolute top-3 right-3 text-[10px] font-mono uppercase tracking-widest bg-black/55 backdrop-blur text-white px-2 py-1 rounded-md">B · Result</span>
      <div className="absolute inset-y-0" style={{ left: `${pct}%` }}>
        <div className="absolute inset-y-0 -left-px w-0.5 bg-white/85 shadow-[0_0_12px_rgba(255,255,255,0.6)]" />
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-9 w-9 rounded-full bg-white text-black flex items-center justify-center shadow-xl">
          <Columns2 size={15} />
        </div>
      </div>
    </div>
  )
}

interface Props {
  tool: ToolId
  results: ResultItem[]
  generating: boolean
  progress: number
  batch: number
  history: ResultItem[]
  onRegenerate: () => void
  comparePair: [string, string] | null
}

export function Preview({ tool, results, generating, progress, batch, history, onRegenerate, comparePair }: Props) {
  const [solo, setSolo] = useState<ResultItem | null>(null)
  const [zoom, setZoom] = useState(1)
  const [compare, setCompare] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [statusIdx, setStatusIdx] = useState(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const toast = useToast()
  const toolMeta = TOOLS.find((t) => t.id === tool)!

  useEffect(() => { setSolo(null); setCompare(false); setZoom(1) }, [results, tool])
  useEffect(() => {
    if (!generating) return
    const t = setInterval(() => setStatusIdx((i) => (i + 1) % STATUS_LINES.length), 900)
    return () => clearInterval(t)
  }, [generating])
  useEffect(() => {
    const onFs = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', onFs)
    return () => document.removeEventListener('fullscreenchange', onFs)
  }, [])

  const current = solo ?? (results.length === 1 ? results[0] : null)
  const canCompare = !generating && (comparePair !== null || results.length > 1)
  const compareA = comparePair?.[0] ?? results[0]?.src
  const compareB = comparePair?.[1] ?? current?.src ?? results[1]?.src

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) panelRef.current?.requestFullscreen?.().catch(() => toast('Fullscreen not available', 'err'))
    else document.exitFullscreen()
  }

  const doDownload = () => {
    const item = current ?? results[0]
    if (!item) return
    downloadFile(item.src, `myxelez-${item.tool}-${item.seed}.${item.kind === 'video' ? 'mp4' : item.src.endsWith('.png') ? 'png' : 'jpg'}`)
    toast('Download started')
  }

  const doShare = async () => {
    const item = current ?? results[0]
    await copyText(`${window.location.origin}/studio/generate?shared=${item?.seed ?? 'myx'}`)
    toast('Share link copied to clipboard')
  }

  return (
    <div ref={panelRef} className="glass rounded-2xl flex flex-col overflow-hidden bg-ink/60 min-h-[30rem]">
      {/* toolbar */}
      <div className="flex items-center gap-1.5 px-3.5 h-12 border-b border-line shrink-0 flex-wrap">
        {current && results.length > 1 && !generating && (
          <Tooltip label="Back to grid"><Button variant="ghost" size="icon-sm" onClick={() => { setSolo(null); setZoom(1); setCompare(false) }}><ArrowLeft size={14} /></Button></Tooltip>
        )}
        <div className="flex items-center gap-1 glass rounded-lg px-1 py-0.5">
          <Tooltip label="Zoom out"><Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={() => setZoom((z) => Math.max(0.25, z - 0.25))} disabled={!current}><Minus size={13} /></Button></Tooltip>
          <button type="button" onClick={() => setZoom(1)} className="text-[10.5px] font-mono text-smoke w-11 text-center hover:text-mist transition-colors cursor-pointer">{Math.round(zoom * 100)}%</button>
          <Tooltip label="Zoom in"><Button variant="ghost" size="icon-sm" className="h-7 w-7" onClick={() => setZoom((z) => Math.min(4, z + 0.25))} disabled={!current}><Plus size={13} /></Button></Tooltip>
        </div>
        <Tooltip label="Fit to view"><Button variant="ghost" size="icon-sm" onClick={() => setZoom(1)} disabled={!current}><RotateCcw size={13} /></Button></Tooltip>
        <div className="w-px h-5 bg-line mx-0.5" />
        <Tooltip label="Compare A/B">
          <Button variant={compare ? 'outline' : 'ghost'} size="icon-sm" onClick={() => canCompare && setCompare((c) => !c)} disabled={!canCompare} className={cn(compare && 'border-white/30')}><Columns2 size={14} /></Button>
        </Tooltip>
        <Tooltip label={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}>
          <Button variant="ghost" size="icon-sm" onClick={toggleFullscreen}>{isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}</Button>
        </Tooltip>
        <div className="flex-1" />
        <Tooltip label="Download">
          <Button variant="ghost" size="icon-sm" onClick={doDownload} disabled={results.length === 0 || generating}><Download size={14} /></Button>
        </Tooltip>
        <Tooltip label="Copy share link">
          <Button variant="ghost" size="icon-sm" onClick={doShare} disabled={results.length === 0 || generating}><Share2 size={14} /></Button>
        </Tooltip>
        <Button variant="chrome" size="sm" onClick={onRegenerate} disabled={generating} className="ml-1">
          <Sparkles size={13} /> Regenerate
        </Button>
      </div>

      {/* canvas */}
      <div className="relative flex-1 min-h-[22rem] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.03),transparent_70%)]">
        <AnimatePresence mode="wait">
          {generating ? (
            <motion.div key="gen" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-4 sm:p-6 flex flex-col">
              <div className={cn('grid gap-3 flex-1', batch > 1 ? (batch === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4') : 'grid-cols-1')}>
                {Array.from({ length: batch }).map((_, i) => (
                  <div key={i} className="gen-scan rounded-xl bg-glass border border-line" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
              <div className="mt-4">
                <div className="flex items-center justify-between text-[11px] font-mono text-ash mb-2">
                  <AnimatePresence mode="wait">
                    <motion.span key={statusIdx} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}>{STATUS_LINES[statusIdx]}</motion.span>
                  </AnimatePresence>
                  <span className="text-silver">{Math.round(progress)}%</span>
                </div>
                <div className="h-1 rounded-full bg-haze overflow-hidden">
                  <div className="h-full rounded-full bg-gradient-to-r from-zinc-500 via-zinc-200 to-white transition-[width] duration-200" style={{ width: `${progress}%` }} />
                </div>
              </div>
            </motion.div>
          ) : compare && canCompare ? (
            <motion.div key="compare" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-4">
              <div className="h-full rounded-xl overflow-hidden border border-line bg-black/30">
                {compareA && compareB && <CompareSlider a={compareA} b={compareB} checkerB={tool === 'bgremove'} />}
              </div>
            </motion.div>
          ) : current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className={cn('absolute inset-0 overflow-hidden flex items-center justify-center', current.checker && 'checkerboard')}
              onWheel={(e) => setZoom((z) => Math.min(4, Math.max(0.25, z - Math.sign(e.deltaY) * 0.15)))}
            >
              {current.kind === 'video' ? (
                <video src={current.src} poster={current.poster} controls autoPlay muted loop className="max-h-full max-w-full rounded-lg" style={{ transform: `scale(${zoom})`, transition: 'transform .25s' }} />
              ) : (
                <img src={current.src} alt={current.label} className="max-h-full max-w-full object-contain" style={{ transform: `scale(${zoom})`, transition: 'transform .25s' }} draggable={false} />
              )}
              <div className="absolute bottom-3 left-3 glass-2 rounded-lg px-3 py-1.5 flex items-center gap-2 pointer-events-none">
                {current.kind === 'video' ? <Clapperboard size={11} className="text-silver" /> : <Check size={11} className="text-mint" />}
                <span className="text-[11px] font-medium text-mist">{current.label}</span>
                <span className="text-[10px] font-mono text-ash">{current.meta}</span>
              </div>
            </motion.div>
          ) : results.length > 0 ? (
            <motion.div key="grid" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 p-4 sm:p-5">
              <div className={cn('grid gap-3 h-full', results.length === 2 ? 'grid-cols-2' : 'grid-cols-2 sm:grid-cols-4')}>
                {results.map((r, i) => (
                  <motion.button
                    key={r.id}
                    type="button"
                    initial={{ opacity: 0, y: 16, scale: 0.94 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ delay: i * 0.09, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    onClick={() => setSolo(r)}
                    className="relative rounded-xl overflow-hidden border border-line group cursor-pointer"
                  >
                    {r.kind === 'video' ? (
                      <>
                        <img src={r.poster} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108" />
                        <span className="absolute inset-0 flex items-center justify-center"><span className="h-11 w-11 rounded-full bg-black/55 backdrop-blur border border-white/25 flex items-center justify-center text-white"><Play size={16} fill="currentColor" /></span></span>
                      </>
                    ) : (
                      <img src={r.src} alt={r.label} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108" />
                    )}
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-2.5 opacity-0 group-hover:opacity-100 transition-opacity text-left">
                      <span className="block text-[11px] font-semibold text-white truncate">{r.label}</span>
                      <span className="block text-[9.5px] font-mono text-white/60">seed {r.seed}</span>
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
              <div className="relative">
                <div className="absolute -inset-6 rounded-full bg-white/4 blur-2xl animate-pulse-soft" />
                <span className="relative h-16 w-16 rounded-2xl glass flex items-center justify-center text-ash"><toolMeta.icon size={26} /></span>
              </div>
              <h3 className="font-display text-lg font-medium text-mist mt-6">Your canvas awaits</h3>
              <p className="text-[13px] text-ash mt-1.5 max-w-xs leading-relaxed">
                {tool === 'faceswap' ? 'Choose a source face and a target image, then generate.' : tool === 'bgremove' || tool === 'upscale' ? 'Select an input image, then generate.' : 'Write a prompt on the left and hit Generate to render your first take.'}
              </p>
              <div className="flex items-center gap-2 mt-5 text-[10.5px] font-mono text-ash">
                <Link2 size={11} /> outputs appear here · history is saved below
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* history strip */}
      <div className="border-t border-line px-3.5 py-3 shrink-0">
        <div className="flex items-center gap-2 mb-2">
          <History size={12} className="text-ash" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ash">Session history</span>
          <span className="text-[10px] font-mono text-ash ml-auto">{history.length} renders</span>
        </div>
        {history.length === 0 ? (
          <p className="text-[11.5px] text-ash py-2">Nothing yet — your renders will stack up here for quick recall.</p>
        ) : (
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {history.map((h) => (
              <button
                key={h.id}
                type="button"
                onClick={() => { setSolo(h); setCompare(false) }}
                className={cn('relative h-14 w-14 rounded-lg overflow-hidden border shrink-0 group cursor-pointer transition-all', solo?.id === h.id ? 'border-white/50 ring-2 ring-white/20' : 'border-line hover:border-edge')}
              >
                <img src={h.kind === 'video' ? h.poster : h.src} alt="" className="h-full w-full object-cover" />
                {h.kind === 'video' && <span className="absolute inset-0 flex items-center justify-center bg-black/30"><Play size={12} className="text-white" fill="currentColor" /></span>}
                {h.checker && <span className="absolute bottom-0.5 right-0.5 text-[7.5px] font-mono bg-black/60 text-white rounded px-1">α</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
