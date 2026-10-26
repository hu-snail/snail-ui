<script setup lang="ts">
/** Demo: SnLink — type colors, underline, disabled, custom tag and icon slot. */
import { ExternalLink, FileText } from 'lucide-vue-next'
import { SnLink } from '@snui/vue-web'
</script>

<template>
  <div class="link-demo">
    <section class="link-demo__block">
      <h4>Semantic type colors</h4>
      <div class="link-demo__row">
        <SnLink href="#default">Default link</SnLink>
        <SnLink type="primary" href="#primary">Primary link</SnLink>
        <SnLink type="info" href="#info">Info link</SnLink>
        <SnLink type="success" href="#success">Success link</SnLink>
        <SnLink type="warning" href="#warning">Warning link</SnLink>
        <SnLink type="error" href="#error">Error link</SnLink>
      </div>
    </section>

    <section class="link-demo__block">
      <h4>Underline / disabled / custom tag</h4>
      <div class="link-demo__row">
        <SnLink type="primary" underline href="#underline">Always underlined</SnLink>
        <SnLink disabled href="#disabled">Disabled link</SnLink>
        <SnLink tag="span" @click="() => {}">span pseudo-link</SnLink>
      </div>
    </section>

    <section class="link-demo__block">
      <h4>Icon slot</h4>
      <div class="link-demo__row">
        <SnLink href="#doc">
          <template #icon><FileText :size="14" /></template>
          View docs
        </SnLink>
        <SnLink type="primary" href="#external" target="_blank" rel="noopener">
          <template #icon><ExternalLink :size="14" /></template>
          External link
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
