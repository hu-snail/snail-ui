<script setup lang="ts">
/** Demo: SnEllipsis — fade smoke mask, expandTrigger click, and the
 * configurable expand / collapse toggle (suffix / bottom). */
import { SnEllipsis } from '@snui/vue-web';

const paragraph =
  '蜗牛 AUI 的文本省略组件会把内容截断在指定的行数内，并在溢出时通过气泡展示完整文本。' +
  '开启 fade 后，截断边缘的文字会以烟雾渐隐的方式过渡，而不是生硬的省略号切断；' +
  'expandPosition 决定展开 / 收起操作的位置：suffix 跟随在文案末尾，bottom 单独占一行；' +
  'expandTrigger="click" 则点击文案本身即可切换。';
</script>

<template>
  <div class="ellipsis-expand-demo">
    <section class="ellipsis-expand-demo__block">
      <h4>底部烟雾渐隐（fade）</h4>
      <SnEllipsis :width="360" :line-clamp="3" fade>{{ paragraph }}</SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>展开 / 收起跟随文案（expandPosition="suffix"）</h4>
      <SnEllipsis :width="360" :line-clamp="2" expand-position="suffix">
        {{ paragraph }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>展开 / 收起单独一行（expandPosition="bottom"）</h4>
      <SnEllipsis :width="360" :line-clamp="3" fade expand-position="bottom">
        {{ paragraph }}
      </SnEllipsis>
    </section>

    <section class="ellipsis-expand-demo__block">
      <h4>点击文案展开 / 收起（expandTrigger="click"）</h4>
      <SnEllipsis :width="360" :line-clamp="2" expand-trigger="click">
        {{ paragraph }}
      </SnEllipsis>
    </section>
  </div>
</template>

<style scoped>
.ellipsis-expand-demo {
  display: grid;
  gap: 18px;
}
.ellipsis-expand-demo__block {
  display: grid;
  gap: 10px;
}
.ellipsis-expand-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
</style>
