<script setup lang="ts">
/**
 * SnProSettings — layout preferences drawer of @snui/admin-layout.
 *
 * Opened from the header gear (SnProLayout `showSettings`). Sections:
 *   - layout shape — always shown
 *   - theme mode light/dark — shown when `mode` is bound
 *   - primary color swatches — shown when `primaryId` is bound
 *   - tab-strip style — shown when `tabType` is bound
 *
 * Pure preference surface: every section is a controlled v-model — the host
 * owns persistence and what a value does (token swap, v-model:layout …).
 * All copy comes in through `labels` so the package stays i18n-free.
 */
import { computed } from 'vue';
import { SnDrawer, SnDrawerContent, SnRadioGroup } from '@snui/vue-web';
import type { SnRadioOption } from '@snui/vue-web';
import type {
  SnProLayoutMode,
  SnProPrimaryColor,
  SnProSettingsLabels,
  SnProTabType,
} from '../pro-layout/sn-pro-layout-types';

defineOptions({ name: 'SnProSettings' });

const DEFAULT_LABELS: SnProSettingsLabels = {
  title: 'Settings',
  layout: 'Layout',
  layoutSide: 'Side',
  layoutTop: 'Top',
  layoutMix: 'Mix',
  layoutDual: 'Dual',
  mode: 'Theme mode',
  light: 'Light',
  dark: 'Dark',
  primary: 'Primary color',
  tabStyle: 'Tab style',
  tabLine: 'Line',
  tabCard: 'Card',
  tabBar: 'Bar',
  tabSegment: 'Segment',
  tabChrome: 'Chrome',
};

const LAYOUT_MODES: SnProLayoutMode[] = ['side', 'top', 'mix', 'dual'];
const MODES = ['light', 'dark'] as const;
const TAB_TYPES: SnProTabType[] = ['chrome', 'card', 'line', 'bar', 'segment'];

const LAYOUT_LABEL_KEY = {
  side: 'layoutSide',
  top: 'layoutTop',
  mix: 'layoutMix',
  dual: 'layoutDual',
} as const satisfies Record<SnProLayoutMode, keyof SnProSettingsLabels>;

const TAB_LABEL_KEY = {
  line: 'tabLine',
  card: 'tabCard',
  bar: 'tabBar',
  segment: 'tabSegment',
  chrome: 'tabChrome',
} as const satisfies Record<SnProTabType, keyof SnProSettingsLabels>;

const props = withDefaults(
  defineProps<{
    /** Drawer visibility. `v-model:show`. */
    show?: boolean | undefined;
    /** Layout shape. `v-model:layout`. */
    layout?: SnProLayoutMode | undefined;
    /** Theme mode. `v-model:mode`; absent → section hidden. */
    mode?: 'light' | 'dark' | undefined;
    /** Selected primary color id. `v-model:primaryId`; absent → section hidden. */
    primaryId?: string | undefined;
    /** Swatches for the primary section. */
    primaryColors?: SnProPrimaryColor[] | undefined;
    /** Tab-strip style. `v-model:tabType`; absent → section hidden. */
    tabType?: SnProTabType | undefined;
    /** Localized copy; unspecified keys fall back to the defaults. */
    labels?: Partial<SnProSettingsLabels> | undefined;
  }>(),
  {
    show: false,
    layout: 'side',
    // mode / primaryId / tabType are deliberately absent: an unbound prop
    // must stay `undefined` so its section hides (boolean casting would
    // only hurt Boolean props, but explicit absence keeps the contract
    // symmetric with SnProLayout's other optional v-models).
    primaryColors: () => [],
    labels: () => ({}),
  },
);

const emit = defineEmits<{
  (e: 'update:show', show: boolean): void;
  (e: 'update:layout', mode: SnProLayoutMode): void;
  (e: 'update:mode', mode: 'light' | 'dark'): void;
  (e: 'update:primaryId', id: string): void;
  (e: 'update:tabType', type: SnProTabType): void;
}>();

const t = computed<SnProSettingsLabels>(() => ({ ...DEFAULT_LABELS, ...props.labels }));

const modeOptions = computed<SnRadioOption[]>(() =>
  MODES.map((mode) => ({ value: mode, label: mode === 'light' ? t.value.light : t.value.dark })),
);

const tabTypeOptions = computed<SnRadioOption[]>(() =>
  TAB_TYPES.map((type) => ({ value: type, label: t.value[TAB_LABEL_KEY[type]] })),
);

function close(): void {
  emit('update:show', false);
}
</script>

