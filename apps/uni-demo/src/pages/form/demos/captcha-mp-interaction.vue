<script setup lang="ts">
/**
 * Demo: sn-captcha (uni-end) — 与 sn-slide-verify 组合的两段式验证。
 *
 * 第一段滑块验证通过后才展示拼图验证：常见于风控分级场景（先低成本滑块，
 * 失败或高风险再升级为拼图）。两段都通过才算整链通过。
 *
 * Per AUI-DOCS-016 / §111: imports the real @snui/uni SFC sources.
 */
import { computed, ref } from 'vue';
import SnCaptcha from '@snui/uni-src/components/sn-captcha/sn-captcha.vue';
import SnSlideVerify from '@snui/uni-src/components/sn-slide-verify/sn-slide-verify.vue';

/** 第一段：滑块是否已通过。 */
const sliderPassed = ref(false);
/** 第二段：拼图验证是否通过。 */
const puzzlePassed = ref(false);

/** 两段都通过才算整链通过。 */
const chainPassed = computed(() => sliderPassed.value && puzzlePassed.value);

/** Stable network poster (picsum seed) for the puzzle notch. */
const SOURCE = 'https://picsum.photos/seed/snui-captcha-chain/600/400';

function resetChain(): void {
  sliderPassed.value = false;
  puzzlePassed.value = false;
}
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <view class="sn-demo__panel">
      <text class="sn-demo__panel-title">第一段 · 滑块验证</text>
      <text class="sn-demo__panel-desc">拖动滑块到最右侧，通过后进入第二段。</text>
      <SnSlideVerify
        text="向右拖动滑块完成验证"
        success-text="滑块验证已通过"
        @success="sliderPassed = true"
        @fail="sliderPassed = false"
      />
    </view>

    <view v-if="sliderPassed" class="sn-demo__panel">
      <text class="sn-demo__panel-title">第二段 · 拼图验证</text>
      <text class="sn-demo__panel-desc">滑动拼图块对齐缺口，两段都通过即整链通过。</text>
      <SnCaptcha
        v-model="puzzlePassed"
        inline
        :src="SOURCE"
        :width="280"
        :height="180"
        @success="puzzlePassed = true"
        @fail="puzzlePassed = false"
      />
    </view>

    <view v-else class="sn-demo__panel sn-demo__panel--placeholder">
      <text class="sn-demo__placeholder-text">先完成第一段滑块验证</text>
    </view>

    <text class="sn-demo__meta">
      滑块：{{ sliderPassed ? '通过' : '待验证' }} · 拼图：{{ puzzlePassed ? '通过' : '待验证' }}
      · 整链：{{ chainPassed ? '通过' : '未通过' }}
    </text>

    <view class="sn-demo__actions">
      <text class="sn-demo__reset" role="button" aria-label="重置验证链" @tap="resetChain">
        重置验证链
      </text>
    </view>
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-3);
  width: 100%;
}
.sn-demo__panel {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  padding: var(--sn-mp-spacing-3);
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-lg);
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__panel--placeholder {
  align-items: center;
  justify-content: center;
  min-height: 160rpx;
}
.sn-demo__panel-title {
  color: var(--sn-mp-color-text-primary);
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
}
.sn-demo__panel-desc {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
.sn-demo__placeholder-text {
  color: var(--sn-mp-color-text-disabled);
  font-size: var(--sn-mp-font-size-sm);
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
}
.sn-demo__actions {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
}
.sn-demo__reset {
  padding: var(--sn-mp-spacing-1) var(--sn-mp-spacing-3);
  border-radius: var(--sn-mp-radius-full);
  background-color: var(--sn-mp-color-background-soft);
  color: var(--sn-mp-color-action-primary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
