export interface Product {
  id: number
  uniq_id: string
  created_at?: string
  crawl_timestamp?: string
  product_url: string
  product_name: string
  retail_price: number
  discount: number
  image_urls: string
  description: string
  category: string
  sub_category: string
  rating: number
  brand: string
}
