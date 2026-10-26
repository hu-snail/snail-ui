# Model Config ModelConfig

The model and vendor configuration interface: vendor list, endpoint and credential, model inventory, and generation parameter tuning. It is one embeddable config panel — drop it into a page, a drawer or a standalone settings page.

> Platform: `Web`

## When to use

- You need users to connect their own model vendors (official endpoints or self-hosted gateways)
- You need to manage several vendors and their models in one place
- You need users to tune temperature, Top P, max output, reasoning tier and streaming
- You need the panel inside a drawer or dialog rather than a separate settings page (this is how the [AI assistant](/en/templates/ai/assistant) uses it)
- You need to append your own content under a vendor card or in the parameter panel (the `vendor-extra` / `params-extra` slots)

## Install and on-demand loading

Styles are emitted **per template**: importing one template brings its own JS and its own CSS, and there is no all-templates style barrel. Three things:

```ts
// 1) Import only the template you use: its JS and its own styles come with it
import { SnModelConfig } from '@snui/templates/web/model-config';

// 2) Import the shared token layer once at the app entry
import '@snui/templates/styles';

// 3) When you want to control code splitting yourself, import a single template's stylesheet
import '@snui/templates/styles/web-model-config.css';
```

The per-template stylesheets (all under `@snui/templates/styles/`):

| File                   | Template                           |
| ---------------------- | ---------------------------------- |
| `web-model-config.css` | `@snui/templates/web/model-config` |
| `web-assistant.css`    | `@snui/templates/web/assistant`    |
| `web-chat.css`         | `@snui/templates/web/chat`         |
| `web-prompt.css`       | `@snui/templates/web/prompt`       |
| `web-message-list.css` | `@snui/templates/web/message-list` |
| `uni-chat.css`         | `@snui/templates/uni/chat`         |
| `uni-message-list.css` | `@snui/templates/uni/message-list` |

Importing `web-model-config.css` does **not** pull the chat page, composer or message list rules; the shared token layer exists once (step 2), so a second template does not download it again.

## Quick start

The smallest working version: one vendor, one model, default parameters.

```vue
<script setup lang="ts">
import { ref } from 'vue';
import { SnModelConfig } from '@snui/templates/web/model-config';
import type { SnAiModelParams, SnAiVendor } from '@snui/templates/web';

const vendors = ref<SnAiVendor[]>([
  {
    id: 'v-gateway',
    name: 'Self-hosted gateway',
    baseUrl: 'https://api.example.com/v1',
    hasCredential: true,
    models: [{ id: 'deep', name: 'Deep', vendorId: 'v-gateway', supportsThinking: true }],
  },
]);
const activeVendorId = ref('v-gateway');
const activeModelId = ref('deep');
const params = ref<SnAiModelParams>({ temperature: 0.7, topP: 1, maxTokens: 4096, stream: true });
</script>

<template>
  <SnModelConfig
    v-model:vendors="vendors"
    v-model:active-vendor-id="activeVendorId"
    v-model:active-model-id="activeModelId"
    v-model:params="params"
  />
</template>
```

## Full integration example

In real use the panel's output feeds the chat request: the host performs the real `test-connection` probe, persists vendors through `update:vendors`, and sends the selected model and parameters with the next turn.

