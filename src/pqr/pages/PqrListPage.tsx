import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { toast } from "sonner"
import { PqrFilters } from "@/pqr/components/PqrFilters"
import { PqrTable } from "@/pqr/components/PqrTable"
import { usePqrList } from "@/pqr/hooks/usePqr"
import { buscarPorRadicado } from "@/pqr/api/pqr.api"
import type { PqrFilters as Filters } from "@/pqr/types"
import { PageHeader } from "@/shared/components/PageHeader"
import { LoadingState } from "@/shared/components/LoadingState"
import { QueryError } from "@/shared/components/QueryError"
import { getErrorMessage } from "@/shared/api/types"
import { useDebouncedValue } from "@/shared/hooks/useDebouncedValue"
import { Button } from "@/shared/ui/button"

const PAGE_SIZE = 20

export function PqrListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>({})
  const [page, setPage] = useState(1)
  const [radicado, setRadicado] = useState("")
  const [searching, setSearching] = useState(false)
  const debouncedCategoria = useDebouncedValue(filters.categoria ?? "", 400)
  const query = usePqrList({
    ...filters,
    categoria: debouncedCategoria || undefined,
    page,
    page_size: PAGE_SIZE,
  })

  const count = query.data?.count ?? 0
  const items = query.data?.results ?? []
  const totalPages = Math.max(1, Math.ceil(count / PAGE_SIZE))
  const from = count === 0 ? 0 : (page - 1) * PAGE_SIZE + 1
  const to = Math.min(page * PAGE_SIZE, count)

  function onFiltersChange(next: Filters) {
    setFilters(next)
    setPage(1)
  }

  async function onSearchRadicado() {
    if (!radicado.trim()) {
      toast.error("Ingresa un radicado")
      return
    }
    if (searching) return
    setSearching(true)
    try {
      const pqr = await buscarPorRadicado(radicado.trim())
      navigate(`/pqr/${pqr.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error, "Radicado no encontrado"))
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        title="Gestión de PQR"
        description="Filtra, busca por radicado y da seguimiento a cada caso."
        actions={
          <Link
            to="/pqr/nueva"
            className="inline-flex h-10 items-center gap-1.5 rounded-full bg-gradient-to-r from-teal-600 to-cyan-600 px-4 text-sm font-semibold text-white shadow-md shadow-teal-600/25 transition hover:scale-[1.02] hover:shadow-lg"
          >
            <Plus className="size-4" />
            Nueva PQR
          </Link>
        }
      />

      <PqrFilters
        filters={filters}
        radicado={radicado}
        searching={searching}
        onFiltersChange={onFiltersChange}
        onRadicadoChange={setRadicado}
        onSearchRadicado={() => void onSearchRadicado()}
      />

      {query.isLoading && !query.data ? (
        <LoadingState />
      ) : query.isError ? (
        <QueryError
          message={getErrorMessage(query.error, "No se pudo cargar el listado")}
          onRetry={() => void query.refetch()}
        />
      ) : (
        <>
          <PqrTable items={items} />
          {count > 0 ? (
            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-slate-600">
                Mostrando {from}–{to} de {count}
              </p>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || query.isFetching}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  <ChevronLeft className="size-4" />
                  Anterior
                </Button>
                <span className="min-w-16 text-center text-sm text-slate-600">
                  {page} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages || query.isFetching}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Siguiente
                  <ChevronRight className="size-4" />
                </Button>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}
