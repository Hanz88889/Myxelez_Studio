/* ─── Myxelez Studio · Data Layer ─────────────────────────────────── */

export interface GalleryItem {
  id: string
  src: string
  title: string
  prompt: string
  model: string
  style: string
  ratio: string
  seed: number
  time: string
  liked: boolean
}

export const GALLERY: GalleryItem[] = [
  { id: 'g1', src: '/media/gen-portrait.jpg', title: 'Chrome Reverie', prompt: 'Cinematic portrait of a woman draped in liquid silver light, futuristic noir, 85mm f/1.4, volumetric haze', model: 'MYX Photon v2', style: 'Neo Noir', ratio: '3:4', seed: 84120031, time: '12m ago', liked: true },
  { id: 'g2', src: '/media/gen-city.jpg', title: 'Neon Rain District', prompt: 'Futuristic megacity in the rain, neon signage reflecting on wet streets, aerial light trails, moody silver-blue grade', model: 'MYX Photon v2', style: 'Neo Tokyo', ratio: '16:9', seed: 519902147, time: '38m ago', liked: false },
  { id: 'g3', src: '/media/gen-astro.jpg', title: 'Void Walker', prompt: 'Astronaut in a glossy obsidian suit standing in dense fog, dramatic rim light, minimal dark backdrop, film still', model: 'MYX Flux XL', style: 'Cinematic', ratio: '3:4', seed: 277441890, time: '1h ago', liked: true },
  { id: 'g4', src: '/media/gen-fashion.jpg', title: 'Argent Couture', prompt: 'High fashion editorial, sculptural metallic silver garment, dramatic studio lighting on charcoal backdrop', model: 'MYX Photon v2', style: 'Editorial', ratio: '3:4', seed: 902114556, time: '2h ago', liked: false },
  { id: 'g5', src: '/media/gen-arch.jpg', title: 'Monolith I', prompt: 'Brutalist concrete monolith at dusk, single beam of light cutting through fog, minimalist composition', model: 'MYX Flux XL', style: 'Architect', ratio: '16:9', seed: 668120044, time: '3h ago', liked: true },
  { id: 'g6', src: '/media/gen-car.jpg', title: 'GT Obsidian', prompt: 'Luxury grand tourer in a dark studio, razor rim lighting, carbon details, reflective black floor', model: 'MYX Photon v2', style: 'Product', ratio: '16:9', seed: 340998172, time: '5h ago', liked: false },
  { id: 'g7', src: '/media/gen-chrome.jpg', title: 'Liquid Argentum', prompt: 'Abstract liquid chrome waves frozen mid-motion, mirror reflections, macro detail, dark gradient backdrop', model: 'MYX Photon v2', style: 'Abstract', ratio: '16:9', seed: 710228493, time: '6h ago', liked: true },
  { id: 'g8', src: '/media/gen-forest.jpg', title: 'Mist Protocol', prompt: 'Dark conifer forest swallowed by fog, blue hour, a lonely road vanishing into mist, cinematic grade', model: 'MYX Photon v2', style: 'Cinematic', ratio: '16:9', seed: 153667820, time: '8h ago', liked: false },
  { id: 'g9', src: '/media/gen-flower.jpg', title: 'Orchid Spectre', prompt: 'Macro translucent white orchid on pure black, dew droplets, dramatic side light, dark luxury aesthetic', model: 'MYX Canvas HD', style: 'Macro', ratio: '1:1', seed: 990443215, time: '1d ago', liked: true },
  { id: 'g10', src: '/media/gen-ocean.jpg', title: 'Nocturne Tide', prompt: 'Dark ocean wave curling at night, moonlit silver highlights on black water, cinematic spray detail', model: 'MYX Flux XL', style: 'Cinematic', ratio: '16:9', seed: 480112736, time: '1d ago', liked: false },
  { id: 'g11', src: '/media/gen-prism.jpg', title: 'Refraction Study 04', prompt: 'Glass prism refracting a beam of white light, soft spectral dispersion, floating dust, macro cinematic', model: 'MYX Canvas HD', style: 'Abstract', ratio: '16:9', seed: 611550924, time: '2d ago', liked: false },
  { id: 'g12', src: '/media/gen-desert.jpg', title: 'Dune Drift', prompt: 'Aerial desert dunes at blue hour, rippled sand patterns, lone figure walking, silver-blue moonlight', model: 'MYX Photon v2', style: 'Minimal', ratio: '16:9', seed: 208774191, time: '2d ago', liked: true },
]

