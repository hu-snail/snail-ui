# Notification 通知（Web 端）

`SnNotificationProvider` + `useNotification()` 提供全局通知能力：在屏幕角落堆叠展示轻量反馈（信息 / 成功 / 警告 / 错误），到时自动消失，也可手动关闭。

与 `SnAlert`（行内、留在文档流）和 `SnDialog`（阻断、需要用户决策）不同，通知是转瞬即逝的全局浮层反馈。

## 何时使用

- 操作结果的异步反馈：保存成功、上传失败、导出完成。
- 系统级消息推送：公告、配额提醒、维护通知。
- 需要多条并排堆叠、自动消失的全局提示。

不适合：需要用户做出决策时用 `SnDialog`；需要长期驻留在页面区块内时用 `SnAlert`。

## 代码演示

### 基础用法

`SnNotificationProvider` 包裹应用（或需要的子树），后代组件在 `setup` 中调用 `useNotification()` 触发通知。四种语义类型的图标与配色：

<Demo name="notification-web-basic" description="Provider 包裹 + 四种类型通知触发 + destroyAll" />

## API

### SnNotificationProvider Props

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placement` | `'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | 通知堆叠方位。`bottom` 系列自下而上生长。 |
| `max` | `number` | `Infinity` | 同时存在的最大通知数，超出时移除最旧的一条。 |
| `to` | `string \| HTMLElement` | `'body'` | 堆叠容器的 Teleport 挂载目标。 |
| `container-style` | `string \| CSSProperties` | `undefined` | 附加到堆叠容器上的内联样式。 |
| `scrollable` | `boolean` | `false` | 通知过多时容器内部滚动（限制最大高度）。 |

### useNotification()

在 `SnNotificationProvider` **后代组件**的 `setup` 中调用，返回 `NotificationApi`：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `create` | `(options: NotificationOptions) => NotificationReactive` | 推入一条通知，`options.type` 缺省时为 `'default'`（无图标）。 |
| `info` | `(options) => NotificationReactive` | 等价于 `create`，强制 `type: 'info'`。 |
| `success` | `(options) => NotificationReactive` | 等价于 `create`，强制 `type: 'success'`。 |
| `warning` | `(options) => NotificationReactive` | 等价于 `create`，强制 `type: 'warning'`。 |
| `error` | `(options) => NotificationReactive` | 等价于 `create`，强制 `type: 'error'`。 |
| `destroyAll` | `() => void` | 移除当前全部通知。 |

`NotificationReactive` 即通知句柄：`destroy()` 手动关闭该条通知（触发 `onClose`）。

未挂载 Provider 时调用 `useNotification()` 不会报错：控制台会输出一条包含 `PROVIDER_MISSING` 结构化代码的警告，并返回一个安全的 no-op API。

### NotificationOptions

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义类型，驱动内置图标与配色。 |
| `title` | `string` | `undefined` | 标题行。 |
| `content` | `string` | `undefined` | 正文。 |
| `description` | `string` | `undefined` | 正文下方的次级说明文字。 |
| `meta` | `string` | `undefined` | 底部小字备注（如时间戳）。 |
| `avatar` | `() => VNodeChild` | `undefined` | 头部头像渲染函数。 |
| `footer` | `() => VNodeChild` | `undefined` | 底部操作区渲染函数。 |
| `duration` | `number` | `3000` | 自动关闭延时（ms）；`0` 表示不自动关闭。 |
| `closable` | `boolean` | `true` | 是否显示右上角关闭按钮。 |
| `keepAliveOnHover` | `boolean` | `true` | 指针悬停在通知上时暂停 `duration` 倒计时，移开后继续。 |
| `onClose` | `() => void` | `undefined` | 通知被关闭时调用（关闭按钮 / 倒计时到期 / `destroy()` / `destroyAll()`）。 |
| `onAfterEnter` | `() => void` | `undefined` | 进场过渡结束后调用。 |
| `onAfterLeave` | `() => void` | `undefined` | 离场过渡结束后调用。 |

### Slots（SnNotification 卡片）

通知卡片一般由 Provider 内部渲染；需要完全自绘堆叠时可直接使用 `SnNotification`：

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 正文内容，替代 `content`。 |
| `header` | `()` | 标题，替代 `title`。 |
| `icon` | `()` | 自定义类型图标，替代内置图标。 |
| `footer` | `()` | 底部操作区，替代 `footer` 渲染函数。 |
| `avatar` | `()` | 头部头像，替代 `avatar` 渲染函数。 |

