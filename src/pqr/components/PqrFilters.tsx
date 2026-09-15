import {
  ESTADOS_PQR,
  PRIORIDADES_PQR,
  TIPOS_PQR,
} from "@/shared/constants/pqr"
import type { PqrFilters } from "@/pqr/types"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Select } from "@/shared/ui/select"
import { Button } from "@/shared/ui/button"
import { Search } from "lucide-react"

type Props = {
  filters: PqrFilters
  radicado: string
  searching?: boolean
  onFiltersChange: (next: PqrFilters) => void
  onRadicadoChange: (value: string) => void
  onSearchRadicado: () => void
}

const ALL = "__all__"

export function PqrFilters({
  filters,
  radicado,
  searching = false,
  onFiltersChange,
  onRadicadoChange,
  onSearchRadicado,
}: Props) {
  return (
    <div className="mb-5 grid gap-3 rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-sm shadow-teal-900/5 sm:grid-cols-2 lg:grid-cols-5">
      <div>
        <Label htmlFor="filter-tipo">Tipo</Label>
        <Select
          id="filter-tipo"
          value={filters.tipo ?? ALL}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              tipo: value === ALL ? undefined : value,
            })
          }
          options={[
            { value: ALL, label: "Todos" },
            ...TIPOS_PQR.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </div>
      <div>
        <Label htmlFor="filter-estado">Estado</Label>
        <Select
          id="filter-estado"
          value={filters.estado ?? ALL}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              estado: value === ALL ? undefined : value,
            })
          }
          options={[
            { value: ALL, label: "Todos" },
            ...ESTADOS_PQR.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </div>
      <div>
        <Label htmlFor="filter-prioridad">Prioridad</Label>
        <Select
          id="filter-prioridad"
          value={filters.prioridad ?? ALL}
          onValueChange={(value) =>
            onFiltersChange({
              ...filters,
              prioridad: value === ALL ? undefined : value,
            })
          }
          options={[
            { value: ALL, label: "Todas" },
            ...PRIORIDADES_PQR.map((o) => ({ value: o.value, label: o.label })),
          ]}
        />
      </div>
      <div>
        <Label htmlFor="filter-categoria">Categoría</Label>
        <Input
          id="filter-categoria"
          value={filters.categoria ?? ""}
          placeholder="Ej. Documentos"
          onChange={(e) =>
            onFiltersChange({
              ...filters,
              categoria: e.target.value || undefined,
            })
          }
        />
      </div>
      <div>
        <Label htmlFor="filter-radicado">Radicado</Label>
        <div className="flex gap-2">
          <Input
            id="filter-radicado"
            value={radicado}
            placeholder="PQR-..."
            onChange={(e) => onRadicadoChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") onSearchRadicado()
            }}
          />
          <Button
            type="button"
            aria-label="Buscar radicado"
            disabled={searching}
            className="bg-teal-700 text-white hover:bg-teal-800"
            onClick={onSearchRadicado}
          >
            <Search className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
