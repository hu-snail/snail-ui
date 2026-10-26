<script setup lang="ts">
/**
 * Demo: SnPopover — click trigger and manual trigger with v-model:show.
 */
import { ref } from 'vue'
import { SnButton, SnPopover } from '@snui/vue-web'

const controlledShow = ref(false)
</script>

<template>
  <div class="popover-trigger-demo">
    <section class="popover-trigger-demo__block">
      <h4 class="popover-trigger-demo__title">click 触发（点击切换，点击外部关闭）</h4>
      <SnPopover trigger="click" header="操作面板" content="点击触发元素切换显示；点击气泡以外区域自动关闭。">
        <SnButton>点我切换</SnButton>
      </SnPopover>
    </section>

    <section class="popover-trigger-demo__block">
      <h4 class="popover-trigger-demo__title">manual + v-model:show 受控</h4>
      <div class="popover-trigger-demo__row">
        <SnPopover
          v-model:show="controlledShow"
          trigger="manual"
          header="受控气泡"
          content="显示状态完全由外部变量控制，触发手势不生效。"
          show-arrow
          placement="bottom"
        >
          <SnButton>受控目标元素</SnButton>
        </SnPopover>
        <SnButton type="primary" @click="controlledShow = !controlledShow">
          {{ controlledShow ? '关闭气泡' : '打开气泡' }}
        </SnButton>
        <span class="popover-trigger-demo__state">show = {{ controlledShow }}</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.popover-trigger-demo {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.popover-trigger-demo__block {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.popover-trigger-demo__title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: var(--sn-web-color-text-secondary, #4b4f55);
}

.popover-trigger-demo__row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.popover-trigger-demo__state {
  font-size: 12px;
  color: var(--sn-web-color-text-tertiary, #8f939c);
}
</style>
