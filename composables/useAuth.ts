export function useAuth() {
  const authed = useState('authed', () => false)
  let checking: Promise<void> | undefined

  function check(force = false) {
    if (import.meta.server) return Promise.resolve()
    if (force) checking = undefined
    if (!checking) {
      checking = $fetch('/api/auth/me')
        .then(() => { authed.value = true })
        .catch(() => { authed.value = false })
    }
    return checking
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    authed.value = false
    checking = undefined
    navigateTo('/')
  }

  return { authed, check, logout }
}
