import { AudioLines, Box, Clapperboard, Eraser, Expand, Image as ImageIcon, PenTool, ScanFace, type LucideIcon } from 'lucide-react'
import { GALLERY } from '../../lib/data'
import { seededShuffle, uid } from '../../lib/utils'

export type ToolId = 'image' | 'video' | 'faceswap' | 'edit' | 'upscale' | 'bgremove' | 'audio' | 'threed'

export interface Tool {
  id: ToolId
  name: string
  icon: LucideIcon
  desc: string
  soon?: boolean
}

export const TOOLS: Tool[] = [
  { id: 'image', name: 'Image', icon: ImageIcon, desc: 'Text-to-image generation' },
  { id: 'video', name: 'Video', icon: Clapperboard, desc: 'Cinematic motion synthesis' },
  { id: 'faceswap', name: 'Face Swap', icon: ScanFace, desc: 'Identity-preserving swap' },
  { id: 'edit', name: 'Edit', icon: PenTool, desc: 'Inpaint, outpaint, relight' },
  { id: 'upscale', name: 'Upscale', icon: Expand, desc: 'Detail reconstruction to 4K' },
  { id: 'bgremove', name: 'BG Remove', icon: Eraser, desc: 'Pixel-clean cutouts' },
  { id: 'audio', name: 'Audio', icon: AudioLines, desc: 'Score, voice & sound', soon: true },
  { id: 'threed', name: '3D', icon: Box, desc: 'Text-to-mesh assets', soon: true },
]

export interface GenParams {
  prompt: string
  negative: string
  model: string
  aspect: string
  resolution: string
  style: string
  seed: number
  cfg: number
  steps: number
  batch: number
  duration: number
  strength: number
  factor: string
}

export const DEFAULT_PARAMS: GenParams = {
  prompt: '',
  negative: '',
  model: 'photon-v2',
  aspect: '3:4',
  resolution: '2k',
  style: 'chrome-noir',
  seed: 84120031,
  cfg: 7.5,
  steps: 32,
  batch: 4,
  duration: 6,
  strength: 80,
  factor: '4x',
}

export interface ResultItem {
  id: string
  kind: 'image' | 'video'
  src: string
  poster?: string
  label: string
  meta: string
  seed: number
  tool: ToolId
  checker?: boolean
}

export function buildResults(tool: ToolId, params: GenParams, target?: string | null): ResultItem[] {
  const pool = seededShuffle(GALLERY, params.seed + Math.floor(Math.random() * 9999))
  const metaBase = `${params.aspect} · ${params.style.replace('-', ' ')}`
  if (tool === 'video') {
    return Array.from({ length: params.batch }, (_, i) => ({
      id: uid(),
      kind: 'video' as const,
      src: '/media/hero-loop.mp4',
      poster: pool[i % pool.length].src,
      label: `Motion take ${i + 1}`,
      meta: `${params.duration}s · 24fps · 1080p`,
      seed: params.seed + i,
      tool,
    }))
  }
  if (tool === 'bgremove') {
    return [{
      id: uid(), kind: 'image', src: '/media/product-cut.png', label: 'Cutout — alpha channel',
      meta: 'edge refine · feather 2px', seed: params.seed, tool, checker: true,
    }]
  }
  if (tool === 'faceswap') {
    return [{
      id: uid(), kind: 'image', src: target ?? pool[0].src, label: 'Face swap — identity locked',
      meta: `blend ${params.strength}% · landmarks 98.7%`, seed: params.seed, tool,
    }]
  }
  if (tool === 'upscale') {
    return [{
      id: uid(), kind: 'image', src: target ?? pool[0].src, label: `Upscaled ${params.factor}`,
      meta: `${params.factor === '4x' ? '4096px' : '2048px'} · detail ${params.strength}%`, seed: params.seed, tool,
    }]
  }
  if (tool === 'edit') {
    return [{
      id: uid(), kind: 'image', src: pool[1]?.src ?? pool[0].src, label: 'Edit — variation',
      meta: `strength ${params.strength}% · ${metaBase}`, seed: params.seed, tool,
    }]
  }
  return pool.slice(0, params.batch).map((g, i) => ({
    id: uid(), kind: 'image' as const, src: g.src, label: g.title,
    meta: metaBase, seed: params.seed + i, tool,
  }))
}

export function creditCost(tool: ToolId, params: GenParams): number {
  const resFactor: Record<string, number> = { '1k': 1, '15k': 2, '2k': 3, '4k': 4 }
  switch (tool) {
    case 'video': return params.duration * 8 * params.batch
    case 'faceswap': return 4
    case 'upscale': return params.factor === '4x' ? 6 : 3
    case 'bgremove': return 2
    case 'edit': return 3
    default: return (resFactor[params.resolution] ?? 1) * params.batch
  }
}
