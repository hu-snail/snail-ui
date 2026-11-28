<script setup lang="ts">
/**
 * Demo: sn-slider-bar — knob glyphs × knob shapes.
 *
 * `knob-icon` takes any sn-icon name (registry → 111-name built-in catalogue →
 * provider). The glyph is painted dead centre and inherits the thumb's ring
 * colour, so swapping shape or theme needs no extra wiring:
 * - circle / square / pill / round: the glyph follows the silhouette and shrinks
 *   to 56 % of its short side;
 * - heart + knob-icon-color: recolour the glyph only, not the ring;
 * - theme="ocean" + check: glyph colour follows the theme (no knob-icon-color);
 * - knob-icon-size="12px": explicit size (numbers are rpx, "12px" as-is).
 * The last row contrasts the end behaviour: with the default `overlap` the thumb
 * centre lands on the track's cap and overlaps it; `knob-align="inset"` tucks
 * the whole thumb inside, flush with the cap.
 * All seven rows share one value: drag any of them and the rest follow.
 */
import { ref } from 'vue';
import SnSliderBar from '@snui/uni-src/components/sn-slider-bar/sn-slider-bar.vue';

const circle = ref(48);
const square = ref(64);
const pill = ref(72);
const round = ref(36);
const ocean = ref(58);
const sized = ref(80);
const inset = ref(100);
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="look-head">
      <text class="look-head__label">circle + star</text>
      <text class="look-head__value">{{ circle }}</text>
    </view>
    <SnSliderBar
      v-model="circle"
      knob-shape="circle"
      knob-icon="star"
      aria-label="Circle knob with a star"
    />

    <view class="look-head">
      <text class="look-head__label">square + plus</text>
    </view>
    <SnSliderBar
      v-model="square"
      knob-shape="square"
      knob-icon="plus"
      aria-label="Square knob with a plus"
    />

    <view class="look-head">
      <text class="look-head__label">pill + heart (custom colour)</text>
    </view>
    <SnSliderBar
      v-model="pill"
      knob-shape="pill"
      :knob-size="52"
      knob-icon="heart"
      knob-icon-color="#f43f5e"
      aria-label="Pill knob with a heart"
    />

    <view class="look-head">
      <text class="look-head__label">round + minus (default silhouette)</text>
      <text class="look-head__value">{{ round }}</text>
    </view>
    <SnSliderBar v-model="round" knob-icon="minus" aria-label="Round knob with a minus" />

    <view class="look-head">
      <text class="look-head__label">theme=ocean + check (glyph follows the theme)</text>
      <text class="look-head__value">{{ ocean }}</text>
    </view>
    <SnSliderBar
      v-model="ocean"
      theme="ocean"
      knob-shape="circle"
      knob-icon="check"
      aria-label="Ocean slider with a check"
    />

    <view class="look-head">
      <text class="look-head__label">knob-icon-size="12px"</text>
      <text class="look-head__value">{{ sized }}</text>
    </view>
    <SnSliderBar
      v-model="sized"
      knob-shape="circle"
      knob-icon="trending-up"
      knob-icon-size="12px"
      aria-label="Circle knob with an explicit icon size"
    />

    <view class="look-head">
      <text class="look-head__label">knob-align="inset" (thumb tucked inside)</text>
      <text class="look-head__value">{{ inset }}</text>
    </view>
    <SnSliderBar
      v-model="inset"
      knob-shape="circle"
      knob-icon="star"
      knob-align="inset"
      aria-label="Inset knob at the end"
    />
  </view>
</template>

<style scoped>
.look-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-top: 28rpx;
  margin-bottom: 20rpx;
}
.look-head__label {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--sn-mp-color-text-secondary);
}
.look-head__value {
  font-size: 28rpx;
  font-weight: 500;
  color: var(--sn-mp-color-text-tertiary);
}
</style>
