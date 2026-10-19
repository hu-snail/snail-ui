# Model Config Page ModelConfig

The model and vendor configuration page: vendor list, endpoint and credential, model inventory, and generation parameter tuning.

## When to use

- You need users to connect their own model vendors (official endpoints or self-hosted gateways)
- You need to manage several vendors and their models in one place
- You need users to tune temperature, Top P, max output, reasoning tier and streaming

## Install and on-demand loading

```ts
import { SnModelConfig } from '@snui/templates/web/model-config'
```

## Demos

### Vendors / models / parameters

The demo really adds vendors, edits the endpoint and credential, adds and removes models, switches the active model, and shows the parameter panel reacting to model capability.

<Demo name="model-config-web-basic" description="Switching models enables or disables the reasoning tier control according to that model's capability." />

## Page structure

The interface follows the order a user actually works in:

1. **Vendor list** — pick or add a vendor; shows credential state and model count, and offers a connection test
2. **Vendor detail** — edit name, endpoint and credential; manage that vendor's models
3. **Generation parameters** — tune sampling and output for the active model

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `vendors` | `SnAiVendor[]` | `undefined` | Configured vendors, each with its models. |
| `activeVendorId` | `string` | `undefined` | Currently selected vendor. |
| `activeModelId` | `string` | `undefined` | Currently active model. |
| `params` | `SnAiModelParams` | `undefined` | Generation parameters. |
| `editable` | `boolean` | `true` | Offer add / edit / delete affordances. |
| `title` | `string` | `'模型配置'` | Page heading. |
| `searchable` | `boolean` | `true` | Offer the model search box. |
| `testingVendorId` | `string` | `undefined` | The vendor under connection test; its card shows a loading state. |
| `search` | `string` | `undefined` | Model search query. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:vendors` | `SnAiVendor[]` | A vendor or one of its models changed. |
| `update:activeVendorId` | `string` | Vendor changed. |
| `update:activeModelId` | `string` | Active model changed. |
| `update:params` | `SnAiModelParams` | Generation parameters changed. |
| `update:search` | `string` | Search query changed. |
| `test-connection` | `{ vendorId }` | Ask the host to verify this vendor's endpoint and credential. |

### Slots

| Name | Props | Description |
| --- | --- | --- |
| `vendor-extra` | `{ vendor }` | Append content under a vendor card. |
| `params-extra` | `{ params }` | Append a parameter row. |

## Parameter panel

| Parameter | Range | Description |
| --- | --- | --- |
| Temperature | 0 – 2, step 0.1 | Higher means more divergent output |
| Top P | 0 – 1, step 0.01 | Nucleus sampling threshold |
| Max output | tokens | Length cap for a single answer |
| Reasoning tier | five tiers | Shows "当前模型不支持" when the picked model cannot reason |
| Streaming | on / off | Whether the answer arrives incrementally |

## Credential handling

The credential field is a password input and its value only ever lands in the vendor object the host already owns:

- The component exposes no separate credential event channel
- No code path logs the credential
- The UI shows only the "configured / not configured" state, never the credential itself

## Accessibility

- Vendor cards and model rows declare their selected state (`aria-pressed` / `aria-checked`) and can be chosen with Enter
- Credential, endpoint, name and search inputs all carry accessible names
- Icon-only buttons carry an `aria-label`
