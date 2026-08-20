<script setup lang="ts">
import { siteConfig } from '~/config/site'

const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="footer">
    <div class="footer-terminal">
      <div class="footer-grid">
        <div class="footer-col">
          <div class="footer-line">
            <span class="footer-prompt">$</span>
            <span class="footer-cmd">whoami</span>
          </div>
          <div class="footer-output">
            {{ siteConfig.description }}
          </div>
        </div>

        <div class="footer-col">
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
        </div>
      </div>

      <div class="footer-bottom">
        <span class="footer-copyright">
          // Copyright &copy; {{ currentYear }} {{ siteConfig.name }}. Powered by Nuxt 3.
        </span>
        <span class="footer-icp">
          <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">
            湘ICP备2025103214号-1
          </a>
        </span>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  padding: 32px 0;
  border-top: 1px solid var(--border-color);
  margin-top: 48px;
}

.footer-terminal {
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.footer-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  margin-bottom: 20px;
}

.footer-col {
  min-width: 0;
}

.footer-line {
  display: flex;
  gap: 8px;
  margin-bottom: 6px;
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
  padding-left: 16px;
  max-width: 480px;
}

.footer-links {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  padding-left: 16px;
}

.footer-link {
  color: var(--primary);
  transition: color 0.2s ease;
}

.footer-link:hover {
  color: var(--primary-dark);
}

.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  padding-top: 12px;
  border-top: 1px dashed var(--border-color);
}

.footer-copyright {
  color: var(--text-muted);
  font-size: 0.8125rem;
}

.footer-icp {
  font-size: 0.75rem;
  display: flex;
  align-items: center;
}

.footer-icp a {
  color: var(--text-muted);
  transition: color 0.2s ease;
}

.footer-icp a:hover {
  color: var(--primary);
}

@media (max-width: 640px) {
  .footer-grid {
    grid-template-columns: 1fr;
  }
}
</style>