## 用法示例

```vue
<script setup lang="ts">
import { defineComponent, h } from 'vue'
import { SnButton, SnNotificationProvider, useNotification } from '@snui/vue-web'

// useNotification 必须在 Provider 后代组件的 setup 中调用
const Trigger = defineComponent({
  name: 'NotificationTrigger',
  setup() {
    const notification = useNotification()

    const notify = () => {
      const handle = notification.success({
        title: '已保存',
        content: '配置已生效',
        duration: 3000,
      })
      // 需要时提前关闭：handle.destroy()
    }

    return () => h(SnButton, { type: 'primary', onClick: notify }, () => '保存')
  },
})
</script>

<template>
  <SnNotificationProvider>
    <Trigger />
  </SnNotificationProvider>
</template>
```

## 主题

组件没有专属必填 token，配色直接消费语义 token；以下 `--sn-web-notification-*` 变量提供尺寸 / 层级覆盖（未定义时使用内置回退值）：

| Token | 回退值 | 说明 |
| --- | --- | --- |
| `--sn-web-notification-width` | `330px` | 单条通知宽度 |
| `--sn-web-notification-padding` | `14px 16px` | 通知内边距 |
| `--sn-web-notification-gap` | `8px` | 通知间距 |
| `--sn-web-notification-offset` | `24px` | 距屏幕边缘距离 |
| `--sn-web-notification-z-index` | `6000` | 堆叠容器层级 |
| `--sn-web-notification-icon-color-info` | info 色 | `info` 图标颜色 |
| `--sn-web-notification-icon-color-success` | info 色 | `success` 图标颜色（与参考语义一致） |
| `--sn-web-notification-icon-color-warning` | warning 色 | `warning` 图标颜色 |
| `--sn-web-notification-icon-color-error` | danger 色 | `error` 图标颜色 |

同时消费：`--sn-web-color-background-elevated`（卡片底色）、`--sn-web-color-text-primary` / `-secondary` / `-tertiary`（标题正文 / 说明 / 备注与关闭按钮）、`--sn-web-color-feedback-info` / `-warning` / `-danger`（类型图标色）、`--sn-web-color-border-subtle`（卡片描边）、`--sn-web-color-background-subtle`（关闭按钮悬停底色）、`--sn-web-card-radius` / `--sn-web-card-shadow`（圆角与投影）、`--sn-web-icon-size-small` / `-medium`（图标尺寸）、`--sn-web-button-radius`（关闭按钮圆角）、`--sn-web-focus-ring`（关闭按钮焦点环）。

## 无障碍

- 堆叠容器 `role="region"` + `aria-label="Notifications"`。
- 单条通知：`error` / `warning` 为 `role="alert"`（即时播报），其余为 `role="status"`（礼貌播报）。
- 类型图标 `aria-hidden="true"`，类型语义由文字与播报承载。
- 关闭按钮为真实 `<button type="button">`，带 `aria-label="关闭"` 与 `:focus-visible` 焦点环。

## AI Patch Boundary

| 字段 | AI 可直接修改 | 说明 |
| --- | --- | --- |
| `type` / `title` / `content` / `description` / `meta` | 是 | 纯数据字段，可由 AI 生成的 Patch 安全设置 |
| `duration` / `closable` / `keepAliveOnHover` | 是 | 行为开关，改动仅影响单条通知展示 |
| `placement` / `max` / `scrollable` | 是 | 堆叠容器级配置，纯展示语义 |
| `avatar` / `footer` / `header` / `icon` 插槽 | 否，需人工确认 | 涉及渲染函数 / VNode，Patch 无法静态校验 |
| `onClose` / `onAfterEnter` / `onAfterLeave` | 否，需人工确认 | 业务副作用回调，需 Review 调用逻辑 |
| `to` / `container-style` | 否，需人工确认 | 影响全局挂载点与层叠上下文 |

## 已知取舍

- 进出动画为 CSS slide + fade 过渡（配合高度塌缩），不是逐帧 JS 动画。
- 通知内容为一次性快照：`create()` 之后修改原 options 对象不会更新已展示的通知，需销毁重建。
- 未提供 `update()` 式的原地更新 API。