export const MODELS = [
  { id: 'photon-v2', name: 'MYX Photon v2', desc: 'Flagship image engine · best quality', badge: 'Pro' },
  { id: 'photon-turbo', name: 'Photon Turbo', desc: 'Draft iterations · 4× faster', badge: 'Fast' },
  { id: 'flux-xl', name: 'MYX Flux XL', desc: 'Experimental detail & realism', badge: 'Lab' },
  { id: 'motion-v1', name: 'MYX Motion v1', desc: 'Cinematic video synthesis', badge: 'Video' },
  { id: 'canvas-hd', name: 'Canvas HD', desc: 'Editing, inpaint & upscale', badge: 'Edit' },
]

export const STYLE_PRESETS = [
  { id: 'cinematic', name: 'Cinematic', swatch: 'from-slate-300 via-slate-500 to-slate-800' },
  { id: 'chrome-noir', name: 'Chrome Noir', swatch: 'from-zinc-100 via-zinc-400 to-zinc-900' },
  { id: 'ethereal', name: 'Ethereal', swatch: 'from-indigo-200 via-sky-300 to-slate-500' },
  { id: 'neo-tokyo', name: 'Neo Tokyo', swatch: 'from-fuchsia-400 via-violet-600 to-slate-900' },
  { id: 'editorial', name: 'Editorial', swatch: 'from-stone-200 via-stone-400 to-stone-700' },
  { id: 'analog', name: 'Analog 35mm', swatch: 'from-amber-200 via-orange-300 to-stone-600' },
  { id: 'biolume', name: 'Biolume', swatch: 'from-teal-300 via-cyan-500 to-slate-900' },
  { id: 'architect', name: 'Architect', swatch: 'from-neutral-300 via-neutral-500 to-neutral-800' },
  { id: 'hyperreal', name: 'Hyperreal', swatch: 'from-gray-100 via-gray-400 to-gray-700' },
  { id: 'watercolor', name: 'Watercolor', swatch: 'from-rose-200 via-indigo-200 to-sky-300' },
]

export const ASPECTS = ['1:1', '4:5', '3:4', '3:2', '16:9', '9:16', '21:9']
export const RESOLUTIONS = [
  { id: '1k', label: '1K', detail: '1024 px' },
  { id: '15k', label: '1.5K', detail: '1536 px' },
  { id: '2k', label: '2K', detail: '2048 px' },
  { id: '4k', label: '4K', detail: '4096 px', pro: true },
]

/* ─── Projects ─── */
export interface Project {
  id: string
  name: string
  cover: string
  items: number
  updated: string
  tags: string[]
  starred: boolean
  archived: boolean
  kind: string
}

