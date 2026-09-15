import { useAuthStore } from "@/auth/store/auth.store"

export function useAuth() {
  const user = useAuthStore((s) => s.user)
  const accessToken = useAuthStore((s) => s.accessToken)
  const setSession = useAuthStore((s) => s.setSession)
  const setUser = useAuthStore((s) => s.setUser)
  const logout = useAuthStore((s) => s.logout)
  const hydrate = useAuthStore((s) => s.hydrate)

  return {
    user,
    accessToken,
    isAuthenticated: Boolean(accessToken),
    setSession,
    setUser,
    logout,
    hydrate,
  }
}
