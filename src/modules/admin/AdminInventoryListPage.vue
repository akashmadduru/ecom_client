<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Admin · Inventory" title="Inventory records"
      description="Track stock levels across warehouses.">
      <template #action>
        <router-link class="btn btn-primary btn-sm" to="/admin/inventory/new">New inventory record</router-link>
      </template>
    </PageHeader>

    <div class="flex flex-wrap items-center gap-3">
      <span class="text-sm text-base-content/70">Filter by status:</span>
      <select class="select select-bordered select-sm" :value="inventoryStore.statusFilter"
        @change="onStatusChange">
        <option value="">All</option>
        <option value="IN_STOCK">In stock</option>
        <option value="LOW_STOCK">Low stock</option>
        <option value="OUT_OF_STOCK">Out of stock</option>
      </select>
    </div>

    <SkeletonTable v-if="inventoryStore.loading && !inventoryStore.items.length" :rows="6" />

    <ErrorState v-else-if="inventoryStore.error" :message="inventoryStore.error"
      :on-retry="() => inventoryStore.fetchList()" />

    <EmptyState v-else-if="!inventoryStore.items.length" title="No inventory records"
      description="Create an inventory record for a product to start tracking stock." />

    <div v-else class="overflow-hidden rounded-[1.5rem] border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <table class="table">
        <thead>
          <tr>
            <th>Product ID</th>
            <th>SKU</th>
            <th>Warehouse</th>
            <th>Available</th>
            <th>Reorder threshold</th>
            <th>Status</th>
            <th class="text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in inventoryStore.items" :key="item.product_id">
            <td class="font-semibold text-white">{{ item.product_id }}</td>
            <td>{{ item.sku }}</td>
            <td>{{ item.warehouse_location }}</td>
            <td>{{ item.available_quantity }}</td>
            <td>{{ item.reorder_threshold }}</td>
            <td>
              <span class="badge" :class="statusClass(item.status)">{{ item.status ?? 'UNKNOWN' }}</span>
            </td>
            <td class="text-right">
              <router-link class="btn btn-ghost btn-xs" :to="`/admin/inventory/${item.product_id}`">Manage</router-link>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="inventoryStore.items.length" class="flex flex-wrap items-center justify-between gap-3">
      <button class="btn btn-outline btn-sm" :disabled="!inventoryStore.pagination.has_previous"
        @click="inventoryStore.previous()">Previous</button>
      <p class="text-sm text-base-content/70">Page {{ inventoryStore.pagination.page }} of {{
        inventoryStore.pagination.total_pages }}</p>
      <button class="btn btn-outline btn-sm" :disabled="!inventoryStore.pagination.has_next"
        @click="inventoryStore.next()">Next</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import PageHeader from '@/components/PageHeader.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import type { InventoryStatus } from '@/interfaces/inventory'

const inventoryStore = useInventoryStore()

function statusClass(status?: InventoryStatus) {
  if (status === 'OUT_OF_STOCK') return 'badge-error'
  if (status === 'LOW_STOCK') return 'badge-warning'
  return 'badge-success'
}

function onStatusChange(event: Event) {
  const value = (event.target as HTMLSelectElement).value as InventoryStatus | ''
  inventoryStore.setStatusFilter(value)
}

onMounted(() => {
  inventoryStore.fetchList(1)
})
</script>
