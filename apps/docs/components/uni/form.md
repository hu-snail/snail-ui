# Form · uni-app（多端）

`SnForm` + `SnFormItem` 提供 provide/inject 通讯，统一校验 / 重置 / 提交流程。

> **API 参考库**：[wot-ui `wd-form`](https://wot-ui.cn/component/form.html) — Props / events 1:1 对齐（按 AGENTS.md §112）。

## 基础用法

<Demo name="form-mp-basic" description="基本 model + v-model + submit 处理。" />

## 校验规则（FormRule）

<Demo name="form-mp-rules" description="覆盖所有 FormRule 类型：required / type / pattern / length / 自定义 validator / asyncValidator。" />

## Label 位置与宽度

<Demo name="form-mp-label" description="labelPosition: left / right / top + labelWidth。" />

## Inline label icon

<Demo name="form-mp-icon" description="iconData / iconName prop 在 label 内渲染图标（sn-icon shortcut dataset）。" />

## 重置 / 校验

<Demo name="form-mp-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate()。" />

## 整体禁用（disabled）

<Demo name="form-mp-disabled" description="SnForm.disabled 级联到所有 FormItem。" />

## Cell-style（border / ellipsis / clickable / isLink）

<Demo name="form-mp-cell" description="border 加 rpx 分割线、ellipsis 长 label 截断、clickable 整行可点 + click 事件、isLink 显示 › 箭头、placeholder 占位、description 副文本。" />

## Form-level size / valueAlign / asteriskPosition / hideAsterisk

<Demo name="form-mp-cell-style" description="Form 级统一：size 缩放、valueAlign right、asteriskPosition right、hideAsterisk 关掉 * 标记。" />

## validateTrigger / resetOnChange / errorType

<Demo name="form-mp-validation-flow" description="validateTrigger: 'blur' | 'change'；resetOnChange 提交后自动清错误；errorType: 'message' | 'toast' | 'none'。" />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | 响应式 model。 |
| `rules` | `FormRules` | `{}` | 校验规则集。 |
| `showMessage` | `boolean` | `true` | 显示错误信息。 |
| `statusIcon` | `boolean` | `false` | 状态图标。 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | label 位置。 |
| `labelWidth` | `number \| string` | `'auto'` | label 列宽。 |
| `disabled` | `boolean` | `false` | 整体禁用。 |
| `validateTrigger` | `'blur' \| 'change'` | `'blur'` | 字段触发校验的时机。 |
| `resetOnChange` | `boolean` | `true` | model 变更后自动清字段错误。 |
| `errorType` | `'message' \| 'toast' \| 'none'` | `'message'` | 错误显示策略。 |
| `border` | `boolean` | `false` | FormItem 之间加 rpx 分隔线。 |
| `center` | `boolean` | `false` | FormItem 控制列垂直居中。 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | FormItem 默认 size。 |
| `valueAlign` | `'left' \| 'right'` | `'left'` | 默认字段值对齐。 |
| `asteriskPosition` | `'left' \| 'right'` | `'left'` | `*` 位置。 |
| `hideAsterisk` | `boolean` | `false` | 隐藏 required 标记。 |
| `ellipsis` | `boolean` | `false` | 长 label 截断。 |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | model dot-path。 |
| `label` | `string` | — | label 文本。 |
| `required` | `boolean` | `false` | `*` 标记。 |
| `rules` | `FormRule[]` | — | item 本地规则。 |
| `labelWidth` | `number \| string` | inherited | 覆盖 form 级。 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | inherited | 覆盖 form 级。 |
| `iconData` | `IconData` | — | frozen `{ viewBox, paths }` 对象。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconSize` | `number \| string` | `32` | rpx / px 尺寸。 |
| `size` | `'small' \| 'medium' \| 'large'` | inherited | 覆盖 form 级 size。 |
| `valueAlign` | `'left' \| 'right'` | inherited | 覆盖 form 级 valueAlign。 |
| `asteriskPosition` | `'left' \| 'right'` | inherited | 覆盖 form 级 asteriskPosition。 |
| `hideAsterisk` | `boolean` | inherited | 覆盖 form 级 hideAsterisk。 |
| `ellipsis` | `boolean` | inherited | 覆盖 form 级 ellipsis。 |
| `border` | `boolean` | inherited | 自身加底部分隔线。 |
| `center` | `boolean` | inherited | 自身垂直居中。 |
| `clickable` | `boolean` | `false` | 整行可点 → 触发 `click` 事件。 |
| `isLink` | `boolean` | `false` | 右侧显示 › 箭头。 |
| `placeholder` | `string` | `''` | 未传 default slot 时显示的占位文本。 |
| `description` | `string` | `''` | 字段下方辅助说明。 |

> 标注 `inherited` 的 prop：未显式传入时从父级 `SnForm` 通过 `provide` / `inject` 继承。

## FormRule 联合类型

跟 web 端共用一套：

```ts
type FormRule =
  | { required: true; message: string }
  | { type: 'string' | 'number' | 'email' | 'url'; message: string }
  | { pattern: RegExp; message: string }
  | { minLength: number; maxLength: number; message: string }
  | { min: number; max: number; message: string }
  | { validator: (value) => boolean | string; message: string }
  | { asyncValidator: (value) => Promise<boolean | string>; message: string }
```

## SnForm Exposed API

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()
```

## SnFormItem Events

| Event | Payload | When |
| --- | --- | --- |
| `click` | `(event: Event)` | 整行点击（仅 `clickable=true` 时）。 |

## SnForm Events

| Event | Payload | When |
| --- | --- | --- |
| `validate` | `{ valid, errors }` | 每次全表 `validate()` 之后。 |
| `reset` | — | `resetFields()` 后。 |
| `submit` | `{ valid }` | 表单提交 + 校验完成。 |

## Source

Uni 渲染器在 `@snui/uni`；FormRule 跨端共享（types + validator 各自复制以避免 package 依赖）。