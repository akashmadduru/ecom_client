<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Admin · Inventory" title="Bulk update reorder thresholds"
      description="Update reorder thresholds for multiple products in one request." />

    <div class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <div class="card-body space-y-4">
        <div v-if="formError.formError.value"
          class="rounded-2xl border border-error/30 bg-error/10 p-3 text-sm text-error-content">
          {{ formError.formError.value }}
        </div>

        <div v-for="(item, index) in items" :key="index" class="flex flex-wrap items-end gap-3">
          <label class="form-control flex flex-col gap-1">
            <span class="label-text">Product ID</span>
            <input v-model.number="item.product_id" type="number" min="1" class="input input-bordered input-sm" />
          </label>
          <label class="form-control flex flex-col gap-1">
            <span class="label-text">Reorder threshold</span>
            <input v-model.number="item.reorder_threshold" type="number" min="0"
              class="input input-bordered input-sm" />
          </label>
          <button class="btn btn-ghost btn-sm text-error" :disabled="items.length === 1"
            @click="items.splice(index, 1)">Remove</button>
        </div>

        <button class="btn btn-outline btn-sm" @click="items.push({ product_id: 0, reorder_threshold: 0 })">
          + Add row
        </button>

        <div class="flex gap-3 pt-2">
          <button :class="['btn btn-primary', { 'opacity-70': submitting }]" :disabled="submitting"
            @click="onSubmit">
            {{ submitting ? 'Applying...' : 'Apply bulk update' }}
          </button>
          <router-link class="btn btn-outline" to="/admin/inventory">Back to inventory</router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useInventoryStore } from '@/stores/inventory'
import { useEcommerceStore } from '@/stores/ecommerce'
import { useFormErrors } from '@/composables/useFormErrors'
import PageHeader from '@/components/PageHeader.vue'
import type { BulkUpdateItem } from '@/interfaces/inventory'

const inventoryStore = useInventoryStore()
const ecommerceStore = useEcommerceStore()
const formError = useFormErrors()
const submitting = ref(false)

const items = reactive<BulkUpdateItem[]>([{ product_id: 0, reorder_threshold: 0 }])

async function onSubmit() {
  formError.clear()
  const validItems = items.filter((item) => item.product_id > 0)
  if (!validItems.length) {
    ecommerceStore.showToast('Add at least one valid product ID.', 'warning')
    return
  }

  submitting.value = true
  try {
    await inventoryStore.bulkUpdate({ items: validItems })
    ecommerceStore.showToast(`Updated ${validItems.length} inventory record(s).`, 'success')
  } catch (err) {
    const apiError = formError.setFromError(err)
    ecommerceStore.showToast(apiError.message, 'error', 'Bulk update failed')
  } finally {
    submitting.value = false
  }
}
</script>
