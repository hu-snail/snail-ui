# Form (uni-app / mobile)

`SnForm` orchestrates a mobile form; `SnFormItem` is one field row. They share the model, the validation rules and the layout configuration through provide / inject, and own the validate / reset / submit lifecycle.

## When to use

- You need several inputs submitted together as one business form
- You want one consistent required marker, error message and reset semantic
- You need cell-shaped field rows, or a schema describing fields and validation intent

## Basic

Hand `model` to the form and declare each field's path through `prop`. On submit the whole form validates first, then the `submit` event reports the result:

<Demo name="form-mp-basic" description="model + v-model binding; full-form validation on submit; @submit reports valid." />

## Form shapes: submit / reset

A submit-shaped form calls `submit()` (validate first, then pass); a reset-shaped form calls `resetFields()`, restoring the values captured when the fields mounted:

<Demo name="form-mp-form-type" description="Submit shape: submit() → validate → @submit; reset shape: resetFields() back to the initial snapshot." />

## Submit interception

The `submit` event carries `valid`, so the host decides whether the data may land:

<Demo name="form-mp-guard" description="A failed validation blocks the data (counted as blocked); fixing the field lets the next submit pass." />

## Field type matrix

Text, number, password, textarea, nested paths, checkbox groups and switches coexist in one form, each with its own rules:

<Demo name="form-mp-fields" description="text / digit / password / textarea / nested path profile.city / checkbox-group / switch in one form." />

## Custom slots

The `label` / `default` / `description` slots replace the label, the control and the helper copy of a row; a custom control calls `validateField()` to refresh its own message:

<Demo name="form-mp-custom" description="label slot for a composite label, default slot for a custom priority picker, description slot for custom helper copy." />

## Validation state and display strategy

Whether validation runs and whether it shows are two separate concerns: `showMessage` drops the message row, `errorType="none"` silences it, `statusIcon` puts a glyph before the message. The `validate()` return value is unaffected:

<Demo name="form-mp-state" description="Inline message / statusIcon glyph / showMessage=false / errorType=none." />

## Disabled form

`disabled` on the form cascades into every row; the fields become read-only and their values stay unchanged:

<Demo name="form-mp-disabled" description="SnForm.disabled cascades into every FormItem; the submit button is disabled with them." />

## Cell list layout

`border` draws dividers, `ellipsis` truncates long labels, `clickable` + `isLink` make the whole row tappable, `placeholder` covers empty values, `description` adds helper copy:

<Demo name="form-mp-cell" description="border divider / ellipsis truncation / clickable + isLink row / placeholder fallback / description copy." />

## Form-level defaults

`size` / `valueAlign` / `asteriskPosition` / `hideAsterisk` are set once on the form and inherited by every row:

<Demo name="form-mp-cell-style" description="size scaling, valueAlign right, asteriskPosition, hideAsterisk." />

## Inline label icons

`iconName` resolves through the icon registry, `iconData` takes `{ viewBox, paths }` directly, `iconSize` scales one icon:

<Demo name="form-mp-icon" description="iconName from the registry; inline iconData SVG; iconSize scaling one icon." />

## Label position and column width

`labelPosition` takes `left` / `right` / `top`; `labelWidth` sets the label column for the side layouts (the `top` layout ignores it):

<Demo name="form-mp-label" description="labelPosition left / right / top × labelWidth." />

## Reset and clear validation

`resetFields()` restores the initial values and clears the errors; `clearValidate()` clears the errors only and keeps the input; `validate()` returns the result of one full pass:

<Demo name="form-mp-reset-submit" description="resetFields / clearValidate / validate side by side, with the current values echoed." />

## Validation rules (FormRule)

The rule union covers required / type / pattern / length / numeric range / custom validator / async validator; each failing rule contributes its own `message`:

<Demo name="form-mp-rules" description="required / type / pattern / minLength+maxLength / min+max / validator / asyncValidator." />

## Programmatic validation

`validate()` / `validateField()` / `clearValidate()` work on the whole form, a single field or a field array; `@validate` reports the error map:

<Demo name="form-mp-validate" description="validate() / validateField(prop) / validateField([props]) / clearValidate(prop), with the @validate error map echoed." />

## Form-level configuration (schema / titleWidth / layout / center)

`titleWidth` shares one inheritance chain with `labelWidth` (titleWidth wins), `layout` places the label against the control, `center` vertically centers the control column, and `schema` describes fields on the form context:

<Demo name="form-mp-schema-layout" description="titleWidth column / layout horizontal vs vertical / center / schema on the context." />

## Validation order

Item-level rules run before the form-level rules, async rules are observable while pending, and the final result arrives through `@validate`:

<Demo name="form-mp-validation-flow" description="Item-level rules (required → async) run first, then the form-level rules (pattern / type)." />

## SnForm Props

