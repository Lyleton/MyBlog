<script setup lang="ts">
const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  save: []
}>()

const doc = ref<any>(null)
let timer: ReturnType<typeof setTimeout> | undefined

watch(
  () => props.modelValue,
  (content) => {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      try {
        doc.value = (await $fetch('/api/admin/preview', { method: 'POST', body: { content } })).doc
      } catch { /* 保留上一次预览 */ }
    }, 400)
  },
  { immediate: true },
)
</script>

<template>
  <div class="editor-split">
    <div class="editor-pane">
      <div class="pane-header">编辑 (Markdown)</div>
      <textarea
        class="editor-textarea"
        :value="modelValue"
        spellcheck="false"
        @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
      />
    </div>
    <div class="preview-pane">
      <div class="pane-header">预览</div>
      <div class="preview-body prose">
        <ContentRenderer v-if="doc" :value="doc" />
        <p v-else class="preview-empty">预览加载中…</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.editor-split {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  height: calc(100vh - 220px);
  min-height: 400px;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  overflow: hidden;
}

.pane-header {
  padding: 8px 12px;
  border-bottom: 1px solid var(--border-color);
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
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
  padding: 12px 16px;
  overflow-y: auto;
}

.preview-empty {
  color: var(--text-muted);
}

@media (max-width: 767px) {
  .editor-split {
    grid-template-columns: 1fr;
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
