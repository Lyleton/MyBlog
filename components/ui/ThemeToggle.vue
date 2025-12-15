<script setup lang="ts">
const colorMode = useColorMode()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="theme-toggle"
    :title="colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggleTheme"
  >
    <span class="theme-cmd">$</span>
    <span class="theme-text">theme</span>
    <span class="theme-flag">{{ colorMode.value === 'dark' ? '--light' : '--dark' }}</span>
  </button>
</template>

<style scoped>
.theme-toggle {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.theme-toggle:hover {
  background-color: var(--bg-secondary);
  border-color: var(--primary);
}

.theme-cmd {
  color: var(--text-muted);
}

.theme-text {
  color: var(--syntax-keyword);
}

.theme-flag {
  color: var(--syntax-string);
}
</style>
