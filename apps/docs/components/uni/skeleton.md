# Skeleton 骨架屏（uni 端 / 移动端）

`sn-skeleton` 是 `@snui/uni`（移动端 / 小程序 / H5）的加载占位：一组带微光动画的文本 / 矩形 / 圆形 / 图片占位块，`loading` 结束后换成真实内容。基于 easycom 自动注册（`components/sn-skeleton/sn-skeleton.vue` → `<sn-skeleton>`），样式几何值走 `rpx`。

## 基础用法

`theme` 提供四种预设：`text` / `avatar` / `paragraph` / `image`。

<Demo name="skeleton-mp-basic" description="四种预设布局。" />

## 自定义行列

`rowCol` 每项可以是数字（该行渲染 N 个默认文本块）或列描述数组。列描述支持 `type`（`text` / `rect` / `circle` / `image`）、`size` / `width` / `height`（数字按 rpx）、`margin`、`borderRadius`、`backgroundColor`。

<Demo name="skeleton-mp-custom" description="卡片布局与图文混排布局。" />

## 微光动画与切换

`animation` 取 `gradient`（渐变扫光）/ `flashed`（透明度呼吸）；`loading=false` 时渲染 `default` 插槽。

<Demo name="skeleton-mp-animation" description="两种微光动画，以及 loading 开关切换真实内容。" />

## 自定义类名与样式

`customClass` 可传字符串 / 字符串数组 / 布尔映射对象，`customStyle` 写根节点内联样式。

<Demo name="skeleton-mp-custom-style" description="custom-class 加虚线框 / custom-style 加内边距与圆角 / 两者叠加。" />

三种形态（字符串 / 字符串数组 / 布尔映射对象）在根节点上的效果一致，对象形态适合按状态开关类名：

<Demo name="skeleton-mp-custom-class-forms" description="customClass 三种形态：字符串、字符串数组、布尔映射对象（带开关实时增删类名）。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| theme | 'text' \| 'avatar' \| 'paragraph' \| 'image' | 'text' | 骨架屏主题（`rowCol` 为空时生效） |
| rowCol | (number \| SnSkeletonCol[])[] | [] | 自定义每行占位配置 |
| loading | boolean | true | 是否显示骨架屏；`false` 渲染 default 插槽 |
| animation | '' \| 'gradient' \| 'flashed' | '' | 动画类型 |
| customClass | string \| string[] \| Record<string, boolean> | '' | 根节点自定义类名 |
| customStyle | string | '' | 根节点自定义样式 |

`SnSkeletonCol` = `{ type?, size?, width?, height?, margin?, borderRadius?, backgroundColor? }`。

## Events

无。`` 是纯展示组件，不发事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| default | `loading=false` 后展示的真实内容 |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| --sn-mp-color-background-subtle | 占位块填充 / 渐变基底 |
| --sn-mp-color-background-elevated | 渐变高光 |
| --sn-mp-color-border-default | Doodle 皮肤描边 |
| --sn-mp-radius-sm` / `-md` / `-lg` / `-full | 占位块圆角 |
| --sn-mp-spacing-3 | 行间距与列间距 |

## 无障碍

- 根节点：`role="status"` + `aria-live="polite"` + `aria-busy="true"` + `aria-label="loading"`
- 每个占位块：`aria-hidden="true"`

## 暗色模式

占位块填充与高光走 `--sn-mp-color-background-subtle` / `--sn-mp-color-background-elevated`，都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


> 若通过列的 `backgroundColor` 传了自定义色值，该值不会随主题翻转 —— 暗色下请改用 `var(--sn-mp-*)` 形式。

## 相关

- 不定态加载：[`sn-loading`](/components/uni/loading)
- 空状态：[`sn-empty`](/components/uni/empty)
