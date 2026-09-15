import { useEffect, useState } from "react"
import { Link, NavLink, Outlet } from "react-router-dom"
import { Menu, X } from "lucide-react"
import { LoginModal } from "@/auth/components/LoginModal"
import { meRequest } from "@/auth/api/auth.api"
import { useAuth } from "@/auth/hooks/useAuth"
import { queryClient } from "@/shared/api/query-client"
import { useUiStore } from "@/shared/store/ui.store"
import { Button } from "@/shared/ui/button"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-3 py-1.5 text-sm transition-all ${
    isActive
      ? "bg-teal-700 text-white shadow-sm"
      : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
  }`

export function AppLayout() {
  const { user, isAuthenticated, logout, hydrate, setUser } = useAuth()
  const openLogin = useUiStore((s) => s.openLogin)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    hydrate()
  }, [hydrate])

  useEffect(() => {
    if (!isAuthenticated) return
    let cancelled = false
    void meRequest()
      .then((profile) => {
        if (!cancelled) setUser(profile)
      })
      .catch(() => {
        /* 401 interceptor handles expired sessions */
      })
    return () => {
      cancelled = true
    }
  }, [isAuthenticated, setUser])

  function onLogout() {
    logout()
    queryClient.clear()
    setMenuOpen(false)
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_#ccfbf1_0%,_#f0fdfa_35%,_#ffffff_70%)]">
      <header className="sticky top-0 z-40 border-b border-teal-100/80 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3">
          <Link to="/" className="group flex items-center gap-2 font-semibold tracking-tight">
            <span className="grid size-8 place-items-center rounded-xl bg-gradient-to-br from-teal-600 to-cyan-500 text-xs text-white shadow-md shadow-teal-600/25 transition group-hover:scale-105">
              PQR
            </span>
            <span>
              Sersocial <span className="text-teal-700">IPS</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Principal">
            <NavLink to="/" end className={linkClass}>
              Listado
            </NavLink>
            <NavLink to="/pqr/nueva" className={linkClass}>
              Nueva
            </NavLink>
            <NavLink to="/estadisticas" className={linkClass}>
              Estadísticas
            </NavLink>
            {isAuthenticated ? (
              <div className="ml-2 flex items-center gap-2 border-l border-teal-100 pl-3">
                <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-800 ring-1 ring-amber-200">
                  {user?.nombre} · {user?.rol}
                </span>
                <Button variant="outline" size="sm" onClick={onLogout}>
                  Salir
                </Button>
              </div>
            ) : (
              <Button
                size="sm"
                className="ml-2 bg-teal-700 text-white hover:bg-teal-800"
                onClick={openLogin}
              >
                Login
              </Button>
            )}
          </nav>

          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {menuOpen ? (
          <nav
            className="flex flex-col gap-2 border-t border-teal-100 px-4 py-3 md:hidden"
            aria-label="Móvil"
          >
            <NavLink to="/" end className={linkClass} onClick={() => setMenuOpen(false)}>
              Listado
            </NavLink>
            <NavLink
              to="/pqr/nueva"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Nueva
            </NavLink>
            <NavLink
              to="/estadisticas"
              className={linkClass}
              onClick={() => setMenuOpen(false)}
            >
              Estadísticas
            </NavLink>
            {isAuthenticated ? (
              <Button variant="outline" className="w-full" onClick={onLogout}>
                Salir ({user?.nombre})
              </Button>
            ) : (
              <Button
                className="w-full bg-teal-700 text-white hover:bg-teal-800"
                onClick={() => {
                  setMenuOpen(false)
                  openLogin()
                }}
              >
                Login
              </Button>
            )}
          </nav>
        ) : null}
      </header>

      <main className="mx-auto max-w-6xl px-4 py-5 sm:py-8">
        <Outlet />
      </main>
      <LoginModal />
    </div>
  )
}
