# Form · Web（PC 端）

表单编排器 `SnForm` + 字段包装 `SnFormItem`。Provide/Inject 通讯，统一校验 / 重置 / 提交。

> **API 参考库**：[wot-ui `wd-form`](https://wot-ui.cn/component/form.html) — Props / events 1:1 (按 AGENTS.md §112)。
> 注：表单组件 web 端延续 wot-ui 1:1 是因为 form 的语义 prop（`validate-trigger` / `error-type` / `hide-asterisk` 等）与表单行为绑定强，未与 naive-ui 的 `n-form` 完全对齐。

## 基础用法

<Demo name="form-basic" description="基本 model + v-model 同步 + submit 处理。" />

## 校验规则（FormRule）

<Demo name="form-rules" description="覆盖所有 FormRule 类型：required / type / pattern / length / 自定义 validator / asyncValidator。" />

## Label 位置与宽度

<Demo name="form-label" description="labelPosition: left / right / top + labelWidth。" />

## Inline label icon

<Demo name="form-icon" description="icon / iconName prop 在 label 内渲染图标（SnIcon + lucide）。" />

## 重置 / 校验 / 提交

<Demo name="form-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate()，html-type submit。" />

## 整体禁用（disabled）

<Demo name="form-disabled" description="SnForm 的 disabled prop 级联到所有 FormItem。" />

## Cell-style（border / ellipsis / clickable / isLink）

<Demo name="form-cell" description="Cell 列表化：border 加分割线、ellipsis 长 label 截断、clickable 整行可点 + click 事件、isLink 显示 › 箭头、placeholder 占位、description 副文本。" />

## Form-level size / valueAlign / asteriskPosition / hideAsterisk

<Demo name="form-cell-style" description="Form 级统一：size 缩放、valueAlign right、asteriskPosition right、hideAsterisk 关掉 * 标记。" />

## validateTrigger / resetOnChange / errorType

<Demo name="form-validation-flow" description="validateTrigger: 'blur' | 'change'；resetOnChange 提交后自动清错误；errorType: 'message' | 'toast' | 'none'。" />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | 响应式 model，items 通过 v-model 写入。 |
| `rules` | `FormRules` | `{}` | 按 `prop` 键索引的校验规则集。 |
| `novalidate` | `boolean` | `true` | 关闭原生 HTML5 校验。 |
| `showMessage` | `boolean` | `true` | 是否显示错误 / 警告信息。 |
| `statusIcon` | `boolean` | `false` | 状态图标（Phase 1 仅文本）。 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | 全局 label 位置。 |
| `labelWidth` | `number \| string` | `'auto'` | 全局 label 列宽。 |
| `disabled` | `boolean` | `false` | 整体禁用。 |
| `validateTrigger` | `'blur' \| 'change'` | `'blur'` | 字段触发校验的时机。 |
| `resetOnChange` | `boolean` | `true` | model 变更后自动清字段错误。 |
| `errorType` | `'message' \| 'toast' \| 'none'` | `'message'` | 错误显示策略：`toast` 让宿主弹 toast；`none` 静默。 |
| `border` | `boolean` | `false` | FormItem 之间加 1px 分隔线。 |
| `center` | `boolean` | `false` | FormItem 控制列垂直居中。 |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | FormItem 默认 size。 |
| `valueAlign` | `'left' \| 'right'` | `'left'` | 默认字段值对齐。 |
| `asteriskPosition` | `'left' \| 'right'` | `'left'` | `*` 在 label 左 / 右。 |
| `hideAsterisk` | `boolean` | `false` | 隐藏 required 标记。 |
| `ellipsis` | `boolean` | `false` | 长 label 截断（text-overflow: ellipsis）。 |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | model dot-path，缺省则 item 不参与校验。 |
| `label` | `string` | — | label 文本。 |
| `required` | `boolean` | `false` | 显示 `*` 标记。 |
| `rules` | `FormRule[]` | — | item 本地规则，与 form rules 合并。 |
| `showMessage` | `boolean` | inherited | 覆盖 form 级。 |
| `labelWidth` | `number \| string` | inherited | 覆盖 form 级。 |
| `labelPosition` | `'left' \| 'right' \| 'top'` | inherited | 覆盖 form 级。 |
| `ariaLabel` | `string` | — | 屏幕阅读器名称。 |
| `icon` | `IconComponent` | — | 直接传 lucide 组件。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconSize` | `number \| string` | `14` | 像素 / CSS 长度。 |
| `size` | `'small' \| 'medium' \| 'large'` | inherited | 覆盖 form 级 size。 |
| `valueAlign` | `'left' \| 'right'` | inherited | 覆盖 form 级 valueAlign。 |
| `asteriskPosition` | `'left' \| 'right'` | inherited | 覆盖 form 级 asteriskPosition。 |
| `hideAsterisk` | `boolean` | inherited | 覆盖 form 级 hideAsterisk。 |
| `ellipsis` | `boolean` | inherited | 覆盖 form 级 ellipsis。 |
| `border` | `boolean` | inherited | 自身加底部分隔线。 |
| `center` | `boolean` | inherited | 自身垂直居中。 |
| `clickable` | `boolean` | `false` | 整行可点 → 触发 `click` 事件。 |
| `isLink` | `boolean` | `false` | 右侧显示 › 箭头（Cell 跳转风格）。 |
| `placeholder` | `string` | `''` | 当未传 default slot 时显示的占位文本。 |
| `description` | `string` | `''` | 字段下方的辅助说明文本。 |

> 标注 `inherited` 的 prop：未显式传入时，从父级 `SnForm` 通过 `provide` / `inject` 继承；显式传入则覆盖。

## FormRule 联合类型

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

首个失败的 `message` 会被显示。Async 规则会被 `await`。

## SnForm Exposed API

通过 template ref 调用：

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()       // 全部
formRef.value?.clearValidate('email') // 单个
```

## SnFormItem Events

| Event | Payload | When |
| --- | --- | --- |
| `click` | `(event: MouseEvent)` | 整行点击（仅 `clickable=true` 时）。 |

## SnForm Events

| Event | Payload | When |
| --- | --- | --- |
| `validate` | `{ valid, errors: Record<prop, message> }` | 每次全表 `validate()` 之后。 |
| `reset` | — | `resetFields()` 后。 |
| `submit` | `{ valid }` | 表单提交 + 校验完成。 |

## Accessibility

- 包裹 `<form novalidate>` 关闭原生 HTML5 校验。
- 错误信息 `aria-live="assertive"`，警告 `aria-live="polite"`。
- Label 使用原生 `<label>` 元素就近关联。
- `clickable` 行 `cursor: pointer` + hover bg，键鼠均可触发。

## Source

Web 渲染器在 `@snui/vue-web`，uni 端镜像在 `@snui/uni`，跨端共用 FormRule 类型 + validator 各自复制以避免 package 依赖。