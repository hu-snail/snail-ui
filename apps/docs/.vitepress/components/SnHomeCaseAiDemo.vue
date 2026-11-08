<script setup lang="ts">
/**
 * SnHomeCaseAiDemo — 首页「场景案例」里 3 张 **AI 原生场景**卡的内容。
 *
 * 对应首頁设计稿的三块：AI 对话与推理流 / Prompt 与上下文编排 /
 * AI 图像生成与微调。所有可交互控件都是 @snui/vue-web 真实组件
 * （SnInput / SnButton / SnSlider / SnTag / SnProgress…），因此：
 *   - 切换 Style Pack 即时换肤（组件读 `--sn-web-*` token）；
 *   - 站点暗色自动跟随（token 由 `html.dark` 块覆盖）。
 * 只有"纯装饰"的容器（对话气泡、代码块、渲染预览窗口）用局部 CSS，
 * 其配色也一律走 token，不写死主题色。
 *
 * 文案双语走 home-cases.ts 的案例字典；演示数据全部确定性（固定字符串、
 * 固定进度），保证 SSR 与客户端水合一致。
 */
import { computed, ref } from 'vue';
import { useData } from 'vitepress';
import { ArrowRight, Sparkles } from 'lucide-vue-next';
import { SnButton, SnIcon, SnInput, SnProgress, SnSlider, SnTag } from '@snui/vue-web';
import { caseCopy } from '../utils/home-cases';

const props = defineProps<{ id: 'aiChat' | 'aiPrompt' | 'aiImage' }>();

const { lang } = useData();
const isEn = computed(() => lang.value === 'en-US');
const t = computed(() => caseCopy(isEn.value ? 'en' : 'zh'));

/* ── AI #01 对话与推理流 ── */
const chatDraft = ref('');
const chatCode = [
  '<div class="frost-card">',
  '  <span class="value">2,441</span>',
  '  <svg class="spark" />',
  '</div>',
].join('\n');

/* ── AI #02 Prompt 与上下文编排 ── */
const systemPrompt = ref('');
const temperature = ref(70);
const topP = ref(95);
const promptSlots = computed(() => [
  { name: '{{user_query}}', tag: isEn.value ? 'Required' : '必需', type: 'primary' as const },
  { name: '{{chunks}}', tag: 'RAG', type: 'success' as const },
  { name: '{{theme}}', tag: 'Token', type: 'info' as const },
]);

/* ── AI #03 图像生成与微调 ── */
const imagePrompt = ref('');
const imageModels = ['FLUX.1-Dev', 'Anime v4', 'Vector XL'];
const renderProgress = 80;
</script>

