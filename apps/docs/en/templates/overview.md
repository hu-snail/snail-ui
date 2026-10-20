# Templates Overview

Templates are installable page-level compositions: they assemble the component library's primitives into a real scenario, so you mount one instead of re-implementing the page structure.

## How they differ from components

| | Components | Templates |
| --- | --- | --- |
| Granularity | A single interactive unit (button, input, list) | A whole page or page section |
| Responsibility | Rendering and interaction | Composition plus page-level behaviour (scheduling, queueing, abort) |
| Install | Same package as the library | A separate `@snui/templates` package |
| Loading | Named imports | Per-template subpath imports, only the one you mount |

Templates reuse the library's primitives throughout; they never re-implement buttons, inputs or dropdowns.

## The AI Suite

Templates currently have a single category, the **AI Suite**: it is split into one umbrella template and four sub-templates that can be used on their own.

| Template | Component | Platform | What it solves |
| --- | --- | --- | --- |
| [AI assistant](/en/templates/ai/assistant) | `SnAiAssistant` | Web | The whole AI suite on one page: conversation plus a model-config drawer in the header |
| [AI chat page](/en/templates/ai/chat) | `SnAiChat` | Web / uni-app | A complete conversation UI with queue scheduling and abort control. The web end has no model-config drawer |
| [AI prompt](/en/templates/ai/prompt) | `SnAiPrompt` | Web | A full composer: attachments, selectors, reasoning tier, queue |
| [Message list](/en/templates/ai/message-list) | `SnAiMessageList` / `SnAiMessage` | Web / uni-app | Transcript display: reasoning collapse, streaming, tool rows, retry |
| [Model config](/en/templates/ai/model-config) | `SnModelConfig` | Web | Vendor and model management plus generation parameters |

Web and uni-app differences are no longer separate pages: each template page documents them in its "End differences" section, with platform tags marking the available range.

## The unified template and its on-demand sub-templates

`SnAiAssistant` is the umbrella template of the AI Suite: inside, it *is* `SnAiChat` plus the model-config entry point and drawer. It accepts every `SnAiChat` prop and event, so switching from the chat page only means renaming the tag; `:show-model-config="false"` also reduces it to a plain chat page.

`SnAiChat` remains available as the **plain chat page** (no config entry point). For finer granularity, the three sub-templates can be imported individually:

```ts
// Composer only: your page owns the transcript
import { SnAiPrompt } from '@snui/templates/web/prompt'

// Config panel only: wrap it in your own drawer or settings page
import { SnModelConfig } from '@snui/templates/web/model-config'

// Transcript only: feed it your own streaming data
import { SnAiMessageList } from '@snui/templates/web/message-list'
```

The rule of thumb: **use the assistant / chat page for a whole page, and a sub-template when you need one block.**

## On-demand loading

Every template is an independent subpath export, loaded in three steps:

```ts
// 1) Import only the template you use: its JS and its own styles come with it
import { SnAiChat } from '@snui/templates/web/chat'

// 2) Import the shared token layer once at the app entry
import '@snui/templates/styles'

// 3) When you want to control code splitting yourself, import a single template's stylesheet
import '@snui/templates/styles/web-chat.css'
```

Styles are emitted **per template**, and there is no all-templates style barrel: importing one template brings only its own CSS.

| Per-template stylesheet | Template |
| --- | --- |
| `@snui/templates/styles/web-assistant.css` | `@snui/templates/web/assistant` |
| `@snui/templates/styles/web-chat.css` | `@snui/templates/web/chat` |
| `@snui/templates/styles/web-prompt.css` | `@snui/templates/web/prompt` |
| `@snui/templates/styles/web-message-list.css` | `@snui/templates/web/message-list` |
| `@snui/templates/styles/web-model-config.css` | `@snui/templates/web/model-config` |
| `@snui/templates/styles/uni-chat.css` | `@snui/templates/uni/chat` |
| `@snui/templates/styles/uni-message-list.css` | `@snui/templates/uni/message-list` |

When you need several templates you can also pull an end's barrel, but it brings that end's every template's JS at once, which is less precise than per-subpath imports:

```ts
import { SnAiAssistant, SnAiPrompt } from '@snui/templates/web'
```

## Templates take props

Like components, templates accept props, so one template can produce different looks and behaviours. For example the chat page can just swap its title and skin:

```vue
<SnAiChat title="Code assistant" theme="ios" :run="run" />

<SnAiAssistant title="Doc assistant" theme="default" :run="run" show-header />
```

`theme` maps onto the style pack system (`default` / `dark` / `ios` / `doodle` / `sticky-note`); finer adjustments come from overriding `--sn-web-*` (Web) / `--sn-mp-*` (uni-app) tokens, with concrete examples in each page's "Theme and token customisation" section.
