<script setup lang="ts">
import { siteConfig } from '~/config/site'

const { authed } = useAuth()

// 获取关于页面内容
const { data: about, refresh } = await useAsyncData(
  'about-page',
  () => queryContent('about').findOne(),
)

// 编辑模式
const editing = ref(false)
const editContent = ref('')
const message = ref('')

async function startEdit() {
  const res = await $fetch<{ content: string }>('/api/admin/articles', { query: { path: 'about.md' } })
  editContent.value = res.content
  editing.value = true
  message.value = ''
}

async function saveEdit() {
  try {
    await $fetch('/api/admin/articles', { method: 'POST', body: { path: 'about.md', content: editContent.value } })
    editing.value = false
    message.value = '已保存，正在重建…'
    await refresh()
  } catch {
    message.value = '保存失败'
  }
}

// SEO
useHead({
  title: `关于 | ${siteConfig.name}`,
  meta: [
    { name: 'description', content: `关于 ${siteConfig.author.name}` },
  ],
})
</script>

<template>
  <PageWrapper
    title="关于我"
    subtitle="了解这个博客和它的作者"
    :stats="[
      { label: 'role', value: 'Developer' },
    ]"
  >
    <div class="about-page">
      <!-- 作者信息卡片 -->
      <TerminalWindow title="whoami.sh" status="ready">
        <div class="author-card">
          <div class="author-avatar">
            <img
              v-if="siteConfig.author.avatar"
              :src="siteConfig.author.avatar"
              :alt="siteConfig.author.name"
            >
            <span v-else class="avatar-letter">{{ siteConfig.author.name.charAt(0) }}</span>
          </div>
          <div class="author-info">
            <h2 class="author-name">{{ siteConfig.author.name }}</h2>
            <p class="author-bio">{{ siteConfig.author.bio }}</p>
            <div class="author-social">
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
                <span>{{ social.name }}</span>
              </a>
            </div>
          </div>
        </div>
      </TerminalWindow>

      <!-- 关于内容 -->
      <div v-if="editing" class="about-edit">
        <div class="edit-toolbar">
          <span class="edit-path">content/about.md</span>
          <span v-if="message" class="edit-message">{{ message }}</span>
          <button class="edit-btn primary" @click="saveEdit">保存</button>
          <button class="edit-btn" @click="editing = false">取消</button>
        </div>
        <ArticleEditor v-model="editContent" />
      </div>
      <div v-else-if="about" class="about-content prose">
        <button v-if="authed" class="edit-btn about-edit-btn" @click="startEdit">✎ 编辑此页</button>
        <ContentRenderer :value="about" />
      </div>
    </div>
  </PageWrapper>
</template>

<style scoped>
.about-page {
  max-width: 700px;
}

.author-card {
  display: flex;
  gap: 24px;
  padding: 8px;
}

.author-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  flex-shrink: 0;
}

.author-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-letter {
  font-size: 2.5rem;
  font-weight: 600;
  color: white;
}

.author-info {
  flex: 1;
}

.author-name {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0 0 8px 0;
}

.author-bio {
  font-size: 1rem;
  color: var(--text-secondary);
  margin: 0 0 16px 0;
  line-height: 1.6;
}

.author-social {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.social-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background-color: var(--bg-tertiary);
  border-radius: 6px;
  font-size: 0.875rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
}

.social-link:hover {
  background-color: var(--primary);
  color: white;
}

.about-content {
  margin-top: 32px;
}

.about-edit {
  margin-top: 32px;
}

.about-edit-btn {
  margin-bottom: 16px;
}

.edit-toolbar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.edit-path {
  flex: 1;
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--text-muted);
}

.edit-message {
  font-size: 0.8125rem;
  color: var(--primary);
}

.edit-btn {
  padding: 4px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-secondary);
  font-size: 0.8125rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}

.edit-btn.primary {
  background-color: var(--primary);
  border-color: var(--primary);
  color: #fff;
}

.edit-btn.primary:hover {
  opacity: 0.9;
}

@media (max-width: 600px) {
  .author-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .author-social {
    justify-content: center;
  }
}
</style>
