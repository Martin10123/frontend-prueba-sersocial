import { Link } from "react-router-dom"
import { EmptyState } from "@/shared/components/EmptyState"

export function NotFoundPage() {
  return (
    <div className="space-y-4">
      <EmptyState
        title="Página no encontrada"
        description="La ruta no existe o el enlace está roto."
      />
      <Link
        to="/"
        className="inline-flex h-10 items-center rounded-full bg-teal-700 px-4 text-sm font-semibold text-white hover:bg-teal-800"
      >
        Volver al listado
      </Link>
    </div>
  )
}
