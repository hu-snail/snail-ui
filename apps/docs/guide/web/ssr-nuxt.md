# SSR 服务端渲染(含 Nuxt.js)

`@snui/vue-web` 的全部组件均支持在 Node 环境下通过 `vue/server-renderer` 的
`renderToString` 完成服务端渲染。仓库内置了一个真实 Node 环境(无
`window` / `document`)的全组件冒烟测试 `packages/vue-web/src/ssr-render.test.ts`,
持续守护这条约束 —— 任何在模块顶层、`setup()` 执行期或 `immediate` watcher
回调中触碰浏览器全局对象的改动都会在 CI 直接失败。

## Nuxt 3 接入

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    // Vue SFC 库需要进入 transpile 列表
    transpile: ['@snui/vue-web'],
  },
  css: ['@snui/vue-web/styles'],
})
```

```vue
<!-- app.vue -->
<template>
  <SnConfigProvider>
    <NuxtPage />
  </SnConfigProvider>
</template>
```

`SnConfigProvider` 负责 skin / locale / font 的全局配置注入;`styles` 入口
输出完整的 `--aui-*` 基础层与 `--sn-web-*` 别名层 CSS 变量。

## 服务端行为约定

- 组件内的浏览器 API(`window` / `document` / `matchMedia` / 观察器等)
  一律做了 SSR 守卫:服务端渲染安全默认值,客户端挂载后恢复完整交互
  (监听器、Observer、Canvas 绘制等都在 `onMounted` 内)。
- Teleport 弹层(Dialog / Drawer / Popover 等)默认关闭状态下服务端零输出,
  打开状态由客户端交互触发,不参与水合不匹配。
- `immediate: true` 的 watcher 在服务端跳过所有监听器注册。

## 注意事项

- 与任何 SSR 应用一致,依赖浏览器布局度量的组件(如 `SnAffix`、
  `SnVirtualList`)在服务端输出骨架结构,尺寸计算在客户端水合后完成。
- 画布类组件(`SnQrCode`、`SnEquation`)服务端渲染占位,客户端完成绘制。
- 自定义字体若通过 `SnConfigProvider` 的 `font` prop 配置,内联 `<style>`
  随 SSR 输出一起下发,无字体闪烁(见 [字体配置](/guide/web/fonts))。
