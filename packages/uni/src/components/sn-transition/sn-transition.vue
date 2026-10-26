<script setup lang="ts">
/**
 * sn-transition (uni-end) — enter / leave animation wrapper for mobile.
 *
 * Reference library: wot-ui `wd-transition`
 *   (https://wot-ui.cn/component/transition.html)
 * Per AGENTS.md §112, the prop surface below mirrors wd-transition 1:1.
 * Anything new added here MUST also be added to the reference list in
 * AGENTS.md §112.
 *
 * File path follows uni-app easycom convention:
 *   components/sn-transition/sn-transition.vue
 * → auto-registered as `<sn-transition>` in any .vue that uses it.
 *
 * ## How the legs work
 *
 * The implementation follows the same generation-token pattern as `sn-popup`:
 * every enter / leave bumps a counter, awaits one tick so the browser commits
 * the initial style, then flips the target state and arms one timer for
 * `after-enter` / `after-leave`. A leg that has been superseded drops its
 * result, so a fast open→close→open cannot strand the node mid-animation.
 *
 * `name` accepts one animation name or an array of names; the array is joined
 * into `sn-transition--<a>-<b>` so combined animations (e.g. `fade` + `up`)
 * stay declarative.
 *
 * ## Dispose (AGENTS.md §41)
 *
 * One animation timer. Cleared on every leg start and in `onBeforeUnmount`.
 *
 * Per AGENTS.md §32, this component handles rendering + animation only.
 *
 * Not responsible for:
 *   - 带遮罩 / 位置的弹层 — 用 sn-popup
 *   - 页面路由过渡 — 由宿主框架负责
 */

import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue';

defineOptions({ name: 'SnTransition' });

/** Animation name. Mirrors `wd-transition` `name`. */
type TransitionName =
  | 'fade'
  | 'fade-up'
  | 'fade-down'
  | 'fade-left'
  | 'fade-right'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out';

/** Duration: ms, `false` = none, record = per leg. */
type TransitionDuration = number | boolean | Record<string, number>;

const DEFAULT_DURATION = 300;

const props = withDefaults(
  defineProps<{
    /** Whether the content is shown. */
    show?: boolean;
    /** Animation duration in ms; `false` disables it, a record sets per-leg. */
    duration?: TransitionDuration;
    /** Defer the very first render until `show` turns true. */
    lazyRender?: boolean;
    /** One animation name, or several to combine. */
    name?: TransitionName | TransitionName[] | undefined;
    /** Hide with `display: none` once the leave animation finished. */
    destroy?: boolean;
    /** Class applied on the enter start frame. */
    enterClass?: string;
    /** Class applied while entering. */
    enterActiveClass?: string;
    /** Class applied on the enter end frame. */
    enterToClass?: string;
    /** Class applied on the leave start frame. */
    leaveClass?: string;
    /** Class applied while leaving. */
    leaveActiveClass?: string;
    /** Class applied on the leave end frame. */
    leaveToClass?: string;
    /** Intercept touchmove so the page behind cannot scroll. */
    disableTouchMove?: boolean;
    /** Custom class for the root node. */
    customClass?: string;
    /** Custom inline style for the root node. */
    customStyle?: string;
  }>(),
  {
    show: false,
    duration: DEFAULT_DURATION,
    lazyRender: false,
    // `undefined` is part of the type above, so it is a legal default here
    // (CONTRIBUTING §2.6 form 2: "really distinguish unset from empty").
    name: undefined,
    destroy: true,
    enterClass: '',
    enterActiveClass: '',
    enterToClass: '',
    leaveClass: '',
    leaveActiveClass: '',
    leaveToClass: '',
    disableTouchMove: false,
    customClass: '',
    customStyle: '',
  },
);

defineSlots<{
  /** Animated content. */
  default?(): unknown;
}>();

const emit = defineEmits<{
  (e: 'before-enter'): void;
  (e: 'enter'): void;
  (e: 'after-enter'): void;
  (e: 'before-leave'): void;
  (e: 'leave'): void;
  (e: 'after-leave'): void;
  (e: 'click', event: Event): void;
}>();

/** Resolve the duration for one leg. */
function resolveDuration(value: TransitionDuration, leg: 'enter' | 'leave'): number {
  if (value === false) return 0;
  if (value === true) return DEFAULT_DURATION;
  if (typeof value === 'number') return value;
  const legValue = value[leg] ?? value.enter ?? value.leave;
  return typeof legValue === 'number' ? legValue : DEFAULT_DURATION;
}

/** Node present in the tree. */
// At rest a `destroy: true` node leaves the tree; `destroy: false` keeps it
// mounted (hidden) so its subtree keeps state.
const isMounted = ref(props.show || (!props.lazyRender && !props.destroy));
/** Content rendered at least once (`lazyRender` gate). */
const hasRendered = ref(props.show || !props.lazyRender);
/** Target visible state — drives the animation class. */
const isShown = ref(props.show);
/** Running leg. `none` = at rest. */
const phase = ref<'none' | 'enter' | 'leave'>('none');
/** Duration of the running leg. */
const durationMs = ref(resolveDuration(props.duration, 'enter'));

/** Single pending animation timer (disposed on unmount, §41). */
let timer: ReturnType<typeof setTimeout> | null = null;
/** Animation generation — drops results from superseded legs. */
let generation = 0;

function clearTimer(): void {
  if (timer !== null) {
    clearTimeout(timer);
    timer = null;
  }
}

