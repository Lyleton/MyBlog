<script setup lang="ts">
interface Props {
  title?: string
  status?: 'ready' | 'running' | 'error'
  showButtons?: boolean
}

withDefaults(defineProps<Props>(), {
  title: 'terminal',
  status: 'ready',
  showButtons: true,
})
</script>

<template>
  <div class="terminal-window">
    <div class="terminal-header">
      <div v-if="showButtons" class="terminal-buttons">
        <span class="terminal-btn red" />
        <span class="terminal-btn yellow" />
        <span class="terminal-btn green" />
      </div>
      <span class="terminal-title">{{ title }}</span>
      <span class="terminal-status" :class="status">{{ status }}</span>
    </div>
    <div class="terminal-body">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.terminal-window {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: var(--shadow-md);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
}

.terminal-window:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-2px);
}

.terminal-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background-color: var(--bg-tertiary);
  border-bottom: 1px solid var(--border-color);
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.terminal-btn {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  transition: opacity 0.2s ease;
}

.terminal-btn:hover {
  opacity: 0.8;
}

.terminal-btn.red {
  background-color: var(--status-red);
}

.terminal-btn.yellow {
  background-color: var(--status-yellow);
}

.terminal-btn.green {
  background-color: var(--status-green);
}

.terminal-title {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.terminal-status {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 4px;
  background-color: var(--bg-primary);
}

.terminal-status.ready {
  color: var(--status-green);
}

.terminal-status.running {
  color: var(--status-yellow);
}

.terminal-status.error {
  color: var(--status-red);
}

.terminal-body {
  padding: 16px;
}
</style>
