# Pagination 分页（uni 端 / 移动端）

`sn-pagination` 是 `@snui/uni`（移动端 / 小程序 / H5）的页码步进器。基于 easycom 自动注册，几何值走 `rpx`，跨设备等比缩放。

## 基础用法

`v-model` 绑定当前页码，`total-page` 指定总页数：

<Demo name="pagination-mp-basic" description="v-model 绑定页码；total-page 指定总页数；show-message 显示当前页 / 总页数。" />

## 按钮风格与 total 推导

`total` + `page-size` 优先于 `total-page`；`button-variant` 与 `show-icon` 调整按钮外观：

<Demo name="pagination-mp-variant" description="total=95 / page-size=10 → 10 页；button-variant=base 带描边并显示翻页图标；dashed 虚线风格。" />

## 禁用状态

`disabled` 冻结整个控件；到达首 / 末页时翻页按钮自动进入边界禁用态（文字与图标走 `--sn-mp-color-text-disabled`，底色走 `--sn-mp-color-background-subtle`），越界点击被拦住不触发 `change`：

<Demo name="pagination-mp-disabled" description="disabled 整控件冻结；首 / 末页时翻页按钮边界禁用，箭头图标随文字一起变灰。" />

## 简单模式

`simple` 只保留上一页 / 当前页码 / 下一页，不渲染数字条；翻页按钮与普通模式共用同一套图标与禁用规则：

<Demo name="pagination-mp-simple" description="simple 简单模式：prev / 页码计数 / next；带计数文字与纯计数两种形态。" />

## 单页隐藏与插槽自定义

`hide-if-one-page` 在总页数为 1 时整个组件不渲染；`prev` / `size` / `next` / `message` 四个插槽共享 `{ modelValue, totalPageNum, total, pageSize }` 作用域：

<Demo name="pagination-mp-slots" description="hide-if-one-page 单页时整体不渲染；四个插槽自定义翻页按钮与提示。" />

## 自动注册（easycom）

组件符合 easycom 规范，**无需 import 即可在模板中直接使用**：

```vue
<sn-pagination v-model="page" :total-page="8" />
```

如需显式 import：

```ts
import { SnPagination } from '@snui/uni/components/sn-pagination/sn-pagination.vue';
```

## Props

| 属性            | 类型                                      | 默认值   | 说明                             |
| --------------- | ----------------------------------------- | -------- | -------------------------------- |
| `modelValue`    | `number`                                  | `1`      | 当前页码                         |
| `totalPage`     | `number`                                  | `1`      | 总页数（`total` 存在时被覆盖）   |
| `total`         | `number`                                  | `0`      | 总数据条数（优先于 `totalPage`） |
| `pageSize`      | `number`                                  | `10`     | 每页条数                         |
| `prevText`      | `string`                                  | `''`     | 上一页按钮文字                   |
| `nextText`      | `string`                                  | `''`     | 下一页按钮文字                   |
| `showIcon`      | `boolean`                                 | `false`  | 是否展示翻页图标                 |
| `showMessage`   | `boolean`                                 | `false`  | 是否展示文字提示                 |
| `buttonVariant` | `'base' \| 'plain' \| 'dashed' \| 'text'` | `'text'` | 分页按钮风格                     |
| `hideIfOnePage` | `boolean`                                 | `false`  | 只有一页时是否隐藏               |
| `disabled`      | `boolean`                                 | `false`  | 整控件禁用（冻结全部交互）       |
| `simple`        | `boolean`                                 | `false`  | 简单模式（无数字条）             |
| `customClass`   | `string`                                  | `''`     | 根节点自定义类名                 |
| `customStyle`   | `string`                                  | `''`     | 根节点自定义 inline style        |

## Events

| 事件名              | 说明           | 参数              |
| ------------------- | -------------- | ----------------- |
| `update:modelValue` | 页码变化时触发 | `(value: number)` |
| `change`            | 页码变化时触发 | `({ value })`     |

## Slots

| 插槽名    | 说明                                                                     |
| --------- | ------------------------------------------------------------------------ |
| `prev`    | 自定义上一页按钮，作用域 `{ modelValue, totalPageNum, total, pageSize }` |
| `size`    | 自定义中间页码区域，作用域同上                                           |
| `next`    | 自定义下一页按钮，作用域同上                                             |
| `message` | 自定义底部提示信息，`showMessage` 为 true 时生效                         |

## 主题变量

| 变量                                            | 用途                     |
| ----------------------------------------------- | ------------------------ |
| `--sn-mp-color-background-surface`              | `base` 风格按钮底色      |
| `--sn-mp-color-background-soft`                 | 激活项悬停态             |
| `--sn-mp-color-border-default`                  | `base` 风格描边          |
| `--sn-mp-color-text-secondary`                  | 普通页码文字色           |
| `--sn-mp-color-text-tertiary`                   | 省略号与提示文字色       |
| `--sn-mp-color-text-disabled`                   | 上一页 / 下一页禁用态    |
| `--sn-mp-color-action-primary`                  | 激活页码底色与按钮文字色 |
| `--sn-mp-color-text-on-primary`                 | 激活页码文字色           |
| `--sn-mp-color-background-subtle`               | 禁用态按钮底色           |
| `--sn-mp-color-border-subtle`                   | 禁用态按钮描边           |
| `--sn-mp-icon-size-medium`                      | 翻页箭头图标尺寸档位     |
| `--sn-mp-font-size-sm` / `--sn-mp-font-size-xs` | 按钮 / 提示文字字号      |
| `--sn-mp-font-weight-medium`                    | 激活页码字重             |
| `--sn-mp-radius-sm`                             | 按钮圆角                 |

## AI Patch Boundary

- AI 可通过 Patch 修改 `total` / `totalPage` / `pageSize`（影响页数推导）、`buttonVariant` / `showIcon` / `showMessage` / `disabled` / `simple` / `hideIfOnePage` 等展示配置。
- `update:modelValue` / `change` 与页码状态属于运行时绑定，Patch 不应伪造翻页事件或写死 `modelValue`。
- 插槽内容（`prev` / `size` / `next` / `message`）属于业务数据，Patch 只应调整容器配置，不应改写插槽内部结构。

## 无障碍

- 根节点 `role="navigation"` 且带 `aria-label="Pagination"`。
- 每个页码 `role="button"`，当前页额外带 `aria-current="page"`。
- 上一页 / 下一页按钮 `role="button"`，越界时 `aria-disabled="true"` 并拦住点击。
- 省略号为 `aria-hidden="true"` —— 它不承载可点击语义。
- 移动端仅 `tap` 交互，小程序无键盘焦点概念。

## 暗色模式

`sn-pagination` 的全部颜色来自 `--sn-mp-color-*`，没有浅色 `var()` 兜底，因此在 `.sn-theme-dark` 下自动适配：描边切换为暗色边框令牌，普通页码走暗色次级文本，激活页码保持主色填充与白色文字。

用 sn-config-provider 的 theme 设为 dark 包裹即可验证：

## 相关

- 列表长内容分页：配合 [`sn-sticky`](/components/uni/sticky) 固定表头
- 回到顶部：[`sn-backtop`](/components/uni/backtop)
