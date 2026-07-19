import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bookmark, Boxes, Clock3, Copy, Download, FileText, Heart, Image as ImageIcon, LayoutGrid,
  LayoutTemplate, Library, ListFilter, Palette, Play, Quote, Search, Shapes, Sparkles,
  Star, SwatchBook, Type, Wand2, Workflow, X, type LucideIcon,
} from 'lucide-react'
import {
  ASSETS, BRAND_COLORS, CREATIVE_PRESETS, GALLERY, MOODBOARDS, PROMPT_LIBRARY,
  STYLE_PRESETS, TEMPLATES, WORKFLOWS,
} from '../lib/data'
import { cn, copyText, downloadFile, formatNumber } from '../lib/utils'
import { Badge, Button, Card, EmptyState, Input, Modal, Reveal, Tabs, Tooltip, useToast } from '../components/ui'

const CATS = [
  { id: 'all', label: 'All Resources', icon: LayoutGrid },
  { id: 'prompts', label: 'Prompt Library', icon: Quote },
  { id: 'styles', label: 'Style Library', icon: SwatchBook },
  { id: 'templates', label: 'Templates', icon: LayoutTemplate },
  { id: 'presets', label: 'Creative Presets', icon: Sparkles },
  { id: 'brand', label: 'Brand Kit', icon: Bookmark },
  { id: 'assets', label: 'Asset Library', icon: Boxes },
  { id: 'moodboard', label: 'Moodboard', icon: Shapes },
  { id: 'gallery', label: 'Reference Gallery', icon: ImageIcon },
  { id: 'workflows', label: 'Saved Workflows', icon: Workflow },
  { id: 'favorites', label: 'Favorites', icon: Heart },
  { id: 'recent', label: 'Recent', icon: Clock3 },
]

