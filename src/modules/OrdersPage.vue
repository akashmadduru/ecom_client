<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto max-w-6xl space-y-6">
      <PageHeader eyebrow="Orders" title="Recent purchases"
        description="Every order is tracked in one place with a more detailed snapshot of your latest activity.">
        <template #action>
          <router-link class="btn btn-outline btn-sm" to="/products">Continue shopping</router-link>
        </template>
      </PageHeader>

      <div v-if="ecommerceStore.orders.length"
        class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <table class="table">
          <thead>
            <tr>
              <th>Order</th>
              <th>Date</th>
              <th>Status</th>
              <th>Items</th>
              <th>Total</th>
              <th>Tracking</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in ecommerceStore.orders" :key="order.id">
              <td class="font-semibold text-white">{{ order.id }}</td>
              <td>{{ order.date }}</td>
              <td>
                <span class="badge" :class="order.status === 'Delivered' ? 'badge-success' : 'badge-warning'">{{
                  order.status
                  }}</span>
              </td>
              <td>{{ order.items }}</td>
              <td>₹{{ order.total }}</td>
              <td>{{ order.tracking }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else
        class="rounded-[1.6rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
        <h2 class="text-2xl font-semibold text-white">No orders yet</h2>
        <p class="mt-2 text-base-content/70">Your completed purchases will appear here once you place an order.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import PageHeader from '@/components/PageHeader.vue'
import { useEcommerceStore } from '@/stores/ecommerce'

const ecommerceStore = useEcommerceStore()

onMounted(async () => {
  await ecommerceStore.loadInitialData()
})
</script>
