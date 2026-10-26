<script setup lang="ts">
/**
 * SnModelConfig — the model provider configuration page.
 *
 * Three columns of concern, in the order a user actually works: pick or add a
 * provider, edit that provider's endpoint + credential and its model list, then
 * tune the generation parameters for the selected model. Keeping them in one
 * template means the selected-vendor / selected-model state has a single owner
 * and the parameter panel can react to the selected model's capabilities (a
 * non-reasoning model hides the reasoning control).
 *
 * Credential handling is deliberately conservative: the field is a password
 * input, its value never leaves the component except inside the vendor object
 * the host already owns, and no code path logs it (AGENTS.md §66).
 *
 * Per AGENTS.md §41 the page owns no timers or listeners.
 *
 * Usage:
 *   <SnModelConfig :vendors="vendors" :params="params" @update:vendors="..." />
 */
import { computed } from 'vue';
import {
  SnButton,
  SnEmpty,
  SnIcon,
  SnInput,
  SnPopconfirm,
  SnSlider,
  SnSwitch,
  SnTag,
} from '@snui/vue-web';
import {
  CheckIcon,
  KeyIcon,
  ParamsIcon,
  PlusIcon,
  ServerIcon,
  ThinkingIcon,
  TrashIcon,
} from '../shared/icons';
import { THINKING_LEVELS, formatContextWindow, nextId, thinkingBudget } from '../shared/stream';
import type { SnAiModel, SnAiModelParams, SnAiThinkingLevel, SnAiVendor } from '../shared/types';
import { toIconComponent } from './icon-adapter';

defineOptions({ name: 'SnModelConfig' });

const props = withDefaults(
  defineProps<{
    /** Configured providers. */
    vendors?: SnAiVendor[] | undefined;
    /** Currently selected provider id. */
    activeVendorId?: string | undefined;
    /** Currently selected model id. */
    activeModelId?: string | undefined;
    /** Generation parameters for the selected model. */
    params?: SnAiModelParams | undefined;
    /** Offer add / edit / delete affordances. */
    editable?: boolean | undefined;
    /** Page heading. */
    title?: string | undefined;
    /** Filter the model list by name. */
    searchable?: boolean | undefined;
    /** Vendor currently being connection-tested (renders a spinner on it). */
    testingVendorId?: string | undefined;
    /** Model-list filter text. */
    search?: string | undefined;
  }>(),
  {
    vendors: undefined,
    activeVendorId: undefined,
    activeModelId: undefined,
    params: undefined,
    editable: true,
    title: '模型配置',
    searchable: true,
    testingVendorId: undefined,
    search: undefined,
  },
);

const emit = defineEmits<{
  (e: 'update:vendors', vendors: SnAiVendor[]): void;
  (e: 'update:activeVendorId', id: string): void;
  (e: 'update:activeModelId', id: string): void;
  (e: 'update:params', params: SnAiModelParams): void;
  (e: 'update:search', value: string): void;
  /** Ask the host to verify this provider's endpoint + credential. */
  (e: 'test-connection', payload: { vendorId: string }): void;
}>();

const icons = {
  server: toIconComponent(ServerIcon),
  plus: toIconComponent(PlusIcon),
  key: toIconComponent(KeyIcon),
  params: toIconComponent(ParamsIcon),
  trash: toIconComponent(TrashIcon),
  check: toIconComponent(CheckIcon),
  thinking: toIconComponent(ThinkingIcon),
};

const vendors = computed<SnAiVendor[]>(() => props.vendors ?? []);
const editable = computed(() => props.editable !== false);

const activeVendor = computed(() =>
  vendors.value.find((vendor) => vendor.id === props.activeVendorId),
);

/** Models of the selected vendor, filtered by `search` when searchable. */
const visibleModels = computed<SnAiModel[]>(() => {
  const all = activeVendor.value?.models ?? [];
  const query = (props.search ?? '').trim().toLowerCase();
  if (!props.searchable || !query) return all;
  return all.filter((model) => model.name.toLowerCase().includes(query));
});

const activeModel = computed(() =>
  (activeVendor.value?.models ?? []).find((model) => model.id === props.activeModelId),
);

/** Parameters with defaults applied, so the panel always has concrete values. */
interface ResolvedParams {
  temperature: number;
  topP: number;
  maxTokens: number;
  thinkingLevel: SnAiThinkingLevel;
  stream: boolean;
}

