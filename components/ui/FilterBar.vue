<script setup lang="ts">
/**
 * FilterBar - Terminal-style category filter component
 * Usage: <FilterBar :categories="['Vue', 'React']" v-model="selectedCategory" />
 */
interface Props {
  categories: string[]
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const selectCategory = (category: string) => {
  emit('update:modelValue', category === props.modelValue ? '' : category)
}
</script>

<template>
  <div class="filter-bar">
    <div class="filter-header">
      <span class="filter-prompt">$</span>
      <span class="filter-cmd">ls</span>
      <span class="filter-arg">./categories/</span>
    </div>

    <div class="filter-tags">
      <button
        class="filter-tag"
        :class="{ active: !modelValue }"
        @click="selectCategory('')"
      >
        <span class="tag-prefix">*</span>
        <span class="tag-name">全部</span>
      </button>

      <button
        v-for="category in categories"
        :key="category"
        class="filter-tag"
        :class="{ active: modelValue === category }"
        @click="selectCategory(category)"
      >
        <span class="tag-prefix">-</span>
        <span class="tag-name">{{ category }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.filter-bar {
  margin-bottom: 24px;
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
}

.filter-header {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.filter-prompt {
  color: var(--text-muted);
}

.filter-cmd {
  color: var(--syntax-keyword);
}

.filter-arg {
  color: var(--syntax-string);
}

.filter-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid transparent;
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-tag:hover {
  border-color: var(--primary);
  color: var(--text-primary);
}

.filter-tag.active {
  background-color: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.tag-prefix {
  color: var(--text-muted);
}

.filter-tag.active .tag-prefix {
  color: var(--primary);
}

/* Dark mode */
:root.dark .filter-tag.active {
  background-color: var(--bg-tertiary);
}
</style>
