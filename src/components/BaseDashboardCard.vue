<script setup>
defineProps({
  tone: {
    type: String,
    default: 'default',
  },
})
</script>

<template>
  <section class="dashboard-card" :class="tone">
    <h2 v-if="$slots.header" class="dashboard-card-header"><slot name="header" /></h2>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  border-radius: 14px;
  padding: 1.2rem 1.4rem;
  margin-bottom: 1.5rem;
  background: #f5f6fa;
}

.dashboard-card.search {
  background: #f5f6fa;
}

.dashboard-card.list {
  background: #eef4ff;
}

.dashboard-card-header {
  font-size: 1.05rem;
  margin-bottom: 0.8rem;
}
</style>
