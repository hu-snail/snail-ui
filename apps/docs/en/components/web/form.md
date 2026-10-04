# Form · Web

Form orchestrator `SnForm` + field wrapper `SnFormItem`. Provide/inject plumbing, unified validate / reset / submit.

## Basic

<Demo name="form-basic" description="Basic model + v-model + submit handler." />

## FormRule (validation)

<Demo name="form-rules" description="Every FormRule kind: required / type / pattern / length / custom validator / async." />

## Label position & width

<Demo name="form-label" description="labelPosition: left / right / top + labelWidth." />

## Inline label icon

<Demo name="form-icon" description="icon / iconName props render an icon inside the label (SnIcon + lucide)." />

## Reset / validate / submit

<Demo name="form-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate(), html-type submit." />

## Disabled form

<Demo name="form-disabled" description="SnForm.disabled cascades into every FormItem." />

## Cell-style (border / ellipsis / clickable / isLink)

<Demo name="form-cell" description="Cell list: border divider, ellipsis long label, clickable row + click event, isLink right arrow, placeholder, description." />

## Form-level size / valueAlign / asteriskPosition / hideAsterisk

<Demo name="form-cell-style" description="Form-level defaults: size / valueAlign / asteriskPosition / hideAsterisk cascade to all FormItems." />

## validateTrigger / resetOnChange / errorType

<Demo name="form-validation-flow" description="validateTrigger 'blur' | 'change'; resetOnChange clears after submit; errorType 'message' | 'toast' | 'none'." />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | Reactive model. |
| `rules` | `FormRules` | `{}` | Per-prop validation rules. |
| `novalidate` | `boolean` | `true` | Disable browser HTML5 validation. |
| `showMessage` | `boolean` | `true` | Show inline error / warning. |
| `statusIcon` | `boolean` | `false` | Status icon (Phase 1 text-only). |
| `labelPosition` | `'left' \| 'right' \| 'top'` | `'right'` | Form-wide label position. |
| `labelWidth` | `number \| string` | `'auto'` | Form-wide label column width. |
| `disabled` | `boolean` | `false` | Disable whole form. |
| `validateTrigger` | `'blur' \| 'change'` | `'blur'` | When to fire field-level validation. |
| `resetOnChange` | `boolean` | `true` | Reset field errors when model changes. |
| `errorType` | `'message' \| 'toast' \| 'none'` | `'message'` | Error display strategy. |
| `border` | `boolean` | `false` | Add hairline divider between every FormItem. |
| `center` | `boolean` | `false` | Vertically center every FormItem control. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | Default FormItem size. |
| `valueAlign` | `'left' \| 'right'` | `'left'` | Default value column alignment. |
| `asteriskPosition` | `'left' \| 'right'` | `'left'` | Where the `*` sits on required labels. |
| `hideAsterisk` | `boolean` | `false` | Hide required marker. |
| `ellipsis` | `boolean` | `false` | Truncate long labels. |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | Dot-path into model. |
| `label` | `string` | — | Visible label. |
| `required` | `boolean` | `false` | Render `*` marker. |
| `rules` | `FormRule[]` | — | Item-local rules (merged). |
| `showMessage` | `boolean` | inherited | Override form level. |
| `labelWidth` | `number \| string` | inherited | Override form level. |
| `labelPosition` | `'left' \| 'right' \| 'top'` | inherited | Override form level. |
| `ariaLabel` | `string` | — | Accessible name. |
| `icon` | `IconComponent` | — | Direct lucide component. |
| `iconName` | `string` | — | Resolve via `registerSnIcons`. |
| `iconSize` | `number \| string` | `14` | Pixel / CSS length. |
| `size` | `'small' \| 'medium' \| 'large'` | inherited | Override form-level size. |
| `valueAlign` | `'left' \| 'right'` | inherited | Override form-level valueAlign. |
| `asteriskPosition` | `'left' \| 'right'` | inherited | Override form-level asteriskPosition. |
| `hideAsterisk` | `boolean` | inherited | Override form-level hideAsterisk. |
| `ellipsis` | `boolean` | inherited | Override form-level ellipsis. |
| `border` | `boolean` | inherited | Add bottom divider below this item. |
| `center` | `boolean` | inherited | Center this item vertically. |
| `clickable` | `boolean` | `false` | Whole row is clickable + emits `click`. |
| `isLink` | `boolean` | `false` | Show right arrow (Cell navigation). |
| `placeholder` | `string` | `''` | Placeholder shown when no default slot. |
| `description` | `string` | `''` | Helper text below the field. |

> Props marked `inherited` fall back to the parent `SnForm` via provide / inject when not explicitly set on the item.

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

The first failing rule's `message` is shown. Async rules are awaited.

## SnForm Exposed API

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()       // all
formRef.value?.clearValidate('email') // one
```

## SnFormItem Events

| Event | Payload | When |
| --- | --- | --- |
| `click` | `(event: MouseEvent)` | Row click (only when `clickable=true`). |

## SnForm Events

| Event | Payload | When |
| --- | --- | --- |
| `validate` | `{ valid, errors }` | After every full validate(). |
| `reset` | — | After resetFields(). |
| `submit` | `{ valid }` | After form submit + validate. |

## Accessibility

- Wrapper `<form novalidate>` disables browser HTML5 validation.
- `aria-live="assertive"` on errors, `polite` on warnings.
- Label uses native `<label>` element for proximity association.
- `clickable` rows get `cursor: pointer` + soft hover bg.

## Source

Web renderer `@snui/vue-web`, uni renderer `@snui/uni`; FormRule type shared, validator duplicated per end to avoid package cross-deps.