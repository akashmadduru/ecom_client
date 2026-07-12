<template>
  <div class="space-y-6">
    <PageHeader eyebrow="Admin · New inventory record" title="Create inventory record"
      description="Register stock tracking for a product." />

    <div class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <div class="card-body">
        <form class="space-y-4" @submit.prevent="onSubmit" novalidate>
          <div v-if="formError.formError.value"
            class="rounded-2xl border border-error/30 bg-error/10 p-3 text-sm text-error-content">
            {{ formError.formError.value }}
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Product ID</span>
              <input v-model.number="form.product_id" type="number" min="1" class="input input-bordered" required
                :class="{ 'input-error': formError.fieldError('product_id') }" />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">SKU</span>
              <input v-model="form.sku" class="input input-bordered" required />
            </label>
          </div>

          <label class="form-control flex flex-col gap-1">
            <span class="label-text">Warehouse location</span>
            <input v-model="form.warehouse_location" class="input input-bordered" required />
          </label>

          <div class="grid gap-4 md:grid-cols-3">
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Available quantity</span>
              <input v-model.number="form.available_quantity" type="number" min="0" class="input input-bordered"
                required />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Safety stock</span>
              <input v-model.number="form.safety_stock" type="number" min="0" class="input input-bordered"
                required />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Reorder threshold</span>
              <input v-model.number="form.reorder_threshold" type="number" min="0" class="input input-bordered"
                required />
            </label>
          </div>

          <div class="flex gap-3">
            <button :class="['btn btn-primary', { 'opacity-70': submitting }]" type="submit" :disabled="submitting">
              {{ submitting ? 'Creating...' : 'Create record' }}
            </button>
            <router-link class="btn btn-outline" to="/admin/inventory">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useInventoryStore } from '@/stores/inventory'
import { useEcommerceStore } from '@/stores/ecommerce'
import { useFormErrors } from '@/composables/useFormErrors'
import PageHeader from '@/components/PageHeader.vue'
import type { CreateInventoryPayload } from '@/interfaces/inventory'

const router = useRouter()
const inventoryStore = useInventoryStore()
const ecommerceStore = useEcommerceStore()
const formError = useFormErrors()
const submitting = ref(false)

const form = reactive<CreateInventoryPayload>({
  product_id: 0,
  sku: '',
  warehouse_location: 'DEFAULT',
  available_quantity: 0,
  safety_stock: 0,
  reorder_threshold: 0,
})

async function onSubmit() {
  formError.clear()
  submitting.value = true
  try {
    await inventoryStore.createInventory(form)
    ecommerceStore.showToast(`Inventory created for product #${form.product_id}.`, 'success')
    router.push('/admin/inventory')
  } catch (err) {
    const apiError = formError.setFromError(err)
    ecommerceStore.showToast(apiError.message, 'error', 'Create failed')
  } finally {
    submitting.value = false
  }
}
</script>
