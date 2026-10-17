# Upload · Web

File upload. Button + drop zone, local list state machine, customRequest-driven uploads.

## Basic

<Demo name="upload-web-basic" description="Click/drop files into the list (no customRequest → immediate done)." />

## Custom upload (customRequest)

<Demo name="upload-web-custom" description="Promise resolve/reject drives uploading → done/error." />

## Image list (listType)

<Demo name="upload-web-image" description="listType='image' thumbnails + objectURL recycling." />

## beforeUpload & max

<Demo name="upload-web-bounds" description="beforeUpload rejects entry; max hides the trigger at limit." />

## Disabled

<Demo name="upload-web-states" description="disabled." />

## API

### SnUpload Props

| Prop | Type | Default | Notes |
| --- | --- | --- | --- |
| multiple | `boolean` | `false` | Multiple files |
| accept | `string` | — | Native accept |
| disabled / readonly | `boolean` | `false` | Disabled / read-only |
| max | `number` | — | File-count cap (hides trigger at limit) |
| showFileList | `boolean` | `true` | Show the file list |
| listType | `'text'\|'image'` | `'text'` | List variant |
| customRequest | `(file, fileList) => Promise` | — | Custom upload (absent → no network, immediate done) |
| defaultUpload | `boolean` | `true` | false → list only, manual submit |
| beforeUpload | `(file) => boolean \| Promise` | — | Reject to skip the list |

Events: `change(fileList)` / `remove(file)`; defineExpose: `submit()`. State machine: pending → uploading → done / error. Drag-directories/chunking are out of scope (see ai-description.md).

See the component `ai-description.md` for the full contract.
