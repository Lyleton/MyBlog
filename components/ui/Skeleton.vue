<script setup lang="ts">
interface Props {
  width?: string
  height?: string
  rounded?: boolean
  circle?: boolean
}

withDefaults(defineProps<Props>(), {
  width: '100%',
  height: '1rem',
  rounded: true,
  circle: false,
})
</script>

<template>
  <div
    class="skeleton"
    :class="{ rounded, circle }"
    :style="{
      width,
      height,
      aspectRatio: circle ? '1' : undefined,
    }"
  />
</template>

<style scoped>
.skeleton {
  background: linear-gradient(
    90deg,
    var(--bg-tertiary) 25%,
    var(--bg-secondary) 50%,
    var(--bg-tertiary) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s ease-in-out infinite;
}

.skeleton.rounded {
  border-radius: 6px;
}

.skeleton.circle {
  border-radius: 50%;
}

@keyframes skeleton-loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
