<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { navigation } from '~/config/navigation'

const route = useRoute()
const { isOpen, close } = useMobileMenu()

const emit = defineEmits<{
  'open-search': []
}>()

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

// Close menu when clicking overlay
const handleOverlayClick = () => {
  close()
}

// Handle search click
const handleSearchClick = () => {
  emit('open-search')
}
</script>

<template>
  <!-- Mobile overlay -->
  <Transition name="fade">
    <div
      v-if="isOpen"
      class="sidebar-overlay"
      @click="handleOverlayClick"
    />
  </Transition>

  <!-- Sidebar -->
  <aside class="sidebar" :class="{ open: isOpen }">
    <div class="sidebar-header">
      <div class="sidebar-avatar">
        <img
          v-if="siteConfig.author.avatar"
          :src="siteConfig.author.avatar"
          :alt="siteConfig.author.name"
          class="avatar-image"
        >
        <span v-else class="avatar-letter">{{ siteConfig.author.name.charAt(0) }}</span>
      </div>
      <h1 class="sidebar-name">{{ siteConfig.author.name }}</h1>
      <p class="sidebar-bio">{{ siteConfig.author.bio }}</p>
    </div>

    <!-- 社交链接 -->
    <div class="sidebar-social">
      <a
        v-for="social in siteConfig.social"
        :key="social.name"
        :href="social.url"
        class="social-link"
        :title="social.name"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Icon :name="social.icon" size="18" />
      </a>
    </div>

    <!-- 导航菜单 -->
    <nav class="sidebar-nav">
      <ul>
        <li v-for="item in navigation" :key="item.path">
          <NuxtLink :to="item.path" :class="{ active: isActive(item.path) }">
            <span class="nav-cmd">{{ item.cmd }}</span>
            <span class="nav-arg">{{ item.arg }}</span>
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <!-- 搜索入口 -->
    <div class="sidebar-search">
      <button class="search-terminal" @click="handleSearchClick">
        <span class="search-prompt">$</span>
        <span class="search-text">grep -r</span>
        <span class="search-placeholder">'search...'</span>
        <span class="search-shortcut">/</span>
      </button>
    </div>

    <!-- 主题切换 -->
    <div class="sidebar-theme">
      <ThemeToggle />
    </div>

    <!-- Mobile close button -->
    <button class="sidebar-close" @click="close">
      <Icon name="ph:x" size="24" />
    </button>
  </aside>
</template>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: var(--bg-secondary);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  padding: 32px 24px;
  overflow-y: auto;
  z-index: 100;
  transition: transform 0.3s ease;
}

.sidebar-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;
}

.sidebar-close {
  display: none;
  position: absolute;
  top: 16px;
  right: 16px;
  width: 40px;
  height: 40px;
  border: none;
  background-color: var(--bg-tertiary);
  border-radius: 8px;
  color: var(--text-secondary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.sidebar-close:hover {
  background-color: var(--primary);
  color: white;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 24px;
}

.sidebar-avatar {
  width: 80px;
  height: 80px;
  margin: 0 auto 16px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-letter {
  font-size: 2rem;
  font-weight: 600;
  color: white;
}

.sidebar-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 4px 0;
}

.sidebar-bio {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin: 0;
}

.sidebar-social {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: var(--primary);
  color: white;
}

.sidebar-nav {
  flex: 1;
  margin-bottom: 24px;
}

.sidebar-nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.sidebar-nav li {
  margin-bottom: 8px;
}

.sidebar-nav a {
  display: flex;
  gap: 8px;
  padding: 10px 12px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.9375rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.sidebar-nav a:hover {
  background-color: var(--bg-tertiary);
  color: var(--text-primary);
}

.sidebar-nav a.active {
  background-color: var(--primary-light);
  color: var(--primary);
}

.sidebar-nav a.active .nav-cmd {
  color: var(--primary);
}

.sidebar-nav a.active .nav-arg {
  color: var(--primary-dark);
}

.sidebar-search {
  margin-bottom: 16px;
}

.search-terminal {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.search-terminal:hover {
  border-color: var(--primary);
}

.search-prompt {
  color: var(--text-muted);
}

.search-text {
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

.sidebar-theme {
  margin-top: auto;
}

/* Dark mode adjustments */
:root.dark .sidebar-nav a.active {
  background-color: var(--bg-tertiary);
}

/* Transition for overlay */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Tablet: Collapsed sidebar (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
  .sidebar {
    width: 72px;
    padding: 24px 12px;
    align-items: center;
  }

  .sidebar-avatar {
    width: 48px;
    height: 48px;
    margin-bottom: 8px;
  }

  .avatar-letter {
    font-size: 1.25rem;
  }

  .sidebar-name,
  .sidebar-bio {
    display: none;
  }

  .sidebar-social {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .social-link {
    width: 40px;
    height: 40px;
  }

  .sidebar-nav a {
    flex-direction: column;
    align-items: center;
    padding: 8px;
    gap: 4px;
  }

  .nav-cmd {
    font-size: 0.75rem;
  }

  .nav-arg {
    display: none;
  }

  .sidebar-search {
    display: none;
  }

  .search-terminal {
    width: 40px;
    height: 40px;
    padding: 0;
    justify-content: center;
  }

  .search-prompt,
  .search-text,
  .search-placeholder {
    display: none;
  }

  .search-shortcut {
    padding: 4px 8px;
  }
}

/* Mobile: Hidden sidebar with overlay (< 768px) */
@media (max-width: 767px) {
  .sidebar {
    width: 280px;
    transform: translateX(-100%);
  }

  .sidebar.open {
    transform: translateX(0);
  }

  .sidebar-overlay {
    display: block;
  }

  .sidebar-close {
    display: flex;
  }

  .sidebar-header {
    margin-top: 32px;
  }
}
</style>
