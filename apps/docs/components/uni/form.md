# Form · uni-app（多端）

`SnForm` + `SnFormItem` 提供 provide/inject 通讯，统一校验 / 重置 / 提交流程。

## 基础用法

<Demo name="form-mp-basic" description="基本 model + v-model + submit 处理。" />

## 校验规则（FormRule）

<Demo name="form-mp-rules" description="覆盖所有 FormRule 类型：required / type / pattern / length / numeric bounds / custom validator / asyncValidator。" />

## Label 位置与宽度

<Demo name="form-mp-label" description="labelPosition: left / right / top + labelWidth。" />

## Inline label icon

<Demo name="form-mp-icon" description="iconData / iconName prop 在 label 内渲染图标（sn-icon shortcut dataset）。" />

## 重置 / 校验

<Demo name="form-mp-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate()。" />

## 整体禁用（disabled）

<Demo name="form-mp-disabled" description="SnForm.disabled 级联到所有 FormItem。" />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | 响应式 model。 |
| `rules` | `FormRules` | `{}` | 校验规则集。 |
| `showMessage` | `boolean` | `true` | 显示错误信息。 |
| `labelPosition` | `left \| right \| top` | `right` | label 位置。 |
| `labelWidth` | `number \| string` | `auto` | label 列宽。 |
| `disabled` | `boolean` | `false` | 整体禁用。 |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | model dot-path。 |
| `label` | `string` | — | label 文本。 |
| `required` | `boolean` | `false` | * 标记。 |
| `rules` | `FormRule[]` | — | item 本地规则。 |
| `labelWidth` | `number \| string` | inherited | 覆盖 form 级。 |
| `labelPosition` | `left \| right \| top` | inherited | 覆盖 form 级。 |
| `iconData` | `IconData` | — | frozen `{ viewBox, paths }` 对象。 |
| `iconName` | `string` | — | 通过 `registerSnIcons` 解析。 |
| `iconSize` | `number \| string` | `32` | rpx / px 尺寸。 |

## FormRule 联合类型

跟 web 端共用一套：

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

## SnForm Exposed API

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()
```

## Source

Uni 渲染器在 `@snui/uni`；FormRule 跨端共享（types + validator 各自复制以避免 package 依赖）。