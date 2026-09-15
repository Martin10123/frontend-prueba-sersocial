import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios"
import Cookies from "js-cookie"
import { toast } from "sonner"
import { queryClient } from "@/shared/api/query-client"
import { useAuthStore } from "@/auth/store/auth.store"
import { useUiStore } from "@/shared/store/ui.store"

const API_URL = import.meta.env.VITE_API_URL ?? "http://127.0.0.1:8000"
const ACCESS_KEY = "access_token"
const REFRESH_KEY = "refresh_token"

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean }

export const http = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
})

const refreshClient = axios.create({
  baseURL: `${API_URL}/api`,
  headers: { "Content-Type": "application/json" },
})

http.interceptors.request.use((config) => {
  const token = Cookies.get(ACCESS_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

let refreshPromise: Promise<string | null> | null = null

function expireSession() {
  useAuthStore.getState().logout()
  queryClient.clear()
  useUiStore.getState().openLogin()
  toast.error("Sesión expirada. Ingresa de nuevo.")
}

async function refreshAccessToken(): Promise<string | null> {
  const refresh = Cookies.get(REFRESH_KEY)
  if (!refresh) return null

  const { data } = await refreshClient.post<{ access: string; refresh?: string }>(
    "/auth/refresh/",
    { refresh },
  )
  useAuthStore.getState().setTokens(data.access, data.refresh ?? refresh)
  return data.access
}

http.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined
    const status = error.response?.status
    const url = original?.url ?? ""
    const isAuthRoute = url.includes("/auth/login/") || url.includes("/auth/refresh/")

    if (status !== 401 || !original || original._retry || isAuthRoute) {
      return Promise.reject(error)
    }

    original._retry = true

    try {
      if (!refreshPromise) {
        refreshPromise = refreshAccessToken().finally(() => {
          refreshPromise = null
        })
      }
      const access = await refreshPromise
      if (!access) {
        expireSession()
        return Promise.reject(error)
      }
      original.headers.Authorization = `Bearer ${access}`
      return http(original)
    } catch {
      expireSession()
      return Promise.reject(error)
    }
  },
)
