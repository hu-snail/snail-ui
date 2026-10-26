# Tag · Web（PC 端）

标签组件。六色 type、可关闭、可选中（checkable）。

## 基础用法

<Demo name="tag-web-basic" description="六色 type + 三档 size。" />

## 可关闭（closable）

<Demo name="tag-web-closable" description="close 事件 + 内部隐藏。" />

## 可选中（checkable）

<Demo name="tag-web-checkable" description="v-model:checked + 键盘 Enter/Space。" />

## 形态

<Demo name="tag-web-shapes" description="round / bordered / disabled / color 自定义。" />

## API

### SnTag Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| type | 六色同 Text | `'default'` | 颜色语义 |
| size | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸（22/28/34px） |
| closable | `boolean` | `false` | 关闭按钮 |
| disabled | `boolean` | `false` | 禁用 |
| bordered | `boolean` | `true` | 边框 |
| round | `boolean` | `false` | 胶囊 |
| color | `string` | — | 自定义背景（覆盖 type） |
| checkable | `boolean` | `false` | 可选中 |
| checked | `boolean` | `false` | v-model:checked |

事件：`close` / `update:checked`；Slots：`default`。checkable 时 `role="button"` + `aria-pressed`，Enter/Space 切换。

完整契约见组件 `ai-description.md`。
