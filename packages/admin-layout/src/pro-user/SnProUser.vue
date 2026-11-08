<script setup lang="ts">
/**
 * SnProUser — sidebar-footer user card of @snui/admin-layout.
 *
 * Shared layout piece: a layout pins it at the bottom of its sider
 * (`SnProLayoutClassic` does), and it collapses to just the avatar when the
 * sider folds — the same gesture the brand area makes.
 *
 * Purely presentational + event-driven: the dropdown only emits
 * `select(key, item)`. Logging out, opening a profile page, … is the HOST's
 * concern (package boundary, ADR-0006).
 */
import { computed } from 'vue';
import { SnAvatar, SnDropdown } from '@snui/vue-web';
import type {
  SnDropdownKey,
  SnDropdownOption,
  SnDropdownPlacement,
  SnDropdownTrigger,
  SnMenuOption,
} from '@snui/vue-web';

defineOptions({ name: 'SnProUser' });

const props = withDefaults(
  defineProps<{
    /** Display name. */
    name?: string | undefined;
    /** Secondary line (role / e-mail). */
    description?: string | undefined;
    /** Avatar image URL; omitted → letter tile from `name`. */
    avatar?: string | undefined;
    /** Folded sider: avatar only. Default false. */
    collapsed?: boolean | undefined;
    /** Dropdown rows, in SnMenu option shape. */
    menus?: SnMenuOption[] | undefined;
    /** What opens the menu. Default 'click' (the whole card is the trigger). */
    trigger?: SnDropdownTrigger | undefined;
    /** Panel placement — the card sits at the bottom of the sider, so the
     * panel opens upwards by default. */
    placement?: SnDropdownPlacement | undefined;
    /** Accessible label of the trigger button. */
    menuLabel?: string | undefined;
  }>(),
  {
    name: '',
    description: '',
    avatar: '',
    collapsed: false,
    menus: () => [],
    trigger: 'click',
    placement: 'top-start',
    menuLabel: '用户菜单',
  },
);

const emit = defineEmits<{
  /** A dropdown row was activated — the HOST decides what it means. */
  (e: 'select', key: SnDropdownKey, item: SnDropdownOption): void;
}>();

/** Single level of nesting is enough for a profile menu; deeper levels are
 * ignored exactly like SnDropdown does. */
function toDropdownOption(option: SnMenuOption): SnDropdownOption {
  const mapped: SnDropdownOption = { key: option.key, label: option.label };
  if (option.disabled !== undefined) mapped.disabled = option.disabled;
  if (option.icon !== undefined) mapped.icon = option.icon;
  if (option.children !== undefined) mapped.children = option.children.map(toDropdownOption);
  return mapped;
}

const dropdownOptions = computed<SnDropdownOption[]>(() => props.menus.map(toDropdownOption));

/** Avatar letter — first character of the name, upper-cased for latin names. */
const initial = computed(() => props.name.trim().charAt(0).toUpperCase());

function onSelect(key: SnDropdownKey, item: SnDropdownOption): void {
  emit('select', key, item);
}
</script>

<template>
  <SnDropdown
    class="sn-pro-user"
    :options="dropdownOptions"
    :trigger="props.trigger"
    :placement="props.placement"
    @select="onSelect"
  >
    <button
      type="button"
      class="sn-pro-user__trigger"
      :class="{ 'sn-pro-user__trigger--collapsed': props.collapsed }"
      :aria-label="props.menuLabel"
      :title="props.menuLabel"
    >
      <slot>
        <SnAvatar
          class="sn-pro-user__avatar"
          :src="props.avatar === '' ? undefined : props.avatar"
          :fallback-text="initial === '' ? undefined : initial"
          circle
          :size="32"
        />
        <span v-if="!props.collapsed" class="sn-pro-user__meta">
          <span class="sn-pro-user__name">{{ props.name }}</span>
          <span v-if="props.description !== ''" class="sn-pro-user__desc">
            {{ props.description }}
          </span>
        </span>
      </slot>
    </button>
  </SnDropdown>
</template>

<style scoped>
.sn-pro-user {
  width: 100%;
}

.sn-pro-user__trigger {
  display: flex;
  align-items: center;
  gap: var(--sn-web-spacing-3);
  box-sizing: border-box;
  width: 100%;
  padding: var(--sn-web-spacing-2) var(--sn-web-spacing-3);
  border: 1px solid transparent;
  border-radius: var(--sn-web-radius-md);
  background: transparent;
  color: inherit;
  cursor: pointer;
  text-align: left;
}

.sn-pro-user__trigger:hover {
  background-color: var(--sn-web-color-background-subtle);
}

/* Folded sider: centre the avatar like the brand mark does. */
.sn-pro-user__trigger--collapsed {
  justify-content: center;
  padding: var(--sn-web-spacing-2) 0;
}

.sn-pro-user__avatar {
  flex-shrink: 0;
}

.sn-pro-user__meta {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sn-pro-user__name {
  overflow: hidden;
  font-size: var(--sn-web-font-size-sm);
  font-weight: var(--sn-web-font-weight-semibold);
  color: var(--sn-web-color-text-primary);
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sn-pro-user__desc {
  overflow: hidden;
  font-size: var(--sn-web-font-size-xs);
  color: var(--sn-web-color-text-tertiary);
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
