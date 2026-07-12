import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../modules/HomeView.vue'

import SigninPage from '../modules/SignInPage.vue'
import SignupPage from '../modules/SignupPage.vue'
import ProductsPage from '../modules/ProductsPage.vue'
import ProductPage from '../modules/ProductPage.vue'
import OrdersPage from '../modules/OrdersPage.vue'
import CartPage from '../modules/CartPage.vue'
import WishlistPage from '../modules/WishlistPage.vue'
import AddressPage from '../modules/AddressPage.vue'
import ProfilePage from '../modules/ProfilePage.vue'
import CheckoutPage from '../modules/CheckoutPage.vue'

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
    },
    {
      path: '/checkout',
      name: 'checkout',
      component: CheckoutPage,
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
    },
  ],
})

export default router
