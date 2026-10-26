# Loading 加载指示器（uni 端 / 移动端）

`sn-loading` 是 `@snui/uni`（移动端 / 小程序 / H5）的加载指示器：4 种 spinner 形态（`circular` / `spinner` / `dots` / `wave`）、可选文案、纵向 / 横向布局。基于 easycom 自动注册（`components/sn-loading/sn-loading.vue` → `<sn-loading>`），样式几何值走 `rpx`。

## 基础用法

默认是 `circular` 圆环；`type` 切换 4 种形态。

<Demo name="loading-mp-basic" description="circular / spinner / dots / wave 四种加载形态。" />

## 文案、方向与尺寸

- `text` 渲染文案；`default` 插槽优先于 `text`
- `direction` 控制「加载器 + 文案」排列方向（默认 `vertical`）
- `size` 是基准尺寸：数字按 `rpx` 处理，字符串原样透传（`'3em'` / `'48rpx'` / `'24px'`）
- `color` 覆盖加载器颜色；`inheritColor` 改为继承父元素颜色

<Demo name="loading-mp-text" description="text 文案、horizontal 横排、size、color 与默认插槽。" />

## 继承颜色与自定义类名

`inheritColor` 改为继承父元素颜色；`customClass` / `customStyle` 落在根节点，`customSpinnerClass` 只作用于加载器盒子。

<Demo name="loading-mp-custom" description="inherit-color 继承父级色 / 根节点类名与内联样式 / 单独放大 spinner。" />

## Props

| 属性 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `type` | `'circular' \| 'spinner' \| 'dots' \| 'wave'` | `'circular'` | 加载指示器类型 |
| `color` | `string` | `''` | 加载指示器颜色 |
| `size` | `number \| string` | `''` | 基准尺寸；数字按 rpx，字符串原样透传 |
| `text` | `string` | `''` | 加载文案 |
| `direction` | `'vertical' \| 'horizontal'` | `'vertical'` | 排列方向 |
| `inheritColor` | `boolean` | `false` | 是否继承父元素颜色 |
| `customClass` | `string` | `''` | 根节点自定义类名 |
| `customStyle` | `string` | `''` | 根节点自定义样式 |
| `customSpinnerClass` | `string` | `''` | 加载器区域自定义类名 |

## Events

无。`sn-loading` 是纯展示组件，不发事件。

## Slots

| 插槽名 | 说明 |
| --- | --- |
| `default` | 加载文案内容（覆盖 `text`） |

## 主题变量

| 变量 | 用途 |
| --- | --- |
| `--sn-mp-color-action-primary` | 默认加载器颜色 |
| `--sn-mp-color-text-secondary` | 文案颜色 |
| `--sn-mp-font-size-md` | 文案字号 |
| `--sn-mp-font-line-height-normal` | 文案行高 |
| `--sn-mp-spacing-3` | 加载器与文案间距 / 横向外边距 |
| `--sn-mp-radius-xs` | Doodle 皮肤下的条形圆角 |

## 无障碍

- 根节点挂 `role="status"` + `aria-live="polite"` + `aria-busy="true"`
- 加载图形 `aria-hidden="true"`，语义由文案承担
- 无键盘交互（移动端指示器）

## 暗色模式

加载器与文案颜色分别走 `--sn-mp-color-action-primary` / `--sn-mp-color-text-secondary`，两者都在 `@snui/tokens-mp/styles` 的暗色块里覆盖过，因此自动适配。可用 sn-config-provider 的 theme 设为 dark 包裹验证：


## 相关

- 进度百分比：[`sn-progress`](/components/uni/progress)
- 空状态：[`sn-empty`](/components/uni/empty)
