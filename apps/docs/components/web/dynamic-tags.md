# DynamicTags · Web（PC 端）

动态标签。tag 列表 + 内嵌添加输入，Enter 确认 / Esc 取消 / blur 提交。

## 基础用法

<Demo name="dynamic-tags-web-basic" description="添加 / 删除标签，数组 v-model。" />

## 添加流程（键盘）

<Demo name="dynamic-tags-web-flow" description="Enter 提交可连续输入，Esc 取消，blur 提交。" />

## max / closable

<Demo name="dynamic-tags-web-bounds" description="max 到界隐藏添加；closable=false 隐藏删除。" />

## 自定义渲染（slots）

<Demo name="dynamic-tags-web-slots" description="tag / trigger / empty 自定义。" />

## 禁用 / 只读

<Demo name="dynamic-tags-web-states" description="disabled 禁交互，readonly 不出添加按钮。" />

## API

### SnDynamicTags Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| modelValue | `Array<string \| number>` | `[]` | v-model，变更 emit 整个新数组 |
| closable | `boolean` | `true` | tag 可删除 |
| disabled / readonly | `boolean` | `false` | 禁用 / 只读 |
| size | `'small'\|'medium'\|'large'` | `'medium'` | 尺寸 |
| max | `number` | — | 上限（到界隐藏添加） |
| trigger | `'click'\|'focus'` | `'click'` | 打开输入的触发方式 |
| placeholder | `string` | — | 内嵌输入占位 |

事件：`update:modelValue` / `change` / `add` / `remove` / `click`（点 tag）；Slots：`input` / `tag`（scoped `{ label, index }`）/ `trigger` / `empty`。

完整契约见组件 `ai-description.md`。
