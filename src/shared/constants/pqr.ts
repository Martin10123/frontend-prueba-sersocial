export const TIPOS_PQR = [
  { value: "peticion", label: "Petición" },
  { value: "queja", label: "Queja" },
  { value: "reclamo", label: "Reclamo" },
] as const

export const ESTADOS_PQR = [
  { value: "recibida", label: "Recibida" },
  { value: "en_gestion", label: "En gestión" },
  { value: "resuelta", label: "Resuelta" },
  { value: "cerrada", label: "Cerrada" },
] as const

export const PRIORIDADES_PQR = [
  { value: "baja", label: "Baja" },
  { value: "media", label: "Media" },
  { value: "alta", label: "Alta" },
  { value: "urgente", label: "Urgente" },
] as const

export const CANALES_PQR = [
  { value: "web", label: "Web" },
  { value: "email", label: "Email" },
  { value: "presencial", label: "Presencial" },
] as const

export type TipoPQR = (typeof TIPOS_PQR)[number]["value"]
export type EstadoPQR = (typeof ESTADOS_PQR)[number]["value"]
export type PrioridadPQR = (typeof PRIORIDADES_PQR)[number]["value"]
export type CanalPQR = (typeof CANALES_PQR)[number]["value"]

export function labelOf<T extends { value: string; label: string }>(
  options: readonly T[],
  value: string,
): string {
  return options.find((o) => o.value === value)?.label ?? value
}
