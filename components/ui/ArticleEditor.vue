<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: []
}>()

const mode = ref<'edit' | 'preview'>('edit')
const doc = ref<any>(null)
const loading = ref(false)

async function togglePreview() {
  if (mode.value === 'edit') {
    loading.value = true
    try {
      doc.value = (await $fetch('/api/admin/preview', { method: 'POST', body: { content: props.modelValue } })).doc
      mode.value = 'preview'
    } catch { /* 保持编辑模式 */ } finally {
      loading.value = false
    }
  } else {
    mode.value = 'edit'
  }
}
</script>

<template>
  <div class="editor-wrap">
    <div class="editor-toolbar">
      <span class="editor-mode">{{ mode === 'edit' ? '编辑 (Markdown)' : '预览' }}</span>
      <button class="preview-toggle" :disabled="loading" @click="togglePreview">
        <template v-if="mode === 'edit'">{{ loading ? '渲染中…' : '预览' }}</template>
        <template v-else>返回编辑</template>
      </button>
    </div>
    <div class="editor-body">
      <textarea
        v-show="mode === 'edit'"
        class="editor-textarea"
        :value="modelValue"
        spellcheck="false"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
      <div v-show="mode === 'preview'" class="preview-body prose">
        <ContentRenderer v-if="doc" :value="doc" />
        <p v-else class="preview-empty">预览加载中…</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-wrap {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  overflow: hidden;
  height: calc(100vh - 220px);
  min-height: 400px;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.preview-toggle {
  padding: 3px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.preview-toggle:hover:not(:disabled) {
  border-color: var(--primary);
  color: var(--primary);
}

.preview-toggle:disabled {
  opacity: 0.6;
  cursor: wait;
}

.editor-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-textarea {
  flex: 1;
  padding: 12px;
  border: none;
  resize: none;
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  line-height: 1.6;
}

.editor-textarea:focus {
  outline: none;
}

.preview-body {
  flex: 1;
  padding: 12px 20px;
  overflow-y: auto;
  max-width: none;
}

.preview-empty {
  color: var(--text-muted);
}

@media (max-width: 767px) {
  .editor-wrap {
    height: auto;
  }

  .editor-textarea {
    min-height: 300px;
  }

  .preview-body {
    max-height: 60vh;
  }
}
</style>
