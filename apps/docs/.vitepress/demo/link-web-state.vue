<script setup lang="ts">
/**
 * Demo: SnLink — underline on/off, the disabled state, and link-like
 * interaction rendered on a non-anchor tag.
 */
import { ref } from 'vue';
import { SnLink } from '@snui/vue-web';

const clickCount = ref(0);
</script>

<template>
  <div class="link-state-demo">
    <section class="link-state-demo__block">
      <h4>下划线</h4>
      <div class="link-state-demo__row">
        <SnLink type="primary" href="#underline-off">underline = false（默认，悬停显示）</SnLink>
        <SnLink type="primary" underline href="#underline-on">underline = true（常显）</SnLink>
      </div>
    </section>

    <section class="link-state-demo__block">
      <h4>禁用态（阻止点击与导航，移除 href）</h4>
      <div class="link-state-demo__row">
        <SnLink href="#enabled">可用链接</SnLink>
        <SnLink disabled href="#disabled">禁用链接</SnLink>
        <SnLink type="error" disabled href="#disabled-error">禁用错误链接</SnLink>
      </div>
    </section>

    <section class="link-state-demo__block">
      <h4>自定义渲染标签（tag = 'span'，仅派发 click）</h4>
      <div class="link-state-demo__row">
        <SnLink tag="span" type="primary" @click="clickCount += 1">span 伪链接</SnLink>
        <span class="link-state-demo__hint">已触发 {{ clickCount }} 次</span>
      </div>
    </section>
  </div>
</template>

<style scoped>
.link-state-demo {
  display: grid;
  gap: 20px;
}
.link-state-demo__block {
  display: grid;
  gap: 10px;
}
.link-state-demo__block h4 {
  margin: 0;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary);
}
.link-state-demo__row {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 20px;
}
.link-state-demo__hint {
  font-size: 13px;
  color: var(--sn-web-color-text-secondary);
}
</style>