<template>
  <!-- ─────────── AI #01 · 对话与推理流 ─────────── -->
  <div v-if="props.id === 'aiChat'" class="sn-ai">
    <!-- 模型选择行 -->
    <div class="sn-ai__model">
      <span class="sn-ai__model-badge">R1</span>
      <span class="sn-ai__model-text">
        <span class="sn-ai__model-name">
          DeepSeek-R1 (Full 671B)
          <span class="sn-ai__live" />
        </span>
        <span class="sn-ai__mono">{{ t.aiChatStats }}</span>
      </span>
      <SnTag size="small" round type="default">{{ t.aiChatSwitch }}</SnTag>
    </div>

    <!-- 用户 Query 气泡（装饰：说满即整句） -->
    <p class="sn-ai__bubble">{{ t.aiChatQuery }}</p>

    <!-- 思考链（装饰卡片 + 真实 mono 文本） -->
    <div class="sn-ai__panel">
      <span class="sn-ai__panel-head">
        <span class="sn-ai__live" />
        {{ t.aiChatThinking }}
      </span>
      <p class="sn-ai__think">{{ t.aiChatThinkingBody }}</p>
    </div>

    <!-- 流式代码块（装饰：终端面） -->
    <div class="sn-ai__code">
      <span class="sn-ai__code-head">
        <span class="sn-ai__code-file">FrostStats.vue · Streaming</span>
        <span class="sn-ai__mono">{{ t.aiChatCopy }}</span>
      </span>
      <pre class="sn-ai__code-body"><code>{{ chatCode }}</code></pre>
    </div>

    <!-- 追问输入（真实 SnInput + SnButton） -->
    <div class="sn-ai__input">
      <SnInput
        v-model="chatDraft"
        size="small"
        :placeholder="t.aiChatInput"
        clearable
        aria-label="Chat message"
      />
      <SnButton type="primary" size="small" circle :icon="ArrowRight" :aria-label="t.aiChatSend" />
    </div>
  </div>

  <!-- ─────────── AI #02 · Prompt 与上下文编排 ─────────── -->
  <div v-else-if="props.id === 'aiPrompt'" class="sn-ai">
    <div class="sn-ai__field">
      <span class="sn-ai__field-head">
        <span class="sn-ai__label">{{ t.aiPromptSystem }}</span>
        <SnTag size="small" round type="primary">{{ t.aiPromptActive }}</SnTag>
      </span>
      <SnInput
        v-model="systemPrompt"
        type="textarea"
        :rows="3"
        size="small"
        :placeholder="t.aiPromptSystemValue"
        aria-label="System prompt"
      />
      <span class="sn-ai__field-foot">
        <span class="sn-ai__mono">{{ t.aiPromptTokens }}</span>
      </span>
    </div>

    <div class="sn-ai__field">
      <span class="sn-ai__label">{{ t.aiPromptSlots }}</span>
      <span class="sn-ai__slots">
        <SnTag
          v-for="slot in promptSlots"
          :key="slot.name"
          size="small"
          round
          :type="slot.type"
          :bordered="true"
        >
          {{ slot.name }} · {{ slot.tag }}
        </SnTag>
      </span>
    </div>

    <!-- 参数滑块（真实 SnSlider） -->
    <div class="sn-ai__params">
      <span class="sn-ai__param">
        <span class="sn-ai__param-head">
          <span class="sn-ai__label">Temperature</span>
          <span class="sn-ai__mono sn-ai__param-value">{{ (temperature / 100).toFixed(2) }}</span>
        </span>
        <SnSlider v-model="temperature" :min="0" :max="100" :step="1" />
      </span>
      <span class="sn-ai__param">
        <span class="sn-ai__param-head">
          <span class="sn-ai__label">Top-P</span>
          <span class="sn-ai__mono sn-ai__param-value">{{ (topP / 100).toFixed(2) }}</span>
        </span>
        <SnSlider v-model="topP" :min="0" :max="100" :step="1" />
      </span>
    </div>

    <div class="sn-ai__actions">
      <span class="sn-ai__mono">{{ t.aiPromptFoot }}</span>
      <SnButton type="primary" size="small">{{ t.aiPromptRun }}</SnButton>
    </div>
  </div>

  <!-- ─────────── AI #03 · 图像生成与微调 ─────────── -->
  <div v-else class="sn-ai">
    <div class="sn-ai__field">
      <SnInput
        v-model="imagePrompt"
        type="textarea"
        :rows="2"
        size="small"
        :placeholder="t.aiImagePrompt"
        aria-label="Image prompt"
      />
      <span class="sn-ai__field-foot">
        <span class="sn-ai__optimize">
          <SnIcon :icon="Sparkles" />
          {{ t.aiImageOptimize }}
        </span>
        <span class="sn-ai__mono">{{ t.aiImageWeight }}</span>
      </span>
    </div>

    <!-- 风格预设（真实 SnTag checkable 语义） -->
    <div class="sn-ai__presets">
      <span
        v-for="(model, i) in imageModels"
        :key="model"
        class="sn-ai__preset"
        :class="{ 'sn-ai__preset--active': i === 0 }"
      >
        <span class="sn-ai__preset-name">
          {{ i === 0 ? t.aiImagePreset1 : i === 1 ? t.aiImagePreset2 : t.aiImagePreset3 }}
        </span>
        <span class="sn-ai__mono">{{ model }}</span>
      </span>
    </div>

    <!-- 去噪渲染进度：真实 SnProgress + 装饰预览窗 -->
    <div class="sn-ai__render">
      <span class="sn-ai__render-head">
        <span class="sn-ai__mono sn-ai__render-chip">DPM++ 2M</span>
        <span class="sn-ai__mono sn-ai__render-step">{{ t.aiImageStep }}</span>
      </span>
      <span class="sn-ai__render-badge">{{ t.aiImageRender }}</span>
      <SnProgress :percentage="renderProgress" :height="5" :show-indicator="false" />
    </div>
  </div>
</template>

<style scoped>
/* 全部取色走 token：换肤 / 暗色自动跟随。 */
.sn-ai {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}

/* ── 通用件 ── */
.sn-ai__mono {
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 11px;
  line-height: 1.5;
  color: var(--sn-web-color-text-tertiary, #a1a1aa);
}
.sn-ai__label {
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--sn-web-color-text-secondary, #71717a);
}
.sn-ai__live {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--sn-web-color-feedback-success, #22c55e);
  animation: sn-ai-pulse 2s ease-in-out infinite;
}
@keyframes sn-ai-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.35;
  }
}
@media (prefers-reduced-motion: reduce) {
  .sn-ai__live {
    animation: none;
  }
}

