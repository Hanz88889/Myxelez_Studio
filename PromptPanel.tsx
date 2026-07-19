import { useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronDown, Dices, ImagePlus, Loader2, Plus, Sparkles, Upload, X, Zap } from 'lucide-react'
import { ASPECTS, MODELS, RESOLUTIONS, STYLE_PRESETS, GALLERY } from '../../lib/data'
import { cn, randomSeed } from '../../lib/utils'
import { Button, Field, Modal, Select, Slider, Textarea, Tooltip, useToast } from '../../components/ui'
import type { GenParams, ToolId } from './shared'
import { TOOLS } from './shared'

/* ─── Image picker modal (library + upload) ─── */
function ImagePickerModal({ open, onClose, onPick, title }: { open: boolean; onClose: () => void; onPick: (src: string) => void; title: string }) {
  const fileRef = useRef<HTMLInputElement>(null)
  const options = [...GALLERY.map((g) => g.src), '/media/product-bg.jpg']
  return (
    <Modal open={open} onClose={onClose} className="max-w-2xl">
      <div className="p-5 border-b border-line flex items-center justify-between">
        <h3 className="font-display font-semibold">{title}</h3>
        <Button variant="ghost" size="icon-sm" onClick={onClose}><X size={15} /></Button>
      </div>
      <div className="p-5 max-h-[60vh] overflow-y-auto">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full mb-4 rounded-xl border border-dashed border-edge py-6 flex flex-col items-center gap-2 text-ash hover:text-mist hover:border-white/30 transition-colors cursor-pointer"
        >
          <Upload size={18} />
          <span className="text-xs font-medium">Upload from device</span>
        </button>
        <input
          ref={fileRef} type="file" accept="image/*" className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (!f) return
            const reader = new FileReader()
            reader.onload = () => { onPick(String(reader.result)); onClose() }
            reader.readAsDataURL(f)
          }}
        />
        <p className="text-[10.5px] uppercase tracking-[0.2em] text-ash mb-2.5">Or pick from your library</p>
        <div className="grid grid-cols-4 gap-2">
          {options.map((src) => (
            <button key={src} type="button" onClick={() => { onPick(src); onClose() }} className="relative rounded-lg overflow-hidden border border-line aspect-square group cursor-pointer">
              <img src={src} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <span className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Plus size={16} className="text-white" /></span>
            </button>
          ))}
        </div>
      </div>
    </Modal>
  )
}

/* ─── Slot for source/target/reference images ─── */
export function ImageSlot({ label, value, onPick, onClear, tall }: { label: string; value: string | null; onPick: () => void; onClear: () => void; tall?: boolean }) {
  return (
    <div className="flex-1 min-w-0">
      <p className="text-[10.5px] font-semibold uppercase tracking-[0.16em] text-ash mb-1.5">{label}</p>
      {value ? (
        <div className={cn('relative rounded-xl overflow-hidden border border-edge group', tall ? 'aspect-[4/5]' : 'aspect-square')}>
          <img src={value} alt={label} className="h-full w-full object-cover" />
          <button type="button" onClick={onClear} className="absolute top-1.5 right-1.5 h-6 w-6 rounded-lg bg-black/60 backdrop-blur text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
            <X size={12} />
          </button>
        </div>
      ) : (
        <button type="button" onClick={onPick} className={cn('w-full rounded-xl border border-dashed border-edge flex flex-col items-center justify-center gap-1.5 text-ash hover:text-mist hover:border-white/30 transition-colors cursor-pointer', tall ? 'aspect-[4/5]' : 'aspect-square')}>
          <ImagePlus size={17} />
          <span className="text-[10px] font-medium">Select</span>
        </button>
      )}
    </div>
  )
}

function Segmented({ options, value, onChange, cols }: { options: { id: string; label: string; pro?: boolean }[]; value: string; onChange: (v: string) => void; cols?: string }) {
  return (
    <div className={cn('grid gap-1.5', cols ?? 'grid-cols-4')}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={cn('relative h-8.5 rounded-lg border text-xs font-medium transition-all cursor-pointer flex items-center justify-center gap-1',
            value === o.id ? 'bg-glass2 border-edge text-mist shadow-[0_0_14px_-4px_rgba(198,206,255,0.4)]' : 'border-line text-ash hover:text-smoke hover:border-edge')}
        >
          {o.label}
          {o.pro && <span className="absolute -top-1.5 -right-1 text-[8px] font-bold bg-gradient-to-b from-white to-zinc-400 text-void rounded-full px-1.5 py-px">PRO</span>}
        </button>
      ))}
    </div>
  )
}

interface Props {
  tool: ToolId
  params: GenParams
  set: (p: Partial<GenParams>) => void
  refs: string[]
  setRefs: (r: string[]) => void
  source: string | null
  setSource: (s: string | null) => void
  target: string | null
  setTarget: (s: string | null) => void
  onGenerate: () => void
  generating: boolean
  progress: number
  credits: number
  cost: number
}

