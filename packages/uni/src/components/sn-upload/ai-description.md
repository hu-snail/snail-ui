# sn-sn-upload — AI-Friendly Component Description

> Human-readable + AI-parseable description of the uni-end Image / video / file picker with a tile grid, per-file status, size + count limits and upload progress. Talks to the uni-app runtime through a narrow, existence-guarded bridge so unsupported targets degrade instead of crashing..
> Consumed by `@snui/cli` and `@snui/ai` (MCP) for end-aware listing.
> **`end: mp`** marker — consumed by `list_components({ end: 'mp' })`.

## Purpose

Image / video / file picker with a tile grid, per-file status, size + count limits and upload progress. Talks to the uni-app runtime through a narrow, existence-guarded bridge so unsupported targets degrade instead of crashing.

## Reference Library

Per AGENTS.md §112, the API surface mirrors wot-ui `wd-upload`
(https://wot-ui.cn/component/upload.html). New props added here MUST also be
added to the parity list.


## Import

```vue
<!-- easycom auto-register; no import needed -->
<sn-upload v-model:file-list="files" action="/api/upload" :limit="3" :max-size="5242880" />
```

```ts
import SnUpload from '@snui/uni-src/components/sn-upload/sn-upload.vue'
import type { UploadFileItem } from '@snui/uni-src/components/sn-upload/sn-upload-types'
```


## Props

| Name | Type | Default | Description |
| --- | --- | --- | --- |
| `fileList` | `UploadFileItem[]` | `[]` | File list (`v-model:file-list`). |
| `action` / `header` / `formData` / `name` | `string` / `Record` / `Record` / `string` | `''` / `{}` / `{}` / `'file'` | `uni.uploadFile` parameters. |
| `multiple` | `boolean` | `false` | Allow picking several files. |
| `disabled` | `boolean` | `false` | Blocks picking and row actions. |
| `limit` | `number` | `0` | Max file count (`0` = unconstrained). |
| `showLimitNum` | `boolean` | `true` | Render the `current / limit` counter. |
| `maxSize` | `number` | `Number.MAX_VALUE` | Per-file byte ceiling. |
| `sourceType` / `sizeType` | `UploadSourceType[]` / `UploadSizeType[]` | `['album','camera']` / `['original','compressed']` | Picker options. |
| `beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` | function | `undefined` | Veto / transform hooks. |
| `buildFormData` | `(file) => Record` | `undefined` | Custom multipart builder. |
| `accept` | `'image' \| 'video' \| 'media' \| 'file' \| 'all'` | `'image'` | Picker API selection. |
| `imageMode` | `'scaleToFill' \| 'aspectFit' \| 'aspectFill' \| 'widthFix'` | `'aspectFit'` | Preview fit mode. |
| `customEvokeClass` / `customPreviewClass` | `string` | `''` | Tile classes. |
| `autoUpload` | `boolean` | `true` | Upload right after picking. |
| `uploadMethod` | `(file) => Promise<response>` | `undefined` | Custom transfer implementation. |
| `customClass` / `customStyle` | `string` | `''` | Root forwarding. |


## Events

| Name | Payload | When |
| --- | --- | --- |
| `update:fileList` | `(list: UploadFileItem[])` | List changed. |
| `change` | `{ fileList }` | List changed (same tick). |
| `remove` | `{ file, fileList }` | A file was removed. |
| `success` / `fail` | `{ file, response \| error }` | Transfer finished. |
| `progress` | `{ file, percent }` | Reserved for byte-level progress. |
| `oversize` | `{ file, maxSize }` | A file exceeded `maxSize`. |
| `chooseerror` | `(error)` | The picker failed (or the runtime is absent). |


## Exposed API

| Member | Signature | Description |
| --- | --- | --- |
| `submit` | `() => Promise<void>` | Upload every pending / failed file. |
| `abort` | `(task?) => void` | Abort one task, or all of them. |


## Not Implemented

`reupload`, `extension`, `compressed` / `maxDuration` (video post-processing), `loadingType` / `loadingColor` / `loadingSize`, `statusKey`, `successStatus`, `onPreviewFail` and the `preview-cover` slot.


## Tokens Consumed (end: mp)

| Token | Purpose |
| --- | --- |
| `--sn-mp-color-background-soft` | File tile fill |
| `--sn-mp-color-background-sunken` | Empty thumb |
| `--sn-mp-color-background-overlay` | Progress scrim / remove plate |
| `--sn-mp-color-border-default` | Picker tile dashes |
| `--sn-mp-color-feedback-danger` | Failed tile border |
| `--sn-mp-color-text-tertiary` | Picker glyph + counter |
| `--sn-mp-color-text-on-primary` | Progress / remove glyph |
| `--sn-mp-radius-lg` / `-md` | Tile / remove corners |


## Accessibility

- Root is `role="group"`.
- The picker tile is `role="button"` with `aria-label="choose file"` and a focusable `tabindex="0"`.
- Each remove control is `role="button"` with a per-file `aria-label`.


## Versioning

`@snui/uni@0.5.0` — initial release.
