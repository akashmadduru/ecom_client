<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto flex max-w-5xl flex-col gap-6 lg:flex-row">
      <div class="card w-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div class="card-body">
          <h1 class="text-3xl font-semibold">Create your account</h1>
          <p class="text-sm text-base-content/70">Join the store to save wishlist items, track orders, and checkout
            faster.</p>
          <form class="mt-6 space-y-4" @submit.prevent="onSubmit">
            <div class="grid gap-4 md:grid-cols-2">
              <label class="form-control">
                <!-- <input v-model="form.username" class="input input-bordered" placeholder="Asha Kumar" required /> -->
                <input v-model="form.username" class="input input-bordered" type="email" placeholder="you@example.com"
                  required />
              </label>
              <label class="form-control">
                <input v-model="form.password" class="input input-bordered" type="password"
                  placeholder="Minimum 8 characters" required />
              </label>
            </div>
            <div class="grid gap-4 md:grid-cols-2">
              <!-- <label class="form-control">
              </label> -->
              <!-- <label class="form-control">
                <input v-model="form.phone" class="input input-bordered" placeholder="+91 98765 43210" />
              </label> -->
            </div>
            <!-- <label class="form-control">
              <input v-model="form.referral" class="input input-bordered" placeholder="WELCOME10" />
            </label> -->

            <button :class="['mt-4 btn btn-primary w-full', { 'opacity-70': processing }]" type="submit">{{ processing ?
              'Creating...' : 'Sign up' }}</button>
          </form>
        </div>
      </div>
      <div class="card w-full border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div class="card-body">
          <h2 class="text-2xl font-semibold">Why sign up?</h2>
          <ul class="mt-4 space-y-3 text-sm">
            <li>• Save products to your wishlist</li>
            <li>• Track your orders in one place</li>
            <li>• Add multiple delivery addresses</li>
            <li>• Get early access to new launches</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import type { AuthUser } from '@/interfaces/auth'

const authStore = useAuthStore()

const router = useRouter()
const processing = ref(false)

const form = reactive<AuthUser>({
  username: '',
  password: '',
})

async function onSubmit() {
  processing.value = true
  try {
    const ok = await authStore.signUpUser(form)
    if (ok) router.push('/')
  } finally {
    processing.value = false
  }
}
</script>
