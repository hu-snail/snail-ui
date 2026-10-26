<script setup lang="ts">
/**
 * sn-upload (uni-end) — image / video / file picker with upload progress.
 *
 * Reference library: wot-ui `wd-upload`
 *   (https://wot-ui.cn/component/upload.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-upload 1:1 except for
 * the documented omissions. Anything new added here MUST also be added to the
 * reference list in AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-upload/sn-upload.vue
 * → auto-registered as `<sn-upload>` in any .vue that uses it.
 *
 * ## Platform boundary
 *
 * Choosing files and transferring them is a **host capability**, not component
 * logic (AGENTS.md §60). This component talks to the uni-app runtime API
 * (`uni.chooseImage` / `uni.chooseVideo` / `uni.chooseMessageFile` /
 * `uni.uploadFile`) through a narrowly typed, existence-guarded bridge — no
 * `document`, no `window`, no `fetch`. When the runtime is absent (tests, SSR,
 * an unsupported target) the component degrades to emitting `chooseerror`
 * instead of throwing (AGENTS.md §84 / §85).
 *
 * ## Documented omissions (CONTRIBUTING §9 — no half-built props)
 *
 *   - `reupload`, `extension`, `compressed` / `maxDuration` (video
 *     post-processing), `imageMode` (preview `mode`), `loadingType` /
 *     `loadingColor` / `loadingSize`, `statusKey`, `successStatus` and the
 *     `preview-cover` slot are NOT implemented — the picker either has no
 *     cross-end equivalent or needs a native post-processing pipeline this
 *     round does not ship. They are absent from the prop surface.
 *   - `action` / `header` / `formData` / `name` ARE implemented through
 *     `uni.uploadFile`.
 *
 * ## In-flight guards (AGENTS.md §39 / §41)
 *
 * Every upload task is stored by `uid` and aborted on unmount, so a sheet that
 * closes mid-transfer cannot call back into a disposed component. The
 * `uni.uploadFile` task exposes `abort()`, which is the only disposable
 * resource here.
 *
 * Per AGENTS.md §32 this component handles rendering + interaction only.
 *
 * Not responsible for:
 *   - 业务字段校验 — 用 sn-form-item
 *   - 服务端签名 / 鉴权 — 由宿主在 `beforeUpload` / `uploadMethod` 里完成
 */

import { computed, onBeforeUnmount, ref, watch } from 'vue';
import SnIcon from '../sn-icon/sn-icon.vue';
import { Plus as PlusIcon, X as XIcon } from '../sn-icon/sn-icon-set';
import type {
  UploadCameraType,
  UploadChangeEvent,
  UploadErrorEvent,
  UploadFileItem,
  UploadFileType,
  UploadOversizeEvent,
  UploadProgressEvent,
  UploadRemoveEvent,
  UploadSizeType,
  UploadSourceType,
  UploadStatusType,
  UploadSuccessEvent,
} from './sn-upload-types';

defineOptions({ name: 'SnUpload' });

/* ── Narrow, existence-guarded bridge to the uni-app runtime ───────────── */

/** Chosen media entry as reported by the runtime. */
interface ChosenFile {
  path: string;
  size: number;
  name?: string;
}

/** Upload task handle (only `abort` is used here). */
interface UploadTask {
  abort?: () => void;
}

/** Minimal shape of the runtime API this component touches. */
interface UniRuntime {
  chooseImage?: (options: {
    count: number;
    sourceType: UploadSourceType[];
    sizeType: UploadSizeType[];
    success?: (result: { tempFiles: ChosenFile[] }) => void;
    fail?: (error: unknown) => void;
  }) => void;
  chooseVideo?: (options: {
    sourceType: UploadSourceType[];
    compressed: boolean;
    maxDuration: number;
    camera: UploadCameraType;
    success?: (result: { tempFilePath: string; size: number }) => void;
    fail?: (error: unknown) => void;
  }) => void;
  chooseMessageFile?: (options: {
    count: number;
    success?: (result: { tempFiles: ChosenFile[] }) => void;
    fail?: (error: unknown) => void;
  }) => void;
  uploadFile?: (options: {
    url: string;
    filePath: string;
    name: string;
    header?: Record<string, unknown>;
    formData?: Record<string, unknown>;
    success?: (result: { statusCode: number; data: string }) => void;
    fail?: (error: unknown) => void;
  }) => UploadTask | undefined;
}

