<script setup lang="ts">
/**
 * Demo: sn-sidebar — scroll linkage (scroll-spy, AUI-OPT-08).
 *
 * - The right-hand `scroll-view` reports its distance through `@scroll` into
 *   `:scroll-top`; the left highlight follows the content position. The
 *   component never reads `window` — the host owns the scroll container
 * - Each `sn-sidebar-item` names the content section it owns through `anchor`,
 *   and `anchor-selector` measures those sections in one pass
 * - The activation line is `scroll-top` + `scroll-threshold`, with offsets
 *   measured from the highest linked section; this demo's content starts at
 *   the first section, so both share one origin and the threshold stays 0
 * - Tapping an entry runs `before-change` (taps only — scroll-driven switches
 *   bypass it) to point `scroll-into-view` at that section
 */
import { computed, nextTick, ref } from 'vue';
import SnSidebar from '@snui/uni-src/components/sn-sidebar/sn-sidebar.vue';
import SnSidebarItem from '@snui/uni-src/components/sn-sidebar/sn-sidebar-item.vue';

/** Content sections: the `id` is both the entry `anchor` and the jump target. */
const sections = [
  {
    id: 'sidebar-spy-overview',
    label: 'Overview',
    lines: [
      'Scroll the right pane; the left highlight follows.',
      'No window access — the host reports the distance.',
      'The highlight marks the section on screen.',
    ],
  },
  {
    id: 'sidebar-spy-usage',
    label: 'Basic usage',
    lines: [
      'Each entry names its section via anchor.',
      'anchor-selector measures all sections at once.',
      'The scroll event feeds scrollTop back as scroll-top.',
    ],
  },
  {
    id: 'sidebar-spy-config',
    label: 'Advanced',
    lines: [
      'scroll-threshold shifts the activation line.',
      'Reserve room for a sticky header with it.',
      'Call refresh() after the content changes.',
    ],
  },
  {
    id: 'sidebar-spy-faq',
    label: 'FAQ',
    lines: [
      'Entries without an anchor stay out of the linkage.',
      'A failed measurement keeps the last highlight.',
      'Taps run before-change; scroll switches do not.',
    ],
  },
];

const active = ref(0);
/** Live scroll distance of the scroll-view (px, reported by @scroll). */
const scrollTop = ref(0);
/** scroll-into-view target: written on tap only, never by the scroll stream. */
const jumpTarget = ref('');

const activeLabel = computed(() => sections[active.value]?.label ?? '');

function onScroll(event: { detail: { scrollTop: number } }): void {
  scrollTop.value = Math.round(event.detail.scrollTop);
}

/** Tap path: jump the content to the tapped section; scroll-spy skips this hook. */
async function beforeChange(value: number | string): Promise<boolean> {
  const section = typeof value === 'number' ? sections[value] : undefined;
  if (section === undefined) return true;
  // `scroll-into-view` ignores an unchanged target: clear then set so a
  // repeated tap on the same entry still scrolls back.
  jumpTarget.value = '';
  await nextTick();
  jumpTarget.value = section.id;
  return true;
}
</script>

<template>
  <view class="sn-demo sn-demo--column">
    <view class="sn-demo__stage">
      <SnSidebar
        v-model="active"
        class="sn-demo__nav"
        scroll-spy
        :scroll-top="scrollTop"
        anchor-selector=".sn-demo__section"
        :before-change="beforeChange"
      >
        <SnSidebarItem
          v-for="(section, index) in sections"
          :key="section.id"
          :label="section.label"
          :value="index"
          :anchor="section.id"
        />
      </SnSidebar>

      <scroll-view
        class="sn-demo__content"
        scroll-y
        :scroll-into-view="jumpTarget"
        :scroll-with-animation="true"
        @scroll="onScroll"
      >
        <view
          v-for="section in sections"
          :id="section.id"
          :key="section.id"
          class="sn-demo__section"
        >
          <text class="sn-demo__section-title">{{ section.label }}</text>
          <text v-for="line in section.lines" :key="line" class="sn-demo__section-text">
            {{ line }}
          </text>
        </view>
      </scroll-view>
    </view>
    <text class="sn-demo__meta">
      Content at {{ scrollTop }} px → highlight "{{ activeLabel }}" (a tap jumps via before-change)
    </text>
  </view>
</template>

<style scoped>
.sn-demo--column {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-2);
  width: 100%;
}
.sn-demo__stage {
  display: flex;
  box-sizing: border-box;
  width: 100%;
  height: 520rpx;
  overflow: hidden;
  border: 2rpx solid var(--sn-mp-color-border-subtle);
  border-radius: var(--sn-mp-radius-md);
}
/* The class falls through onto the sn-sidebar root, so no :deep needed. */
.sn-demo__nav {
  flex: 0 0 200rpx;
}
.sn-demo__content {
  flex: 1 1 auto;
  min-width: 0;
  min-height: 0;
  background-color: var(--sn-mp-color-background-surface);
}
.sn-demo__section {
  display: flex;
  flex-direction: column;
  gap: var(--sn-mp-spacing-1);
  padding: var(--sn-mp-spacing-3) var(--sn-mp-spacing-4);
  border-bottom: 2rpx solid var(--sn-mp-color-border-subtle);
}
.sn-demo__section-title {
  font-size: var(--sn-mp-font-size-md);
  font-weight: var(--sn-mp-font-weight-semibold);
  color: var(--sn-mp-color-text-primary);
}
.sn-demo__section-text {
  font-size: var(--sn-mp-font-size-xs);
  line-height: var(--sn-mp-font-line-height-normal);
  color: var(--sn-mp-color-text-secondary);
}
.sn-demo__meta {
  font-size: var(--sn-mp-font-size-xs);
  color: var(--sn-mp-color-text-tertiary);
}
</style>
