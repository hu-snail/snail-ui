# SnForm / SnFormItem (Web)

Web-end form orchestration for `@snui/vue-web`. Phase 1 contract — v3.x surface.

## When to use

Use SnForm to validate a group of fields, surface error / warning
messages, and orchestrate submit / reset. Wrap each input in an
SnFormItem to participate in the form's validation lifecycle.

## Architecture

```
SnForm
 ├─ provides FormContext (data: model, rules, label info, …)
 ├─ provides 'sn-form-api' (imperative: registerItem, validate, reset…)
 └─ SnFormItem[]
     ├─ injects FormContext
     ├─ injects 'sn-form-api'
     ├─ reads rules from context (or its own `rules` prop)
     └─ registers a FormItemHandle on the parent form
```

Two `provide` keys keep the boundary clean:
  - `FORM_CONTEXT_KEY` — pure data, safe to read in templates
  - `'sn-form-api'`     — imperative API, used by FormItem on mount

## SnForm props

| Prop          | Type                                    | Default     | Notes                                                                |
| ------------- | --------------------------------------- | ----------- | -------------------------------------------------------------------- |
| model         | `Record<string, unknown>`               | (required)  | Reactive model. Items read/write via v-model on SnInput.             |
| rules         | `FormRules`                             | `{}`         | Per-field rules keyed by `prop`.                                      |
| novalidate    | `boolean`                               | `true`       | Disable browser HTML5 validation.                                    |
| showMessage   | `boolean`                               | `true`       | Show the inline `.sn-form-item__message` line.                        |
| statusIcon    | `boolean`                               | `false`      | Show status icon (Phase 1: text only).                               |
| labelPosition | `'left' \| 'right' \| 'top'`           | `'right'`    | Inherited by all child FormItems.                                    |
| labelWidth    | `number \| string`                       | `'auto'`     | Width for left/right labels.                                         |
| disabled      | `boolean`                               | `false`      | Disables the entire form (visually + stops item validation).         |

## SnForm events

| Event     | Payload                              | When                                |
| --------- | ------------------------------------ | ----------------------------------- |
| validate  | `{ valid: boolean, errors: … }`     | After every full-form validate().   |
| reset     | —                                    | After `resetFields()`.              |
| submit    | `{ valid: boolean }`                | After form submit + validate.       |

## SnForm exposed methods

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()       // all fields
formRef.value?.clearValidate('email') // one field
```

## SnFormItem props

| Prop           | Type                   | Default       | Notes                                                |
| -------------- | ---------------------- | ------------- | ---------------------------------------------------- |
| prop           | `string`               | —             | Dot-path into form model. Required to participate.   |
| label          | `string`               | —             | Visible label.                                       |
| required       | `boolean`              | `false`       | Renders `*` marker.                                  |
| rules          | `FormRule[]`           | —             | Item-local rules merged with form rules.             |
| showMessage    | `boolean`              | inherited     | Override the form-level showMessage.                 |
| labelWidth     | `number \| string`    | inherited     | Per-item override.                                   |
| labelPosition  | `'left' \| 'right' \| 'top'` | inherited | Per-item override.                                   |
| ariaLabel      | `string`               | —             | Accessible name override.                            |

## SnFormItem slots

| Slot    | Description                                                |
| ------- | ---------------------------------------------------------- |
| default | The input element(s) for this field.                       |
| label   | Custom label content.                                      |
| error   | Custom error message content.                              |

## Form rules

Each rule is a single-purpose object with a `message` field:

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

The first failing rule's `message` is shown. Async validators are
awaited before moving to the next rule.

## Accessibility

- The wrapping `<form>` sets `novalidate` so browser HTML5 validation
  doesn't double up with our custom checks.
- `aria-live="assertive"` on error messages, `polite` on warnings.
- The label slot renders a real `<label>` element (associates by
  proximity; pair with `aria-label` on icon-only inputs).

## When NOT to use

- For a single input without submit orchestration, just use SnInput.
- For dynamic schemas from JSON, consider a schema-driven validation
  library (Phase 2 candidate).