| Prop               | Type                                   | Default        | Description                                                                  |
| ------------------ | -------------------------------------- | -------------- | ---------------------------------------------------------------------------- |
| `model`            | `Record<string, unknown>`              | —              | Form data object (required); fields point into it through `prop`.            |
| `rules`            | `FormRules`                            | `{}`           | Validation rules keyed by `prop`.                                            |
| `showMessage`      | `boolean`                              | `true`         | Render the error message row under each field.                               |
| `statusIcon`       | `boolean`                              | `false`        | Render a status glyph before the message; a row may override it.             |
| `labelPosition`    | `'left' \| 'right' \| 'top'`           | `'right'`      | Label position, inherited by every row.                                      |
| `labelWidth`       | `number \| string`                     | `'auto'`       | Label column width for the side layouts; numbers are rpx.                    |
| `disabled`         | `boolean`                              | `false`        | Disable the whole form, cascading into every row.                            |
| `validateTrigger`  | `'blur' \| 'change'`                   | `'blur'`       | Declared field-level validation trigger.                                     |
| `resetOnChange`    | `boolean`                              | `true`         | Declared flag: reset field messages after an external model change.          |
| `errorType`        | `'message' \| 'toast' \| 'none'`       | `'message'`    | Error display strategy; `none` renders no message row.                       |
| `border`           | `boolean`                              | `false`        | Draw a divider between rows.                                                 |
| `center`           | `boolean`                              | `false`        | Vertically center every row's control column.                                |
| `size`             | `'small' \| 'medium' \| 'large'`       | `'medium'`     | Default row size.                                                            |
| `valueAlign`       | `'left' \| 'right'`                    | `'left'`       | Default value alignment.                                                     |
| `asteriskPosition` | `'left' \| 'right'`                    | `'left'`       | Where the required asterisk sits.                                            |
| `hideAsterisk`     | `boolean`                              | `false`        | Hide the required asterisk.                                                  |
| `ellipsis`         | `boolean`                              | `false`        | Truncate long labels.                                                        |
| `schema`           | `Record<string, unknown> \| undefined` | `undefined`    | Form-level validation description; stored on the context, rules still apply. |
| `titleWidth`       | `number \| string \| undefined`        | `undefined`    | Left title column width; shares the inheritance chain with `labelWidth`.     |
| `layout`           | `'horizontal' \| 'vertical'`           | `'horizontal'` | Cell layout: label beside or above the control, inherited by every row.      |

> `errorType: 'none'` and `showMessage` change what is rendered. `validateTrigger` and `resetOnChange` are declarative configuration values in this build: the form does not take over the fields' blur / input events, so the host decides when to call `validate()` / `validateField()`.

## SnFormItem Props

| Prop               | Type                             | Default   | Description                                               |
| ------------------ | -------------------------------- | --------- | --------------------------------------------------------- |
| `prop`             | `string`                         | —         | Field path in the model; dotted paths such as `a.b` work. |
| `label`            | `string`                         | —         | Label text.                                               |
| `required`         | `boolean`                        | `false`   | Render the required asterisk.                             |
| `rules`            | `FormRule[]`                     | —         | Item-local rules, evaluated before the form-level ones.   |
| `showMessage`      | `boolean`                        | inherited | Override the form-level `showMessage`.                    |
| `statusIcon`       | `boolean`                        | inherited | Override the form-level `statusIcon`.                     |
| `labelWidth`       | `number \| string`               | inherited | Override the form-level column width.                     |
| `labelPosition`    | `'left' \| 'right' \| 'top'`     | inherited | Override the form-level label position.                   |
| `ariaLabel`        | `string`                         | —         | Accessible name override.                                 |
| `iconData`         | `IconData`                       | —         | Inline icon data `{ viewBox, paths }`.                    |
| `iconName`         | `string`                         | —         | Name in the icon registry.                                |
| `iconSize`         | `number \| string`               | `32`      | Icon size; numbers are rpx.                               |
| `size`             | `'small' \| 'medium' \| 'large'` | inherited | Override the form-level size.                             |
| `valueAlign`       | `'left' \| 'right'`              | inherited | Override the form-level value alignment.                  |
| `asteriskPosition` | `'left' \| 'right'`              | inherited | Override the form-level asterisk position.                |
| `hideAsterisk`     | `boolean`                        | inherited | Override the form-level asterisk hiding.                  |
| `ellipsis`         | `boolean`                        | inherited | Override the form-level truncation.                       |
| `border`           | `boolean`                        | inherited | Draw a divider under this row.                            |
| `center`           | `boolean`                        | inherited | Vertically center this row's control column.              |
| `clickable`        | `boolean`                        | `false`   | Make the whole row tappable and emit `click`.             |
| `isLink`           | `boolean`                        | `false`   | Show the right arrow.                                     |
| `placeholder`      | `string`                         | `''`      | Text shown when no default slot is provided.              |
| `description`      | `string`                         | `''`      | Helper copy under the field.                              |

> Props marked `inherited` fall back to the parent `SnForm` through provide / inject.

