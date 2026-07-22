<template>
  <article
    class="flex flex-col gap-4 justify-between cusror-pointer card group relative h-full overflow-hidden border border-base-300 bg-base-100 shadow-sm transition-all duration-300 ease-out hover:shadow-md">
    <div
      class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100">
    </div>
    <button
      class="absolute right-4 top-4 z-20 rounded-full border border-black/10 bg-black/45 p-2 text-sm text-white transition-transform duration-300 hover:scale-105"
      @click.stop.prevent="toggleWishlist">
      {{ isWishlisted ? '♥' : '♡' }}
    </button>
    <AppImage :src="product.image_urls" alt=""
      img-class="h-44 w-full rounded-[1.1rem] rounded-b-none object-cover transition-all duration-500 ease-out group-hover:brightness-200" />
    <div class="card-body relative z-10 space-y-3">
      <div class="flex items-center justify-between gap-2">
        <span
          class="rounded-full border border-orange-400/30 bg-orange-400/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.25em] text-orange-600">{{
            product.category }}</span>
        <span class="text-xs text-base-content/70">⭐ {{ product.rating }}</span>
      </div>
      <div class="space-y-1">
        <h2 class="text-lg font-semibold">{{ product.title }}</h2>
        <p class="text-sm text-base-content/70 line-clamp-2">{{ product.description }}</p>
      </div>
      <div class="flex items-center justify-between">
        <div>
          <p class="text-xl font-semibold">₹{{ product.retail_price }}</p>
          <p class="text-xs uppercase tracking-[0.24em] text-base-content/70">{{ product.brand }}</p>
        </div>
        <button
          :class="['btn btn-primary btn-sm transition-all duration-300 hover:scale-[1.02]', { 'opacity-75': isProcessing }]"
          @click.stop.prevent="handleAddToCart">
          <span v-if="isProcessing">Adding...</span>
          <span v-else>+ Add</span>
        </button>
      </div>
      <div class="flex gap-2">
        <button class="btn btn-outline btn-sm flex-1 transition-all duration-300 hover:scale-[1.01]"
          @click.stop.prevent="viewProduct">Details</button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Product } from '@/interfaces/product'
import { useEcommerceStore } from '@/stores/ecommerce'
import AppImage from '@/components/AppImage.vue'

const props = defineProps<{ product: Product }>()
const router = useRouter()
const ecommerceStore = useEcommerceStore()

const isWishlisted = computed(() => ecommerceStore.wishlist.some((item) => item.id === props.product.id))
const isProcessing = computed(() => ecommerceStore.isProcessing['p' + props.product.id] === true)

function viewProduct() {
  router.push(`/products/${props.product.id}`)
}

function handleAddToCart() {
  // optimistic UI: mark processing, add item locally, then clear
  ecommerceStore.isProcessing['p' + props.product.id] = true
  try {
    ecommerceStore.addToCart(props.product)
  } finally {
    setTimeout(() => (ecommerceStore.isProcessing['p' + props.product.id] = false), 300)
  }
}

function toggleWishlist() {
  ecommerceStore.toggleWishlist(props.product)
}
</script>
