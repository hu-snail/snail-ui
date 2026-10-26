# 快速开始（Web）

5 分钟把 `@snui/vue-web` 接入到 Vue 3 项目。

## 安装

```bash
pnpm add @snui/vue-web
```

## 完整引入

```ts
// main.ts
import { createApp } from 'vue'
import App from './App.vue'
import SnUI from '@snui/vue-web'
import '@snui/vue-web/styles'

createApp(App).use(SnUI).mount('#app')
```

然后在任意 .vue 中：

```vue
<template>
  <SnButton type="primary" @click="onSubmit">提交</SnButton>
</template>
```

## 按需引入（推荐）

通过 `unplugin-vue-components` 自动注册组件，无需手动 import：

```bash
pnpm add -D unplugin-vue-components
```

```ts
// vite.config.ts
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { SnUIResolver } from '@snui/vue-web/resolver'

export default defineConfig({
  plugins: [
    vue(),
    Components({
      resolvers: [SnUIResolver()],
    }),
  ],
})
```

模板里直接用：

```vue
<template>
  <SnButton type="primary" @click="onSubmit">提交</SnButton>
</template>
```

不需要 `import { SnButton } from '@snui/vue-web'`，组件按 ESM tree-shake，未使用不打包。

## 引入样式

```ts
import '@snui/vue-web/styles'
```

或单独引入 token CSS：

```ts
import '@snui/tokens/styles'
```

## 暗色模式

```html
<html data-theme="dark">
```

CSS 变量自动切换。无需额外配置。

## 下一步

- 组件文档：[`Button`](/components/web/button)
- 主题定制：[`theme`](/theme/overview)
- 快速接入 uni-app：[`uni-app 快速开始`](/guide/uni/quick-start)
