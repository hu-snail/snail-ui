# 字体配置

组件库的字体全部由 token 驱动。默认字体栈定义在 `@snui/tokens` 基础层,
语义层绑定如下(与 naive-ui [Fonts 文档](https://www.naiveui.com/zh-CN/light/docs/fonts)
的思路一致 —— 字体文件(@font-face / 网络字体)由应用自行加载,组件库只
负责把字体栈注入 token 级联):

| 语义 token | 默认绑定 | 用途 |
| --- | --- | --- |
| `--aui-font-family-body` | `var(--aui-font-family-sans)` | 正文 / 组件默认字体 |
| `--aui-font-family-heading` | `var(--aui-font-family-sans)` | 标题 |
| `--aui-font-family-code` | `var(--aui-font-family-mono)` | 代码 / 等宽 |
| `--sn-web-font-family-*` | `var(--aui-font-family-*)` | Web 组件消费的别名层 |

## 方式一:`SnConfigProvider` 的 `font` prop

```vue
<script setup lang="ts">
import { SnConfigProvider } from '@snui/vue-web'

const font = {
  body: '"Inter", "PingFang SC", sans-serif',
  heading: '"Inter Display", sans-serif',
  code: '"JetBrains Mono", ui-monospace, monospace',
}
</script>

<template>
  <SnConfigProvider :font="font">
    <router-view />
  </SnConfigProvider>
</template>
```

行为细节:

- 每个提供的键都会生成 `:root` 级 CSS 变量覆盖(同时覆盖 `--aui-*` 基础层
  与 `--sn-web-*` 别名层),省略的键保持 token 默认。
- 提供 `body` 时额外发出一条 `body { font-family: var(--sn-web-font-family-body) }`
  规则 —— 这是**显式开启**的全局应用,页面级生效(含 Teleport 弹层)。
  只想改 `code` / `heading` 变量时不会触碰页面默认字体。
- 实现是组件内的内联 `<style>` 标签:SSR 输出随 HTML 下发、**无字体闪烁**,
  组件卸载时随之移除,无全局残留;`font` prop 变化时实时更新。
- 值会剥离 `</style` 序列,无法借字体栈注入注入任何标签。

## 方式二:全局样式覆盖(适合 SSR / 纯 CSS)

不加任何 JS,在应用的全局样式里直接覆盖 token(优先级按源顺序,放在
`@snui/vue-web/styles` 之后即可):

```css
:root {
  --aui-font-family-body: 'Inter', 'PingFang SC', sans-serif;
  --sn-web-font-family-body: 'Inter', 'PingFang SC', sans-serif;
}

body {
  font-family: var(--sn-web-font-family-body, var(--aui-font-family-body));
}
```

Nuxt 场景推荐此方式:字体变量在服务端 HTML 中原生生效,零闪烁、零 JS。

## 加载字体文件

字体文件本身与组件库无关,按应用方式接入即可:

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
```

或使用 `@font-face` + 自托管字体,然后把字体栈传给 `font` prop 或全局 CSS。