export const PROJECTS: Project[] = [
  { id: 'p1', name: 'Obsidian GT Launch', cover: '/media/gen-car.jpg', items: 48, updated: '2026-02-11T09:20:00Z', tags: ['campaign', 'automotive'], starred: true, archived: false, kind: 'Campaign' },
  { id: 'p2', name: 'Argent Couture FW26', cover: '/media/gen-fashion.jpg', items: 132, updated: '2026-02-10T16:44:00Z', tags: ['fashion', 'editorial'], starred: true, archived: false, kind: 'Editorial' },
  { id: 'p3', name: 'Neon District — Film Concept', cover: '/media/gen-city.jpg', items: 86, updated: '2026-02-09T11:05:00Z', tags: ['concept', 'film'], starred: false, archived: false, kind: 'Concept' },
  { id: 'p4', name: 'Monolith Architecture Study', cover: '/media/gen-arch.jpg', items: 24, updated: '2026-02-07T14:30:00Z', tags: ['architecture'], starred: false, archived: false, kind: 'Study' },
  { id: 'p5', name: 'Void Walker Key Art', cover: '/media/gen-astro.jpg', items: 57, updated: '2026-02-05T19:12:00Z', tags: ['key-art', 'sci-fi'], starred: true, archived: false, kind: 'Key Art' },
  { id: 'p6', name: 'Nocturne Tide Titles', cover: '/media/gen-ocean.jpg', items: 19, updated: '2026-01-30T10:00:00Z', tags: ['motion', 'titles'], starred: false, archived: false, kind: 'Motion' },
  { id: 'p7', name: 'Botanica Dark Series', cover: '/media/gen-flower.jpg', items: 41, updated: '2026-01-22T08:40:00Z', tags: ['macro', 'print'], starred: false, archived: true, kind: 'Print' },
  { id: 'p8', name: 'Dune Drift Stills', cover: '/media/gen-desert.jpg', items: 33, updated: '2026-01-18T15:22:00Z', tags: ['landscape'], starred: false, archived: true, kind: 'Stills' },
]

export const FOLDERS = [
  { id: 'f1', name: 'Client Work', count: 4, shared: true },
  { id: 'f2', name: 'Personal Lab', count: 3, shared: false },
  { id: 'f3', name: 'Campaigns 2026', count: 5, shared: true },
  { id: 'f4', name: 'Film & Motion', count: 2, shared: false },
  { id: 'f5', name: 'Print Archive', count: 6, shared: false },
]

export const COLLECTIONS = [
  { id: 'c1', name: 'Silver Studies', covers: ['/media/gen-chrome.jpg', '/media/gen-prism.jpg', '/media/gen-portrait.jpg'], count: 64 },
  { id: 'c2', name: 'Dark Worlds', covers: ['/media/gen-city.jpg', '/media/gen-forest.jpg', '/media/gen-astro.jpg'], count: 112 },
  { id: 'c3', name: 'Product Heroes', covers: ['/media/gen-car.jpg', '/media/product-bg.jpg', '/media/gen-flower.jpg'], count: 38 },
  { id: 'c4', name: 'Horizon Lines', covers: ['/media/gen-desert.jpg', '/media/gen-ocean.jpg', '/media/gen-arch.jpg'], count: 27 },
]

export const ALL_TAGS = ['campaign', 'fashion', 'editorial', 'concept', 'film', 'architecture', 'key-art', 'sci-fi', 'motion', 'macro', 'landscape', 'automotive']

/* ─── Creative Resources ─── */
export interface PromptItem { id: string; title: string; text: string; category: string; tags: string[]; uses: number; fav: boolean }

export const PROMPT_LIBRARY: PromptItem[] = [
  { id: 'pr1', title: 'Liquid Chrome Portrait', text: 'Cinematic portrait of [subject] draped in liquid silver light, futuristic noir, 85mm f/1.4, volumetric haze, chrome reflections', category: 'Portrait', tags: ['chrome', 'noir', 'signature'], uses: 12400, fav: true },
  { id: 'pr2', title: 'Neon Rain Establishing', text: 'Futuristic megacity in the rain at night, neon signage reflecting on wet asphalt, aerial light trails, moody silver-blue cinematic grade, anamorphic', category: 'Environment', tags: ['city', 'night', 'film'], uses: 9800, fav: true },
  { id: 'pr3', title: 'Obsidian Product Hero', text: '[product] on a wet dark reflective stone surface, dramatic cinematic rim lighting, mist, matte black and chrome palette, luxury product photography', category: 'Product', tags: ['luxury', 'studio'], uses: 15200, fav: false },
  { id: 'pr4', title: 'Void Walker Frame', text: 'Figure in a glossy obsidian suit standing in dense fog, dramatic rim light, minimal dark backdrop, cinematic film still, subtle grain', category: 'Character', tags: ['sci-fi', 'fog'], uses: 7600, fav: false },
  { id: 'pr5', title: 'Argent Editorial', text: 'High fashion editorial, sculptural metallic garment, dramatic studio lighting on charcoal backdrop, medium format detail, vogue aesthetic', category: 'Fashion', tags: ['editorial', 'metallic'], uses: 11100, fav: true },
  { id: 'pr6', title: 'Monolith Study', text: 'Brutalist concrete monolith at dusk, single beam of light cutting through fog, minimalist composition, ultra wide, cinematic atmosphere', category: 'Architecture', tags: ['brutalist', 'minimal'], uses: 5400, fav: false },
  { id: 'pr7', title: 'Nocturne Seascape', text: 'Dark ocean wave curling at night, moonlit silver highlights on black water, cinematic spray and foam detail, long exposure feel', category: 'Environment', tags: ['ocean', 'night'], uses: 4300, fav: false },
  { id: 'pr8', title: 'Spectral Macro', text: 'Glass prism refracting a beam of white light into soft spectral colors, floating dust particles, cinematic macro, elegant minimal composition', category: 'Abstract', tags: ['prism', 'light'], uses: 6100, fav: false },
  { id: 'pr9', title: 'Blue Hour Dunes', text: 'Aerial desert dunes at blue hour, rippled sand patterns, lone figure walking, silver-blue moonlight, cinematic minimal composition', category: 'Environment', tags: ['desert', 'aerial'], uses: 3900, fav: false },
]

