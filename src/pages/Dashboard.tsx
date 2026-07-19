import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowRight, ArrowUpRight, Clapperboard, Clock, Download, Eraser, Flame, FolderKanban,
  HardDrive, Heart, Image as ImageIcon, Layers, Plus, ScanFace, Sparkles, Star, TrendingUp,
  Upload, Wand2, Zap,
} from 'lucide-react'
import { ACTIVITY, GALLERY, NOTIFICATIONS, PROJECTS, USAGE_DAYS, USAGE_WEEK } from '../lib/data'
import { downloadFile, timeAgo } from '../lib/utils'
import { Badge, Button, Card, Reveal, Ring, Sparkline, useToast } from '../components/ui'

const QUICK_ACTIONS = [
  { icon: ImageIcon, label: 'New image', to: '/studio/generate?tool=image', tint: 'bg-frost/12 text-frost' },
  { icon: Clapperboard, label: 'New video', to: '/studio/generate?tool=video', tint: 'bg-blush/12 text-blush' },
  { icon: ScanFace, label: 'Face swap', to: '/studio/generate?tool=faceswap', tint: 'bg-mint/12 text-mint' },
  { icon: Eraser, label: 'Remove BG', to: '/studio/generate?tool=bgremove', tint: 'bg-ember/12 text-ember' },
  { icon: Upload, label: 'Upload asset', to: '/studio/resources', tint: 'bg-white/10 text-silver' },
  { icon: FolderKanban, label: 'New project', to: '/studio/projects', tint: 'bg-white/10 text-silver' },
]

