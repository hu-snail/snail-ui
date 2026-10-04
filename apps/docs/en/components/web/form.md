# Form · Web (PC)

Native `<form>` container + FormItem sub-components, with FormData auto-collection, field-level error echoing, and disabled / loading state cascading.

## Basic usage

<Demo name="form-web" description="Vertical Form + two FormItems (Email / Password) + submit button. Click submit triggers loading state and displays the result." />

## Form props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `layout` | `'horizontal' \| 'vertical'` | `'vertical'` | Layout direction |
| `disabled` | `boolean` | `false` | Disable entire form (cascading) |
| `loading` | `boolean` | `false` | Form loading (applies `aria-busy`) |
| `initialValues` | `Record<string, unknown>` | `{}` | Initial values (FormData still auto-collected) |
| `fields` | `FormField[]` | — | Field descriptor array; children tree is more common |
| `formId` | `string` | — | Native `<form>` element id |

## FormItem props

| Prop | Type | Default | Description |
| --- | --- | --- | --- |
| `prop` | `string` | — | **Required**. Field path for value lookup & error echo |
| `label` | `string` | — | Field label |
| `required` | `boolean` | `false` | Required, adds `*` + `aria-required` |
| `error` | `string` | — | Field error (from parent validate) |

## Validation rules (`fields[].rules`)

| Rule | Behavior |
| --- | --- |
| `required` | Value is non-empty string |
| `minLength` | Min string length |
| `maxLength` | Max string length |
| `pattern` | RegExp source (runtime compiled) |
| `message` | Custom error text |

## Events

| Event id | DOM event | Payload |
| --- | --- | --- |
| `submit` | `submit` | `Record<string, string>` (sanitized values) |
| `validate` | — | `{ valid: boolean; errors: Record<string, string> }` |

## Accessibility

| Attribute | Value |
| --- | --- |
| `role` | `form` (Form) · `group` (FormItem) |
| `keyboard` | `Enter`, `Tab` (Form) · platform-native (FormItem) |
| `aria-busy` | bound to `Form.props.loading` |
| `aria-disabled` | bound to `Form.props.disabled` |
| `aria-required` | bound to `FormItem.props.required` |
| `aria-invalid` | bound to `has-error(error)` |

## Source

Contract shared across ends, Web renderer in `@snui/vue-web`.
