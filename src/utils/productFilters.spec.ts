import { describe, expect, it } from 'vitest'
import { filterAndSortProducts } from './productFilters'
import type { Product } from '@/interfaces/product'

const products: Product[] = [
  {
    id: 1,
    uniq_id: '1',
    crawl_timestamp: '2024-01-01',
    product_url: 'https://example.com/1',
    title: 'Wireless Headphones',
    retail_price: 120,
    discount: 10,
    image_urls: '[]',
    description: 'Noise cancelling headphones',
    category: 'Audio',
    sub_category: 'Headphones',
    rating: 4.8,
    brand: 'SoundMax',
  },
  {
    id: 2,
    uniq_id: '2',
    crawl_timestamp: '2024-01-01',
    product_url: 'https://example.com/2',
    title: 'Smart Watch',
    retail_price: 200,
    discount: 15,
    image_urls: '[]',
    description: 'Water resistant smartwatch',
    category: 'Wearables',
    sub_category: 'Watch',
    rating: 4.5,
    brand: 'FitPro',
  },
  {
    id: 3,
    uniq_id: '3',
    crawl_timestamp: '2024-01-01',
    product_url: 'https://example.com/3',
    title: 'Audio Speaker',
    retail_price: 80,
    discount: 5,
    image_urls: '[]',
    description: 'Portable speaker',
    category: 'Audio',
    sub_category: 'Speakers',
    rating: 4.1,
    brand: 'SoundMax',
  },
]

describe('filterAndSortProducts', () => {
  it('filters by search term and category and sorts by price', () => {
    const result = filterAndSortProducts(products, {
      search: 'audio',
      category: 'Audio',
      brand: '',
      maxPrice: 100,
      sortBy: 'price-low',
    })

    expect(result).toHaveLength(1)
    expect(result[0]?.id).toBe(3)
  })
})
