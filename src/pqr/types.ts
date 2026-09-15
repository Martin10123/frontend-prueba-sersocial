import type {
  CanalPQR,
  EstadoPQR,
  PrioridadPQR,
  TipoPQR,
} from "@/shared/constants/pqr"

export type Solicitante = {
  id: number
  nombre: string
  apellido: string
  identificacion: string
  email: string
  telefono: string
  created_at: string
}

export type Seguimiento = {
  id: number
  descripcion: string
  tipo_accion: string
  fecha_registro: string
  usuario_id: number | null
  usuario_nombre: string | null
}

export type PqrListItem = {
  id: number
  radicado: string
  tipo: TipoPQR
  titulo: string
  categoria: string
  prioridad: PrioridadPQR
  estado: EstadoPQR
  canal: CanalPQR
  solicitante_id: number
  solicitante_nombre: string
  created_at: string
  updated_at: string
}

export type PqrDetail = {
  id: number
  radicado: string
  tipo: TipoPQR
  titulo: string
  descripcion: string
  categoria: string
  prioridad: PrioridadPQR
  estado: EstadoPQR
  canal: CanalPQR
  solicitante: Solicitante
  seguimientos: Seguimiento[]
  created_at: string
  updated_at: string
}

export type PqrFilters = {
  tipo?: string
  estado?: string
  prioridad?: string
  categoria?: string
}

export type CreatePqrPayload = {
  tipo: TipoPQR
  titulo: string
  descripcion: string
  categoria: string
  prioridad: PrioridadPQR
  canal: CanalPQR
  solicitante: {
    nombre: string
    apellido: string
    identificacion: string
    email: string
    telefono?: string
  }
}

export type StatsSummary = {
  total: number
  por_estado: Array<{ estado: string; total: number }>
  por_tipo: Array<{ tipo: string; total: number }>
}