## Slots

### SnFormItem

| Slot          | Description                                    |
| ------------- | ---------------------------------------------- |
| `label`       | Replace the label area (composite labels too). |
| `default`     | The field control area.                        |
| `description` | Replace the helper copy under the field.       |
| `error`       | Replace the error message text.                |

### SnForm

| Slot      | Description            |
| --------- | ---------------------- |
| `default` | Field rows and actions |

## Events

### SnForm

| Event      | Payload             | When                          |
| ---------- | ------------------- | ----------------------------- |
| `validate` | `{ valid, errors }` | After every full `validate()` |
| `submit`   | `{ valid }`         | After `submit()` resolves     |
| `reset`    | —                   | After `resetFields()`         |

### SnFormItem

| Event   | Payload          | When                           |
| ------- | ---------------- | ------------------------------ |
| `click` | `(event: Event)` | Row tap, only when `clickable` |

## Methods

```ts
const formRef = ref<InstanceType<typeof SnForm> | null>(null);

await formRef.value?.validate(); // whole form, returns the result
await formRef.value?.validateField('email'); // one field
await formRef.value?.validateField(['email', 'password']); // a field array
formRef.value?.resetFields(); // restore initial values + clear errors
formRef.value?.clearValidate(); // clear every error
formRef.value?.clearValidate('email'); // clear one field's error
formRef.value?.submit(); // validate, then emit submit
```

## FormRule union

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

Rules run in array order; the first failure returns its own `message`. A string returned by `validator` / `asyncValidator` replaces the `message`.

## Theme variables

| Variable                               | Purpose                                      |
| -------------------------------------- | -------------------------------------------- |
| `--sn-mp-color-text-primary`           | Label text                                   |
| `--sn-mp-color-text-tertiary`          | Description, placeholder, arrow text         |
| `--sn-mp-color-feedback-danger`        | Required asterisk, error message, status dot |
| `--sn-mp-color-feedback-warning`       | Warning message and status dot               |
| `--sn-mp-color-feedback-success`       | Success status dot                           |
| `--sn-mp-color-border-subtle`          | Row divider                                  |
| `--sn-mp-color-background-soft`        | Pressed background on tappable rows          |
| `--sn-mp-color-text-on-primary`        | Text on the status glyph                     |
| `--sn-mp-font-size-xs` / `-sm` / `-md` | Description / label / body sizes             |
| `--sn-mp-font-line-height-normal`      | Label and message line height                |
| `--sn-mp-font-weight-semibold`         | Emphasised label weight                      |
| `--sn-mp-spacing-2` … `-5`             | Inline and inter-row spacing                 |
| `--sn-mp-radius-lg`                    | Cell corner radius                           |

The divider is driven by three overridable variables: `--sn-form-item-border-style` / `--sn-form-item-border-color` / `--sn-form-item-border-width`, defaulting to `solid` / `border-subtle` / `2rpx`.

## AI Patch Boundary

- A Patch may edit the field configuration: `label` / `prop` / `required` / `placeholder` / `description` / `labelWidth` / `labelPosition` / `rules` (including each rule's `message`).
- Form-level layout and display switches (`size` / `valueAlign` / `asteriskPosition` / `hideAsterisk` / `ellipsis` / `border` / `center` / `layout` / `titleWidth` / `labelWidth` / `showMessage` / `statusIcon`) are container configuration and may be adjusted as a whole.
- Where the `model` data comes from and where it is submitted are host responsibilities: a Patch changes how a field is presented, never the model's shape, and never fabricates a submit.
- Subscribers of `submit` / `reset` / `validate` are host business logic and must not be replaced by a Patch.
- Slot content (`label` / `default` / `description` / `error`) is business data; a Patch adjusts the container configuration only.

## Accessibility

- The message container carries `aria-live`: `assertive` for errors, `polite` otherwise.
- The required asterisk and the status glyph are `aria-hidden="true"`; the required semantic rides on the label text.
- Row roots expose `data-prop` / `data-status` so assistive tooling and automated tests can locate state.
- Mobile interaction is `tap` only — mini programs have no keyboard focus concept; on H5 the native inputs keep the browser's focus and keyboard reachability.

## Dark mode

Every colour in `SnForm` / `SnFormItem` comes from `--sn-mp-color-*` with no light literal fallback, so dark mode adapts automatically: labels move to the primary text colour, descriptions and placeholders to the secondary, dividers to the dark border token, and error messages keep the danger colour.

Wrap it in `sn-config-provider` with `theme="dark"` to verify:

```vue
<sn-config-provider theme="dark">
  <SnForm :model="form">…</SnForm>
</sn-config-provider>
```

## Related

- Text input: [`sn-input`](/en/components/uni/input)
- Number input: [`sn-input-number`](/en/components/uni/input-number)
- Checkbox / radio: [`sn-checkbox`](/en/components/uni/checkbox)
- Cell: [`sn-cell`](/en/components/uni/cell)
