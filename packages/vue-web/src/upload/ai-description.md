# SnUpload (Web)

Web 端文件上传组件。位于 `packages/vue-web/src/upload/`。

> 元信息（内部契约，§112.2a）：参考库 naive-ui `n-upload`
> （https://www.naiveui.com/zh-CN/light/components/upload）。
> 本版本只实现核心面；高级面见文末 out-of-scope 登记。

## 概述

`SnUpload` 提供四种触发形态——紧凑按钮（默认）、`dragger` 整块虚线拖放区、
宿主组合出的「输入框 + 上传」（见 docs 演示）、弹窗内上传——选中或拖入的
文件进入内部维护的列表（非受控内部态为主），每项展示文件名、大小、
状态（pending / uploading / done / error）、可选进度条、预览入口与移除按钮。
上传行为完全由 `customRequest` 驱动：组件自身**不发任何网络请求**；未传
`customRequest` 时文件入列后直接置为 `done`（纯本地状态模式）。

## 状态机

```text
pending ──submit/startUpload──▶ uploading ──resolve──▶ done
                                    └─────reject─────▶ error
```

- `defaultUpload: true`（默认）：文件通过 `beforeUpload` 后立即进入上传。
- `defaultUpload: false`：文件停留在 `pending`，等待 ref 上的
  `submit(fileId?)` 手动触发（不传 id 则 flush 全部 pending）。
- 无 `customRequest`：`pending` 直接翻转 `done`，不发网络请求。
- 驱动可在上传过程中往条目写 `percentage`（0–100，越界收敛）：`showProgress`
  打开时该条目渲染确定性进度条，不写则保持不确定转圈。

## Props

| Prop | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `multiple` | `boolean` | `false` | 允许一次选择 / 拖入多个文件 |
| `accept` | `string` | `''` | 透传给隐藏 file input 的 `accept`；空串不输出属性 |
| `disabled` | `boolean` | `false` | 禁用：无触发按钮、忽略拖放、无移除按钮 |
| `readonly` | `boolean` | `false` | 只读：文件可见，不可增删（视觉不加 disabled 灰） |
| `max` | `number` | — | 文件数上限；到达后隐藏触发按钮并丢弃超额文件 |
| `showFileList` | `boolean` | `true` | 是否渲染文件列表 |
| `listType` | `'text' \| 'image'` | `'text'` | `image` 形态每项渲染 objectURL 缩略图 |
| `customRequest` | `(file, fileList) => Promise<void>` | — | 自定义上传驱动；resolve → `done`，reject → `error`；未传则不发网络请求 |
| `defaultUpload` | `boolean` | `true` | `false` 时文件只入列（pending），等 `submit()` 手动上传 |
| `onBeforeUpload` | `(file) => boolean \| Promise<boolean>` | — | 单文件闸门；返回 / resolve `false`（或 throw）则该文件不入列 |
| `dragger` | `boolean` | `false` | 整块虚线拖放区替代紧凑触发按钮（追加式偏离，见「与上游的差异」） |
| `showProgress` | `boolean` | `true` | 上传中且条目带 `percentage` 时渲染确定性进度条，否则退回转圈 |
| `onPreview` | `(file: SnUploadFile) => void` | — | 点击预览回调（镜像上游 `onPreview`）；与 `@preview` 同一处理函数，只调用一次 |

## Events

| 事件 | Payload | 触发时机 |
| --- | --- | --- |
| `update:fileList` | `SnUploadFile[]` | 列表任何变更（可选拿来做受控镜像） |
| `change` | `SnUploadFile[]` | 同上 |
| `remove` | `SnUploadFile` | 某文件被移除 |
| `preview` | `SnUploadFile` | 条目预览入口被激活（名称或眼镜按钮） |

## Slots

| Slot | 说明 |
| --- | --- |
| `trigger` | 自定义触发按钮内容（替换默认「图标 + 点击上传」） |

## Methods（defineExpose）

| 方法 | 说明 |
| --- | --- |
| `submit(fileId?: string): Promise<void>` | 手动上传：不传 id flush 全部 pending；传 id 只传该条 |

## 交互语义

- **选择**：点触发按钮 → 隐藏 input `click()`；`change` 后入列并清空
  input.value（同一文件可重复选）。
- **拖放**：根元素即拖放区；`dragover` 高亮（`--dragging`），`dragleave`
  / `drop` 取消高亮；drop 的 `dataTransfer.files` 走与选择相同的入列
  管线（max / multiple / beforeUpload 全部生效）。
- **max**：列表长度到 `max` 后触发按钮隐藏；一次拖入超额部分被丢弃。
- **移除**：× 按钮，先 revoke 缩略图 objectURL 再出列，随后 emit
  `remove` + `update:fileList` / `change`。
- **进度**：`showProgress`（默认开）下，带 `percentage` 的 uploading 条目
  渲染确定性进度条（`role="progressbar"` + `aria-valuenow`），否则显示转圈。
