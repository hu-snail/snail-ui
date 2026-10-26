# Cell 单元格（uni 端 / 移动端）

`sn-cell` 是 `@snui/uni`（移动端 / 小程序 / H5）的列表行，`sn-cell-group` 是分组容器。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`sn-cell-group` 提供分组标题与圆角卡片，`sn-cell` 承载标题与右侧内容：

<Demo name="cell-mp-basic" description="cell-group 的 title / value 渲染分组标题；insert 圆角卡片风格；value 为空时显示 placeholder。" />

## 链接、图标与点击反馈

`is-link` 渲染箭头并开启点击反馈，`prefix-icon` / `suffix-icon` 经图标注册表解析，`arrow-direction` 控制箭头朝向：

<Demo name="cell-mp-link" description="is-link 箭头 + 点击反馈；prefix-icon 前置图标；arrow-direction=down 朝下箭头；clickable 仅点击反馈无箭头。" />

## 布局、必填与对齐

`layout="vertical"` 纵向排布，`required` 渲染必填星号，`title-width` / `value-align` 控制列宽与对齐：

<Demo name="cell-mp-layout" description="layout=vertical 纵向布局；required 必填星号（asterisk-position 控制位置）；title-width / value-align 控制列宽与对齐。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-cell-group title="账户">
  <sn-cell title="用户名" value="Ada" />
