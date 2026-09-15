import { format } from "date-fns"
import { es } from "date-fns/locale"
import type { Seguimiento } from "@/pqr/types"
import { EmptyState } from "@/shared/components/EmptyState"

export function SeguimientoTimeline({ items }: { items: Seguimiento[] }) {
  if (items.length === 0) {
    return <EmptyState title="Sin seguimientos" />
  }

  return (
    <ol className="relative space-y-3 border-l-2 border-teal-200 pl-4">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <span className="absolute -left-[1.4rem] top-2 size-2.5 rounded-full bg-teal-500 ring-4 ring-teal-50" />
          <div className="rounded-xl border border-teal-100 bg-gradient-to-br from-white to-teal-50/40 px-3 py-2 transition hover:border-teal-300">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-teal-800/80">
              <span className="rounded-full bg-teal-100 px-2 py-0.5 font-semibold uppercase tracking-wide text-teal-800">
                {item.tipo_accion}
              </span>
              <span>
                {format(new Date(item.fecha_registro), "dd MMM yyyy HH:mm", {
                  locale: es,
                })}
              </span>
            </div>
            <p className="mt-1.5 text-sm text-slate-700">{item.descripcion}</p>
            {item.usuario_nombre ? (
              <p className="mt-1 text-xs text-slate-500">Por {item.usuario_nombre}</p>
            ) : null}
          </div>
        </li>
      ))}
    </ol>
  )
}
