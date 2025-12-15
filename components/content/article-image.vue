<script setup lang="ts">
/**
 * MDC Article Image Component
 * Usage: ::article-image{src="/images/demo.png" alt="Description"} ::
 */
interface Props {
  src: string
  alt?: string
  caption?: string
  width?: string
  height?: string
}

const props = withDefaults(defineProps<Props>(), {
  alt: '',
  caption: '',
  width: '100%',
  height: 'auto',
})
</script>

<template>
  <figure class="article-image">
    <NuxtImg
      :src="props.src"
      :alt="props.alt"
      :width="props.width"
      :height="props.height"
      loading="lazy"
      class="image"
    />
    <figcaption v-if="props.caption || props.alt" class="caption">
      {{ props.caption || props.alt }}
    </figcaption>
  </figure>
</template>

<style scoped>
.article-image {
  margin: 24px 0;
  text-align: center;
}

.image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: var(--shadow-md);
}

.caption {
  margin-top: 12px;
  font-size: 0.875rem;
  color: var(--text-muted);
  font-style: italic;
}
</style>
