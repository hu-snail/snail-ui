<script setup lang="ts">
/**
 * Demo: sn-divider (uni-end) — real-component live render.
 * Per AUI-DOCS-016: imports the real @snui/uni sn-divider via easycom.
 *
 * The demo file uses explicit component-level imports because the docs
 * site does not auto-register easycom — we replicate the same kebab-case
 * usage by importing from the component's SFC source path.
 */

import { ref } from 'vue'
import { SnDivider } from '@snui/uni'

const show = ref(true)
function toggle(): void { show.value = !show.value }
</script>

<template>
  <div class="sn-demo">
    <button class="sn-demo__btn" type="button" @click="toggle">切换下方分割线</button>

    <p v-if="show" class="sn-demo__para">上方文本</p>
    <SnDivider v-if="show" />
    <p v-if="show" class="sn-demo__para">下方文本（horizontal 默认）</p>

    <p class="sn-demo__para">dotted dashed</p>
    <SnDivider :dashed="true" />

    <p class="sn-demo__para">带文字</p>
    <SnDivider>或</SnDivider>

    <p class="sn-demo__para">marginSize: small</p>
    <SnDivider margin-size="small" />

    <p class="sn-demo__para">marginSize: large</p>
    <SnDivider margin-size="large" />

    <div class="sn-demo__row">
      <span>文本</span>
      <SnDivider direction="vertical" />
      <span>垂直</span>
      <SnDivider direction="vertical" :dashed="true" />
      <span>虚线</span>
    </div>
  </div>
</template>

<style scoped>
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.sn-demo__btn {
  padding: 4px 12px;
  border: 1px solid #d4d4d8;
  border-radius: 4px;
  background: #fff;
  cursor: pointer;
  align-self: flex-start;
  font-size: 12px;
}
.sn-demo__row {
  display: flex;
  align-items: center;
  gap: 8px;
  min-height: 36px;
}
.sn-demo__para {
  margin: 4px 0;
  font-size: 13px;
  color: var(--vp-c-text-1);
}
</style>