<template>
  <SnDrawer :show="props.show === true" placement="right" :width="320" @update:show="(v) => emit('update:show', v)">
    <SnDrawerContent :title="t.title" closable @close="close">
      <div class="sn-pro-settings">
        <section class="sn-pro-settings__section">
          <h3 class="sn-pro-settings__heading">{{ t.layout }}</h3>
          <div class="sn-pro-settings__layout-grid" role="radiogroup" :aria-label="t.layout">
            <button
              v-for="mode in LAYOUT_MODES"
              :key="mode"
              type="button"
              role="radio"
              :class="[
                'sn-pro-settings__layout-card',
                { 'sn-pro-settings__layout-card--active': mode === props.layout },
              ]"
              :aria-checked="mode === props.layout"
              @click="emit('update:layout', mode)"
            >
              <span
                class="sn-pro-settings__layout-thumb"
                :class="`sn-pro-settings__layout-thumb--${mode}`"
                aria-hidden="true"
              />
              <span class="sn-pro-settings__layout-name">{{ t[LAYOUT_LABEL_KEY[mode]] }}</span>
            </button>
          </div>
        </section>

        <section v-if="props.mode !== undefined" class="sn-pro-settings__section">
          <h3 class="sn-pro-settings__heading">{{ t.mode }}</h3>
          <SnRadioGroup
            button
            size="small"
            :options="modeOptions"
            :model-value="props.mode"
            @update:model-value="(v) => emit('update:mode', v === 'dark' ? 'dark' : 'light')"
          />
        </section>

        <section v-if="props.primaryId !== undefined" class="sn-pro-settings__section">
          <h3 class="sn-pro-settings__heading">{{ t.primary }}</h3>
          <div class="sn-pro-settings__swatches" role="listbox" :aria-label="t.primary">
            <button
              v-for="color in props.primaryColors"
              :key="color.id"
              type="button"
              role="option"
              class="sn-pro-settings__swatch"
              :class="{ 'sn-pro-settings__swatch--active': color.id === props.primaryId }"
              :style="{ backgroundColor: color.color }"
              :aria-selected="color.id === props.primaryId"
              :aria-label="color.id"
              @click="emit('update:primaryId', color.id)"
            />
          </div>
        </section>

        <section v-if="props.tabType !== undefined" class="sn-pro-settings__section">
          <h3 class="sn-pro-settings__heading">{{ t.tabStyle }}</h3>
          <SnRadioGroup
            button
            size="small"
            :options="tabTypeOptions"
            :model-value="props.tabType"
            @update:model-value="(v) => emit('update:tabType', v as SnProTabType)"
          />
        </section>
      </div>
    </SnDrawerContent>
  </SnDrawer>
</template>

<style scoped>
.sn-pro-settings {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-6);
}

.sn-pro-settings__section {
  display: flex;
  flex-direction: column;
  gap: var(--sn-web-spacing-3);
}

.sn-pro-settings__heading {
  margin: 0;
  font-size: var(--sn-web-font-size-sm);
  font-weight: 600;
  color: var(--sn-web-color-text-secondary);
}

/* Layout cards — a 2×2 grid of clickable thumbnails. The thumbnail draws the
 * shape with borders (no child elements): solid edges stand for bars. */
.sn-pro-settings__layout-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--sn-web-spacing-3);
}

.sn-pro-settings__layout-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--sn-web-spacing-2);
  padding: var(--sn-web-spacing-3);
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  cursor: pointer;
}

.sn-pro-settings__layout-card--active {
  border-color: var(--sn-web-color-action-primary);
  box-shadow: 0 0 0 1px var(--sn-web-color-action-primary);
}

.sn-pro-settings__layout-thumb {
  --sn-pro-settings-thumb-bar: var(--sn-web-color-text-quaternary);
  box-sizing: border-box;
  width: 48px;
  height: 32px;
  border: 1px solid var(--sn-web-color-border-default);
  border-radius: 4px;
  background: var(--sn-web-color-background-surface);
}

.sn-pro-settings__layout-thumb--side {
  border-left: 9px solid var(--sn-pro-settings-thumb-bar);
}

.sn-pro-settings__layout-thumb--top {
  border-top: 8px solid var(--sn-pro-settings-thumb-bar);
}

.sn-pro-settings__layout-thumb--mix {
  border-top: 7px solid var(--sn-pro-settings-thumb-bar);
  border-left: 9px solid var(--sn-pro-settings-thumb-bar);
}

.sn-pro-settings__layout-thumb--dual {
  border-left: 4px solid var(--sn-pro-settings-thumb-bar);
  box-shadow: inset 14px 0 0 -10px var(--sn-pro-settings-thumb-bar);
}

.sn-pro-settings__layout-name {
  font-size: var(--sn-web-font-size-xs);
  color: var(--sn-web-color-text-secondary);
}

.sn-pro-settings__swatches {
  display: flex;
  flex-wrap: wrap;
  gap: var(--sn-web-spacing-3);
}

.sn-pro-settings__swatch {
  width: 26px;
  height: 26px;
  padding: 0;
  border: none;
  border-radius: var(--sn-web-radius-full);
  cursor: pointer;
  transition: transform 120ms ease;
}

.sn-pro-settings__swatch:hover {
  transform: scale(1.1);
}

.sn-pro-settings__swatch--active {
  outline: 2px solid var(--sn-web-color-text-primary);
  outline-offset: 2px;
}
</style>
