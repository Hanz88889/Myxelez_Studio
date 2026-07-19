import { useEffect, useRef, useState, type ReactNode } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Bell, ChevronsLeft, ChevronsRight, Command, CreditCard, Folder, FolderKanban, ImagePlus,
  LayoutDashboard, Library, LogOut, Moon, PanelLeft, Search, Settings, Sparkles,
  Sun, User, Wand2, Zap,
} from 'lucide-react'
import { cn } from '../lib/utils'
import { useTheme } from '../lib/theme'
import { NOTIFICATIONS } from '../lib/data'
import { Badge, Button, Logo, Menu, Ring, Tooltip, useToast } from './ui'

interface NavItem { to: string; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }>; end?: boolean; badge?: string }
const NAV: { section: string; items: NavItem[] }[] = [
  {
    section: 'Overview',
    items: [{ to: '/studio', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    section: 'Create',
    items: [{ to: '/studio/generate', label: 'AI Workspace', icon: Wand2, badge: '8' }],
  },
  {
    section: 'Library',
    items: [
      { to: '/studio/resources', label: 'Creative Resources', icon: Library },
      { to: '/studio/projects', label: 'Projects', icon: FolderKanban },
    ],
  },
  {
    section: 'Account',
    items: [{ to: '/studio/settings', label: 'Settings', icon: Settings }],
  },
]

const TITLES: Record<string, { title: string; sub: string }> = {
  '/studio': { title: 'Dashboard', sub: 'Your creative command center' },
  '/studio/generate': { title: 'AI Workspace', sub: 'Generate with the MYX engine family' },
  '/studio/resources': { title: 'Creative Resources', sub: 'The creative center of Myxelez' },
  '/studio/projects': { title: 'Projects', sub: 'Organize, archive and ship' },
  '/studio/settings': { title: 'Settings', sub: 'Account, billing and platform controls' },
}

function Popover({ trigger, children, align = 'right', width = 'w-80' }: { trigger: ReactNode; children: (close: () => void) => ReactNode; align?: 'left' | 'right'; width?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const close = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])
  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((o) => !o)} className="cursor-pointer">{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className={cn('absolute z-50 mt-2 glass-2 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden', width, align === 'right' ? 'right-0' : 'left-0')}
          >
            {children(() => setOpen(false))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const navigate = useNavigate()
  const { toggle } = useTheme()
  const toast = useToast()
  const inputRef = useRef<HTMLInputElement>(null)

  const commands = [
    { label: 'Go to Dashboard', icon: LayoutDashboard, run: () => navigate('/studio'), hint: 'G D' },
    { label: 'New image generation', icon: ImagePlus, run: () => navigate('/studio/generate'), hint: 'G I' },
    { label: 'Open AI Workspace', icon: Wand2, run: () => navigate('/studio/generate') },
    { label: 'Browse Creative Resources', icon: Library, run: () => navigate('/studio/resources'), hint: 'G R' },
    { label: 'Open Projects', icon: FolderKanban, run: () => navigate('/studio/projects') },
    { label: 'Create new project', icon: Folder, run: () => { navigate('/studio/projects'); toast('New project draft created') } },
    { label: 'Toggle theme', icon: Moon, run: () => { toggle(); toast('Theme switched', 'info') } },
    { label: 'Open Settings', icon: Settings, run: () => navigate('/studio/settings') },
    { label: 'Billing & subscription', icon: CreditCard, run: () => navigate('/studio/settings?tab=billing') },
    { label: 'Back to landing page', icon: Sparkles, run: () => navigate('/') },
  ]
  const filtered = commands.filter((c) => c.label.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => {
    if (open) { setQ(''); setIdx(0); setTimeout(() => inputRef.current?.focus(), 60) }
  }, [open])

  useEffect(() => { setIdx(0) }, [q])

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((i) => Math.min(i + 1, filtered.length - 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((i) => Math.max(i - 1, 0)) }
    if (e.key === 'Enter' && filtered[idx]) { filtered[idx].run(); onClose() }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-start justify-center pt-[14vh] px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
            className="relative w-full max-w-xl glass-2 rounded-2xl shadow-2xl shadow-black/60 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 border-b border-line">
              <Search size={16} className="text-ash shrink-0" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKey}
                placeholder="Type a command or search…"
                className="flex-1 h-13 bg-transparent outline-none text-sm text-mist placeholder:text-ash"
              />
              <kbd className="text-[10px] font-mono text-ash border border-line rounded-md px-1.5 py-0.5">ESC</kbd>
            </div>
            <div className="max-h-80 overflow-y-auto p-2">
              {filtered.length === 0 && <p className="text-sm text-ash text-center py-8">No results for “{q}”</p>}
              {filtered.map((c, i) => (
                <button
                  key={c.label}
                  type="button"
                  onMouseEnter={() => setIdx(i)}
                  onClick={() => { c.run(); onClose() }}
                  className={cn('w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors cursor-pointer', i === idx ? 'bg-glass2 text-mist' : 'text-smoke')}
                >
                  <c.icon size={15} className="text-ash" />
                  <span className="flex-1 text-left">{c.label}</span>
                  {c.hint && <kbd className="text-[10px] font-mono text-ash border border-line rounded-md px-1.5 py-0.5">{c.hint}</kbd>}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-4 px-4 py-2.5 border-t border-line text-[10.5px] text-ash">
              <span className="flex items-center gap-1.5"><kbd className="border border-line rounded px-1 font-mono">↑↓</kbd> navigate</span>
              <span className="flex items-center gap-1.5"><kbd className="border border-line rounded px-1 font-mono">↵</kbd> select</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function StudioLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [notifs, setNotifs] = useState(NOTIFICATIONS)
  const location = useLocation()
  const navigate = useNavigate()
  const { theme, toggle } = useTheme()
  const toast = useToast()
  const unread = notifs.filter((n) => n.unread).length
  const meta = TITLES[location.pathname] ?? TITLES['/studio']

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') { e.preventDefault(); setPaletteOpen((o) => !o) }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const sidebar = (mobile = false) => (
    <div className="flex flex-col h-full">
      <div className={cn('flex items-center h-16 shrink-0', collapsed && !mobile ? 'justify-center px-0' : 'justify-between px-5')}>
        <NavLink to="/" className="flex items-center gap-3 min-w-0">
          <Logo size={collapsed && !mobile ? 34 : 30} withWordmark={!(collapsed && !mobile)} />
        </NavLink>
        {!mobile && (
          <button type="button" onClick={() => setCollapsed((c) => !c)} className={cn('text-ash hover:text-mist transition-colors cursor-pointer', collapsed && 'hidden')}>
            <ChevronsLeft size={15} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto no-scrollbar px-3 py-2 flex flex-col gap-5">
        {NAV.map((group) => (
          <div key={group.section}>
            {!(collapsed && !mobile) && <p className="px-2.5 mb-1.5 text-[9.5px] font-semibold uppercase tracking-[0.24em] text-ash">{group.section}</p>}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.end}>
                  {({ isActive }) => (
                    <span
                      className={cn(
                        'relative flex items-center gap-3 rounded-xl text-[13px] font-medium transition-all duration-200 group',
                        collapsed && !mobile ? 'justify-center h-11 w-11 mx-auto' : 'px-3 h-10',
                        isActive ? 'text-mist' : 'text-ash hover:text-smoke',
                      )}
                    >
                      {isActive && (
                        <motion.span layoutId={mobile ? 'nav-m' : 'nav-d'} className="absolute inset-0 rounded-xl bg-glass2 border border-edge" transition={{ type: 'spring', stiffness: 420, damping: 34 }} />
                      )}
                      <item.icon size={16} className="relative z-10 shrink-0" />
                      {!(collapsed && !mobile) && <span className="relative z-10 flex-1 truncate">{item.label}</span>}
                      {!(collapsed && !mobile) && item.badge && <Badge variant="chrome" className="relative z-10">{item.badge}</Badge>}
                      {collapsed && !mobile && (
                        <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1.5 rounded-lg bg-ink border border-edge text-[11px] text-mist whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50 shadow-xl">{item.label}</span>
                      )}
                    </span>
                  )}
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-3 shrink-0">
        {!(collapsed && !mobile) ? (
          <div className="glass rounded-2xl p-4 mb-3 relative overflow-hidden">
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-white/6 blur-2xl" />
            <div className="flex items-center gap-3.5">
              <Ring value={72} size={52} stroke={5}>
                <span className="text-[10px] font-mono text-mist">72%</span>
              </Ring>
              <div className="min-w-0">
                <p className="text-[13px] font-semibold text-mist">2,880 credits</p>
                <p className="text-[11px] text-ash">of 4,000 · Pro plan</p>
              </div>
            </div>
            <Button variant="chrome" size="sm" className="w-full mt-3.5" onClick={() => navigate('/studio/settings?tab=subscription')}>
              <Zap size={13} /> Upgrade
            </Button>
          </div>
        ) : (
          <Tooltip label="2,880 / 4,000 credits" side="right">
            <div className="flex justify-center mb-3">
              <Ring value={72} size={44} stroke={4.5}>
                <Zap size={13} className="text-silver" />
              </Ring>
            </div>
          </Tooltip>
        )}
        <Menu
          align="left"
          width="w-52"
          trigger={
            <div className={cn('flex items-center gap-3 rounded-xl hover:bg-glass transition-colors p-2', collapsed && !mobile && 'justify-center p-1')}>
              <img src="/media/avatar-1.jpg" alt="Alex Myra" className="h-8.5 w-8.5 rounded-full object-cover ring-1 ring-edge" />
              {!(collapsed && !mobile) && (
                <>
                  <div className="flex-1 min-w-0 text-left">
                    <p className="text-[13px] font-medium text-mist truncate">Alex Myra</p>
                    <p className="text-[10.5px] text-ash">Pro · alex@myxelez.ai</p>
                  </div>
                  <ChevronsRight size={14} className="text-ash" />
                </>
              )}
            </div>
          }
          items={[
            { label: 'Profile', icon: <User size={14} />, onClick: () => navigate('/studio/settings') },
            { label: 'Billing', icon: <CreditCard size={14} />, onClick: () => navigate('/studio/settings?tab=billing') },
            { label: theme === 'dark' ? 'Light mode' : 'Dark mode', icon: theme === 'dark' ? <Sun size={14} /> : <Moon size={14} />, onClick: toggle },
            { divider: true },
            { label: 'Sign out', icon: <LogOut size={14} />, danger: true, onClick: () => { navigate('/'); toast('Signed out — see you soon', 'info') } },
          ]}
        />
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-void text-mist noise relative">
      {/* ambient glows */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-[radial-gradient(circle,rgba(198,206,255,0.07),transparent_65%)] blur-2xl animate-drift" />
        <div className="absolute bottom-0 right-0 h-[28rem] w-[28rem] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.045),transparent_65%)] blur-2xl animate-drift" style={{ animationDelay: '-9s' }} />
      </div>

      {/* Desktop sidebar */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 264 }}
        transition={{ type: 'spring', stiffness: 320, damping: 34 }}
        className="fixed inset-y-0 left-0 z-40 hidden lg:block border-r border-line bg-ink/70 backdrop-blur-xl"
      >
        {sidebar()}
      </motion.aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -300 }} animate={{ x: 0 }} exit={{ x: -300 }}
              transition={{ type: 'spring', stiffness: 360, damping: 36 }}
              className="fixed inset-y-0 left-0 z-50 w-72 border-r border-line bg-ink lg:hidden"
            >
              {sidebar(true)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className={cn('relative z-10 transition-[margin] duration-300', collapsed ? 'lg:ml-[76px]' : 'lg:ml-[264px]')}>
        <header className="sticky top-0 z-30 h-16 border-b border-line bg-void/70 backdrop-blur-xl flex items-center gap-3 px-4 sm:px-6">
          <button type="button" className="lg:hidden text-smoke hover:text-mist cursor-pointer" onClick={() => setMobileOpen(true)}>
            <PanelLeft size={18} />
          </button>
          <div className="min-w-0">
            <h1 className="font-display text-[15px] font-semibold tracking-tight truncate">{meta.title}</h1>
            <p className="text-[11px] text-ash truncate hidden sm:block">{meta.sub}</p>
          </div>

          <div className="flex-1" />

          <button
            type="button"
            onClick={() => setPaletteOpen(true)}
            className="hidden sm:flex items-center gap-2.5 h-9 w-56 px-3 rounded-xl glass text-ash hover:border-edge hover:text-smoke transition-all cursor-pointer"
          >
            <Search size={13.5} />
            <span className="text-xs flex-1 text-left">Search or command…</span>
            <span className="flex items-center gap-0.5 text-[10px] font-mono border border-line rounded px-1 py-0.5"><Command size={9} />K</span>
          </button>
          <Button variant="glass" size="icon-sm" className="sm:hidden" onClick={() => setPaletteOpen(true)} aria-label="Search"><Search size={15} /></Button>

          <Tooltip label={theme === 'dark' ? 'Light mode' : 'Dark mode'}>
            <Button variant="glass" size="icon-sm" onClick={toggle} aria-label="Toggle theme">
              <AnimatePresence mode="wait" initial={false}>
                <motion.span key={theme} initial={{ rotate: -60, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 60, opacity: 0 }} transition={{ duration: 0.25 }}>
                  {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
                </motion.span>
              </AnimatePresence>
            </Button>
          </Tooltip>

          <Popover
            width="w-[22rem]"
            trigger={
              <span className="relative inline-flex">
                <Button variant="glass" size="icon-sm" aria-label="Notifications"><Bell size={15} /></Button>
                {unread > 0 && <span className="absolute -top-1 -right-1 h-4 min-w-4 px-1 rounded-full bg-gradient-to-b from-white to-zinc-400 text-void text-[9px] font-bold flex items-center justify-center pointer-events-none">{unread}</span>}
              </span>
            }
          >
            {(close) => (
              <div>
                <div className="flex items-center justify-between px-4 py-3 border-b border-line">
                  <p className="text-[13px] font-semibold">Notifications</p>
                  <button type="button" onClick={() => { setNotifs(notifs.map((n) => ({ ...n, unread: false }))); toast('All caught up') }} className="text-[11px] text-ash hover:text-mist transition-colors cursor-pointer">
                    Mark all read
                  </button>
                </div>
                <div className="max-h-96 overflow-y-auto p-1.5">
                  {notifs.map((n) => (
                    <button
                      key={n.id}
                      type="button"
                      onClick={() => { setNotifs(notifs.map((x) => (x.id === n.id ? { ...x, unread: false } : x))); close() }}
                      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-glass transition-colors text-left cursor-pointer"
                    >
                      <span className={cn('mt-1.5 h-1.5 w-1.5 rounded-full shrink-0', n.unread ? 'bg-silver shadow-[0_0_8px_rgba(216,218,226,0.8)]' : 'bg-transparent')} />
                      <span className="min-w-0">
                        <span className="block text-[13px] font-medium text-mist truncate">{n.title}</span>
                        <span className="block text-[12px] text-ash leading-snug mt-0.5">{n.desc}</span>
                        <span className="block text-[10.5px] text-ash mt-1">{n.time}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Popover>

          <img src="/media/avatar-1.jpg" alt="profile" className="h-8.5 w-8.5 rounded-full object-cover ring-1 ring-edge cursor-pointer hidden sm:block" onClick={() => navigate('/studio/settings')} />
        </header>
        
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px] mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
    </div>
  )
}
