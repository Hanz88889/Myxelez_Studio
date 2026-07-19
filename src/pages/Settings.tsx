import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Activity, BarChart3, Check, Copy, CreditCard, Download, Eye, EyeOff, Github, Globe,
  KeyRound, Link2, Plus, RefreshCw, Shield, Smartphone, Star, Trash2, User, Wallet, Zap,
} from 'lucide-react'
import { API_KEYS_SEED, CONNECTED, CREDIT_HISTORY, INVOICES, PLANS, SESSIONS, USAGE_DAYS, USAGE_WEEK } from '../lib/data'
import { cn, copyText, uid } from '../lib/utils'
import { Badge, Button, Card, Field, Input, Reveal, Switch, Tabs, Textarea, useToast } from '../components/ui'

const TABS = [
  { id: 'profile', label: 'Profile', icon: <User size={13} /> },
  { id: 'subscription', label: 'Subscription', icon: <Star size={13} /> },
  { id: 'billing', label: 'Billing', icon: <Wallet size={13} /> },
  { id: 'api', label: 'API Keys', icon: <KeyRound size={13} /> },
  { id: 'security', label: 'Security', icon: <Shield size={13} /> },
  { id: 'connected', label: 'Connected', icon: <Link2 size={13} /> },
  { id: 'usage', label: 'Usage', icon: <BarChart3 size={13} /> },
]

function Profile() {
  const toast = useToast()
  const [name, setName] = useState('Alex Myra')
  const [handle, setHandle] = useState('alexmyra')
  const [bio, setBio] = useState('Creative director exploring liquid chrome aesthetics. Building worlds with MYX engines.')
  return (
    <div className="grid lg:grid-cols-[320px_1fr] gap-5">
      <Card spotlight={false} className="p-6 flex flex-col items-center text-center">
        <div className="relative group">
          <img src="/media/avatar-1.jpg" alt="avatar" className="h-24 w-24 rounded-3xl object-cover ring-1 ring-edge" />
          <button type="button" onClick={() => toast('Avatar upload opened', 'info')} className="absolute inset-0 rounded-3xl bg-black/55 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[11px] font-medium cursor-pointer">Change</button>
        </div>
        <p className="font-display text-lg font-semibold mt-4">{name}</p>
        <p className="text-[12px] text-ash">@{handle} · joined Jan 2026</p>
        <div className="flex gap-2 mt-4">
          <Badge variant="chrome">Pro</Badge>
          <Badge variant="mint">Verified creator</Badge>
        </div>
        <div className="w-full mt-6 pt-5 border-t border-line grid grid-cols-3 gap-2 text-center">
          {[['1.2K', 'Renders'], ['86', 'Prompts'], ['4.9K', 'Followers']].map(([v, l]) => (
            <div key={l}><p className="font-display text-lg font-semibold">{v}</p><p className="text-[10px] text-ash">{l}</p></div>
          ))}
        </div>
      </Card>
      <Card spotlight={false} className="p-6">
        <h3 className="font-display text-[15px] font-semibold mb-5">Public profile</h3>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Display name"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
          <Field label="Handle"><Input value={handle} onChange={(e) => setHandle(e.target.value)} /></Field>
          <Field label="Email" className="sm:col-span-2"><Input defaultValue="alex@myxelez.ai" type="email" /></Field>
          <Field label="Bio" className="sm:col-span-2"><Textarea rows={3} value={bio} onChange={(e) => setBio(e.target.value)} /></Field>
          <Field label="Website"><Input defaultValue="https://alexmyra.studio" /></Field>
          <Field label="Location"><Input defaultValue="Berlin, Germany" /></Field>
        </div>
        <div className="flex justify-end gap-2 mt-6">
          <Button variant="ghost">Discard</Button>
          <Button variant="chrome" onClick={() => toast('Profile saved')}><Check size={14} /> Save changes</Button>
        </div>
      </Card>
    </div>
  )
}

