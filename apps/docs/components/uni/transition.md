# Transition 动画（uni 端 / 移动端）

`sn-transition` 是 `@snui/uni`（移动端 / 小程序 / H5）的进入 / 离开动画容器：11 种内置动画名（支持数组组合）、可按进入 / 离开分别设置时长、懒渲染与离开后销毁。基于 easycom 自动注册（`components/sn-transition/sn-transition.vue` → `<sn-transition>`），样式几何值走 `rpx`。

## 基础用法

`show` 控制显隐，`name` 选动画；每次切换都会按 `before-enter → enter → after-enter`（或 leave 三连）发事件。

<Demo name="transition-mp-basic" description="fade / fade-up / zoom-in / slide-up 四种动画切换。" />

## 组合、分时长与销毁

`name` 传数组会拼成 `sn-transition--<a>-<b>`（如 `["fade", "up"]` → `fade-up`）；`duration` 传对象可分别设置进入 / 离开时长；`destroy=false` 时离开后保留节点（`display: none`）。

<Demo name="transition-mp-config" description="组合动画、进入 100ms / 离开 600ms、destroy=false，以及事件序列。" />

## 自定义各阶段 class 与根节点样式

`enter-class` / `enter-active-class` / `enter-to-class`（离开侧 `leave-*` 一一对应）按阶段挂到根节点：`-class` 是阶段第一帧，`-active-class` 覆盖整段过程，`-to-class` 是阶段结束后的稳态。这些 class 只跟着阶段走，动画本身仍由 `name` / `duration` 驱动。`custom-class` 常驻根节点，`custom-style` 追加到根节点 inline style。

<Demo name="transition-mp-custom-class" description="六个阶段 class 与事件序列；customClass 虚线框 + customStyle 内联圆角；只给 customClass 的对照。" />

## 懒渲染与阻止触摸滚动

`lazy-render` 默认 `false`（挂载即渲染插槽，`destroy` 为 true 时靠 `display: none` 隐藏）；置 `true` 后插槽要等第一次 `show=true` 才渲染，之后保持已渲染。`disable-touch-move` 打开后在根节点拦截 `touchmove` 默认行为，弹层后面的页面不会跟着滚。

<Demo name="transition-mp-lazy" description="lazy-render 开 / 关对比与插槽渲染状态；disable-touch-move 配合背景滚动区验证拦截。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| show | boolean | false | 是否展示组件 |
| duration | number \| boolean \| Record<string, number> | 300 | 动画执行时间；`false` 关闭，对象可分别设置进入 / 离开 |
| lazyRender | boolean | false | 是否在首次展示时再渲染内容 |
| name | TransitionName \| TransitionName[] | — | 动画类型，可传数组组合多个动画 |
| destroy | boolean | true | 是否在动画结束后通过 `display: none` 隐藏内容 |
| enterClass | string | '' | 进入过渡的开始状态类名 |
| enterActiveClass | string | '' | 进入过渡的激活状态类名 |
| enterToClass | string | '' | 进入过渡的结束状态类名 |
| leaveClass | string | '' | 离开过渡的开始状态类名 |
| leaveActiveClass | string | '' | 离开过渡的激活状态类名 |
| leaveToClass | string | '' | 离开过渡的结束状态类名 |
| disableTouchMove | boolean | false | 是否阻止触摸滚动 |
| customStyle | string | '' | 自定义根节点样式 |
| customClass | string | '' | 自定义根节点样式类 |

## Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| before-enter | 进入前 | — |
| enter | 进入时 | — |
| after-enter | 进入后 | — |
| before-leave | 离开前 | — |
| leave | 离开时 | — |
| after-leave | 离开后 | — |
| click | 点击组件 | Event |

## Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 需要动画的内容 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| — | 动画只做 transform / opacity，不消费颜色 token |

## 无障碍

- 容器不添加 ARIA role —— 语义由内部内容承担
- `disableTouchMove` 只拦截 touchmove，不注册全局监听

## 暗色模式

动画只改变 `transform` / `opacity`，不消费颜色 token，因此暗色下无需额外适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


## 相关

- 弹层（自带动画）：[`sn-popup`](/components/uni/popup)
- 遮罩（自带动画）：[`sn-overlay`](/components/uni/overlay)