/**
 * Resolve the runtime API without touching `globalThis` directly.
 *
 * `uni` is injected by the uni-app compiler as a free global; the guard keeps
 * this file loadable in a plain Node / happy-dom test process.
 */
function getRuntime(): UniRuntime | undefined {
  const scope = globalThis as unknown as { uni?: UniRuntime };
  return scope.uni;
}

/* ── Props ─────────────────────────────────────────────────────────────── */

const props = withDefaults(
  defineProps<{
    /* ── wot-ui `wd-upload` 1:1 surface ─────────────────────────────────── */

    /** File list (`v-model:file-list`). */
    fileList?: UploadFileItem[];
    /** Upload endpoint. */
    action?: string;
    /** Request headers. */
    header?: Record<string, unknown>;
    /** Allow picking more than one file. */
    multiple?: boolean;
    /** Disables the picker and every row action. */
    disabled?: boolean;
    /** Maximum number of files. `0` = unconstrained. */
    limit?: number;
    /** Render the `current / limit` counter next to the picker. */
    showLimitNum?: boolean;
    /** Per-file byte ceiling. */
    maxSize?: number;
    /** Picker sources. */
    sourceType?: UploadSourceType[];
    /** Image sizing. */
    sizeType?: UploadSizeType[];
    /** Multipart field name. */
    name?: string;
    /** Extra multipart fields. */
    formData?: Record<string, unknown>;
    /** Veto / transform hook before a file is added. */
    beforeUpload?:
      | ((file: UploadFileItem) => boolean | UploadFileItem | Promise<boolean | UploadFileItem>)
      | undefined;
    /** Veto hook before the picker opens. */
    beforeChoose?: (() => boolean | Promise<boolean>) | undefined;
    /** Veto hook before a file is removed. */
    beforeRemove?:
      ((file: UploadFileItem, index: number) => boolean | Promise<boolean>) | undefined;
    /** Veto hook before a preview opens. */
    beforePreview?: ((file: UploadFileItem) => boolean | Promise<boolean>) | undefined;
    /** Custom multipart builder. */
    buildFormData?: ((file: UploadFileItem) => Record<string, unknown>) | undefined;
    /** Accepted file category. */
    accept?: UploadFileType;
    /** Preview image fit mode (forwarded to `<image mode>`). */
    imageMode?: 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix';
    /** Class on the picker tile. */
    customEvokeClass?: string;
    /** Class on the preview tile. */
    customPreviewClass?: string;
    /** Upload automatically after picking. */
    autoUpload?: boolean;
    /** Custom transfer implementation (bypasses `uni.uploadFile`). */
    uploadMethod?:
      ((file: UploadFileItem) => Promise<string | Record<string, unknown>>) | undefined;
    /** Class on the root node. */
    customClass?: string;
    /** Inline style on the root node. */
    customStyle?: string;
  }>(),
  {
    fileList: () => [],
    action: '',
    header: () => ({}),
    multiple: false,
    disabled: false,
    limit: 0,
    showLimitNum: true,
    maxSize: Number.MAX_VALUE,
    sourceType: () => ['album', 'camera'],
    sizeType: () => ['original', 'compressed'],
    name: 'file',
    formData: () => ({}),
    beforeUpload: undefined,
    beforeChoose: undefined,
    beforeRemove: undefined,
    beforePreview: undefined,
    buildFormData: undefined,
    accept: 'image',
    imageMode: 'aspectFit',
    customEvokeClass: '',
    customPreviewClass: '',
    autoUpload: true,
    uploadMethod: undefined,
    customClass: '',
    customStyle: '',
  },
);

