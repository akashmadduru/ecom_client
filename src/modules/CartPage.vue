<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto max-w-6xl space-y-6">
      <PageHeader eyebrow="Cart" title="Your selected items"
        description="Review your picks, adjust quantities, and proceed to checkout with confidence.">
        <template #action>
          <router-link class="btn btn-outline btn-sm" to="/products">Browse more</router-link>
        </template>
      </PageHeader>

      <div v-if="ecommerceStore.cart.length" class="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div class="space-y-4">
          <div v-for="item in ecommerceStore.cart" :key="item.id"
            class="card card-side border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
            <figure class="w-32 p-3">
              <img :src="parseImage(item.image_urls)" alt="" class="h-24 w-24 rounded-[1rem] object-cover" />
            </figure>
            <div class="card-body flex-row items-center justify-between gap-4">
              <div>
                <h2 class="card-title text-white">{{ item.product_name }}</h2>
                <p class="text-sm text-base-content/70">{{ item.brand }} • {{ item.category }}</p>
                <div class="mt-2 flex items-center gap-2">
                  <button class="btn btn-ghost btn-xs"
                    @click="ecommerceStore.updateQuantity(item.id, item.quantity - 1)">−</button>
                  <span class="min-w-6 text-center text-sm">{{ item.quantity }}</span>
                  <button class="btn btn-ghost btn-xs"
                    @click="ecommerceStore.updateQuantity(item.id, item.quantity + 1)">+</button>
                </div>
              </div>
              <div class="text-right">
                <p class="font-semibold text-white">₹{{ item.retail_price * item.quantity }}</p>
                <button class="btn btn-ghost btn-sm" @click="ecommerceStore.removeFromCart(item.id)">Remove</button>
              </div>
            </div>
          </div>
        </div>

        <div class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div class="card-body space-y-4">
            <h2 class="text-xl font-semibold text-white">Order summary</h2>
            <div class="flex justify-between text-sm"><span>Subtotal</span><span>₹{{ ecommerceStore.subtotal }}</span>
            </div>
            <div class="flex justify-between text-sm"><span>Shipping</span><span>₹{{ ecommerceStore.shipping }}</span>
            </div>
            <div class="flex justify-between text-sm"><span>Tax</span><span>₹{{ ecommerceStore.tax }}</span></div>
            <div class="divider my-0"></div>
            <div class="flex justify-between text-lg font-semibold text-white"><span>Total</span><span>₹{{
                ecommerceStore.total }}</span></div>
            <router-link class="btn btn-primary" to="/checkout">Proceed to checkout</router-link>
          </div>
        </div>
      </div>

      <div v-else
        class="rounded-[1.6rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <h2 class="text-2xl font-semibold text-white">Your cart is empty</h2>
        <p class="mt-2 text-base-content/70">Pick a few favorites and come back here to check out.</p>
        <router-link class="btn btn-primary mt-6" to="/products">Start shopping</router-link>
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

onMounted(async () => {
  await ecommerceStore.loadInitialData()
})
</script>
