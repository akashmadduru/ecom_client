<template>
  <div class="min-h-screen px-4 py-10 text-base-content">
    <div class="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside class="card shadow-sm">
        <div class="card-body space-y-6">
          <div>
            <h2 class="text-xl font-semibold">Filters</h2>
            <p class="text-sm text-base-content/70">Refine your search</p>
          </div>

          <label class="form-control">
            <span class="label-text">Search</span>
            <input v-model="ecommerceStore.filters.search" class="input input-bordered" placeholder="Search products" />
          </label>

          <label class="form-control">
            <span class="label-text">Category</span>
            <select v-model="ecommerceStore.filters.category" class="select select-bordered">
              <option value="">All categories</option>
              <option v-for="category in categories" :key="category" :value="category">{{ category }}</option>
            </select>
          </label>

          <label class="form-control">
            <span class="label-text">Brand</span>
            <select v-model="ecommerceStore.filters.brand" class="select select-bordered">
              <option value="">All brands</option>
              <option v-for="brand in brands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </label>

          <label class="form-control">
            <span class="label-text">Max price</span>
            <input v-model.number="ecommerceStore.filters.maxPrice" type="number" class="input input-bordered" />
          </label>

          <label class="form-control">
            <span class="label-text">Sort by</span>
            <select v-model="ecommerceStore.filters.sortBy" class="select select-bordered">
              <option value="featured">Featured</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
          </label>

          <button class="btn btn-outline" @click="resetFilters">Clear filters</button>
        </div>
      </aside>

      <section class="space-y-6">
        <PageHeader eyebrow="Catalog" title="Shop the latest collection"
          description="Discover products with filters, smart sorting, and quick purchase actions.">
        </PageHeader>

        <SkeletonGrid v-if="productStore.loading && !productStore.products.length" :count="6" />

        <ErrorState v-else-if="productStore.error" :message="productStore.error"
          :on-retry="() => productStore.fetchProducts()" />

        <EmptyState v-else-if="!filteredProducts.length" title="No products match your filters"
          description="Try adjusting or clearing your filters to see more results." />

        <div v-else class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <ProductCard v-for="product in filteredProducts" :key="product.id" :product="product" />
        </div>

        <PaginationComponent v-if="filteredProducts.length" :pagination="productStore.pagination" item-label="products"
          @change="productStore.goTo" />
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useProductStore } from '@/stores/product'
import PageHeader from '@/components/PageHeader.vue'
import ProductCard from '@/components/ProductCard.vue'
import PaginationComponent from '@/components/PaginationComponent.vue'
import SkeletonGrid from '@/components/SkeletonGrid.vue'
import EmptyState from '@/components/EmptyState.vue'
import ErrorState from '@/components/ErrorState.vue'
import { useEcommerceStore } from '@/stores/ecommerce'

const productStore = useProductStore()
const ecommerceStore = useEcommerceStore()

const categories = computed(() => Array.from(new Set(productStore.products.map((product) => product.category))).sort())
const brands = computed(() => Array.from(new Set(productStore.products.map((product) => product.brand))).sort())

const filteredProducts = computed(() => ecommerceStore.applyFilters(productStore.products))

function resetFilters() {
  ecommerceStore.resetFilters()
}

onMounted(() => {
  productStore.fetchProducts(1)
})
</script>
