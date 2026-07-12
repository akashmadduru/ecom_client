<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
      <div class="card w-full shadow-2xl">
        <div class="card-body">
          <p class="text-sm uppercase tracking-[0.3em] text-primary">Welcome back</p>
          <h1 class="text-3xl font-semibold">Log in to your account</h1>

          <div class="mt-6 space-y-4">
            <div id="google-signin-button" class="w-full" />
            <div v-if="googleHint"
              class="rounded-2xl border border-warning/30 bg-warning/10 p-3 text-sm text-warning-content">
              {{ googleHint }}
            </div>
            <div class="flex items-center gap-3 text-sm text-base-content/70">
              <div class="h-px flex-1 bg-white/10" />
              <span>or continue with email</span>
              <div class="h-px flex-1 bg-white/10" />
            </div>
          </div>

          <form class="mt-6 flex flex-col space-y-4" @submit.prevent="onSubmit">
            <label class="form-control flex flex-col gap-2">
              <input v-model="form.username" class="input input-bordered" type="text" placeholder="Enter username"
                required />
            </label>
            <label class="form-control flex flex-col gap-2">
              <input v-model="form.password" class="input input-bordered" type="password" placeholder="Enter password"
                required />
            </label>
            <button :class="['btn btn-primary w-full', { 'opacity-70': processing }]" type="submit">{{ processing ?
              'Signing in...' : 'Log in' }}</button>
          </form>
          <p class="mt-4 text-sm text-base-content/70">
            New here? {{ ' ' }}
            <router-link class="link link-primary" to="/signup">Create an account</router-link>
          </p>
        </div>
      </div>

      <div class="card w-full shadow-2xl">
        <div class="card-body">
          <h2 class="text-xl font-semibold">Quick access</h2>
          <ul class="mt-4 space-y-3 text-sm text-base-content/70">
            <li>• Track orders and returns</li>
            <li>• Save favorites in wishlist</li>
            <li>• Add and manage delivery addresses</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useEcommerceStore } from '@/stores/ecommerce'

import type { AuthUser } from '@/interfaces/auth'

const authStore = useAuthStore()
const ecommerceStore = useEcommerceStore()

const router = useRouter()
const processing = ref(false)
const googleHint = ref('')

const form = reactive<AuthUser>({ username: '', password: '' })

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

async function onSubmit() {
  processing.value = true
  try {
    const response = await authStore.signInUser(form)
    if (response?.isLoggedIn) {
      ecommerceStore.authenticateUser(
        {
          name: response.user?.username ?? 'Member',
          email: response.user?.username ?? 'member@example.com',
          memberSince: new Date().getFullYear().toString(),
        },
        response.token,
      )
      router.push('/')
    }
  } finally {
    processing.value = false
  }
}

function handleGoogleCredentialResponse(response: { credential: string }) {
  const payload = decodeJwtPayload(response.credential)
  const name = typeof payload.name === 'string' ? payload.name : ''
  const email = typeof payload.email === 'string' ? payload.email : ''

  const authResponse = authStore.signInWithGoogle(response.credential)
  ecommerceStore.authenticateUser(
    {
      name: name || authResponse.user?.username || 'Google User',
      email: email || authResponse.user?.username || 'google@example.com',
      memberSince: new Date().getFullYear().toString(),
    },
    authResponse.token,
  )
  ecommerceStore.showToast(`Welcome, ${name || authResponse.user?.username || 'there'}!`, 'success')
  router.push('/')
}

function initializeGoogleButton() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID
  if (!clientId) {
    googleHint.value = 'Set VITE_GOOGLE_CLIENT_ID to enable Google Sign-In.'
    return
  }

  if (!window.google?.accounts?.id) {
    googleHint.value = 'Google sign-in script is still loading. Please refresh if needed.'
    return
  }

  window.google.accounts.id.initialize({
    client_id: clientId,
    callback: handleGoogleCredentialResponse,
    auto_select: false,
    cancel_on_tap_outside: true,
  })

  const buttonContainer = document.getElementById('google-signin-button')
  if (buttonContainer) {
    buttonContainer.innerHTML = ''
    window.google.accounts.id.renderButton(buttonContainer, {
      theme: 'outline',
      size: 'large',
      text: 'continue_with',
      shape: 'pill',
      width: '100%',
    })
  }
}

onMounted(() => {
  if (window.google?.accounts?.id) {
    initializeGoogleButton()
    return
  }

  const script = document.createElement('script')
  script.src = 'https://accounts.google.com/gsi/client'
  script.async = true
  script.defer = true
  script.onload = initializeGoogleButton
  document.head.appendChild(script)
})
</script>