function UsageChart() {
  const max = Math.max(...USAGE_WEEK)
  return (
    <div className="flex items-end gap-2.5 h-32">
      {USAGE_WEEK.map((v, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
          <span className="text-[10px] font-mono text-ash opacity-0 group-hover:opacity-100 transition-opacity">{v}</span>
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: `${(v / max) * 100}%` }}
            transition={{ delay: 0.3 + i * 0.07, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="w-full rounded-md bg-gradient-to-t from-white/8 to-white/30 group-hover:to-white/55 transition-all min-h-2"
          />
          <span className="text-[10px] text-ash">{USAGE_DAYS[i]}</span>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const toast = useToast()
  const recentProjects = PROJECTS.filter((p) => !p.archived).slice(0, 4)
  const recentGens = GALLERY.slice(0, 6)
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="flex flex-col gap-6">
      {/* Greeting + quick actions */}
      <Reveal>
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5">
          <div>
            <p className="text-[11px] font-mono uppercase tracking-[0.3em] text-ash">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-medium tracking-tight">
              {greeting}, <span className="text-chrome">Alex.</span>
            </h2>
            <p className="mt-2 text-sm text-smoke flex items-center gap-2">
              <Flame size={14} className="text-ember" /> 12-day creation streak · top 4% of creators this week
            </p>
          </div>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
            {QUICK_ACTIONS.map((a, i) => (
              <motion.button
                key={a.label}
                type="button"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + i * 0.05 }}
                onClick={() => navigate(a.to)}
                className="glass rounded-xl px-3 py-3 flex flex-col items-center gap-2 hover:border-edge hover:bg-glass2 transition-all cursor-pointer group"
              >
                <span className={`h-8 w-8 rounded-lg flex items-center justify-center ${a.tint} transition-transform group-hover:scale-110`}><a.icon size={15} /></span>
                <span className="text-[10.5px] font-medium text-smoke whitespace-nowrap">{a.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </Reveal>

      {/* Stat cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <Reveal delay={0.05}>
          <Card hover className="p-5 flex items-center gap-5">
            <Ring value={72} size={86}>
              <div className="text-center">
                <p className="font-display text-lg font-semibold leading-none">2.8K</p>
                <p className="text-[9px] text-ash mt-0.5">left</p>
              </div>
            </Ring>
            <div>
              <p className="text-[11px] uppercase tracking-[0.2em] text-ash">Credits</p>
              <p className="text-sm font-semibold text-mist mt-1">2,880 / 4,000</p>
              <p className="text-[11.5px] text-ash mt-1 flex items-center gap-1"><Clock size={11} /> Refills in 17 days</p>
              <button type="button" onClick={() => navigate('/studio/settings?tab=subscription')} className="text-[11.5px] text-silver hover:text-mist mt-1.5 flex items-center gap-1 cursor-pointer">Upgrade plan <ArrowUpRight size={11} /></button>
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.1}>
          <Card hover className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ash">Generations</p>
                <p className="font-display text-3xl font-medium mt-2">86</p>
                <p className="text-[11.5px] text-mint mt-1 flex items-center gap-1"><TrendingUp size={11} /> +24% this week</p>
              </div>
              <Sparkline data={USAGE_WEEK} width={96} height={40} className="mt-2 opacity-80" />
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.15}>
          <Card hover className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ash">Storage</p>
                <p className="font-display text-3xl font-medium mt-2">41<span className="text-lg text-ash">.2 GB</span></p>
                <p className="text-[11.5px] text-ash mt-1">of 100 GB · Pro</p>
              </div>
              <span className="h-9 w-9 rounded-xl glass flex items-center justify-center text-silver"><HardDrive size={15} /></span>
            </div>
            <div className="mt-4 h-1.5 rounded-full bg-haze overflow-hidden">
              <motion.div initial={{ width: 0 }} animate={{ width: '41%' }} transition={{ delay: 0.5, duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-zinc-500 to-zinc-200" />
            </div>
          </Card>
        </Reveal>
        <Reveal delay={0.2}>
          <Card hover className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.2em] text-ash">Favorites</p>
                <p className="font-display text-3xl font-medium mt-2">128</p>
                <p className="text-[11.5px] text-ash mt-1">across 6 collections</p>
              </div>
              <span className="h-9 w-9 rounded-xl glass flex items-center justify-center text-blush"><Heart size={15} /></span>
            </div>
            <div className="flex -space-x-2 mt-4">
              {[GALLERY[0], GALLERY[2], GALLERY[6], GALLERY[8]].map((g) => (
                <img key={g.id} src={g.src} alt="" className="h-8 w-8 rounded-full object-cover ring-2 ring-ink" />
              ))}
              <span className="h-8 w-8 rounded-full bg-haze ring-2 ring-ink flex items-center justify-center text-[10px] font-medium text-smoke">+124</span>
            </div>
          </Card>
        </Reveal>
      </div>

      {/* Main grid */}
      <div className="grid xl:grid-cols-3 gap-6">
        {/* Left column */}
        <div className="xl:col-span-2 flex flex-col gap-6">
          {/* Recent generations */}
          <Reveal>
            <Card spotlight={false} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <Wand2 size={15} className="text-silver" />
                  <h3 className="font-display text-[15px] font-semibold">Recent generations</h3>
                </div>
                <Link to="/studio/generate" className="text-[12px] text-ash hover:text-mist transition-colors flex items-center gap-1">Open workspace <ArrowRight size={12} /></Link>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {recentGens.map((g, i) => (
                  <motion.div
                    key={g.id}
                    initial={{ opacity: 0, scale: 0.92 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="group relative rounded-xl overflow-hidden border border-line aspect-square cursor-pointer"
                    onClick={() => navigate('/studio/generate')}
                  >
                    <img src={g.src} alt={g.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                      <button type="button" onClick={(e) => { e.stopPropagation(); downloadFile(g.src, `${g.title}.jpg`); toast('Download started') }} className="h-7 w-7 rounded-lg glass-2 flex items-center justify-center text-white cursor-pointer"><Download size={12} /></button>
                      <button type="button" onClick={(e) => { e.stopPropagation(); toast(`“${g.title}” added to favorites`) }} className="h-7 w-7 rounded-lg glass-2 flex items-center justify-center text-white cursor-pointer"><Heart size={12} /></button>
                    </div>
                    {g.liked && <span className="absolute top-1.5 right-1.5 h-5 w-5 rounded-md bg-black/50 backdrop-blur flex items-center justify-center"><Heart size={10} className="text-blush" fill="currentColor" /></span>}
                  </motion.div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Recent projects */}
          <Reveal>
            <Card spotlight={false} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <FolderKanban size={15} className="text-silver" />
                  <h3 className="font-display text-[15px] font-semibold">Recent projects</h3>
                </div>
                <Link to="/studio/projects" className="text-[12px] text-ash hover:text-mist transition-colors flex items-center gap-1">All projects <ArrowRight size={12} /></Link>
              </div>
              <div className="grid sm:grid-cols-2 gap-3">
                {recentProjects.map((p, i) => (
                  <motion.button
                    key={p.id}
                    type="button"
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.25 + i * 0.07 }}
                    onClick={() => navigate('/studio/projects')}
                    className="group relative rounded-2xl overflow-hidden border border-line text-left cursor-pointer h-36"
                  >
                    <img src={p.cover} alt={p.name} className="absolute inset-0 h-full w-full object-cover opacity-50 transition-all duration-700 group-hover:opacity-70 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-void via-void/30 to-transparent" />
                    <div className="relative h-full flex flex-col justify-end p-4">
                      <div className="flex items-center gap-2">
                        <h4 className="font-display text-[15px] font-semibold text-white flex-1 truncate">{p.name}</h4>
                        {p.starred && <Star size={13} className="text-ember" fill="currentColor" />}
                      </div>
                      <p className="text-[11px] text-white/60 mt-1">{p.items} assets · updated {timeAgo(p.updated)}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Usage this week */}
          <Reveal>
            <Card spotlight={false} className="p-5">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2.5">
                  <Zap size={15} className="text-silver" />
                  <h3 className="font-display text-[15px] font-semibold">Credit usage this week</h3>
                </div>
                <Badge variant="chrome">408 credits</Badge>
              </div>
              <UsageChart />
            </Card>
          </Reveal>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Activity timeline */}
          <Reveal delay={0.1}>
            <Card spotlight={false} className="p-5">
              <div className="flex items-center gap-2.5 mb-5">
                <Layers size={15} className="text-silver" />
                <h3 className="font-display text-[15px] font-semibold">Activity</h3>
              </div>
              <div className="relative flex flex-col gap-4 before:absolute before:left-[5px] before:top-2 before:bottom-2 before:w-px before:bg-line">
                {ACTIVITY.slice(0, 6).map((a, i) => (
                  <motion.div
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + i * 0.07 }}
                    className="relative pl-6 flex items-start gap-3"
                  >
                    <span className="absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full border-2 border-ink bg-gradient-to-b from-white/70 to-zinc-500" />
                    <div className="min-w-0 flex-1">
                      <p className="text-[12.5px] text-smoke leading-snug">
                        <span className="text-mist font-medium">{a.action}</span> · {a.target}
                      </p>
                      <p className="text-[10.5px] text-ash mt-0.5">{a.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Notifications digest */}
          <Reveal delay={0.15}>
            <Card spotlight={false} className="p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-display text-[15px] font-semibold">Inbox</h3>
                <Badge variant="chrome">{NOTIFICATIONS.filter((n) => n.unread).length} new</Badge>
              </div>
              <div className="flex flex-col gap-2">
                {NOTIFICATIONS.slice(0, 3).map((n) => (
                  <div key={n.id} className="flex items-start gap-3 rounded-xl p-2.5 hover:bg-glass transition-colors cursor-pointer">
                    <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${n.unread ? 'bg-silver shadow-[0_0_8px_rgba(216,218,226,0.8)]' : 'bg-line'}`} />
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-medium text-mist truncate">{n.title}</p>
                      <p className="text-[11.5px] text-ash leading-snug mt-0.5 line-clamp-2">{n.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </Reveal>

          {/* Pro tip / upgrade */}
          <Reveal delay={0.2}>
            <Card spotlight={false} className="relative overflow-hidden p-5">
              <div className="absolute -top-12 -right-12 h-32 w-32 rounded-full bg-white/8 blur-2xl animate-pulse-soft" />
              <div className="relative">
                <Badge variant="frost">Studio preview</Badge>
                <h3 className="font-display text-lg font-semibold mt-3 leading-snug">Workflow automation is coming to your plan</h3>
                <p className="text-[12.5px] text-smoke mt-2 leading-relaxed">Chain image → face swap → 4K upscale into one-click pipelines. Pro members get beta access first.</p>
                <Button variant="chrome" size="sm" className="mt-4" onClick={() => { toast('You’re on the automation beta list', 'info') }}>
                  <Sparkles size={13} /> Join the beta
                </Button>
              </div>
            </Card>
          </Reveal>

          {/* Shortcut hint */}
          <Reveal delay={0.25}>
            <div className="glass rounded-2xl p-4 flex items-center gap-3">
              <Plus size={15} className="text-ash shrink-0" />
              <p className="text-[12px] text-ash leading-relaxed">
                Press <kbd className="font-mono text-[10px] border border-line rounded px-1.5 py-0.5 text-smoke">⌘K</kbd> anywhere to fly through the Studio with the command palette.
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  )
}