```vue
<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { SnModelConfig } from '@snui/templates/web/model-config';
import type { SnAiModelParams, SnAiVendor } from '@snui/templates/web';

const vendors = ref<SnAiVendor[]>([]);
const activeVendorId = ref<string | undefined>(undefined);
const activeModelId = ref<string | undefined>(undefined);
const params = ref<SnAiModelParams>({ temperature: 0.7, stream: true });
const search = ref('');
/** The vendor under connection test: the panel renders a loading state on that card. */
const testingVendorId = ref<string | undefined>(undefined);

const activeVendor = computed(() => vendors.value.find((item) => item.id === activeVendorId.value));

onMounted(async () => {
  const response = await fetch('/api/model-config');
  const data = (await response.json()) as {
    vendors: SnAiVendor[];
    activeVendorId?: string;
    activeModelId?: string;
    params?: SnAiModelParams;
  };
  vendors.value = data.vendors;
  activeVendorId.value = data.activeVendorId ?? data.vendors[0]?.id;
  activeModelId.value = data.activeModelId ?? data.vendors[0]?.models?.[0]?.id;
  params.value = data.params ?? { temperature: 0.7, stream: true };
});

/** Persist: write back whenever a vendor, the active model or the parameters change. */
async function persist(): Promise<void> {
  await fetch('/api/model-config', {
    method: 'PUT',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      vendors: vendors.value,
      activeVendorId: activeVendorId.value,
      activeModelId: activeModelId.value,
      params: params.value,
    }),
  });
}

/** Connection test: the panel only reports the intent, the host does the real probe. */
async function onTestConnection({ vendorId }: { vendorId: string }): Promise<void> {
  const vendor = vendors.value.find((item) => item.id === vendorId);
  if (!vendor) return;
  testingVendorId.value = vendorId;
  try {
    const response = await fetch('/api/model-config/test', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ baseUrl: vendor.baseUrl }),
    });
    // Only the configured / not-configured state is written back; the credential never leaves the host.
    if (response.ok) {
      vendors.value = vendors.value.map((item) => (item.id === vendorId ? { ...item, hasCredential: true } : item));
    }
  } finally {
    testingVendorId.value = undefined;
    void persist();
  }
}

/** The next chat turn carries the model and parameters selected here. */
function chatBody(prompt: string): string {
  return JSON.stringify({
    prompt,
    modelId: activeModelId.value,
    temperature: params.value.temperature,
    topP: params.value.topP,
    maxTokens: params.value.maxTokens,
    thinkingLevel: params.value.thinkingLevel,
    stream: params.value.stream,
  });
}
</script>

<template>
  <SnModelConfig
    v-model:vendors="vendors"
    v-model:active-vendor-id="activeVendorId"
    v-model:active-model-id="activeModelId"
    v-model:params="params"
    v-model:search="search"
    title="Models and parameters"
    :testing-vendor-id="testingVendorId"
    @update:vendors="persist"
    @update:params="persist"
    @test-connection="onTestConnection"
  >
    <!-- Append content under a vendor card: this vendor's model count -->
    <template #vendor-extra="{ vendor }">
      <p class="hint">{{ vendor.models?.length ?? 0 }} models</p>
    </template>

    <!-- Append a row inside the parameter panel -->
    <template #params-extra="{ params: current }">
      <p class="hint">Current temperature {{ current.temperature?.toFixed(1) ?? 'default' }}</p>
    </template>
  </SnModelConfig>
</template>
```

### Page structure

The interface follows the order a user actually works in:

1. **Vendor list** — pick or add a vendor; shows credential state and model count, and offers a connection test
2. **Vendor detail** — edit name, endpoint and credential; manage that vendor's models
3. **Generation parameters** — tune sampling and output for the active model

## Demos

### Vendors / models / parameters

The demo really adds vendors, edits the endpoint and credential, adds and removes models, switches the active model, and shows the parameter panel reacting to model capability.

<Demo name="model-config-web-basic" description="Switching models enables or disables the reasoning tier control according to that model's capability." />

## API

### Props

| Name              | Type              | Default      | Description                                                       |
| ----------------- | ----------------- | ------------ | ----------------------------------------------------------------- |
| `vendors`         | `SnAiVendor[]`    | `undefined`  | Configured vendors, each with its models.                         |
| `activeVendorId`  | `string`          | `undefined`  | Currently selected vendor.                                        |
| `activeModelId`   | `string`          | `undefined`  | Currently active model.                                           |
| `params`          | `SnAiModelParams` | `undefined`  | Generation parameters.                                            |
| `editable`        | `boolean`         | `true`       | Offer add / edit / delete affordances.                            |
| `title`           | `string`          | `'模型配置'` | Page heading.                                                     |
| `searchable`      | `boolean`         | `true`       | Offer the model search box.                                       |
| `testingVendorId` | `string`          | `undefined`  | The vendor under connection test; its card shows a loading state. |
| `search`          | `string`          | `undefined`  | Model search query.                                               |

### Events

| Name                    | Payload           | Description                                                   |
| ----------------------- | ----------------- | ------------------------------------------------------------- |
| `update:vendors`        | `SnAiVendor[]`    | A vendor or one of its models changed.                        |
| `update:activeVendorId` | `string`          | Vendor changed.                                               |
| `update:activeModelId`  | `string`          | Active model changed.                                         |
| `update:params`         | `SnAiModelParams` | Generation parameters changed.                                |
| `update:search`         | `string`          | Search query changed.                                         |
| `test-connection`       | `{ vendorId }`    | Ask the host to verify this vendor's endpoint and credential. |

