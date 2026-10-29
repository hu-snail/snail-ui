<script setup lang="ts">
/**
 * sn-icon — uni 端图标组件（AUI-MP-002，rewrite）。
 *
 * ## 四条渲染路径（优先级从上到下）
 *
 * 1. **iconfont 字形**（`name` + `classPrefix` / `cssIcon`）— wot-ui 兼容
 *    API：渲染 `<view class="{classPrefix}-{name}">`，字形由宿主加载的
 *    iconfont 样式表提供（阿里 iconfont 直接可用）。颜色走 CSS `color`
 *    继承，跨端一致性最好。
 * 2. **远程 SVG**（string `icon` 命中异步 Provider，如 Iconify）— 渲染
 *    `<view class="sn-icon__remote">` + `background-image` data URL。
 *    请求由 `sn-icon-iconify.ts` 承担（缓存 / 超时 / AbortSignal），
 *    组件侧只负责竞态保护与失败降级（结构化警告 + 空渲染）。
 * 3. **inline SVG**（`IconData` 对象，或 string `icon` 同步命中
 *    registry / 内置目录）— H5 直接渲染 `<svg>`，`currentColor` 生效。
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

import { computed, onBeforeUnmount, ref, watch } from 'vue';
import {
  resolveSnIconStringSync,
  resolveSnIconStringAsync,
  SnIconSourceError,
} from './sn-icon-providers';

defineOptions({ name: 'SnIcon' });

/**
 * Lucide 兼容图标数据形态：默认 24x24 viewBox + 一至多条 SVG
 * `<path d="...">` 字符串。描边用 `currentColor` 渲染，`color` prop /
 * CSS `color` 会级联生效。类型契约的本体在这里定义（registry /
 * feedback / catalog 均从本文件 import）。
 */
export interface IconData {
  /** SVG viewBox。默认 '0 0 24 24'（lucide 标准网格）。 */
  viewBox?: string;
  /** 一至多条 SVG path data 字符串。 */
  paths: string[];
}

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
    /** 尺寸（数字 → px；字符串如 '32rpx' / '1.5em' 原样输出）。 */
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
const viewBox = computed(() => props.icon && typeof props.icon !== 'string' ? props.icon.viewBox ?? '0 0 24 24' : '0 0 24 24');

/**
 * 生效描边宽度 — 传给内层 `<svg>`。uni-app rpx 在运行时按视口宽度解释，
 * 对 SVG 属性值同样适用（浏览器 / 原生渲染层映射为 px）。
 */
const effectiveStrokeWidth = computed(() =>
  props.strokeWidthAbsolute ? props.strokeWidth : props.strokeWidth,
);

/**
 * 本实例走哪条渲染路径。
 *
 * `name`（或字符串 `css-icon`）选择 iconfont 字形路径；SVG 数据（对象或
 * string 解析结果）选择 inline-SVG 路径；异步 Provider 结果选择远程
 * background-image 路径。`name` 优先 — 这是 wot-ui 原生调用形态。
 */
const isGlyph = computed(() => props.name !== '' || typeof props.cssIcon === 'string');

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
    `[sn-icon] ${code}: cannot resolve icon "${value}".`
      + ' Check the name (registry / built-in catalog / provider prefix),'
      + ' or disable the network fallback with configSnIcons({ iconify: false }).',
    cause instanceof SnIconSourceError ? `(${cause.code}) ${cause.message}` : cause ?? '',
  );
}

/**
 * 异步加载 string icon 的 Provider 路径。同步命中（registry / 目录）不会
 * 进入这里 — computed 已渲染。任何竞态（图标变更 / 卸载）后丢弃过期结果。
 */
async function loadRemote(value: string): Promise<void> {
  const seq = ++loadSeq;
  abortCtrl?.abort();
  const ctrl = new AbortController();
  abortCtrl = ctrl;
  try {
    const result = resolveSnIconStringAsync(value, {
      color: props.color,
      size: numericSize.value,
      signal: ctrl.signal,
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
    if (seq !== loadSeq || ctrl.signal.aborted) return;
    if (typeof settled === 'string') {
      remoteSrc.value = settled;
      asyncIcon.value = null;
    } else if (settled !== null) {
      asyncIcon.value = settled;
      remoteSrc.value = null;
    }
  } catch (err: unknown) {
    if (seq !== loadSeq || ctrl.signal.aborted) return;
    remoteSrc.value = null;
    asyncIcon.value = null;
    warnUnresolved(
      err instanceof SnIconSourceError ? err.code : 'ICON_FETCH_FAILED',
      value,
      err,
    );
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

/** 远程 SVG 路径的内联样式（尺寸盒由 .sn-icon__remote 类承担）。 */
const remoteStyle = computed(() =>
  remoteSrc.value !== null ? { backgroundImage: `url("${remoteSrc.value}")` } : {},
);

/** 两条路径共享的尺寸盒。 */
const boxStyle = computed(() => {
  const len = typeof props.size === 'number' ? `${props.size}px` : props.size;
  const style: Record<string, string> = { width: len, height: len };
  if (props.color !== 'currentColor') style.color = props.color;
  if (typeof props.customStyle === 'string') {
    if (props.customStyle !== '') style.cssText = props.customStyle;
  } else {
    Object.assign(style, props.customStyle);
  }
  return style;
});
</script>

<template>
  <view
    class="sn-icon"
    :class="[customClass]"
    data-snui-component="icon"
    :aria-hidden="true"
    :style="boxStyle"
  >
    <!--
      iconfont 字形路径（wot-ui 原生）：类名承载字形，样式表由宿主 app 提供。
      阿里 iconfont 项目生成的类名符合 `{prefix}-{name}` 约定时直接可用。
    -->
    <view v-if="isGlyph" class="sn-icon__glyph" :class="glyphClass" data-sn-icon-glyph="" />

    <!--
      远程 SVG 路径（异步 Provider，如 Iconify 按需加载）：background-image
      承载就绪的 SVG data URL —— H5 / MP 一致；uni-x App 端由转换补丁换成
      `<image :src>`（见 packages/uni-x/src/transform/patches.ts）。
    -->
    <view v-else-if="remoteSrc" class="sn-icon__remote" :style="remoteStyle" />

    <!--
      inline `<svg>` 路径（IconData）。适用于：
        - H5（浏览器）: 直接 DOM，与 web 端一致，currentColor 生效。
        - 微信小程序 : SVG 经 `<image>` 语义渲染（不是所有平台像素级一致，
                       需要像素级时把 path 转 base64 `<image src="data:...">`）。
        - App (uni-app x): 经转换补丁换为 `<image>` + SVG data URL。

      保持标记最小 — 不加可能干扰跨端编译器的装饰属性。`xmlns` 对 SVG
      独立文档必需，嵌套时无害。
    -->
    <svg
      v-else-if="displayIcon"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
      fill="none"
      :stroke="color"
      :stroke-width="effectiveStrokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      <path v-for="(d, i) in displayIcon.paths" :key="i" :d="d" />
    </svg>
  </view>
</template>

<style scoped>
/**
 * sn-icon 是包住内部 SVG 的尺寸 + 布局盒。几何用 rpx，包装器随宿主
 * 视口缩放的方式与周围 uni-app 组件一致。内层 SVG 通过模板上的样式
 * （width/height 100%）继承包装器尺寸，保证两条渲染路径行为一致。
 */
.sn-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  color: inherit;
}

.sn-icon svg {
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
</style>
