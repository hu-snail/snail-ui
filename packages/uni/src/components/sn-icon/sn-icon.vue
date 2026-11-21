<script setup lang="ts">
/**
 * sn-icon — uni 端图标组件（AUI-MP-002，rewrite）。
 *
 * ## 三条渲染路径（优先级从上到下）
 *
 * 1. **iconfont 字形**（`name` + `classPrefix` / `cssIcon`）— wot-ui 兼容
 *    API：渲染 `<view class="{classPrefix}-{name}">`，字形由宿主加载的
 *    iconfont 样式表提供（阿里 iconfont 直接可用）。颜色走 CSS `color`
 *    继承，跨端一致性最好。
 * 2. **远程 SVG**（string `icon` 命中异步 Provider，如 Iconify）— 渲染
 *    `<view class="sn-icon__remote">` + `background-image` data URL。
 *    请求由 `sn-icon-iconify.ts` 承担（缓存 / 超时 / AbortSignal），
 *    组件侧只负责竞态保护与失败降级（结构化警告 + 空渲染）。
 * 3. **IconData**（对象，或 string `icon` 同步命中 registry / 内置目录）—
 *    H5 渲染 inline `<svg>`，`currentColor` 生效；小程序没有 `<svg>` 元素
 *    （unknown tag 渲染为空），改走 `<image>` + SVG data URL（颜色经
 *    computedStyle 解析后烘焙进 data URL，见 `sn-icon-mp.ts`）。
 *
 * ## string icon API（本版新增）
 *
 *   <SnIcon icon="arrow-down" />        // 内置目录（111 个，7 分类）
 *   <SnIcon icon="mdi:home" />          // Iconify 按需拉取（默认开启）
 *   <SnIcon icon="my-set:logo" />       // 自定义 Provider（registerSnIconProvider）
 *
 * 解析顺序：registry（registerSnIcons）→ 内置目录（sn-icon-catalog）→
 * Provider（`prefix:rest`）。`configSnIcons({ iconify: false })` 可关闭
 * 网络回退。iconfont 用户不受影响：`name` 语义不变（纯字形 class）。
 *
 * ## Tree-shakeability
 *
 * `icon` 传对象时维持「每个图标一个 ESM 数据模块」的按需契约；string
 * 形态命中内置目录（`sn-icon-catalog.ts` 静态资产，随引用方 chunk 打包）。
 *
 * ## Accessibility
 *
 * 包装节点默认 `aria-hidden="true"`（图标是装饰）。可访问名称请放在
 * 外层按钮 / 链接 / label 上，而不是图标本身（AGENTS.md §52）。
 */

