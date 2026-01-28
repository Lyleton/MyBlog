<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import type { TOCItem } from '~/types'

interface Props {
  links: TOCItem[]
}

defineProps<Props>()

const activeId = ref('')

// 折叠状态（持久化到本地存储）
const isCollapsed = useLocalStorage('toc-collapsed', false)

// 切换折叠状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

// 监听滚动，高亮当前阅读位置
onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      })
    },
    {
      rootMargin: '-100px 0px -66% 0px',
    },
  )

  // 观察所有标题元素
  document.querySelectorAll('h2[id], h3[id], h4[id]').forEach((el) => {
    observer.observe(el)
  })

  onUnmounted(() => observer.disconnect())
})

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
</script>

<template>
  <nav v-if="links.length" class="toc" aria-label="文章目录">
    <button
      class="toc-header"
      type="button"
      :aria-expanded="!isCollapsed"
      aria-controls="toc-list"
      @click="toggleCollapse"
    >
      <div class="toc-header-left">
        <span class="toc-cmd">$</span>
        <span class="toc-text">tree</span>
        <span class="toc-arg">--toc</span>
      </div>
      <Icon
        :name="isCollapsed ? 'ph:caret-right' : 'ph:caret-down'"
        class="toc-toggle-icon"
        size="16"
      />
    </button>
    <div v-show="!isCollapsed" id="toc-list" class="toc-content">
      <ul class="toc-list">
        <li
          v-for="link in links"
          :key="link.id"
          class="toc-item"
          :class="[`depth-${link.depth}`, { active: activeId === link.id }]"
        >
          <a
            :href="`#${link.id}`"
            class="toc-link"
            @click.prevent="scrollToHeading(link.id)"
          >
            {{ link.text }}
          </a>
          <ul v-if="link.children?.length" class="toc-children">
            <li
              v-for="child in link.children"
              :key="child.id"
              class="toc-item"
              :class="{ active: activeId === child.id }"
            >
              <a
                :href="`#${child.id}`"
                class="toc-link"
                @click.prevent="scrollToHeading(child.id)"
              >
                {{ child.text }}
              </a>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.toc {
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
  overflow: hidden;
}

.toc-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 16px;
  font-family: var(--font-mono);
  background: none;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.toc-header:hover {
  background-color: var(--bg-tertiary);
}

.toc-header-left {
  display: flex;
  gap: 6px;
}

.toc-toggle-icon {
  color: var(--text-muted);
  transition: transform 0.2s ease;
}

.toc-cmd {
  color: var(--text-muted);
}

.toc-text {
  color: var(--syntax-keyword);
}

.toc-arg {
  color: var(--syntax-string);
}

.toc-content {
  padding: 0 16px 16px;
  border-top: 1px solid var(--border-color);
}

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
  padding-top: 12px;
}

.toc-children {
  list-style: none;
  padding: 0;
  margin: 4px 0 4px 16px;
}

.toc-item {
  margin-bottom: 4px;
}

.toc-item.depth-3 {
  margin-left: 16px;
}

.toc-link {
  display: block;
  padding: 6px 12px;
  color: var(--text-secondary);
  border-radius: 4px;
  transition: all 0.2s ease;
  font-family: var(--font-mono);
}

.toc-link:hover {
  color: var(--text-primary);
  background-color: var(--bg-tertiary);
}

.toc-item.active > .toc-link {
  color: var(--primary);
  background-color: var(--primary-light);
  font-weight: 500;
}

:root.dark .toc-item.active > .toc-link {
  background-color: var(--bg-tertiary);
}
</style>
