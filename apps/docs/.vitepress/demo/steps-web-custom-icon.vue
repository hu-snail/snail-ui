<script setup lang="ts">
/**
 * steps-web-custom-icon — replacing the finish / error glyphs.
 *
 * Shows: the `finish-icon` and `error-icon` slots on SnSteps, plus the
 * per-step `icon` slot that overrides a single indicator.
 */
import { ref } from 'vue';
import { SnIcon, SnStep, SnSteps } from '@snui/vue-web';
import { Flag, Rocket, ThumbsUp, Zap } from 'lucide-vue-next';

const current = ref(1);
</script>

<template>
  <div class="steps-icon">
    <div class="steps-icon__group">
      <span class="steps-icon__cap">finish-icon / error-icon 插槽</span>
      <SnSteps v-model:current="current">
        <template #finish-icon>
          <SnIcon :icon="ThumbsUp" size="12" />
        </template>
        <template #error-icon>
          <SnIcon :icon="Zap" size="12" />
        </template>

        <SnStep title="已完成" description="使用自定义完成图标" />
        <SnStep title="进行中" description="使用默认数字" />
        <SnStep title="出错了" description="使用自定义错误图标" status="error" />
      </SnSteps>
    </div>

    <div class="steps-icon__group">
      <span class="steps-icon__cap">单步 icon 插槽</span>
      <SnSteps :current="1">
        <SnStep title="起点">
          <template #icon>
            <SnIcon :icon="Flag" size="14" />
          </template>
        </SnStep>
        <SnStep title="冲刺">
          <template #icon>
            <SnIcon :icon="Rocket" size="14" />
          </template>
        </SnStep>
        <SnStep title="收尾" description="未提供 icon，回退到内置渲染" />
      </SnSteps>
    </div>

    <p class="steps-icon__hint">
      <code>finish-icon</code> / <code>error-icon</code> 定义在父级 <code>SnSteps</code> 上，
      对所有子步骤生效；<code>icon</code> 插槽则只覆盖当前那一个步骤。
    </p>
  </div>
</template>

<style scoped>
.steps-icon {
  display: flex;
  flex-direction: column;
  gap: 32px;
  width: 100%;
}
.steps-icon__group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.steps-icon__cap {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary);
}
.steps-icon__hint {
  margin: 0;
  font-size: 13px;
  line-height: 1.7;
  color: var(--sn-web-color-text-secondary);
}
</style>