import { computed, getCurrentInstance, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';
import {
  resolveSnIconStringSync,
  resolveSnIconStringAsync,
  SnIconSourceError,
} from './sn-icon-providers';
import { toRpxSize } from '../../utils/sn-size';
import { resolveUniHost } from '../../utils/uni-host';
import { buildIconDataUrl, isConcreteIconColor, useMpIconColor } from './sn-icon-mp';
import { paintIconData, rasterizeIconDataUrl, type RasterCanvas2d } from './sn-icon-mp-raster';
import { resolveFontIcon } from './sn-icon-font';
import type { IconData } from './sn-icon-types';

defineOptions({ name: 'SnIcon' });

/**
 * 图标数据类型契约的本体在 `./sn-icon-types`（纯 ts 模块，uni-x 端的
 * 稳定导入目标——.uvue 产物不承载类型导出）。这里 re-export 保持既有
 * `from 'sn-icon.vue'` 导入路径兼容。
 */
export type { IconData } from './sn-icon-types';

const props = withDefaults(
  defineProps<{
    /**
     * 图标数据 / 图标名。对象 = SVG path 数据（tree-shakeable）；字符串 =
     * registry → 内置目录 → Provider（`prefix:rest`）依次解析。与 `name`
     * 二选一；两者同时给出时 `name`（iconfont 字形）优先。
     */
    icon?: IconData | string | undefined;
    /**
     * iconfont 字形名 — wot-ui 的原生 API（`wd-icon`）。
     *
     * 渲染 `<view class="{classPrefix}-{name}">`，任何类名遵循
     * `{prefix}-{name}` 约定的 iconfont（如阿里 iconfont 项目）都能直接用。
     * 需要宿主 app 加载对应的 iconfont 样式表。
     */
    name?: string | undefined;
    /** iconfont 类名前缀。wot-ui 默认 `wd-icon`；本包默认 `sn-icon`。 */
    classPrefix?: string | undefined;
    /**
     * 把 `name` 渲染成 CSS 图标：`<view class="{name}">`（无前缀）。镜像
     * wot-ui 的 `css-icon`，用于指向任意 class（自定义子集 / 背景图方案）。
     */
    cssIcon?: boolean | string | undefined;
    /**
     * 尺寸。数字按 px；无单位数字字符串（'48'，常见于未绑定的模板属性）
     * 按 rpx（750 设计稿）归一；带单位字符串（'32rpx' / '1.5em'）原样输出。
     */
    size?: number | string | undefined;
    /** 描边 / 字形颜色。默认 `currentColor`（继承父元素 color）。 */
    color?: string | undefined;
    /** 描边宽度（设计单位，默认 2 = lucide 标准）。 */
    strokeWidth?: number | string | undefined;
    /** true 时描边按绝对像素而非随 size 缩放（镜像 lucide absoluteStrokeWidth）。 */
    strokeWidthAbsolute?: boolean | undefined;
    /** 根节点 class（镜像 wot-ui custom-class）。 */
    customClass?: string | undefined;
    /** 根节点内联样式（镜像 wot-ui custom-style）。 */
    customStyle?: string | Record<string, string> | undefined;
  }>(),
  {
    name: '',
    classPrefix: 'sn-icon',
    cssIcon: false,
    size: 32,
    color: 'currentColor',
    strokeWidth: 2,
    strokeWidthAbsolute: false,
    customClass: '',
    customStyle: '',
  },
);

/** 最终 SVG viewBox：用图标自带值，缺省 lucide 的 24x24 网格。 */
const viewBox = computed(() =>
  props.icon && typeof props.icon !== 'string' ? (props.icon.viewBox ?? '0 0 24 24') : '0 0 24 24',
);

/**
 * 本实例走哪条渲染路径。
 *
 * `name`（或字符串 `css-icon`）选择 iconfont 字形路径；SVG 数据（对象或
 * string 解析结果）选择 inline-SVG 路径；异步 Provider 结果选择远程
 * background-image 路径。`name` 优先 — 这是 wot-ui 原生调用形态。
 */
const isGlyph = computed(() => props.name !== '' || typeof props.cssIcon === 'string');

/**
 * 字体图标命中（registerFontIcon 注册映射，ADR-0011 阶段一）：
 * `name` 按 `<prefix>:<name>` 或裸 name 命中注册表 → `<text>` unicode 渲染
 * （三端一致，颜色 CSS 继承），优先于 wot-ui class 字形。未命中 → null，
 * 走既有 class 字形 / SVG 目录链。
 */
const fontGlyph = computed(() => (props.name === '' ? null : resolveFontIcon(props.name)));

/** 字形 text 的内联样式：font-family 指向注册的字体家族，字号 = 图标盒边长。 */
const fontGlyphStyle = computed(() =>
  fontGlyph.value === null
    ? undefined
    : { fontFamily: `'${fontGlyph.value.fontFamily}'`, fontSize: sizeCss.value },
);

/** iconfont 字形路径的类名列表。 */
const glyphClass = computed<string[]>(() => {
  if (typeof props.cssIcon === 'string' && props.cssIcon !== '') {
    // `css-icon="my-class"` → 原样渲染该 class（无前缀）。
    return [props.cssIcon];
  }
  const base = props.name === '' ? '' : `${props.classPrefix}-${props.name}`;
  const out: string[] = [];
  if (base !== '') out.push(base);
  if (props.cssIcon === true && props.name !== '') out.push(props.name);
  return out;
});

/** string icon 形态（对象形态为空串）。 */
const stringIcon = computed(() => (typeof props.icon === 'string' ? props.icon : ''));

/** 对象 icon 形态（直接渲染，不经解析层）。 */
const objectIcon = computed<IconData | null>(() =>
  props.icon !== undefined && typeof props.icon !== 'string' ? props.icon : null,
);

/** 同步解析结果：registry → 内置目录（computed，随 icon 变更自动更新）。 */
const syncIcon = computed<IconData | null>(() => {
  if (objectIcon.value !== null) return objectIcon.value;
  if (stringIcon.value === '') return null;
  return resolveSnIconStringSync(stringIcon.value);
});

/** 异步 Provider 产出的 IconData（少见：同步 Provider 返回数据对象）。 */
const asyncIcon = ref<IconData | null>(null);
/** 异步 Provider 产出的图片 URL（Iconify data URL）。 */
const remoteSrc = ref<string | null>(null);

/** 竞态序号 + 生命周期 AbortController（AGENTS.md §40/§41）。 */
let loadSeq = 0;
let abortCtrl: AbortController | null = null;

/** 尺寸 → 数值 px（供 URL 型 Provider 构造 height 参数）。 */
const numericSize = computed(() => {
  if (typeof props.size === 'number') return props.size;
  const m = /(\d+(?:\.\d+)?)/.exec(props.size);
  return m !== null ? Number(m[1]) : 24;
});

function warnUnresolved(code: string, value: string, cause?: unknown): void {
  console.warn(
    `[sn-icon] ${code}: cannot resolve icon "${value}".` +
      ' Check the name (registry / built-in catalog / provider prefix),' +
      ' or disable the network fallback with configSnIcons({ iconify: false }).',
    cause instanceof SnIconSourceError ? `(${cause.code}) ${cause.message}` : (cause ?? ''),
  );
}

/**
 * 异步加载 string icon 的 Provider 路径。同步命中（registry / 目录）不会
 * 进入这里 — computed 已渲染。任何竞态（图标变更 / 卸载）后丢弃过期结果。
 */
async function loadRemote(value: string): Promise<void> {
  const seq = ++loadSeq;
  abortCtrl?.abort();
  // WeChat MP runtime ships no AbortController (AGENTS.md §84): fall back to
  // the sequence guard alone — a stale result is still discarded on settle.
  const ctrl: AbortController | null =
    typeof AbortController === 'undefined' ? null : new AbortController();
  abortCtrl = ctrl;
  try {
    const result = resolveSnIconStringAsync(value, {
      color: props.color,
      size: numericSize.value,
      signal: ctrl?.signal,
    });
    if (result === null) {
      if (seq === loadSeq) {
        remoteSrc.value = null;
        asyncIcon.value = null;
        warnUnresolved('ICON_SOURCE_UNRESOLVED', value);
      }
      return;
    }
    const settled = await Promise.resolve(result);
    if (seq !== loadSeq || ctrl?.signal.aborted === true) return;
    if (typeof settled === 'string') {
      remoteSrc.value = settled;
      asyncIcon.value = null;
    } else if (settled !== null) {
      asyncIcon.value = settled;
      remoteSrc.value = null;
    }
  } catch (err: unknown) {
    if (seq !== loadSeq || ctrl?.signal.aborted === true) return;
    remoteSrc.value = null;
    asyncIcon.value = null;
    warnUnresolved(err instanceof SnIconSourceError ? err.code : 'ICON_FETCH_FAILED', value, err);
  }
}

watch(
  [stringIcon, () => props.color, numericSize],
  ([value]) => {
    if (value === '') {
      loadSeq++;
      abortCtrl?.abort();
      remoteSrc.value = null;
      asyncIcon.value = null;
      return;
    }
    // 同步命中时不发请求，直接清掉旧远程状态（computed 已接管渲染）。
    if (resolveSnIconStringSync(value) !== null) {
      loadSeq++;
      abortCtrl?.abort();
      remoteSrc.value = null;
      asyncIcon.value = null;
      return;
    }
    void loadRemote(value);
  },
  { immediate: true },
);

onBeforeUnmount(() => {
  loadSeq++;
  abortCtrl?.abort();
});

/** 展示用 IconData：同步解析优先，其次异步 Provider 产出的数据对象。 */
const displayIcon = computed<IconData | null>(() => syncIcon.value ?? asyncIcon.value);

/**
 * MP 渲染路径的描边色：具体色值（hex / rgb / hsl …）直接使用；`currentColor`
 * / `var(--*)` 由 computedStyle 从真实级联解析（data URL 是独立 SVG 文档，
 * 拿不到宿主 CSS）。H5 不消费该值（inline `<svg>` 走 currentColor）。
 */
const mpIconColor = useMpIconColor(() => props.color);
const strokeColor = computed<string>(() =>
  isConcreteIconColor(props.color) ? props.color : mpIconColor.value,
);

/** MP `<image>` 的 src：IconData 光栅化为 SVG data URL。 */
const iconDataUrl = computed<string | undefined>(() => {
  const icon = displayIcon.value;
  if (icon === null) return undefined;
  return buildIconDataUrl(icon, strokeColor.value, props.strokeWidth);
});



/** 渲染模式：图标数据声明 `render: 'fill'` 时按实心字形填充（Material 类图标）。 */
const isFillIcon = computed<boolean>(() => displayIcon.value?.render === 'fill');

/** 远程 SVG 路径的内联样式（尺寸盒由 .sn-icon__remote 类承担）。 */
const remoteStyle = computed(() =>
  remoteSrc.value !== null ? { backgroundImage: `url("${remoteSrc.value}")` } : {},
);

/** 两条路径共享的尺寸盒。数字保持 px 契约；无单位数字字符串（"48"）按 rpx
 * 归一——直接写进 CSS width 是非法值，浏览器忽略后 SVG 会按默认内在尺寸
 * 撑到 ~300px（"巨大加载圈" bug）；带单位字符串原样透传。
 *
 * 字符串 `customStyle` 不能塞进对象里的 `cssText` 键：patchStyle 最后才
 * 处理它，会把同对象里先设置的 width/height/color 整体抹掉。改为数组
 * 绑定让 Vue 逐项合并。 */
/** 尺寸盒边长（数字 = px，字符串经 rpx 归一）—— 盒与字体字形共享同一边长。 */
const sizeCss = computed(() =>
  typeof props.size === 'number' ? `${props.size}px` : toRpxSize(props.size),
);

const boxStyle = computed(() => {
  const style: Record<string, string> = { width: sizeCss.value, height: sizeCss.value };
  if (props.color !== 'currentColor') style.color = props.color;
  return style;
});

const customStyleBinding = computed(() => {
  if (typeof props.customStyle === 'string') {
    return props.customStyle !== '' ? props.customStyle : undefined;
  }
  return props.customStyle;
});

/**
 * MP 端图标光栅化（AUI-MP-003）：WeChat 的 `<image>` 不解码 SVG data
 * URL（AUI-MP-002 在真机上渲染空白），两级 canvas 光栅化按可用性择一：
 *
 * 1. `uni.createOffscreenCanvas({ type: '2d' })` —— 同步，无节点依赖；
 * 2. uni-app x 小程序只有 `uni.createCanvasContextAsync`（组件内必须有
 *    `<canvas>` 节点），异步拿到 context 后绘制，`holder.toDataURL()` 导出。
 *
 * 两级都不可用时回落 SVG data URL（H5 / 模拟器不受影响）。
 */
const mpRasteredUrl = ref<string | null>(null);
const rasterSizePx = computed<number>(() => {
  const m = /^(\d+(?:\.\d+)?)(px|rpx)$/.exec(sizeCss.value);
  if (!m) return 64;
  let px = Number(m[1]);
  if (m[2] === 'rpx') {
    const host = resolveUniHost<{ getSystemInfoSync?: () => { windowWidth?: number } }>();
    const width = host?.getSystemInfoSync?.()?.windowWidth;
    px = (px / 750) * (typeof width === 'number' && width > 0 ? width : 375);
  }
  // 2× 物理像素：`<image>` aspectFit 缩回，字形边缘不糊。
  return Math.max(16, Math.round(px * 2));
});

/** 光栅化画布的 viewBox 基准（catalog 图标固定 24）。 */
const rasterViewBoxSize = computed<number>(() => {
  const icon = displayIcon.value;
  if (icon === null) return 24;
  const parts = (icon.viewBox ?? '0 0 24 24').split(/[\s,]+/).map(Number);
  return parts[2] || 24;
});

/** Offscreen 快捷路径（同步）：宿主提供 createOffscreenCanvas 时直接出图。 */


/** Canvas 节点路径：uni-app x 小程序经 createCanvasContextAsync 拿 2d 上下文。 */
const instance = getCurrentInstance();
const rasterCanvasId = `sn-icon-raster-${instance?.uid ?? 0}`;
let mpCanvasCtx: RasterCanvas2d | null = null;
let mpCanvasHolder: { toDataURL?: () => string } | null = null;
const mpCanvasReady = ref(false);

/** Canvas 就绪或图标/颜色/尺寸变化时的重绘（重设 bitmap 会重置变换矩阵）。 */
function repaintMpCanvasRaster(): void {
  const icon = displayIcon.value;
  const ctx = mpCanvasCtx;
  if (icon === null || ctx === null || mpCanvasHolder === null) {
    mpRasteredUrl.value = null;
    return;
  }
  try {
    const element = (ctx as unknown as { canvas?: { width: number; height: number } }).canvas;
    if (element && typeof element.width === 'number') {
      element.width = rasterSizePx.value;
      element.height = rasterSizePx.value;
    }
    const vw = rasterViewBoxSize.value;
    ctx.scale(rasterSizePx.value / vw, rasterSizePx.value / vw);
    paintIconData(ctx, icon, strokeColor.value, props.strokeWidth);
    const url = mpCanvasHolder.toDataURL?.() ?? '';
    mpRasteredUrl.value = url.startsWith('data:image/png') ? url : null;
  } catch {
    mpRasteredUrl.value = null;
  }
}

// canvas 就绪前 offscreen 已兜底出图；就绪后改走 canvas 路径（真机 PNG）。
watchEffect(() => {
  if (mpCanvasReady.value) repaintMpCanvasRaster();
});

watchEffect(() => {
  // Offscreen 快捷路径仅在 canvas 节点路径未就绪时使用。
  const icon = displayIcon.value;
  if (icon === null || mpCanvasReady.value) {
    if (icon === null) mpRasteredUrl.value = null;
    return;
  }
  mpRasteredUrl.value = rasterizeIconDataUrl(
    icon,
    strokeColor.value,
    props.strokeWidth,
    rasterSizePx.value,
  );
});
onMounted(() => {
  const host = resolveUniHost<{ createCanvasContextAsync?: (o: Record<string, unknown>) => void }>();
  if (typeof host?.createCanvasContextAsync !== 'function') return;
  try {
    host.createCanvasContextAsync({
      id: rasterCanvasId,
      component: instance?.proxy,
      success: (value: unknown) => {
        if (value === null || typeof value !== 'object') return;
        const holder = value as {
          getContext?: (kind: string) => unknown;
          toDataURL?: () => string;
        };
        const context = holder.getContext?.('2d');
        if (!context || typeof context !== 'object') return;
        mpCanvasCtx = context as RasterCanvas2d;
        mpCanvasHolder = holder;
        mpCanvasReady.value = true;
        repaintMpCanvasRaster();
      },
      fail: () => {
        /* 无 canvas 面 —— 维持 offscreen / SVG 回落 */
      },
    } as Record<string, unknown>);
  } catch {
    /* 回落 */
  }
});
</script>

<template>
  <view
    class="sn-icon"
    :class="[customClass]"
    data-snui-component="icon"
    :aria-hidden="true"
    :style="[boxStyle, customStyleBinding]"
  >
    <!--
      字体图标路径（registerFontIcon 注册映射命中，ADR-0011 阶段一）：
      `<text>` unicode 字面量 + fontFamily —— 三端一致，颜色由 CSS `color`
      继承。文字必须包在 <text> 里：uni-app x App 的 view 不承载文本。
    -->
    <view
      v-if="fontGlyph"
      class="sn-icon__glyph sn-icon__glyph--font"
      :style="fontGlyphStyle"
      data-sn-icon-glyph=""
    >
      <text class="sn-icon__glyph-text">{{ fontGlyph.char }}</text>
    </view>

    <!--
      iconfont 字形路径（wot-ui 原生）：类名承载字形，样式表由宿主 app 提供。
      阿里 iconfont 项目生成的类名符合 `{prefix}-{name}` 约定时直接可用。
    -->
    <view v-else-if="isGlyph" class="sn-icon__glyph" :class="glyphClass" data-sn-icon-glyph="" />

    <!--
      远程 SVG 路径（异步 Provider，如 Iconify 按需加载）：background-image
      承载就绪的 SVG data URL —— H5 / MP 一致；uni-x App 端由转换补丁换成
      `<image :src>`（见 packages/uni-x/src/transform/patches.ts）。
    -->
    <view v-else-if="remoteSrc" class="sn-icon__remote" :style="remoteStyle" />

    <!--
      IconData 路径：H5 渲染 inline `<svg>`（currentColor 生效）；小程序没有
      `<svg>` 元素（编译后是 unknown tag，渲染为空），改走 `<image>` + SVG
      data URL（颜色已在 `iconDataUrl` 里烘焙）。两条分支由条件编译二选一，
      `v-else-if` 链在各自产物里保持连续。
    -->
    <!-- #ifndef MP -->
    <svg
      v-else-if="displayIcon"
      class="sn-icon__svg"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
      :fill="isFillIcon ? color : 'none'"
      :stroke="isFillIcon ? 'none' : color"
      :stroke-width="isFillIcon ? undefined : strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      <path v-for="(d, i) in displayIcon.paths" :key="i" :d="d" />
    </svg>
    <!-- #endif -->
    <!-- #ifdef MP -->
    <image
      v-else-if="displayIcon"
      class="sn-icon__svg"
      :src="mpRasteredUrl || iconDataUrl"
      mode="aspectFit"
      aria-hidden="true"
    />
    <!--
      光栅化画布（AUI-MP-003）：uni-app x 小程序只能经
      createCanvasContextAsync 解析组件内 canvas 节点 —— 挂在视口外但保持
      渲染（display:none 会失去 bitmap），绘制结果导出 PNG 给上方 image。
    -->
    <canvas
      :id="rasterCanvasId"
      :canvas-id="rasterCanvasId"
      type="2d"
      class="sn-icon__raster"
      aria-hidden="true"
    />
    <!-- #endif -->
  </view>
</template>

<style scoped>
/**
 * sn-icon 是包住内部 SVG 的尺寸 + 布局盒。几何用 rpx，包装器随宿主
 * 视口缩放的方式与周围 uni-app 组件一致。内层 SVG 通过模板上的样式
 * （width/height 100%）继承包装器尺寸，保证两条渲染路径行为一致。
 */
.sn-icon__raster {
  position: absolute;
  left: -9999rpx;
  top: 0;
  width: 120rpx;
  height: 120rpx;
  pointer-events: none;
}

.sn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: inherit;
}

