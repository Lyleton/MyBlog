<script setup lang="ts">
import { siteConfig } from '~/config/site'

const route = useRoute()
const path = computed(() => route.path)

// SEO
useHead({
  title: `404 - 页面未找到 | ${siteConfig.name}`,
})
</script>

<template>
  <PageWrapper>
    <div class="error-page">
      <TerminalWindow title="error.log" status="error">
        <div class="error-content">
          <div class="error-line">
            <span class="error-prompt">$</span>
            <span class="error-cmd">cat</span>
            <span class="error-path">{{ path }}</span>
          </div>
          <div class="error-output">
            <span class="error-text">cat: {{ path }}: No such file or directory</span>
          </div>
          <div class="error-code">
            <span class="error-status">exit code:</span>
            <span class="error-number">404</span>
          </div>
        </div>
      </TerminalWindow>

      <div class="error-actions">
        <NuxtLink to="/" class="error-link">
          <span class="nav-cmd">cd</span>
          <span class="nav-arg">~/home</span>
        </NuxtLink>
        <NuxtLink to="/articles" class="error-link">
          <span class="nav-cmd">ls</span>
          <span class="nav-arg">./articles</span>
        </NuxtLink>
      </div>
    </div>
  </PageWrapper>
</template>

<style scoped>
.error-page {
  max-width: 600px;
  margin: 64px auto;
}

.error-content {
  font-family: var(--font-mono);
  font-size: 0.9375rem;
}

.error-line {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
}

.error-prompt {
  color: var(--text-muted);
}

.error-cmd {
  color: var(--syntax-keyword);
}

.error-path {
  color: var(--syntax-string);
}

.error-output {
  padding: 16px;
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  margin-bottom: 16px;
}

.error-text {
  color: var(--status-red);
}

.error-code {
  display: flex;
  gap: 8px;
}

.error-status {
  color: var(--text-muted);
}

.error-number {
  color: var(--status-red);
  font-weight: 600;
}

.error-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin-top: 32px;
}

.error-link {
  display: flex;
  gap: 6px;
  padding: 12px 20px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.error-link:hover {
  background-color: var(--bg-tertiary);
  border-color: var(--primary);
}
</style>
