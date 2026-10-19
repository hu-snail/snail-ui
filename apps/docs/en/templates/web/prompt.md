# AI Prompt AiPrompt

The AI composer: multi-line input, attachment panel, agent / permission / model selectors, reasoning-tier control, send and stop, plus the pending message queue.

## When to use

- Your page already owns its transcript and you only need a fully-featured composer
- You need attachments, agent, permission, model and reasoning tier grouped with the send action
- You need submissions to queue while a turn is still generating instead of being dropped

## Install and on-demand loading

```ts
import { SnAiPrompt } from '@snui/templates/web/prompt'
```

## Demos

### Full toolbar

The attachment panel, the three selectors, the reasoning slider, the send/stop swap and the queue row all appear in one demo.

<Demo name="ai-prompt-web-basic" description="Sending puts it into a running state; sending again shows the queue row." />

## Interaction contract

| Behaviour | Contract |
| --- | --- |
| Send | `Enter` sends; `Shift + Enter` inserts a newline |
| IME | `Enter` during an input-method composition never sends |
| Send availability | The draft has text, or at least one attachment is present |
| While running | The send button becomes stop and emits `stop` |
| Reasoning tier | The control is not rendered when the picked model cannot reason |
| Attachments | Pick images / documents from the panel; the chosen files are handed to the host via `attach` |

## API

### Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `modelValue` | `string` | `undefined` | Draft text. Use with `v-model`. |
| `attachments` | `SnAiAttachment[]` | `undefined` | Files currently attached. |
| `agents` | `SnAiAgent[]` | `undefined` | Candidates for the agent selector. |
| `agentId` | `string` | `undefined` | Currently selected agent. |
| `permissions` | `SnAiPermissionOption[]` | `undefined` | Permission options; the four standard scopes are used when omitted. |
| `permission` | `SnAiPermission` | `undefined` | Currently selected permission scope. |
| `models` | `SnAiModel[]` | `undefined` | Candidates for the model picker. |
| `modelId` | `string` | `undefined` | Currently selected model. |
| `thinkingLevel` | `SnAiThinkingLevel` | `undefined` | Reasoning tier. |
| `active` | `boolean` | `undefined` | Whether a turn is running; decides send vs stop. |
| `queued` | `SnAiQueuedTurn[]` | `undefined` | The pending queue. |
| `disabled` | `boolean` | `false` | Disable the whole composer. |
| `placeholder` | `string` | `'输入消息，Enter 发送，Shift + Enter 换行'` | Input placeholder. |
| `maxlength` | `number` | `undefined` | Maximum draft length. |
| `accept` | `string` | `undefined` | File picker accept filter. |
| `showThinking` | `boolean` | `true` | Offer the reasoning-tier control. |
| `showQueue` | `boolean` | `true` | Render the pending queue. |
| `rows` | `number` | `3` | Initial text-area rows. |

### Events

| Name | Payload | Description |
| --- | --- | --- |
| `update:modelValue` | `string` | Draft changed. |
| `update:attachments` | `SnAiAttachment[]` | Attachments added or removed. |
| `update:agentId` | `string` | Agent changed. |
| `update:permission` | `SnAiPermission` | Permission scope changed. |
| `update:modelId` | `string` | Model changed. |
| `update:thinkingLevel` | `SnAiThinkingLevel` | Reasoning tier changed. |
| `send` | `SnAiQueuedTurn` | A turn is composed and ready to run. |
| `stop` | — | Stop the running turn. |
| `remove-queued` | `string` | Remove a queued turn. |
| `attach` | `File[]` | The user picked files; uploading belongs to the host. |

### Slots

| Name | Props | Description |
| --- | --- | --- |
| `toolbar` | — | Extra controls in the toolbar. |
| `queue` | `{ turns, remove }` | Custom queue row rendering. |
| `hint` | — | Hint line under the composer. |

## Accessibility

- The composer has an accessible name; the attachment button declares `aria-haspopup` and `aria-expanded`
- Every icon-only button carries an `aria-label`
- Remove buttons on attachment and queue rows include the item's name

## Attachments

- The component never uploads; it hands the picked files to the host through `attach`
- A failed attachment row is driven by `SnAiAttachment.status` and rendered in the warning colour
