# Form · Web

Form orchestrator `SnForm` + field wrapper `SnFormItem`. Provide/inject plumbing, unified validate / reset / submit.

## Basic

<Demo name="form-basic" description="Basic model + v-model + submit handler." />

## FormRule (validation)

<Demo name="form-rules" description="Every FormRule kind: required / type / pattern / length / numeric bounds / custom validator / async." />

## Label position & width

<Demo name="form-label" description="labelPosition: left / right / top + labelWidth." />

## Inline label icon

<Demo name="form-icon" description="icon / iconName props render an icon inside the label (SnIcon + lucide)." />

## Reset / validate / submit

<Demo name="form-reset-submit" description="formRef.validate() / validateField() / resetFields() / clearValidate(), html-type submit." />

## Disabled form

<Demo name="form-disabled" description="SnForm.disabled cascades into every FormItem." />

## SnForm Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `model` | `Record<string, unknown>` | (required) | Reactive model. |
| `rules` | `FormRules` | `{}` | Per-prop validation rules. |
| `novalidate` | `boolean` | `true` | Disable browser HTML5 validation. |
| `showMessage` | `boolean` | `true` | Show inline error / warning. |
| `statusIcon` | `boolean` | `false` | Status icon (Phase 1 text-only). |
| `labelPosition` | `left \| right \| top` | `right` | Form-wide label position. |
| `labelWidth` | `number \| string` | `auto` | Form-wide label column width. |

## SnFormItem Props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | Dot-path into model. |
| `label` | `string` | — | Visible label. |
| `required` | `boolean` | `false` | Render `*` marker. |
| `rules` | `FormRule[]` | — | Item-local rules (merged). |
| `showMessage` | `boolean` | inherited | Override form level. |
| `labelWidth` | `number \| string` | inherited | Override form level. |
| `labelPosition` | `left \| right \| top` | inherited | Override form level. |
| `ariaLabel` | `string` | — | Accessible name. |
| `icon` | `IconComponent` | — | Direct lucide component. |
| `iconName` | `string` | — | Resolve via `registerSnIcons`. |
| `iconSize` | `number \| string` | `14` | Pixel / CSS length. |

## FormRule union

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

The first failing rule's `message` is shown. Async rules are awaited.

## SnForm Exposed API

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()
formRef.value?.clearValidate('email')
```

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

## Source

Web renderer `@snui/vue-web`, uni renderer `@snui/uni`; FormRule type is shared across ends.