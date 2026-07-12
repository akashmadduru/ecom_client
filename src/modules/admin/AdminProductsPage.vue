<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Admin · Products" title="Product catalog"
      description="Create, edit, delete, or seed demo products.">
      <template #action>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" :disabled="productStore.mutating" @click="onSeed">
            {{ productStore.mutating ? 'Seeding...' : 'Seed products' }}
          </button>
          <router-link class="btn btn-primary btn-sm" to="/admin/products/new">New product</router-link>
        </div>
      </template>
    </PageHeader>

    <SkeletonTable v-if="productStore.loading && !productStore.products.length" :rows="6" />

    <ErrorState v-else-if="productStore.error" :message="productStore.error"
      :on-retry="() => productStore.fetchProducts()" />

    <EmptyState v-else-if="!productStore.products.length" title="No products yet"
      description="Create a product or seed demo data to get started." />

    <div v-else class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <table class="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Brand</th>
            <th>Price</th>
            <th>Discount</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in productStore.products" :key="product.id">
            <td class="font-semibold text-white">{{ product.product_name }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.brand }}</td>
            <td>₹{{ product.retail_price }}</td>
            <td>{{ product.discount }}%</td>
            <td class="text-right">
              <div class="flex justify-end gap-2">
                <router-link class="btn btn-ghost btn-xs" :to="`/admin/products/${product.id}/edit`">Edit</router-link>
                <button class="btn btn-ghost btn-xs text-error" :disabled="productStore.mutating"
                  @click="onDelete(product.id, product.product_name)">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="productStore.products.length" class="flex flex-wrap items-center justify-between gap-3">
      <button class="btn btn-outline btn-sm" :disabled="!productStore.pagination.has_previous"
        @click="productStore.previous()">Previous</button>
      <p class="text-sm text-base-content/70">Page {{ productStore.pagination.page }} of {{
        productStore.pagination.total_pages }}</p>
      <button class="btn btn-outline btn-sm" :disabled="!productStore.pagination.has_next"
        @click="productStore.next()">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import { useEcommerceStore } from '@/stores/ecommerce'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'

const productStore = useProductStore()
const ecommerceStore = useEcommerceStore()

async function onDelete(id: number, name: string) {
  if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
  try {
    await productStore.deleteProduct(id)
    ecommerceStore.showToast(`Deleted ${name}.`, 'success')
  } catch {
    ecommerceStore.showToast(productStore.error ?? 'Failed to delete product.', 'error')
  }
}

async function onSeed() {
  try {
    await productStore.seedProducts()
    ecommerceStore.showToast('Demo products seeded.', 'success')
  } catch {
    ecommerceStore.showToast(productStore.error ?? 'Failed to seed products.', 'error')
  }
}

onMounted(() => {
  productStore.fetchProducts(1)
})
</script>
