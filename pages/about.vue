<script setup lang="ts">
import { siteConfig } from '~/config/site'

// 获取关于页面内容
const { data: about } = await useAsyncData(
  'about-page',
  () => queryContent('about').findOne(),
)

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
      <div v-if="about" class="about-content prose">
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