export function PromptPanel(p: Props) {
  const [advanced, setAdvanced] = useState(true)
  const [picker, setPicker] = useState<null | 'source' | 'target' | 'ref'>(null)
  const toast = useToast()
  const { tool, params, set } = p
  const toolMeta = TOOLS.find((t) => t.id === tool)!

  const modelOptions = MODELS.filter((m) => {
    if (tool === 'video') return m.id === 'motion-v1'
    if (tool === 'upscale' || tool === 'bgremove') return m.id === 'canvas-hd'
    return m.id !== 'motion-v1'
  }).map((m) => ({ value: m.id, label: m.name, hint: m.desc, badge: m.badge }))

  const aspects = tool === 'video' ? ['16:9', '9:16', '1:1'] : ASPECTS
  const showPrompt = tool !== 'bgremove' && tool !== 'upscale'
  const showFull = tool === 'image' || tool === 'video'

  const enhance = () => {
    const add = ', ultra detailed, cinematic lighting, 8k, sharp focus'
    if (!params.prompt.includes('ultra detailed')) set({ prompt: (params.prompt || 'A cinematic composition') + add })
    toast('Prompt enhanced with quality tokens', 'info')
  }

  return (
    <div className="flex flex-col gap-5">
      {/* tool header (mobile) */}
      <div className="lg:hidden flex items-center gap-2.5">
        <span className="h-9 w-9 rounded-xl glass flex items-center justify-center text-silver"><toolMeta.icon size={16} /></span>
        <div>
          <p className="text-sm font-semibold">{toolMeta.name} Generation</p>
          <p className="text-[11px] text-ash">{toolMeta.desc}</p>
        </div>
      </div>

      {/* Face swap / edit / upscale / bg remove pickers */}
      {tool === 'faceswap' && (
        <div className="flex gap-3">
          <ImageSlot label="Source face" value={p.source} onPick={() => setPicker('source')} onClear={() => p.setSource(null)} tall />
          <ImageSlot label="Target image" value={p.target} onPick={() => setPicker('target')} onClear={() => p.setTarget(null)} tall />
        </div>
      )}
      {(tool === 'edit' || tool === 'upscale' || tool === 'bgremove') && (
        <div className="flex gap-3">
          <ImageSlot label={tool === 'edit' ? 'Base image' : 'Input image'} value={p.target} onPick={() => setPicker('target')} onClear={() => p.setTarget(null)} tall />
        </div>
      )}

      {/* Prompt */}
      {showPrompt && (
        <Field label="Prompt" right={<button type="button" onClick={enhance} className="text-[10.5px] text-silver hover:text-mist flex items-center gap-1 transition-colors cursor-pointer"><Sparkles size={11} /> Enhance</button>}>
          <Textarea
            rows={3}
            value={params.prompt}
            onChange={(e) => set({ prompt: e.target.value })}
            placeholder={tool === 'video' ? 'A slow dolly through neon rain, reflections rippling…' : tool === 'faceswap' ? 'Optional: adjust expression, lighting, age…' : 'Describe what you see in your mind…'}
          />
        </Field>
      )}

      {showFull && (
        <Field label="Negative prompt">
          <Textarea rows={2} value={params.negative} onChange={(e) => set({ negative: e.target.value })} placeholder="blurry, low quality, watermark, extra fingers…" className="text-[13px]" />
        </Field>
      )}

      {/* Reference images */}
      {showFull && (
        <Field label={`Reference images · ${p.refs.length}/4`}>
          <div className="flex gap-2">
            {p.refs.map((r, i) => (
              <div key={i} className="relative h-14 w-14 rounded-lg overflow-hidden border border-edge group shrink-0">
                <img src={r} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => p.setRefs(p.refs.filter((_, x) => x !== i))} className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white cursor-pointer"><X size={13} /></button>
              </div>
            ))}
            {p.refs.length < 4 && (
              <button type="button" onClick={() => setPicker('ref')} className="h-14 w-14 rounded-lg border border-dashed border-edge flex items-center justify-center text-ash hover:text-mist hover:border-white/30 transition-colors cursor-pointer shrink-0">
                <Plus size={15} />
              </button>
            )}
          </div>
        </Field>
      )}

      {/* Model */}
      <Field label="Model">
        <Select value={params.model} onChange={(v) => set({ model: v })} options={modelOptions} />
      </Field>

      {/* Aspect */}
      {tool !== 'bgremove' && tool !== 'upscale' && (
        <Field label="Aspect ratio">
          <Segmented cols="grid-cols-7 max-lg:grid-cols-4" options={aspects.map((a) => ({ id: a, label: a }))} value={params.aspect} onChange={(v) => set({ aspect: v })} />
        </Field>
      )}

      {/* Resolution */}
      {tool === 'image' && (
        <Field label="Resolution">
          <Segmented options={RESOLUTIONS.map((r) => ({ id: r.id, label: r.label, pro: r.pro }))} value={params.resolution} onChange={(v) => set({ resolution: v })} />
        </Field>
      )}

      {/* Video duration */}
      {tool === 'video' && (
        <Field label={`Duration · ${params.duration}s`}>
          <Slider value={params.duration} min={2} max={8} onChange={(v) => set({ duration: v })} format={(v) => `${v}s`} />
        </Field>
      )}

      {/* Upscale factor */}
      {tool === 'upscale' && (
        <Field label="Scale factor">
          <Segmented cols="grid-cols-2" options={[{ id: '2x', label: '2× · 2048px' }, { id: '4x', label: '4× · 4096px', pro: true }]} value={params.factor} onChange={(v) => set({ factor: v })} />
        </Field>
      )}

      {/* Style presets */}
      {showFull && (
        <Field label="Style preset">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 -mx-1 px-1">
            {STYLE_PRESETS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => set({ style: s.id })}
                className={cn('shrink-0 flex flex-col items-center gap-1.5 cursor-pointer group')}
              >
                <span className={cn('h-11 w-11 rounded-xl bg-gradient-to-br border transition-all duration-300', s.swatch, params.style === s.id ? 'border-white/60 ring-2 ring-white/25 scale-105' : 'border-line group-hover:border-edge')} />
                <span className={cn('text-[9px] font-medium whitespace-nowrap', params.style === s.id ? 'text-mist' : 'text-ash')}>{s.name}</span>
              </button>
            ))}
          </div>
        </Field>
      )}

      {/* Strength sliders */}
      {(tool === 'faceswap' || tool === 'edit' || tool === 'upscale') && (
        <Field label={tool === 'faceswap' ? 'Blend strength' : tool === 'edit' ? 'Edit strength' : 'Detail enhancement'}>
          <Slider value={params.strength} min={0} max={100} onChange={(v) => set({ strength: v })} format={(v) => `${v}%`} />
        </Field>
      )}

      {/* Advanced */}
      {showFull && (
        <div className="rounded-xl border border-line overflow-hidden">
          <button type="button" onClick={() => setAdvanced((a) => !a)} className="w-full flex items-center justify-between px-3.5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.16em] text-ash hover:text-smoke transition-colors cursor-pointer">
            Advanced
            <ChevronDown size={13} className={cn('transition-transform duration-300', advanced && 'rotate-180')} />
          </button>
          <AnimatePresence initial={false}>
            {advanced && (
              <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                <div className="px-3.5 pb-4 pt-1 flex flex-col gap-4">
                  <Field label="Seed">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={params.seed}
                        onChange={(e) => set({ seed: Number(e.target.value) })}
                        className="h-9 flex-1 rounded-lg bg-glass border border-line px-3 text-xs font-mono text-mist outline-none focus:border-edge transition-colors"
                      />
                      <Tooltip label="Random seed">
                        <Button variant="glass" size="icon-sm" className="h-9 w-9" onClick={() => set({ seed: randomSeed() })}><Dices size={14} /></Button>
                      </Tooltip>
                    </div>
                  </Field>
                  <Field label="CFG scale · guidance">
                    <Slider value={params.cfg} min={1} max={20} step={0.5} onChange={(v) => set({ cfg: v })} format={(v) => v.toFixed(1)} />
                  </Field>
                  <Field label="Sampling steps">
                    <Slider value={params.steps} min={10} max={60} onChange={(v) => set({ steps: v })} />
                  </Field>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Batch */}
      {showFull && (
        <Field label="Batch generate">
          <Segmented options={[{ id: '1', label: '×1' }, { id: '2', label: '×2' }, { id: '4', label: '×4' }]} value={String(params.batch)} onChange={(v) => set({ batch: Number(v) })} />
        </Field>
      )}

      {/* Generate */}
      <div className="sticky bottom-0 pt-2 pb-1 bg-gradient-to-t from-ink via-ink/95 to-transparent -mx-1 px-1">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={p.onGenerate}
          disabled={p.generating || p.cost > p.credits}
          className="btn-chrome w-full h-12 rounded-xl text-sm font-semibold flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {p.generating ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Rendering · {Math.round(p.progress)}%
            </>
          ) : (
            <>
              <Zap size={16} fill="currentColor" />
              Generate {tool === 'image' || tool === 'video' ? `×${params.batch}` : ''}
              <span className="text-[11px] font-medium opacity-70 flex items-center gap-1">· {p.cost} credits</span>
            </>
          )}
        </motion.button>
        {p.cost > p.credits && (
          <p className="text-[11px] text-blush text-center mt-2">Not enough credits — upgrade your plan</p>
        )}
      </div>

      <ImagePickerModal
        open={picker !== null}
        onClose={() => setPicker(null)}
        title={picker === 'source' ? 'Choose source face' : picker === 'target' ? 'Choose image' : 'Add reference image'}
        onPick={(src) => {
          if (picker === 'source') p.setSource(src)
          else if (picker === 'target') p.setTarget(src)
          else if (picker === 'ref') p.setRefs([...p.refs, src].slice(0, 4))
        }}
      />
    </div>
  )
}
