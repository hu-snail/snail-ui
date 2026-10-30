# Cascader 级联选择器（uni 端 / 移动端）

`sn-cascader` 是 `@snui/uni` 的级联选择弹层：tab 式逐级下钻。easycom 自动注册（`components/sn-cascader/sn-cascader.vue` → `<sn-cascader>`），几何值使用 `rpx`。静态模式下点中叶子立即确认并返回叶子值；`checkStrictly` 允许确认任意层级并显示确认按钮；`lazyLoad` 模式下确认返回完整路径（异步树在最后一级解析前没有叶子值）。`card` 打开后弹层内每个选项渲染为独立卡片，与 `sn-cell` 的 `card` 同一套圆角 / 描边 / 阴影 token。

## 基础用法

静态模式：逐级 tap 下钻，点中叶子即确认并关闭。触发入口常用 `sn-cell` 卡片行承载「字段名 + 已选文案」。

<Demo name="cascader-mp-basic" description="静态模式：逐级 tap 下钻，点中叶子即确认并关闭；sn-cell card 行触发弹层。" />

## 卡片形态（`card`）

`card` 打开后每个选项自成一张卡片（圆角 / 描边 / 阴影，行间由 token 间距分隔），与 `sn-cell` 的卡片形态视觉同一套语言；不传 `card` 时保持默认列表形态（通栏行 + 分隔线）。逐级下钻、选中态、行尾下钻箭头与勾选标记在两种形态下行为一致。

<Demo name="cascader-mp-card" description="卡片形态（card）与默认列表形态对照；卡片形态下每行独立成卡。" />

## 任意级可选（`checkStrictly`）

`checkStrictly` 允许确认任意层级：点分支不再自动确认，确认按钮此时才渲染，提交的是所选层级的值。

<Demo name="cascader-mp-strict-lazy" description="checkStrictly 允许确认任意层级，并显示确认按钮；确认后返回该层级的值。" />

## 禁用选项（`disabled`）

选项带 `disabled: true` 时整行弱化显示，点击既不展开下一级也不触发确认；整枝禁用同样生效。

<Demo name="cascader-mp-disabled" description="选项级 disabled：整行弱化、不响应点击；整枝禁用与单个叶子禁用同时生效。" />

## 字段映射与提示（`valueKey` / `textKey` / `childrenKey` / `tipKey` / `lineWidth` / `lineHeight`）

选项字段名完全可配：`valueKey` / `textKey` / `childrenKey` 分别指向 value / 文案 / 子级，`tipKey` 指向每行的提示小字。`lineWidth` / `lineHeight` 调整当前列指示条尺寸（数字按 rpx 设计值，1 设计值 = 2rpx）。

<Demo name="cascader-mp-fields" description="valueKey / textKey / childrenKey / tipKey 字段映射；lineTheme=text 与 lineHeight。" />

## 异步加载与确认拦截（`lazyLoad` / `isLeafKey` / `beforeConfirm`）

`lazyLoad(option, tabIndex, resolve)` 在展开非叶子节点时向宿主请求子级；`isLeafKey` 指定标记叶子的字段；`beforeConfirm` 可拦确认（返回 `false` 时弹层保持打开）。异步模式下确认的 `value` 是完整路径数组。

<Demo name="cascader-mp-lazy-confirm" description="lazyLoad + isLeafKey；checkStrictly；beforeConfirm 拦截，守卫结论由 sn-cell 行回报。" />

## 弹层与指示条（`closeOnClickModal` / `zIndex` / `safeAreaInsetBottom` / `lineTheme` / `custom*`）

`lineTheme` 四档指示条（`normal` / `text` / `underline` / `dot`）。`closeOnClickModal` / `safeAreaInsetBottom` / `zIndex` / `rootPortal` 转发给 `sn-popup`，`customClass` / `customStyle` 挂弹层。

<Demo name="cascader-mp-sheet" description="lineTheme underline / dot；closeOnClickModal=false；safeAreaInsetBottom；zIndex；rootPortal；customClass / customStyle。" />

## Props

