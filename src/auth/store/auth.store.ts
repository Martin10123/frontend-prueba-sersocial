import Cookies from "js-cookie"
import { create } from "zustand"
import { jwtDecode } from "jwt-decode"

export type AuthUser = {
  id: number
  email: string
  nombre: string
  rol: "agente" | "supervisor" | "admin"
}

type JwtPayload = {
  user_id?: number
  rol?: AuthUser["rol"]
  nombre?: string
  exp?: number
}

type AuthState = {
  accessToken: string | null
  refreshToken: string | null
  user: AuthUser | null
  setSession: (payload: {
    access: string
    refresh: string
    user: AuthUser
  }) => void
  setTokens: (access: string, refresh: string) => void
  setUser: (user: AuthUser) => void
  logout: () => void
  hydrate: () => void
}

const ACCESS_KEY = "access_token"
const REFRESH_KEY = "refresh_token"
const USER_KEY = "auth_user"

const cookieOpts = {
  sameSite: "lax" as const,
  secure: import.meta.env.PROD,
}

function persistTokens(access: string, refresh: string) {
  Cookies.set(ACCESS_KEY, access, { ...cookieOpts, expires: 1 })
  Cookies.set(REFRESH_KEY, refresh, { ...cookieOpts, expires: 7 })
}

function clearPersisted() {
  Cookies.remove(ACCESS_KEY)
  Cookies.remove(REFRESH_KEY)
  localStorage.removeItem(USER_KEY)
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  user: null,

  setSession: ({ access, refresh, user }) => {
    persistTokens(access, refresh)
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ accessToken: access, refreshToken: refresh, user })
  },

  setTokens: (access, refresh) => {
    persistTokens(access, refresh)
    set({ accessToken: access, refreshToken: refresh })
  },

  setUser: (user) => {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
    set({ user })
  },

  logout: () => {
    clearPersisted()
    set({ accessToken: null, refreshToken: null, user: null })
  },

  hydrate: () => {
    const access = Cookies.get(ACCESS_KEY) ?? null
    const refresh = Cookies.get(REFRESH_KEY) ?? null
    const rawUser = localStorage.getItem(USER_KEY)

    if (!access) {
      clearPersisted()
      set({ accessToken: null, refreshToken: null, user: null })
      return
    }

    try {
      const payload = jwtDecode<JwtPayload>(access)
      if (payload.exp && payload.exp * 1000 < Date.now()) {
        if (!refresh) {
          clearPersisted()
          set({ accessToken: null, refreshToken: null, user: null })
          return
        }
      }
    } catch {
      clearPersisted()
      set({ accessToken: null, refreshToken: null, user: null })
      return
    }

    let user: AuthUser | null = null
    if (rawUser) {
      try {
        user = JSON.parse(rawUser) as AuthUser
      } catch {
        localStorage.removeItem(USER_KEY)
      }
    }

    set({ accessToken: access, refreshToken: refresh, user })
  },
}))
