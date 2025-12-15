<script setup lang="ts">
interface Props {
  title?: string
  subtitle?: string
  stats?: {
    label: string
    value: string | number
  }[]
}

withDefaults(defineProps<Props>(), {
  title: '',
  subtitle: '',
  stats: () => [],
})
</script>

<template>
  <div class="page-wrapper">
    <header v-if="title" class="page-header">
      <h2 class="page-title">{{ title }}</h2>
      <p v-if="subtitle" class="page-subtitle">{{ subtitle }}</p>
      <div v-if="stats.length" class="page-stats">
        <div v-for="stat in stats" :key="stat.label" class="stat-item">
          <span class="stat-key">const</span>
          <span class="stat-label">{{ stat.label }} =</span>
          <span class="stat-value">{{ stat.value }}</span>
        </div>
      </div>
    </header>
    <div class="page-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.page-wrapper {
  max-width: 900px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 48px;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.page-subtitle {
  font-size: 1.0625rem;
  color: var(--text-secondary);
  margin: 0 0 24px 0;
}

.page-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
}

.stat-item {
  display: flex;
  gap: 6px;
}

.stat-key {
  color: var(--syntax-keyword);
}

.stat-label {
  color: var(--text-secondary);
}

.stat-value {
  color: var(--primary);
  font-weight: 600;
}

.page-content {
  /* Content area */
}
</style>
