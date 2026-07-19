import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowRight, Menu as MenuIcon, Moon, Sun, X } from 'lucide-react'
import { cn } from '../../lib/utils'
import { useTheme } from '../../lib/theme'
import { Button, Logo } from '../../components/ui'

const LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'Workflow', href: '#workflow' },
  { label: 'Showcase', href: '#showcase' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function LandingNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="fixed top-0 inset-x-0 z-50"
      >
        <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 transition-all duration-500', scrolled ? 'pt-3' : 'pt-5')}>
          <div className={cn('flex items-center gap-2 rounded-2xl px-3 sm:px-4 h-14 transition-all duration-500', scrolled ? 'glass-2 shadow-2xl shadow-black/30' : 'border border-transparent')}>
            <Link to="/" aria-label="Myxelez Studio home"><Logo size={30} withWordmark /></Link>
            <nav className="hidden md:flex items-center gap-1 mx-auto">
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} className="px-3.5 h-9 flex items-center rounded-lg text-[13px] font-medium text-smoke hover:text-mist hover:bg-glass transition-colors">
                  {l.label}
                </a>
              ))}
            </nav>
            <div className="flex items-center gap-2 ml-auto md:ml-0">
              <Button variant="ghost" size="icon-sm" onClick={toggle} aria-label="Toggle theme">
                {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
              </Button>
              <Link to="/studio" className="hidden sm:block"><Button variant="ghost" size="sm">Sign in</Button></Link>
              <Link to="/studio"><Button variant="chrome" size="sm">Launch Studio <ArrowRight size={13} /></Button></Link>
              <Button variant="glass" size="icon-sm" className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu"><MenuIcon size={16} /></Button>
            </div>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-void/90 backdrop-blur-xl md:hidden flex flex-col">
            <div className="flex items-center justify-between px-5 h-20">
              <Logo size={30} withWordmark />
              <Button variant="glass" size="icon-sm" onClick={() => setOpen(false)} aria-label="Close"><X size={16} /></Button>
            </div>
            <nav className="flex flex-col gap-1 px-6 pt-6">
              {LINKS.map((l, i) => (
                <motion.a
                  key={l.label}
                  href={l.href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.06 * i }}
                  className="font-display text-3xl font-medium text-mist py-3 border-b border-line"
                >
                  {l.label}
                </motion.a>
              ))}
              <Link to="/studio" className="mt-8"><Button variant="chrome" size="lg" className="w-full">Launch Studio <ArrowRight size={15} /></Button></Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
