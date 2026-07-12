import type { Product } from '@/interfaces/product'

export interface ProductFilters {
  search: string
  category: string
  brand: string
  maxPrice: number | null
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating'
}

export function filterAndSortProducts(products: Product[], filters: ProductFilters): Product[] {
  const search = filters.search.trim().toLowerCase()

  const filtered = products.filter((product) => {
    const matchesSearch =
      !search ||
      product.product_name.toLowerCase().includes(search) ||
      product.description.toLowerCase().includes(search)
    const matchesCategory = !filters.category || product.category === filters.category
    const matchesBrand = !filters.brand || product.brand === filters.brand
    const matchesPrice = !filters.maxPrice || product.retail_price <= filters.maxPrice

    return matchesSearch && matchesCategory && matchesBrand && matchesPrice
  })

  switch (filters.sortBy) {
    case 'price-low':
      return [...filtered].sort((a, b) => a.retail_price - b.retail_price)
    case 'price-high':
      return [...filtered].sort((a, b) => b.retail_price - a.retail_price)
    case 'rating':
      return [...filtered].sort((a, b) => b.rating - a.rating)
    default:
      return filtered
  }
}
