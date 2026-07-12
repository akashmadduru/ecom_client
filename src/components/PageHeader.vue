<template>
    <section class="rounded-[1.6rem] border border-white/10 bg-white/5 p-6 shadow-2xl backdrop-blur-xl">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div class="space-y-2">
                <div
                    class="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-200">
                    <span class="text-sm">✦</span>
                    <span>{{ eyebrow }}</span>
                </div>
                <div>
                    <h1 class="text-3xl font-semibold text-white">{{ title }}</h1>
                    <p v-if="description" class="mt-2 max-w-2xl text-sm text-base-content/70">{{ description }}</p>
                </div>
            </div>
            <div v-if="$slots.action" class="flex items-center">
                <slot name="action" />
            </div>
        </div>
    </section>
</template>

<script setup lang="ts">
defineProps<{
    eyebrow: string
    title: string
    description?: string
}>()
</script>
