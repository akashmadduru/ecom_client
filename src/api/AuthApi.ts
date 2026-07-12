import api from '@/config/axios'
import type { AuthResponse, AuthUser } from '@/interfaces/auth'

export async function signUp(authUser: AuthUser): Promise<AuthResponse> {
  const response = await api.post('/auth/signup', authUser)
  return response.data as AuthResponse
}

export async function signIn(authUser: AuthUser): Promise<AuthResponse> {
  const response = await api.post('/auth/signin', authUser)
  return response.data as AuthResponse
}
