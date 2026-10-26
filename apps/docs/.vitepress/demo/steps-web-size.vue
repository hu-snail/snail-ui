<script setup lang="ts">
/**
 * steps-web-size — the two size tiers side by side.
 */
import { ref } from 'vue';
import { SnSteps, SnStep } from '@snui/vue-web';

const current = ref(1);
</script>

<template>
  <div class="steps-size">
    <div class="steps-size__row">
      <span class="steps-size__cap">size="medium"（默认）</span>
      <SnSteps v-model:current="current" size="medium">
        <SnStep title="选择商品" description="从商品库中挑选" />
        <SnStep title="填写地址" description="收货信息" />
        <SnStep title="确认支付" description="完成下单" />
      </SnSteps>
    </div>

    <div class="steps-size__row">
      <span class="steps-size__cap">size="small"</span>
      <SnSteps v-model:current="current" size="small">
        <SnStep title="选择商品" description="从商品库中挑选" />
        <SnStep title="填写地址" description="收货信息" />
        <SnStep title="确认支付" description="完成下单" />
      </SnSteps>
    </div>

    <p class="steps-size__hint"><code>size</code> 同时影响指示器直径、标题字号与节点间距。</p>
  </div>
</template>

<style scoped>
.steps-size {
  display: flex;
  flex-direction: column;
  gap: 28px;
  width: 100%;
}
.steps-size__row {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps-size__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.steps-size__hint {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
