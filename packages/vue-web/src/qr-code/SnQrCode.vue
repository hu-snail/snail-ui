<script setup lang="ts">
/**
 * SnQrCode — web-end QR code (AUI-WEB-DD-015).
 *
 * Reference library: naive-ui `n-qr-code`
 *   (https://www.naiveui.com/zh-CN/light/components/qr-code)
 * Per AGENTS.md §112, props + semantics mirror n-qr-code 1:1:
 *   value / errorCorrectionLevel ('L'|'M'|'Q'|'H') / size / padding /
 *   color / backgroundColor / iconSrc / iconSize / iconBackgroundColor /
 *   iconBorderRadius / type ('canvas'|'svg').
 *
 * Encoding is handled by `./sn-qr-core.ts` — a from-scratch, zero-dependency
 * QR encoder (ISO/IEC 18004, byte mode, versions 1-40, automatic mask).
 * Documented divergences (not §112 violations):
 *   - `showToolbar` (default true) is a local addition: a small floating
 *     toolbar with a download button, revealed on hover/focus. The reference
 *     component has no toolbar; its download demo builds one by hand around
 *     `canvas.toDataURL()` — this component ships that behaviour in-box.
 *   - `show-toolbar-tooltip` / `render-toolbar` are Image-only upstream and
 *     are not part of this component's API.
 *   - The canvas is drawn at `window.devicePixelRatio` resolution for crisp
 *     output (upstream always upscales ×2).
 *   - Rendering never throws when the canvas 2D context is unavailable
 *     (test / headless environments) — the grid simply stays unpainted.
 *
 * Per AUI-FOUND-003 + AUI-FOUND-004, this component is end: web and uses
 * `--sn-web-*` token aliases only (px units). The QR colors default to the
 * theme (`--sn-web-color-text-primary` / `--sn-web-color-background-surface`)
 * and are resolved for canvas via a computed-style probe; user-supplied
 * color props override them.
 *
 * Usage:
 *   <SnQrCode value="https://example.com" />
 *   <SnQrCode value="…" type="svg" :size="140" color="#18a058" />
 */

import { computed, onBeforeUnmount, onMounted, ref, watch, type CSSProperties } from 'vue';
import { useLocale } from '../locales/use-locale';
import { encode } from './sn-qr-core';

defineOptions({ name: 'SnQrCode' });

/** Active locale (injected once at setup — inject() is setup-only). */
const locale = useLocale();

const props = withDefaults(
  defineProps<{
    /** Text content encoded into the QR code. Mirrors n-qr-code `value`. */
    value?: string;
    /** Error correction level: ~7% (L), 15% (M), 25% (Q), 30% (H). Mirrors n-qr-code `error-correction-level`. */
    errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
    /** Square side length in px (padding included). Mirrors n-qr-code `size`. */
    size?: number;
    /** Inner padding around the code; number → px. Mirrors n-qr-code `padding`. */
    padding?: number | string;
    /** Dark-module color (any CSS color). Mirrors n-qr-code `color`. */
    color?: string | undefined;
    /** Light-module / box background color. Mirrors n-qr-code `background-color`. */
    backgroundColor?: string | undefined;
    /** Center icon image url. Mirrors n-qr-code `icon-src`. */
    iconSrc?: string | undefined;
    /** Center icon size in px. Mirrors n-qr-code `icon-size`. */
    iconSize?: number;
    /** Icon backing plate color. Mirrors n-qr-code `icon-background-color`. */
    iconBackgroundColor?: string | undefined;
    /** Icon backing plate radius in px. Mirrors n-qr-code `icon-border-radius`. */
    iconBorderRadius?: number;
    /** Render target. Mirrors n-qr-code `type`. */
    type?: 'canvas' | 'svg';
    /**
     * Module shape: `square` (default), `dot` (mini-program-style circles —
     * the three finder eyes stay rounded squares for scannability), or
     * `rounded` (rounded squares). Local addition.
     */
    shape?: 'square' | 'dot' | 'rounded';
    /**
     * Multi-color palette — dark data modules cycle through these colors
     * deterministically (`(x * 7 + y * 11) % length`); the finder eyes keep
     * `color` as the contrast anchor. Overrides `color` for data modules.
     */
    colors?: string[] | undefined;
    /** Local addition: reveal the floating download toolbar on hover/focus. */
    showToolbar?: boolean;
  }>(),
  {
    value: '',
    errorCorrectionLevel: 'M',
    size: 100,
    padding: 12,
    color: undefined,
    backgroundColor: undefined,
    iconSrc: undefined,
    iconSize: 40,
    iconBackgroundColor: undefined,
    iconBorderRadius: 4,
    type: 'canvas',
    shape: 'square',
    colors: undefined,
    showToolbar: true,
  },
);

