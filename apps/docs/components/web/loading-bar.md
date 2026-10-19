# LoadingBar 加载条（Web 端）

`SnLoadingBarProvider` + `useLoadingBar()` 提供页面顶部的全局加载进度条：细长、全宽、悬浮于页面最上层，适合路由切换、全局请求等"页面正在忙碌"的场景。

## 何时使用

- 路由跳转、全局数据刷新等页面级加载反馈。
- 不知道确切进度的请求：`start()` 后进度条缓慢推进但不完成，结束时 `finish()` / `error()` 收尾。

不适合：局部区域内的加载指示用 `SnLoading`；需要展示精确百分比时应在业务侧自行实现，本组件不承载真实进度。

## 代码演示

### 基础用法

`SnLoadingBarProvider` 包裹应用（或需要的子树），后代组件在 `setup` 中调用 `useLoadingBar()` 控制进度条：

<Demo name="loading-bar-web-basic" description="Provider 包裹 + 开始 / 完成 / 出错三种触发" />

## API

### SnLoadingBarProvider Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `to` | `string \| HTMLElement` | `'body'` | 进度条的 Teleport 挂载目标。 |
| `loading-bar-style` | `{ loading?: StyleValue; error?: StyleValue }` | `undefined` | 自定义进度条内联样式；`loading` 应用于默认色推进阶段，`error` 应用于错误冲刺阶段。 |

### useLoadingBar()

在 `SnLoadingBarProvider` **后代组件**的 `setup` 中调用，返回 `LoadingBarApi`：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `start` | `() => void` | 显示进度条，宽度以"先快后慢"的节奏渐进逼近 90%，永不自行到达终点。加载中重复调用为空操作。 |
| `finish` | `() => void` | 冲刺到 100% 后淡出并复位。空闲时调用为空操作。 |
| `error` | `() => void` | 冲刺到 100% 且进度条变为危险色，稍作停留后淡出并复位。空闲时调用为空操作。 |

未挂载 Provider 时调用 `useLoadingBar()` 不会报错：控制台会输出一条包含 `PROVIDER_MISSING` 结构化代码的警告，并返回一个安全的 no-op API（`start` / `finish` / `error` 均为空操作）。

## 用法示例

```vue
<script setup lang="ts">
import { defineComponent, h, onBeforeUnmount } from 'vue'
import { SnButton, SnLoadingBarProvider, useLoadingBar } from '@snui/vue-web'

// useLoadingBar 必须在 Provider 后代组件的 setup 中调用
const Trigger = defineComponent({
  name: 'LoadingBarTrigger',
  setup() {
    const loadingBar = useLoadingBar()
    let timer: ReturnType<typeof setTimeout> | undefined

    const startLoading = () => {
      loadingBar.start()
      timer = setTimeout(() => loadingBar.finish(), 2000)
    }

    const startFailing = () => {
      loadingBar.start()
      timer = setTimeout(() => loadingBar.error(), 1200)
    }

    onBeforeUnmount(() => clearTimeout(timer))

    return () => [
      h(SnButton, { type: 'primary', onClick: startLoading }, () => '开始加载'),
      h(SnButton, { onClick: startFailing }, () => '模拟出错'),
    ]
  },
})
</script>

<template>
  <SnLoadingBarProvider>
    <Trigger />
  </SnLoadingBarProvider>
</template>
```

## 行为细节

- **start**：`requestAnimationFrame` 循环，每帧按 `width += (90 - width) × 0.035` 递增——起步快、尾段减速，悬而未决的请求永远不会自己走完。
- **finish / error**：停止循环 → 0.25s 冲刺到 100% → 淡出（错误态多停留 120ms 再淡出）→ 复位为 0。
- 卸载 Provider 时，动画帧与全部计时器都会被取消，不会泄漏。

## 主题

| Token | 回退值 | 说明 |
| --- | --- | --- |
| `--sn-web-loading-bar-height` | `2px` | 进度条高度 |
| `--sn-web-loading-bar-z-index` | `7000` | 进度条层级 |

同时消费：`--sn-web-color-action-primary`（默认色）、`--sn-web-color-feedback-danger`（错误色）。

## 无障碍

- 进度条为**纯装饰性**反馈，容器 `aria-hidden="true"`，不向辅助技术重复播报；加载状态应由页面自身的 UI 表达。
- 容器 `pointer-events: none`，不会拦截任何点击。

## AI Patch Boundary

| 字段 | AI 可直接修改 | 说明 |
| --- | --- | --- |
| `start` / `finish` / `error` 的调用时机 | 是 | 纯触发语义，无参数 |
| `loading-bar-style` | 否，需人工确认 | 内联样式注入，需 Review 视觉一致性 |
| `to` | 否，需人工确认 | 影响全局挂载点与层叠上下文 |

## 已知取舍

- 空闲时 `finish()` / `error()` 不显示任何内容（不回放一条完整进度条）。
- 进度值为纯视觉模拟，不暴露真实进度读取接口。
