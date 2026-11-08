<script setup lang="ts">
/**
 * SnHomeCaseDemo — 首页「场景案例」的内容路由。
 *
 * 场景本身分两个组件承载（都是 @snui/vue-web 真实组件拼装）：
 *   - SnHomeCaseAiDemo    —— 3 张 AI 原生场景（对话推理 / Prompt 编排 / 图像生成）
 *   - SnHomeSceneDemo     —— 6 张组件场景（表单 / 日期时间 / 指标 / 色彩 / 看板 / 图表）
 *
 * 这里只做 id → 组件分发，不持有任何演示状态；卡片外壳（卡头 / 底部状态行）
 * 由 SnHomeCaseCard 负责，取色统一走 token，因此换肤与暗色自动跟随。
 */
import { computed } from 'vue';
import SnHomeCaseAiDemo from './SnHomeCaseAiDemo.vue';
import SnHomeSceneDemo from './SnHomeSceneDemo.vue';
import type { HomeCaseId } from '../utils/home-cases';

const props = defineProps<{ id: HomeCaseId }>();

const AI_CASE_IDS: readonly HomeCaseId[] = ['aiChat', 'aiPrompt', 'aiImage'];

const isAiCase = computed(() => AI_CASE_IDS.includes(props.id));
</script>

<template>
  <SnHomeCaseAiDemo v-if="isAiCase" :id="props.id as 'aiChat' | 'aiPrompt' | 'aiImage'" />
  <SnHomeSceneDemo v-else :id="props.id" />
</template>
