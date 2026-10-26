<template>
  <div
    :id="optionDomId"
    :class="['sn-select-option', `sn-select-option--${size}`, {
      'sn-select-option--selected': selected,
      'sn-select-option--pending': pending,
      'sn-select-option--disabled': disabled,
    }]"
    role="option"
    :aria-selected="selected ? 'true' : 'false'"
    :aria-disabled="disabled ? 'true' : undefined"
    :aria-label="label"
    :data-value="String(value)"
    @click.stop="onClick"
    @mouseenter="onHover"
    @mousedown.prevent
  >
    <span class="sn-select-option__label">{{ label }}</span>
  </div>
</template>

<script setup lang="ts">
/**
 * SnOption — one row inside the SnSelect dropdown menu (internal).
 *
 * Rendered by SnSelect through provide/inject (the same pattern
 * SnCheckboxGroup uses). Owns nothing: every state (selected / pending /
 * disabled) is injected from the parent, and clicks bubble up through the
 * injected context. Not exported from the package entry — SnSelect is the
 * public surface.
 */
import { computed, inject } from 'vue'
import { SN_SELECT_MENU_KEY, type SnSelectMenuContext } from './sn-select-types'

defineOptions({ name: 'SnOption' })

const props = withDefaults(
  defineProps<{
    /** Row label text. */
    label: string
    /** Row value — what selection commits to the v-model. */
    value: string | number | boolean
    /** Row-level disabled (ORs with select-level disabled). */
    disabled?: boolean
  }>(),
  { disabled: false },
)

const menu = inject(SN_SELECT_MENU_KEY, null)

const optionDomId = computed<string>(() => menu?.optionId(props.value) ?? '')

const selected = computed<boolean>(() => menu?.isOptionSelected(props.value) ?? false)
const pending = computed<boolean>(() => menu?.pendingValue.value === props.value)
const disabled = computed<boolean>(() =>
  props.disabled || (menu?.menuDisabled.value ?? false),
)
const size = computed(() => menu?.menuSize.value ?? 'medium')

function onClick(): void {
  if (disabled.value) return
  menu?.chooseOption(props.value)
}

function onHover(): void {
  if (disabled.value) return
  menu?.setPending(props.value)
}
</script>

<style scoped>
.sn-select-option {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 0 var(--sn-web-select-option-padding-x, 10px);
  min-height: var(--sn-web-select-option-height, 34px);
  box-sizing: border-box;
  font-family: inherit;
  font-size: var(--sn-web-select-option-font-size, 14px);
  line-height: 1.4;
  color: var(--sn-web-select-option-text-color, var(--sn-web-color-text-primary));
  cursor: pointer;
  white-space: nowrap;
}

/* Pending (keyboard / hover highlight) — soft fill, no border change. */
.sn-select-option--pending {
  background-color: var(
    --sn-web-select-option-bg-hover,
    var(--sn-web-color-background-soft, rgba(0, 0, 0, 0.04))
  );
}

/* Selected row — primary-tinted fill + text accent. The leading accent bar
 * doubles as the naive-style check mark affordance without an icon glyph. */
.sn-select-option--selected {
  background-color: var(
    --sn-web-select-option-bg-selected,
    var(--sn-web-color-action-primary-soft)
  );
  color: var(
    --sn-web-select-option-text-color-selected,
    var(--sn-web-color-action-primary)
  );
  font-weight: 500;
}

.sn-select-option--selected::before {
  content: '';
  position: absolute;
  left: 0;
  top: 6px;
  bottom: 6px;
  width: var(--sn-web-select-option-selected-bar-width, 3px);
  border-radius: var(--sn-web-select-radius, 6px);
  background-color: var(
    --sn-web-select-option-selected-bar-color,
    var(--sn-web-color-action-primary)
  );
}

.sn-select-option__label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sn-select-option--disabled {
  cursor: not-allowed;
  color: var(
    --sn-web-select-option-text-color-disabled,
    var(--sn-web-color-text-disabled)
  );
  background-color: transparent;
}

.sn-select-option--disabled.sn-select-option--selected {
  background-color: var(
    --sn-web-select-option-bg-selected-disabled,
    var(--sn-web-color-background-soft)
  );
  color: var(
    --sn-web-select-option-text-color-disabled,
    var(--sn-web-color-text-disabled)
  );
}

/* Pending outline for keyboard focus visibility inside the menu. */
.sn-select-option--pending:focus-visible {
  outline: 2px solid var(--sn-web-select-option-focus-outline, var(--sn-web-color-action-primary));
  outline-offset: -2px;
}

/* Size presets — shrink row height / font as the trigger shrinks. */
.sn-select-option--mini { min-height: var(--sn-web-select-option-height, 26px); font-size: 11px; }
.sn-select-option--tiny { min-height: var(--sn-web-select-option-height, 28px); font-size: 12px; }
.sn-select-option--small { min-height: var(--sn-web-select-option-height, 30px); font-size: 13px; }
.sn-select-option--medium { min-height: var(--sn-web-select-option-height, 34px); font-size: 14px; }
.sn-select-option--large { min-height: var(--sn-web-select-option-height, 40px); font-size: 15px; }
</style>