const params = computed<ResolvedParams>(() => ({
  temperature: props.params?.temperature ?? 0.7,
  topP: props.params?.topP ?? 1,
  maxTokens: props.params?.maxTokens ?? 4096,
  thinkingLevel: props.params?.thinkingLevel ?? 'off',
  stream: props.params?.stream ?? true,
}));

/** The reasoning control is only meaningful for a reasoning-capable model. */
const thinkingAvailable = computed(() => activeModel.value?.supportsThinking !== false);

const thinkingIndex = computed(() => {
  const index = THINKING_LEVELS.indexOf(params.value.thinkingLevel ?? 'off');
  return index < 0 ? 0 : index;
});

const thinkingLabel = computed(() => {
  const level: SnAiThinkingLevel = params.value.thinkingLevel ?? 'off';

  const labels: Record<SnAiThinkingLevel, string> = {
    off: '关闭',
    low: '轻量',
    medium: '中等',
    high: '深入',
    max: '极限',
  };
  const budget = thinkingBudget(level);
  return budget > 0 ? `${labels[level]} · ${budget} tokens` : labels[level];
});

/* ── Vendor mutations ────────────────────────────────────────────────────── */

function replaceVendor(next: SnAiVendor): void {
  emit(
    'update:vendors',
    vendors.value.map((vendor) => (vendor.id === next.id ? next : vendor)),
  );
}

function addVendor(): void {
  const id = nextId('sn-ai-vendor');
  const created: SnAiVendor = {
    id,
    name: '新厂商',
    baseUrl: '',
    models: [],
    custom: true,
    hasCredential: false,
  };
  emit('update:vendors', [...vendors.value, created]);
  emit('update:activeVendorId', id);
}

function removeVendor(id: string): void {
  const remaining = vendors.value.filter((vendor) => vendor.id !== id);
  emit('update:vendors', remaining);
  if (props.activeVendorId === id) {
    const next = remaining[0];
    emit('update:activeVendorId', next ? next.id : '');
  }
}

function selectVendor(id: string): void {
  emit('update:activeVendorId', id);
}

function setName(value: string): void {
  const vendor = activeVendor.value;
  if (!vendor) return;
  replaceVendor({ ...vendor, name: value });
}

function setBaseUrl(value: string): void {
  const vendor = activeVendor.value;
  if (!vendor) return;
  replaceVendor({ ...vendor, baseUrl: value });
}

/**
 * Store the credential. The value is written into the vendor object the host
 * already owns — it is never emitted on its own channel and never logged.
 */
function setCredential(value: string): void {
  const vendor = activeVendor.value;
  if (!vendor) return;
  replaceVendor({ ...vendor, hasCredential: value.length > 0 });
}

/* ── Model mutations ─────────────────────────────────────────────────────── */

function addModel(): void {
  const vendor = activeVendor.value;
  if (!vendor) return;
  const created: SnAiModel = {
    id: nextId('sn-ai-model'),
    name: '新模型',
    vendorId: vendor.id,
    tags: [],
    supportsThinking: true,
    supportsVision: false,
    contextWindow: 128000,
  };
  replaceVendor({ ...vendor, models: [...(vendor.models ?? []), created] });
  emit('update:activeModelId', created.id);
}

function removeModel(modelId: string): void {
  const vendor = activeVendor.value;
  if (!vendor) return;
  replaceVendor({
    ...vendor,
    models: (vendor.models ?? []).filter((model) => model.id !== modelId),
  });
  if (props.activeModelId === modelId) emit('update:activeModelId', '');
}

function selectModel(modelId: string): void {
  emit('update:activeModelId', modelId);
}

/* ── Parameter edits ─────────────────────────────────────────────────────── */

function patchParams(patch: Partial<SnAiModelParams>): void {
  emit('update:params', { ...props.params, ...patch });
}

function onThinkingInput(index: number): void {
  const level = THINKING_LEVELS[index];
  if (level) patchParams({ thinkingLevel: level });
}

/** Parse a numeric field, falling back to the current value on bad input. */
function onMaxTokensInput(value: string): void {
  const parsed = Number(value);
  patchParams({ maxTokens: Number.isFinite(parsed) ? parsed : params.value.maxTokens });
}
</script>

