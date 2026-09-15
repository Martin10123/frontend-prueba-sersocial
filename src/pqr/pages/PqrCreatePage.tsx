import { useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"
import { useCreatePqr } from "@/pqr/hooks/usePqr"
import { createPqrSchema } from "@/pqr/schemas/pqr.schema"
import {
  CANALES_PQR,
  PRIORIDADES_PQR,
  TIPOS_PQR,
} from "@/shared/constants/pqr"
import { PageHeader } from "@/shared/components/PageHeader"
import { getErrorMessage } from "@/shared/api/types"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"
import { Select } from "@/shared/ui/select"
import { Textarea } from "@/shared/ui/textarea"

const initial = {
  tipo: "peticion",
  titulo: "",
  descripcion: "",
  categoria: "",
  prioridad: "media",
  canal: "web",
  nombre: "",
  apellido: "",
  identificacion: "",
  email: "",
  telefono: "",
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1 text-xs text-red-700">{message}</p>
}

export function PqrCreatePage() {
  const navigate = useNavigate()
  const mutation = useCreatePqr()
  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState<Record<string, string>>({})

  function setField(key: keyof typeof initial, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => {
      const next = { ...prev }
      delete next[key]
      if (key === "nombre") delete next["solicitante.nombre"]
      if (key === "apellido") delete next["solicitante.apellido"]
      if (key === "identificacion") delete next["solicitante.identificacion"]
      if (key === "email") delete next["solicitante.email"]
      if (key === "telefono") delete next["solicitante.telefono"]
      return next
    })
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const payload = {
      tipo: form.tipo,
      titulo: form.titulo,
      descripcion: form.descripcion,
      categoria: form.categoria,
      prioridad: form.prioridad,
      canal: form.canal,
      solicitante: {
        nombre: form.nombre,
        apellido: form.apellido,
        identificacion: form.identificacion,
        email: form.email,
        telefono: form.telefono,
      },
    }

    const parsed = createPqrSchema.safeParse(payload)
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const path = issue.path.join(".")
        if (path && !next[path]) next[path] = issue.message
      }
      setErrors(next)
      toast.error(parsed.error.issues[0]?.message ?? "Revisa el formulario")
      return
    }

    setErrors({})
    try {
      const created = await mutation.mutateAsync(parsed.data)
      toast.success(`PQR creada: ${created.radicado}`)
      navigate(`/pqr/${created.id}`)
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo crear la PQR"))
    }
  }

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in duration-300">
      <PageHeader
        title="Registrar PQR"
        description="Completa los datos de la solicitud y del solicitante."
      />

      <form
        onSubmit={onSubmit}
        className="space-y-6 rounded-2xl border border-teal-100 bg-white/90 p-4 shadow-sm shadow-teal-900/5 sm:p-6"
        noValidate
      >
        <section className="grid gap-3 sm:grid-cols-2">
          <div>
            <Label htmlFor="pqr-tipo">Tipo</Label>
            <Select
              id="pqr-tipo"
              value={form.tipo}
              onValueChange={(value) => setField("tipo", value)}
              options={TIPOS_PQR.map((o) => ({ value: o.value, label: o.label }))}
            />
          </div>
          <div>
            <Label htmlFor="pqr-prioridad">Prioridad</Label>
            <Select
              id="pqr-prioridad"
              value={form.prioridad}
              onValueChange={(value) => setField("prioridad", value)}
              options={PRIORIDADES_PQR.map((o) => ({
                value: o.value,
                label: o.label,
              }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pqr-titulo">Título</Label>
            <Input
              id="pqr-titulo"
              value={form.titulo}
              onChange={(e) => setField("titulo", e.target.value)}
              aria-invalid={Boolean(errors.titulo)}
            />
            <FieldError message={errors.titulo} />
          </div>
          <div>
            <Label htmlFor="pqr-categoria">Categoría</Label>
            <Input
              id="pqr-categoria"
              value={form.categoria}
              onChange={(e) => setField("categoria", e.target.value)}
              aria-invalid={Boolean(errors.categoria)}
            />
            <FieldError message={errors.categoria} />
          </div>
          <div>
            <Label htmlFor="pqr-canal">Canal</Label>
            <Select
              id="pqr-canal"
              value={form.canal}
              onValueChange={(value) => setField("canal", value)}
              options={CANALES_PQR.map((o) => ({ value: o.value, label: o.label }))}
            />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pqr-descripcion">Descripción</Label>
            <Textarea
              id="pqr-descripcion"
              value={form.descripcion}
              onChange={(e) => setField("descripcion", e.target.value)}
              aria-invalid={Boolean(errors.descripcion)}
            />
            <FieldError message={errors.descripcion} />
          </div>
        </section>

        <section className="grid gap-3 sm:grid-cols-2">
          <h2 className="sm:col-span-2 text-lg font-medium">Solicitante</h2>
          <div>
            <Label htmlFor="pqr-nombre">Nombre</Label>
            <Input
              id="pqr-nombre"
              value={form.nombre}
              onChange={(e) => setField("nombre", e.target.value)}
              aria-invalid={Boolean(errors["solicitante.nombre"])}
            />
            <FieldError message={errors["solicitante.nombre"]} />
          </div>
          <div>
            <Label htmlFor="pqr-apellido">Apellido</Label>
            <Input
              id="pqr-apellido"
              value={form.apellido}
              onChange={(e) => setField("apellido", e.target.value)}
              aria-invalid={Boolean(errors["solicitante.apellido"])}
            />
            <FieldError message={errors["solicitante.apellido"]} />
          </div>
          <div>
            <Label htmlFor="pqr-identificacion">Identificación</Label>
            <Input
              id="pqr-identificacion"
              value={form.identificacion}
              onChange={(e) => setField("identificacion", e.target.value)}
              aria-invalid={Boolean(errors["solicitante.identificacion"])}
            />
            <FieldError message={errors["solicitante.identificacion"]} />
          </div>
          <div>
            <Label htmlFor="pqr-email">Email</Label>
            <Input
              id="pqr-email"
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              aria-invalid={Boolean(errors["solicitante.email"])}
            />
            <FieldError message={errors["solicitante.email"]} />
          </div>
          <div className="sm:col-span-2">
            <Label htmlFor="pqr-telefono">Teléfono</Label>
            <Input
              id="pqr-telefono"
              value={form.telefono}
              onChange={(e) => setField("telefono", e.target.value)}
            />
          </div>
        </section>

        <Button
          type="submit"
          disabled={mutation.isPending}
          className="bg-teal-700 text-white hover:bg-teal-800"
        >
          {mutation.isPending ? "Guardando..." : "Registrar PQR"}
        </Button>
      </form>
    </div>
  )
}
