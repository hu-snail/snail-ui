<script setup lang="ts">
/**
 * affix-web-position — the `position` prop: fixed (out of flow) versus
 * absolute (kept in flow).
 */
import { SnAffix, SnButton } from '@snui/vue-web'
</script>

<template>
  <div class="affix-demo">
    <div class="affix-demo__row">
      <span class="affix-demo__label">position="fixed"</span>
      <div class="affix-demo__viewport">
        <SnAffix :trigger-top="0" :top="0" position="fixed">
          <div class="affix-demo__chip affix-demo__chip--fixed">fixed</div>
        </SnAffix>
        <div class="affix-demo__filler">滚动页面查看吸附效果</div>
      </div>
    </div>

    <div class="affix-demo__row">
      <span class="affix-demo__label">position="absolute"</span>
      <div class="affix-demo__viewport affix-demo__viewport--relative">
        <SnAffix :trigger-top="0" :top="0" position="absolute">
          <div class="affix-demo__chip affix-demo__chip--absolute">absolute</div>
        </SnAffix>
        <div class="affix-demo__filler">吸附时保留文档流占位</div>
      </div>
    </div>

    <SnButton size="small" quaternary @click="() => window.scrollTo({ top: 400 })">
      向下滚动 400px
    </SnButton>
  </div>
</template>

<style scoped>
.affix-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}
.affix-demo__row {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.affix-demo__label {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.affix-demo__viewport {
  padding: 10px;
  border: 1px dashed var(--vp-c-divider);
  border-radius: 6px;
}
.affix-demo__viewport--relative {
  position: relative;
}
.affix-demo__chip {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 4px;
  font-size: 12px;
  color: #fff;
}
.affix-demo__chip--fixed {
  background: var(--vp-c-brand-1);
}
.affix-demo__chip--absolute {
  background: #8b5cf6;
}
.affix-demo__filler {
  font-size: 12px;
  color: var(--vp-c-text-3);
}
</style>