function PromptCard({ item, fav, onFav }: { item: (typeof PROMPT_LIBRARY)[number]; fav: boolean; onFav: () => void }) {
  const navigate = useNavigate()
  const toast = useToast()
  return (
    <Card hover className="p-5 flex flex-col gap-3.5 h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h4 className="font-display text-[15px] font-semibold text-mist truncate">{item.title}</h4>
          <p className="text-[11px] text-ash mt-0.5">{item.category} · {formatNumber(item.uses)} uses</p>
        </div>
        <button type="button" onClick={onFav} className="shrink-0 cursor-pointer transition-transform hover:scale-115">
          <Heart size={16} className={fav ? 'text-blush' : 'text-ash hover:text-smoke'} fill={fav ? 'currentColor' : 'none'} />
        </button>
      </div>
      <p className="text-[12.5px] leading-relaxed text-smoke font-mono bg-void/50 border border-line rounded-xl p-3 line-clamp-3 flex-1">{item.text}</p>
      <div className="flex items-center gap-1.5 flex-wrap">
        {item.tags.map((t) => <Badge key={t}>#{t}</Badge>)}
      </div>
      <div className="flex items-center gap-2 pt-1">
        <Button variant="chrome" size="sm" className="flex-1" onClick={() => navigate(`/studio/generate?tool=image&prompt=${encodeURIComponent(item.text)}`)}>
          <Wand2 size={12} /> Use in Workspace
        </Button>
        <Tooltip label="Copy prompt"><Button variant="glass" size="icon-sm" onClick={async () => { await copyText(item.text); toast('Prompt copied') }}><Copy size={13} /></Button></Tooltip>
      </div>
    </Card>
  )
}

export default function Resources() {
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')
  const [sort, setSort] = useState('popular')
  const [favs, setFavs] = useState<Set<string>>(new Set(PROMPT_LIBRARY.filter((p) => p.fav).map((p) => p.id)))
  const [likedImgs, setLikedImgs] = useState<Set<string>>(new Set(GALLERY.filter((g) => g.liked).map((g) => g.id)))
  const [board, setBoard] = useState<(typeof MOODBOARDS)[number] | null>(null)
  const navigate = useNavigate()
  const toast = useToast()

  const toggleFav = (id: string) => {
    setFavs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  const toggleImg = (id: string) => {
    setLikedImgs((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  const prompts = useMemo(() => {
    let list = PROMPT_LIBRARY.filter((p) => (p.title + p.text + p.category + p.tags.join()).toLowerCase().includes(q.toLowerCase()))
    if (cat === 'favorites') list = list.filter((p) => favs.has(p.id))
    if (sort === 'popular') list = [...list].sort((a, b) => b.uses - a.uses)
    if (sort === 'az') list = [...list].sort((a, b) => a.title.localeCompare(b.title))
    return list
  }, [q, cat, sort, favs])

  const galleryFiltered = GALLERY.filter((g) => (g.title + g.prompt + g.style).toLowerCase().includes(q.toLowerCase()))

  const SectionTitle = ({ icon: I, title, count }: { icon: LucideIcon; title: string; count?: number }) => (
    <div className="flex items-center gap-2.5 mb-4 mt-2">
      <I size={15} className="text-silver" />
      <h3 className="font-display text-[15px] font-semibold">{title}</h3>
      {count !== undefined && <Badge variant="chrome">{count}</Badge>}
    </div>
  )

  const PromptGrid = ({ items }: { items: typeof PROMPT_LIBRARY }) => (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {items.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}>
          <PromptCard item={p} fav={favs.has(p.id)} onFav={() => toggleFav(p.id)} />
        </motion.div>
      ))}
    </div>
  )

  const StyleGrid = () => (
    <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-4">
      {STYLE_PRESETS.map((s, i) => (
        <motion.div key={s.id} initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
          <Card hover className="overflow-hidden group cursor-pointer" onClick={() => navigate('/studio/generate?tool=image')}>
            <div className={cn('h-28 bg-gradient-to-br relative', s.swatch)}>
              <span className="absolute inset-0 bg-gradient-to-t from-black/35 to-transparent" />
              <span className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"><Badge variant="chrome">Apply</Badge></span>
            </div>
            <div className="p-3.5">
              <p className="text-[13px] font-semibold text-mist">{s.name}</p>
              <p className="text-[10.5px] text-ash mt-0.5">Style preset · MYX tuned</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const TemplateGrid = () => (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {TEMPLATES.map((t, i) => (
        <motion.div key={t.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
          <Card hover className="overflow-hidden group cursor-pointer" onClick={() => navigate('/studio/generate?tool=image')}>
            <div className="relative h-44">
              <img src={t.cover} alt={t.name} className="absolute inset-0 h-full w-full object-cover opacity-70 transition-all duration-700 group-hover:scale-105 group-hover:opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-void via-void/20 to-transparent" />
              <Badge variant="chrome" className="absolute top-3 left-3">{t.ratio}</Badge>
              <Badge variant="frost" className="absolute top-3 right-3">{t.category}</Badge>
            </div>
            <div className="p-4">
              <p className="font-display text-[15px] font-semibold text-mist">{t.name}</p>
              <p className="text-[12px] text-ash mt-1">{t.desc}</p>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const PresetList = () => (
    <div className="flex flex-col gap-3">
      {CREATIVE_PRESETS.map((p, i) => (
        <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
          <Card hover className="p-4.5 flex flex-col sm:flex-row sm:items-center gap-4">
            <span className="h-11 w-11 rounded-xl bg-gradient-to-br from-white/20 to-white/5 border border-edge flex items-center justify-center shrink-0">
              <Sparkles size={16} className="text-silver" />
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2.5 flex-wrap">
                <p className="font-display text-[15px] font-semibold text-mist">{p.name}</p>
                <Badge>{formatNumber(p.uses)} uses</Badge>
              </div>
              <p className="text-[12.5px] text-smoke mt-0.5">{p.desc}</p>
              <p className="text-[11px] font-mono text-ash mt-1.5">{p.params}</p>
            </div>
            <Button variant="glass" size="sm" onClick={() => { navigate('/studio/generate?tool=image'); }}>Apply preset</Button>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const BrandKit = () => (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card spotlight={false} className="p-6">
        <div className="flex items-center gap-2.5 mb-5"><Palette size={15} className="text-silver" /><h4 className="font-display font-semibold">Palette · Liquid Chrome</h4></div>
        <div className="grid grid-cols-4 gap-3">
          {BRAND_COLORS.map((c) => (
            <button
              key={c.name}
              type="button"
              onClick={async () => { await copyText(c.hex); toast(`${c.name} ${c.hex} copied`) }}
              className="group cursor-pointer text-left"
            >
              <div className="h-16 rounded-xl border border-line transition-transform group-hover:scale-105" style={{ background: c.hex }} />
              <p className="text-[11px] font-medium text-mist mt-2">{c.name}</p>
              <p className="text-[10px] font-mono text-ash">{c.hex}</p>
            </button>
          ))}
        </div>
        <p className="text-[11px] text-ash mt-4">Click any swatch to copy its hex. Palette auto-applies to Brand Kit generations.</p>
      </Card>
      <div className="flex flex-col gap-5">
        <Card spotlight={false} className="p-6">
          <div className="flex items-center gap-2.5 mb-4"><Bookmark size={15} className="text-silver" /><h4 className="font-display font-semibold">Logos</h4></div>
          <div className="flex items-center gap-4">
            <div className="h-20 w-20 rounded-2xl overflow-hidden border border-edge"><img src="/uploads/logo.png" alt="Myxelez logo" className="h-full w-full object-cover" /></div>
            <div className="flex-1">
              <p className="text-[13px] font-medium text-mist">Primary lockup</p>
              <p className="text-[11.5px] text-ash mt-0.5">Monogram + wordmark · use unmodified on dark surfaces</p>
              <div className="flex gap-2 mt-2.5">
                <Button variant="glass" size="sm" onClick={() => { downloadFile('/uploads/logo.png', 'myxelez-logo.png'); toast('Logo download started') }}><Download size={12} /> PNG</Button>
                <Button variant="glass" size="sm" onClick={() => { downloadFile('/favicon.svg', 'myxelez-mark.svg'); toast('Mark download started') }}><Download size={12} /> SVG</Button>
              </div>
            </div>
          </div>
        </Card>
        <Card spotlight={false} className="p-6">
          <div className="flex items-center gap-2.5 mb-4"><Type size={15} className="text-silver" /><h4 className="font-display font-semibold">Typography</h4></div>
          <div className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <p className="font-display text-2xl font-medium">Space Grotesk</p>
              <p className="text-[11px] font-mono text-ash">Display · 300–700</p>
            </div>
            <div className="flex items-baseline justify-between border-b border-line pb-3">
              <p className="text-xl">Inter</p>
              <p className="text-[11px] font-mono text-ash">Interface · 300–700</p>
            </div>
            <div className="flex items-baseline justify-between">
              <p className="font-mono text-lg">JetBrains Mono</p>
              <p className="text-[11px] font-mono text-ash">Data · 400–500</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )

  const AssetTable = () => (
    <Card spotlight={false} className="overflow-hidden">
      <div className="hidden sm:grid grid-cols-[1fr_90px_90px_90px_44px] gap-3 px-5 py-3 border-b border-line text-[10px] font-semibold uppercase tracking-[0.18em] text-ash">
        <span>Name</span><span>Type</span><span>Size</span><span>Updated</span><span />
      </div>
      {ASSETS.map((a, i) => (
        <motion.div key={a.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }} className="grid grid-cols-[1fr_44px] sm:grid-cols-[1fr_90px_90px_90px_44px] gap-3 items-center px-5 py-3 border-b border-line last:border-0 hover:bg-glass transition-colors">
          <div className="flex items-center gap-3 min-w-0">
            {a.src && !a.src.endsWith('.mp4') ? (
              <img src={a.src} alt="" className="h-9 w-9 rounded-lg object-cover border border-line shrink-0" />
            ) : (
              <span className="h-9 w-9 rounded-lg bg-glass border border-line flex items-center justify-center text-ash shrink-0"><FileText size={14} /></span>
            )}
            <span className="text-[13px] font-medium text-mist truncate">{a.name}</span>
          </div>
          <span className="hidden sm:block text-[12px] text-ash">{a.type}</span>
          <span className="hidden sm:block text-[12px] font-mono text-ash">{a.size}</span>
          <span className="hidden sm:block text-[12px] text-ash">{a.updated}</span>
          <Tooltip label="Download">
            <Button variant="ghost" size="icon-sm" onClick={() => { if (a.src) { downloadFile(a.src, a.name); toast('Download started') } else toast('Preparing archive…', 'info') }}>
              <Download size={13} />
            </Button>
          </Tooltip>
        </motion.div>
      ))}
    </Card>
  )

  const Moodboards = () => (
    <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
      {MOODBOARDS.map((m, i) => (
        <motion.div key={m.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}>
          <Card hover className="overflow-hidden cursor-pointer" onClick={() => setBoard(m)}>
            <div className="grid grid-cols-3 gap-px h-40">
              {m.images.slice(0, 3).map((src) => <img key={src} src={src} alt="" className="h-full w-full object-cover" />)}
            </div>
            <div className="p-4 flex items-center justify-between">
              <div>
                <p className="font-display text-[15px] font-semibold text-mist">{m.name}</p>
                <p className="text-[11px] text-ash mt-0.5">{m.count} references</p>
              </div>
              <Button variant="glass" size="sm">Open board</Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const ReferenceGallery = ({ items, likeable }: { items: typeof GALLERY; likeable?: boolean }) => (
    <div className="columns-2 sm:columns-3 xl:columns-4 gap-3 [column-fill:balance]">
      {items.map((g, i) => (
        <motion.div key={g.id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: Math.min(i * 0.04, 0.35) }} className="mb-3 break-inside-avoid group relative rounded-2xl overflow-hidden border border-line cursor-pointer">
          <img src={g.src} alt={g.title} className="w-full transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="absolute bottom-0 inset-x-0 p-3.5 translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all">
            <p className="text-[13px] font-semibold text-white">{g.title}</p>
            <p className="text-[10px] font-mono text-white/60 mt-0.5">{g.model} · seed {g.seed}</p>
            <div className="flex gap-1.5 mt-2.5">
              <Button variant="chrome" size="sm" className="h-7 text-[11px]" onClick={(e) => { e.stopPropagation(); navigate(`/studio/generate?tool=image&prompt=${encodeURIComponent(g.prompt)}`) }}>Remix</Button>
              {likeable && (
                <Button variant="glass" size="icon-sm" className="h-7 w-7" onClick={(e) => { e.stopPropagation(); toggleImg(g.id) }}>
                  <Heart size={12} className={likedImgs.has(g.id) ? 'text-blush' : ''} fill={likedImgs.has(g.id) ? 'currentColor' : 'none'} />
                </Button>
              )}
            </div>
          </div>
          {likedImgs.has(g.id) && <span className="absolute top-2.5 right-2.5 h-6 w-6 rounded-lg bg-black/50 backdrop-blur flex items-center justify-center"><Heart size={11} className="text-blush" fill="currentColor" /></span>}
        </motion.div>
      ))}
    </div>
  )

  const WorkflowCards = () => (
    <div className="grid sm:grid-cols-2 gap-4">
      {WORKFLOWS.map((w, i) => (
        <motion.div key={w.id} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
          <Card hover className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-display text-[15px] font-semibold text-mist">{w.name}</p>
              <Badge>{w.runs} runs</Badge>
            </div>
            <div className="flex items-center gap-1.5 mt-4 flex-wrap">
              {w.steps.map((s, j) => (
                <span key={s} className="flex items-center gap-1.5">
                  <span className="text-[11px] font-medium text-smoke bg-glass border border-line rounded-lg px-2.5 py-1.5">{s}</span>
                  {j < w.steps.length - 1 && <span className="text-ash">→</span>}
                </span>
              ))}
            </div>
            <div className="flex items-center justify-between mt-5 pt-4 border-t border-line">
              <p className="text-[11px] text-ash">Updated {w.updated}</p>
              <Button variant="chrome" size="sm" onClick={() => toast(`Workflow “${w.name}” queued in Workspace`, 'info')}>
                <Play size={12} /> Run pipeline
              </Button>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const RecentList = () => (
    <div className="flex flex-col gap-2.5">
      {[
        { icon: Quote, name: 'Liquid Chrome Portrait', kind: 'Prompt', time: '12m ago' },
        { icon: SwatchBook, name: 'Chrome Noir', kind: 'Style preset', time: '1h ago' },
        { icon: Shapes, name: 'Liquid Argentum', kind: 'Moodboard', time: '3h ago' },
        { icon: LayoutTemplate, name: 'Cinematic Poster', kind: 'Template', time: '5h ago' },
        { icon: Boxes, name: 'hero-keyart-final.png', kind: 'Asset', time: '1d ago' },
        { icon: Workflow, name: 'Key Art Pipeline', kind: 'Workflow', time: '2d ago' },
      ].map((r, i) => (
        <motion.div key={r.name} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}>
          <Card hover className="px-4.5 py-3.5 flex items-center gap-3.5 cursor-pointer">
            <span className="h-9 w-9 rounded-xl glass flex items-center justify-center text-silver shrink-0"><r.icon size={14} /></span>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-medium text-mist truncate">{r.name}</p>
              <p className="text-[11px] text-ash">{r.kind}</p>
            </div>
            <span className="text-[11px] text-ash shrink-0">{r.time}</span>
          </Card>
        </motion.div>
      ))}
    </div>
  )

  const Favorites = () => {
    const favPrompts = PROMPT_LIBRARY.filter((p) => favs.has(p.id))
    const favImgs = GALLERY.filter((g) => likedImgs.has(g.id))
    return (
      <div className="flex flex-col gap-8">
        {favPrompts.length > 0 && (
          <div>
            <SectionTitle icon={Quote} title="Saved prompts" count={favPrompts.length} />
            <PromptGrid items={favPrompts} />
          </div>
        )}
        {favImgs.length > 0 && (
          <div>
            <SectionTitle icon={ImageIcon} title="Liked references" count={favImgs.length} />
            <ReferenceGallery items={favImgs} likeable />
          </div>
        )}
        {favPrompts.length === 0 && favImgs.length === 0 && (
          <EmptyState icon={<Heart size={22} />} title="No favorites yet" desc="Tap the heart on any prompt or reference to pin it here." />
        )}
      </div>
    )
  }

  const renderCat = () => {
    switch (cat) {
      case 'prompts': return <PromptGrid items={prompts} />
      case 'styles': return <StyleGrid />
      case 'templates': return <TemplateGrid />
      case 'presets': return <PresetList />
      case 'brand': return <BrandKit />
      case 'assets': return <AssetTable />
      case 'moodboard': return <Moodboards />
      case 'gallery': return <ReferenceGallery items={galleryFiltered} likeable />
      case 'workflows': return <WorkflowCards />
      case 'favorites': return <Favorites />
      case 'recent': return <RecentList />
      default:
        return (
          <div className="flex flex-col gap-10">
            <div><SectionTitle icon={Quote} title="Prompt Library" count={prompts.length} /><PromptGrid items={prompts.slice(0, 3)} /></div>
            <div><SectionTitle icon={SwatchBook} title="Style Library" count={STYLE_PRESETS.length} /><StyleGrid /></div>
            <div><SectionTitle icon={LayoutTemplate} title="Templates" count={TEMPLATES.length} /><TemplateGrid /></div>
            <div><SectionTitle icon={Workflow} title="Saved Workflows" count={WORKFLOWS.length} /><WorkflowCards /></div>
          </div>
        )
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* category rail */}
      <Reveal className="w-full lg:w-60 shrink-0 lg:sticky lg:top-24">
        <Card spotlight={false} className="p-2.5">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-1 gap-1">
            {CATS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setCat(c.id)}
                className={cn('relative flex items-center gap-2.5 px-3 h-10 rounded-xl text-[12.5px] font-medium transition-colors cursor-pointer text-left',
                  cat === c.id ? 'text-mist' : 'text-ash hover:text-smoke')}
              >
                {cat === c.id && <motion.span layoutId="cr-cat" className="absolute inset-0 rounded-xl bg-glass2 border border-edge" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />}
                <c.icon size={14} className="relative z-10 shrink-0" />
                <span className="relative z-10 truncate">{c.label}</span>
              </button>
            ))}
          </div>
        </Card>
        <Card spotlight={false} className="mt-4 p-4 hidden lg:block">
          <div className="flex items-center gap-2 text-silver"><Library size={14} /><p className="text-[12px] font-semibold text-mist">Resource Cloud</p></div>
          <p className="text-[11.5px] text-ash leading-relaxed mt-2">Every resource syncs across workspace, team and API. Nothing lives on just one machine.</p>
          <div className="mt-3 h-1.5 rounded-full bg-haze overflow-hidden"><div className="h-full w-2/3 rounded-full bg-gradient-to-r from-zinc-500 to-zinc-200" /></div>
          <p className="text-[10.5px] text-ash mt-2">6.8 GB of 10 GB synced</p>
        </Card>
      </Reveal>

      {/* content */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <Reveal delay={0.05}>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ash" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prompts, styles, templates, assets…" className="pl-10 h-11" />
              {q && <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-mist cursor-pointer"><X size={14} /></button>}
            </div>
            <Tabs
              size="sm"
              value={sort}
              onChange={setSort}
              items={[
                { id: 'popular', label: 'Popular', icon: <Star size={11} /> },
                { id: 'az', label: 'A–Z', icon: <ListFilter size={11} /> },
              ]}
            />
          </div>
        </Reveal>
        <AnimatePresence mode="wait">
          <motion.div key={cat + q + sort} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
            {renderCat()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* moodboard modal */}
      <Modal open={board !== null} onClose={() => setBoard(null)} wide>
        {board && (
          <div>
            <div className="flex items-center justify-between px-6 py-4 border-b border-line">
              <div>
                <h3 className="font-display text-lg font-semibold">{board.name}</h3>
                <p className="text-[11.5px] text-ash">{board.count} references · curated board</p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="chrome" size="sm" onClick={() => { toast('Board applied as generation context', 'info'); setBoard(null) }}>
                  <Wand2 size={12} /> Use as context
                </Button>
                <Button variant="ghost" size="icon-sm" onClick={() => setBoard(null)}><X size={15} /></Button>
              </div>
            </div>
            <div className="p-6 max-h-[65vh] overflow-y-auto">
              <div className="columns-2 sm:columns-3 gap-3">
                {[...board.images, ...GALLERY.slice(0, 4).map((g) => g.src)].map((src, i) => (
                  <motion.img
                    key={src + i}
                    src={src}
                    alt=""
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="mb-3 w-full rounded-xl border border-line break-inside-avoid"
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
