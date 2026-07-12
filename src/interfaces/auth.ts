export interface AuthUser {
  username: string
  password: string
  role?: string
}

export interface AuthResponse {
  token: string
  user: AuthUser
  isLoggedIn: boolean
}
