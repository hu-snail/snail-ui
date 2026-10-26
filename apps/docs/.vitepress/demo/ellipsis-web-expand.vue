<script setup lang="ts">
/**
 * Demo: SnEllipsis — `expandTrigger="click"` toggles the clamped text between
 * collapsed and expanded in place, without a tooltip round-trip.
 */
import { SnEllipsis } from '@snui/vue-web'

const longText =
  '点击这段文字即可在截断与完整内容之间切换：收起时保留两行并在行尾显示省略号，' +
  '展开后显示全部内容且不再气泡提示；再次点击回到截断状态。' +
  '状态完全由组件内部维护，不需要外部传入 expanded。'
</script>

<template>
  <div class="ellipsis-expand-demo">
    <section class="ellipsis-expand-demo__block">
      <h4>点击展开 / 收起（lineClamp = 2）</h4>
      <SnEllipsis :width="380" :line-clamp="2" expand-trigger="click">
        {{ longText }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>点击展开 / 收起（lineClamp = 3）</h4>
      <SnEllipsis :width="380" :line-clamp="3" expand-trigger="click">
        {{ longText }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>仅省略不展开（expandTrigger = 'none'，默认）</h4>
      <SnEllipsis :width="380" :line-clamp="2">{{ longText }}</SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-expand-demo {
  display: grid;
  gap: 20px;
}
.ellipsis-expand-demo__block {
  display: grid;
  gap: 8px;
}
.ellipsis-expand-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
</style>