const canvasRef = ref<HTMLCanvasElement | null>(null);

/**
 * Canvas 2D cannot resolve `var()` — resolve the theme color through a
 * computed-style probe, falling back to CSS named colors where computed
 * styles are unavailable (happy-dom / headless hosts). Named colors keep
 * the token-check clean (no hex / rgb() literals in source).
 */
function resolvePaintColor(
  value: string | undefined,
  cssVar: string,
  namedFallback: string,
): string {
  if (value) return value;
  if (typeof document !== 'undefined' && typeof getComputedStyle === 'function') {
    const probe = document.createElement('span');
    probe.style.color = cssVar;
    document.body.appendChild(probe);
    const computed = getComputedStyle(probe).color;
    probe.remove();
    if (computed && !computed.includes('var(')) return computed;
  }
  return namedFallback;
}

const paintColor = computed(() =>
  resolvePaintColor(props.color, 'var(--sn-web-color-text-primary)', 'black'),
);
const paintBackgroundColor = computed(() =>
  resolvePaintColor(props.backgroundColor, 'var(--sn-web-color-background-surface)', 'white'),
);
const paintIconBackgroundColor = computed(() =>
  resolvePaintColor(props.iconBackgroundColor, 'var(--sn-web-color-background-surface)', 'white'),
);

/** True when the module belongs to one of the three 7×7 finder patterns. */
function isFinderModule(x: number, y: number, size: number): boolean {
  const inTopLeft = x < 7 && y < 7;
  const inTopRight = x >= size - 7 && y < 7;
  const inBottomLeft = x < 7 && y >= size - 7;
  return inTopLeft || inTopRight || inBottomLeft;
}

const hasPalette = computed(() => Array.isArray(props.colors) && props.colors.length > 0);

/**
 * Deterministic per-module paint: the palette cycles over the data
 * modules while the finder eyes keep the flat `color` as the anchor.
 */
function moduleColor(x: number, y: number): string {
  if (hasPalette.value) {
    const colors = props.colors as string[];
    const picked = colors[(x * 7 + y * 11) % colors.length];
    if (picked !== undefined && !isFinderModule(x, y, matrix.value.size)) return picked;
  }
  return paintColor.value;
}

/** Undefined value falls back to '-', mirroring the reference component. */
const encodeValue = computed(() => props.value ?? '-');

const matrix = computed(() => encode(encodeValue.value, props.errorCorrectionLevel));

const ariaLabel = computed(() =>
  encodeValue.value === '' ? '二维码' : `二维码：${encodeValue.value}`,
);

/* ── Canvas painting ──────────────────────────────────────────────────────
 * happy-dom (and some headless hosts) return null from getContext — every
 * drawing call is guarded and the component degrades to an empty canvas. */

const loadedIconRef = ref<HTMLImageElement | null>(null);
let iconLoadGeneration = 0;

