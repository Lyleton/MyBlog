/**
 * useMobileMenu - Mobile menu state management
 * Provides reactive state for mobile sidebar menu with body scroll lock
 */
export const useMobileMenu = () => {
  const isOpen = useState('mobile-menu', () => false)

  const open = () => {
    isOpen.value = true
    // Lock body scroll when menu is open
    if (import.meta.client) {
      document.body.style.overflow = 'hidden'
    }
  }

  const close = () => {
    isOpen.value = false
    // Restore body scroll
    if (import.meta.client) {
      document.body.style.overflow = ''
    }
  }

  const toggle = () => {
    if (isOpen.value) {
      close()
    }
    else {
      open()
    }
  }

  // Auto-close on route change
  const route = useRoute()
  watch(() => route.path, () => {
    close()
  })

  // Close on escape key
  if (import.meta.client) {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen.value) {
        close()
      }
    }
    onMounted(() => {
      document.addEventListener('keydown', handleEscape)
    })
    onUnmounted(() => {
      document.removeEventListener('keydown', handleEscape)
    })
  }

  return {
    isOpen: readonly(isOpen),
    open,
    close,
    toggle,
  }
}
