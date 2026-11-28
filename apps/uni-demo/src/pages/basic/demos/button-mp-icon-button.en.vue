<script setup lang="ts">
/**
 * Demo: sn-button (uni-end) — icon buttons with built-in sn-icon glyphs.
 * Covers: icon left/right placement (iconPlacement, default left), custom
 * background (bgColor / color), gradient backgrounds via custom-style, the
 * circle preset, variant forms and the loading state.
 * Spacing note: uni-app x has no flex `gap` support — inline `custom-style`
 * margins + explicit `flex-direction: row`.
 */
import SnButton from '@snui/uni-src/components/sn-button/sn-button.vue';

/** In-row spacing fallback (uni-app x lacks gap). */
const rowGap = { margin: '0 16rpx 16rpx 0' };
</script>

<template>
  <view class="sn-mp-btn-stack">
    <text class="sn-mp-btn-label">Common actions (icon size auto-fits the button preset)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" type="primary" icon-name="check">Confirm</SnButton>
      <SnButton :custom-style="rowGap" type="danger" icon-name="trash-2">Delete</SnButton>
      <SnButton :custom-style="rowGap" type="info" icon-name="arrow-right">Forward</SnButton>
    </view>

    <text class="sn-mp-btn-label">Icon left / right (iconPlacement, left by default)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" type="primary" icon-name="check">Icon left (default)</SnButton>
      <SnButton :custom-style="rowGap" type="primary" icon-name="arrow-right" icon-placement="right">
        Icon right
      </SnButton>
      <SnButton :custom-style="rowGap" circle icon-name="arrow-right" icon-placement="right" />
    </view>

    <text class="sn-mp-btn-label">Icon only (no text)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" icon-name="settings" />
      <SnButton :custom-style="rowGap" type="primary" icon-name="search" />
      <SnButton :custom-style="rowGap" type="success" icon-name="plus" />
      <SnButton :custom-style="rowGap" type="warning" icon-name="heart" />
    </view>

    <text class="sn-mp-btn-label">Custom background (bgColor / color)</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="rowGap"
        circle
        bg-color="var(--sn-mp-color-feedback-info)"
        color="var(--sn-mp-color-text-on-primary)"
        icon-name="settings"
      />
      <SnButton
        :custom-style="rowGap"
        circle
        bg-color="var(--sn-mp-color-feedback-danger)"
        color="var(--sn-mp-color-text-on-primary)"
        icon-name="trash-2"
      />
      <SnButton
        :custom-style="rowGap"
        bg-color="var(--sn-mp-color-background-surface)"
        color="var(--sn-mp-color-action-primary)"
        variant="plain"
        icon-name="download"
      >
        Download
      </SnButton>
    </view>

    <text class="sn-mp-btn-label">Gradient background (custom-style gradient, white text / glyph)</text>
    <view class="sn-mp-btn-row">
      <SnButton
        :custom-style="{
          ...rowGap,
          color: 'var(--sn-mp-color-text-on-primary)',
          'background-image': 'linear-gradient(135deg, #8b5cf6, #ec4899)',
          'border-color': 'transparent',
        }"
        circle
        icon-name="search"
      />
      <SnButton
        :custom-style="{
          ...rowGap,
          color: 'var(--sn-mp-color-text-on-primary)',
          'background-image': 'linear-gradient(135deg, #f59e0b, #ec4899)',
          'border-color': 'transparent',
        }"
        icon-name="send"
      >
        Gradient button
      </SnButton>
      <SnButton
        :custom-style="{
          ...rowGap,
          color: 'var(--sn-mp-color-text-on-primary)',
          'background-image': 'linear-gradient(135deg, #10b981, #06b6d4)',
          'border-color': 'transparent',
        }"
        icon-name="arrow-right"
        icon-placement="right"
      >
        Gradient + right icon
      </SnButton>
    </view>

    <text class="sn-mp-btn-label">Circle icon buttons</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" circle icon-name="settings" />
      <SnButton :custom-style="rowGap" circle type="primary" icon-name="search" />
      <SnButton :custom-style="rowGap" circle type="success" icon-name="plus" />
      <SnButton :custom-style="rowGap" circle type="danger" icon-name="trash-2" />
      <SnButton :custom-style="rowGap" circle size="small" type="info" icon-name="arrow-right" />
      <SnButton :custom-style="rowGap" circle size="large" type="warning" icon-name="heart" />
    </view>

    <text class="sn-mp-btn-label">Icons × variants (plain / soft / dashed / hairline)</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" variant="plain" type="primary" icon-name="settings" />
      <SnButton :custom-style="rowGap" variant="soft" type="primary" icon-name="settings" />
      <SnButton :custom-style="rowGap" variant="dashed" type="primary" icon-name="settings" />
      <SnButton :custom-style="rowGap" icon-name="settings" />
    </view>

    <text class="sn-mp-btn-label">Icon + loading state</text>
    <view class="sn-mp-btn-row">
      <SnButton :custom-style="rowGap" type="primary" icon-name="download">Download</SnButton>
      <SnButton :custom-style="rowGap" type="primary" loading>Downloading</SnButton>
    </view>
  </view>
</template>

<style scoped>
.sn-mp-btn-stack {
  display: flex;
  flex-direction: column;
}
.sn-mp-btn-row {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
}
.sn-mp-btn-label {
  margin-bottom: 12rpx;
  color: var(--sn-mp-color-text-secondary);
  font-size: var(--sn-mp-font-size-xs);
}
</style>
