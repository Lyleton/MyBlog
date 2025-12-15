<script setup lang="ts">
/**
 * MDC Callout Component
 * Usage: ::callout{type="info"} Content ::
 */
interface Props {
  type?: 'info' | 'warning' | 'error' | 'success' | 'tip'
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  title: '',
})

const typeConfig = computed(() => {
  const configs = {
    info: { icon: 'i-mdi-information', label: 'INFO' },
    warning: { icon: 'i-mdi-alert', label: 'WARNING' },
    error: { icon: 'i-mdi-close-circle', label: 'ERROR' },
    success: { icon: 'i-mdi-check-circle', label: 'SUCCESS' },
    tip: { icon: 'i-mdi-lightbulb', label: 'TIP' },
  }
  return configs[props.type] || configs.info
})
</script>

<template>
  <div class="callout" :class="type">
    <div class="callout-header">
      <Icon :name="typeConfig.icon" size="18" />
      <span class="callout-type">{{ title || typeConfig.label }}</span>
    </div>
    <div class="callout-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.callout {
  margin: 24px 0;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.callout.info {
  background-color: rgba(59, 130, 246, 0.1);
  border-color: #3b82f6;
}

.callout.warning {
  background-color: rgba(245, 158, 11, 0.1);
  border-color: #f59e0b;
}

.callout.error {
  background-color: rgba(239, 68, 68, 0.1);
  border-color: #ef4444;
}

.callout.success {
  background-color: rgba(34, 197, 94, 0.1);
  border-color: #22c55e;
}

.callout.tip {
  background-color: rgba(168, 85, 247, 0.1);
  border-color: #a855f7;
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  font-weight: 600;
  text-transform: uppercase;
}

.callout.info .callout-header {
  color: #3b82f6;
}

.callout.warning .callout-header {
  color: #f59e0b;
}

.callout.error .callout-header {
  color: #ef4444;
}

.callout.success .callout-header {
  color: #22c55e;
}

.callout.tip .callout-header {
  color: #a855f7;
}

.callout-content {
  color: var(--text-secondary);
  font-size: 0.9375rem;
  line-height: 1.6;
}

.callout-content :deep(p) {
  margin: 0;
}

.callout-content :deep(p + p) {
  margin-top: 8px;
}
</style>
