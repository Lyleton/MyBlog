<script setup lang="ts">
/**
 * SearchInput - Terminal-style search trigger
 * Shows keyboard shortcut hint, opens search modal on click
 */
const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<template>
  <button class="search-input" @click="handleClick">
    <span class="search-prompt">$</span>
    <span class="search-cmd">grep -r</span>
    <span class="search-placeholder">'search...'</span>
    <span class="search-shortcut">/</span>
  </button>
</template>

<style scoped>
.search-input {
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  padding: 10px 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
  text-align: left;
}

.search-input:hover {
  border-color: var(--primary);
}

.search-prompt {
  color: var(--text-muted);
}

.search-cmd {
  color: var(--syntax-keyword);
}

.search-placeholder {
  color: var(--text-muted);
  flex: 1;
}

.search-shortcut {
  padding: 2px 6px;
  background-color: var(--bg-secondary);
  border-radius: 4px;
  font-size: 0.75rem;
  color: var(--text-muted);
}
</style>
