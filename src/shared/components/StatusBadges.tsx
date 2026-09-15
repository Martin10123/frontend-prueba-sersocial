import { cn } from "@/shared/lib/utils"
import {
  ESTADOS_PQR,
  PRIORIDADES_PQR,
  TIPOS_PQR,
  labelOf,
} from "@/shared/constants/pqr"

const estadoClass: Record<string, string> = {
  recibida: "bg-sky-100 text-sky-800 ring-sky-200",
  en_gestion: "bg-amber-100 text-amber-900 ring-amber-200",
  resuelta: "bg-emerald-100 text-emerald-800 ring-emerald-200",
  cerrada: "bg-slate-200 text-slate-700 ring-slate-300",
}

const prioridadClass: Record<string, string> = {
  baja: "bg-slate-100 text-slate-700 ring-slate-200",
  media: "bg-cyan-100 text-cyan-800 ring-cyan-200",
  alta: "bg-orange-100 text-orange-800 ring-orange-200",
  urgente: "bg-rose-100 text-rose-800 ring-rose-200",
}

const tipoClass: Record<string, string> = {
  peticion: "bg-teal-100 text-teal-800 ring-teal-200",
  queja: "bg-violet-100 text-violet-800 ring-violet-200",
  reclamo: "bg-fuchsia-100 text-fuchsia-800 ring-fuchsia-200",
}

export function EstadoBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset transition-transform hover:scale-105",
        estadoClass[value] ?? "bg-muted text-foreground",
      )}
    >
      {labelOf(ESTADOS_PQR, value)}
    </span>
  )
}

export function PrioridadBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        prioridadClass[value] ?? "bg-muted text-foreground",
      )}
    >
      {labelOf(PRIORIDADES_PQR, value)}
    </span>
  )
}

export function TipoBadge({ value }: { value: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset",
        tipoClass[value] ?? "bg-muted text-foreground",
      )}
    >
      {labelOf(TIPOS_PQR, value)}
    </span>
  )
}