.sn-icon__svg {
  display: block;
  width: 100%;
  height: 100%;
}

/**
 * 远程 SVG 盒：background-image 由内联样式注入（data URL / 远程 URL），
 * 这里只保证铺满尺寸盒并锁定缩放行为，与 inline-SVG 路径视觉一致。
 */
.sn-icon__remote {
  display: block;
  width: 100%;
  height: 100%;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}
</style>

<style scoped>
/**
 * iconfont 字形盒。字形本身来自宿主 app 的 iconfont 样式表；这条规则只
 * 保证元素是铺满包装器的块盒并继承颜色，两条渲染路径行为一致。
 */
.sn-icon__glyph {
  display: block;
  width: 100%;
  height: 100%;
  line-height: 1;
  text-align: center;
}

/* 字体字形（registerFontIcon 命中）：字号随包装盒（wrapper width/height 由
 * size prop 驱动），颜色继承宿主级联 —— 字体图标不经过任何取色/烘焙链。 */
.sn-icon__glyph--font {
  /* 包一层 flex 让 <text> 在 MP / uni-app x 的非 DOM 布局里垂直居中。 */
  display: flex;
  align-items: center;
  justify-content: center;
}

.sn-icon__glyph--font .sn-icon__glyph-text {
  color: inherit;
  font-size: inherit;
  line-height: 1;
}
</style>
