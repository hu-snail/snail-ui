<script setup lang="ts">
/**
 * SnUpload — web-end file upload component.
 *
 * Reference library: naive-ui `n-upload`
 *   (https://www.naiveui.com/zh-CN/light/components/upload)
 * Core surface only (the drag-upload/chunk/directory/abstract advanced
 * faces are out of scope — see ai-description.md).
 *
 * Semantics:
 *   - trigger: default "click to upload" button (inline SVG upload glyph)
 *     + a drag zone (dragover highlight, drop adds files)
 *   - picked files enter an internal (uncontrolled) list; `update:fileList`
 *     + `change` cascade out on every mutation for hosts that want to mirror
 *   - max: file-count cap — the trigger hides once reached and drops past
 *     the cap are ignored
 *   - listType 'text' | 'image' (image creates an objectURL thumbnail)
 *   - status machine pending → uploading → done | error; a `customRequest`
 *     Promise drives it, without one no network request is made and the
 *     entry flips straight to done
 *   - defaultUpload false → files land as pending and wait for the exposed
 *     submit() (accepts an optional entry id)
 *   - beforeUpload may reject a file entirely (sync boolean or Promise)
 *
 * Per AGENTS.md §41: objectURLs created for thumbnails are revoked on
 * remove + onBeforeUnmount.
 * Per AGENTS.md §30/31: props / events / tokens / accessibility declared
 * below; CSS uses `--sn-web-upload-*` aliases falling back to
 * `--sn-web-color-*` only (0 color literals).
 */

import { computed, onBeforeUnmount, reactive, ref } from 'vue'
import type { ComponentPublicInstance } from 'vue'
import SnIcon from '../icon/SnIcon.vue'
import {
  CloseIcon,
  LoadingIcon,
  UploadIcon,
} from './sn-upload-icons'
import type {
  SnUploadBeforeUpload,
  SnUploadCustomRequest,
  SnUploadFile,
  SnUploadListType,
} from './sn-upload-types'

defineOptions({ name: 'SnUpload' })

const props = withDefaults(
  defineProps<{
    /** Allow picking / dropping several files at once. */
    multiple?: boolean
    /** `accept` attribute forwarded to the hidden file input. */
    accept?: string
    /** Disables interaction — no trigger, no drops, no removes. */
    disabled?: boolean
    /** Read-only — files visible, no adding / removing. */
    readonly?: boolean
    /** Max file count — the trigger hides once reached. */
    max?: number
    /** Show the file list (default true). */
    showFileList?: boolean
    /** List rendering style: rows, or rows with objectURL thumbnails. */
    listType?: SnUploadListType
    /**
     * Custom upload driver. Resolve → done, reject → error. Without it no
     * network request is made — the component only maintains local state.
     */
    customRequest?: SnUploadCustomRequest | undefined
    /** Auto-upload on accept (default true). false → pending until submit(). */
    defaultUpload?: boolean
    /** Per-file gate; false (or a throw) keeps the file out of the list. */
    onBeforeUpload?: SnUploadBeforeUpload | undefined
  }>(),
  {
    multiple: false,
    accept: '',
    disabled: false,
    readonly: false,
    showFileList: true,
    listType: 'text',
    customRequest: undefined,
    defaultUpload: true,
    onBeforeUpload: undefined,
  },
)

const emit = defineEmits<{
  /** Optional controlled mirror of the internal list (fires on every mutation). */
  (e: 'update:fileList', value: SnUploadFile[]): void
  /** The file list changed (add / status move / remove). */
  (e: 'change', fileList: SnUploadFile[]): void
  /** A file was removed from the list. */
  (e: 'remove', file: SnUploadFile): void
}>()

defineSlots<{
  /** Custom trigger content (replaces the default button body). */
  trigger?(): unknown
}>()

/* ─────────── State ─────────── */

/** Internal (uncontrolled) file list — the single source of truth. */
const fileList = ref<SnUploadFile[]>([])

const isDragging = ref(false)

/** Module-level seed → unique stable ids across every instance. */
let uploadFileSeed = 0

/** Hidden native input + trigger button refs. */
const inputRef = ref<HTMLInputElement | null>(null)

