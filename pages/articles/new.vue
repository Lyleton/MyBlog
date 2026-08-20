<script setup lang="ts">
const { authed, check } = useAuth()
if (import.meta.client) {
  await check()
  if (!authed.value) navigateTo('/login')
}

const filename = ref('')
const content = ref(`---
title: '新文章'
description: ''
date: '${new Date().toISOString().slice(0, 10)}'
category: ''
tags: []
published: true
---

`)
const message = ref('')

async function save() {
  const slug = filename.value.trim().replace(/[^\w\-一-龥]+/g, '-').replace(/^-+|-+$/g, '')
  if (!slug) {
    message.value = '请输入文件名'
    return
  }
  try {
    await $fetch('/api/admin/articles', { method: 'POST', body: { path: `articles/${slug}.md`, content: content.value } })
    message.value = '已保存，正在重建…'
    navigateTo(`/articles/${slug}`)
  } catch {
    message.value = '保存失败'
  }
}
</script>

<template>
  <div v-if="authed" class="new-article">
    <header class="new-header">
      <h1>新增文章</h1>
      <div class="new-actions">
        <input v-model="filename" class="filename-input" placeholder="文件名（无需 .md）">
        <button class="save-btn" @click="save">保存并发布</button>
      </div>
      <p v-if="message" class="message">{{ message }}</p>
    </header>
    <ArticleEditor v-model="content" />
  </div>
</template>

<style scoped>
.new-article {
  max-width: 1400px;
}

.new-header {
  margin-bottom: 16px;
}

.new-header h1 {
  font-size: 1.25rem;
  margin: 0 0 12px 0;
}

.new-actions {
  display: flex;
  gap: 8px;
}

.filename-input {
  flex: 1;
  max-width: 360px;
  padding: 8px 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-secondary);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
}

.save-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: var(--primary);
  color: #fff;
  cursor: pointer;
}

.message {
  margin: 8px 0 0;
  font-size: 0.875rem;
  color: var(--primary);
}
</style>