export const TEMPLATES = [
  { id: 't1', name: 'Cinematic Poster', desc: 'Key art layout with title safe zones', cover: '/media/gen-astro.jpg', category: 'Film', ratio: '2:3' },
  { id: 't2', name: 'Product Hero Banner', desc: 'E-commerce hero with reflection plane', cover: '/media/product-bg.jpg', category: 'Commerce', ratio: '16:9' },
  { id: 't3', name: 'Editorial Spread', desc: 'Fashion lookbook double page', cover: '/media/gen-fashion.jpg', category: 'Print', ratio: '3:2' },
  { id: 't4', name: 'Album Cover', desc: 'Square sleeve with type overlay zone', cover: '/media/gen-prism.jpg', category: 'Music', ratio: '1:1' },
  { id: 't5', name: 'Story Sequence', desc: '9:16 vertical social story set', cover: '/media/gen-portrait.jpg', category: 'Social', ratio: '9:16' },
  { id: 't6', name: 'Architectural Board', desc: 'Presentation board with elevations', cover: '/media/gen-arch.jpg', category: 'ArchViz', ratio: '16:9' },
]

export const CREATIVE_PRESETS = [
  { id: 'cp1', name: 'Signature Chrome', desc: 'The Myxelez house look — liquid silver, deep blacks', params: 'Photon v2 · CFG 7.5 · 32 steps · Chrome Noir', uses: 8200 },
  { id: 'cp2', name: 'Film Still 2.39', desc: 'Anamorphic widescreen cinema frame', params: 'Photon v2 · CFG 6 · 28 steps · Cinematic', uses: 6700 },
  { id: 'cp3', name: 'Studio Product', desc: 'Clean reflective product photography', params: 'Canvas HD · CFG 8 · 40 steps · Product', uses: 5400 },
  { id: 'cp4', name: 'Fog & Rim', desc: 'Atmospheric character lighting setup', params: 'Flux XL · CFG 7 · 36 steps · Neo Noir', uses: 4100 },
  { id: 'cp5', name: 'Editorial Flash', desc: 'Hard light fashion editorial', params: 'Photon v2 · CFG 5.5 · 24 steps · Editorial', uses: 3800 },
  { id: 'cp6', name: 'Monochrome Macro', desc: 'Dark luxury macro detail', params: 'Canvas HD · CFG 9 · 44 steps · Macro', uses: 2900 },
]

export const BRAND_COLORS = [
  { name: 'Void', hex:'#060608' },
  { name: 'Obsidian', hex:'#0B0B0F' },
  { name: 'Graphite', hex:'#14141B' },
  { name: 'Ash', hex:'#62646E' },
  { name: 'Smoke', hex:'#A3A5B0' },
  { name: 'Silver', hex:'#D8DAE2' },
  { name: 'Chrome', hex:'#F2F3F7' },
  { name: 'Frost', hex:'#C6CEFF' },
]

