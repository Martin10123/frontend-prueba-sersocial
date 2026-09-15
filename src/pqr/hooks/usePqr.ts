import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import {
  addSeguimiento,
  buscarPorRadicado,
  createPqr,
  getPqr,
  getStats,
  listPqr,
  updatePqrEstado,
} from "@/pqr/api/pqr.api"
import type { CreatePqrPayload, PqrFilters } from "@/pqr/types"

export function usePqrList(filters: PqrFilters) {
  return useQuery({
    queryKey: ["pqr", "list", filters],
    queryFn: () => listPqr(filters),
    placeholderData: keepPreviousData,
  })
}

export function usePqrDetail(id: number) {
  return useQuery({
    queryKey: ["pqr", "detail", id],
    queryFn: () => getPqr(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useCreatePqr() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: CreatePqrPayload) => createPqr(payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pqr"] })
    },
  })
}

export function useUpdatePqrEstado(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { estado?: string; prioridad?: string }) =>
      updatePqrEstado(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pqr"] })
    },
  })
}

export function useAddSeguimiento(id: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (payload: { descripcion: string }) => addSeguimiento(id, payload),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["pqr", "detail", id] })
    },
  })
}

export function useBuscarRadicado(radicado: string, enabled: boolean) {
  return useQuery({
    queryKey: ["pqr", "buscar", radicado],
    queryFn: () => buscarPorRadicado(radicado),
    enabled,
    retry: false,
  })
}

export function useStats(enabled = true) {
  return useQuery({
    queryKey: ["stats"],
    queryFn: getStats,
    enabled,
  })
}
