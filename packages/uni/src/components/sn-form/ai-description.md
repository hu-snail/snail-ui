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

| Prop             | Type                                   | Default        | Notes                                                                                                                                       |
| ---------------- | -------------------------------------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| model            | `Record<string, unknown>`              | (required)     | Reactive model.                                                                                                                             |
| rules            | `FormRules`                            | `{}`           | Per-field rules keyed by `prop`.                                                                                                            |
| showMessage      | `boolean`                              | `true`         | Show the inline `.sn-form-item__message`.                                                                                                   |
| statusIcon       | `boolean`                              | `false`        | Status glyph before the message; item-level `statusIcon` overrides it.                                                                      |
| labelPosition    | `'left' \| 'right' \| 'top'`           | `'right'`      | Inherited by all child sn-form-items.                                                                                                       |
| labelWidth       | `number \| string`                     | `'auto'`       | Width for left/right labels.                                                                                                                |
| disabled         | `boolean`                              | `false`        | Disables the entire form.                                                                                                                   |
| validateTrigger  | `'blur' \| 'change'`                   | `'blur'`       | Declared trigger only — the form does not listen to field events, so the host calls `validate()` / `validateField()` when it wants a check. |
| resetOnChange    | `boolean`                              | `true`         | Declared flag only; no automatic reset is wired in this build.                                                                              |
| errorType        | `'message' \| 'toast' \| 'none'`       | `'message'`    | `'none'` suppresses the inline message row; `'toast'` is declared but renders no toast.                                                     |
| border           | `boolean`                              | `false`        | Each item draws its own divider; the last registered item drops it.                                                                         |
| center           | `boolean`                              | `false`        | Vertically centers every item's control column.                                                                                             |
| size             | `'small' \| 'medium' \| 'large'`       | `'medium'`     | Default item size (drives label font-size / line-height).                                                                                   |
| valueAlign       | `'left' \| 'right'`                    | `'left'`       | Default value-column alignment.                                                                                                             |
| asteriskPosition | `'left' \| 'right'`                    | `'left'`       | Where the required asterisk sits.                                                                                                           |
| hideAsterisk     | `boolean`                              | `false`        | Hides the required asterisk.                                                                                                                |
| ellipsis         | `boolean`                              | `false`        | Truncates long labels.                                                                                                                      |
| schema           | `Record<string, unknown> \| undefined` | `undefined`    | Form-level schema (`wd-form` parity). Stored on the context; rules still come from `rules`.                                                 |
| titleWidth       | `number \| string \| undefined`        | `undefined`    | Left title column width (`wd-form` `title-width`); folded into the inherited `labelWidth`.                                                  |
| layout           | `'horizontal' \| 'vertical'`           | `'horizontal'` | Cell layout inherited by every child sn-form-item.                                                                                          |

## sn-form events

| Event    | Payload                         | When                                |
| -------- | ------------------------------- | ----------------------------------- |
| validate | `{ valid: boolean, errors: … }` | After every full-form validate().   |
| reset    | —                               | After `resetFields()`.              |
| submit   | `{ valid: boolean }`            | After `submit()` resolves the form. |

## sn-form exposed methods

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null);
await formRef.value?.validate();
await formRef.value?.validateField('email');
formRef.value?.resetFields();
formRef.value?.clearValidate();
formRef.value?.submit();
```

## sn-form-item props

| Prop                                                                             | Type                         | Default   | Notes                                                 |
| -------------------------------------------------------------------------------- | ---------------------------- | --------- | ----------------------------------------------------- |
| prop                                                                             | `string`                     | —         | Dot-path into form model. Required to participate.    |
| label                                                                            | `string`                     | —         | Visible label.                                        |
| required                                                                         | `boolean`                    | `false`   | Renders `*` marker.                                   |
| rules                                                                            | `FormRule[]`                 | —         | Item-local rules merged with form rules (item first). |
| showMessage                                                                      | `boolean`                    | inherited | Override form-level showMessage.                      |
| statusIcon                                                                       | `boolean`                    | inherited | Override form-level statusIcon.                       |
| labelWidth                                                                       | `number \| string`           | inherited | Per-item override.                                    |
| labelPosition                                                                    | `'left' \| 'right' \| 'top'` | inherited | Per-item override.                                    |
| ariaLabel                                                                        | `string`                     | —         | Accessible name override.                             |
| iconData                                                                         | `IconData`                   | —         | Inline `{ viewBox, paths }`.                          |
| iconName                                                                         | `string`                     | —         | Registry-resolved icon.                               |
| iconSize                                                                         | `number \| string`           | `32`      | Icon size (numbers are rpx).                          |
| size / valueAlign / asteriskPosition / hideAsterisk / ellipsis / border / center | see types                    | inherited | Each overrides the form-level value.                  |
| clickable                                                                        | `boolean`                    | `false`   | Whole row tappable, emits `click`.                    |
| isLink                                                                           | `boolean`                    | `false`   | Renders the right arrow.                              |
| placeholder                                                                      | `string`                     | `''`      | Shown when no default slot exists.                    |
| description                                                                      | `string`                     | `''`      | Helper copy under the field.                          |

## sn-form-item slots

| Slot        | Purpose                                    |
| ----------- | ------------------------------------------ |
| label       | Replace the label area (composite labels). |
| default     | The field control.                         |
| description | Replace the helper copy.                   |
| error       | Replace the error message text.            |

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
  | { asyncValidator: (value) => Promise<boolean | string>; message: string };
```

The first failing rule's `message` is shown. Async rules are awaited.

**Typing gap (follow-up)**: the `minLength` / `maxLength` arm declares both keys
as required, while `sn-form-validator.ts` treats either as optional. A rule with
only `minLength` validates correctly at runtime but fails `vue-tsc`. Demos pass
both to satisfy the type; loosening the arm to `{ minLength?: number; maxLength?: number }`
would change a shared public contract and needs a Human Gate (AGENTS.md §74).

## Accessibility

- The wrapping `<view>` does not auto-emit a real `<form>` on every
  uni target; explicit `<button type="submit">` inside the form is
  the conventional path on H5 / App. On MP targets, wire submit
  through the `submit()` exposed method.
- `aria-live="assertive"` on errors, `polite` on warnings.