### Slots

| Name           | Props        | Description                         |
| -------------- | ------------ | ----------------------------------- |
| `vendor-extra` | `{ vendor }` | Append content under a vendor card. |
| `params-extra` | `{ params }` | Append a parameter row.             |

### Type exports

| Name                                                       | From                               | Description                                     |
| ---------------------------------------------------------- | ---------------------------------- | ----------------------------------------------- |
| `SnModelConfig`                                            | `@snui/templates/web/model-config` | The template component itself.                  |
| `SnAiVendor` / `SnAiModel` / `SnAiModelParams` and friends | `@snui/templates`                  | Shared contract types so a host can build data. |

### Parameter panel

| Parameter      | Range                                                  | Default | Description                                                 |
| -------------- | ------------------------------------------------------ | ------- | ----------------------------------------------------------- |
| Temperature    | 0 – 2, step 0.1                                        | 0.7     | Higher means more divergent output.                         |
| Top P          | 0 – 1, step 0.01                                       | 1       | Nucleus sampling threshold.                                 |
| Max output     | tokens                                                 | 4096    | Length cap for a single answer.                             |
| Reasoning tier | five tiers (`off` / `low` / `medium` / `high` / `max`) | `off`   | Shows "当前模型不支持" when the picked model cannot reason. |
| Streaming      | on / off                                               | on      | Whether the answer arrives incrementally.                   |

Parameter defaults only apply when the matching field is absent from `params`; the host's `params` and the panel stay in sync both ways.

## Theme and token customisation

The panel takes no `theme` prop: it inherits the app-level style pack (an ancestor `SnConfigProvider`, or a style pack mounted at the app entry), so the `--sn-web-*` aliases it consumes follow it.

```vue
<SnConfigProvider skin="ios">
  <SnModelConfig v-model:vendors="vendors" />
</SnConfigProvider>
```

To change only this block, override the `--sn-web-*` aliases:

```css
/* Fine-grained override on the config panel root */
.sn-model-config {
  --sn-web-color-background-surface: #faf7f0;
  --sn-web-color-background-subtle: #f2eee5;
  --sn-web-spacing-4: 18px;
}
```

Inside a drawer (for example the [AI assistant](/en/templates/ai/assistant)) the drawer width comes from `modelConfigWidth`, which is not a token.

## Accessibility

- Vendor cards and model rows declare their selected state (`aria-pressed` / `aria-checked`) and can be chosen with Enter
- Credential, endpoint, name and search inputs all carry accessible names
- Icon-only buttons carry an `aria-label`
- The vendor list has a region name (`aria-label="厂商列表"`) and the search box has an accessible name
- Controls become disabled rather than hidden when `editable` is `false`, so the state change is still announced

## Abort and cleanup

- The panel issues no network requests itself: connection testing, credential verification and persistence are the host's job, and the component only reports the intent (`test-connection`, `update:*`)
- Vendor and model editing are controlled data: the component keeps no copy, so replacing `vendors` is reflected across the interface
- The component registers no global listeners and creates no timers, so nothing is left behind on unmount
- `testingVendorId` only drives the loading state: clear it when the test finishes, and do not hold an external reference to that card

## FAQ

**Q: Does the credential show up in an event?**
No. The credential field is a password input and its value only lands in the vendor object the host already owns; the component exposes no separate credential event channel, no code path logs it, and the UI shows only the configured / not-configured state.

**Q: How do I stop users from editing?**
`:editable="false"` — no add / edit / delete affordances, and the parameter controls become disabled.

**Q: Do I have to implement the connection test?**
Yes. The component only fires `test-connection` and accepts `testingVendorId` to render the loading state; the real probe and its verdict belong to the host.

**Q: Do I need to build the drawer myself to embed it?**
No — use the [AI assistant](/en/templates/ai/assistant), which already has the "model config" entry point and drawer in its header and shares one vendor list with the composer's model picker.

**Q: When does the search box appear?**
When `searchable` is `true` (the default). The query is controlled by `v-model:search`, and filtering happens inside the component.
