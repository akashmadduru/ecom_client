import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../modules/HomeView.vue'

import SigninPage from '../modules/SigninPage.vue'
import SignupPage from '../modules/SignupPage.vue'
import ProductsPage from '../modules/ProductsPage.vue'
import ProductPage from '../modules/ProductPage.vue'
import OrdersPage from '../modules/OrdersPage.vue'
import CartPage from '../modules/CartPage.vue'
import WishlistPage from '../modules/WishlistPage.vue'
import AddressPage from '../modules/AddressPage.vue'
import ProfilePage from '../modules/ProfilePage.vue'
import CheckoutPage from '../modules/CheckoutPage.vue'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/products',
      name: 'products',
      component: ProductsPage,
    },
    {
      path: '/products/:id',
      name: 'product',
      component: ProductPage,
    },
    {
      path: '/signin',
      name: 'signin',
      component: SigninPage,
    },
    {
      path: '/signup',
      name: 'signup',
      component: SignupPage,
    },
    {
      path: '/orders',
      name: 'orders',
      component: OrdersPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/cart',
      name: 'cart',
      component: CartPage,
    },
    {
      path: '/profile',
      name: 'profile',
      component: ProfilePage,
      meta: { requiresAuth: true },
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/wishlist',
      name: 'wishlist',
      component: WishlistPage,
    },
    {
      path: '/address',
      name: 'address',
      component: AddressPage,
      meta: { requiresAuth: true },
    },
    {
      path: '/admin',
      component: () => import('../modules/admin/AdminLayout.vue'),
      meta: { requiresAuth: true, requiresAdmin: true },
      children: [
        {
          path: '',
          name: 'admin-dashboard',
          component: () => import('../modules/admin/AdminDashboardPage.vue'),
        },
        {
          path: 'products',
          name: 'admin-products',
          component: () => import('../modules/admin/AdminProductsPage.vue'),
        },
        {
          path: 'products/new',
          name: 'admin-product-create',
          component: () => import('../modules/admin/AdminProductFormPage.vue'),
        },
        {
          path: 'products/:id/edit',
          name: 'admin-product-edit',
          component: () => import('../modules/admin/AdminProductFormPage.vue'),
        },
        {
          path: 'inventory',
          name: 'admin-inventory',
          component: () => import('../modules/admin/AdminInventoryListPage.vue'),
        },
        {
          path: 'inventory/new',
          name: 'admin-inventory-create',
          component: () => import('../modules/admin/AdminInventoryFormPage.vue'),
        },
        {
          path: 'inventory/bulk-update',
          name: 'admin-inventory-bulk-update',
          component: () => import('../modules/admin/AdminInventoryBulkUpdatePage.vue'),
        },
        {
          path: 'inventory/health-report',
          name: 'admin-inventory-health-report',
          component: () => import('../modules/admin/AdminInventoryHealthReportPage.vue'),
        },
        {
          path: 'inventory/reports',
          name: 'admin-inventory-reports',
          component: () => import('../modules/admin/AdminInventoryStockReportsPage.vue'),
        },
        {
          path: 'inventory/:productId',
          name: 'admin-inventory-detail',
          component: () => import('../modules/admin/AdminInventoryDetailPage.vue'),
        },
        {
          path: 'diagnostics',
          name: 'admin-diagnostics',
          component: () => import('../modules/admin/AdminDiagnosticsPage.vue'),
        },
      ],
    },
  ],
})

// router.beforeEach((to) => {
//   const authStore = useAuthStore()
//   console.log(authStore.isAuthenticated, to.meta.requiesAuth)

//   const requiresAdmin = to.meta.requiresAuth;
//   console.log(requiresAdmin && !authStore.isAuthenticated)
//   console.log(requiresAdmin && !authStore.isAdmin)

//   if (requiresAdmin && !authStore.isAuthenticated) {
//     return { path: '/signin', query: { redirect: to.fullPath } }
//   }
//   if (requiresAdmin && !authStore.isAdmin) {
//     return { path: '/' }
//   }

//   return true
// })

export default router