export const ASSETS = [
  { id: 'a1', name: 'hero-keyart-final.png', type: 'Image', size: '18.2 MB', src: '/media/gen-astro.jpg', updated: '2h ago' },
  { id: 'a2', name: 'gt-obsidian-16x9.png', type: 'Image', size: '11.4 MB', src: '/media/gen-car.jpg', updated: '5h ago' },
  { id: 'a3', name: 'hero-loop.mp4', type: 'Video', size: '24.8 MB', src: '/media/hero-loop.mp4', updated: '1d ago' },
  { id: 'a4', name: 'orchid-spectre.tif', type: 'Image', size: '42.1 MB', src: '/media/gen-flower.jpg', updated: '1d ago' },
  { id: 'a5', name: 'brand-guidelines.pdf', type: 'Document', size: '6.3 MB', src: '', updated: '3d ago' },
  { id: 'a6', name: 'myxelez-wordmark.svg', type: 'Vector', size: '84 KB', src: '/uploads/logo.png', updated: '4d ago' },
  { id: 'a7', name: 'neon-district-plate.png', type: 'Image', size: '15.7 MB', src: '/media/gen-city.jpg', updated: '5d ago' },
  { id: 'a8', name: 'campaign-typekit.zip', type: 'Archive', size: '3.1 MB', src: '', updated: '1w ago' },
]

export const MOODBOARDS = [
  { id: 'm1', name: 'Liquid Argentum', images: ['/media/gen-chrome.jpg', '/media/gen-prism.jpg', '/media/gen-portrait.jpg', '/media/gen-flower.jpg', '/media/gen-fashion.jpg'], count: 24 },
  { id: 'm2', name: 'After Midnight', images: ['/media/gen-city.jpg', '/media/gen-forest.jpg', '/media/gen-ocean.jpg', '/media/gen-astro.jpg'], count: 31 },
  { id: 'm3', name: 'Silent Forms', images: ['/media/gen-arch.jpg', '/media/gen-desert.jpg', '/media/gen-car.jpg', '/media/product-bg.jpg'], count: 18 },
]

export const WORKFLOWS = [
  { id: 'w1', name: 'Key Art Pipeline', steps: ['Image Gen', 'Face Swap', 'Upscale 4K'], runs: 34, updated: '2d ago' },
  { id: 'w2', name: 'Product Packshot', steps: ['Image Gen', 'BG Remove', 'Upscale 2K'], runs: 58, updated: '5h ago' },
  { id: 'w3', name: 'Social Teaser', steps: ['Image Gen', 'Video Gen', 'Batch ×6'], runs: 12, updated: '1d ago' },
  { id: 'w4', name: 'Editorial Retouch', steps: ['Image Edit', 'Face Swap', 'Upscale 2K'], runs: 21, updated: '3d ago' },
]

/* ─── Notifications & Activity ─── */
export const NOTIFICATIONS = [
  { id: 'n1', title: 'Batch render complete', desc: '4 variations of “Chrome Reverie” are ready to review.', time: '4m ago', unread: true, kind: 'render' },
  { id: 'n2', title: 'Motion v1.2 is live', desc: 'Video generation now supports 8s clips at 1080p.', time: '1h ago', unread: true, kind: 'system' },
  { id: 'n3', title: 'Credits replenished', desc: '2,000 monthly credits added to your balance.', time: '3h ago', unread: true, kind: 'billing' },
  { id: 'n4', title: 'Mara invited you', desc: 'Collaborate on “Argent Couture FW26”.', time: '1d ago', unread: false, kind: 'team' },
  { id: 'n5', title: 'Weekly digest', desc: 'You created 86 generations this week — top 4% of creators.', time: '2d ago', unread: false, kind: 'system' },
]

