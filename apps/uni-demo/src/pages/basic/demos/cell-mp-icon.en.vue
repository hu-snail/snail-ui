<script setup lang="ts">
/** Demo: sn-cell — the three leading-icon sources plus size tiers and colour tokens. */
import { registerSnIcons } from '@snui/uni-src/components/sn-icon/sn-icon-registry';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Check, CircleAlert, Heart, Star, X } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import SnCell from '@snui/uni-src/components/sn-cell/sn-cell.vue';
import SnCellGroup from '@snui/uni-src/components/sn-cell/sn-cell-group.vue';

// Inline IconData boilerplate (same convention as DemoPageShell — lucide, ISC).
const MoonIcon: IconData = {
  viewBox: '0 0 24 24',
  paths: ['M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z'],
};

// Registry track: after registration the icon is referable by name
// (registerSnIcons is idempotent and merges).
registerSnIcons({ 'cell-moon': MoonIcon });
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <text class="sn-demo__label">Name chain (built-in catalogue names need no registration; registry names are custom)</text>
    <SnCellGroup insert>
      <SnCell title="Catalogue name" value="bell" prefix-icon="bell" />
      <SnCell title="Registry name" value="cell-moon" prefix-icon="cell-moon" />
    </SnCellGroup>

    <text class="sn-demo__label">IconData objects (named imports from the icon set, win over names)</text>
    <SnCellGroup insert>
      <SnCell title="Starred" value="Star" :prefix-icon-data="Star" />
      <SnCell title="Liked" value="Heart" :prefix-icon-data="Heart" />
    </SnCellGroup>

    <text class="sn-demo__label">Size tiers (iconSize maps to --sn-mp-icon-size-*)</text>
    <SnCellGroup insert>
      <SnCell title="tiny" :prefix-icon-data="Bell" icon-size="tiny" />
      <SnCell title="small" :prefix-icon-data="Bell" icon-size="small" />
      <SnCell title="medium" :prefix-icon-data="Bell" icon-size="medium" />
      <SnCell title="large" :prefix-icon-data="Bell" icon-size="large" />
      <SnCell title="xlarge" :prefix-icon-data="Bell" icon-size="xlarge" />
    </SnCellGroup>

    <text class="sn-demo__label">Colour tokens (iconColor takes --sn-mp-color-*)</text>
    <SnCellGroup insert>
      <SnCell
        title="Verified"
        :prefix-icon-data="Check"
        icon-color="var(--sn-mp-color-feedback-success)"
      />
      <SnCell
        title="Battery low"
        :prefix-icon-data="CircleAlert"
        icon-color="var(--sn-mp-color-feedback-warning)"
      />
      <SnCell
        title="Sign-in issue"
        :prefix-icon-data="X"
        icon-color="var(--sn-mp-color-feedback-danger)"
      />
    </SnCellGroup>

    <text class="sn-demo__label">Image icons (prefixIconUrl / suffixIconUrl)</text>
    <SnCellGroup insert>
      <SnCell title="Leading image" value="Avatar" prefix-icon-url="https://picsum.photos/seed/snui-cell/96" />
      <SnCell title="Trailing image" value="Attachment" suffix-icon-url="https://picsum.photos/seed/snui-cell-file/96" />
    </SnCellGroup>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  width: 100%;
}
.sn-demo__label {
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
