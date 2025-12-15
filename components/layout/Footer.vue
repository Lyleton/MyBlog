<script setup lang="ts">
import { siteConfig } from '~/config/site'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-terminal">
      <div class="footer-line">
        <span class="footer-prompt">$</span>
        <span class="footer-cmd">whoami</span>
      </div>
      <div class="footer-output">
        {{ siteConfig.description }}
      </div>

      <div class="footer-line">
        <span class="footer-prompt">$</span>
        <span class="footer-cmd">ls</span>
        <span class="footer-arg">./links/</span>
      </div>
      <div class="footer-links">
        <a
          v-for="social in siteConfig.social"
          :key="social.name"
          :href="social.url"
          class="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ social.name }}
        </a>
      </div>

      <div class="footer-copyright">
        // Copyright &copy; {{ currentYear }} {{ siteConfig.name }}. Powered by Nuxt 3.
      </div>

      <div class="footer-icp">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
          湘ICP备2025103214号-1
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 48px 0;
  border-top: 1px solid var(--border-color);
  margin-top: 64px;
}

.footer-terminal {
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.footer-line {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.footer-prompt {
  color: var(--text-muted);
}

.footer-cmd {
  color: var(--syntax-keyword);
}

.footer-arg {
  color: var(--syntax-string);
}

.footer-output {
  color: var(--text-secondary);
  margin-bottom: 24px;
  padding-left: 16px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-left: 16px;
  margin-bottom: 32px;
}

.footer-link {
  color: var(--primary);
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-dark);
}

.footer-copyright {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.footer-icp {
  margin-top: 12px;
  font-size: 0.75rem;
}

.footer-icp a {
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.footer-icp a:hover {
  color: var(--primary);
}
</style>
