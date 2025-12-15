<script setup lang="ts">
/**
 * EmptyState - Terminal-style empty state component
 * Usage: <EmptyState title="No results" message="Try different keywords" />
 */
interface Props {
  title?: string
  message?: string
  icon?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: '没有找到内容',
  message: '试试其他搜索词或筛选条件',
  icon: 'ph:file-dashed',
})
</script>

<template>
  <div class="empty-state">
    <TerminalWindow title="search.log" status="ready">
      <div class="empty-content">
        <div class="empty-icon">
          <Icon :name="icon" size="48" />
        </div>

        <div class="empty-output">
          <p class="output-line">
            <span class="output-prompt">$</span>
            <span class="output-cmd">find</span>
            <span class="output-arg">. -name "results"</span>
          </p>
          <p class="output-result">
            <span class="output-status">0</span> matches found
          </p>
        </div>

        <h3 class="empty-title">{{ title }}</h3>
        <p class="empty-message">{{ message }}</p>
      </div>
    </TerminalWindow>
  </div>
</template>

<style scoped>
.empty-state {
  max-width: 400px;
  margin: 48px auto;
}

.empty-content {
  text-align: center;
  padding: 24px 16px;
}

.empty-icon {
  margin-bottom: 16px;
  color: var(--text-muted);
}

.empty-output {
  margin-bottom: 20px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.output-line {
  display: flex;
  justify-content: center;
  gap: 6px;
  margin: 0 0 4px 0;
}

.output-prompt {
  color: var(--text-muted);
}

.output-cmd {
  color: var(--syntax-keyword);
}

.output-arg {
  color: var(--syntax-string);
}

.output-result {
  color: var(--text-muted);
  margin: 0;
}

.output-status {
  color: var(--status-yellow);
  font-weight: 600;
}

.empty-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.empty-message {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}
</style>
