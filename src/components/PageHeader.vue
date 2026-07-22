<template>
    <section class="rounded-[1.6rem] border border-base-300 bg-base-100 p-6 shadow-sm">
        <div class="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div class="space-y-2">
                <div
                    class="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-orange-600">
                    <span class="text-sm">✦</span>
                    <span>{{ eyebrow }}</span>
                </div>
                <div>
                    <h1 class="text-3xl font-semibold">{{ title }}</h1>
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
