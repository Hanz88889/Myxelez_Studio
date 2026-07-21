import { useEffect, useRef, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { AudioLines, Bell, Box, Lock } from 'lucide-react'
import { cn, randomSeed } from '../lib/utils'
import { Badge, Button, Card, Reveal, Tooltip, useToast } from '../components/ui'
import { PromptPanel } from './workspace/PromptPanel'
import { Preview } from './workspace/Preview'
import { buildResults, creditCost, DEFAULT_PARAMS, TOOLS, type GenParams, type ResultItem, type ToolId } from './workspace/shared'

function ComingSoon({ tool }: { tool: ToolId }) {
  const toast = useToast()
  const meta = TOOLS.find((t) => t.id === tool)!
  const isAudio = tool === 'audio'
  return (
    <div className="glass rounded-2xl min-h-[34rem] flex flex-col items-center justify-center text-center p-10 relative overflow-hidden lg:col-span-3">
      <div className="absolute inset-0 bg-grid opacity-20 mask-fade-b" />
      <div className="absolute -top-20 h-64 w-64 rounded-full bg-white/5 blur-3xl animate-pulse-soft" />
      <div className="relative">
        <span className="mx-auto h-20 w-20 rounded-3xl glass-2 flex items-center justify-center text-silver">
          {isAudio ? <AudioLines size={32} /> : <Box size={32} />}
        </span>
        <Badge variant="frost" className="mt-6"><Lock size={9} /> {isAudio ? 'Arriving Q3 2026' : 'In the lab'}</Badge>
        <h2 className="mt-4 font-display text-3xl sm:text-4xl font-medium tracking-tight">
          {isAudio ? 'Audio Synthesis' : '3D Generation'}
        </h2>
        <p className="mt-3 text-sm text-smoke max-w-md leading-relaxed mx-auto">
          {isAudio
            ? 'Score, voice and sound design generated in the same cinematic language as your visuals. Prompt a mood, get a soundtrack.'
            : 'Text-to-mesh with PBR materials, turntable renders and direct export to your pipeline. Currently training on the Myxelez render farm.'}
        </p>
        <Button variant="chrome" className="mt-7" onClick={() => toast('You’re on the early-access list', 'info')}>
          <Bell size={14} /> Notify me at launch
        </Button>
        <p className="mt-4 text-[11px] text-ash">Pro &amp; Studio members get beta access first.</p>
      </div>
    </div>
  )
}

export default function Workspace() {
  const [search, setSearchParams] = useSearchParams()
  const toolParam = (search.get('tool') as ToolId) || 'image'
  const tool: ToolId = TOOLS.some((t) => t.id === toolParam) ? toolParam : 'image'

  const [params, setParams] = useState<GenParams>(DEFAULT_PARAMS)
  const [refs, setRefs] = useState<string[]>([])
  const [source, setSource] = useState<string | null>(null)
  const [target, setTarget] = useState<string | null>(null)
  const [results, setResults] = useState<ResultItem[]>([])
  const [history, setHistory] = useState<ResultItem[]>([])
  const [generating, setGenerating] = useState(false)
  const [progress, setProgress] = useState(0)
  const [credits, setCredits] = useState(2880)
  const [comparePair, setComparePair] = useState<[string, string] | null>(null)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)
  const toast = useToast()

  const setTool = (t: ToolId) => {
    setSearchParams({ tool: t })
    setResults([])
    setComparePair(null)
  }

  useEffect(() => () => { if (timer.current) clearInterval(timer.current) }, [])

  const set = (p: Partial<GenParams>) => setParams((prev) => ({ ...prev, ...p }))

  // Accept shared prompts ("Use in Workspace" from resources)
  useEffect(() => {
    const p = search.get('prompt')
    if (p) setParams((prev) => ({ ...prev, prompt: p }))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Keep the model compatible with the active tool
  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      model:
        tool === 'video'
          ? 'motion-v1'
          : tool === 'upscale' || tool === 'bgremove'
            ? 'canvas-hd'
            : prev.model === 'motion-v1' || prev.model === 'canvas-hd'
              ? 'photon-v2'
              : prev.model,
    }))
  }, [tool])

  const generate = () => {
    if (generating) return
    if ((tool === 'faceswap' || tool === 'edit') && !target) {
      toast(tool === 'faceswap' ? 'Select a target image first' : 'Select a base image first', 'err')
      return
    }
    if ((tool === 'upscale' || tool === 'bgremove') && !target) {
      setTarget('/media/product-bg.jpg')
    }
    if (tool === 'faceswap' && !source) setSource('/media/gen-potrait.jpg')
    const effectiveTarget = target ?? ((tool === 'upscale' || tool === 'bgremove') ? '/media/product-bg.jpg' : null)

    setGenerating(true)
    setProgress(0)
    setComparePair(null)
    const dur = tool === 'video' ? 3400 : 2200 + Math.random() * 900
    const start = performance.now()
    timer.current = setInterval(() => {
      const p = Math.min(((performance.now() - start) / dur) * 100, 100)
      setProgress(p)
      if (p >= 100 && timer.current) {
        clearInterval(timer.current)
        const out = buildResults(tool, params, effectiveTarget)
        setResults(out)
        setHistory((h) => [...out, ...h].slice(0, 24))
        setCredits((c) => Math.max(0, c - creditCost(tool, params)))
        if (tool === 'bgremove') setComparePair(['/media/product-bg.jpg', '/media/product-cut.png'])
        else if (tool === 'upscale' && effectiveTarget) setComparePair([effectiveTarget, out[0].src])
        else if (tool === 'faceswap' && effectiveTarget) setComparePair([effectiveTarget, out[0].src])
        set({ seed: randomSeed() })
        setGenerating(false)
        toast(`${out.length} ${out.length > 1 ? 'renders' : 'render'} complete · ${creditCost(tool, params)} credits used`)
      }
    }, 80)
  }

  const cost = creditCost(tool, params)
  const isSoon = TOOLS.find((t) => t.id === tool)?.soon

  return (
    <div className="flex gap-5 items-start">
      {/* Tool rail — desktop */}
      <Reveal className="hidden lg:block shrink-0 sticky top-24">
        <div className="glass rounded-2xl p-2 flex flex-col gap-1">
          {TOOLS.map((t) => (
            <Tooltip key={t.id} label={t.soon ? `${t.name} — coming soon` : t.desc} side="right">
              <button
                type="button"
                onClick={() => setTool(t.id)}
                className={cn('relative h-12 w-12 rounded-xl flex items-center justify-center transition-all cursor-pointer',
                  tool === t.id ? 'text-mist' : 'text-ash hover:text-smoke')}
              >
                {tool === t.id && <motion.span layoutId="tool-rail" className="absolute inset-0 rounded-xl bg-glass2 border border-edge shadow-[0_0_20px_-6px_rgba(198,206,255,0.5)]" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <t.icon size={17} className="relative z-10" />
                {t.soon && <Lock size={8} className="absolute top-1.5 right-1.5 text-ash z-10" />}
              </button>
            </Tooltip>
          ))}
        </div>
      </Reveal>

      {/* Tool tabs — mobile/tablet */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 glass-2 border-t border-line px-2 py-2 flex gap-1 overflow-x-auto no-scrollbar">
        {TOOLS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTool(t.id)}
            className={cn('relative flex flex-col items-center gap-1 px-3.5 py-1.5 rounded-xl shrink-0 cursor-pointer', tool === t.id ? 'text-mist' : 'text-ash')}
          >
            {tool === t.id && <motion.span layoutId="tool-rail-m" className="absolute inset-0 rounded-xl bg-glass2 border border-edge" />}
            <t.icon size={16} className="relative z-10" />
            <span className="relative z-10 text-[9px] font-medium">{t.name}</span>
          </button>
        ))}
      </div>

      {/* Main grid */}
      <div className="flex-1 grid lg:grid-cols-[340px_1fr] xl:grid-cols-[380px_1fr] gap-5 min-w-0 pb-20 lg:pb-0">
        {isSoon ? (
          <ComingSoon tool={tool} />
        ) : (
          <>
            <Reveal className="min-w-0">
              <Card spotlight={false} className="p-4.5 sm:p-5">
                <PromptPanel
                  tool={tool}
                  params={params}
                  set={set}
                  refs={refs}
                  setRefs={setRefs}
                  source={source}
                  setSource={setSource}
                  target={target}
                  setTarget={setTarget}
                  onGenerate={generate}
                  generating={generating}
                  progress={progress}
                  credits={credits}
                  cost={cost}
                />
              </Card>
            </Reveal>
            <Reveal delay={0.08} className="min-w-0">
              <Preview
                tool={tool}
                results={results}
                generating={generating}
                progress={progress}
                batch={tool === 'image' || tool === 'video' ? params.batch : 1}
                history={history}
                onRegenerate={generate}
                comparePair={comparePair}
              />
            </Reveal>
          </>
        )}
      </div>
    </div>
  )
}
