import { useEffect, useState } from "react"
import { toast } from "sonner"
import { useUpdatePqrEstado } from "@/pqr/hooks/usePqr"
import type { PqrDetail } from "@/pqr/types"
import { ESTADOS_PQR, PRIORIDADES_PQR } from "@/shared/constants/pqr"
import { getErrorMessage } from "@/shared/api/types"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Select } from "@/shared/ui/select"

const NEXT: Record<string, string[]> = {
  recibida: ["en_gestion"],
  en_gestion: ["resuelta", "recibida"],
  resuelta: ["cerrada", "en_gestion"],
  cerrada: [],
}

type Props = {
  pqr: PqrDetail
  canManage: boolean
  onNeedLogin?: () => void
}

export function PqrStatusActions({ pqr, canManage, onNeedLogin }: Props) {
  const mutation = useUpdatePqrEstado(pqr.id)
  const [estado, setEstado] = useState(pqr.estado)
  const [prioridad, setPrioridad] = useState(pqr.prioridad)

  useEffect(() => {
    setEstado(pqr.estado)
    setPrioridad(pqr.prioridad)
  }, [pqr.id, pqr.estado, pqr.prioridad, pqr.updated_at])

  if (!canManage) {
    return (
      <div className="rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 p-5 ring-1 ring-amber-100">
        <p className="text-sm text-amber-950">
          Necesitas sesión de agente para cambiar el caso.
        </p>
        <Button
          className="mt-3 bg-teal-700 text-white hover:bg-teal-800"
          onClick={onNeedLogin}
        >
          Abrir login
        </Button>
      </div>
    )
  }

  const dirty = estado !== pqr.estado || prioridad !== pqr.prioridad

  async function onSave() {
    if (!dirty) return
    try {
      await mutation.mutateAsync({
        estado: estado !== pqr.estado ? estado : undefined,
        prioridad: prioridad !== pqr.prioridad ? prioridad : undefined,
      })
      toast.success("PQR actualizada")
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo actualizar"))
    }
  }

  const allowed = new Set([pqr.estado, ...(NEXT[pqr.estado] ?? [])])

  return (
    <div className="grid gap-4 rounded-2xl bg-gradient-to-br from-teal-50 via-white to-cyan-50 p-4 ring-1 ring-teal-100 sm:grid-cols-3">
      <div>
        <Label htmlFor="gestion-estado">Estado</Label>
        <Select
          id="gestion-estado"
          value={estado}
          onValueChange={(value) => setEstado(value as typeof estado)}
          options={ESTADOS_PQR.filter((o) => allowed.has(o.value)).map((o) => ({
            value: o.value,
            label: o.label,
          }))}
        />
      </div>
      <div>
        <Label htmlFor="gestion-prioridad">Prioridad</Label>
        <Select
          id="gestion-prioridad"
          value={prioridad}
          onValueChange={(value) => setPrioridad(value as typeof prioridad)}
          options={PRIORIDADES_PQR.map((o) => ({
            value: o.value,
            label: o.label,
          }))}
        />
      </div>
      <div className="flex items-end">
        <Button
          className="w-full bg-teal-700 text-white hover:bg-teal-800"
          disabled={mutation.isPending || !dirty}
          onClick={() => void onSave()}
        >
          Guardar cambios
        </Button>
      </div>
    </div>
  )
}
