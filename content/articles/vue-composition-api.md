---
title: 'Vue 3 Composition API 完全指南'
description: '深入理解 Vue 3 Composition API 的核心概念、使用场景和最佳实践。'
date: '2025-12-15'
category: 'Vue'
tags: ['Vue', 'Composition API', 'TypeScript']
featured: false
published: true
---

# Vue 3 Composition API 完全指南

Vue 3 引入的 Composition API 是一种全新的组件逻辑组织方式，它让代码更加灵活和可复用。

## 为什么需要 Composition API？

在 Vue 2 的 Options API 中，我们按照选项类型（data、methods、computed 等）来组织代码。当组件变得复杂时，相关的逻辑会分散在不同的选项中。

```vue
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 响应式状态
const count = ref(0)
const doubleCount = computed(() => count.value * 2)

// 方法
const increment = () => {
  count.value++
}

// 生命周期
onMounted(() => {
  console.log('Component mounted!')
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Double: {{ doubleCount }}</p>
    <button @click="increment">+1</button>
  </div>
</template>
```

## 核心 API

### ref 和 reactive

`ref` 用于基本类型，`reactive` 用于对象：

```typescript
import { ref, reactive } from 'vue'

// ref - 基本类型
const count = ref(0)
console.log(count.value) // 0

// reactive - 对象
const state = reactive({
  name: 'Vue',
  version: 3
})
console.log(state.name) // 'Vue'
```

### computed

创建计算属性：

```typescript
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed(() => {
  return `${firstName.value} ${lastName.value}`
})
```

### watch 和 watchEffect

监听响应式数据变化：

```typescript
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)

// watch - 明确指定监听源
watch(count, (newVal, oldVal) => {
  console.log(`count changed from ${oldVal} to ${newVal}`)
})

// watchEffect - 自动收集依赖
watchEffect(() => {
  console.log(`count is ${count.value}`)
})
```

## 组合式函数 (Composables)

Composition API 最强大的特性是可以创建可复用的组合式函数：

```typescript
// composables/useCounter.ts
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)
  const doubleCount = computed(() => count.value * 2)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  return {
    count,
    doubleCount,
    increment,
    decrement,
    reset
  }
}
```

使用：

```vue
<script setup>
import { useCounter } from '~/composables/useCounter'

const { count, doubleCount, increment } = useCounter(10)
</script>
```

## 最佳实践

1. **命名规范**: 组合式函数使用 `use` 前缀
2. **单一职责**: 每个组合式函数只负责一个功能
3. **类型安全**: 使用 TypeScript 获得更好的类型推断
4. **响应式返回**: 始终返回响应式引用，保持响应性

## 总结

Composition API 提供了更灵活的代码组织方式，特别适合：

- 大型复杂组件
- 需要复用逻辑的场景
- TypeScript 项目
- 需要更好代码组织的团队

下一篇我们将探讨 Vue 3 的其他新特性！
