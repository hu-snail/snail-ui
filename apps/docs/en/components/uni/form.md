# Form · uni-app

`SnForm` + `SnFormItem` for uni-app multi-end. Provide/inject plumbing, unified validate / reset / submit.

## Basic

<Demo name="form-mp-basic" description="Model + v-model + submit handler." />

## FormRule (validation)

<Demo name="form-mp-rules" description="Every FormRule kind: required / type / pattern / length / custom validator / async." />

## Label position & width

<Demo name="form-mp-label" description="labelPosition: left / right / top + labelWidth." />

## Inline label icon

<Demo name="form-mp-icon" description="iconData / iconName render an icon inside the label (sn-icon shortcut dataset)." />

## Reset / validate

<Demo name="form-mp-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate()." />

## Disabled form

<Demo name="form-mp-disabled" description="SnForm.disabled cascades into every FormItem." />

## Cell-style (border / ellipsis / clickable / isLink)

<Demo name="form-mp-cell" description="border rpx divider, ellipsis long label, clickable row + click event, isLink right arrow, placeholder, description." />

## Form-level size / valueAlign / asteriskPosition / hideAsterisk

<Demo name="form-mp-cell-style" description="Form-level defaults cascade to every FormItem." />

## validateTrigger / resetOnChange / errorType

<Demo name="form-mp-validation-flow" description="validateTrigger 'blur' | 'change'; resetOnChange; errorType 'message' | 'toast' | 'none'." />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | Reactive model. |
| `rules` | `FormRules` | `{}` | Per-prop validation rules. |
| `showMessage` | `boolean` | `true` | Show inline error / warning. |
| `statusIcon` | `boolean` | `false` | Status icon. |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | Label position. |
| `labelWidth` | `number \| string` | `'auto'` | Label column width. |
| `disabled` | `boolean` | `false` | Disable whole form. |
| `validateTrigger` | `'blur' \| 'change'` | `'blur'` | Field validation trigger. |
| `resetOnChange` | `boolean` | `true` | Clear field errors when model changes. |
| `errorType` | `'message' \| 'toast' \| 'none'` | `'message'` | Error display strategy. |
| `border` | `boolean` | `false` | Add rpx divider between FormItems. |
| `center` | `boolean` | `false` | Vertically center every FormItem. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Default FormItem size. |
| `valueAlign` | `'left' \| 'right'` | `'left'` | Default value alignment. |
| `asteriskPosition` | `'left' \| 'right'` | `'left'` | Where `*` sits. |
| `hideAsterisk` | `boolean` | `false` | Hide required marker. |
| `ellipsis` | `boolean` | `false` | Truncate long labels. |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | Dot-path into model. |
| `label` | `string` | — | Visible label. |
| `required` | `boolean` | `false` | Render `*` marker. |
| `rules` | `FormRule[]` | — | Item-local rules. |
| `labelWidth` | `number \| string` | inherited | Override form-level. |
| `labelPosition` | `'left' \| 'right' \| 'top'` | inherited | Override form-level. |
| `iconData` | `IconData` | — | Frozen `{ viewBox, paths }`. |
| `iconName` | `string` | — | Resolved via `registerSnIcons`. |
| `iconSize` | `number \| string` | `32` | rpx / px size. |
| `size` | `'small' \| 'medium' \| 'large'` | inherited | Override form-level size. |
| `valueAlign` | `'left' \| 'right'` | inherited | Override form-level valueAlign. |
| `asteriskPosition` | `'left' \| 'right'` | inherited | Override form-level asteriskPosition. |
| `hideAsterisk` | `boolean` | inherited | Override form-level hideAsterisk. |
| `ellipsis` | `boolean` | inherited | Override form-level ellipsis. |
| `border` | `boolean` | inherited | Bottom divider below this item. |
| `center` | `boolean` | inherited | Center this item vertically. |
| `clickable` | `boolean` | `false` | Whole row clickable + emits `click`. |
| `isLink` | `boolean` | `false` | Show right arrow. |
| `placeholder` | `string` | `''` | Placeholder when no default slot. |
| `description` | `string` | `''` | Helper text below field. |

> Props marked `inherited` fall back to parent `SnForm` via provide / inject.

## FormRule union

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

First failing rule's `message` is shown. Async rules awaited.

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
| `click` | `(event)` | Row click (only when `clickable=true`). |

## SnForm Events

| Event | Payload | When |
| --- | --- | --- |
| `validate` | `{ valid, errors }` | After every full validate(). |
| `reset` | — | After resetFields(). |
| `submit` | `{ valid }` | After form submit + validate. |

## Source

Uni renderer at `@snui/uni`; FormRule types mirrored across ends (each package ships its own types / validator to avoid package cross-deps).