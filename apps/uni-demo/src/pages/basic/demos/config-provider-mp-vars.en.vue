<script setup lang="ts">
/**
 * Demo: sn-config-provider — themeVars overrides.
 *
 * Both key spellings land on the same CSS variable: the fully-qualified
 * `--sn-mp-*` form and the wot-style camelCase form.
 */
import SnConfigProvider from '@snui/uni-src/components/sn-config-provider/sn-config-provider.vue';
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';
import SnTag from '@snui/uni-src/components/sn-tag/sn-tag.vue';

/** Fully-qualified CSS variable names. */
const explicitVars = {
  '--sn-mp-color-action-primary': '#07c160',
  '--sn-mp-color-background-surface': '#f2fbf6',
};

/** wot-style camelCase keys → same variables after prefixing + kebab-casing. */
const camelVars = {
  colorActionPrimary: '#7c3aed',
};
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <SnConfigProvider :theme-vars="explicitVars" custom-class="sn-cfg-vars__pane">
      <view class="sn-cfg-vars__label">--sn-mp-color-action-primary</view>
      <view class="sn-cfg-vars__row">
        <SnTag type="primary">Tag</SnTag>
        <SnButton type="primary" size="small">Button</SnButton>
      </view>
    </SnConfigProvider>

    <SnConfigProvider :theme-vars="camelVars" custom-class="sn-cfg-vars__pane">
      <view class="sn-cfg-vars__label">colorActionPrimary</view>
      <view class="sn-cfg-vars__row">
        <SnTag type="primary">Tag</SnTag>
        <SnButton type="primary" size="small">Button</SnButton>
      </view>
    </SnConfigProvider>
  </view>
</template>

<style scoped>
.sn-cfg-vars__pane {
  display: block;
  padding: 10px;
  border: 1px solid var(--sn-mp-color-border-default);
  border-radius: 8px;
}

.sn-cfg-vars__label {
  margin-bottom: 8px;
  font-family: var(--sn-mp-font-family-mono, monospace);
  font-size: 12px;
  color: var(--sn-mp-color-text-secondary);
}

.sn-cfg-vars__row {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