/* ── AI #01 对话与推理流 ── */
.sn-ai__model {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 10px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 12px;
  background: var(--sn-web-color-background-subtle, #f4f4f5);
}
.sn-ai__model-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  flex-shrink: 0;
  border-radius: 9px;
  font-size: 10px;
  font-weight: 700;
  color: var(--sn-web-color-text-on-primary, #ffffff);
  background: var(--sn-web-color-action-primary, #1677ff);
}
.sn-ai__model-text {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
  flex: 1;
}
.sn-ai__model-name {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  line-height: 1.4;
  color: var(--sn-web-color-text-primary, #09090b);
}
.sn-ai__bubble {
  align-self: flex-end;
  max-width: 90%;
  margin: 0;
  padding: 8px 11px;
  border-radius: 12px 12px 3px 12px;
  font-size: 12px;
  line-height: 1.5;
  color: var(--sn-web-color-text-on-primary, #ffffff);
  background: var(--sn-web-color-action-primary, #1677ff);
}
.sn-ai__panel {
  display: flex;
  flex-direction: column;
  gap: 5px;
  padding: 9px 10px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 12px;
  background: var(--sn-web-color-background-subtle, #f4f4f5);
}
.sn-ai__panel-head {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 11.5px;
  font-weight: 600;
  color: var(--sn-web-color-action-primary, #1677ff);
}
.sn-ai__think {
  margin: 0;
  padding-left: 9px;
  border-left: 2px solid var(--sn-web-color-action-primary-soft, #e6f4ff);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  line-height: 1.6;
  color: var(--sn-web-color-text-secondary, #71717a);
}
/* 终端面：设计稿的深色代码块，深浅主题都用同一块「终端」语义色 */
.sn-ai__code {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 9px 10px;
  border-radius: 12px;
  background: #0f172a;
}
.sn-ai__code-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgb(255 255 255 / 0.1);
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10px;
}
.sn-ai__code-file {
  color: #7fb0ff;
}
.sn-ai__code-head .sn-ai__mono {
  color: #94a3b8;
}
.sn-ai__code-body {
  margin: 0;
  overflow-x: auto;
  font-family: var(--vp-font-family-mono, ui-monospace, monospace);
  font-size: 10.5px;
  line-height: 1.65;
  color: #cbd5e1;
}
.sn-ai__input {
  display: flex;
  align-items: center;
  gap: 8px;
}
.sn-ai__input :deep(.sn-input) {
  flex: 1;
}

/* ── AI #02 Prompt 与上下文编排 ── */
.sn-ai__field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}
.sn-ai__field-head,
.sn-ai__field-foot,
.sn-ai__param-head,
.sn-ai__actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-ai__field-foot {
  padding-top: 7px;
  border-top: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
}
.sn-ai__slots {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.sn-ai__params {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}
.sn-ai__param {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sn-ai__param-value {
  color: var(--sn-web-color-text-primary, #09090b);
  font-weight: 700;
}
.sn-ai__actions {
  padding-top: 2px;
}

/* ── AI #03 图像生成与微调 ── */
.sn-ai__optimize {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 11px;
  font-weight: 600;
  color: var(--sn-web-color-action-primary, #1677ff);
}
.sn-ai__optimize :deep(svg) {
  width: 12px;
  height: 12px;
}
.sn-ai__presets {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
}
.sn-ai__preset {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 7px 6px;
  border: 1px solid var(--sn-web-color-border-subtle, #e4e4e7);
  border-radius: 10px;
  text-align: center;
  background: var(--sn-web-color-background-subtle, #f4f4f5);
}
.sn-ai__preset-name {
  font-size: 11px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--sn-web-color-text-secondary, #71717a);
}
.sn-ai__preset--active {
  border-color: var(--sn-web-color-action-primary, #1677ff);
  background: var(--sn-web-color-background-surface, #ffffff);
}
.sn-ai__preset--active .sn-ai__preset-name {
  font-weight: 700;
  color: var(--sn-web-color-text-primary, #09090b);
}
/* 渲染预览窗：设计稿的深色渐变画布（装饰性，单独一套） */
.sn-ai__render {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 10px;
  border-radius: 12px;
  background:
    radial-gradient(120% 90% at 50% 45%, rgb(217 70 239 / 0.45) 0%, transparent 70%),
    linear-gradient(160deg, #1e1b4b 0%, #0b1020 100%);
}
.sn-ai__render-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
}
.sn-ai__render-chip {
  padding: 2px 8px;
  border-radius: 999px;
  color: #f5d0fe;
  background: rgb(0 0 0 / 0.5);
}
.sn-ai__render-step {
  color: #ffffff;
  font-weight: 700;
}
.sn-ai__render-badge {
  align-self: center;
  padding: 3px 11px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
  color: #ffffff;
  background: rgb(0 0 0 / 0.55);
}
.sn-ai__render :deep(.sn-progress) {
  width: 100%;
}
.sn-ai__render :deep(.sn-progress__rail) {
  background: rgb(255 255 255 / 0.22);
}
</style>