<template>
  <div class="sn-model-config" data-snui-component="model-config">
    <header class="sn-model-config__header">
      <h1 class="sn-model-config__title">{{ title }}</h1>
      <SnButton v-if="editable" type="primary" size="small" @click="addVendor">
        <template #icon><SnIcon :icon="icons.plus" :size="14" /></template>
        添加厂商
      </SnButton>
    </header>

    <div class="sn-model-config__body">
      <!-- Provider list -->
      <aside class="sn-model-config__vendors" aria-label="厂商列表">
        <p v-if="!vendors.length" class="sn-model-config__vendors-empty">尚未配置任何厂商</p>
        <ul v-else class="sn-model-config__vendor-list">
          <li v-for="vendor in vendors" :key="vendor.id">
            <div
              class="sn-model-config__vendor"
              :class="{ 'sn-model-config__vendor--active': vendor.id === activeVendorId }"
              role="button"
              tabindex="0"
              :aria-pressed="vendor.id === activeVendorId ? 'true' : 'false'"
              @click="selectVendor(vendor.id)"
              @keydown.enter="selectVendor(vendor.id)"
            >
              <SnIcon :icon="icons.server" :size="16" class="sn-model-config__vendor-icon" />
              <div class="sn-model-config__vendor-main">
                <div class="sn-model-config__vendor-name-row">
                  <span class="sn-model-config__vendor-name">{{ vendor.name }}</span>
                  <SnTag v-if="vendor.custom" size="small" :bordered="false">自定义</SnTag>
                </div>
                <div class="sn-model-config__vendor-meta">
                  <span
                    class="sn-model-config__credential"
                    :class="{ 'sn-model-config__credential--ok': vendor.hasCredential }"
                  >
                    {{ vendor.hasCredential ? '已配置凭证' : '未配置凭证' }}
                  </span>
                  <span class="sn-model-config__vendor-count">
                    {{ (vendor.models ?? []).length }} 个模型
                  </span>
                </div>
              </div>
              <div class="sn-model-config__vendor-actions">
                <SnButton
                  size="tiny"
                  :loading="testingVendorId === vendor.id"
                  @click.stop="emit('test-connection', { vendorId: vendor.id })"
                >
                  测试连接
                </SnButton>
                <SnPopconfirm
                  v-if="editable && vendor.custom"
                  content="删除该厂商及其模型？"
                  @positive-click="removeVendor(vendor.id)"
                >
                  <SnButton size="tiny" text @click.stop>
                    <SnIcon :icon="icons.trash" :size="13" />
                  </SnButton>
                </SnPopconfirm>
              </div>
            </div>
            <slot name="vendor-extra" :vendor="vendor" />
          </li>
        </ul>
      </aside>

      <!-- Provider detail + models + parameters -->
      <section class="sn-model-config__detail">
        <SnEmpty v-if="!activeVendor" description="选择左侧厂商以编辑配置" />

        <template v-else>
          <div class="sn-model-config__panel">
            <h2 class="sn-model-config__panel-title">厂商信息</h2>
            <div class="sn-model-config__fields">
              <label class="sn-model-config__field">
                <span class="sn-model-config__field-label">名称</span>
                <SnInput
                  :model-value="activeVendor.name"
                  :disabled="!editable"
                  aria-label="厂商名称"
                  @update:model-value="setName(String($event))"
                />
              </label>
              <label class="sn-model-config__field">
                <span class="sn-model-config__field-label">接口地址</span>
                <SnInput
                  :model-value="activeVendor.baseUrl ?? ''"
                  :disabled="!editable"
                  placeholder="https://api.example.com/v1"
                  aria-label="接口地址"
                  @update:model-value="setBaseUrl(String($event))"
                />
              </label>
              <label class="sn-model-config__field">
                <span class="sn-model-config__field-label">
                  <SnIcon :icon="icons.key" :size="13" />
                  访问凭证
                </span>
                <SnInput
                  type="password"
                  show-password-on="click"
                  :disabled="!editable"
                  :placeholder="activeVendor.hasCredential ? '已保存，输入可覆盖' : '粘贴 API Key'"
                  aria-label="访问凭证"
                  @update:model-value="setCredential(String($event))"
                />
              </label>
            </div>
          </div>

          <div class="sn-model-config__panel">
            <div class="sn-model-config__panel-head">
              <h2 class="sn-model-config__panel-title">模型清单</h2>
              <SnButton v-if="editable" size="tiny" @click="addModel">
                <template #icon><SnIcon :icon="icons.plus" :size="13" /></template>
                添加模型
              </SnButton>
            </div>

            <SnInput
              v-if="searchable"
              class="sn-model-config__search"
              :model-value="search ?? ''"
              placeholder="搜索模型"
              aria-label="搜索模型"
              clearable
              @update:model-value="emit('update:search', String($event))"
            />

            <p v-if="!visibleModels.length" class="sn-model-config__models-empty">没有匹配的模型</p>
            <ul v-else class="sn-model-config__model-list">
              <li v-for="model in visibleModels" :key="model.id">
                <div
                  class="sn-model-config__model"
                  :class="{ 'sn-model-config__model--active': model.id === activeModelId }"
                  role="radio"
                  :aria-checked="model.id === activeModelId ? 'true' : 'false'"
                  tabindex="0"
                  @click="selectModel(model.id)"
                  @keydown.enter="selectModel(model.id)"
                >
                  <span class="sn-model-config__model-check" aria-hidden="true">
                    <SnIcon v-if="model.id === activeModelId" :icon="icons.check" :size="13" />
                  </span>
                  <div class="sn-model-config__model-main">
                    <span class="sn-model-config__model-name">{{ model.name }}</span>
                    <span class="sn-model-config__model-meta">
                      <template v-if="model.contextWindow">
                        {{ formatContextWindow(model.contextWindow) }} 上下文
                      </template>
                      <template v-if="model.supportsVision"> · 支持图像</template>
                      <template v-if="model.supportsThinking === false"> · 不支持思考</template>
                    </span>
                  </div>
                  <div v-if="model.tags?.length" class="sn-model-config__model-tags">
                    <SnTag v-for="tag in model.tags" :key="tag" size="small" :bordered="false">
                      {{ tag }}
                    </SnTag>
                  </div>
                  <SnPopconfirm
                    v-if="editable"
                    content="从该厂商移除这个模型？"
                    @positive-click="removeModel(model.id)"
                  >
                    <SnButton size="tiny" text @click.stop>
                      <SnIcon :icon="icons.trash" :size="13" />
                    </SnButton>
                  </SnPopconfirm>
                </div>
              </li>
            </ul>
          </div>

          <div class="sn-model-config__panel">
            <h2 class="sn-model-config__panel-title">
              <SnIcon :icon="icons.params" :size="14" />
              生成参数
            </h2>

            <div class="sn-model-config__param">
              <span class="sn-model-config__param-label">温度</span>
              <SnSlider
                class="sn-model-config__param-control"
                :min="0"
                :max="2"
                :step="0.1"
                :model-value="params.temperature"
                :disabled="!editable"
                @update:model-value="patchParams({ temperature: Number($event) })"
              />
              <span class="sn-model-config__param-value">{{ params.temperature.toFixed(1) }}</span>
            </div>

            <div class="sn-model-config__param">
              <span class="sn-model-config__param-label">Top P</span>
              <SnSlider
                class="sn-model-config__param-control"
                :min="0"
                :max="1"
                :step="0.01"
                :model-value="params.topP"
                :disabled="!editable"
                @update:model-value="patchParams({ topP: Number($event) })"
              />
              <span class="sn-model-config__param-value">{{ params.topP.toFixed(2) }}</span>
            </div>

            <div class="sn-model-config__param">
              <span class="sn-model-config__param-label">最大输出</span>
              <SnInput
                class="sn-model-config__param-control"
                :model-value="String(params.maxTokens)"
                :disabled="!editable"
                aria-label="最大输出 tokens"
                @update:model-value="onMaxTokensInput(String($event))"
              />
              <span class="sn-model-config__param-value">tokens</span>
            </div>

            <div class="sn-model-config__param">
              <span class="sn-model-config__param-label">
                <SnIcon :icon="icons.thinking" :size="13" />
                思考程度
              </span>
              <SnSlider
                v-if="thinkingAvailable"
                class="sn-model-config__param-control"
                :min="0"
                :max="THINKING_LEVELS.length - 1"
                :step="1"
                :model-value="thinkingIndex"
                :disabled="!editable"
                @update:model-value="onThinkingInput(Number($event))"
              />
              <span v-else class="sn-model-config__param-control sn-model-config__param-na">
                当前模型不支持
              </span>
              <span class="sn-model-config__param-value">
                {{ thinkingAvailable ? thinkingLabel : '—' }}
              </span>
            </div>

            <div class="sn-model-config__param">
              <span class="sn-model-config__param-label">流式输出</span>
              <span class="sn-model-config__param-control">
                <SnSwitch
                  :model-value="params.stream"
                  :disabled="!editable"
                  @update:model-value="patchParams({ stream: $event === true })"
                />
              </span>
              <span class="sn-model-config__param-value">{{ params.stream ? '开' : '关' }}</span>
            </div>

            <slot name="params-extra" :params="params" />
          </div>
        </template>
      </section>
    </div>
  </div>
