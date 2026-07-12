<template>
    <div class="toast-shell fixed bottom-6 right-6 z-[60] flex flex-col items-end gap-3">
        <transition-group name="toast" tag="div">
            <div v-for="toast in ecommerceStore.toasts" :key="toast.id"
                :class="['toast-card max-w-sm rounded-[1.1rem] border p-4 shadow-2xl backdrop-blur-xl text-left', toastStyle(toast.type)]">
                <div class="flex items-start justify-between gap-3">
                    <div class="space-y-1">
                        <p class="text-sm font-semibold text-white">{{ toast.title || capitalizeType(toast.type) }}</p>
                        <p class="text-sm text-base-content/80">{{ toast.message }}</p>
                    </div>
                    <button class="btn btn-ghost btn-xs text-base-content/70"
                        @click="ecommerceStore.removeToast(toast.id)">×</button>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<script setup lang="ts">
import { useEcommerceStore } from '@/stores/ecommerce'

const ecommerceStore = useEcommerceStore()

function toastStyle(type: 'success' | 'info' | 'warning' | 'error') {
    switch (type) {
        case 'success':
            return 'border-emerald-400/20 bg-emerald-500/10'
        case 'info':
            return 'border-sky-400/20 bg-sky-500/10'
        case 'warning':
            return 'border-amber-400/20 bg-amber-500/10'
        case 'error':
            return 'border-rose-400/20 bg-rose-500/10'
        default:
            return 'border-white/10 bg-white/10'
    }
}

function capitalizeType(value: string) {
    return value.charAt(0).toUpperCase() + value.slice(1)
}
</script>
