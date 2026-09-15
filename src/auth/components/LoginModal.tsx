import { useEffect, useRef, useState, type FormEvent } from "react"
import { toast } from "sonner"
import { X } from "lucide-react"
import { loginRequest } from "@/auth/api/auth.api"
import { useAuth } from "@/auth/hooks/useAuth"
import { loginSchema } from "@/auth/schemas/login.schema"
import { getErrorMessage } from "@/shared/api/types"
import { useUiStore } from "@/shared/store/ui.store"
import { Button } from "@/shared/ui/button"
import { Input } from "@/shared/ui/input"
import { Label } from "@/shared/ui/label"

export function LoginModal() {
  const open = useUiStore((s) => s.loginOpen)
  const closeLogin = useUiStore((s) => s.closeLogin)
  const { isAuthenticated, setSession } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isAuthenticated && open) closeLogin()
  }, [isAuthenticated, open, closeLogin])

  useEffect(() => {
    if (!open) {
      setPassword("")
      return
    }
    const previous = document.activeElement as HTMLElement | null
    const focusTimer = window.setTimeout(() => emailRef.current?.focus(), 20)
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeLogin()
      if (e.key !== "Tab" || !dialogRef.current) return
      const nodes = [
        ...dialogRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ].filter((el) => !el.hasAttribute("disabled"))
      if (nodes.length === 0) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.clearTimeout(focusTimer)
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      previous?.focus?.()
    }
  }, [open, closeLogin])

  if (!open) return null

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      toast.error(parsed.error.issues[0]?.message ?? "Datos inválidos")
      return
    }

    setLoading(true)
    try {
      const data = await loginRequest(parsed.data)
      setSession({
        access: data.access,
        refresh: data.refresh,
        user: data.user,
      })
      toast.success(`Bienvenido, ${data.user.nombre}`)
      closeLogin()
    } catch (error) {
      toast.error(getErrorMessage(error, "No se pudo iniciar sesión"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={closeLogin}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
        className="relative z-10 w-full max-w-md overflow-hidden rounded-t-3xl border border-teal-100 bg-white shadow-2xl animate-in slide-in-from-bottom duration-300 sm:rounded-3xl sm:slide-in-from-bottom-4"
      >
        <div className="bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 px-5 py-6 text-white">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-sm text-teal-50/90">Sersocial IPS</p>
              <h2 id="login-title" className="mt-1 text-2xl font-semibold tracking-tight">
                Ingreso de agentes
              </h2>
              <p className="mt-1 text-sm text-teal-50/85">
                Gestiona estados, seguimiento y estadísticas.
              </p>
            </div>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={closeLogin}
              className="rounded-full bg-white/15 p-2 transition hover:bg-white/25"
            >
              <X className="size-4" />
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 p-5">
          <div>
            <Label htmlFor="login-email">Email</Label>
            <Input
              ref={emailRef}
              id="login-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1"
            />
          </div>
          <div>
            <Label htmlFor="login-password">Contraseña</Label>
            <Input
              id="login-password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1"
            />
          </div>
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-teal-700 text-white hover:bg-teal-800"
          >
            {loading ? "Ingresando..." : "Entrar"}
          </Button>
        </form>
      </div>
    </div>
  )
}
