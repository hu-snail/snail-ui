<script setup lang="ts">
/**
 * sn-avatar-group (uni-end) — overlapping avatar stack with an overflow
 * collapse bubble.
 *
 * Reference library: wot-ui `wd-avatar-group`
 *   (https://wot-ui.cn/component/avatar.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-avatar-group 1:1:
 *   max-count / cascading / shape / size / collapse-avatar / vertical /
 *   custom-class / custom-style. Default slot = the avatar list.
 *
 * ## Overflow rule (documented interpretation)
 *
 * `max-count` is the number of slots the group may occupy. When the slot holds
 * more avatars than that, the group shows `max-count − 1` avatars plus one
 * collapse bubble, i.e. `max-count` visible slots in total and `total −
 * max-count + 1` hidden. The bubble prints `collapse-avatar` verbatim when it
 * is set (the reference documents it as the collapse avatar's text), and
 * `+{hidden}` when it is empty. Cross-end consistent with the web-end
 * `SnAvatarGroup` (naive-ui rule), so a reader sees one rule in both ends.
 *
 * ## Why the stack is styled through variables instead of `:deep()`
 *
 * The avatars arrive through the slot, so they belong to the CALLER's style
 * scope: a `.sn-avatar-group__clip :deep(.sn-avatar)` rule cannot be expressed
 * on App and would not match scoped slot content (AGENTS.md §116.2 — see the
 * same note in sn-form / sn-grid / sn-root-portal). Instead the group hands
 * the stacking numbers down as inherited CSS custom properties and every
 * `sn-avatar` applies them to itself:
 *
 *   --sn-avatar-group-overlap-left / -top   negative stack step
 *   --sn-avatar-group-ring                  separating ring
 *
 * A standalone avatar inherits the neutral defaults, so its own geometry is
 * unchanged.
 *
 * ## Geometry (why there is a clip window)
 *
 * Every member avatar pulls itself left (or up) by the overlap, so member `k`
 * starts at `k × (diameter − overlap)`. To hide the avatars past the limit the
 * clip window is sized to exactly `visibleCount` steps and clips the rest
 * (`overflow: hidden`) — the same result `max-count` promises, without
 * re-rendering the slot's vnodes (which the MP compiler cannot express; see
 * the note in sn-table). The root pads by one overlap so the first avatar
 * still starts at the group's left edge.
 *
 * Sizes that cannot be resolved to `rpx` (`'20%'`, `'auto'`, …) cannot be
 * measured, so `max-count` is skipped for them: every avatar stays visible and
 * no bubble is rendered. Predictable and documented, instead of a half-clipped
 * stack (AGENTS.md §85).
 *
 * Per Spec-02 v1.1 §3 (end: mp), uni-side component CSS uses only `--sn-mp-*`
 * aliases (rpx units).
 *
 * File path follows uni-app easycom convention:
 *   components/sn-avatar-group/sn-avatar-group.vue
 * → auto-registered as `<sn-avatar-group>` in any .vue that uses it.
 *
 * Usage:
 *   <sn-avatar-group :max-count="3" collapse-avatar="+2">
 *     <sn-avatar v-for="user in users" :key="user.id" :src="user.avatar" />
 *   </sn-avatar-group>
 *
 * Not responsible for:
 *   - 单个头像内部结构（图片 / 文字 / 图标回退）— 用 sn-avatar
 *   - 角标 / 在线状态 — sn-badge / sn-avatar 的 status
 */

import { computed, provide, useSlots } from 'vue';
import { Fragment } from 'vue';
import SnAvatar from '../sn-avatar/sn-avatar.vue';
import { SN_AVATAR_GROUP } from '../sn-avatar/avatar-group-context';
import { resolveGeometry } from './sn-avatar-group-geometry';

defineOptions({ name: 'SnAvatarGroup' });

/** Separating ring painted on every member avatar (surface coloured). */
const RING = '0 0 0 4rpx var(--sn-mp-color-background-surface)';

