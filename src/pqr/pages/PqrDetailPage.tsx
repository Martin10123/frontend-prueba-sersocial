import { useState } from "react"
import { Link, useParams } from "react-router-dom"
import { ArrowLeft, Clock3, UserRound } from "lucide-react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { useAuth } from "@/auth/hooks/useAuth"
import { PqrStatusActions } from "@/pqr/components/PqrStatusActions"
import { SeguimientoForm } from "@/pqr/components/SeguimientoForm"
import { SeguimientoTimeline } from "@/pqr/components/SeguimientoTimeline"
import { usePqrDetail } from "@/pqr/hooks/usePqr"
import { CANALES_PQR, labelOf } from "@/shared/constants/pqr"
import {
  EstadoBadge,
  PrioridadBadge,
  TipoBadge,
} from "@/shared/components/StatusBadges"
import { LoadingState } from "@/shared/components/LoadingState"
import { QueryError } from "@/shared/components/QueryError"
import { getErrorMessage } from "@/shared/api/types"
import { useUiStore } from "@/shared/store/ui.store"
import { Button } from "@/shared/ui/button"
import { cn } from "@/shared/lib/utils"

type Tab = "resumen" | "gestion" | "seguimiento"

export function PqrDetailPage() {
  const { id } = useParams()
  const pqrId = Number(id)
  const query = usePqrDetail(pqrId)
  const { isAuthenticated, user } = useAuth()
  const canClose = user?.rol === "supervisor" || user?.rol === "admin"
  const openLogin = useUiStore((s) => s.openLogin)
  const [tab, setTab] = useState<Tab>("resumen")

  if (!Number.isFinite(pqrId) || pqrId <= 0) {
    return <QueryError message="El identificador de la PQR no es válido." />
  }

  if (query.isLoading) return <LoadingState />
  if (query.isError || !query.data) {
    return (
      <QueryError
        message={getErrorMessage(query.error, "No se pudo cargar la PQR")}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const pqr = query.data

  return (
    <div className="flex h-[calc(100dvh-5.5rem)] flex-col gap-3 overflow-hidden animate-in fade-in duration-300">
      <div className="flex shrink-0 flex-col gap-3 rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-sm shadow-teal-900/5 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <Link
            to="/"
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900"
          >
            <ArrowLeft className="size-3.5" /> Volver
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="truncate text-xl font-semibold tracking-tight sm:text-2xl">
              {pqr.radicado}
            </h1>
            <TipoBadge value={pqr.tipo} />
            <EstadoBadge value={pqr.estado} />
            <PrioridadBadge value={pqr.prioridad} />
          </div>
          <p className="mt-1 truncate text-sm text-slate-600">{pqr.titulo}</p>
        </div>
        {!isAuthenticated ? (
          <Button
            className="shrink-0 bg-teal-700 text-white hover:bg-teal-800"
            onClick={openLogin}
          >
            Ingresar para gestionar
          </Button>
        ) : null}
      </div>

      <div
        role="tablist"
        aria-label="Secciones de la PQR"
        className="flex shrink-0 gap-1 overflow-x-auto rounded-full bg-teal-50/80 p-1 ring-1 ring-teal-100"
      >
        {(
          [
            ["resumen", "Resumen"],
            ["gestion", "Gestión"],
            ["seguimiento", `Seguimiento (${pqr.seguimientos.length})`],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={cn(
              "whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all",
              tab === key
                ? "bg-teal-700 text-white shadow-sm"
                : "text-teal-800 hover:bg-white",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-2xl border border-teal-100 bg-white shadow-sm">
        {tab === "resumen" ? (
          <div className="grid h-full gap-0 overflow-y-auto lg:grid-cols-2 lg:overflow-hidden">
            <section className="space-y-4 border-b border-teal-50 p-4 lg:overflow-y-auto lg:border-b-0 lg:border-r">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-teal-800">
                Caso
              </h2>
              <div className="grid grid-cols-2 gap-3">
                <Info label="Canal" value={labelOf(CANALES_PQR, pqr.canal)} />
                <Info label="Categoría" value={pqr.categoria} />
                <Info
                  label="Creada"
                  value={format(new Date(pqr.created_at), "dd MMM yyyy HH:mm", {
                    locale: es,
                  })}
                />
                <Info
                  label="Actualizada"
                  value={format(new Date(pqr.updated_at), "dd MMM yyyy HH:mm", {
                    locale: es,
                  })}
                />
              </div>
              <div className="rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 p-3 ring-1 ring-teal-100">
                <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">
                  Descripción
                </p>
                <p className="mt-2 text-sm leading-relaxed text-slate-700 whitespace-pre-wrap">
                  {pqr.descripcion}
                </p>
              </div>
            </section>

            <section className="space-y-4 p-4 lg:overflow-y-auto">
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-800">
                <UserRound className="size-4" /> Solicitante
              </h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Info
                  label="Nombre"
                  value={`${pqr.solicitante.nombre} ${pqr.solicitante.apellido}`}
                />
                <Info label="Identificación" value={pqr.solicitante.identificacion} />
                <Info label="Email" value={pqr.solicitante.email} />
                <Info label="Teléfono" value={pqr.solicitante.telefono || "—"} />
              </div>
              <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900 ring-1 ring-amber-100">
                Cambia a <strong>Gestión</strong> para estado/prioridad o a{" "}
                <strong>Seguimiento</strong> para el historial.
              </div>
            </section>
          </div>
        ) : null}

        {tab === "gestion" ? (
          <div className="h-full overflow-y-auto p-4">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-teal-800">
              Cambiar estado / prioridad
            </h2>
            <PqrStatusActions
              pqr={pqr}
              canManage={isAuthenticated}
              canClose={canClose}
              onNeedLogin={openLogin}
            />
          </div>
        ) : null}

        {tab === "seguimiento" ? (
          <div className="flex h-full min-h-0 flex-col p-4">
            <h2 className="mb-3 flex shrink-0 items-center gap-2 text-sm font-semibold uppercase tracking-wide text-teal-800">
              <Clock3 className="size-4" /> Historial
            </h2>
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
              <SeguimientoTimeline items={pqr.seguimientos} />
            </div>
            <div className="shrink-0 border-t border-teal-50 pt-3">
              <SeguimientoForm
                pqrId={pqr.id}
                canManage={isAuthenticated}
                onNeedLogin={openLogin}
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-2 ring-1 ring-slate-100 transition hover:bg-teal-50/60 hover:ring-teal-100">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-slate-800">{value}</p>
    </div>
  )
}