function Subscription() {
  const toast = useToast()
  return (
    <div className="flex flex-col gap-5">
      <Card spotlight={false} className="relative overflow-hidden p-6">
        <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/7 blur-3xl" />
        <div className="relative flex flex-col sm:flex-row sm:items-center gap-5">
          <span className="h-14 w-14 rounded-2xl btn-chrome flex items-center justify-center"><Zap size={22} fill="currentColor" /></span>
          <div className="flex-1">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="font-display text-xl font-semibold">Pro plan</h3>
              <Badge variant="mint">Active</Badge>
            </div>
            <p className="text-[13px] text-smoke mt-1">$24/month · renews Mar 1, 2026 · 4,000 credits monthly</p>
          </div>
          <div className="flex gap-2">
            <Button variant="glass" onClick={() => toast('Plan change scheduled for next cycle', 'info')}>Change plan</Button>
            <Button variant="danger" onClick={() => toast('Subscription set to cancel at period end', 'err')}>Cancel</Button>
          </div>
        </div>
        <div className="relative mt-6">
          <div className="flex justify-between text-[11px] text-ash mb-2"><span>Credits this cycle</span><span className="font-mono">2,880 / 4,000</span></div>
          <div className="h-2 rounded-full bg-haze overflow-hidden"><motion.div initial={{ width: 0 }} animate={{ width: '72%' }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }} className="h-full rounded-full bg-gradient-to-r from-zinc-500 via-zinc-300 to-white" /></div>
        </div>
      </Card>
      <div className="grid md:grid-cols-3 gap-4">
        {PLANS.map((p) => (
          <Card key={p.id} hover className={cn('p-5', p.id === 'pro' && 'border-edge bg-glass2')}>
            <div className="flex items-center justify-between">
              <h4 className="font-display font-semibold">{p.name}</h4>
              {p.id === 'pro' && <Badge variant="chrome">Current</Badge>}
            </div>
            <p className="font-display text-2xl font-medium mt-2 text-chrome">${p.monthly}<span className="text-xs text-ash">/mo</span></p>
            <ul className="mt-4 flex flex-col gap-1.5">
              {p.features.slice(0, 4).map((f) => <li key={f} className="text-[12px] text-smoke flex gap-2"><Check size={12} className="text-silver mt-0.5 shrink-0" />{f}</li>)}
            </ul>
            <Button variant={p.id === 'pro' ? 'glass' : 'outline'} size="sm" className="w-full mt-5" disabled={p.id === 'pro'} onClick={() => toast(p.id === 'starter' ? 'Downgrade scheduled' : 'Upgrade to Studio — welcome aboard')}>
              {p.id === 'pro' ? 'Current plan' : p.id === 'starter' ? 'Downgrade' : 'Upgrade'}
            </Button>
          </Card>
        ))}
      </div>
    </div>
  )
}

