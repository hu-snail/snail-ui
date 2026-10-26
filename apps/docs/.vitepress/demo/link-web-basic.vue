<script setup lang="ts">
/** Demo: SnLink — type colors, underline, disabled, custom tag and icon slot. */
import { ExternalLink, FileText } from 'lucide-vue-next'
import { SnLink } from '@snui/vue-web'
</script>

<template>
  <div class="link-demo">
    <section class="link-demo__block">
      <h4>type 语义色</h4>
      <div class="link-demo__row">
        <SnLink href="#default">默认链接</SnLink>
        <SnLink type="primary" href="#primary">主要链接</SnLink>
        <SnLink type="info" href="#info">信息链接</SnLink>
        <SnLink type="success" href="#success">成功链接</SnLink>
        <SnLink type="warning" href="#warning">警告链接</SnLink>
        <SnLink type="error" href="#error">错误链接</SnLink>
      </div>
    </section>

    <section class="link-demo__block">
      <h4>下划线 / 禁用 / 自定义标签</h4>
      <div class="link-demo__row">
        <SnLink type="primary" underline href="#underline">常显下划线</SnLink>
        <SnLink disabled href="#disabled">禁用链接</SnLink>
        <SnLink tag="span" @click="() => {}">span 伪链接</SnLink>
      </div>
    </section>

    <section class="link-demo__block">
      <h4>图标插槽</h4>
      <div class="link-demo__row">
        <SnLink href="#doc">
          <template #icon><FileText :size="14" /></template>
          查看文档
        </SnLink>
        <SnLink type="primary" href="#external" target="_blank" rel="noopener">
          <template #icon><ExternalLink :size="14" /></template>
          外部链接
        </SnLink>
      </div>
    </section>
  </div>
</template>

<style scoped>
.link-demo {
  display: grid;
  gap: 18px;
}
.link-demo__block h4 {
  margin: 0 0 10px;
  font-size: 13px;
  color: var(--sn-web-color-text-tertiary, #888);
}
.link-demo__row {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}
</style>
