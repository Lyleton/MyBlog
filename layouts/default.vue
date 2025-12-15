<script setup lang="ts">
const { toggle } = useMobileMenu()
const {
  query,
  results,
  isLoading,
  isOpen,
  selectedIndex,
  open: openSearch,
  close: closeSearch,
  navigateUp,
  navigateDown,
} = useSearch()
</script>

<template>
  <div class="page-layout">
    <Sidebar @open-search="openSearch" />

    <!-- Mobile header with hamburger menu -->
    <header class="mobile-header">
      <button class="menu-toggle" @click="toggle" aria-label="Toggle menu">
        <Icon name="ph:list" size="24" />
      </button>
      <span class="mobile-logo">~/blog</span>
      <button class="search-toggle" @click="openSearch" aria-label="Search">
        <Icon name="ph:magnifying-glass" size="20" />
      </button>
    </header>

    <main class="main-content">
      <slot />
      <Footer />
    </main>

    <!-- Search Modal -->
    <SearchModal
      :is-open="isOpen"
      :query="query"
      :results="results"
      :is-loading="isLoading"
      :selected-index="selectedIndex"
      @update:query="query = $event"
      @close="closeSearch"
      @navigate-up="navigateUp"
      @navigate-down="navigateDown"
    />
  </div>
</template>

<style scoped>
.page-layout {
  display: flex;
  min-height: 100vh;
}

.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  padding: 0 16px;
  align-items: center;
  z-index: 50;
}

.menu-toggle,
.search-toggle {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background-color: transparent;
  border-radius: 8px;
  color: var(--text-primary);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.menu-toggle:hover,
.search-toggle:hover {
  background-color: var(--bg-tertiary);
}

.mobile-logo {
  flex: 1;
  text-align: center;
  font-family: var(--font-mono);
  font-size: 1rem;
  font-weight: 600;
  color: var(--primary);
}

.main-content {
  flex: 1;
  margin-left: var(--sidebar-width);
  padding: 48px 64px;
  background-color: var(--bg-primary);
}

/* Tablet layout (768px - 1024px) */
@media (max-width: 1024px) and (min-width: 768px) {
  .main-content {
    margin-left: 72px;
    padding: 32px 40px;
  }
}

/* Mobile layout (< 768px) */
@media (max-width: 767px) {
  .mobile-header {
    display: flex;
  }

  .main-content {
    margin-left: 0;
    margin-top: 56px;
    padding: 24px 16px;
  }
}
</style>
