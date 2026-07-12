<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Admin · Inventory" :title="`Inventory for product #${productId}`"
      description="Reserve, release, adjust, and restock this product's inventory.">
      <template #action>
        <router-link class="btn btn-outline btn-sm" to="/admin/inventory">Back to list</router-link>
      </template>
    </PageHeader>

    <SkeletonTable v-if="inventoryStore.loading && !inventoryStore.selected" :rows="4" />

    <ErrorState v-else-if="inventoryStore.error && !inventoryStore.selected" :message="inventoryStore.error"
      :on-retry="load" />

    <template v-else-if="record">
      <div class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
        <div class="card-body grid gap-4 md:grid-cols-4">
          <div><p class="text-xs uppercase text-base-content/60">SKU</p><p class="font-semibold text-white">{{
            record.sku }}</p></div>
          <div><p class="text-xs uppercase text-base-content/60">Warehouse</p><p class="font-semibold text-white">{{
            record.warehouse_location }}</p></div>
          <div><p class="text-xs uppercase text-base-content/60">Available</p><p
              class="font-semibold text-white">{{ record.available_quantity }}</p></div>
          <div><p class="text-xs uppercase text-base-content/60">Status</p><span class="badge"
              :class="statusClass(record.status)">{{ record.status ?? 'UNKNOWN' }}</span></div>
        </div>
      </div>

      <div class="grid gap-6 md:grid-cols-2">
        <section class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div class="card-body space-y-3">
            <h2 class="text-lg font-semibold text-white">Update thresholds</h2>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Reorder threshold</span>
              <input v-model.number="updateForm.reorder_threshold" type="number" min="0"
                class="input input-bordered input-sm" />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Safety stock</span>
              <input v-model.number="updateForm.safety_stock" type="number" min="0"
                class="input input-bordered input-sm" />
            </label>
            <button class="btn btn-primary btn-sm" :disabled="inventoryStore.mutating" @click="onUpdate">
              Save
            </button>
          </div>
        </section>

        <section class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div class="card-body space-y-3">
            <h2 class="text-lg font-semibold text-white">Restock</h2>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Quantity to add</span>
              <input v-model.number="restockForm.quantity" type="number" min="1"
                class="input input-bordered input-sm" />
            </label>
            <button class="btn btn-primary btn-sm" :disabled="inventoryStore.mutating" @click="onRestock">
              Restock
            </button>
          </div>
        </section>

        <section class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div class="card-body space-y-3">
            <h2 class="text-lg font-semibold text-white">Adjust stock</h2>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Delta (use negative to subtract)</span>
              <input v-model.number="adjustForm.delta" type="number" class="input input-bordered input-sm" />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Reason</span>
              <input v-model="adjustForm.reason" class="input input-bordered input-sm" placeholder="e.g. stocktake correction" />
            </label>
            <button class="btn btn-primary btn-sm" :disabled="inventoryStore.mutating" @click="onAdjust">
              Apply adjustment
            </button>
          </div>
        </section>

        <section class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
          <div class="card-body space-y-3">
            <h2 class="text-lg font-semibold text-white">Reserve / release</h2>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Order ID</span>
              <input v-model="reserveForm.order_id" class="input input-bordered input-sm" placeholder="order-123" />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Quantity to reserve</span>
              <input v-model.number="reserveForm.quantity" type="number" min="1"
                class="input input-bordered input-sm" />
            </label>
            <div class="flex gap-2">
              <button class="btn btn-primary btn-sm" :disabled="inventoryStore.mutating" @click="onReserve">
                Reserve
              </button>
              <button class="btn btn-outline btn-sm" :disabled="inventoryStore.mutating" @click="onRelease">
                Release
              </button>
            </div>
          </div>
        </section>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useEcommerceStore } from '@/stores/ecommerce'
import PageHeader from '@/components/PageHeader.vue'
import ErrorState from '@/components/ErrorState.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import type { InventoryStatus } from '@/interfaces/inventory'

const route = useRoute()
const inventoryStore = useInventoryStore()
const ecommerceStore = useEcommerceStore()

const productId = computed(() => Number(route.params.productId))
const record = computed(() => inventoryStore.selected)

const updateForm = reactive({ reorder_threshold: 0, safety_stock: 0 })
const restockForm = reactive({ quantity: 1 })
const adjustForm = reactive({ delta: 0, reason: '' })
const reserveForm = reactive({ order_id: '', quantity: 1 })

function statusClass(status?: InventoryStatus) {
  if (status === 'OUT_OF_STOCK') return 'badge-error'
  if (status === 'LOW_STOCK') return 'badge-warning'
  return 'badge-success'
}

async function load() {
  try {
    const data = await inventoryStore.fetchByProduct(productId.value)
    updateForm.reorder_threshold = data.reorder_threshold
    updateForm.safety_stock = data.safety_stock
  } catch {
    // surfaced via inventoryStore.error
  }
}

async function onUpdate() {
  if (!record.value) return
  try {
    await inventoryStore.updateInventory(productId.value, {
      reorder_threshold: updateForm.reorder_threshold,
      safety_stock: updateForm.safety_stock,
      version: record.value.version,
    })
    ecommerceStore.showToast('Inventory thresholds updated.', 'success')
  } catch {
    ecommerceStore.showToast(inventoryStore.error ?? 'Failed to update inventory.', 'error')
  }
}

async function onRestock() {
  try {
    await inventoryStore.restockProduct(productId.value, { quantity: restockForm.quantity })
    ecommerceStore.showToast(`Restocked ${restockForm.quantity} units.`, 'success')
  } catch {
    ecommerceStore.showToast(inventoryStore.error ?? 'Failed to restock.', 'error')
  }
}

async function onAdjust() {
  if (!adjustForm.reason.trim()) {
    ecommerceStore.showToast('Provide a reason for the adjustment.', 'warning')
    return
  }
  try {
    await inventoryStore.adjustStock(productId.value, { ...adjustForm })
    ecommerceStore.showToast('Stock adjusted.', 'success')
    adjustForm.delta = 0
    adjustForm.reason = ''
  } catch {
    ecommerceStore.showToast(inventoryStore.error ?? 'Failed to adjust stock.', 'error')
  }
}

async function onReserve() {
  if (!reserveForm.order_id.trim()) {
    ecommerceStore.showToast('Provide an order ID.', 'warning')
    return
  }
  try {
    await inventoryStore.reserveStock(productId.value, { ...reserveForm })
    ecommerceStore.showToast(`Reserved ${reserveForm.quantity} units for ${reserveForm.order_id}.`, 'success')
  } catch {
    ecommerceStore.showToast(inventoryStore.error ?? 'Failed to reserve stock.', 'error')
  }
}

async function onRelease() {
  if (!reserveForm.order_id.trim()) {
    ecommerceStore.showToast('Provide an order ID.', 'warning')
    return
  }
  try {
    await inventoryStore.releaseStock(productId.value, { order_id: reserveForm.order_id })
    ecommerceStore.showToast(`Released reservation for ${reserveForm.order_id}.`, 'success')
  } catch {
    ecommerceStore.showToast(inventoryStore.error ?? 'Failed to release stock.', 'error')
  }
}

onMounted(load)
</script>
