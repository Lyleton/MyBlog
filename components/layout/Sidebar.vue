<script setup lang="ts">
import { siteConfig } from '~/config/site'
import { navigation } from '~/config/navigation'
import type { NavItem } from '~/types'

const route = useRoute()
const { isOpen, close } = useMobileMenu()
const { isCollapsed, toggle: toggleSidebar } = useSidebar()
const { authed, logout } = useAuth()
const { items: adminNav, loaded: navLoaded, load: loadNav, save: saveNav, remove: removeNav } = useNavAdmin()

const emit = defineEmits<{
  'open-search': []
}>()

const isActive = (path: string) => {
  if (path === '/') {
    return route.path === '/'
  }
  return route.path.startsWith(path)
}

const navItems = computed(() => (authed.value && navLoaded.value) ? adminNav.value : navigation)

const draft = ref<NavItem | null>(null)
const editIndex = ref<number | null>(null)

watch(authed, (v) => { if (v) loadNav() }, { immediate: true })

const canEditNav = computed(() => authed.value && !isCollapsed.value)

function startEdit(idx: number) {
  editIndex.value = idx
  draft.value = { ...navItems.value[idx] }
}

function startAdd() {
  editIndex.value = null
  draft.value = { label: '', path: '/', cmd: 'cd', arg: '', icon: '' }
}

async function saveDraft() {
  if (!draft.value) return
  const d = { ...draft.value }
  d.cmd = d.cmd.trim() || 'cd'
  d.arg = d.arg.trim() || d.path
  d.icon = d.icon?.trim() || undefined
  const next = [...navItems.value]
  if (editIndex.value === null) next.push(d)
  else next[editIndex.value] = d
  await saveNav(next)
  draft.value = null
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
  <aside class="sidebar" :class="{ open: isOpen, collapsed: isCollapsed }">
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
      <template v-if="!isCollapsed">
        <h1 class="sidebar-name">{{ siteConfig.author.name }}</h1>
        <p class="sidebar-bio">{{ siteConfig.author.bio }}</p>
      </template>
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
      <form v-if="draft" class="nav-form" @submit.prevent="saveDraft">
        <input v-model="draft.label" class="nav-form-input" placeholder="名称 如 首页" required>
        <input v-model="draft.path" class="nav-form-input" placeholder="路径 / 或 https://" required>
        <input v-model="draft.cmd" class="nav-form-input" placeholder="命令 如 cd" >
        <input v-model="draft.arg" class="nav-form-input" placeholder="参数 如 ~/home">
        <input v-model="draft.icon" class="nav-form-input" placeholder="图标 如 ph:house（可选）">
        <div class="nav-form-actions">
          <button type="submit" class="nav-form-save">保存</button>
          <button type="button" class="nav-form-cancel" @click="draft = null">取消</button>
        </div>
      </form>
      <ul v-else>
        <li v-for="(item, idx) in navItems" :key="idx">
          <NuxtLink :to="item.path" :class="{ active: isActive(item.path) }" :title="isCollapsed ? item.label : undefined">
            <Icon v-if="isCollapsed && item.icon" :name="item.icon" size="20" class="nav-icon" />
            <template v-else>
              <span class="nav-cmd">{{ item.cmd }}</span>
              <span class="nav-arg">{{ item.arg }}</span>
            </template>
          </NuxtLink>
          <span v-if="canEditNav" class="nav-actions">
            <button class="nav-action" title="编辑导航" @click="startEdit(idx)">✎</button>
            <button class="nav-action danger" title="删除导航" @click="removeNav(idx)">✕</button>
          </span>
        </li>
        <li v-if="canEditNav">
          <button class="nav-add" @click="startAdd">+ 导航</button>
        </li>
      </ul>
    </nav>

    <!-- 搜索入口 -->
    <div class="sidebar-search">
      <button class="search-terminal" :title="isCollapsed ? '搜索' : undefined" @click="handleSearchClick">
        <Icon v-if="isCollapsed" name="ph:magnifying-glass" size="20" class="search-icon" />
        <template v-else>
          <span class="search-prompt">$</span>
          <span class="search-text">grep -r</span>
          <span class="search-placeholder">'search...'</span>
          <span class="search-shortcut">/</span>
        </template>
      </button>
    </div>

    <!-- 主题切换 -->
    <div class="sidebar-theme">
      <ThemeToggle />
      <button
        v-if="authed"
        class="logout-terminal"
        :title="isCollapsed ? '退出登录' : undefined"
        @click="logout"
      >
        <Icon name="ph:sign-out" :size="isCollapsed ? 20 : 16" />
        <span v-if="!isCollapsed">exit 0</span>
      </button>
    </div>

    <!-- 折叠切换按钮 -->
    <button
      class="sidebar-toggle"
      :title="isCollapsed ? '展开侧边栏' : '收起侧边栏'"
      @click="toggleSidebar"
    >
      <Icon :name="isCollapsed ? 'ph:caret-right' : 'ph:caret-left'" size="16" />
    </button>

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
  transition: width 0.3s ease, transform 0.3s ease, padding 0.3s ease;
}