export const ACTIVITY = [
  { id: 'ac1', action: 'Generated batch ×4', target: 'Chrome Reverie', time: '12m ago', kind: 'image' },
  { id: 'ac2', action: 'Upscaled to 4K', target: 'GT Obsidian', time: '40m ago', kind: 'upscale' },
  { id: 'ac3', action: 'Removed background', target: 'packshot-noir.png', time: '1h ago', kind: 'edit' },
  { id: 'ac4', action: 'Created project', target: 'Neon District — Film Concept', time: '3h ago', kind: 'project' },
  { id: 'ac5', action: 'Saved prompt', target: 'Liquid Chrome Portrait', time: '5h ago', kind: 'resource' },
  { id: 'ac6', action: 'Rendered video', target: 'Nocturne Tide Titles', time: '1d ago', kind: 'video' },
  { id: 'ac7', action: 'Starred collection', target: 'Silver Studies', time: '1d ago', kind: 'resource' },
]

export const USAGE_WEEK = [34, 52, 44, 71, 63, 86, 58]
export const USAGE_DAYS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

/* ─── Landing content ─── */
export const PLANS = [
  {
    id: 'starter', name: 'Starter', monthly: 0, yearly: 0, tagline: 'Begin creating',
    features: ['100 credits / month', 'MYX Photon Turbo', '1K resolution', 'Community gallery', 'Personal projects'],
    cta: 'Start free', featured: false,
  },
  {
    id: 'pro', name: 'Pro', monthly: 24, yearly: 19, tagline: 'For serious creators',
    features: ['4,000 credits / month', 'All engines incl. Motion v1', 'Up to 4K + upscale', 'Face Swap & BG Removal', 'Creative Resources suite', 'Commercial license', 'Priority queue'],
    cta: 'Go Pro', featured: true,
  },
  {
    id: 'studio', name: 'Studio', monthly: 79, yearly: 63, tagline: 'For teams & pipelines',
    features: ['20,000 credits / month', 'Everything in Pro', '5 team seats', 'API access & webhooks', 'Brand Kit + presets', 'Workflow automation', 'Dedicated support'],
    cta: 'Contact sales', featured: false,
  },
]

export const TESTIMONIALS = [
  { name: 'Mara Voss', role: 'Creative Director, NOIR Atelier', quote: 'Myxelez replaced three tools in our pipeline. The chrome-noir presets are the closest thing to a house style AI has ever given us.', avatar: '/media/avatar-1.jpg' },
  { name: 'Dario Lenz', role: 'Filmmaker & Title Designer', quote: 'Motion v1 understands cinematography. The fog, the rim light — it frames shots like a director, not a slot machine.', avatar: '/media/avatar-2.jpg' },
  { name: 'Sena Kaito', role: 'Digital Artist', quote: 'The prompt library alone is worth it. I publish my presets and the community remixes them into things I never imagined.', avatar: '/media/avatar-3.jpg' },
  { name: 'Henrik Aalde', role: 'Architect, Studio Meridian', quote: 'Concept boards that used to take a week now take an afternoon. Clients think we hired a render farm.', avatar: '/media/avatar-4.jpg' },
  { name: 'Lúcia Ferraz', role: 'Brand Designer', quote: 'Brand Kit + batch generate is a superpower. Every asset ships on-palette, on-style, on-time.', avatar: '/media/avatar-5.jpg' },
  { name: 'Jin Park', role: 'Founder, Hexworks Games', quote: 'We prototyped our entire key-art direction in Myxelez before committing a dollar to production. It paid for itself in a day.', avatar: '/media/avatar-6.jpg' },
]

export const FAQS = [
  { q: 'What is Myxelez Studio?', a: 'Myxelez Studio is a cinematic AI creative platform that unifies image generation, video synthesis, face swap, editing, upscaling and background removal in one premium workspace — powered by our proprietary MYX engine family.' },
  { q: 'How do credits work?', a: 'Credits are consumed per generation based on engine, resolution and batch size. A 1K image costs 1 credit, 4K costs 4, and video is billed per second. Unused subscription credits roll over for 30 days.' },
  { q: 'Do I own what I create?', a: 'Yes. On paid plans you receive a full commercial license to everything you generate, inclu