function Billing() {
  const toast = useToast()
  return (
    <div className="grid lg:grid-cols-[340px_1fr] gap-5">
      <Card spotlight={false} className="p-6">
        <h3 className="font-display text-[15px] font-semibold mb-5">Payment method</h3>
        <div className="relative rounded-2xl overflow-hidden border border-edge bg-gradient-to-br from-zinc-800 via-zinc-900 to-black p-5 h-44 flex flex-col justify-between">
          <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
          <div className="flex items-center justify-between relative">
            <CreditCard size={20} className="text-silver" />
            <span className="font-display font-bold italic text-white/90 tracking-wider">VISA</span>
          </div>
          <div className="relative">
            <p className="font-mono text-[15px] tracking-[0.2em] text-white/90">•••• •••• •••• 4242</p>
            <div className="flex justify-between mt-2 text-[10.5px] text-white/50 font-mono">
              <span>ALEX MYRA</span><span>09 / 28</span>
            </div>
          </div>
        </div>
        <Button variant="glass" className="w-full mt-4" onClick={() => toast('Card update flow opened', 'info')}>Update card</Button>
        <div className="mt-5 pt-5 border-t border-line flex flex-col gap-2.5 text-[12.5px]">
          <div className="flex justify-between"><span className="text-ash">Billing email</span><span className="text-mist">alex@myxelez.ai</span></div>
          <div className="flex justify-between"><span className="text-ash">VAT ID</span><span className="text-mist font-mono">DE314159265</span></div>
          <div className="flex justify-between"><span className="text-ash">Next invoice</span><span className="text-mist">Mar 1, 2026</span></div>
        </div>
      </Card>
      <Card spotlight={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-line flex items-center justify-between">
          <h3 className="font-display text-[15px] font-semibold">Invoices</h3>
          <Badge variant="chrome">{INVOICES.length}</Badge>
        </div>
        {INVOICES.map((inv) => (
          <div key={inv.id} className="flex items-center gap-4 px-6 py-4 border-b border-line last:border-0 hover:bg-glass transition-colors">
            <span className="h-9 w-9 rounded-xl glass flex items-center justify-center text-silver shrink-0"><Wallet size={14} /></span>
            <div className="flex-1 min-w-0">
              <p className="text-[13.5px] font-medium text-mist font-mono">{inv.id}</p>
              <p className="text-[11.5px] text-ash">{inv.date}</p>
            </div>
            <span className="text-[13px] font-medium text-mist">{inv.amount}</span>
            <Badge variant="mint">{inv.status}</Badge>
            <Button variant="ghost" size="icon-sm" onClick={() => toast('Invoice PDF downloading')}><Download size={13} /></Button>
          </div>
        ))}
      </Card>
    </div>
  )
}

function ApiKeys() {
  const toast = useToast()
  const [keys, setKeys] = useState(API_KEYS_SEED)
  const [revealed, setRevealed] = useState<Set<string>>(new Set())
  const toggleReveal = (id: string) => setRevealed((s) => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  return (
    <div className="flex flex-col gap-5">
      <Card spotlight={false} className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h3 className="font-display text-[15px] font-semibold">API keys</h3>
            <p className="text-[12.5px] text-ash mt-1">Authenticate the MYX engines from your own stack. Keep keys secret.</p>
          </div>
          <Button variant="chrome" size="sm" onClick={() => { setKeys((k) => [...k, { id: uid(), name: `Key ${k.length + 1}`, prefix: 'myx_live_' + Math.random().toString(36).slice(2, 6), created: 'Just now', last: 'never', scopes: 'read:write' }]); toast('New API key created — store it safely') }}>
            <Plus size={13} /> Create key
          </Button>
        </div>
        <div className="flex flex-col gap-3">
          {keys.map((k) => (
            <div key={k.id} className="glass rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-3">
              <span className="h-9 w-9 rounded-lg bg-glass2 border border-edge flex items-center justify-center text-silver shrink-0"><KeyRound size={14} /></span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-[13.5px] font-semibold text-mist">{k.name}</p>
                  <Badge>{k.scopes}</Badge>
                </div>
                <p className="text-[12px] font-mono text-ash mt-1 truncate">
                  {revealed.has(k.id) ? `${k.prefix}xK9d2mQ7vL4nB8cR1tY6uW3zA` : `${k.prefix}••••••••••••••••••••`}
                </p>
              </div>
              <div className="text-[11px] text-ash shrink-0 hidden sm:block">
                <p>Created {k.created}</p>
                <p className="mt-0.5">Last used {k.last}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                <Button variant="ghost" size="icon-sm" onClick={() => toggleReveal(k.id)}>{revealed.has(k.id) ? <EyeOff size={13} /> : <Eye size={13} />}</Button>
                <Button variant="ghost" size="icon-sm" onClick={async () => { await copyText(`${k.prefix}xK9d2mQ7vL4nB8cR1tY6uW3zA`); toast('API key copied') }}><Copy size={13} /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => toast('Key rotated — old key revoked in 24h', 'info')}><RefreshCw size={13} /></Button>
                <Button variant="ghost" size="icon-sm" onClick={() => { setKeys(keys.filter((x) => x.id !== k.id)); toast('API key revoked', 'err') }}><Trash2 size={13} className="text-blush" /></Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
      <Card spotlight={false} className="p-6">
        <div className="flex items-center gap-2.5 mb-3"><Globe size={15} className="text-silver" /><h3 className="font-display text-[15px] font-semibold">Webhooks</h3></div>
        <p className="text-[12.5px] text-ash leading-relaxed">Receive render completion events in your pipeline.</p>
        <div className="flex gap-2 mt-4">
          <Input defaultValue="https://api.yourapp.dev/hooks/myxelez" className="font-mono text-xs" />
          <Button variant="glass" onClick={() => toast('Webhook endpoint saved')}>Save</Button>
        </div>
      </Card>
    </div>
  )
}

function Security() {
  const toast = useToast()
  const [twoFa, setTwoFa] = useState(true)
  const [alerts, setAlerts] = useState(true)
  return (
    <div className="grid lg:grid-cols-2 gap-5">
      <Card spotlight={false} className="p-6">
        <h3 className="font-display text-[15px] font-semibold mb-5">Password &amp; authentication</h3>
        <div className="flex flex-col gap-4">
          <Field label="Current password"><Input type="password" placeholder="••••••••••" /></Field>
          <Field label="New password" hint="12+ characters with a symbol and a number."><Input type="password" placeholder="New password" /></Field>
          <Field label="Confirm new password"><Input type="password" placeholder="Repeat new password" /></Field>
        </div>
        <Button variant="chrome" className="mt-5" onClick={() => toast('Password updated')}><Shield size={14} /> Update password</Button>
        <div className="my-6 h-px bg-line" />
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="h-9 w-9 rounded-lg glass flex items-center justify-center text-silver shrink-0"><Smartphone size={14} /></span>
            <div>
              <p className="text-[13.5px] font-medium text-mist">Two-factor authentication</p>
              <p className="text-[11.5px] text-ash mt-0.5">Authenticator app · backup codes generated</p>
            </div>
          </div>
          <Switch checked={twoFa} onChange={(v) => { setTwoFa(v); toast(v ? '2FA enabled' : '2FA disabled', v ? 'ok' : 'info') }} />
        </div>
        <div className="flex items-center justify-between gap-4 mt-4">
          <div className="flex items-start gap-3">
            <span className="h-9 w-9 rounded-lg glass flex items-center justify-center text-silver shrink-0"><Activity size={14} /></span>
            <div>
              <p className="text-[13.5px] font-medium text-mist">Login alerts</p>
              <p className="text-[11.5px] text-ash mt-0.5">Email me about new device sign-ins</p>
            </div>
          </div>
          <Switch checked={alerts} onChange={setAlerts} />
        </div>
      </Card>
      <Card spotlight={false} className="p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-[15px] font-semibold">Active sessions</h3>
          <Button variant="danger" size="sm" onClick={() => toast('All other sessions revoked', 'info')}>Revoke all</Button>
        </div>
        <div className="flex flex-col gap-3">
          {SESSIONS.map((s) => (
            <div key={s.id} className="flex items-center gap-3.5 glass rounded-xl p-3.5">
              <span className="h-9 w-9 rounded-lg bg-glass2 border border-edge flex items-center justify-center text-silver shrink-0"><Smartphone size={14} /></span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-medium text-mist truncate">{s.device}</p>
                <p className="text-[11px] text-ash">{s.location} · {s.last}</p>
              </div>
              {s.current ? <Badge variant="mint">This device</Badge> : <Button variant="ghost" size="sm" onClick={() => toast('Session revoked', 'info')}>Revoke</Button>}
            </div>
          ))}
        </div>
        <div className="mt-6 rounded-xl border border-blush/25 bg-blush/5 p-4">
          <p className="text-[13px] font-semibold text-blush">Danger zone</p>
          <p className="text-[12px] text-smoke mt-1 leading-relaxed">Permanently delete your account, all projects and 1.2K renders. This cannot be undone.</p>
          <Button variant="danger" size="sm" className="mt-3" onClick={() => toast('Account deletion requires email confirmation', 'err')}>Delete account</Button>
        </div>
      </Card>
    </div>
  )
}

function ConnectedAccounts() {
  const toast = useToast()
  const [items, setItems] = useState(CONNECTED)
  return (
    <div className="grid sm:grid-cols-2 gap-4">
      {items.map((c) => (
        <Card key={c.id} hover className="p-5 flex items-center gap-4">
          <span className="h-11 w-11 rounded-xl bg-glass2 border border-edge flex items-center justify-center text-silver shrink-0">
            {c.id === 'github' ? <Github size={17} /> : <Link2 size={17} />}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-semibold text-mist">{c.name}</p>
            <p className="text-[11.5px] text-ash">{c.desc}</p>
          </div>
          {c.connected ? (
            <Button variant="glass" size="sm" onClick={() => { setItems(items.map((x) => (x.id === c.id ? { ...x, connected: false } : x))); toast(`${c.name} disconnected`, 'info') }}>
              <Check size={12} className="text-mint" /> Connected
            </Button>
          ) : (
            <Button variant="chrome" size="sm" onClick={() => { setItems(items.map((x) => (x.id === c.id ? { ...x, connected: true } : x))); toast(`${c.name} connected`) }}>Connect</Button>
          )}
        </Card>
      ))}
    </div>
  )
}

function Usage() {
  const max = Math.max(...USAGE_WEEK)
  return (
    <div className="flex flex-col gap-5">
      <div className="grid sm:grid-cols-3 gap-4">
        {[
          { label: 'Credits used · 7d', value: '408', sub: '+24% vs last week' },
          { label: 'Avg render time', value: '6.4s', sub: 'Photon v2 · 2K' },
          { label: 'API calls · 30d', value: '12,847', sub: '99.2% success' },
        ].map((s) => (
          <Card key={s.label} hover className="p-5">
            <p className="text-[11px] uppercase tracking-[0.18em] text-ash">{s.label}</p>
            <p className="font-display text-3xl font-medium mt-2 text-chrome">{s.value}</p>
            <p className="text-[11.5px] text-ash mt-1">{s.sub}</p>
          </Card>
        ))}
      </div>
      <Card spotlight={false} className="p-6">
        <h3 className="font-display text-[15px] font-semibold mb-6">Daily credit consumption</h3>
        <div className="flex items-end gap-3 h-40">
          {USAGE_WEEK.map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
              <span className="text-[10px] font-mono text-ash opacity-0 group-hover:opacity-100 transition-opacity">{v}</span>
              <motion.div initial={{ height: 0 }} animate={{ height: `${(v / max) * 100}%` }} transition={{ delay: i * 0.06, duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="w-full rounded-lg bg-gradient-to-t from-white/8 to-white/35 group-hover:to-white/60 transition-all min-h-2" />
       <span className="text-[10px] text-ash">{USAGE_DAYS[i]}</span>
            </div>
          ))}
        </div>
      </Card>
      <Card spotlight={false} className="overflow-hidden">
        <div className="px-6 py-4 border-b border-line"><h3 className="font-display text-[15px] font-semibold">Credit history</h3></div>
        {CREDIT_HISTORY.map((c) => (
          <div key={c.id} className="flex items-center gap-4 px-6 py-3.5 border-b border-line last:border-0 hover:bg-glass transition-colors">
            <span className={cn('h-8 w-8 rounded-lg flex items-center justify-center shrink-0', c.credits > 0 ? 'bg-mint/10 text-mint' : 'bg-glass text-ash')}>
              {c.credits > 0 ? <Plus size={13} /> : <Zap size={13} />}
            </span>
            <p className="flex-1 text-[13px] text-smoke truncate">{c.action}</p>
            <span className="text-[11px] text-ash hidden sm:block">{c.date}</span>
            <span className={cn('text-[13px] font-mono font-medium w-14 text-right', c.credits > 0 ? 'text-mint' : 'text-smoke')}>
              {c.credits > 0 ? `+${c.credits}` : c.credits}
            </span>
          </div>
        ))}
      </Card>
    </div>
  )
}

export default function Settings() {
  const [search, setSearchParams] = useSearchParams()
  const tab = TABS.some((t) => t.id === search.get('tab')) ? search.get('tab')! : 'profile'
  return (
    <div className="flex flex-col gap-6 max-w-6xl">
      <Reveal>
        <Tabs value={tab} onChange={(v) => setSearchParams({ tab: v })} items={TABS} />
      </Reveal>
      <AnimatePresence mode="wait">
        <motion.div key={tab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
          {tab === 'profile' && <Profile />}
          {tab === 'subscription' && <Subscription />}
          {tab === 'billing' && <Billing />}
          {tab === 'api' && <ApiKeys />}
          {tab === 'security' && <Security />}
          {tab === 'connected' && <ConnectedAccounts />}
          {tab === 'usage' && <Usage />}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
