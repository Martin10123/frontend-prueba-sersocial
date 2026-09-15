import { z } from "zod"

export const createPqrSchema = z.object({
  tipo: z.enum(["peticion", "queja", "reclamo"]),
  titulo: z.string().min(3, "El título es muy corto"),
  descripcion: z.string().min(10, "La descripción es muy corta"),
  categoria: z.string().min(2, "La categoría es obligatoria"),
  prioridad: z.enum(["baja", "media", "alta", "urgente"]),
  canal: z.enum(["web", "email", "presencial"]),
  solicitante: z.object({
    nombre: z.string().min(2, "Nombre obligatorio"),
    apellido: z.string().min(2, "Apellido obligatorio"),
    identificacion: z.string().min(5, "Identificación inválida"),
    email: z.email("Email inválido"),
    telefono: z.string().optional(),
  }),
})

export type CreatePqrInput = z.infer<typeof createPqrSchema>
