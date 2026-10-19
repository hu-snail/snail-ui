# Notification 通知（Web 端）

`SnNotificationProvider` + `useNotification()` 提供全局通知：在屏幕的某个角落堆叠展示轻量反馈卡片，到时自动消失，也可以随时手动关闭。

与 `SnAlert`（行内、留在文档流）和 `SnDialog`（阻断、需要用户决策）不同，通知是转瞬即逝的全局浮层反馈。

## 何时使用

- 操作结果的异步反馈：保存成功、上传失败、导出完成。
- 系统级消息推送：公告、配额提醒、维护通知。
- 需要多条并排堆叠、自动消失的全局提示。

不适合：需要用户做出决策时用 `SnDialog`；需要长期驻留在页面区块内时用 `SnAlert`。

## 代码演示

### 基础用法

`SnNotificationProvider` 包裹应用（或需要的子树），后代组件在 `setup` 中调用 `useNotification()` 触发通知；同一处也演示了 `duration: 0` 的常驻通知、句柄关闭与 `destroyAll()`：

<Demo name="notification-web-basic" description="Provider 包裹 + 四种类型通知触发 + destroyAll" />

### 四种语义类型

`info` / `success` / `warning` / `error` 各自驱动一套内置图标与配色，`type` 缺省时为 `default`（不渲染图标）：

<Demo name="notification-web-types" description="四种语义类型的图标与配色对照" />

### 堆叠方位

`placement` 决定通知堆叠吸附的角落，支持上下两条边的六个方位。切换后已在屏的通知也会一起移动到新方位；`bottom` 系列自下而上生长：

<Demo name="notification-web-placement" description="六个 placement 按钮切换，通知移动到所选角落" />

### 数量上限

`max` 限制同时可见的条数，超出时最先加入的一条会被移除：

<Demo name="notification-web-max" description="max=3：连点触发，最旧的一条被挤出" />

### 自定义内容与句柄关闭

`avatar` / `meta` / `footer` / `description` 组合出自定义卡片；`create()` 返回的句柄可被长期持有，随时 `destroy()`：

<Demo name="notification-web-custom" description="avatar 头像 + meta 时间 + footer 操作按钮 + 持有句柄手动关闭" />

## API

### Props

`SnNotificationProvider` 的 props：

| 名称 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `placement` | `'top' \| 'top-right' \| 'top-left' \| 'bottom' \| 'bottom-right' \| 'bottom-left'` | `'top-right'` | 通知堆叠方位。`bottom` 系列自下而上生长（新通知出现在下方）。 |
| `max` | `number` | `Infinity` | 同时存在的最大通知数，超出时移除最先加入的一条。 |
| `to` | `string \| HTMLElement` | `'body'` | 堆叠容器的 Teleport 挂载目标。 |
| `container-style` | `string \| CSSProperties` | `undefined` | 附加到堆叠容器上的内联样式。 |
| `scrollable` | `boolean` | `false` | 通知过多时容器内部滚动（最大高度为视口高度减去上下偏移）。 |

Provider 的默认插槽承载触发区（见下方 Slots）。

### NotificationOptions

