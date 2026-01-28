<script setup lang="ts">
const colorMode = useColorMode()
const { isCollapsed } = useSidebar()

const toggleTheme = () => {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    class="theme-toggle"
    :class="{ collapsed: isCollapsed }"
    :title="colorMode.value === 'dark' ? '切换到亮色模式' : '切换到暗色模式'"
    @click="toggleTheme"
  >
    <Icon
      v-if="isCollapsed"
      :name="colorMode.value === 'dark' ? 'ph:sun' : 'ph:moon'"
      size="20"
      class="theme-icon"
    />
    <template v-else>
      <span class="theme-cmd">$</span>
      <span class="theme-text">theme</span>
      <span class="theme-flag">{{ colorMode.value === 'dark' ? '--light' : '--dark' }}</span>
    </template>
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

.theme-toggle.collapsed {
  width: 100%;
  justify-content: center;
  padding: 10px 8px;
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

.theme-icon {
  color: var(--text-secondary);
}

.theme-toggle:hover .theme-icon {
  color: var(--primary);
}
</style>
