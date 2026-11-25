<script setup lang="ts">
/**
 * Demo: sn-toast (uni-end) — status glyphs and loading types.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-toast from its SFC source.
 */
import { computed, ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnToast from '@snui/uni-src/components/sn-toast/sn-toast.vue';
import {
  FeedbackDanger,
  FeedbackInfo,
  FeedbackSuccess,
  FeedbackWarning,
} from '@snui/uni-src/components/sn-icon/sn-icon-feedback';

/** 触发按钮与 toast 图标按状态上同色系主题色；图标为 toast 内同款 feedback 图形。 */
const iconKinds = [
  { kind: 'success', type: 'success', icon: FeedbackSuccess, color: 'var(--sn-mp-color-feedback-success)' },
  { kind: 'error', type: 'danger', icon: FeedbackDanger, color: 'var(--sn-mp-color-feedback-danger)' },
  { kind: 'warning', type: 'warning', icon: FeedbackWarning, color: 'var(--sn-mp-color-feedback-warning)' },
  { kind: 'info', type: 'info', icon: FeedbackInfo, color: 'var(--sn-mp-color-feedback-info)' },
] as const;
type IconKind = (typeof iconKinds)[number]['kind'];

/** 加载形态行：按钮只上主题色（spinner 形态的差异在 toast 里展示）。 */
const loadingKinds = [
  { kind: 'circular', type: 'primary' },
  { kind: 'spinner', type: 'info' },
  { kind: 'dots', type: 'success' },
  { kind: 'wave', type: 'warning' },
] as const;
type LoadingKind = (typeof loadingKinds)[number]['kind'];

const currentIcon = ref<IconKind>('success');
const iconOpen = ref(false);
/** toast 状态图标随状态上主题色（icon-color），与触发按钮同色系。 */
const iconColor = computed(() => iconKinds.find((item) => item.kind === currentIcon.value)?.color ?? '');

const currentLoading = ref<LoadingKind>('circular');
const loadingOpen = ref(false);

function showIcon(kind: IconKind): void {
  currentIcon.value = kind;
  iconOpen.value = true;
}

function showLoading(kind: LoadingKind): void {
  currentLoading.value = kind;
  loadingOpen.value = true;
}
</script>

<template>
  <!-- stack 由内层 view 承载：MP-WEIXIN 页面级 `.demo-host[class] { display: block }`
       编译后特异性高于 demo 根的 scoped 规则，根上声明的 flex + gap 会被拍平
       成块流（按钮间距全失）。内层 view 带不上 demo-host，页面规则碰不到它。 -->
  <view class="sn-demo">
    <view class="sn-demo--stack">
      <view class="sn-toast-demo__row">
        <SnButton
          v-for="item in iconKinds"
          :key="item.kind"
          size="small"
          :type="item.type"
          :icon-data="item.icon"
          @tap="showIcon(item.kind)"
        >{{ item.kind }}</SnButton>
      </view>

      <view class="sn-toast-demo__row">
        <SnButton
          v-for="item in loadingKinds"
          :key="item.kind"
          size="small"
          :type="item.type"
          @tap="showLoading(item.kind)"
        >{{ item.kind }}</SnButton>
      </view>

      <text class="sn-toast-demo__meta">图标：{{ currentIcon }} · 加载：{{ currentLoading }}</text>

      <SnToast
        v-model="iconOpen"
        :msg="`icon-name = ${currentIcon}`"
        :icon-name="currentIcon"
        :icon-color="iconColor"
        custom-class="sn-demo-contained"
      />

      <SnToast
        v-model="loadingOpen"
        :msg="`loading-type = ${currentLoading}`"
        icon-name="loading"
        :loading-type="currentLoading"
        :duration="2000"
        custom-class="sn-demo-contained"
      />
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-toast-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
.sn-toast-demo__meta {
  font-size: 24rpx;
  color: var(--vp-c-text-2);
}
/* Docs-preview only — pin the fixed layer to the phone screen. */
.sn-toast.sn-demo-contained {
  position: absolute;
}
</style>
