# Overlay 遮罩层（uni 端 / 移动端）

`sn-overlay` 是 `@snui/uni`（移动端 / 小程序 / H5）的全屏遮罩层：一层半透明 scrim，可承载居中内容，带淡入淡出与「点遮罩触发 `click`」契约。基于 easycom 自动注册（`components/sn-overlay/sn-overlay.vue` → `<sn-overlay>`），样式几何值走 `rpx`。

## 基础用法

`show` 控制显隐；点击遮罩触发 `click`，由业务决定是否关闭。

<Demo name="overlay-mp-basic" description="点击遮罩触发 click 并计数；遮罩上的卡片用 @tap.stop 阻止冒泡。" />

## 动画与滚动锁定

- `duration` 支持数字（ms）、`false`（无动画）、`{ enter, leave }`（分别设置）
- `lockScroll`（默认 `true`）在遮罩上拦截 `touchmove`，等同 uni-app 的 `catchtouchmove`
- `zIndex` 直接写进根节点 `style`
- `customStyle` / `customClass` 转发到根节点

<Demo name="overlay-mp-config" description="duration=false / duration=800 + zIndex / lockScroll=false + customStyle。" />

## Props

| 属性          | 类型                                          | 默认值  | 说明                                                     |
| ------------- | --------------------------------------------- | ------- | -------------------------------------------------------- |
| `show`        | `boolean`                                     | `false` | 是否展示遮罩层                                           |
| `duration`    | `number \| boolean \| Record<string, number>` | `300`   | 动画时长；`false` 关闭动画，对象可分别设置 enter / leave |
| `lockScroll`  | `boolean`                                     | `true`  | 是否锁定背景滚动                                         |
| `zIndex`      | `number`                                      | `10`    | 层级                                                     |
| `customStyle` | `string`                                      | `''`    | 根节点样式                                               |
| `customClass` | `string`                                      | `''`    | 根节点样式类名                                           |

## Events

| 事件名         | 说明               | 参数             |
| -------------- | ------------------ | ---------------- |
| `click`        | 点击遮罩层时触发   | `(event: Event)` |
| `before-enter` | 进入动画开始前触发 | —                |
| `enter`        | 进入动画开始时触发 | —                |
| `after-enter`  | 进入动画结束后触发 | —                |
| `before-leave` | 离开动画开始前触发 | —                |
| `leave`        | 离开动画开始时触发 | —                |
| `after-leave`  | 离开动画结束后触发 | —                |

## Slots

| 插槽名    | 说明                   |
| --------- | ---------------------- |
| `default` | 遮罩层内容（居中显示） |

## 主题变量

| 变量                               | 用途              |
| ---------------------------------- | ----------------- |
| `--sn-mp-color-background-overlay` | 遮罩底色（scrim） |
| `--sn-mp-color-text-on-primary`    | 遮罩内内容文字色  |

## 无障碍

- 根节点带 `data-snui-component="overlay"`，整个 scrim 是 tap 目标
- 默认纯装饰：可访问名称由遮罩内的内容承担
- 交互统一用 `@tap`；移动端无键盘焦点陷阱

## 暗色模式

遮罩底色走 `--sn-mp-color-background-overlay`，该变量在 `@snui/tokens-mp/styles` 的 `page.sn-theme-dark, .sn-theme-dark` 块里已覆盖（暗色下为更深的近黑），因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：

## 相关

- 带面板 / 定位动画：[`sn-popup`](/components/uni/popup)