// Reference: wot-ui wd-avatar-group Attributes
//   (https://wot-ui.cn/component/avatar.html)
// All prop names match wd-avatar-group 1:1.
const props = withDefaults(
  defineProps<{
    /** 最大显示数量（含折叠头像占用的 1 个位置），超出后显示折叠头像。 */
    maxCount?: number | undefined;
    /** 叠层方向：left-up（向左叠）/ right-up（向右叠）。 */
    cascading?: 'left-up' | 'right-up';
    /** 超出最大数量时折叠头像显示文本；留空时自动显示 `+N`。 */
    collapseAvatar?: string;
    /** 是否垂直展示（垂直时忽略 `cascading`）。 */
    vertical?: boolean;
    /** 统一设置组内头像形状。 */
    shape?: 'round' | 'square';
    /** 统一设置组内头像尺寸（预设名 / 数值 px / `rpx` 长度）。 */
    size?: string | number;
    /** 根节点自定义类名。 */
    customClass?: string;
    /** 根节点自定义 inline style。 */
    customStyle?: string;
  }>(),
  {
    maxCount: undefined,
    cascading: 'left-up',
    collapseAvatar: '',
    vertical: false,
    shape: 'round',
    size: 'normal',
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** 头像列表，放置 sn-avatar 组件。 */
  default?(): unknown;
}>();

/*
 * The group owns the members' uniform size / shape (wd-avatar-group: "统一设置
 * 组内头像…"). provide/inject survives every end, unlike re-rendering the
 * slot's vnodes with extra props — the MP compiler cannot express that.
 */
provide(
  SN_AVATAR_GROUP,
  computed(() => ({ size: props.size, shape: props.shape })),
);

const slots = useSlots();

/**
 * Count the avatars in the default slot.
 *
 * Slot content arrives as vnodes: a `v-for` produces an array, `v-if` chains
 * produce comment placeholders, and a template with multiple roots produces a
 * Fragment — all three are flattened here. Wrapper elements are descended into
 * (their children are still avatars), component vnodes are counted as one.
 *
 * Only `Fragment` is imported by name: the MP runtime (`uni-mp-vue`) does not
 * export `Comment`, so comment / text placeholders are recognised
 * structurally — any other symbol-typed vnode is not an avatar and is skipped.
 */
function countAvatarNodes(nodes: unknown): number {
  let total = 0;
  const walk = (value: unknown): void => {
    if (Array.isArray(value)) {
      for (const entry of value) walk(entry);
      return;
    }
    if (value === null || value === undefined || typeof value !== 'object') {
      // Text / number vnodes are never avatars; skip them.
      return;
    }
    const vnode = value as { type?: unknown; children?: unknown };
    if (vnode.type === Fragment) {
      // Fragment (v-for / multi-root template) recurses.
      walk(vnode.children);
      return;
    }
    if (typeof vnode.type === 'symbol') {
      // Comment / text placeholders (v-if chains, interpolations): the MP
      // runtime does not export their symbols, so anything symbol-typed that
      // is not a Fragment is skipped.
      return;
    }
    if (typeof vnode.type === 'string') {
      // A plain element (wrapper `<view>`): descend, but do not count it.
      walk(vnode.children);
      return;
    }
    total += 1;
  };
  walk(nodes);
  return total;
}

const totalCount = computed<number>(() => countAvatarNodes(slots.default?.() ?? []));

/** Stack geometry (arithmetic lives in the pure geometry module). */
const geometry = computed(() =>
  resolveGeometry({
    total: totalCount.value,
    maxCount: props.maxCount,
    size: props.size,
    vertical: props.vertical,
    cascading: props.cascading,
  }),
);

/** Bubble text: the reference prop verbatim, else the derived `+N`. */
const collapseText = computed<string>(() => props.collapseAvatar || `+${geometry.value.hidden}`);

const rootClass = computed(() => [
  'sn-avatar-group',
  `sn-avatar-group--${props.cascading}`,
  props.vertical ? 'sn-avatar-group--vertical' : '',
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts: string[] = [];
  const step = geometry.value.overlap;
  if (step !== null) {
    // Stacking numbers every member avatar reads from its own stylesheet.
    parts.push(`--sn-avatar-group-overlap-left: ${props.vertical ? '0rpx' : `-${step}rpx`}`);
    parts.push(`--sn-avatar-group-overlap-top: ${props.vertical ? `-${step}rpx` : '0rpx'}`);
    parts.push(`--sn-avatar-group-ring: ${RING}`);
    // Compensate the first avatar's own negative margin so the stack still
    // starts at the group's edge; the side follows the cascade direction.
    const side = geometry.value.paddingSide;
    parts.push(`padding-${side}: ${step}rpx`);
  }
  if (props.customStyle) parts.push(props.customStyle);
  return parts.length > 0 ? parts.join('; ') : undefined;
});

/**
 * Clip window: exactly as long as the visible members occupy, one diameter
 * deep. Members past the window are clipped instead of re-rendered (header).
 */
const clipStyle = computed(() => {
  const { clipping, diameter, length, vertical } = geometry.value;
  if (!clipping || diameter === null) return undefined;
  const long = `${length}rpx`;
  const deep = `${diameter}rpx`;
  return vertical
    ? `width: ${deep}; height: ${long}; overflow: hidden`
    : `width: ${long}; height: ${deep}; overflow: hidden`;
});
</script>

<template>
  <view data-snui-component="avatar-group" :class="rootClass" :style="rootStyle">
    <view class="sn-avatar-group__clip" :style="clipStyle">
      <slot />
    </view>

    <!-- Overflow bubble: one slot of the limit, sitting in the stack. -->
    <SnAvatar v-if="geometry.clipping" class="sn-avatar-group__collapse" :text="collapseText" />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-avatar-group {
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
}

/* Cascade direction: `left-up` mirrors the stack (and the bubble) to the left.
   Declared BEFORE the vertical rules: with the default `cascading="left-up"`
   both classes land on the root, and same-specificity rules resolve by order —
   putting the cascade here used to flip a vertical group back to a row. */
.sn-avatar-group--left-up {
  flex-direction: row-reverse;
}

.sn-avatar-group--left-up .sn-avatar-group__clip {
  flex-direction: row-reverse;
}

/* Vertical wins over the cascade (vertical mode ignores `cascading`). */
.sn-avatar-group--vertical,
.sn-avatar-group--vertical.sn-avatar-group--left-up {
  flex-direction: column;
}

.sn-avatar-group__clip {
  display: flex;
  align-items: center;
  /* The clip window (clipping state) relies on this staying a single line. */
  flex-wrap: nowrap;
}

.sn-avatar-group--vertical .sn-avatar-group__clip,
.sn-avatar-group--vertical.sn-avatar-group--left-up .sn-avatar-group__clip {
  flex-direction: column;
  align-items: center;
}

/* The bubble is an sn-avatar like any other member, so it already reads
   --sn-avatar-group-overlap-* / --sn-avatar-group-ring. */
.sn-avatar-group__collapse {
  flex: 0 0 auto;
}
</style>
