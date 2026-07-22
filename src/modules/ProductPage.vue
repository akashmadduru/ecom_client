<template>
  <div v-if="productStore.selectedProduct" class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1fr_1fr]">
      <div class="space-y-4">
        <div class="card bg-base-100 shadow-xl">
          <figure class="p-4">
            <AppImage :src="images[activeImage]" alt="" :raw="false" img-class="h-80 w-full rounded-xl object-cover" />
          </figure>
        </div>
        <div class="flex flex-wrap gap-3">
          <button v-for="(image, index) in images" :key="image" class="h-20 w-20 overflow-hidden rounded-lg border-2"
            :class="activeImage === index ? 'border-primary' : 'border-transparent'" @click="activeImage = index">
            <AppImage :src="image" alt="" :raw="false" img-class="h-full w-full object-cover" />
          </button>
        </div>
      </div>

      <div class="card bg-base-100 shadow-xl">
        <div class="card-body space-y-4">
          <div class="space-y-2">
            <p class="text-sm uppercase tracking-[0.3em] text-primary">{{ productStore.selectedProduct.category }}</p>
            <h1 class="text-3xl font-semibold">{{ productStore.selectedProduct.title.substring(0, 30) }}</h1>
            <p class="text-sm text-base-content/70">{{ productStore.selectedProduct.description }}</p>
          </div>

          <div class="flex items-center gap-3">
            <span class="text-3xl font-semibold">₹{{ productStore.selectedProduct.retail_price }}</span>
            <span class="badge badge-success">{{ productStore.selectedProduct.discount }}% off</span>
          </div>

          <div class="flex items-center gap-2 text-sm text-base-content/70">
            <span class="badge badge-outline">⭐ {{ productStore.selectedProduct.rating }}</span>
            <span>Brand: {{ productStore.selectedProduct.brand }}</span>
            <span v-if="stockBadge" class="badge" :class="stockBadge.class">{{ stockBadge.label }}</span>
          </div>

          <div class="space-y-2 rounded-lg bg-base-200 p-4">
            <p class="font-semibold">Why you’ll love it</p>
            <ul class="list-disc space-y-1 pl-5 text-sm text-base-content/70">
              <li>Ready for everyday use and travel</li>
              <li>Comfortable design with premium finish</li>
              <li>Backed by a simple mock checkout flow</li>
            </ul>
          </div>

          <div class="flex flex-wrap gap-3">
            <button class="btn btn-primary" @click="addToCart" :class="{ 'opacity-70': isProcessing }">{{ isProcessing ?
              'Adding...' : 'Add to cart' }}</button>
            <button class="btn btn-outline" @click="toggleWishlist">{{ isWishlisted ? 'Saved' : 'Save wishlist'
            }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useEcommerceStore } from '@/stores/ecommerce'
import { useInventoryStore } from '@/stores/inventory'
import AppImage from '@/components/AppImage.vue'
import { resolveImageUrls } from '@/utils/image'

const route = useRoute()
const productStore = useProductStore()
const ecommerceStore = useEcommerceStore()
const inventoryStore = useInventoryStore()
const activeImage = ref(0)

const stockBadge = computed(() => {
  const record = inventoryStore.selected
  if (!record) return null
  if (record.available_quantity <= 0) return { label: 'Out of stock', class: 'badge-error' }
  if (record.status === 'LOW_STOCK') return { label: `Only ${record.available_quantity} left`, class: 'badge-warning' }
  return { label: 'In stock', class: 'badge-success' }
})

const images = computed(() => resolveImageUrls(productStore.selectedProduct?.image_urls))

const isProcessing = computed(() => {
  const id = productStore.selectedProduct?.id
  return id ? ecommerceStore.isProcessing['p' + id] === true : false
})

const isWishlisted = computed(() => {
  const id = productStore.selectedProduct?.id
  return id ? ecommerceStore.wishlist.some((w) => w.id === id) : false
})

function addToCart() {
  const p = productStore.selectedProduct
  if (!p) return
  ecommerceStore.isProcessing['p' + p.id] = true
  try {
    ecommerceStore.addToCart(p)
  } finally {
    setTimeout(() => (ecommerceStore.isProcessing['p' + p.id] = false), 300)
  }
}

function toggleWishlist() {
  const p = productStore.selectedProduct
  if (!p) return
  ecommerceStore.toggleWishlist(p)
}

onMounted(() => {
  const id = Number(route.params.id)
  productStore.fetchProduct(id)
  inventoryStore.fetchByProduct(id).catch(() => {
    // stock badge is a nice-to-have; ignore if no inventory record exists yet
  })
})
</script>
