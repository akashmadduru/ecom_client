<template>
  <div class="rounded-[1.6rem] border border-error/30 bg-error/10 p-10 text-center shadow-2xl backdrop-blur-xl">
    <h2 class="text-2xl font-semibold text-white">{{ title }}</h2>
    <p class="mt-2 text-base-content/70">{{ message }}</p>
    <button v-if="onRetry" class="btn btn-outline mt-6" @click="onRetry">Try again</button>
  </div>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    title?: string
    message: string
    onRetry?: () => void
  }>(),
  { title: 'Something went wrong' },
)
</script>