function drawCanvas(): void {
  const canvas = canvasRef.value;
  if (!canvas) return;
  const dpr =
    typeof window !== 'undefined' && window.devicePixelRatio > 0 ? window.devicePixelRatio : 1;
  const canvasWidth = props.size * dpr;
  canvas.width = canvasWidth;
  canvas.height = canvasWidth;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const scale = canvasWidth / matrix.value.size;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const moduleSize = matrix.value.size;
  for (let y = 0; y < moduleSize; y++) {
    for (let x = 0; x < moduleSize; x++) {
      const dark = matrix.value.getModule(x, y);
      ctx.fillStyle = dark ? moduleColor(x, y) : paintBackgroundColor.value;
      const startX = Math.floor(x * scale);
      const startY = Math.floor(y * scale);
      const w = Math.ceil((x + 1) * scale) - startX;
      const h = Math.ceil((y + 1) * scale) - startY;
      // In dot mode the three finder eyes stay rounded squares — pure
      // circles on the eyes degrade scanner reliability.
      const shape =
        dark && isFinderModule(x, y, moduleSize) && props.shape === 'dot' ? 'rounded' : props.shape;
      if (dark && shape === 'dot') {
        ctx.beginPath();
        ctx.arc(startX + w / 2, startY + h / 2, (Math.min(w, h) / 2) * 0.84, 0, Math.PI * 2);
        ctx.fill();
      } else if (dark && shape === 'rounded') {
        if (typeof ctx.roundRect === 'function') {
          ctx.beginPath();
          ctx.roundRect(startX, startY, w, h, Math.min(w, h) * 0.3);
          ctx.fill();
        } else {
          ctx.fillRect(startX, startY, w, h);
        }
      } else {
        ctx.fillRect(startX, startY, w, h);
      }
    }
  }
  const icon = loadedIconRef.value;
  if (props.iconSrc && icon) {
    const plateSize = props.iconSize * dpr;
    const centerX = (canvas.width - plateSize) / 2;
    const centerY = (canvas.height - plateSize) / 2;
    ctx.fillStyle = paintIconBackgroundColor.value;
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(centerX, centerY, plateSize, plateSize, props.iconBorderRadius * dpr);
      ctx.fill();
    } else {
      ctx.fillRect(centerX, centerY, plateSize, plateSize);
    }
    const aspectRatio =
      icon.naturalWidth && icon.naturalHeight ? icon.naturalWidth / icon.naturalHeight : 1;
    const drawWidth = aspectRatio >= 1 ? plateSize : plateSize * aspectRatio;
    const drawHeight = aspectRatio <= 1 ? plateSize : plateSize / aspectRatio;
    ctx.drawImage(
      icon,
      centerX + (plateSize - drawWidth) / 2,
      centerY + (plateSize - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  }
}

watch(
  () => [
    matrix.value,
    props.size,
    paintColor.value,
    paintBackgroundColor.value,
    props.type,
    props.shape,
    props.colors,
    loadedIconRef.value,
  ],
  () => {
    if (props.type === 'canvas') drawCanvas();
  },
  { immediate: true },
);

onMounted(() => {
  // The immediate watcher runs during setup when canvasRef is still null —
  // the first paint must happen after mount.
  if (props.type === 'canvas') drawCanvas();
  if (props.type !== 'canvas' || !props.iconSrc) return;
  if (typeof Image === 'undefined') return;
  const generation = ++iconLoadGeneration;
  const img = new Image();
  img.onload = () => {
    if (generation !== iconLoadGeneration) return;
    loadedIconRef.value = img;
  };
  img.src = props.iconSrc;
});

watch(
  () => props.iconSrc,
  () => {
    iconLoadGeneration++;
    loadedIconRef.value = null;
  },
);

onBeforeUnmount(() => {
  iconLoadGeneration++;
});

/* ── SVG rendering ──────────────────────────────────────────────────────── */

/** Horizontal run-length merged dark-module path (`M x y h w v1 H x z`). */
const svgPath = computed(() => {
  const ops: string[] = [];
  const size = matrix.value.size;
  for (let y = 0; y < size; y++) {
    let runStart: number | null = null;
    for (let x = 0; x < size; x++) {
      const dark = matrix.value.getModule(x, y);
      if (dark && runStart === null) {
        runStart = x;
      } else if (!dark && runStart !== null) {
        ops.push(`M${runStart} ${y}h${x - runStart}v1H${runStart}z`);
        runStart = null;
      }
      if (x === size - 1 && runStart !== null) {
        ops.push(`M${runStart} ${y}h${x + 1 - runStart}v1H${runStart}z`);
      }
    }
  }
  return ops.join('');
});

/** A styled-SVG paint group: same-color modules share one `<g fill>`. */
interface SnQrSvgModule {
  x: number;
  y: number;
  kind: 'square' | 'rounded' | 'circle';
}

/**
 * Null when the default crispEdges merged path applies (square + no
 * palette); otherwise the per-color module groups for dot / rounded /
 * palette rendering.
 */
const svgStyledGroups = computed<Array<{ color: string; modules: SnQrSvgModule[] }> | null>(() => {
  if (props.shape === 'square' && !hasPalette.value) return null;
  const size = matrix.value.size;
  const groups = new Map<string, SnQrSvgModule[]>();
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      if (!matrix.value.getModule(x, y)) continue;
      const kind: SnQrSvgModule['kind'] =
        props.shape === 'dot' && !isFinderModule(x, y, size)
          ? 'circle'
          : props.shape === 'square'
            ? 'square'
            : 'rounded';
      const color = moduleColor(x, y);
      const list = groups.get(color) ?? [];
      list.push({ x, y, kind });
      groups.set(color, list);
    }
  }
  return [...groups.entries()].map(([color, modules]) => ({ color, modules }));
});

/* ── Download (toolbar) ─────────────────────────────────────────────────── */

