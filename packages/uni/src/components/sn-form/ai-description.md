# sn-form / sn-form-item (Uni)

Uni-end form orchestration for `@snui/uni`. Phase 1 contract — v3.x surface.

## When to use

Wrap each input in an sn-form-item, and place them inside an sn-form
to share model + validation rules. Submit with an sn-button (set
`htmlType="submit"` if you wire the form via the native submit event).

## Architecture

```
sn-form
 ├─ provides FormContext (data: model, rules, label info, …)
 ├─ provides 'sn-form-api' (imperative: registerItem, …)
 └─ sn-form-item[]
     ├─ injects FormContext
     ├─ injects 'sn-form-api'
     └─ registers a FormItemHandle on the parent form
```

Types and the rules-engine live in sibling modules
(`sn-form-types.ts`, `sn-form-validator.ts`). Mirroring the
`@snui/vue-web` package without a cross-package dep — per AGENTS.md
§58, runtime / uni packages do not import each other.

## sn-form props

| Prop          | Type                                    | Default     | Notes                                                                |
| ------------- | --------------------------------------- | ----------- | -------------------------------------------------------------------- |
| model         | `Record<string, unknown>`               | (required)  | Reactive model.                                                       |
| rules         | `FormRules`                             | `{}`         | Per-field rules keyed by `prop`.                                      |
| showMessage   | `boolean`                               | `true`       | Show the inline `.sn-form-item__message`.                             |
| statusIcon    | `boolean`                               | `false`      | Status icon (Phase 1: text only).                                     |
| labelPosition | `'left' \| 'right' \| 'top'`           | `'right'`    | Inherited by all child sn-form-items.                                |
| labelWidth    | `number \| string`                       | `'auto'`     | Width for left/right labels.                                         |
| disabled      | `boolean`                               | `false`      | Disables the entire form.                                            |

## sn-form events

| Event     | Payload                              | When                                |
| --------- | ------------------------------------ | ----------------------------------- |
| validate  | `{ valid: boolean, errors: … }`     | After every full-form validate().   |
| reset     | —                                    | After `resetFields()`.              |
| submit    | `{ valid: boolean }`                | After `submit()` resolves the form.  |

## sn-form exposed methods

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null)
await formRef.value?.validate()
await formRef.value?.validateField('email')
formRef.value?.resetFields()
formRef.value?.clearValidate()
formRef.value?.submit()
```

## sn-form-item props

| Prop           | Type                   | Default       | Notes                                                |
| -------------- | ---------------------- | ------------- | ---------------------------------------------------- |
| prop           | `string`               | —             | Dot-path into form model. Required to participate.   |
| label          | `string`               | —             | Visible label.                                       |
| required       | `boolean`              | `false`       | Renders `*` marker.                                  |
| rules          | `FormRule[]`           | —             | Item-local rules merged with form rules.             |
| showMessage    | `boolean`              | inherited     | Override form-level showMessage.                      |
| labelWidth     | `number \| string`    | inherited     | Per-item override.                                   |
| labelPosition  | `'left' \| 'right' \| 'top'` | inherited | Per-item override.                                   |
| ariaLabel      | `string`               | —             | Accessible name override.                            |

## Form rules

Identical contract to `@snui/vue-web` SnForm:

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

## Accessibility

- The wrapping `<view>` does not auto-emit a real `<form>` on every
  uni target; explicit `<button type="submit">` inside the form is
  the conventional path on H5 / App. On MP targets, wire submit
  through the `submit()` exposed method.
- `aria-live="assertive"` on errors, `polite` on warnings.