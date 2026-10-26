# DynamicInput · Web（PC 端）

动态输入行。数组 v-model，每行独立编辑 + / − 增删，slot 自定义对象行。

## 基础用法

<Demo name="dynamic-input-web-basic" description="字符串数组，每行输入 + 增删按钮。" />

## 自定义字段（preset / onCreate）

<Demo name="dynamic-input-web-preset" description="preset 工厂创建新项，onCreate 再加工。" />

## 对象行（slot）

<Demo name="dynamic-input-web-slot" description="default slot scoped { value, index } 渲染对象行。" />

## min / max 边界

<Demo name="dynamic-input-web-bounds" description="到界隐藏 −/+ 按钮。" />

## 禁用 / 只读

<Demo name="dynamic-input-web-states" description="disabled 禁交互，readonly 冻结行结构。" />

## API

### SnDynamicInput Props

| Prop                | 类型                                                         | 默认值       | 说明                          |
| ------------------- | ------------------------------------------------------------ | ------------ | ----------------------------- |
| modelValue          | `Array<string \| number \| Record<string, unknown> \| null>` | `[]`         | v-model，变更 emit 整个新数组 |
| preset              | `() => unknown`                                              | `() => null` | 新项工厂                      |
| onCreate            | `(value, index) => unknown`                                  | —            | preset 后加工                 |
| min / max           | `number`                                                     | —            | 项数边界（到界隐藏按钮）      |
| disabled / readonly | `boolean`                                                    | `false`      | 禁用 / 只读                   |
| size                | `'mini'\|'tiny'\|'small'\|'medium'\|'large'`                 | `'medium'`   | 尺寸                          |
| status              | `'default'\|'error'\|'warning'`                              | `'default'`  | 校验状态（级联每行）          |

Slot：`default`（scoped `{ value, index }`，对象行必用）。行为注意：行 key 用 index，插入相邻行时焦点可能不迁移（naive 用内部 id），详见 ai-description.md。

完整契约见组件 `ai-description.md`。
