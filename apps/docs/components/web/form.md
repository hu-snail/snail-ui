# Form · Web（PC 端）

表单编排器 `SnForm` + 字段包装 `SnFormItem`。Provide/Inject 通讯，统一校验 / 重置 / 提交。

## 基础用法

<Demo name="form-basic" description="基本 model + v-model 同步 + submit 处理。" />

## 校验规则（FormRule）

<Demo name="form-rules" description="覆盖所有 FormRule 类型：required / type / pattern / length / numeric bounds / custom validator / asyncValidator。" />

## Label 位置与宽度

<Demo name="form-label" description="labelPosition: left / right / top + labelWidth。" />

## Inline label icon

<Demo name="form-icon" description="icon / iconName prop 在 label 内渲染图标（SnIcon + lucide）。" />

## 重置 / 校验 / 提交

<Demo name="form-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate()，html-type submit。" />

## 整体禁用（disabled）

<Demo name="form-disabled" description="SnForm 的 disabled prop 级联到所有 FormItem。" />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | 响应式 model，items 通过 v-model 写入。 |
| `rules` | `FormRules` | `{}` | 按 `prop` 键索引的校验规则集。 |
| `novalidate` | `boolean` | `true` | 关闭原生 HTML5 校验。 |
| `showMessage` | `boolean` | `true` | 是否显示错误 / 警告信息。 |
| `statusIcon` | `boolean` | `false` | 状态图标（Phase 1 仅文本）。 |
| `labelPosition` | `left \| right \| top` | `right` | 全局 label 位置。 |
| `labelWidth` | `number \| string` | `auto` | 全局 label 列宽。 |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | model dot-path，缺省则 item 不参与校验。 |
| `label` | `string` | — | label 文本。 |
| `required` | `boolean` | `false` | 显示 `*` 标记。 |
| `rules` | `FormRule[]` | — | item 本地规则，与 form rules 合并。 |
| `showMessage` | `boolean` | inherited | 覆盖 form 级。 |
| `labelWidth` | `number \| string` | inherited | 覆盖 form 级。 |
| `labelPosition` | `left \| right \| top` | inherited | 覆盖 form 级。 |
| `ariaLabel` | `string` | — | 屏幕阅读器名称。 |
| `icon` | `IconComponent` | — | 直接传 lucide 组件。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconSize` | `number \| string` | `14` | 像素 / CSS 长度。 |

## FormRule 联合类型

```ts
type FormRule =
  | { required: true; message: 'email' }
  | { type: 'string' | 'number' | 'email' | 'url'; message: 'email' }
  | { pattern: RegExp; message: 'email' }
  | { minLength: number; maxLength: number; message: 'email' }
  | { min: number; max: number; message: 'email' }
  | { validator: (value) => boolean | string; message: 'email' }
  | { asyncValidator: (value) => Promise<boolean | string>; message: 'email' }
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

## SnForm Events

| Event | Payload | When |
| --- | --- | --- |
| `validate` | `{ valid, errors: Record<prop, message> }` | 每次全表 validate() 之后。 |
| `reset` | — | `resetFields()` 后。 |
| `submit` | `{ valid }` | 表单提交 + 校验完成。 |

## Accessibility

- 包裹 `<form novalidate>` 关闭原生 HTML5 校验。
- 错误信息 `aria-live="assertive"`，警告 `aria-live="polite"`。
- Label 使用原生 `<label>` 元素就近关联。

## Source

Web 渲染器在 `@snui/vue-web`，uni 端在 `@snui/uni`，跨端共用 FormRule 类型。