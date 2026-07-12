<template>
  <div class="rounded-[1.6rem] border border-white/10 bg-white/5 p-10 text-center shadow-2xl backdrop-blur-xl">
    <h2 class="text-2xl font-semibold text-white">{{ title }}</h2>
    <p class="mt-2 text-base-content/70">{{ description }}</p>
    <router-link v-if="actionTo && actionText" class="btn btn-primary mt-6" :to="actionTo">
      {{ actionText }}
    </router-link>
    <slot name="action" />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  actionText?: string
  actionTo?: string
}>()
</script>
