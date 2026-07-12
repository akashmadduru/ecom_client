<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Admin" title="Operations overview"
      description="Manage the product catalog and inventory backed by the live microservices." />

    <div class="grid gap-6 md:grid-cols-2">
      <router-link to="/admin/products"
        class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition hover:border-primary/40">
        <div class="card-body">
          <h2 class="text-xl font-semibold text-white">Products</h2>
          <p class="text-sm text-base-content/70">Create, edit, delete, and seed the product catalog.</p>
        </div>
      </router-link>

      <router-link to="/admin/inventory"
        class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition hover:border-primary/40">
        <div class="card-body">
          <h2 class="text-xl font-semibold text-white">Inventory</h2>
          <p class="text-sm text-base-content/70">Track stock, reserve/release, adjust, and restock.</p>
        </div>
      </router-link>

      <router-link to="/admin/inventory/health-report"
        class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition hover:border-primary/40">
        <div class="card-body">
          <h2 class="text-xl font-semibold text-white">Health report</h2>
          <p class="text-sm text-base-content/70">Overall inventory health across the catalog.</p>
        </div>
      </router-link>

      <router-link to="/admin/diagnostics"
        class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl transition hover:border-primary/40">
        <div class="card-body">
          <h2 class="text-xl font-semibold text-white">Diagnostics</h2>
          <p class="text-sm text-base-content/70">Raw auth service diagnostics for troubleshooting.</p>
        </div>
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import PageHeader from '@/components/PageHeader.vue'
</script>
