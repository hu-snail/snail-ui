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

## On-demand loading

Every template is an independent subpath export:

```ts
// Web: load only the AI chat page
import { SnAiChat } from '@snui/templates/web/chat'

// uni-app: load only the chat page
import { SnAiChat } from '@snui/templates/uni/chat'
```

Styles and the token layer ship with the package; import them once at the app entry:

```ts
import '@snui/templates/styles'
```

## Templates take props

Like components, templates accept props, so one template can produce different looks and behaviours. For example, the chat page can just swap its title and skin:

```vue
<SnAiChat title="Code assistant" theme="ios" :run="run" />

<SnAiChat title="Doc assistant" theme="default" :run="run" show-header />
```

## Split by end

Templates are split by end. Both ends share one message and stream contract while their layout stays end-specific:

| End | Templates | Description |
| --- | --- | --- |
| Web | AI chat page / AI prompt / Message module / Model config page | Desktop layout |
| uni-app | AI chat page / Message module | Mobile layout, sized in rpx |

## Shipped templates

| Template | What it solves |
| --- | --- |
| AI chat page | A complete conversation UI with queue scheduling and abort control |
| AI prompt | A full composer: attachments, selectors, reasoning tier, queue |
| Message module | Transcript display: reasoning collapse, streaming, tool rows, retry |
| Model config page | Vendor and model management plus generation parameters |
