import { useState, type FormEvent } from "react"
import { toast } from "sonner"
import { useAddSeguimiento } from "@/pqr/hooks/usePqr"
import { getErrorMessage } from "@/shared/api/types"
import { Button } from "@/shared/ui/button"
import { Label } from "@/shared/ui/label"
import { Textarea } from "@/shared/ui/textarea"

type Props = {
  pqrId: number
  canManage: boolean
  onNeedLogin?: () => void
}

export function SeguimientoForm({ pqrId, canManage, onNeedLogin }: Props) {
  const mutation = useAddSeguimiento(pqrId)
  const [descripcion, setDescripcion] = useState("")

  if (!canManage) {
    return (
      <Button variant="outline" className="w-full" onClick={onNeedLogin}>
        Inicia sesión para comentar
      </Button>
    )
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    if (!descripcion.trim()) {
      toast.error("Escribe un comentario")
      return
    }
    try {
      await mutation.mutateAsync({ descripcion })
      setDescripcion("")
      toast.success("Seguimiento agregado")
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo agregar"))
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-2">
      <Label htmlFor="seguimiento">Nuevo seguimiento</Label>
      <Textarea
        id="seguimiento"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Nota interna del caso..."
        className="min-h-20"
      />
      <Button
        type="submit"
        disabled={mutation.isPending}
        className="bg-teal-700 text-white hover:bg-teal-800"
      >
        Agregar
      </Button>
    </form>
  )
}
