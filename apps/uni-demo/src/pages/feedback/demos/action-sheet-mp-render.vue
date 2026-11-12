<script setup lang="ts">
/**
 * Demo: sn-action-sheet (uni-end) — lazy-render / safe-area-inset-bottom / root-portal.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-action-sheet from its SFC source.
 */
import { ref } from 'vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnActionSheet from '@snui/uni-src/components/sn-action-sheet/sn-action-sheet.vue';

const eager = ref(false);
const noSafeArea = ref(false);

const actions = [{ name: '分享给朋友' }, { name: '保存到相册' }, { name: '删除', disabled: true }];
</script>

<template>
  <view class="sn-demo sn-demo--stack">
    <SnButton type="primary" block @tap="eager = true">lazy-render=false（提前渲染）</SnButton>
    <SnButton block @tap="noSafeArea = true">safe-area-inset-bottom=false</SnButton>

    <text class="sn-demo__meta">
      lazy-render=false 首次打开前就渲染内容；safe-area-inset-bottom=false 不再为底部安全区留白；
      root-portal 仅为 wot-ui 对齐而声明，小程序没有 portal 宿主，传 true 不改变层级。
    </text>

    <SnActionSheet
      v-model="eager"
      title="提前渲染"
      :actions="actions"
      cancel-text="取消"
      :lazy-render="false"
      custom-class="sn-demo-contained"
    />

    <SnActionSheet
      v-model="noSafeArea"
      title="无底部安全区"
      :actions="actions"
      cancel-text="取消"
      :safe-area-inset-bottom="false"
      :root-portal="true"
      custom-class="sn-demo-contained"
    />
  </view>
</template>

<style scoped>
.sn-demo--stack {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}
.sn-demo__meta {
  color: var(--sn-mp-color-text-tertiary);
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
}
/* H5 / WEB only — docs preview pins the fixed layer to the phone frame.
 * uni-app x App compiles this OUT: App-side `position: absolute` lays out in
 * the direct parent's content box (css/position) and the page class still
 * reaches the component root (style-isolation) — the rule would pin the
 * fullscreen fixed layer into the demo card and clip it (App overflow
 * defaults to hidden). */
/* #ifdef H5 || WEB */
.sn-action-sheet.sn-demo-contained {
  position: absolute;
}
/* #endif */
</style>
