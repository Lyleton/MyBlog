<script setup lang="ts">
import type { TOCItem } from '~/types'

interface Props {
  links: TOCItem[]
}

defineProps<Props>()

const activeId = ref('')

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
    <div class="toc-header">
      <span class="toc-cmd">$</span>
      <span class="toc-text">tree</span>
      <span class="toc-arg">--toc</span>
    </div>
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
  </nav>
</template>

<style scoped>
.toc {
  padding: 16px;
  background-color: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: 8px;
  font-size: 0.875rem;
}

.toc-header {
  display: flex;
  gap: 6px;
  font-family: var(--font-mono);
  margin-bottom: 12px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border-color);
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

.toc-list {
  list-style: none;
  padding: 0;
  margin: 0;
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