</sn-cell-group>
```

如需显式 import：

```ts
import { SnCell } from '@snui/uni/components/sn-cell/sn-cell.vue';
import { SnCellGroup } from '@snui/uni/components/sn-cell/sn-cell-group.vue';
```

## Props

### sn-cell-group

| 属性          | 类型                            | 默认值         | 说明                      |
| ------------- | ------------------------------- | -------------- | ------------------------- |
| `title`       | `string`                        | `''`           | 分组标题                  |
| `value`       | `string`                        | `''`           | 分组右侧内容              |
| `border`      | `boolean`                       | `true`         | 是否展示外边框            |
| `insert`      | `boolean`                       | `false`        | 是否展示为圆角卡片风格    |
| `size`        | `'default' \| 'large'`          | `'default'`    | 标题字号档位              |
| `layout`      | `'horizontal' \| 'vertical'`    | `'horizontal'` | 子单元格布局（继承）      |
| `valueAlign`  | `'left' \| 'right' \| 'center'` | `'right'`      | 子单元格右侧对齐（继承）  |
| `titleWidth`  | `string \| number`              | `undefined`    | 子单元格标题宽度（继承）  |
| `center`      | `boolean`                       | `false`        | 子单元格垂直居中（继承）  |
| `customClass` | `string`                        | `''`           | 根节点自定义类名          |
| `customStyle` | `string`                        | `''`           | 根节点自定义 inline style |

### sn-cell

| 属性                | 类型                                  | 默认值      | 说明                                  |
| ------------------- | ------------------------------------- | ----------- | ------------------------------------- |
| `title`             | `string`                              | `''`        | 左侧标题                              |
| `value`             | `string \| number`                    | `''`        | 右侧内容                              |
| `placeholder`       | `string`                              | `''`        | 占位符，仅在 `value` 为空时显示       |
| `label`             | `string`                              | `''`        | 标题下方描述信息                      |
| `prefixIcon`        | `string`                              | `''`        | 前置图标名                            |
| `suffixIcon`        | `string`                              | `''`        | 后置图标名                            |
| `iconSize`          | `string \| number`                    | `undefined` | 图标大小                              |
| `iconPrefix`        | `string`                              | `''`        | 图标类名前缀                          |
| `cssIcon`           | `boolean \| string`                   | `false`     | CSS（字体）图标                       |
| `to`                | `string`                              | `''`        | 跳转地址（仅随 `click` 透出）         |
| `replace`           | `boolean`                             | `false`     | 跳转是否替换历史（仅随 `click` 透出） |
| `clickable`         | `boolean`                             | `false`     | 是否开启点击反馈                      |
| `isLink`            | `boolean`                             | `false`     | 是否展示右侧箭头并开启点击反馈        |
| `arrowDirection`    | `'left' \| 'up' \| 'down' \| 'right'` | `'right'`   | 箭头方向                              |
| `size`              | `'default' \| 'large'`                | `'default'` | 单元格大小                            |
| `border`            | `boolean`                             | `undefined` | 是否显示内边框（优先于分组）          |
| `titleWidth`        | `string \| number`                    | `undefined` | 左侧标题宽度                          |
| `center`            | `boolean`                             | `undefined` | 是否垂直居中                          |
| `layout`            | `'horizontal' \| 'vertical'`          | `undefined` | 布局方式                              |
| `valueAlign`        | `'left' \| 'right' \| 'center'`       | `undefined` | 右侧对齐                              |
| `required`          | `boolean`                             | `false`     | 是否显示必填星号                      |
| `asteriskPosition`  | `'start' \| 'end'`                    | `'start'`   | 必填星号位置                          |
| `hideAsterisk`      | `boolean`                             | `false`     | 是否隐藏必填星号                      |
| `ellipsis`          | `boolean`                             | `false`     | 内容超出是否省略                      |
| `useTitleSlot`      | `boolean`                             | `true`      | 是否启用 `title` 插槽                 |
| `useLabelSlot`      | `boolean`                             | `true`      | 是否启用 `label` 插槽                 |
| `customClass`       | `string`                              | `''`        | 根节点自定义类名                      |
| `customStyle`       | `string`                              | `''`        | 根节点自定义 inline style             |
| `customPrefixClass` | `string`                              | `''`        | 前置图标自定义类                      |
| `customSuffixClass` | `string`                              | `''`        | 后置图标自定义类                      |
| `customLabelClass`  | `string`                              | `''`        | label 区域自定义类                    |
| `customValueClass`  | `string`                              | `''`        | value 区域自定义类                    |
| `customTitleClass`  | `string`                              | `''`        | title 区域自定义类                    |

## Events

| 事件名  | 说明                                               | 参数             |
| ------- | -------------------------------------------------- | ---------------- |
| `click` | `clickable` 或 `isLink` 为 true 时，点击单元格触发 | `(event: Event)` |

> **路由**：`to` / `replace` 只随 `click` 透出，组件**不自行跳转** —— 路由属于宿主 AppBridge 能力（AGENTS.md §60）。

## Slots

| 插槽名    | 说明                                          |
| --------- | --------------------------------------------- |
| `prefix`  | 前置图标区域                                  |
| `title`   | 标题区域（`useTitleSlot` 为 true 时生效）     |
| `label`   | 描述信息区域（`useLabelSlot` 为 true 时生效） |
| `default` | 右侧内容区域                                  |
| `suffix`  | 后置图标区域（`isLink` 为 false 时生效）      |

## 主题变量

| 变量                                                            | 用途                         |
| --------------------------------------------------------------- | ---------------------------- |
| `--sn-mp-color-background-surface`                              | 单元格与分组底色             |
| `--sn-mp-color-background-soft`                                 | 点击态底色                   |
| `--sn-mp-color-border-subtle`                                   | 内边框与分组外边框           |
| `--sn-mp-color-text-primary`                                    | 标题文字色                   |
| `--sn-mp-color-text-secondary`                                  | 描述、值、图标文字色         |
| `--sn-mp-color-text-tertiary`                                   | 箭头颜色                     |
| `--sn-mp-color-input-placeholder`                               | 占位符文字色                 |
| `--sn-mp-color-feedback-danger`                                 | 必填星号                     |
| `--sn-mp-font-size-md` / `--sn-mp-font-size-lg`                 | 常规 / large 字号            |
| `--sn-mp-font-size-sm`                                          | 描述信息字号                 |
| `--sn-mp-font-weight-medium`                                    | 分组标题字重                 |
| `--sn-mp-radius-lg`                                             | `insert` 圆角                |
| `--sn-mp-spacing-2` / `--sn-mp-spacing-3` / `--sn-mp-spacing-4` | 分组标题 / 单元格 / 图标间距 |

## 无障碍

- 可交互单元格（`clickable` / `isLink`）根节点 `role="button"` 且 `aria-label` 取 `title`；静态单元格不带 role。
- 必填星号为 `aria-hidden="true"`，必填语义由宿主在表单层说明。
- 箭头与图标为装饰元素，语义由标题承担。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-cell` 与 `sn-cell-group` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：底色切到暗色表面，分割线使用暗色边框令牌，标题转为暗色主文本、值与描述转为暗色次级文本，必填星号保持危险色。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 表单行：[`sn-form-item`](/components/uni/form)
- 折叠面板：[`sn-collapse`](/components/uni/collapse)
- 宫格：[`sn-grid`](/components/uni/grid)
