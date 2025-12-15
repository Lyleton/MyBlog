---
title: 'TypeScript 实用技巧与最佳实践'
description: '分享日常开发中常用的 TypeScript 技巧，提升代码质量和开发效率。'
date: '2025-12-15'
category: 'TypeScript'
tags: ['TypeScript', '最佳实践', '类型系统']
featured: false
published: true
---

# TypeScript 实用技巧与最佳实践

TypeScript 已成为现代前端开发的标配，本文分享一些实用技巧。

## 类型推断的艺术

TypeScript 有强大的类型推断能力，很多时候不需要显式声明类型：

```typescript
// 不需要显式类型
const name = 'TypeScript' // string
const version = 5 // number
const features = ['generics', 'decorators'] // string[]

// 复杂类型可能需要显式声明
interface User {
  id: number
  name: string
  email: string
}

const users: User[] = []
```

## 实用工具类型

TypeScript 内置了很多实用的工具类型：

### Partial 和 Required

```typescript
interface User {
  id: number
  name: string
  email?: string
}

// 所有属性变为可选
type PartialUser = Partial<User>

// 所有属性变为必需
type RequiredUser = Required<User>
```

### Pick 和 Omit

```typescript
interface User {
  id: number
  name: string
  email: string
  password: string
}

// 只选择特定属性
type PublicUser = Pick<User, 'id' | 'name' | 'email'>

// 排除特定属性
type UserWithoutPassword = Omit<User, 'password'>
```

### Record

```typescript
// 创建键值对类型
type UserRoles = 'admin' | 'user' | 'guest'
type RolePermissions = Record<UserRoles, string[]>

const permissions: RolePermissions = {
  admin: ['read', 'write', 'delete'],
  user: ['read', 'write'],
  guest: ['read']
}
```

## 类型守卫

使用类型守卫来缩小类型范围：

```typescript
interface Bird {
  fly(): void
  layEggs(): void
}

interface Fish {
  swim(): void
  layEggs(): void
}

// 自定义类型守卫
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined
}

function move(pet: Fish | Bird) {
  if (isFish(pet)) {
    pet.swim() // TypeScript 知道这是 Fish
  } else {
    pet.fly() // TypeScript 知道这是 Bird
  }
}
```

## 泛型技巧

### 泛型约束

```typescript
interface Lengthwise {
  length: number
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length)
  return arg
}

logLength('hello') // OK
logLength([1, 2, 3]) // OK
logLength({ length: 10 }) // OK
// logLength(123) // Error!
```

### 条件类型

```typescript
type IsArray<T> = T extends any[] ? true : false

type A = IsArray<string[]> // true
type B = IsArray<string> // false

// 实用示例：提取数组元素类型
type ElementType<T> = T extends (infer E)[] ? E : T

type C = ElementType<string[]> // string
type D = ElementType<number> // number
```

## 模板字面量类型

TypeScript 4.1 引入的强大特性：

```typescript
type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<EventName>}`
// 'onClick' | 'onFocus' | 'onBlur'

// API 路由类型
type HTTPMethod = 'get' | 'post' | 'put' | 'delete'
type APIRoute = `/api/${string}`
type TypedRoute = `${Uppercase<HTTPMethod>} ${APIRoute}`
```

## 最佳实践总结

1. **优先使用接口**: 接口可以被扩展和合并
2. **善用类型推断**: 不要过度标注类型
3. **使用严格模式**: 启用 `strict: true`
4. **避免 any**: 使用 `unknown` 替代不确定类型
5. **利用工具类型**: 减少重复的类型定义

```typescript
// tsconfig.json 推荐配置
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

掌握这些技巧，将大大提升你的 TypeScript 开发体验！
