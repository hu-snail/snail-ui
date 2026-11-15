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
 * clip window spans the visible members' full arcs (`(visible − 1) × step +
 * diameter`) and clips the rest (`overflow: hidden`) — the same result
 * `max-count` promises, without re-rendering the slot's vnodes (which the MP
 * compiler cannot express; see the note in sn-table). The root pads by one
 * overlap so the first avatar still starts at the group's edge, and the window
 * pulls itself over that padding by the same amount (`margin/padding` pair on
 * the compensation side) — otherwise the padding zone would sit outside the
 * window and shave the first member's outer arc.
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

import { computed, provide, ref } from 'vue';
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
/**
 * 成员注册表（uid）+ 注册版本号：头像在 setup 里注册、卸载时注销（见
 * avatar-group-context）。版本号在每次注册/注销时递增，totalCount 读它——
 * 只靠 memberUids 的数组变更不够：注册发生在**子组件的 setup**（嵌在组的
 * patch 过程里），此刻组自己的渲染 effect 尚未建立对 memberUids 的订阅，
 * Vue 的调度会把这次变更当作「渲染期间变更」丢弃，组从此不再更新（实测：
 * totalCount 已到 4 而模板永远渲染 +0）。显式版本号让组渲染 effect 在首次
 * 渲染时订阅它，之后的每次递增都必然调度一次组重渲染。
 */
const memberUids = ref<number[]>([]);
const registryVersion = ref(0);

provide(
  SN_AVATAR_GROUP,
  computed(() => ({
    size: props.size,
    shape: props.shape,
    registerMember: (uid: number) => {
      if (memberUids.value.includes(uid)) return;
      // 赋值推迟到微任务：注册发生在组的渲染 effect 执行期间（子组件 setup
      // 嵌在组 patch 里），同步变更会被 Vue 当作「渲染期间变更」丢弃——实测
      // totalCount 已正确而模板永远停在 +0。微任务里赋值落在渲染之外，
      // registryVersion 的递增必然调度一次组重渲染。
      queueMicrotask(() => {
        if (memberUids.value.includes(uid)) return;
        memberUids.value = [...memberUids.value, uid];
        registryVersion.value++;
      });
    },
    unregisterMember: (uid: number) => {
      if (!memberUids.value.includes(uid)) return;
      queueMicrotask(() => {
        memberUids.value = memberUids.value.filter((u) => u !== uid);
        registryVersion.value++;
      });
    },
  })),
);

/**
 * 成员总数 = 注册数 − 1：折叠头像**常驻渲染**（v-show 控制显隐）、永远注册，
 * 所以注册数恒为「成员 + 折叠头像」，减一即成员数——该恒等式让计数与插槽
 * 形态、填充时序彻底解耦（vnode 计数在 MP 各运行时形态/时序不一，已废弃）。
 */
const totalCount = computed<number>(() => {
  console.log("[count-eval] uids", JSON.stringify(memberUids.value), "ver", registryVersion.value);
  // 订阅注册版本号：注册/注销必经这里（见 registryVersion 注释）。
  registryVersion.value;
  return Math.max(memberUids.value.length - 1, 0);
});

/** Stack geometry (arithmetic lives in the pure geometry module). */
const geometry = computed(() =>
  resolveGeometry({
    // 直接依赖注册版本号：computed 链（geometry→totalCount→refs）的失效传播
    // 在「渲染期间变更」场景下不可靠（见 registryVersion 注释），直接读版本
    // 号保证组的渲染 effect 订阅到注册事件本身。
    total: (registryVersion.value, totalCount.value),
    maxCount: props.maxCount,
    size: props.size,
    vertical: props.vertical,
    cascading: props.cascading,
  }),
);

/** Bubble text: the reference prop verbatim, else the derived `+N`. */
const collapseText = computed<string>(() => {
  registryVersion.value; // 失效传播兜底（见 geometry 注释）
  return props.collapseAvatar || `+${geometry.value.hidden}`;
});

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
 * Clip window: the visible members' full arcs, one diameter deep. Members
 * past the window are clipped instead of re-rendered (header). The window
 * pulls itself over the root's compensation padding by one overlap and pads
 * its content back in — member 1's pulled edge lands exactly on the window's
 * outer edge, so the whole first arc stays visible; `box-sizing: border-box`
 * keeps `length` as the outer size (the padding must not widen the window).
 * The last visible member's far arc ends exactly on the far window edge, and
 * the bubble paints over the next member's sliver (see the geometry module).
 *
 * Without a window the clip must declare `overflow: visible` EXPLICITLY:
 * uni-app x views clip content by default (overflow hidden on App AND web —
 * every computed style on the device read hidden), so the default clips
 * member 1's pulled edge against the clip's own box even with no window.
 */
const clipStyle = computed(() => {
  const { clipping, diameter, length, overlap, vertical, paddingSide } = geometry.value;
  if (!clipping || diameter === null || overlap === null) return 'overflow: visible';
  const long = `${length}rpx`;
  const deep = `${diameter}rpx`;
  const pull = `margin-${paddingSide}: -${overlap}rpx; padding-${paddingSide}: ${overlap}rpx; box-sizing: border-box;`;
  return vertical
    ? `${pull} width: ${deep}; height: ${long}; overflow: hidden`
    : `${pull} width: ${long}; height: ${deep}; overflow: hidden`;
});
</script>

<template>
  <view data-snui-component="avatar-group" :class="rootClass" :style="rootStyle">
    <view class="sn-avatar-group__clip" :style="clipStyle">
      <slot />
    </view>

    <!-- Overflow bubble: one slot of the limit, sitting in the stack. 常驻渲染
         （v-show 控制显隐）——它的注册恒为 +1，成员计数恒等式依赖这一点；用
         v-if 会在 max-count 恰好等于成员数时出现注册数歧义（计数震荡）。 -->
    <SnAvatar
      v-show="geometry.clipping"
      class="sn-avatar-group__collapse"
      :text="collapseText"
    />
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
  box-sizing: border-box;
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