async function enter(): Promise<void> {
  clearTimer();
  const token = ++generation;
  durationMs.value = resolveDuration(props.duration, 'enter');
  emit('before-enter');
  isMounted.value = true;
  hasRendered.value = true;
  phase.value = 'enter';
  await nextTick();
  if (token !== generation) return;
  isShown.value = true;
  emit('enter');
  if (durationMs.value <= 0) {
    phase.value = 'none';
    emit('after-enter');
    return;
  }
  timer = setTimeout(() => {
    timer = null;
    if (token !== generation) return;
    phase.value = 'none';
    emit('after-enter');
  }, durationMs.value);
}

function leave(): void {
  clearTimer();
  const token = ++generation;
  durationMs.value = resolveDuration(props.duration, 'leave');
  emit('before-leave');
  isShown.value = false;
  phase.value = 'leave';
  emit('leave');
  if (durationMs.value <= 0) {
    finishLeave();
    return;
  }
  timer = setTimeout(() => {
    if (token !== generation) return;
    finishLeave();
  }, durationMs.value);
}

function finishLeave(): void {
  timer = null;
  phase.value = 'none';
  if (props.destroy) isMounted.value = false;
  emit('after-leave');
}

watch(
  () => props.show,
  (value) => {
    if (value) void enter();
    else leave();
  },
);

onBeforeUnmount(clearTimer);

/** Combined animation name, e.g. `fade-up` for `['fade', 'up']`. */
const animationName = computed(() => {
  if (props.name === undefined) return '';
  const names = Array.isArray(props.name) ? props.name : [props.name];
  return names.join('-');
});

const rootClass = computed(() => [
  'sn-transition',
  animationName.value ? `sn-transition--${animationName.value}` : '',
  {
    'sn-transition--entering': phase.value === 'enter',
    'sn-transition--leaving': phase.value === 'leave',
    'sn-transition--hidden': !isShown.value && phase.value === 'none',
    [props.enterClass]: phase.value === 'enter' && props.enterClass !== '',
    [props.enterActiveClass]: phase.value === 'enter' && props.enterActiveClass !== '',
    [props.enterToClass]: isShown.value && props.enterToClass !== '',
    [props.leaveClass]: phase.value === 'leave' && props.leaveClass !== '',
    [props.leaveActiveClass]: phase.value === 'leave' && props.leaveActiveClass !== '',
    [props.leaveToClass]: !isShown.value && props.leaveToClass !== '',
  },
  props.customClass,
]);

const rootStyle = computed(() => {
  const parts = [`--sn-transition-duration: ${durationMs.value}ms`];
  if (props.customStyle) parts.push(props.customStyle);
  return parts.join('; ');
});

function onTap(event: Event): void {
  emit('click', event);
}

function onTouchMove(event: Event): void {
  if (!props.disableTouchMove) return;
  event.preventDefault();
}
</script>

<template>
  <view
    v-if="isMounted"
    data-snui-component="transition"
    :class="rootClass"
    :style="rootStyle"
    @tap="onTap"
    @touchmove="onTouchMove"
  >
    <slot v-if="hasRendered" />
  </view>
</template>

<style scoped>
/* uni side: --sn-mp-* aliases only (rpx units). Direct --sn-web-* / --aui-*
 * forbidden (enforced by `pnpm snui token-check --dir packages/uni --end mp`). */

.sn-transition {
  box-sizing: border-box;
  animation-duration: var(--sn-transition-duration);
  animation-timing-function: ease;
  animation-fill-mode: both;
}

/* Hidden at rest for `destroy: true` — `display: none` keeps the node cheap. */
.sn-transition--hidden {
  display: none;
}

/* ── Animation names ──────────────────────────────────────────────────── */

.sn-transition--fade {
  animation-name: sn-transition-fade;
}
.sn-transition--fade-up {
  animation-name: sn-transition-fade-up;
}
.sn-transition--fade-down {
  animation-name: sn-transition-fade-down;
}
.sn-transition--fade-left {
  animation-name: sn-transition-fade-left;
}
.sn-transition--fade-right {
  animation-name: sn-transition-fade-right;
}
.sn-transition--slide-up {
  animation-name: sn-transition-slide-up;
}
.sn-transition--slide-down {
  animation-name: sn-transition-slide-down;
}
.sn-transition--slide-left {
  animation-name: sn-transition-slide-left;
}
.sn-transition--slide-right {
  animation-name: sn-transition-slide-right;
}
.sn-transition--zoom-in {
  animation-name: sn-transition-zoom-in;
}
.sn-transition--zoom-out {
  animation-name: sn-transition-zoom-out;
}

/* Leave leg plays the same keyframes in reverse, so both directions stay
 * symmetric without duplicating every keyframe. */
.sn-transition--leaving {
  animation-direction: reverse;
}

/* At rest: no animation, just the final style. */
.sn-transition:not(.sn-transition--entering):not(.sn-transition--leaving) {
  animation-name: none;
}

@keyframes sn-transition-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
@keyframes sn-transition-fade-up {
  from {
    opacity: 0;
    transform: translateY(24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes sn-transition-fade-down {
  from {
    opacity: 0;
    transform: translateY(-24rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes sn-transition-fade-left {
  from {
    opacity: 0;
    transform: translateX(24rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes sn-transition-fade-right {
  from {
    opacity: 0;
    transform: translateX(-24rpx);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
@keyframes sn-transition-slide-up {
  from {
    transform: translateY(100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes sn-transition-slide-down {
  from {
    transform: translateY(-100%);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes sn-transition-slide-left {
  from {
    transform: translateX(100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes sn-transition-slide-right {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}
@keyframes sn-transition-zoom-in {
  from {
    opacity: 0;
    transform: scale(0.8);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
@keyframes sn-transition-zoom-out {
  from {
    opacity: 0;
    transform: scale(1.2);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
