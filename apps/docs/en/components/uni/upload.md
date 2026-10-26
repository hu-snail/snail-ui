# Upload · uni-app

`sn-upload` is the upload component of `@snui/uni`: a tile grid, per-file status, size / count limits and upload progress. easycom auto-registration (`components/sn-upload/sn-upload.vue` → `<sn-upload>`); geometry in `rpx`. Picking and transferring files is a host capability (AGENTS.md §60), so the component only calls `uni.chooseImage` / `chooseVideo` / `chooseMessageFile` / `uploadFile` through a narrow, existence-guarded bridge — no `document` / `window` / `fetch`; when the runtime is absent it emits `chooseerror` instead of throwing.

## Basic usage

Basic upload: `v-model:file-list` holds the list, `limit` caps the count and `maxSize` caps the bytes (oversize fires otherwise).

<Demo name="upload-mp-basic" description="Basic upload: `v-model:file-list` holds the list, `limit` caps the count and `maxSize` caps the bytes (oversize fires otherwise)." />

## Disabled & status (`disabled` / `accept` / `showLimitNum`)

`disabled` locks picking and removal; `accept` switches the picker (image / video / file); list entries render progress and the failure state from `status`.

<Demo name="upload-mp-disabled-status" description="`disabled` locks picking and removal; `accept` switches the picker (image / video / file); list entries render progress and the failure state from `status`." />

## Multi-select, sources & count limits (`multiple` / `sourceType` / `sizeType` / `accept` / `limit` / `showLimitNum`)

`multiple` lets the picker return several files at once; `source-type` limits album vs camera; `size-type` picks original vs compressed; `accept` chooses which picker API is called; `limit` plus `show-limit-num` render the counter and hide the picker tile once full.

<Demo name="upload-mp-multiple-source" description="`multiple` picks several at once; `sourceType` / `sizeType` narrow the source and sizing; `accept` switches the picker API; `limit` + `showLimitNum` hides the picker tile once full." />

## Veto hooks & size ceiling (`beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` / `maxSize`)

All four hooks are "return false to veto": `before-choose` runs before the picker opens, `before-upload` before a file enters the list, `before-remove` before a row is deleted and `before-preview` before a preview. When a file exceeds `max-size` the component emits `oversize` and skips it.

<Demo name="upload-mp-before-hooks" description="`beforeChoose` / `beforeUpload` / `beforeRemove` / `beforePreview` are veto hooks (the blocked removal is verifiable in the preview); an oversized file emits `oversize`." />

## Thumbnail mode & three custom-class layers (`imageMode` / `customEvokeClass` / `customPreviewClass` / `customClass` / `customStyle`)

`image-mode` is forwarded to the thumbnail's `<image mode>`; `custom-evoke-class` restyles the picker tile, `custom-preview-class` the file tiles and `custom-class` / `custom-style` the root.

<Demo name="upload-mp-preview-custom" description="`imageMode` aspectFit / aspectFill switches the thumbnail fit; `customEvokeClass`, `customPreviewClass` and `customClass` / `customStyle` are three independent layers." />

## Request parameters & custom transfer (`action` / `header` / `name` / `formData` / `buildFormData` / `uploadMethod` / `autoUpload`)

`action` / `header` / `name` / `form-data` are `uni.uploadFile` parameters; `build-form-data` assembles multipart per file; `upload-method` takes over the transfer (the demo simulates it with a delayed Promise — no network request); with `auto-upload=false` the exposed `submit()` starts it.

<Demo name="upload-mp-request-method" description="`action` / `header` / `name` / `formData` are `uni.uploadFile` parameters; `buildFormData` builds multipart per file; `uploadMethod` simulates the transfer; `autoUpload=false` waits for `submit()`." />

## Events & the counter switch (`change` / `remove` / `progress` / `showLimitNum=false`)

`change` fires in the same tick as every list mutation (removals included); `remove` carries the removed entry plus the remaining list; `progress` is a reserved event (the component renders the scrim from `percent`); `show-limit-num=false` hides the counter.

<Demo name="upload-mp-events-counter" description="`change` fires on every list mutation; `remove` carries the removed entry; `progress` is reserved; `showLimitNum=false` hides the counter; `accept` media / all switches the picker." />

## Props

