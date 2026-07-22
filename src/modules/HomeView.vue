<template>
  <main class="min-h-screen px-4 py-10 text-base-content">
    <section class="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div class="card shadow-sm">
        <div class="card-body space-y-4">
          <p class="text-sm uppercase tracking-[0.3em] text-primary">New season drop</p>
          <h1 class="text-4xl font-semibold">Discover thoughtfully designed essentials for everyday life.
          </h1>
          <p class="text-base text-base-content/70">Browse curated electronics, travel gear, and home pieces all in one
            modern storefront.</p>
          <div class="flex flex-wrap gap-3">
            <router-link class="btn btn-primary" to="/products">Shop now</router-link>
            <router-link class="btn btn-outline" to="/signup">Create account</router-link>
          </div>
        </div>
      </div>

      <div class="card shadow-sm">
        <div class="card-body">
          <h2 class="text-xl font-semibold">Why shoppers love Ecommerce</h2>
          <ul class="mt-4 space-y-3 text-sm text-base-content/70">
            <li>• Fast filters and side navigation for quick discovery</li>
            <li>• Clean, flat surfaces with clear visual hierarchy</li>
            <li>• Mock data pages for cart, wishlist, orders, and addresses</li>
          </ul>
        </div>
      </div>
    </section>

    <section class="mx-auto mt-10 max-w-6xl">
      <PageHeader eyebrow="Featured" title="Bestsellers for the season"
        description="Every featured pick includes quick add-to-cart actions and a premium product card experience.">
        <template #action>
          <router-link class="btn btn-ghost btn-sm" to="/products">View all</router-link>
        </template>
      </PageHeader>

      <div class="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <ProductCard v-for="product in featuredProducts" :key="product.id" :product="product" />
      </div>
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import ProductCard from '@/components/ProductCard.vue'
import PageHeader from '@/components/PageHeader.vue'

const productStore = useProductStore()

const featuredProducts = computed(() => productStore.products.slice(0, 4))

onMounted(() => {
  productStore.fetchProducts(1)
})
</script>