| 属性                                                            | 类型                                                          | 默认值                                                     | 说明                                                 |
| --------------------------------------------------------------- | ------------------------------------------------------------- | ---------------------------------------------------------- | ---------------------------------------------------- |
| `modelValue`                                                    | `string \| number \| Array<...>`                              | `undefined`                                                | 叶子值，或异步模式下的路径数组                       |
| `visible`                                                       | `boolean`                                                     | `false`                                                    | 弹层显隐                                             |
| `options`                                                       | `CascaderOption[]`                                            | `[]`                                                       | 层级选项树                                           |
| `title`                                                         | `string`                                                      | `''`                                                       | 工具栏标题                                           |
| `beforeConfirm`                                                 | `({ value, selectedOptions }) => boolean \| Promise<boolean>` | `undefined`                                                | 确认前钩子                                           |
| `checkStrictly`                                                 | `boolean`                                                     | `false`                                                    | 任意级可选                                           |
| `confirmText`                                                   | `string`                                                      | `'确认'`                                                   | 确认按钮文案                                         |
| `valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey` | `string`                                                      | `'value'` / `'text'` / `'children'` / `'tip'` / `'isLeaf'` | 节点字段名                                           |
| `lazyLoad`                                                      | `CascaderLazyLoad`                                            | `undefined`                                                | 异步加载回调 `(option, tabIndex, resolve)`           |
| `closeOnClickModal`                                             | `boolean`                                                     | `true`                                                     | 点击遮罩关闭                                         |
| `zIndex` / `safeAreaInsetBottom`                                | `number` / `boolean`                                          | `15` / `true`                                              | 层级 / 安全区                                        |
| `lineWidth` / `lineHeight`                                      | `number \| string`                                            | `undefined`                                                | 激活指示条尺寸（数字按 rpx 设计值）                  |
| `lineTheme`                                                     | `'normal' \| 'text' \| 'underline' \| 'dot'`                  | `'normal'`                                                 | 指示条位置样式                                       |
| `card`                                                          | `boolean`                                                     | `false`                                                    | 卡片形态（**AUI 追加**）：每个选项渲染为独立圆角卡片 |
| `customClass` / `customStyle`                                   | `string`                                                      | `''`                                                       | 根节点自定义类名 / 样式                              |

> **未实现**：`root-portal`：uni-app 小程序没有 portal 宿主。

## Events

| 事件名              | 说明           | 参数                         |
| ------------------- | -------------- | ---------------------------- |
| `update:modelValue` | 确认选择时     | `(value)`                    |
| `update:visible`    | 弹层显隐变化时 | `(value: boolean)`           |
| `confirm`           | 确认时         | `{ value, selectedOptions }` |
| `close`             | 未确认关闭时   | —                            |

## Slots

本组件不提供插槽。

## 主题变量

| 变量                                                                    | 用途                                      |
| ----------------------------------------------------------------------- | ----------------------------------------- |
| `--sn-mp-color-background-elevated`                                     | 弹层与卡片底色                            |
| `--sn-mp-color-background-soft`                                         | tab 底色 / 按压反馈底                     |
| `--sn-mp-color-background-subtle`                                       | tab 按压反馈底                            |
| `--sn-mp-color-action-primary`                                          | 激活 tab / 选中行 / 勾选图标 / 指示条     |
| `--sn-mp-color-action-primary-soft`                                     | 激活 tab 与选中行底色                     |
| `--sn-mp-color-text-primary` / `-secondary` / `-tertiary` / `-disabled` | 文字与禁用态                              |
| `--sn-mp-color-border-subtle`                                           | 行与工具栏分割线 / 卡片描边               |
| `--sn-mp-radius-md` / `--sn-mp-radius-lg` / `--sn-mp-radius-full`       | tab / 按钮 / 卡片与返回控件圆角（`card`） |
| `--sn-mp-shadow-sm`                                                     | 卡片阴影（`card`）                        |
| `--sn-mp-spacing-1` … `--sn-mp-spacing-4`                               | 工具条 / tab / 行 / 卡片间距              |
| `--sn-mp-font-size-xs` / `-sm` / `-md`                                  | 提示小字 / tab 与状态文案 / 选项文案      |
| `--sn-mp-font-weight-semibold`                                          | 激活 tab / 选中行 / 确认按钮字重          |

## AI Patch Boundary

- AI 可通过 Patch 修改展示与数据配置：`title` / `options`（树结构、`value` / `text` / `tip` / `disabled` / 自定义字段）/ `confirmText` / `card` / `lineTheme` / `lineWidth` / `lineHeight` / `zIndex` / `safeAreaInsetBottom` / `closeOnClickModal` / `customClass` / `customStyle`。
- `modelValue` / `visible` 由宿主受控：Patch 只应改写默认值或字段映射（`valueKey` / `textKey` / `childrenKey` / `tipKey` / `isLeafKey`），不应伪造确认事件或直接写运行时状态。
- `beforeConfirm` / `lazyLoad` 是宿主能力边界（数据拉取、权限校验）：Patch 不应内联业务实现，只能调整其存在与绑定名。
- `root-portal` 为未实现项，Patch 不应依赖它改变层级。

## 无障碍

- tab 条为 `role="tablist"`，每个 tab 为 `role="tab"` + `aria-selected`；尚未选择的层级显示「请选择」提示。
- 每个选项为 `role="button"`，带 `aria-pressed` / `aria-disabled`。
- 工具条的返回控件（下钻一层）与取消 / 确认同为 `role="button"`，带 `aria-label`。
- 行尾的下钻箭头 / 勾选标记为装饰元素（`aria-hidden`），语义由选项行承担。
- 异步加载态与空层级提示为 `role="status"`（加载态额外 `aria-live="polite"`）。

## 暗色模式

所有颜色都通过 `--sn-mp-*` token 解析，没有浅色兜底。`.sn-theme-dark` 下弹层底板、卡片描边与阴影、tab 底色、选中态与文字色自动翻转，返回控件与指示条跟随主色 token。用 `<sn-config-provider theme="dark">` 包裹即可验证：

```vue
<sn-config-provider theme="dark">
  <sn-cascader v-model="value" v-model:visible="open" :options="tree" title="配送地区" card />
</sn-config-provider>
```
