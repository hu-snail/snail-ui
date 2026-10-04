# Form · uni-app

`SnForm` + `SnFormItem` for uni-app multi-end. Provide/inject plumbing, unified validate / reset / submit.

## Basic

<Demo name="form-mp-basic" description="Model + v-model + submit handler." />

## FormRule (validation)

<Demo name="form-mp-rules" description="Every FormRule kind: required / type / pattern / length / numeric bounds / custom validator / async." />

## Label position & width

<Demo name="form-mp-label" description="labelPosition: left / right / top + labelWidth." />

## Inline label icon

<Demo name="form-mp-icon" description="iconData / iconName render an icon inside the label (sn-icon shortcut dataset)." />

## Reset / validate

<Demo name="form-mp-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate()." />

## Disabled form

<Demo name="form-mp-disabled" description="SnForm.disabled cascades into every FormItem." />

## SnForm Props

| Prop | Type | Default |
| --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) |
| `rules` | `FormRules` | `{}` |
| `showMessage` | `boolean` | `true` |
| `labelPosition` | `left \| right \| top` | `right` |
| `labelWidth` | `number \| string` | `auto` |
| `disabled` | `boolean` | `false` |

## SnFormItem Props

| Prop | Type | Default |
| --- | --- | --- |
| `prop` | `string` | — |
| `label` | `string` | — |
| `required` | `boolean` | `false` |
| `rules` | `FormRule[]` | — |
| `labelWidth` | `number \| string` | inherited |
| `labelPosition` | `left \| right \| top` | inherited |
| `iconData` | `IconData` | — |
| `iconName` | `string` | — |
| `iconSize` | `number \| string` | `32` |

## FormRule union

Same as web-end (see web Form docs).

## SnForm Exposed API

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()
```

## Source

Uni renderer at `@snui/uni`. FormRule types mirrored across ends.