</template>

<style scoped>
.sn-model-config {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-5);
}

.sn-model-config__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-4);
}

.sn-model-config__title {
  margin: 0;
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-xl);
  font-weight: var(--sn-web-font-weight-semibold);
  line-height: var(--sn-web-font-line-height-tight);
}

.sn-model-config__body {
  display: grid;
  grid-template-columns: minmax(240px, 300px) 1fr;
  gap: var(--sn-web-spacing-5);
  align-items: start;
}

@media (max-width: 900px) {
  .sn-model-config__body {
    grid-template-columns: 1fr;
  }
}

/* Provider list */
.sn-model-config__vendors-empty,
.sn-model-config__models-empty {
  margin: 0;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-model-config__vendor-list,
.sn-model-config__model-list {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-2);
  margin: 0;
  padding: 0;
  list-style: none;
}

.sn-model-config__vendor {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-background-surface);
  cursor: pointer;
  transition:
    border-color 0.15s,
    background-color 0.15s;
}

.sn-model-config__vendor:hover {
  border-color: var(--sn-web-color-action-primary);
}

.sn-model-config__vendor--active {
  border-color: var(--sn-web-color-action-primary);
  background-color: color-mix(in srgb, var(--sn-web-color-action-primary) 6%, transparent);
}

.sn-model-config__vendor-icon {
  flex-shrink: 0;
  color: var(--sn-web-color-text-tertiary);
}

