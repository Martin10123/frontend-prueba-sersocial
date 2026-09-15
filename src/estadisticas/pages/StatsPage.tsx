import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useEffect } from "react"
import { useAuth } from "@/auth/hooks/useAuth"
import { useStats } from "@/pqr/hooks/usePqr"
import {
  ESTADOS_PQR,
  TIPOS_PQR,
  labelOf,
} from "@/shared/constants/pqr"
import { LoadingState } from "@/shared/components/LoadingState"
import { PageHeader } from "@/shared/components/PageHeader"
import { QueryError } from "@/shared/components/QueryError"
import { getErrorMessage } from "@/shared/api/types"
import { useUiStore } from "@/shared/store/ui.store"
import { Button } from "@/shared/ui/button"

export function StatsPage() {
  const { isAuthenticated } = useAuth()
  const openLogin = useUiStore((s) => s.openLogin)
  const query = useStats(isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) openLogin()
  }, [isAuthenticated, openLogin])

  if (!isAuthenticated) {
    return (
      <div className="rounded-2xl border border-amber-100 bg-amber-50 p-8 text-center">
        <h1 className="text-xl font-semibold text-amber-950">Estadísticas</h1>
        <p className="mt-2 text-sm text-amber-900/80">
          Inicia sesión para ver los conteos por estado y tipo.
        </p>
        <Button
          className="mt-4 bg-teal-700 text-white hover:bg-teal-800"
          onClick={openLogin}
        >
          Abrir login
        </Button>
      </div>
    )
  }

  if (query.isLoading) return <LoadingState />
  if (query.isError || !query.data) {
    return (
      <QueryError
        message={getErrorMessage(query.error, "No se pudieron cargar las estadísticas")}
        onRetry={() => void query.refetch()}
      />
    )
  }

  const porEstado = query.data.por_estado.map((row) => ({
    name: labelOf(ESTADOS_PQR, row.estado),
    total: row.total,
  }))
  const porTipo = query.data.por_tipo.map((row) => ({
    name: labelOf(TIPOS_PQR, row.tipo),
    total: row.total,
  }))

  return (
    <div className="animate-in fade-in duration-300">
      <PageHeader
        title="Estadísticas"
        description={`Total de PQR registradas: ${query.data.total}`}
      />

      <div className="grid gap-4 sm:gap-6 lg:grid-cols-2">
        <ChartBlock title="Por estado" data={porEstado} color="#0f766e" />
        <ChartBlock title="Por tipo" data={porTipo} color="#0891b2" />
      </div>
    </div>
  )
}

function ChartBlock({
  title,
  data,
  color,
}: {
  title: string
  data: Array<{ name: string; total: number }>
  color: string
}) {
  return (
    <section className="rounded-2xl border border-teal-100 bg-white p-4 shadow-sm shadow-teal-900/5">
      <h2 className="mb-4 text-base font-semibold text-teal-900">{title}</h2>
      {data.length === 0 ? (
        <p className="grid h-64 place-items-center text-sm text-slate-500">
          No hay datos para graficar.
        </p>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="total" fill={color} radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}
