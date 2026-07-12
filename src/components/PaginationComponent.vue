<script setup lang="ts">
import { useProductStore } from '@/stores/product'
import { computed } from 'vue'

const store = useProductStore()

const visiblePages = computed(() => {
  const current = store.pagination.page
  const total = store.pagination.total_pages

  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)

  if (end - start < 4) {
    start = Math.max(1, end - 4)
  }

  return Array.from(
    { length: end - start + 1 },
    (_, i) => start + i
  )
})
</script>

<template>
  <div v-if="store.pagination.total_pages > 1" class="mt-8 flex flex-wrap items-center justify-between gap-3 px-4 py-3">
    <button class="btn btn-outline btn-sm min-w-24" :disabled="!store.pagination.has_previous"
      @click="store.previous()">
      Previous
    </button>

    <div class="flex flex-wrap items-center justify-center gap-2">
      <button v-for="page in visiblePages" :key="page" @click="store.goTo(page)"
        class="btn btn-sm h-10 w-10 border border-white/10 transition-all duration-200" :class="page === store.pagination.page
          ? 'btn-primary text-white shadow-lg'
          : 'btn-ghost text-base-content/80 hover:bg-white/10 hover:text-white'">
        {{ page }}
      </button>
    </div>

    <button class="btn btn-outline btn-sm min-w-24" :disabled="!store.pagination.has_next" @click="store.next()">
      Next
    </button>
  </div>

  <p class="mt-4 text-center text-sm text-base-content/70">
    Page {{ store.pagination.page }}
    of {{ store.pagination.total_pages }}
    • {{ store.pagination.total_items }} products
  </p>
</template>
