import { Link } from "react-router-dom"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { ChevronRight } from "lucide-react"
import type { PqrListItem } from "@/pqr/types"
import {
  EstadoBadge,
  PrioridadBadge,
  TipoBadge,
} from "@/shared/components/StatusBadges"
import { EmptyState } from "@/shared/components/EmptyState"

export function PqrTable({ items }: { items: PqrListItem[] }) {
  if (items.length === 0) {
    return (
      <EmptyState
        title="No hay PQR"
        description="Ajusta los filtros o registra una nueva solicitud."
      />
    )
  }

  return (
    <>
      <div className="space-y-3 md:hidden">
        {items.map((item) => (
          <Link
            key={item.id}
            to={`/pqr/${item.id}`}
            className="block rounded-2xl border border-teal-100 bg-white p-4 shadow-sm shadow-teal-900/5 transition hover:-translate-y-0.5 hover:border-teal-300 hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-teal-800">{item.radicado}</p>
                <p className="mt-1 text-sm text-slate-700">{item.titulo}</p>
              </div>
              <ChevronRight className="mt-1 size-4 text-teal-600" />
            </div>
            <div className="mt-3 flex flex-wrap gap-1.5">
              <TipoBadge value={item.tipo} />
              <EstadoBadge value={item.estado} />
              <PrioridadBadge value={item.prioridad} />
            </div>
          </Link>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm shadow-teal-900/5 md:block">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-gradient-to-r from-teal-700 to-cyan-700 text-teal-50">
            <tr>
              <th className="px-4 py-3 font-medium">Radicado</th>
              <th className="px-4 py-3 font-medium">Título</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium">Prioridad</th>
              <th className="px-4 py-3 font-medium">Fecha</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                className="border-b border-teal-50 transition hover:bg-teal-50/70"
              >
                <td className="px-4 py-3">
                  <Link
                    to={`/pqr/${item.id}`}
                    className="font-semibold text-teal-700 underline-offset-2 hover:underline"
                  >
                    {item.radicado}
                  </Link>
                </td>
                <td className="px-4 py-3 text-slate-700">{item.titulo}</td>
                <td className="px-4 py-3">
                  <TipoBadge value={item.tipo} />
                </td>
                <td className="px-4 py-3">
                  <EstadoBadge value={item.estado} />
                </td>
                <td className="px-4 py-3">
                  <PrioridadBadge value={item.prioridad} />
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {format(new Date(item.created_at), "dd MMM yyyy", { locale: es })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
