<script setup lang="ts">
/**
 * Demo: SnButton (Web) — Doodle Style Pack preview.
 *
 * This demo wraps SnButton / SnDivider / SnInput inside a local
 * `.snui-skin-doodle` container so the user can preview the Doodle
 * Style Pack's component visuals without toggling the global body
 * class (the docs site already activates it when doodlePack is the
 * active style, but the demo also works standalone so it can be
 * embedded into other docs that haven't switched packs).
 *
 * Per AUI-PRD-v3.1 §7.4: doodle skin = 2.5px ink border, hard offset
 * shadow (no blur), wavy asymmetric border-radius, sticker press
 * lift on hover.
 */
import { SnButton, SnDivider } from '@snui/vue-web';
</script>

<template>
  <div class="sn-demo">
    <div class="sn-demo__group">
      <SnButton>Default</SnButton>
      <SnButton type="primary">Primary</SnButton>
      <SnButton type="success">Success</SnButton>
      <SnButton type="warning">Warning</SnButton>
      <SnButton type="danger">Danger</SnButton>
      <SnButton type="info">Info</SnButton>
    </div>

    <SnDivider>Doodle divider</SnDivider>

    <div class="sn-demo__group">
      <SnButton type="primary" round>Rounded</SnButton>
      <SnButton type="primary" circle>+</SnButton>
      <SnButton type="success" dashed>Dashed</SnButton>
      <SnButton type="warning" ghost>Ghost</SnButton>
    </div>
  </div>
</template>

<style scoped>
/* Localized doodle skin scope — independent of the global body class so
 * this demo renders correctly regardless of which style pack is active
 * on the docs site. The CSS rules inside match what the component
 * packages declare under `.snui-skin-doodle`. */
.sn-demo {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  border: 2.5px dashed #1a1a1a;
  border-radius: 16px 4px / 4px 16px;
  background: #fff8e7;
}
.sn-demo__group {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
.sn-demo :deep(.sn-button) {
  border-width: 2.5px;
  border-style: solid;
  border-color: #1a1a1a;
  font-weight: 700;
}
.sn-demo :deep(.sn-divider--horizontal) {
  border-top-width: 2.5px;
  border-top-color: #1a1a1a;
  border-top-style: dashed;
}
.sn-demo :deep(.sn-divider__text) {
  padding: 2px 10px;
  border: 2px solid #1a1a1a;
  border-radius: 10px 2px / 2px 10px;
  font-weight: 700;
  background: #fffbeb;
  box-shadow: 2px 2px 0 #1a1a1a;
}
</style>