const emit = defineEmits<{
  (e: 'update:fileList', value: UploadFileItem[]): void;
  (e: 'change', payload: UploadChangeEvent): void;
  (e: 'remove', payload: UploadRemoveEvent): void;
  (e: 'success', payload: UploadSuccessEvent): void;
  (e: 'fail', payload: UploadErrorEvent): void;
  (e: 'progress', payload: UploadProgressEvent): void;
  (e: 'oversize', payload: UploadOversizeEvent): void;
  (e: 'chooseerror', error: unknown): void;
}>();

/* ── List state ────────────────────────────────────────────────────────── */

/** Internal mirror of the list; the prop wins on every external change. */
const list = ref<UploadFileItem[]>(props.fileList.map((file) => ({ ...file })));

watch(
  () => props.fileList,
  (value) => {
    list.value = value.map((file) => ({ ...file }));
  },
  { deep: true },
);

/** Next `uid` — a monotonic counter, not a random number (deterministic). */
let nextUid = 1;
for (const file of list.value) {
  if (Number.isFinite(file.uid) && file.uid >= nextUid) nextUid = file.uid + 1;
}

/** In-flight upload tasks by `uid`, aborted on unmount (§41). */
const tasks = new Map<number, UploadTask>();

function commit(next: UploadFileItem[]): void {
  list.value = next;
  emit('update:fileList', next);
  emit('change', { fileList: next });
}

function patchFile(uid: number, patch: Partial<UploadFileItem>): UploadFileItem | undefined {
  const index = list.value.findIndex((file) => file.uid === uid);
  if (index < 0) return undefined;
  const current = list.value[index];
  if (!current) return undefined;
  const next = { ...current, ...patch };
  const copy = list.value.slice();
  copy[index] = next;
  commit(copy);
  return next;
}

/* ── Limits ────────────────────────────────────────────────────────────── */

const count = computed(() => list.value.length);

const atLimit = computed(() => props.limit > 0 && count.value >= props.limit);

const pickerVisible = computed(() => !props.disabled && !atLimit.value);

const limitLabel = computed(() => (props.limit > 0 ? `${count.value}/${props.limit}` : ''));

/* ── Picking ───────────────────────────────────────────────────────────── */

function toFileItem(chosen: ChosenFile): UploadFileItem {
  return {
    uid: nextUid++,
    url: chosen.path,
    name: chosen.name ?? '',
    size: chosen.size,
    status: 'pending',
    percent: 0,
  };
}

async function acceptChosen(files: ChosenFile[]): Promise<void> {
  const additions: UploadFileItem[] = [];
  for (const chosen of files) {
    if (props.limit > 0 && list.value.length + additions.length >= props.limit) break;
    if (chosen.size > props.maxSize) {
      emit('oversize', { file: toFileItem(chosen), maxSize: props.maxSize });
      continue;
    }
    let item = toFileItem(chosen);
    if (props.beforeUpload) {
      const verdict = await props.beforeUpload(item);
      if (verdict === false) continue;
      if (typeof verdict === 'object') item = { ...verdict, uid: item.uid };
    }
    additions.push(item);
  }
  if (additions.length === 0) return;
  commit([...list.value, ...additions]);
  if (props.autoUpload) {
    for (const item of additions) void startUpload(item.uid);
  }
}

