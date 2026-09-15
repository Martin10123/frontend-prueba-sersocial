import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Plus } from "lucide-react"
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

export function PqrListPage() {
  const navigate = useNavigate()
  const [filters, setFilters] = useState<Filters>({})
  const [radicado, setRadicado] = useState("")
  const [searching, setSearching] = useState(false)
  const debouncedCategoria = useDebouncedValue(filters.categoria ?? "", 400)
  const query = usePqrList({
    ...filters,
    categoria: debouncedCategoria || undefined,
  })

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
        onFiltersChange={setFilters}
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
        <PqrTable items={query.data ?? []} />
      )}
    </div>
  )
}
