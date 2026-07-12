<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto max-w-6xl space-y-6">
      <PageHeader eyebrow="Wishlist" title="Saved for later"
        description="Keep a curated list of favorites ready for your next purchase." />

      <div v-if="ecommerceStore.wishlist.length" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <div v-for="item in ecommerceStore.wishlist" :key="item.id"
          class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <figure>
            <img :src="parseImage(item.image_urls)" alt="" class="h-48 w-full rounded-[1.1rem] object-cover" />
          </figure>
          <div class="card-body">
            <h2 class="card-title text-white">{{ item.product_name }}</h2>
            <p class="text-sm text-base-content/70">{{ item.brand }} • {{ item.category }}</p>
            <p class="text-lg font-semibold text-white">₹{{ item.retail_price }}</p>
            <div class="card-actions justify-between">
              <button class="btn btn-primary btn-sm" @click="addToCart(item)">Add to cart</button>
              <button class="btn btn-ghost btn-sm" @click="ecommerceStore.removeFromWishlist(item.id)">Remove</button>
            </div>
          </div>
        </div>
      </div>

      <div v-else
        class="rounded-[1.6rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <h2 class="text-2xl font-semibold text-white">Nothing saved yet</h2>
        <p class="mt-2 text-base-content/70">Tap the heart on any product to build your wishlist.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useEcommerceStore } from '@/stores/ecommerce'

const ecommerceStore = useEcommerceStore()

function parseImage(imageUrls: string): string {
  try {
    const urls = JSON.parse(imageUrls) as string[]
    return urls[0] ?? imageUrls
  } catch {
    return imageUrls
  }
}

function addToCart(item: { id: number; product_name: string; retail_price: number; image_urls: string; brand: string; category: string }) {
  ecommerceStore.addToCartFromItem(item)
}

onMounted(async () => {
  await ecommerceStore.loadInitialData()
})
</script>