/** Template ref binder — VNodeRef-compatible function form (vue-tsc). */
function setInputRef(el: Element | ComponentPublicInstance | null): void {
  inputRef.value = el as HTMLInputElement | null
}

/** Chinese status label per state-machine status (uploading draws a spinner). */
function statusText(status: SnUploadFile['status']): string {
  const labels: Record<SnUploadFile['status'], string> = {
    pending: '待上传',
    uploading: '上传中',
    done: '已完成',
    error: '失败',
  }
  return labels[status]
}

const isInteractive = computed(() => !props.disabled && !props.readonly)

const isAtMax = computed(() =>
  props.max !== undefined && fileList.value.length >= props.max,
)

/** The trigger renders only when interactive and below the max cap. */
const triggerVisible = computed(() => isInteractive.value && !isAtMax.value)

/* ─────────── Helpers ─────────── */

function emitListChange(): void {
  emit('update:fileList', [...fileList.value])
  emit('change', [...fileList.value])
}

/** Format bytes into a compact human string (B / KB / MB / GB). */
function formatFileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return ''
  if (bytes < 1024) return `${bytes} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = bytes
  let unitIndex = -1
  do {
    value /= 1024
    unitIndex++
  } while (value >= 1024 && unitIndex < units.length - 1)
  const text = value >= 10 ? String(Math.round(value)) : value.toFixed(1)
  return `${text} ${units[unitIndex]}`
}

/** Revoke a thumbnail objectURL and drop the reference (§41). */
function revokeUrl(file: SnUploadFile): void {
  if (file.url !== undefined) {
    URL.revokeObjectURL(file.url)
    file.url = undefined
  }
}

/* ─────────── Accept flow ─────────── */

/**
 * Build an entry from a raw File (creating the image thumbnail URL).
 * `reactive` so later `status` writes on the local reference still trip
 * Vue's proxy set trap and re-render the list.
 */
function createEntry(file: File): SnUploadFile {
  return reactive({
    id: `sn-upload-${++uploadFileSeed}`,
    name: file.name,
    size: file.size,
    type: file.type,
    file,
    status: 'pending',
    url: props.listType === 'image' ? URL.createObjectURL(file) : undefined,
  })
}

/**
 * Core accept: enforce max/multiple, run beforeUpload, append the entry,
 * cascade events, and start the upload when defaultUpload is on.
 */
async function acceptFiles(rawFiles: File[]): Promise<void> {
  if (!isInteractive.value || rawFiles.length === 0) return

  let candidates = props.multiple ? rawFiles : rawFiles.slice(0, 1)
  if (props.max !== undefined) {
    const room = Math.max(0, props.max - fileList.value.length)
    candidates = candidates.slice(0, room)
  }
  if (candidates.length === 0) return

  const gate = props.onBeforeUpload
  for (const raw of candidates) {
    // Build the entry once — the gate may mutate nothing but must see the
    // same object the list will hold; reject revokes its thumbnail (§41).
    const entry = createEntry(raw)
    if (gate) {
      let allowed: boolean
      try {
        allowed = await gate(entry)
      } catch {
        allowed = false
      }
      if (allowed === false) {
        revokeUrl(entry)
        continue
      }
    }

    fileList.value.push(entry)
    emitListChange()
    if (props.defaultUpload) await startUpload(entry)
  }
}

function onInputChange(event: Event): void {
  const input = event.target as HTMLInputElement
  const files = Array.from(input.files ?? [])
  void acceptFiles(files)
  // Reset so picking the same file again re-fires `change`.
  input.value = ''
}

function openPicker(): void {
  if (!triggerVisible.value) return
  inputRef.value?.click()
}

/* ─────────── Drag & drop ─────────── */

function onDragOver(event: DragEvent): void {
  if (!isInteractive.value) return
  event.preventDefault()
  isDragging.value = true
}

function onDragLeave(): void {
  isDragging.value = false
}

function onDrop(event: DragEvent): void {
  isDragging.value = false
  if (!isInteractive.value) return
  event.preventDefault()
  const files = Array.from(event.dataTransfer?.files ?? [])
  void acceptFiles(files)
}

/* ─────────── Status machine ─────────── */

/** Drive one entry through uploading → done | error. */
async function startUpload(entry: SnUploadFile): Promise<void> {
  if (entry.status !== 'pending') return
  const request = props.customRequest
  if (!request) {
    // No driver → no network request; local state only.
    entry.status = 'done'
    emitListChange()
    return
  }
  entry.status = 'uploading'
  emitListChange()
  try {
    await request(entry, [...fileList.value])
    if (entry.status === 'uploading') {
      entry.status = 'done'
      emitListChange()
    }
  } catch {
    if (entry.status === 'uploading') {
      entry.status = 'error'
      emitListChange()
    }
  }
}

/**
 * Manually flush pending entries (`defaultUpload: false` flow). Accepts an
 * optional entry id; without it every pending entry starts.
 */
async function submit(fileId?: string): Promise<void> {
  if (!isInteractive.value) return
  const targets = fileList.value.filter(
    f => f.status === 'pending' && (fileId === undefined || f.id === fileId),
  )
  for (const entry of targets) await startUpload(entry)
}

/* ─────────── Remove ─────────── */

function removeFile(file: SnUploadFile): void {
  if (!isInteractive.value) return
  const index = fileList.value.indexOf(file)
  if (index === -1) return
  revokeUrl(file)
  fileList.value.splice(index, 1)
  emit('remove', file)
  emitListChange()
}

/* ─────────── Dispose (§41) ─────────── */

onBeforeUnmount(() => {
  for (const file of fileList.value) revokeUrl(file)
})

defineExpose({ submit })
</script>

<template>
  <div
    class="sn-upload"
    :class="{
      'sn-upload--disabled': disabled,
      'sn-upload--readonly': readonly,
      'sn-upload--dragging': isDragging,
    }"
    :data-snui-component="'upload'"
    :data-list-type="listType"
    @dragover="onDragOver"
    @dragleave="onDragLeave"
    @drop="onDrop"
  >
    <input
      :ref="setInputRef"
      type="file"
      class="sn-upload__input"
      :multiple="multiple"
      :accept="accept || undefined"
      :disabled="disabled"
      :aria-label="'Choose files to upload'"
      @change="onInputChange"
    >

    <button
      v-if="triggerVisible"
      type="button"
      class="sn-upload__trigger"
      aria-label="Upload files"
      @click="openPicker"
    >
      <slot name="trigger">
        <SnIcon :icon="UploadIcon" :size="14" />
        <span>点击上传</span>
      </slot>
    </button>

    <ul
      v-if="showFileList && fileList.length > 0"
      class="sn-upload__list"
    >
      <li
        v-for="file in fileList"
        :key="file.id"
        class="sn-upload__item"
        :class="`sn-upload__item--${file.status}`"
        :data-status="file.status"
      >
        <img
          v-if="listType === 'image' && file.url !== undefined"
          class="sn-upload__thumb"
          :src="file.url"
          :alt="file.name"
        >
        <span class="sn-upload__name" :title="file.name">{{ file.name }}</span>
        <span class="sn-upload__size">{{ formatFileSize(file.size) }}</span>
        <span class="sn-upload__status" :data-status="file.status">
          <SnIcon
            v-if="file.status === 'uploading'"
            :icon="LoadingIcon"
            :size="12"
            class="sn-upload__spin"
          />
          <template v-else>{{ statusText(file.status) }}</template>
        </span>
        <button
          v-if="isInteractive"
          type="button"
          class="sn-upload__remove"
          :aria-label="`Remove ${file.name}`"
          @click="removeFile(file)"
        >
          <SnIcon :icon="CloseIcon" :size="10" />
        </button>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.sn-upload {
  display: inline-flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--sn-web-upload-gap, 8px);
  font-family: inherit;
  line-height: 1.2;
  color: var(--sn-web-upload-text-color, var(--sn-web-color-text-primary));
}

/* Drag-over highlight on the whole drop zone. */
.sn-upload--dragging {
  border-radius: var(--sn-web-upload-radius, 6px);
  outline: 1px dashed var(--sn-web-upload-drag-border-color, var(--sn-web-color-action-primary));
  outline-offset: -2px;
  background-color: var(--sn-web-upload-drag-bg, var(--sn-web-color-background-subtle));
}

.sn-upload--disabled {
  cursor: not-allowed;
  color: var(--sn-web-upload-text-color-disabled, var(--sn-web-color-text-disabled));
}

.sn-upload--readonly {
  cursor: default;
}

/* Visually hidden native input (still focusable-adjacent via the button). */
.sn-upload__input {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0 0 0 0);
  white-space: nowrap;
  border: 0;
}

/* Default trigger button. */
.sn-upload__trigger {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: var(--sn-web-upload-trigger-height, 32px);
  padding: 0 var(--sn-web-upload-trigger-padding-x, 14px);
  border: 1px solid var(--sn-web-upload-trigger-border-color, var(--sn-web-color-border-default));
  border-radius: var(--sn-web-upload-trigger-radius, 6px);
  background-color: var(--sn-web-upload-trigger-bg, var(--sn-web-color-background-surface));
  color: var(--sn-web-upload-trigger-color, var(--sn-web-color-text-primary));
  font: inherit;
  font-size: var(--sn-web-upload-font-size, 14px);
  cursor: pointer;
  transition: border-color 0.15s ease-out, color 0.15s ease-out;
}

.sn-upload__trigger:hover {
  border-color: var(--sn-web-upload-trigger-border-color-hover, var(--sn-web-color-action-primary));
  color: var(--sn-web-upload-trigger-color-hover, var(--sn-web-color-action-primary));
}

.sn-upload__trigger:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px var(--sn-web-focus-ring, var(--sn-web-color-action-primary-soft));
}

/* File list. */
.sn-upload__list {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-upload-item-gap, 4px);
  margin: 0;
  padding: 0;
  list-style: none;
  width: 100%;
}

.sn-upload__item {
  display: inline-flex;
  align-items: center;
  gap: var(--sn-web-upload-item-gap, 8px);
  min-height: var(--sn-web-upload-item-height, 30px);
  padding: 0 var(--sn-web-upload-item-padding-x, 8px);
  border-radius: var(--sn-web-upload-radius, 6px);
  background-color: var(--sn-web-upload-item-bg, var(--sn-web-color-background-subtle));
  font-size: var(--sn-web-upload-font-size, 14px);
}

.sn-upload__thumb {
  width: var(--sn-web-upload-thumb-size, 36px);
  height: var(--sn-web-upload-thumb-size, 36px);
  object-fit: cover;
  border-radius: var(--sn-web-upload-thumb-radius, 4px);
  background-color: var(--sn-web-upload-thumb-bg, var(--sn-web-color-background-overlay));
  flex-shrink: 0;
}

.sn-upload__name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--sn-web-upload-name-color, var(--sn-web-color-text-primary));
}

.sn-upload__size {
  flex-shrink: 0;
  color: var(--sn-web-upload-size-color, var(--sn-web-color-text-tertiary));
  font-size: calc(1em - 2px);
}

/* Per-status color. */
.sn-upload__status {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  font-size: calc(1em - 2px);
  color: var(--sn-web-upload-status-color, var(--sn-web-color-text-tertiary));
}

.sn-upload__item--uploading .sn-upload__status {
  color: var(--sn-web-upload-status-color-uploading, var(--sn-web-color-action-primary));
}

.sn-upload__item--done .sn-upload__status {
  color: var(--sn-web-upload-status-color-done, var(--sn-web-color-feedback-success));
}

.sn-upload__item--error .sn-upload__status {
  color: var(--sn-web-upload-status-color-error, var(--sn-web-color-feedback-danger));
}

@keyframes sn-upload-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.sn-upload__spin {
  animation: sn-upload-spin 1s linear infinite;
}

/* Remove (×) button. */
.sn-upload__remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  margin-left: auto;
  border: none;
  border-radius: 50%;
  background: transparent;
  color: var(--sn-web-upload-remove-color, var(--sn-web-color-text-tertiary));
  cursor: pointer;
  line-height: 1;
  flex-shrink: 0;
}

.sn-upload__remove:hover {
  color: var(--sn-web-upload-remove-color-hover, var(--sn-web-color-text-primary));
  background-color: var(--sn-web-upload-remove-bg-hover, var(--sn-web-color-background-overlay));
}
</style>
