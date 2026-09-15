import { http } from "@/shared/api/http"
import type {
  CreatePqrPayload,
  PqrDetail,
  PqrFilters,
  PqrListItem,
  Seguimiento,
  StatsSummary,
} from "@/pqr/types"

export async function listPqr(filters: PqrFilters = {}): Promise<PqrListItem[]> {
  const { data } = await http.get<PqrListItem[]>("/pqr/", { params: filters })
  return data
}

export async function getPqr(id: number): Promise<PqrDetail> {
  const { data } = await http.get<PqrDetail>(`/pqr/${id}/`)
  return data
}

export async function createPqr(payload: CreatePqrPayload): Promise<PqrDetail> {
  const { data } = await http.post<PqrDetail>("/pqr/", payload)
  return data
}

export async function updatePqrEstado(
  id: number,
  payload: { estado?: string; prioridad?: string },
): Promise<PqrDetail> {
  const { data } = await http.patch<PqrDetail>(`/pqr/${id}/estado/`, payload)
  return data
}

export async function listSeguimiento(id: number): Promise<Seguimiento[]> {
  const { data } = await http.get<Seguimiento[]>(`/pqr/${id}/seguimiento/`)
  return data
}

export async function addSeguimiento(
  id: number,
  payload: { descripcion: string; tipo_accion?: string },
): Promise<Seguimiento> {
  const { data } = await http.post<Seguimiento>(`/pqr/${id}/seguimiento/`, payload)
  return data
}

export async function buscarPorRadicado(radicado: string): Promise<PqrDetail> {
  const { data } = await http.get<PqrDetail>("/pqr/buscar/", {
    params: { radicado },
  })
  return data
}

export async function getStats(): Promise<StatsSummary> {
  const { data } = await http.get<StatsSummary>("/stats/")
  return data
}
