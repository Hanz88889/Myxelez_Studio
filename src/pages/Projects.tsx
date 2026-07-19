import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Archive, ArchiveRestore, Copy, Folder, FolderOpen, FolderPlus, LayoutGrid, LayoutList,
  MoreHorizontal, Pencil, Plus, Search, Star, Tag, Trash2, Users, X,
} from 'lucide-react'
import { ALL_TAGS, COLLECTIONS, FOLDERS, PROJECTS, type Project } from '../lib/data'
import { cn, timeAgo, uid } from '../lib/utils'
import { Badge, Button, Card, EmptyState, Input, Menu, Modal, Reveal, Tabs, Tooltip, useToast } from '../components/ui'

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>(PROJECTS)
  const [q, setQ] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [tag, setTag] = useState<string | null>(null)
  const [folder, setFolder] = useState<string | null>(null)
  const [showArchived, setShowArchived] = useState(false)
  const [newOpen, setNewOpen] = useState(false)
  const [newName, setNewName] = useState('')
  const toast = useToast()

  const filtered = useMemo(() => {
    return projects
      .filter((p) => (showArchived ? p.archived : !p.archived))
      .filter((p) => !tag || p.tags.includes(tag))
      .filter((p) => !q || p.name.toLowerCase().includes(q.toLowerCase()))
  }, [projects, q, tag, showArchived])

  const starred = projects.filter((p) => p.starred && !p.archived)

  const toggleStar = (id: string) => setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, starred: !p.starred } : p)))
  const toggleArchive = (id: string) => {
    setProjects((ps) => ps.map((p) => (p.id === id ? { ...p, archived: !p.archived } : p)))
    toast('Project updated')
  }
  const remove = (id: string) => {
    setProjects((ps) => ps.filter((p) => p.id !== id))
    toast('Project deleted', 'info')
  }
  const duplicate = (id: string) => {
    const src = projects.find((p) => p.id === id)
    if (!src) return
    setProjects((ps) => [{ ...src, id: uid(), name: src.name + ' (copy)', starred: false }, ...ps])
    toast('Project duplicated')
  }
  const createProject = () => {
    if (!newName.trim()) return
    setProjects((ps) => [
      { id: uid(), name: newName.trim(), cover: '/media/gen-chrome.jpg', items: 0, updated: new Date().toISOString(), tags: ['new'], starred: false, archived: false, kind: 'Untitled' },
      ...ps,
    ])
    setNewOpen(false)
    setNewName('')
    toast(`Project “${newName.trim()}” created`)
  }

  const ProjectCard = ({ p, i }: { p: Project; i: number }) => (
    <motion.div layout initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ delay: Math.min(i * 0.05, 0.3) }}>
      <Card hover className="overflow-hidden group">
        <div className="relative h-40">
          <img src={p.cover} alt={p.name} className="absolute inset-0 h-full w-full object-cover opacity-60 transition-all duration-700 group-hover:opacity-85 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-void via-void/25 to-transparent" />
          <div className="absolute top-3 left-3 flex gap-1.5">
            <Badge variant="chrome">{p.kind}</Badge>
            {p.archived && <Badge variant="ember"><Archive size={9} /> Archived</Badge>}
          </div>
          <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Tooltip label={p.starred ? 'Unstar' : 'Star'}>
              <Button variant="glass" size="icon-sm" onClick={() => toggleStar(p.id)}>
                <Star size={13} className={p.starred ? 'text-ember' : ''} fill={p.starred ? 'currentColor' : 'none'} />
              </Button>
            </Tooltip>
            <Menu
              width="w-48"
              trigger={<Button variant="glass" size="icon-sm"><MoreHorizontal size={14} /></Button>}
              items={[
                { label: 'Rename', icon: <Pencil size={13} />, onClick: () => toast('Rename coming to context menu', 'info') },
                { label: 'Duplicate', icon: <Copy size={13} />, onClick: () => duplicate(p.id) },
                p.archived
                  ? { label: 'Restore', icon: <ArchiveRestore size={13} />, onClick: () => toggleArchive(p.id) }
                  : { label: 'Archive', icon: <Archive size={13} />, onClick: () => toggleArchive(p.id) },
                { divider: true },
                { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => remove(p.id) },
              ]}
            />
          </div>
          <div className="absolute bottom-0 inset-x-0 p-4">
            <h4 className="font-display text-[16px] font-semibold text-white truncate">{p.name}</h4>
            <p className="text-[11px] text-white/60 mt-0.5">{p.items} assets · {timeAgo(p.updated)}</p>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center gap-1.5 flex-wrap">
          {p.tags.map((t) => (
            <button key={t} type="button" onClick={() => setTag(t)} className="cursor-pointer">
              <Badge variant={tag === t ? 'chrome' : 'default'}>#{t}</Badge>
            </button>
          ))}
        </div>
      </Card>
    </motion.div>
  )

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start">
      {/* Left rail */}
      <Reveal className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24 flex flex-col gap-4">
        <Card spotlight={false} className="p-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-ash">Folders</p>
            <Tooltip label="New folder"><button type="button" onClick={() => toast('Folder created', 'info')} className="text-ash hover:text-mist cursor-pointer"><FolderPlus size={14} /></button></Tooltip>
          </div>
          <div className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => setFolder(null)}
              className={cn('flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[12.5px] font-medium cursor-pointer', folder === null ? 'bg-glass2 border border-edge text-mist' : 'text-ash hover:text-smoke border border-transparent')}
            >
              <FolderOpen size={14} /> All projects
              <span className="ml-auto text-[10.5px] font-mono">{projects.filter((p) => !p.archived).length}</span>
            </button>
            {FOLDERS.map((f) => (
              <button
                key={f.id}
                type="button"
                onClick={() => setFolder(folder === f.id ? null : f.id)}
                className={cn('flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[12.5px] font-medium cursor-pointer', folder === f.id ? 'bg-glass2 border border-edge text-mist' : 'text-ash hover:text-smoke border border-transparent')}
              >
                <Folder size={14} /> <span className="truncate">{f.name}</span>
                {f.shared && <Users size={11} className="text-frost shrink-0" />}
                <span className="ml-auto text-[10.5px] font-mono">{f.count}</span>
              </button>
            ))}
          </div>
          <div className="my-3 h-px bg-line" />
          <button
            type="button"
            onClick={() => setShowArchived((s) => !s)}
            className={cn('w-full flex items-center gap-2.5 px-2.5 h-9 rounded-lg text-[12.5px] font-medium cursor-pointer', showArchived ? 'bg-glass2 border border-edge text-mist' : 'text-ash hover:text-smoke border border-transparent')}
          >
            <Archive size={14} /> Archive
            <span className="ml-auto text-[10.5px] font-mono">{projects.filter((p) => p.archived).length}</span>
          </button>
        </Card>

        <Card spotlight={false} className="p-3">
          <p className="px-2 mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-ash">Collections</p>
          <div className="flex flex-col gap-1">
            {COLLECTIONS.map((c) => (
              <button key={c.id} type="button" onClick={() => toast(`Collection “${c.name}” opened`, 'info')} className="flex items-center gap-3 p-2 rounded-xl hover:bg-glass transition-colors cursor-pointer text-left">
                <div className="flex -space-x-3">
                  {c.covers.slice(0, 3).map((src) => <img key={src} src={src} alt="" className="h-8 w-8 rounded-lg object-cover ring-2 ring-ink" />)}
                </div>
                <div className="min-w-0">
                  <p className="text-[12.5px] font-medium text-mist truncate">{c.name}</p>
                  <p className="text-[10.5px] text-ash">{c.count} items</p>
                </div>
              </button>
            ))}
          </div>
        </Card>

        <Card spotlight={false} className="p-3">
          <p className="px-2 mb-2.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-ash flex items-center gap-1.5"><Tag size={11} /> Tags</p>
          <div className="flex flex-wrap gap-1.5 px-1">
            {ALL_TAGS.map((t) => (
              <button key={t} type="button" onClick={() => setTag(tag === t ? null : t)} className="cursor-pointer">
                <Badge variant={tag === t ? 'chrome' : 'default'}>#{t}</Badge>
              </button>
            ))}
          </div>
        </Card>
      </Reveal>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col gap-5">
        <Reveal delay={0.05}>
          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative flex-1">
              <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ash" />
              <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search projects…" className="pl-10 h-11" />
              {q && <button type="button" onClick={() => setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ash hover:text-mist cursor-pointer"><X size={14} /></button>}
            </div>
            <Tabs
              size="sm"
              value={view}
              onChange={(v) => setView(v as 'grid' | 'list')}
              items={[
                { id: 'grid', label: 'Grid', icon: <LayoutGrid size={12} /> },
                { id: 'list', label: 'List', icon: <LayoutList size={12} /> },
              ]}
            />
            <Button variant="chrome" onClick={() => setNewOpen(true)}><Plus size={15} /> New project</Button>
          </div>
        </Reveal>

        {/* Starred strip */}
        {!showArchived && !tag && !q && starred.length > 0 && (
          <Reveal delay={0.08}>
            <p className="text-[10.5px] font-semibold uppercase tracking-[0.22em] text-ash mb-3 flex items-center gap-2"><Star size={11} className="text-ember" fill="currentColor" /> Starred</p>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {starred.map((p) => (
                <div key={p.id} className="relative shrink-0 w-52 h-28 rounded-2xl overflow-hidden border border-line group cursor-pointer">
                  <img src={p.cover} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-void/90 to-transparent" />
                  <p className="absolute bottom-2.5 left-3.5 right-3 text-[12.5px] font-semibold text-white truncate">{p.name}</p>
                  <Star size={12} className="absolute top-2.5 right-2.5 text-ember" fill="currentColor" />
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* Projects */}
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState
                icon={showArchived ? <Archive size={22} /> : <Folder size={22} />}
                title={showArchived ? 'Archive is empty' : 'No projects found'}
                desc={showArchived ? 'Archived projects will rest here, safely out of the way.' : 'Try a different search, or start something new.'}
                action={!showArchived ? <Button variant="chrome" size="sm" onClick={() => setNewOpen(true)}><Plus size={13} /> New project</Button> : undefined}
              />
            </motion.div>
          ) : view === 'grid' ? (
            <motion.div key="grid" layout className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((p, i) => <ProjectCard key={p.id} p={p} i={i} />)}
            </motion.div>
          ) : (
            <motion.div key="list" layout className="flex flex-col gap-2">
              {filtered.map((p, i) => (
                <motion.div key={p.id} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.04, 0.3) }}>
                  <Card hover className="flex items-center gap-4 px-4 py-3">
                    <img src={p.cover} alt="" className="h-12 w-12 rounded-xl object-cover border border-line" />
                    <div className="flex-1 min-w-0">
                      <p className="text-[14px] font-semibold text-mist truncate flex items-center gap-2">
                        {p.name}
                        {p.starred && <Star size={11} className="text-ember shrink-0" fill="currentColor" />}
                      </p>
                      <p className="text-[11.5px] text-ash">{p.kind} · {p.items} assets · {timeAgo(p.updated)}</p>
                    </div>
                    <div className="hidden md:flex gap-1.5">{p.tags.map((t) => <Badge key={t}>#{t}</Badge>)}</div>
                    <div className="flex gap-1.5">
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleStar(p.id)}><Star size={13} className={p.starred ? 'text-ember' : ''} fill={p.starred ? 'currentColor' : 'none'} /></Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => toggleArchive(p.id)}>{p.archived ? <ArchiveRestore size={13} /> : <Archive size={13} />}</Button>
                      <Button variant="ghost" size="icon-sm" onClick={() => remove(p.id)}><Trash2 size={13} className="text-blush" /></Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* New project modal */}
      <Modal open={newOpen} onClose={() => setNewOpen(false)}>
        <div className="p-6">
          <h3 className="font-display text-xl font-semibold">New project</h3>
          <p className="text-[13px] text-ash mt-1">Cloud-synced, version-controlled, ready for your team.</p>
          <Input
            autoFocus
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && createProject()}
            placeholder="e.g. Silver Rain — Campaign"
            className="mt-5 h-11"
          />
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="ghost" onClick={() => setNewOpen(false)}>Cancel</Button>
            <Button variant="chrome" onClick={createProject} disabled={!newName.trim()}><Plus size={14} /> Create project</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