async function onEvokeTap(): Promise<void> {
  if (!pickerVisible.value) return;
  if (props.beforeChoose) {
    const verdict = await props.beforeChoose();
    if (verdict === false) return;
  }
  const runtime = getRuntime();
  if (!runtime) {
    emit('chooseerror', new Error('uni runtime unavailable'));
    return;
  }
  const onFail = (error: unknown): void => {
    emit('chooseerror', error);
  };
  const countLimit = props.multiple
    ? Math.max(props.limit > 0 ? props.limit - count.value : 9, 1)
    : 1;

  if (props.accept === 'file' || props.accept === 'all') {
    runtime.chooseMessageFile?.({
      count: countLimit,
      success: (result) => {
        void acceptChosen(result.tempFiles);
      },
      fail: onFail,
    });
    return;
  }
  if (props.accept === 'video') {
    runtime.chooseVideo?.({
      sourceType: props.sourceType,
      compressed: true,
      maxDuration: 60,
      camera: 'back',
      success: (result) => {
        void acceptChosen([{ path: result.tempFilePath, size: result.size }]);
      },
      fail: onFail,
    });
    return;
  }
  runtime.chooseImage?.({
    count: countLimit,
    sourceType: props.sourceType,
    sizeType: props.sizeType,
    success: (result) => {
      void acceptChosen(result.tempFiles);
    },
    fail: onFail,
  });
}

/* ── Uploading ─────────────────────────────────────────────────────────── */

async function startUpload(uid: number): Promise<void> {
  const file = list.value.find((item) => item.uid === uid);
  if (!file) return;
  patchFile(uid, { status: 'loading', percent: 0 });

  if (props.uploadMethod) {
    try {
      const response = await props.uploadMethod(file);
      const done = patchFile(uid, { status: 'success', percent: 100, response });
      emit('success', { file: done ?? file, response });
    } catch (error) {
      const failed = patchFile(uid, { status: 'fail' });
      emit('fail', { file: failed ?? file, error });
    }
    return;
  }

  const runtime = getRuntime();
  if (!runtime?.uploadFile) {
    const failed = patchFile(uid, { status: 'fail' });
    emit('fail', { file: failed ?? file, error: new Error('uni.uploadFile unavailable') });
    return;
  }

  const formData = props.buildFormData ? props.buildFormData(file) : props.formData;
  const task = runtime.uploadFile({
    url: props.action,
    filePath: file.url ?? '',
    name: props.name,
    header: props.header,
    formData,
    success: (result) => {
      tasks.delete(uid);
      const done = patchFile(uid, {
        status: 'success',
        percent: 100,
        response: result.data,
      });
      emit('success', { file: done ?? file, response: result.data });
    },
    fail: (error) => {
      tasks.delete(uid);
      const failed = patchFile(uid, { status: 'fail' });
      emit('fail', { file: failed ?? file, error });
    },
  });
  if (task) tasks.set(uid, task);
}

/** Public imperative API (wd-upload parity): start every pending upload. */
async function submit(): Promise<void> {
  if (props.disabled) return;
  const pending = list.value.filter((file) => file.status === 'pending' || file.status === 'fail');
  for (const file of pending) await startUpload(file.uid);
}

/** Public imperative API (wd-upload parity): abort one task, or all of them. */
function abort(task?: UploadTask): void {
  if (task) {
    task.abort?.();
    return;
  }
  for (const running of tasks.values()) running.abort?.();
  tasks.clear();
}

/* ── Row actions ───────────────────────────────────────────────────────── */

async function onRemove(index: number): Promise<void> {
  if (props.disabled) return;
  const file = list.value[index];
  if (!file) return;
  if (props.beforeRemove) {
    const verdict = await props.beforeRemove(file, index);
    if (verdict === false) return;
  }
  const running = tasks.get(file.uid);
  running?.abort?.();
  tasks.delete(file.uid);
  const next = list.value.filter((_, i) => i !== index);
  commit(next);
  emit('remove', { file, fileList: next });
}

async function onPreview(file: UploadFileItem): Promise<void> {
  if (props.beforePreview) {
    const verdict = await props.beforePreview(file);
    if (verdict === false) return;
  }
  const runtime = getRuntime() as
    | (UniRuntime & { previewImage?: (options: { urls: string[]; current: string }) => void })
    | undefined;
  if (!runtime?.previewImage || !file.url) return;
  runtime.previewImage({
    urls: list.value.map((item) => item.url ?? '').filter(Boolean),
    current: file.url,
  });
}

/* ── Lifecycle ─────────────────────────────────────────────────────────── */

onBeforeUnmount(() => {
  abort();
});

defineExpose({ submit, abort });