| Prop                                                               | Type                                                         | Default                                            | Description                          |
| ------------------------------------------------------------------ | ------------------------------------------------------------ | -------------------------------------------------- | ------------------------------------ |
| `fileList`                                                         | `UploadFileItem[]`                                           | `[]`                                               | File list (`v-model:file-list`)      |
| `action` / `header` / `formData` / `name`                          | `string` / `Record` / `Record` / `string`                    | `''` / `{}` / `{}` / `'file'`                      | `uni.uploadFile` parameters          |
| `multiple`                                                         | `boolean`                                                    | `false`                                            | Allow picking several files          |
| `disabled`                                                         | `boolean`                                                    | `false`                                            | Blocks picking and row actions       |
| `limit`                                                            | `number`                                                     | `0`                                                | Max file count (`0` = unconstrained) |
| `showLimitNum`                                                     | `boolean`                                                    | `true`                                             | Render the `current / limit` counter |
| `maxSize`                                                          | `number`                                                     | `Number.MAX_VALUE`                                 | Per-file byte ceiling                |
| `sourceType` / `sizeType`                                          | `UploadSourceType[]` / `UploadSizeType[]`                    | `['album','camera']` / `['original','compressed']` | Picker options                       |
| `beforeUpload` / `beforeChoose` / `beforeRemove` / `beforePreview` | function                                                     | `undefined`                                        | Veto / transform hooks               |
| `buildFormData`                                                    | `(file) => Record`                                           | `undefined`                                        | Custom multipart builder             |
| `accept`                                                           | `'image' \| 'video' \| 'media' \| 'file' \| 'all'`           | `'image'`                                          | Picker API selection                 |
| `imageMode`                                                        | `'scaleToFill' \| 'aspectFit' \| 'aspectFill' \| 'widthFix'` | `'aspectFit'`                                      | Preview fit mode                     |
| `customEvokeClass` / `customPreviewClass`                          | `string`                                                     | `''`                                               | Tile classes                         |
| `autoUpload`                                                       | `boolean`                                                    | `true`                                             | Upload right after picking           |
| `uploadMethod`                                                     | `(file) => Promise<response>`                                | `undefined`                                        | Custom transfer implementation       |
| `customClass` / `customStyle`                                      | `string`                                                     | `''`                                               | Root class / inline style            |

> **Not implemented**: `reupload`, `extension`, `compressed` / `maxDuration` (video post-processing), `loadingType` / `loadingColor` / `loadingSize`, `statusKey`, `successStatus`, `onPreviewFail` and the `preview-cover` slot.

## Events

| Event              | Description                                  | Payload                       |
| ------------------ | -------------------------------------------- | ----------------------------- |
| `update:fileList`  | List changed                                 | `(list: UploadFileItem[])`    |
| `change`           | List changed (same tick)                     | `{ fileList }`                |
| `remove`           | A file was removed                           | `{ file, fileList }`          |
| `success` / `fail` | Transfer finished                            | `{ file, response \| error }` |
| `progress`         | Reserved for byte-level progress             | `{ file, percent }`           |
| `oversize`         | A file exceeded `maxSize`                    | `{ file, maxSize }`           |
| `chooseerror`      | The picker failed (or the runtime is absent) | `(error)`                     |

## Exposed API

| Member   | Signature             | Description                        |
| -------- | --------------------- | ---------------------------------- |
| `submit` | `() => Promise<void>` | Upload every pending / failed file |
| `abort`  | `(task?) => void`     | Abort one task, or all of them     |

## Slots

This component exposes no slots.

## Theme tokens

| Token                              | Purpose                       |
| ---------------------------------- | ----------------------------- |
| `--sn-mp-color-background-soft`    | File tile fill                |
| `--sn-mp-color-background-sunken`  | Empty thumb                   |
| `--sn-mp-color-background-overlay` | Progress scrim / remove plate |
| `--sn-mp-color-border-default`     | Picker tile dashes            |
| `--sn-mp-color-feedback-danger`    | Failed tile border            |
| `--sn-mp-color-text-tertiary`      | Picker glyph + counter        |
| `--sn-mp-color-text-on-primary`    | Progress / remove glyph       |
| ``--sn-mp-radius-lg` / `-md``      | Tile / remove corners         |

## Accessibility

- Root is `role="group"`.
- The picker tile is `role="button"` with `aria-label="choose file"` and a focusable `tabindex="0"`.
- Each remove control is `role="button"` with a per-file `aria-label`.

## Dark mode

Every color resolves through a `--sn-mp-*` token and there is no light literal fallback. Under `.sn-theme-dark` / `page.sn-theme-dark` the text, surfaces, borders and state colors flip automatically. Verify with:
