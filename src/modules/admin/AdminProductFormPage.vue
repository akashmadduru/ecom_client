<template>
  <div class="space-y-6">
    <PageHeader :eyebrow="isEdit ? 'Admin · Edit product' : 'Admin · New product'"
      :title="isEdit ? 'Edit product' : 'Create a new product'"
      description="Fields marked required must be filled before saving." />

    <div class="card border border-white/10 bg-white/5 shadow-2xl backdrop-blur-xl">
      <div class="card-body">
        <SkeletonTable v-if="loadingExisting" :rows="6" />

        <form v-else class="space-y-4" @submit.prevent="onSubmit" novalidate>
          <div v-if="formError.formError.value"
            class="rounded-2xl border border-error/30 bg-error/10 p-3 text-sm text-error-content">
            {{ formError.formError.value }}
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Product name</span>
              <input v-model="form.product_name" class="input input-bordered" required
                :class="{ 'input-error': formError.fieldError('product_name') }" />
              <span v-if="formError.fieldError('product_name')" class="text-xs text-error">{{
                formError.fieldError('product_name') }}</span>
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Brand</span>
              <input v-model="form.brand" class="input input-bordered" required
                :class="{ 'input-error': formError.fieldError('brand') }" />
            </label>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Category</span>
              <input v-model="form.category" class="input input-bordered" required />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Sub-category</span>
              <input v-model="form.sub_category" class="input input-bordered" required />
            </label>
          </div>

          <div class="grid gap-4 md:grid-cols-2">
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Retail price</span>
              <input v-model.number="form.retail_price" type="number" min="0" step="0.01"
                class="input input-bordered" required
                :class="{ 'input-error': formError.fieldError('retail_price') }" />
            </label>
            <label class="form-control flex flex-col gap-1">
              <span class="label-text">Discount (%)</span>
              <input v-model.number="form.discount" type="number" min="0" max="100" step="0.01"
                class="input input-bordered" required />
            </label>
          </div>

          <label class="form-control flex flex-col gap-1">
            <span class="label-text">Description</span>
            <textarea v-model="form.description" class="textarea textarea-bordered" rows="4" required />
          </label>

          <div class="flex gap-3">
            <button :class="['btn btn-primary', { 'opacity-70': submitting }]" type="submit"
              :disabled="submitting">
              {{ submitting ? 'Saving...' : isEdit ? 'Save changes' : 'Create product' }}
            </button>
            <router-link class="btn btn-outline" to="/admin/products">Cancel</router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useProductStore } from '@/stores/product'
import { useEcommerceStore } from '@/stores/ecommerce'
import { useFormErrors } from '@/composables/useFormErrors'
import PageHeader from '@/components/PageHeader.vue'
import SkeletonTable from '@/components/SkeletonTable.vue'
import type { CreateProductPayload } from '@/interfaces/product'

const route = useRoute()
const router = useRouter()
const productStore = useProductStore()
const ecommerceStore = useEcommerceStore()
const formError = useFormErrors()

const productId = computed(() => (route.params.id ? Number(route.params.id) : null))
const isEdit = computed(() => productId.value !== null)
const loadingExisting = ref(false)
const submitting = ref(false)

const form = reactive<CreateProductPayload>({
  product_name: '',
  retail_price: 0,
  discount: 0,
  category: '',
  sub_category: '',
  brand: '',
  description: '',
})

async function onSubmit() {
  formError.clear()
  submitting.value = true
  try {
    if (isEdit.value && productId.value !== null) {
      await productStore.updateProduct(productId.value, form)
      ecommerceStore.showToast(`Updated ${form.product_name}.`, 'success')
    } else {
      await productStore.createProduct(form)
      ecommerceStore.showToast(`Created ${form.product_name}.`, 'success')
    }
    router.push('/admin/products')
  } catch (err) {
    const apiError = formError.setFromError(err)
    ecommerceStore.showToast(apiError.message, 'error', 'Save failed')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  if (!isEdit.value || productId.value === null) return

  loadingExisting.value = true
  try {
    await productStore.fetchProduct(productId.value)
    const existing = productStore.selectedProduct
    if (existing) {
      form.product_name = existing.product_name
      form.retail_price = existing.retail_price
      form.discount = existing.discount
      form.category = existing.category
      form.sub_category = existing.sub_category
      form.brand = existing.brand
      form.description = existing.description
    }
  } catch {
    ecommerceStore.showToast('Failed to load product.', 'error')
  } finally {
    loadingExisting.value = false
  }
})
</script>
