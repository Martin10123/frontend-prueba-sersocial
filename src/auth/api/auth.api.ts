import { http } from "@/shared/api/http"
import type { AuthUser } from "@/auth/store/auth.store"
import type { LoginInput } from "@/auth/schemas/login.schema"

type LoginResponse = {
  access: string
  refresh: string
  user: AuthUser
}

export async function loginRequest(input: LoginInput): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/auth/login/", input)
  return data
}

export async function meRequest(): Promise<AuthUser> {
  const { data } = await http.get<AuthUser>("/auth/me/")
  return data
}