- **预览**：条目可预览时（`listType: 'image'` 已有 objectURL 缩略图，或宿主
  传了 `onPreview`）列表右侧渲染眼镜按钮，条目名称也变成可点；两条路径都
  派发 `preview` 事件（`emit` 是唯一投递路径，避免与 `onPreview` 双调用）。
  `disabled` / `readonly` 下不渲染预览入口。

## objectURL 生命周期（§41 dispose）

`listType: 'image'` 时每个文件入列即 `URL.createObjectURL`；
- 移除该文件 → 立即 `revokeObjectURL`
- 组件卸载（onBeforeUnmount）→ 逐条 revoke 所有剩余 objectURL

## 与上游的差异（§112）

上游 `n-upload` 没有 `dragger`，也没有内置进度条与预览入口（其
`listType: 'image-card'` 的预览是另一套）。本组件的三处增补属于**追加式
偏离**：`dragger`（虚线拖放区）、`percentage` + `showProgress`（确定性
进度条）、`onPreview` + `preview` 事件（点击预览）。`customRequest`
签名（`(file, fileList) => Promise`）保持本仓库既有形态，未改成上游的
options 对象，避免破坏已发布 API；驱动通过写入条目 `percentage` 回报进度。

## Tokens

全部走 `--sn-web-upload-*` 别名，回退 `--sn-web-color-*`：

| Token | 回退 | 用途 |
| --- | --- | --- |
| `--sn-web-upload-gap` | `8px` | 触发器与列表间距 |
| `--sn-web-upload-radius` | `6px` | 拖放高亮 / 列表项圆角 |
| `--sn-web-upload-font-size` | `14px` | 列表字号 |
| `--sn-web-upload-drag-border-color` | `action-primary` | 拖放高亮描边 |
| `--sn-web-upload-drag-bg` | `background-subtle` | 拖放高亮背景 |
| `--sn-web-upload-trigger-height` / `-padding-x` / `-radius` | `32px` / `14px` / `6px` | 触发按钮几何 |
| `--sn-web-upload-trigger-border-color` / `-hover` | `border-default` / `action-primary` | 触发按钮边框 |
| `--sn-web-upload-trigger-color` / `-hover` | `text-primary` / `action-primary` | 触发按钮前景 |
| `--sn-web-upload-item-height` / `-padding-x` / `-gap` / `-bg` | `30px` / `8px` / `4px` / `background-subtle` | 列表项 |
| `--sn-web-upload-name-color` / `--sn-web-upload-size-color` | `text-primary` / `text-tertiary` | 文件名 / 大小 |
| `--sn-web-upload-status-color`(-`uploading`/-`done`/-`error`) | `text-tertiary` / `action-primary` / `feedback-success` / `feedback-danger` | 状态文本 |
| `--sn-web-upload-thumb-size` / `-radius` / `-bg` | `36px` / `4px` / `background-overlay` | 缩略图 |
| `--sn-web-upload-remove-color` / `-hover` | `text-tertiary` / `text-primary` | 移除按钮 |
| `--sn-web-focus-ring` | — | 触发按钮 focus 光圈 |

## 基本用法

```vue
<script setup lang="ts">
import { ref } from 'vue'
import SnUpload from '@/upload/SnUpload.vue'
import type { SnUploadFile } from '@/upload/sn-upload-types'

const fileList = ref<SnUploadFile[]>([])

async function upload(file: SnUploadFile): Promise<void> {
  const body = new FormData()
  body.append('file', file.file)
  await fetch('/api/upload', { method: 'POST', body })
}
</script>

<template>
  <SnUpload
    v-model:file-list="fileList"
    multiple
    :max="5"
    list-type="image"
    :custom-request="upload"
  />
</template>
```

## Accessibility

- 触发按钮为原生 `<button aria-label="Upload files">`，键盘可达。
- 隐藏 input 带 `aria-label="Choose files to upload"`。
- 每项移除按钮 `aria-label="Remove {name}"`；上传中状态用旋转 SVG
  图标（非文本），done / error 有文本状态标签。
- 图标全部内联 SVG（`sn-upload-icons.ts`），无 emoji（§113）。

## Out of Scope（登记，未实现）

以下 n-upload 高级面不在本版本（后续任务登记）：

- 拖拽上传专用大区域形态（`dragOver` slot 独立样式 / 内嵌 trigger）
- 分片上传 / 断点续传
- 目录上传（`directory-dnd`）
- `abstract` 无 UI 模式 / `input-props` 透传
- 上传进度百分比（`on-progress` / 进度条渲染）
- `show-download-button` / `show-preview-button` / `show-retry-button`
- 内建 XHR 行为（`action` / `headers` / `data` / `with-credentials` /
  `file-list` 完全受控模式）——本版本以非受控内部态 +
  `customRequest` 为核心面
- 图片裁剪 / 压缩（`on-remove` 确认、`list-type: 'image-card'`）