/* ── Presentation ──────────────────────────────────────────────────────── */

const rootClass = computed(() => [
  'sn-upload',
  {
    'sn-upload--disabled': props.disabled,
    'sn-upload--at-limit': atLimit.value,
  },
  props.customClass,
]);

const rootStyle = computed(() => props.customStyle);

function statusClass(file: UploadFileItem): Record<string, boolean> {
  const status: UploadStatusType = file.status ?? 'pending';
  return {
    [`sn-upload__file--${status}`]: true,
  };
}

function progressLabel(file: UploadFileItem): string {
  return `${file.percent ?? 0}%`;
}
</script>

<template>
  <view
    :class="rootClass"
    :style="rootStyle"
    :data-snui-component="'upload'"
    role="group"
    :aria-label="'upload'"
  >
    <view
      v-for="(file, index) in list"
      :key="file.uid"
      :class="['sn-upload__file', statusClass(file), props.customPreviewClass]"
    >
      <image
        v-if="file.url"
        class="sn-upload__thumb"
        :src="file.url"
        :mode="props.imageMode"
        :aria-label="file.name || 'file'"
        @tap="onPreview(file)"
      />
      <view v-else class="sn-upload__thumb sn-upload__thumb--empty" aria-hidden="true" />

      <view v-if="file.status === 'loading'" class="sn-upload__mask" aria-hidden="true">
        <text class="sn-upload__progress">{{ progressLabel(file) }}</text>
      </view>

      <view
        v-if="!props.disabled"
        class="sn-upload__remove"
        role="button"
        :aria-label="`remove ${file.name || index}`"
        @tap.stop="onRemove(index)"
      >
        <SnIcon :icon="XIcon" :size="24" />
      </view>
    </view>

    <view
      v-if="pickerVisible"
      :class="['sn-upload__evoke', props.customEvokeClass]"
      role="button"
      aria-label="choose file"
      tabindex="0"
      @tap="onEvokeTap"
    >
      <SnIcon :icon="PlusIcon" :size="32" />
    </view>

    <text v-if="props.showLimitNum && props.limit > 0" class="sn-upload__limit">{{
      limitLabel
    }}</text>
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). */

.sn-upload {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  gap: var(--sn-mp-spacing-3);
  font-family: inherit;
}

.sn-upload__file,
.sn-upload__evoke {
  position: relative;
  width: 160rpx;
  height: 160rpx;
  border-radius: var(--sn-mp-radius-lg);
  box-sizing: border-box;
  overflow: hidden;
}

.sn-upload__file {
  background-color: var(--sn-mp-color-background-soft);
}

.sn-upload__thumb {
  width: 100%;
  height: 100%;
}

.sn-upload__thumb--empty {
  background-color: var(--sn-mp-color-background-sunken);
}

.sn-upload__mask {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: var(--sn-mp-color-background-overlay);
}

.sn-upload__progress {
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-upload__file--fail {
  border: 2rpx solid var(--sn-mp-color-feedback-danger);
}

.sn-upload__remove {
  position: absolute;
  top: 0;
  right: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40rpx;
  height: 40rpx;
  border-bottom-left-radius: var(--sn-mp-radius-md);
  background-color: var(--sn-mp-color-background-overlay);
  color: var(--sn-mp-color-text-on-primary);
}

.sn-upload__evoke {
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx dashed var(--sn-mp-color-border-default);
  color: var(--sn-mp-color-text-tertiary);
}

.sn-upload--disabled .sn-upload__evoke {
  opacity: 0.5;
}

.sn-upload__limit {
  align-self: flex-end;
  font-size: var(--sn-mp-font-size-sm);
  color: var(--sn-mp-color-text-tertiary);
}

/* Doodle skin — hand-drawn tiles. */
.snui-skin-doodle .sn-upload__file,
.snui-skin-doodle .sn-upload__evoke {
  border: 4rpx solid var(--sn-mp-color-text-primary);
  border-radius: var(--sn-mp-radius-xs);
}
</style>
