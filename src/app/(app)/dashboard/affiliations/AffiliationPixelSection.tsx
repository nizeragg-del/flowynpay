'use client'

import { useState, useTransition } from 'react'
import { ScanLine, Plus, X, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { addAffiliationPixel, removeAffiliationPixel } from '../pixels/actions'

const PLATFORM_BADGES: Record<string, { label: string; icon: string; color: string }> = {
  meta:   { label: 'Meta Ads',   icon: '/meta.png',   color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
  google: { label: 'Google Ads', icon: '/google.png', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
  tiktok: { label: 'TikTok',     icon: '/tiktok.png', color: 'bg-white/5 border-white/10 text-white/60' },
}

interface Pixel       { id: string; name: string; platform: string; pixel_id: string }
interface Plan        { id: string; name: string }
interface AffPixelRow { id: string; pixel: Pixel; plan_id?: string | null }

interface Props {
  affiliationId: string
  affPixels: AffPixelRow[]
  availablePixels: Pixel[]
  plans: Plan[]
}

export function AffiliationPixelSection({ affiliationId, affPixels, availablePixels, plans }: Props) {
  const [open, setOpen]             = useState(false)
  const [step, setStep]             = useState<'idle' | 'pick-pixel' | 'pick-plan'>('idle')
  const [selectedPixelId, setSelectedPixelId] = useState('')
  const [isPending, startTransition] = useTransition()

  // Pixels already linked (can have multiple entries for same pixel if scoped to different plans)
  const unlinked = availablePixels.filter(p => !affPixels.some(ap => ap.pixel.id === p.id))

  function handlePixelChosen(pixelId: string) {
    setSelectedPixelId(pixelId)
    if (plans.length > 1) {
      setStep('pick-plan')
    } else {
      // Only one plan — add directly scoped to it (or null if no plans)
      doAdd(pixelId, plans[0]?.id ?? null)
    }
  }

  function doAdd(pixelId: string, planId: string | null) {
    startTransition(async () => {
      await addAffiliationPixel(affiliationId, pixelId, planId)
      setStep('idle')
      setSelectedPixelId('')
    })
  }

  function handleRemove(affPixelId: string) {
    startTransition(() => removeAffiliationPixel(affPixelId))
  }

  function getPlanName(planId?: string | null) {
    if (!planId) return 'Todos os planos'
    return plans.find(p => p.id === planId)?.name ?? 'Plano desconhecido'
  }

  return (
    <div className="border-t border-white/5">
      {/* Toggle header */}
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-3.5 text-xs text-white/40 hover:text-white/60 transition-colors"
      >
        <span className="flex items-center gap-2">
          <ScanLine className="w-3.5 h-3.5" />
          <span className="font-semibold uppercase tracking-wider">Meus pixels de rastreamento</span>
          {affPixels.length > 0 && (
            <span className="bg-[#00e88a]/20 text-[#00e88a] text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {affPixels.length}
            </span>
          )}
        </span>
        {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {open && (
        <div className="px-6 pb-5 space-y-3">
          {/* Info note */}
          <p className="text-xs text-white/30 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5 leading-relaxed">
            📡 Seus pixels são disparados quando um comprador acessa o checkout pelo <strong className="text-white/50">seu link</strong>.
            Você pode limitar cada pixel a um plano específico ou aplicar a todos.
          </p>

          {/* Linked pixels list */}
          {affPixels.length === 0 ? (
            <p className="text-xs text-white/25 italic">Nenhum pixel vinculado a esta afiliação.</p>
          ) : (
            <div className="space-y-2">
              {affPixels.map(ap => {
                const badge = PLATFORM_BADGES[ap.pixel.platform] ?? PLATFORM_BADGES.meta
                return (
                  <div key={ap.id} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-2.5">
                    <div className="flex items-center gap-3 min-w-0 flex-wrap">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[10px] font-bold flex-shrink-0 ${badge.color}`}>
                        <img src={badge.icon} alt={badge.label} className="w-3.5 h-3.5 object-contain" />
                        {badge.label}
                      </span>
                      <span className="text-sm text-white font-medium truncate">{ap.pixel.name}</span>
                      <span className="text-xs text-white/30 font-mono hidden md:block">{ap.pixel.pixel_id}</span>
                      {/* Plan scope badge */}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex-shrink-0 ${
                        ap.plan_id
                          ? 'bg-violet-500/10 border-violet-500/20 text-violet-400'
                          : 'bg-white/5 border-white/10 text-white/30'
                      }`}>
                        {getPlanName(ap.plan_id)}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(ap.id)}
                      disabled={isPending}
                      className="ml-2 p-1.5 text-white/20 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}

          {/* ── Step: idle → show "Adicionar pixel" button ── */}
          {step === 'idle' && (
            <button
              onClick={() => setStep('pick-pixel')}
              disabled={unlinked.length === 0}
              className="flex items-center gap-1.5 text-xs text-[#00e88a] hover:text-[#00e88a]/80 font-semibold transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Plus className="w-3.5 h-3.5" />
              {unlinked.length === 0
                ? 'Nenhum pixel disponível — cadastre em Configurações › Pixels'
                : 'Adicionar pixel'}
            </button>
          )}

          {/* ── Step 1: pick pixel ── */}
          {step === 'pick-pixel' && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">1. Selecione o pixel</p>
              <div className="flex items-center gap-2">
                <select
                  onChange={e => { if (e.target.value) handlePixelChosen(e.target.value) }}
                  defaultValue=""
                  className="flex-1 bg-[#0a0a0a] border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:border-[#00e88a]/50 outline-none"
                >
                  <option value="" disabled>Selecionar pixel...</option>
                  {unlinked.map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} ({p.platform.toUpperCase()})
                    </option>
                  ))}
                </select>
                {isPending && <Loader2 className="w-4 h-4 text-white/40 animate-spin flex-shrink-0" />}
                <button onClick={() => setStep('idle')} className="text-white/30 hover:text-white transition-colors flex-shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* ── Step 2: pick plan (only shown when >1 plan) ── */}
          {step === 'pick-plan' && (
            <div className="space-y-2">
              <p className="text-[11px] font-bold text-white/40 uppercase tracking-wider">2. Em qual plano aplicar?</p>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => doAdd(selectedPixelId, null)}
                  disabled={isPending}
                  className="text-xs px-3 py-2 rounded-xl border bg-white/5 border-white/10 text-white/70 hover:bg-[#00e88a]/10 hover:border-[#00e88a]/30 hover:text-[#00e88a] transition-all font-semibold disabled:opacity-50"
                >
                  🌐 Todos os planos
                </button>
                {plans.map(pl => (
                  <button
                    key={pl.id}
                    onClick={() => doAdd(selectedPixelId, pl.id)}
                    disabled={isPending}
                    className="text-xs px-3 py-2 rounded-xl border bg-violet-500/10 border-violet-500/20 text-violet-300 hover:bg-violet-500/20 transition-all font-semibold disabled:opacity-50"
                  >
                    {pl.name}
                  </button>
                ))}
                <button
                  onClick={() => setStep('pick-pixel')}
                  className="text-xs text-white/30 hover:text-white/60 transition-colors px-2"
                >
                  ← Voltar
                </button>
              </div>
              {isPending && (
                <div className="flex items-center gap-2 text-xs text-white/40">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Salvando...
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
