<template>
  <div class="space-y-3">
    <div
      v-for="n in rows"
      :key="n"
      class="h-12 animate-pulse rounded-xl border border-white/10 bg-white/5"
    />
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ rows?: number }>(), { rows: 6 })
</script>