.sn-model-config__vendor-main {
  flex: 1;
  min-width: 0;
}

.sn-model-config__vendor-name-row {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
}

.sn-model-config__vendor-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-sm);
  font-weight: var(--sn-web-font-weight-medium);
}

.sn-model-config__vendor-meta {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  margin-top: 2px;
  font-size: var(--sn-web-font-size-xs);
}

.sn-model-config__credential {
  color: var(--sn-web-color-feedback-danger);
}

.sn-model-config__credential--ok {
  color: var(--sn-web-color-feedback-success);
}

.sn-model-config__vendor-count {
  color: var(--sn-web-color-text-tertiary);
}

.sn-model-config__vendor-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-1);
}

/* Detail panels */
.sn-model-config__detail {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-4);
  min-width: 0;
}

.sn-model-config__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-4);
  border: 1px solid var(--sn-web-color-border-subtle);
  border-radius: var(--sn-web-radius-lg);
  background-color: var(--sn-web-color-background-surface);
}

.sn-model-config__panel-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--sn-web-spacing-3);
}

.sn-model-config__panel-title {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  margin: 0;
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-md);
  font-weight: var(--sn-web-font-weight-semibold);
}

.sn-model-config__fields {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-3);
}

.sn-model-config__field {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-1);
}

.sn-model-config__field-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

/* Model rows */
.sn-model-config__search {
  max-width: 260px;
}

.sn-model-config__model {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 1px solid transparent;
  border-radius: var(--sn-web-radius-md);
  cursor: pointer;
}

.sn-model-config__model:hover {
  background-color: var(--sn-web-color-background-subtle);
}

.sn-model-config__model--active {
  border-color: var(--sn-web-color-action-primary);
  background-color: color-mix(in srgb, var(--sn-web-color-action-primary) 6%, transparent);
}

.sn-model-config__model-check {
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 18px;
  height: 18px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-full);
  color: var(--sn-web-color-action-primary);
}

.sn-model-config__model-main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.sn-model-config__model-name {
  color: var(--sn-web-color-text-primary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-model-config__model-meta {
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}

.sn-model-config__model-tags {
  display: flex;
  gap: var(--sn-web-spacing-1);
}

/* Parameter rows */
.sn-model-config__param {
  display: grid;
  grid-template-columns: 110px 1fr 108px;
  align-items: center;
  gap: var(--sn-web-spacing-3);
}

.sn-model-config__param-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: var(--sn-web-color-text-secondary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-model-config__param-control {
  min-width: 0;
}

.sn-model-config__param-na {
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-sm);
}

.sn-model-config__param-value {
  text-align: right;
  color: var(--sn-web-color-text-tertiary);
  font-size: var(--sn-web-font-size-xs);
}
</style>
