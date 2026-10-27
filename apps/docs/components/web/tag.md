# Tag · Web（PC 端）

标签组件。六色 type、可关闭、可选中（checkable）、异形形态、加载态、自定义颜色（对齐 naive-ui `n-tag`）。

## 基础用法

<Demo name="tag-web-basic" description="六色 type + 三档 size + 胶囊。" />

## 可关闭（closable）

<Demo name="tag-web-closable" description="close 事件 + 内部隐藏 + close-icon 插槽 + loading 阻止关闭。" />

## 可选中（checkable）

<Demo name="tag-web-checkable" description="v-model:checked + 选中态取 type 色 + 键盘 Enter/Space。" />

## 异形形态（shape）

<Demo name="tag-web-shapes" description="shape：square / round / skew / ribbon / fold / ticket，可与 closable / checkable / color 组合。" />

`shape` 为 AUI 追加能力（登记于 AGENTS.md §112.3a）：`skew` 平行四边形、`ribbon` 右端旗标、`fold` 右上折角、`ticket` 两侧票券缺口；`round` 保留为 `shape: 'round'` 的 sugar，同时传入时 `shape` 优先。

## 图标与头像（icon / avatar）

<Demo name="tag-web-icon" description="icon 插槽（loading 时被 spinner 替换）+ avatar 插槽。" />

## 加载中状态（loading）

<Demo name="tag-web-loading" description="loading 显示内联 spinner，关闭与选中均被阻止，aria-busy。" />

## 自定义颜色（color）

<Demo name="tag-web-color" description="color 支持 string 或 { color, borderColor, textColor } 对象；未给 textColor 时自动按对比度选字色。" />

## API

### SnTag Props

| Prop      | 类型                                                    | 默认值      | 说明                                      |
| --------- | ------------------------------------------------------- | ----------- | ----------------------------------------- |
| type      | 六色同 Text                                             | `'default'` | 颜色语义                                  |
| size      | `'small'\|'medium'\|'large'`                            | `'medium'`  | 尺寸（22/28/34px）                        |
| shape     | `'square'\|'round'\|'skew'\|'ribbon'\|'fold'\|'ticket'` | `'square'`  | 异形形态（AUI 追加）                      |
| round     | `boolean`                                               | `false`     | 胶囊（= `shape: 'round'`，`shape` 优先）  |
| closable  | `boolean`                                               | `false`     | 关闭按钮                                  |
| loading   | `boolean`                                               | `false`     | 加载态（AUI 追加；阻止 close/选中）       |
| disabled  | `boolean`                                               | `false`     | 禁用                                      |
| bordered  | `boolean`                                               | `true`      | 边框                                      |
| color     | `string \| { color?, borderColor?, textColor? }`        | —           | 自定义配色；未给 textColor 自动算对比字色 |
| checkable | `boolean`                                               | `false`     | 可选中                                    |
| checked   | `boolean`                                               | `false`     | v-model:checked（选中态取 type 色）       |

事件：`close` / `update:checked`；Slots：`default` / `icon` / `avatar` / `close-icon`。checkable 时 `role="button"` + `aria-pressed`，Enter/Space 切换；loading 时 `aria-busy` 且不可聚焦。

完整契约见组件 `ai-description.md`。
