# Infinite Scroll · Web

Scroll container that triggers a load callback near the bottom, with a
built-in pending spinner and re-entrancy guard.

## Basic

<Demo name="infinite-scroll-web-basic" description="height 240px + distance 10, append on load." />

## Chat Stream

<Demo name="infinite-scroll-web-chat" description="Message stream + pending spinner + no-more notice." />

## API

### SnInfiniteScroll Props

| Prop           | Type                          | Default     | Notes                                                                      |
| -------------- | ----------------------------- | ----------- | -------------------------------------------------------------------------- |
| distance       | `number`                      | `0`         | Bottom threshold (px) that triggers `load`                                 |
| load           | `() => Promise<void> \| void` | `undefined` | Load callback; pending promise blocks re-trigger, rejections are swallowed |
| scrollbarProps | `Record<string, unknown>`     | `undefined` | Extra attributes on the internal scroll container                          |
| showLoading    | `boolean`                     | `true`      | Show a spinner below content while pending                                 |

### SnInfiniteScroll Events

None — pass `load` as a function prop.

### SnInfiniteScroll Slots

| Slot    | Notes              |
| ------- | ------------------ |
| default | Scrollable content |

Sizing is consumer-controlled (e.g. `style="height: 240px"`); the root
element is the scroll container (`overflow: auto`).

See the component `ai-description.md` for the full contract.
