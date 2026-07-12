import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { Product } from '@/interfaces/product'
import type { Pagination } from '@/interfaces/pagination'
import { getProduct, getProducts } from '@/api/ProductsApi'

export const useProductStore = defineStore('products', () => {
  const products = ref<Product[]>([])
  const selectedProduct = ref<Product>()
  const selectedProductImageList = ref<string[]>([])

  const loading = ref(false)

  const pagination = ref<Pagination>({
    page: 1,
    page_size: 10,
    total_items: 0,
    total_pages: 1,
    has_previous: false,
    has_next: false,
    previous_page: null,
    next_page: null,
  })

  async function fetchProduct(id: number) {
    loading.value = true
    try {
      const response = await getProduct(id)
      selectedProduct.value = response
      try {
        selectedProductImageList.value = JSON.parse(response.image_urls)
      } catch (e) {
        console.log(e)
      }
    } finally {
      loading.value = false
    }
  }

  async function fetchProducts(page = pagination.value.page) {
    loading.value = true
    try {
      const response = await getProducts(page, pagination.value.page_size)
      products.value = response.products
      pagination.value = response.pagination
    } finally {
      loading.value = false
    }
  }

  function next() {
    if (pagination.value.has_next && pagination.value.next_page) {
      fetchProducts(pagination.value.next_page)
    }
  }

  function previous() {
    if (pagination.value.has_previous && pagination.value.previous_page) {
      fetchProducts(pagination.value.previous_page)
    }
  }

  function goTo(page: number) {
    if (page >= 1 && page <= pagination.value.total_pages && page !== pagination.value.page) {
      fetchProducts(page)
    }
  }

  function setPageSize(size: number) {
    pagination.value.page_size = size
    fetchProducts(1)
  }

  function refresh() {
    fetchProducts()
  }

  return {
    products,
    loading,
    pagination,
    selectedProduct,
    selectedProductImageList,
    fetchProduct,
    fetchProducts,
    next,
    previous,
    goTo,
    refresh,
    setPageSize,
  }
})