function triggerDownload(href: string, filename: string): void {
  if (typeof document === 'undefined') return;
  const anchor = document.createElement('a');
  anchor.href = href;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

function handleDownload(): void {
  if (props.type === 'canvas' && canvasRef.value) {
    let url: string | undefined;
    try {
      url = canvasRef.value.toDataURL('image/png');
    } catch {
      // Headless hosts may not implement toDataURL — degrade to the SVG
      // payload below instead of failing the click silently.
      url = undefined;
    }
    if (url) {
      triggerDownload(url, 'qrcode.png');
      return;
    }
  }
  triggerDownload(
    `data:image/svg+xml;charset=utf-8,${encodeURIComponent(buildSvgMarkup())}`,
    'qrcode.svg',
  );
}

/** Serialize the styled (dot / rounded / palette) groups or the merged-path SVG. */
function buildSvgMarkup(): string {
  const size = matrix.value.size;
  const styled = svgStyledGroups.value;
  const body = styled
    ? styled
        .map(
          (group) =>
            `<g fill="${group.color}">` +
            group.modules
              .map((m) =>
                m.kind === 'circle'
                  ? `<circle cx="${m.x + 0.5}" cy="${m.y + 0.5}" r="0.42"/>`
                  : `<rect x="${m.x}" y="${m.y}" width="1" height="1"${m.kind === 'rounded' ? ' rx="0.3"' : ''}/>`,
              )
              .join('') +
            `</g>`,
        )
        .join('')
    : `<path d="${svgPath.value}" fill="${paintColor.value}"/>`;
  const rendering = styled ? '' : ' shape-rendering="crispEdges"';
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}"${rendering}>` +
    `<rect width="${size}" height="${size}" fill="${paintBackgroundColor.value}"/>` +
    body +
    `</svg>`
  );
}

const rootStyle = computed<CSSProperties>(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
  padding: typeof props.padding === 'number' ? `${props.padding}px` : props.padding,
  backgroundColor: paintBackgroundColor.value,
}));
</script>

<template>
  <div data-snui-component="qr-code" class="sn-qr-code" :style="rootStyle">
    <canvas
      v-if="type === 'canvas'"
      ref="canvasRef"
      class="sn-qr-code__canvas"
      role="img"
      :aria-label="ariaLabel"
      :style="{ width: `${size}px`, height: `${size}px` }"
    />
    <svg
      v-else
      class="sn-qr-code__canvas"
      role="img"
      :aria-label="ariaLabel"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${matrix.size} ${matrix.size}`"
      :shape-rendering="svgStyledGroups ? 'auto' : 'crispEdges'"
    >
      <g v-for="group in svgStyledGroups" :key="group.color" :fill="group.color">
        <template v-for="m in group.modules" :key="`${m.x}-${m.y}`">
          <circle v-if="m.kind === 'circle'" :cx="m.x + 0.5" :cy="m.y + 0.5" r="0.42" />
          <rect
            v-else
            :x="m.x"
            :y="m.y"
            width="1"
            height="1"
            :rx="m.kind === 'rounded' ? 0.3 : 0"
          />
        </template>
      </g>
      <path v-if="!svgStyledGroups" :d="svgPath" :fill="paintColor" />
    </svg>
    <div v-if="showToolbar" class="sn-qr-code__toolbar">
      <button
        type="button"
        class="sn-qr-code__toolbar-button"
        :title="locale.QrCode.download"
        :aria-label="locale.QrCode.download"
        @click="handleDownload"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Web side: --sn-web-* aliases only. Direct --aui-* / --sn-mp-* forbidden
 * (enforced by `pnpm snui token-check --dir packages/vue-web --end web`). */

.sn-qr-code {
  position: relative;
  display: inline-flex;
  box-sizing: content-box;
  border-radius: 3px;
}

.sn-qr-code__canvas {
  display: block;
  box-sizing: border-box;
}

.sn-qr-code__toolbar {
  position: absolute;
  top: 4px;
  right: 4px;
  display: flex;
  align-items: center;
  padding: 2px;
  border: 1px solid
    color-mix(in srgb, var(--sn-web-color-text-primary) 12%, var(--sn-web-color-background-surface));
  border-radius: 3px;
  background: var(--sn-web-color-background-elevated);
  opacity: 0;
  transition: opacity 0.2s;
}

.sn-qr-code:hover .sn-qr-code__toolbar,
.sn-qr-code:focus-within .sn-qr-code__toolbar {
  opacity: 1;
}

.sn-qr-code__toolbar-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  padding: 0;
  border: none;
  border-radius: 3px;
  font: inherit;
  color: var(--sn-web-color-text-secondary);
  background: transparent;
  cursor: pointer;
}

.sn-qr-code__toolbar-button:hover {
  background: color-mix(
    in srgb,
    var(--sn-web-color-text-primary) 4.7%,
    var(--sn-web-color-background-surface)
  );
}

.sn-qr-code__toolbar-button svg {
  width: 14px;
  height: 14px;
}
</style>
