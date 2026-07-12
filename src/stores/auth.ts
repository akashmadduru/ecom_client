import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { AuthResponse, AuthUser } from '@/interfaces/auth'

import { signIn, signUp } from '@/api/AuthApi'

function decodeJwtPayload(token: string) {
  const base64Payload = token.split('.')[1]
  if (!base64Payload) {
    return {}
  }

  const normalized = base64Payload.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), '=')
  const decoded = window.atob(padded)

  return JSON.parse(decoded) as Record<string, unknown>
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<AuthResponse>()

  async function signInUser(AuthUser: AuthUser): Promise<AuthResponse> {
    const response = await signIn(AuthUser)
    user.value = response
    return response
  }

  async function signUpUser(AuthUser: AuthUser): Promise<AuthResponse> {
    const response = await signUp(AuthUser)
    user.value = response
    return response
  }

  function signInWithGoogle(credential: string): AuthResponse {
    const payload = decodeJwtPayload(credential)
    const email = typeof payload.email === 'string' ? payload.email : ''
    const name = typeof payload.name === 'string' ? payload.name : ''
    const username = email || name || 'google-user'

    const response: AuthResponse = {
      token: credential,
      user: {
        username,
        password: '',
        role: 'user',
      },
      isLoggedIn: true,
    }

    user.value = response
    return response
  }

  function signOutUser() {
    user.value = undefined
  }

  async function fetchUser() {
    if (user.value) {
      return user.value
    }
  }

  return {
    user,
    signInUser,
    signUpUser,
    signInWithGoogle,
    signOutUser,
    fetchUser,
  }
})
