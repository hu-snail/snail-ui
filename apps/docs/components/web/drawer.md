# Drawer 抽屉（Web 端）

`SnDrawer` 是从屏幕四边滑入的**浮层外壳**：遮罩 + 面板 + 方向定位 + 滚动锁。面板内部的标题 / 正文 / 底部由配套的 `SnDrawerContent` 渲染。两者的 props 与语义按 [naive-ui `n-drawer`](https://www.naiveui.com/zh-CN/light/components/drawer) 1:1 对齐（AGENTS.md §112）。

典型场景：表单填写、设置面板、详情查看。

## 两个组件的分工

naive-ui 把「抽屉」拆成两个组件，本库同样拆：

| 组件 | 负责 |
|---|---|
| `SnDrawer` | Teleport、遮罩、四向定位与滑入过渡、`<html>` 滚动锁、`Escape`、`z-index`、承载面板的插槽 |
| `SnDrawerContent` | 头部（标题 + 关闭按钮）、正文、底部三行 |

`SnDrawer` 只负责遮罩、滑入动画和滚动锁；面板里的头部、正文、底部由 `SnDrawerContent` 提供，通过 `default` 插槽传入。上游 `n-drawer` 也没有 `title` / `closable`，这两个属于内容组件。

## 实时预览

<Demo name="drawer-web-basic" description="四向 placement 切换 + 遮罩点击 / Escape 关闭" />

<Demo name="drawer-web-content" description="SnDrawerContent 的 header / body / footer 三段与自定义插槽" />

## 基础用法

```ts
import { SnDrawer, SnDrawerContent } from '@snui/vue-web'
import '@snui/tokens-web/styles'
```

```html
<SnDrawer v-model:show="open" placement="right" :width="400">
  <SnDrawerContent title="设置" closable>
    <p>正文内容</p>
    <template #footer>
      <SnButton @click="open = false">取消</SnButton>
      <SnButton type="primary" @click="save">保存</SnButton>
    </template>
  </SnDrawerContent>
</SnDrawer>
```

## Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `show` | `boolean` | `false` | 是否打开。 |
| `placement` | `'top' \| 'right' \| 'bottom' \| 'left'` | `'right'` | 从哪条边滑入。 |
| `width` | `number \| string` | `undefined` | 面板宽度。**只对 `left` / `right` 生效。** |
| `height` | `number \| string` | `undefined` | 面板高度。**只对 `top` / `bottom` 生效。** |
| `maskClosable` | `boolean` | `true` | 点击遮罩是否请求关闭。 |
| `showMask` | `boolean \| 'transparent'` | `true` | 遮罩可见性。`'transparent'` 保留遮罩（仍吞点击）但不绘制。 |
| `to` | `string \| HTMLElement` | `undefined` | Teleport 目标。`undefined` 表示不 teleport（就地渲染）。 |
| `displayDirective` | `'if' \| 'show'` | `'if'` | `'if'` 关闭时卸载面板；`'show'` 保持挂载并切 `display`。 |
| `nativeScrollbar` | `boolean` | `true` | 传 `false` 会加 `--native-scrollbar` class 钩子供自定义滚动条。见 §112。 |
| `zIndex` | `number` | `undefined` | 浮层层级。 |
| `blockScroll` | `boolean` | `true` | 打开时锁定 `<html>` 滚动。 |
| `closeOnEsc` | `boolean` | `true` | `Escape` 是否请求关闭。 |
| `contentClass` / `contentStyle` | `string` / `string \| CSSProperties` | `undefined` | 内容包装层额外的 class / style。 |

## 回调 props

| 名称 | 类型 | 说明 |
|---|---|---|
| `onMaskClick` | `(e: MouseEvent) => void` | 遮罩被点击。在任何关闭动作之前触发，且**不受** `maskClosable` 影响。 |
| `onEsc` | `() => void` | `Escape` 被按下。在任何关闭动作之前触发，且**不受** `closeOnEsc` 影响。 |
| `onAfterEnter` | `() => void` | 进入过渡结束。 |
| `onAfterLeave` | `() => void` | 离开过渡结束。 |

这四个与同名事件一一对应 —— Vue 会把 `mask-click` 路由到 `onMaskClick`（`esc` 同理），所以组件内部**不能**在 emit 之后再手动调一次 prop，否则调用方的处理函数会跑两遍。

## 事件

| 事件 | 载荷 | 触发时机 |
|---|---|---|
| `update:show` | `boolean` | 抽屉请求开关。 |
| `after-enter` | `()` | 进入过渡结束。 |
| `after-leave` | `()` | 离开过渡结束。 |
| `mask-click` | `MouseEvent` | 遮罩被点击。 |
| `esc` | `()` | `Escape` 被按下。 |

## 插槽

| 名称 | 说明 |
|---|---|
| `default` | 面板内容，通常是一个 `<SnDrawerContent>`。上游 `n-drawer` 同样要求调用方显式提供内容，不提供时为空白面板。 |

## 行为说明

### 宽高受 placement 约束

复刻上游：`left` / `right` 读 `width`，`top` / `bottom` 读 `height`，**另一维度交给样式表**。数字转 `px`，字符串原样使用。两个都没传时，组件输出**空字符串**而非内联值 —— 避免空声明把样式表的默认值盖掉（沿用 SnSkeleton 的既有约定）。

### 遮罩的三种状态

- `true`：绘制遮罩并吞点击。
- `'transparent'`：保持挂载、仍然吞点击，但不绘制任何东西。
- `false`：完全不渲染。

前两种状态下 `mask-click` 都会触发，**与 `maskClosable` 无关** —— `maskClosable` 只决定要不要*请求关闭*。

### Escape 与输入法

`closeOnEsc` 控制关闭，但当 `event.isComposing` 为真时（中文 / 日文输入法正在取消组合）**永不关闭** —— 与上游 `useIsComposing` 同一道守卫。

### 滚动锁是「还原」不是「清空」

打开时把 `<html>` 既有的内联 `overflow` 记下来，释放时还原，所以宿主自己设过的值不会被冲掉。`onBeforeUnmount` 里还有一道兜底：抽屉在打开状态下被销毁也会还原。

### 子组件可关闭抽屉

`SnDrawer` 通过 `SN_DRAWER_INJECTION_KEY` 把自己 provide 出去；后代的 `SnDrawerContent` inject 到之后，关闭按钮会顺带请求父抽屉隐藏 —— 等价上游的 `drawerInjectionKey`。

## SnDrawerContent

面板的三行：头部（标题 + 关闭按钮）、正文、可选底部。

### Props

| 名称 | 类型 | 默认 | 说明 |
|---|---|---|---|
| `title` | `string` | `undefined` | 头部标题。 |
| `closable` | `boolean` | `false` | 是否渲染关闭按钮。上游声明为裸 `Boolean`，默认取 falsy。 |
| `nativeScrollbar` | `boolean` | `true` | 给正文加 `--native-scrollbar` class 钩子。 |
| `headerClass` / `headerStyle` | `string` / `string \| CSSProperties` | `undefined` | 头部额外的 class / style。 |
| `bodyClass` / `bodyStyle` | `string` / `string \| CSSProperties` | `undefined` | 正文额外的 class / style。 |
| `bodyContentClass` / `bodyContentStyle` | `string` / `string \| CSSProperties` | `undefined` | 正文内层内容元素额外的 class / style。 |
| `footerClass` / `footerStyle` | `string` / `string \| CSSProperties` | `undefined` | 底部额外的 class / style。 |

### 事件

| 事件 | 载荷 | 触发时机 |
|---|---|---|
| `close` | `()` | 关闭按钮被点击。 |

### 插槽

| 名称 | 说明 |
|---|---|
| `default` | 正文内容。 |
| `header` | 头部行，替代 `title`。 |
| `footer` | 底部行。不提供则**完全不渲染**底部元素。 |
| `close` | 关闭按钮，替代内置图形。 |

### 行为说明

- **头部的出现规则**：有 `header` 插槽、或 `title`、或 `closable` 为真，三者命中其一即渲染；否则头部整体缺席，正文成为第一行，并带上 `--last` 类去掉下边距。
- **底部的出现规则**：只有提供 `footer` 插槽才渲染，没有兜底内容。
- **关闭行为**：关闭按钮 emit `close`，**并且**在注入到父抽屉时请求父抽屉隐藏。放在抽屉里用时可以不绑 `@close`。
- 标题元素是 `role="heading"` + `aria-level="1"`。

## 无障碍

- 面板根元素 `role="dialog"` + `aria-modal="true"`；遮罩是 `aria-hidden="true"`。
- 关闭按钮是真实的 `<button type="button">`，带 `aria-label="关闭"` 与 `:focus-visible` 焦点环。
- 头部标题以一级标题暴露。

以下**尚未实现**（见 §112）：焦点陷阱、初始焦点、关闭后焦点归还、面板到标题的 `aria-labelledby` 关联。

## 主题

两个组件的 token 面都落在样式表里（`--sn-web-drawer-*`），**不输出任何内联主题样式** —— 改主题靠覆盖 token。唯一的内联样式是受 placement 约束的 `width` / `height`，以及调用方自己传的 `contentStyle` / `headerStyle` 之类的透传。

## 已知取舍（§112 future markers）

- **焦点陷阱**：上游用 `vueuc` 的 `VFocusTrap` 包住面板；本版尚未实现（与 `SnDialog` 同一缺口）。
- **`nativeScrollbar` 仅为 API 对齐**：上游传 `false` 时切到 `NScrollbar` 的虚拟滚动条；两边目前都渲染原生滚动容器，保留 `--native-scrollbar` class 作为定制钩子，真正的虚拟滚动条未实现。
- **`resizable` / `maxWidth` / `maxHeight` / `minWidth` / `minHeight` / `scrollbarProps`** 等上游 props **尚未纳入**。补齐（尤其是 `resizable`，上游靠拖拽 + 三条 3px 触发条实现）属于后续任务。
- 过渡使用硬编码的 `0.2s` / `0.3s` 时长，而非上游的 easing token —— tokens 包没有 motion/时长别名可消费。
- 上游 `drawer-cssr` 里的拖拽改尺寸触发器（3px 边缘）与逐 placement 的圆角规则，本版只落圆角，未落改尺寸手柄。