/* 桌面端折叠状态 */
@media (min-width: 1025px) {
  .sidebar.collapsed {
    width: var(--sidebar-collapsed-width);
    padding: 24px 12px;
    align-items: center;
  }

  .sidebar.collapsed .sidebar-avatar {
    width: 48px;
    height: 48px;
    margin-bottom: 16px;
  }

  .sidebar.collapsed .avatar-letter {
    font-size: 1.25rem;
  }

  .sidebar.collapsed .sidebar-social {
    flex-direction: column;
    gap: 8px;
    margin-bottom: 24px;
  }

  .sidebar.collapsed .social-link {
    width: 40px;
    height: 40px;
  }

  .sidebar.collapsed .sidebar-nav a {
    justify-content: center;
    padding: 10px 8px;
  }

  .sidebar.collapsed .nav-icon {
    color: var(--text-secondary);
  }

  .sidebar.collapsed .sidebar-nav a.active .nav-icon {
    color: var(--primary);
  }

  .sidebar.collapsed .sidebar-search {
    width: 100%;
  }

  .sidebar.collapsed .search-terminal {
    width: 100%;
    justify-content: center;
    padding: 10px 8px;
  }

  .sidebar.collapsed .search-icon {
    color: var(--text-secondary);
  }

  .sidebar.collapsed .search-terminal:hover .search-icon {
    color: var(--primary);
  }
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

.sidebar-nav li {
  position: relative;
}

.nav-actions {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 6px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.sidebar-nav li:hover .nav-actions {
  opacity: 1;
}

.nav-action {
  border: none;
  background: none;
  padding: 2px 4px;
  color: var(--text-muted);
  font-size: 0.75rem;
  cursor: pointer;
}

.nav-action:hover {
  color: var(--primary);
}

.nav-action.danger:hover {
  color: #e06c75;
}

.nav-add {
  width: 100%;
  padding: 8px 12px;
  border: 1px dashed var(--border-color);
  border-radius: 8px;
  background: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.nav-add:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.nav-form {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-tertiary);
}

.nav-form-input {
  padding: 6px 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
}

.nav-form-input:focus {
  outline: none;
  border-color: var(--primary);
}

.nav-form-actions {
  display: flex;
  gap: 8px;
}

.nav-form-save,
.nav-form-cancel {
  flex: 1;
  padding: 6px;
  border-radius: 4px;
  border: none;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  cursor: pointer;
}

.nav-form-save {
  background-color: var(--primary);
  color: #fff;
}

.nav-form-cancel {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  color: var(--text-secondary);
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
  margin-bottom: 12px;
}

/* 退出登录（与搜索入口同款终端风格） */
.logout-terminal {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  margin-top: 8px;
  padding: 10px 12px;
  background-color: var(--bg-tertiary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--text-secondary);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.logout-terminal:hover {
  border-color: var(--primary);
  color: var(--primary);
}

/* 折叠切换按钮 */
.sidebar-toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 36px;
  border: 1px solid var(--border-color);
  background-color: var(--bg-tertiary);
  border-radius: 8px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sidebar-toggle:hover {
  background-color: var(--primary-light);
  border-color: var(--primary);
  color: var(--primary);
}

.sidebar.collapsed .sidebar-toggle {
  width: 40px;
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
    width: var(--sidebar-collapsed-width);
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
    justify-content: center;
    padding: 10px 8px;
  }

  .nav-cmd {
    font-size: 0.8125rem;
  }

  .nav-arg {
    display: none;
  }

  .sidebar-search {
    width: 100%;
  }

  .search-terminal {
    width: 100%;
    justify-content: center;
    padding: 10px 8px;
  }

  .search-prompt,
  .search-text,
  .search-placeholder {
    display: none;
  }

  .search-shortcut {
    padding: 4px 8px;
  }

  /* 平板端隐藏折叠按钮（因为已自动收缩） */
  .sidebar-toggle {
    display: none;
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

  /* 移动端隐藏折叠按钮 */
  .sidebar-toggle {
    display: none;
  }

  /* 移动端始终显示完整内容 */
  .sidebar.collapsed {
    width: 280px;
    padding: 32px 24px;
    align-items: stretch;
  }
}
</style>
