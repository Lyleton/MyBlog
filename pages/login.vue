<script setup lang="ts">
const route = useRoute()
const passphrase = ref('')
const error = ref('')
const loading = ref(false)

// URL 携带 pt 令牌：交给服务端消费并建立会话
if (typeof route.query.pt === 'string' && route.query.pt) {
  navigateTo(`/auth/portable?pt=${encodeURIComponent(route.query.pt)}`, { external: true })
}

const { check } = useAuth()

async function login() {
  if (!passphrase.value || loading.value) return
  loading.value = true
  error.value = ''
  try {
    await $fetch('/api/auth/login', { method: 'POST', body: { passphrase: passphrase.value } })
    await check(true)
    navigateTo('/')
  } catch {
    error.value = '验证失败，请稍后再试'
  } finally {
    loading.value = false
  }
}

useHead({ title: '登录' })
</script>

<template>
  <div class="login-page">
    <form class="login-box" @submit.prevent="login">
      <div class="login-title"><span class="prompt">$</span> sudo login</div>
      <input
        v-model="passphrase"
        type="password"
        placeholder="输入管理口令"
        autocomplete="off"
        autofocus
        class="login-input"
      />
      <button type="submit" class="login-btn" :disabled="loading">进入</button>
      <p v-if="error" class="login-error">{{ error }}</p>
    </form>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-box {
  width: 100%;
  max-width: 360px;
  padding: 32px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--bg-secondary);
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.login-title {
  font-family: var(--font-mono);
  font-size: 1rem;
  color: var(--text-primary);
}

.prompt {
  color: var(--text-muted);
  margin-right: 6px;
}

.login-input {
  padding: 10px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background-color: var(--bg-primary);
  color: var(--text-primary);
  font-family: var(--font-mono);
}

.login-input:focus {
  outline: none;
  border-color: var(--primary);
}

.login-btn {
  padding: 10px;
  border: none;
  border-radius: 6px;
  background-color: var(--primary);
  color: #fff;
  cursor: pointer;
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-error {
  margin: 0;
  font-size: 0.875rem;
  color: #e06c75;
}
</style>
