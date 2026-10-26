# Upload · Web

File upload. Four trigger shapes — button / drop area / input row / modal — with a local list state machine and a customRequest-driven upload that reports progress.

## Basic

<Demo name="upload-web-basic" description="Click/drop files into the list (no customRequest → immediate done)." />

## Drag and drop (dragger)

`dragger` swaps the compact trigger for a full dashed drop area: clicking anywhere in it opens the picker, and a drag anywhere over the component highlights and enqueues. While the upload runs the driver writes `percentage` on the entry, so the built-in list renders a determinate bar (without a percentage it stays on the indeterminate spinner).

<Demo name="upload-web-dragger" description="dragger drop area + progress animation + preview from the name or the eye affordance." />

## Input + upload

A read-only `SnInput` mirrors the picked file names while the adjacent `SnUpload` owns picking and uploading; the host draws its own list from the mirrored entries, so it can use `SnProgress` for the animation and open a real preview modal on click.

<Demo name="upload-web-input" description="Input mirror + Progress animation + click a file name to open the preview modal." />

## Upload in a modal

Wrapping the uploader in a modal lets the user collect files first and commit them on `完成` — the "attach files" pattern.

<Demo name="upload-web-dialog" description="Drag-and-drop inside a modal, committed back to the page on confirm." />

## Custom upload (customRequest)

<Demo name="upload-web-custom" description="Promise resolve/reject drives uploading → done/error." />

## Image list (listType)

<Demo name="upload-web-image" description="listType='image' thumbnails + objectURL recycling." />

## beforeUpload & max

<Demo name="upload-web-bounds" description="beforeUpload rejects entry; max hides the trigger at limit." />

## Disabled

<Demo name="upload-web-states" description="disabled." />

## Progress and preview

- **Progress**: the driver writes `percentage` (0–100, clamped) on the entry from inside `customRequest`; with `showProgress` on, that entry renders a determinate bar instead of the spinner.
- **Preview**: when an entry is previewable (`listType='image'` gives a thumbnail, or the host passed `onPreview`) the list shows an eye affordance and the entry name becomes clickable. Both paths dispatch the `preview` event; `onPreview` and `@preview` resolve to the same handler and are called once.

## API

### SnUpload Props

| Prop                | Type                           | Default  | Notes                                                                                        |
| ------------------- | ------------------------------ | -------- | -------------------------------------------------------------------------------------------- |
| multiple            | `boolean`                      | `false`  | Multiple files                                                                               |
| accept              | `string`                       | —        | Native accept                                                                                |
| disabled / readonly | `boolean`                      | `false`  | Disabled / read-only                                                                         |
| max                 | `number`                       | —        | File-count cap (hides trigger at limit)                                                      |
| showFileList        | `boolean`                      | `true`   | Show the file list                                                                           |
| listType            | `'text'\|'image'`              | `'text'` | List variant                                                                                 |
| dragger             | `boolean`                      | `false`  | Dashed drop area instead of the compact trigger (additive divergence, see ai-description.md) |
| customRequest       | `(file, fileList) => Promise`  | —        | Custom upload (absent → no network, immediate done)                                          |
| showProgress        | `boolean`                      | `true`   | Determinate bar for an uploading entry that carries `percentage`                             |
| defaultUpload       | `boolean`                      | `true`   | false → list only, manual submit                                                             |
| beforeUpload        | `(file) => boolean \| Promise` | —        | Reject to skip the list                                                                      |
| onPreview           | `(file) => void`               | —        | Click-to-preview callback (same handler as `@preview`)                                       |

### SnUploadFile

| Field                                   | Type                  | Notes                                                                    |
| --------------------------------------- | --------------------- | ------------------------------------------------------------------------ |
| id / name / size / type / file / status | —                     | Entry identity and state-machine status                                  |
| url                                     | `string \| undefined` | objectURL thumbnail for `listType='image'` (revoked on remove / unmount) |
| percentage                              | `number \| undefined` | Upload progress, written by customRequest                                |

Events: `change(fileList)` / `remove(file)` / `preview(file)`; defineExpose: `submit()`. State machine: pending → uploading → done / error. Directory/chunked upload stays out of scope (see ai-description.md).

See the component `ai-description.md` for the full contract.