`create()` 与四个快捷方法统一接收该对象：

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'default' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'default'` | 语义类型，驱动内置图标与配色；`'default'` 不渲染图标。 |
| `title` | `string` | `undefined` | 标题行（加粗）。 |
| `content` | `string` | `undefined` | 正文。 |
| `description` | `string` | `undefined` | 正文下方的次级说明文字。 |
| `meta` | `string` | `undefined` | 底部小字备注（如时间戳）。 |
| `avatar` | `() => VNodeChild` | `undefined` | 头部头像渲染函数。 |
| `footer` | `() => VNodeChild` | `undefined` | 底部操作区渲染函数。 |
| `duration` | `number` | `3000` | 自动关闭延时（ms）；`0` 或负数表示不自动关闭。 |
| `closable` | `boolean` | `true` | 是否渲染右上角关闭按钮。 |
| `keepAliveOnHover` | `boolean` | `true` | 指针悬停在通知上时暂停 `duration` 倒计时，移开后以剩余时间继续。 |
| `onClose` | `() => void` | `undefined` | 通知被关闭时调用（关闭按钮 / 倒计时到期 / `destroy()` / `destroyAll()` / `max` 挤出）。 |
| `onAfterEnter` | `() => void` | `undefined` | 进场过渡结束后调用。 |
| `onAfterLeave` | `() => void` | `undefined` | 离场过渡结束后调用。 |

### NotificationReactive

每条通知返回的句柄：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `destroy` | `() => void` | 关闭该条通知：触发其 `onClose`，随后播放离场过渡并移除。已移除后再调用为空操作。 |

### Slots

`SnNotification` 是实际渲染的通知卡片，由 Provider 内部批量渲染；需要完全自绘堆叠时也可直接使用该组件：

| 名称 | 参数 | 说明 |
| --- | --- | --- |
| `default` | `()` | 正文内容，替代 `content`。 |
| `header` | `()` | 标题，替代 `title`。 |
| `icon` | `()` | 自定义类型图标，替代内置图标。 |
| `footer` | `()` | 底部操作区，替代 `footer` 渲染函数。 |
| `avatar` | `()` | 头部头像，替代 `avatar` 渲染函数。 |

`SnNotificationProvider` 的 `default` 插槽承载触发区，`useNotification()` 必须在它的后代组件中调用。

### Methods

在 `SnNotificationProvider` **后代组件**的 `setup` 中调用 `useNotification()`，返回 `NotificationApi`：

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `create` | `(options: NotificationOptions) => NotificationReactive` | 推入一条通知，`type` 按 `options.type`（缺省 `'default'`）。 |
| `info` | `(options: NotificationOptions) => NotificationReactive` | 等价于 `create`，强制 `type: 'info'`。 |
| `success` | `(options: NotificationOptions) => NotificationReactive` | 等价于 `create`，强制 `type: 'success'`。 |
| `warning` | `(options: NotificationOptions) => NotificationReactive` | 等价于 `create`，强制 `type: 'warning'`。 |
| `error` | `(options: NotificationOptions) => NotificationReactive` | 等价于 `create`，强制 `type: 'error'`。 |
| `destroyAll` | `() => void` | 移除当前全部通知，逐条触发各自的 `onClose`。 |

四个快捷方法会覆盖 `options.type`。未挂载 Provider 时调用 `useNotification()` 不会抛错：控制台输出一条包含 `PROVIDER_MISSING` 结构化代码的警告，并返回安全的 no-op API（所有方法均无副作用，句柄的 `destroy()` 同样为空操作）。

## Tokens

组件没有专属必填 token，配色直接消费语义 token；以下 `--sn-web-notification-*` 变量提供尺寸 / 层级覆盖（未定义时使用内置回退值）：

| Token | 回退值 | 说明 |
| --- | --- | --- |
| `--sn-web-notification-width` | `330px` | 单条通知宽度 |
| `--sn-web-notification-padding` | `14px 16px` | 通知内边距 |
| `--sn-web-notification-gap` | `8px` | 通知间距 |
| `--sn-web-notification-offset` | `24px` | 距屏幕边缘距离 |
| `--sn-web-notification-z-index` | `6000` | 堆叠容器层级 |
| `--sn-web-notification-icon-color-info` | info 色 | `info` 图标颜色 |
| `--sn-web-notification-icon-color-success` | info 色 | `success` 图标颜色 |
| `--sn-web-notification-icon-color-warning` | warning 色 | `warning` 图标颜色 |
| `--sn-web-notification-icon-color-error` | danger 色 | `error` 图标颜色 |

同时消费：`--sn-web-color-background-elevated`（卡片底色）、`--sn-web-color-text-primary` / `-secondary` / `-tertiary`（标题正文 / 说明 / 备注与关闭按钮）、`--sn-web-color-feedback-info` / `-warning` / `-danger`（类型图标色）、`--sn-web-color-border-subtle`（卡片描边）、`--sn-web-color-background-subtle`（关闭按钮悬停底色）、`--sn-web-card-radius` / `--sn-web-card-shadow`（圆角与投影）、`--sn-web-icon-size-small` / `-medium`（图标尺寸）、`--sn-web-button-radius`（关闭按钮圆角）、`--sn-web-focus-ring`（关闭按钮焦点环）。

## 无障碍

- 堆叠容器 `role="region"` + `aria-label="Notifications"`。
- 单条通知：`error` / `warning` 为 `role="alert"`（即时播报），其余为 `role="status"`（礼貌播报）。
- 类型图标 `aria-hidden="true"`，类型语义由文字与播报承载。
- 关闭按钮为真实 `<button type="button">`，带 `aria-label="关闭"` 与 `:focus-visible` 焦点环。
- 容器本身 `pointer-events: none`，只有卡片可交互，不会挡住页面其他区域。

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
