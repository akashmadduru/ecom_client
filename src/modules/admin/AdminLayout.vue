<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
      <aside class="card h-fit shadow-2xl">
        <div class="card-body space-y-1">
          <p class="mb-2 text-xs font-semibold uppercase tracking-[0.3em] text-primary">Admin</p>
          <router-link v-for="link in links" :key="link.to" :to="link.to"
            class="rounded-lg px-3 py-2 text-sm transition"
            :class="isActive(link.to) ? 'bg-primary/20 font-semibold text-white' : 'text-base-content/70 hover:bg-white/10 hover:text-white'">
            {{ link.label }}
          </router-link>
        </div>
      </aside>

      <section>
        <router-view />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const links = [
  { to: '/admin', label: 'Overview' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/inventory', label: 'Inventory' },
  { to: '/admin/inventory/bulk-update', label: 'Bulk update' },
  { to: '/admin/inventory/health-report', label: 'Health report' },
  { to: '/admin/inventory/reports', label: 'Stock reports' },
  { to: '/admin/diagnostics', label: 'Diagnostics' },
]

function isActive(to: string) {
  return to === '/admin' ? route.path === '/admin' : route.path.startsWith(to)
}
</script>
