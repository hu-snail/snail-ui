# Sticky 粘性布局（uni 端 / 移动端）

`sn-sticky` 是 `@snui/uni`（移动端 / 小程序 / H5）的吸顶容器。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

把需要吸顶的内容包进 `sn-sticky`，滚动容器（页面或 `scroll-view`）滚动时它保持可见：

<Demo name="sticky-mp-basic" description="在 scroll-view 内使用；offset-top 控制吸顶距离；z-index 控制层级。" />

## 自定义吸顶距离与层级

`offset-top` 控制吸顶距离，`z-index` 控制与相邻吸顶元素的层级关系：

<Demo name="sticky-mp-offset" description="offset-top=24 距顶 24px 吸顶；z-index=20 控制层级。" />

## 多层吸顶与自定义样式

`custom-class` / `custom-style` 落在根节点；逐层递增 `offset-top` 可实现多层吸顶，`z-index` 决定层级：

<Demo name="sticky-mp-layers" description="custom-class / custom-style 自定义根节点；两层不同 offset-top 依次吸顶；z-index 控制层级。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-sticky :offset-top="0">
  <view>吸顶内容</view>
</sn-sticky>
```

如需显式 import：

```ts
import { SnSticky } from '@snui/uni/components/sn-sticky/sn-sticky.vue';
```

## Props

| 属性          | 类型     | 默认值 | 说明                      |
| ------------- | -------- | ------ | ------------------------- |
| `zIndex`      | `number` | `1`    | 层级                      |
| `offsetTop`   | `number` | `0`    | 吸顶距离（px）            |
| `customClass` | `string` | `''`   | 根节点自定义类名          |
| `customStyle` | `string` | `''`   | 根节点自定义 inline style |

## Events

无。`sn-sticky` 是纯 CSS 实现（`position: sticky`），不注册滚动监听，因此没有事件、也不需要清理订阅（AGENTS.md §41）。

## Slots

| 插槽名    | 说明           |
| --------- | -------------- |
| `default` | 需要吸顶的内容 |

## 主题变量

| 变量                               | 用途                         |
| ---------------------------------- | ---------------------------- |
| `--sn-mp-color-background-surface` | 吸顶容器底色（避免内容透出） |

## 无障碍

- 组件不添加 role 或 aria 属性：它是纯布局容器，语义由内部内容承担。
- 因为不做滚动监听，不存在焦点 / 朗读状态变化。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-sticky` 只消费 `--sn-mp-color-background-surface` 一个颜色令牌，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下底色自动切换为暗色表面，吸顶时不会透出下层亮色内容。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 索引栏：[`sn-index-bar`](/components/uni/index-bar)
- 标签页吸顶：`sn-tabs` 的 `sticky` / `offsetTop`
- 回到顶部：[`sn-backtop`](/components/uni/backtop)
