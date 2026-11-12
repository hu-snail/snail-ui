/**
 * Anchored source patches (ADR-0004): targeted rewrites for the parts of
 * @snui/uni that cannot be auto-transformed into ucss/uvue semantics.
 *
 * Every patch runs BEFORE generic transforms and matches an exact anchor
 * substring from the upstream source. A missing anchor throws at build time —
 * upstream drift must fail loudly, never silently produce stale output.
 */

import type { TransformIssue } from './types.ts';

export interface SourcePatch {
  /** Exact substring in the upstream source. */
  anchor: string;
  replacement: string;
  /** Human-readable note surfaced in PORTING-REPORT. */
  note: string;
}

export const PATCHES: Record<string, SourcePatch[]> = {
  'sn-icon/sn-icon.vue': [
    {
      anchor: `import { computed, onBeforeUnmount, ref, watch } from 'vue';`,
      replacement: `import { computed, getCurrentInstance, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';`,
      note: 'icon color resolution needs getCurrentInstance / nextTick / onMounted',
    },
    {
      anchor: `  return props.customStyle;
});
</script>`,
      replacement: `  return props.customStyle
})

/**
 * uni-app x App has no inline <svg> element: IconData renders through an
 * <image> with an SVG data URL instead. The rasterized document is isolated
 * from page CSS — a currentColor or var(--token) stroke cannot cross the
 * image boundary (a literal var() is invalid inside an SVG document and
 * falls back to black ink). So the effective color is resolved before the
 * data URL is built:
 *
 *   - concrete colors (hex / rgb / hsl / a few keywords) bake verbatim;
 *   - currentColor / var(--*) / anything else is applied to the wrapper
 *     (boxStyle already sets inline color for non-currentColor values) and
 *     read back from the native layout via SelectorQuery computedStyle
 *     (uni-app x 4.25+) — skins, .dark flips and theme vars all resolve
 *     through the real cascade this way. Duck-typed host shape follows
 *     sn-fit-swiper (the established uni-x SelectorQuery pattern).
 *
 * Result-shape note: uni-app x hands the fields callback the NodeInfo
 * itself (ret.color), while classic-style hosts hand an array
 * ([nodeInfo].color) — both shapes are probed, plus a stringified
 * fallback that survives UTSJSONObject / Map result wrappers.
 *
 * Availability policy: resolvedIconColor starts at the legacy ink color
 * so the glyph is NEVER blank (a resolution failure must not erase icons —
 * regression: blank-first-paint policy rendered every icon invisible on
 * runtimes where the callback shape differed). When the cascade resolves,
 * the data URL upgrades to the true color. Re-resolution rides on mount +
 * color changes; a theme flip after mount re-tints on the next icon prop
 * change (known limitation, tracked in PORTING-REPORT).
 */
const ICON_INK_FALLBACK = '#1a1a1a'
const iconInstance = getCurrentInstance()
const iconUid: number = iconInstance?.uid ?? 0
const resolvedIconColor = ref(ICON_INK_FALLBACK)
let colorSeq = 0

interface IconColorNode {
  color?: string
}
interface IconFieldsOptions {
  computedStyle?: string[]
}
interface IconColorQuery {
  in(context?: unknown): IconColorQuery
  select(selector: string): IconColorQuery
  fields(options: IconFieldsOptions, callback: (ret: unknown) => void): IconColorQuery
  exec(): void
}
interface IconUniHost {
  createSelectorQuery?: () => IconColorQuery
}

/** A color the SVG data URL can take verbatim — no cascade involvement. */
function isConcreteIconColor(value: string): boolean {
  return /^#[0-9a-fA-F]{3,8}$|^rgba?\\(|^hsla?\\(|^(transparent|white|black)$/.test(value)
}

/** Extract a concrete color from whichever result shape the runtime
 * delivered: a direct .color property when the value is object-backed,
 * otherwise a "color":"…" probe on the stringified result (works across
 * NodeInfo / UTSJSONObject / array wrappers). */
function readResolvedColor(value: unknown): string {
  if (value !== null && value !== undefined && typeof value === 'object') {
    const direct = (value as IconColorNode).color
    if (typeof direct === 'string' && direct !== '' && isConcreteIconColor(direct)) {
      return direct
    }
  }
  let json = ''
  try {
    json = JSON.stringify(value)
  } catch {
    json = ''
  }
  const m = /"color"\\s*:\\s*"([^"]+)"/.exec(json)
  if (m !== null) {
    const viaJson: string = m[1] ?? ''
    if (viaJson !== '' && isConcreteIconColor(viaJson)) return viaJson
  }
  return ''
}

/** Resolve the effective stroke color. One delayed retry: the first query
 * can outrun first layout on slow mounts. */
function resolveIconColor(retried = false): void {
  const raw: string = props.color
  if (isConcreteIconColor(raw)) {
    resolvedIconColor.value = raw
    return
  }
  const seq = ++colorSeq
  const host = (globalThis as { uni?: IconUniHost }).uni
  if (host?.createSelectorQuery === undefined || iconInstance === null) {
    // No query layer (old runtime / detached instance): keep the ink color.
    resolvedIconColor.value = ICON_INK_FALLBACK
    return
  }
  nextTick(() => {
    if (seq !== colorSeq) return
    try {
      host
        .createSelectorQuery()
        .in(iconInstance?.proxy)
        .select(\`.sn-icon--u\${iconUid}\`)
        .fields({ computedStyle: ['color'] }, (ret) => {
          if (seq !== colorSeq) return
          // uni-app x delivers the NodeInfo directly; classic-style hosts
          // deliver a one-element array. Probe both.
          let color = ''
          if (Array.isArray(ret)) {
            const arr = ret as Array<unknown>
            color = readResolvedColor(arr.length > 0 ? arr[0] : null)
          } else {
            color = readResolvedColor(ret)
          }
          if (color !== '') {
            resolvedIconColor.value = color
          } else if (!retried) {
            setTimeout(() => {
              if (seq === colorSeq) resolveIconColor(true)
            }, 50)
          } else {
            console.warn(
              '[sn-icon] ICON_COLOR_UNRESOLVED: computedStyle("color") returned no usable value.' +
                ' Keeping the ink color so the glyph stays visible.',
            )
            resolvedIconColor.value = ICON_INK_FALLBACK
          }
        })
        .exec()
    } catch {
      // A mis-shaped host must degrade to the ink color, never throw or blank.
      if (seq === colorSeq) resolvedIconColor.value = ICON_INK_FALLBACK
    }
  })
}

onMounted(() => resolveIconColor())
watch(
  () => props.color,
  () => resolveIconColor(),
)

/**
 * IconData → SVG data URL for the App-side <image>. Material-style solid
 * glyphs (render: 'fill') must be filled, not stroked: a stroke would trace
 * the outline into a hollow double line.
 */
const iconDataUrl = computed<string | undefined>(() => {
  const icon = displayIcon.value
  if (icon === null) return undefined
  const stroke: string = resolvedIconColor.value
  if (stroke === '') return undefined
  const vb: string = icon.viewBox ?? '0 0 24 24'
  const isFill: boolean = icon.render === 'fill'
  const body: string = icon.paths
    .map((d) =>
      isFill
        ? \`<path d="\${d}" fill="\${stroke}"/>\`
        : \`<path d="\${d}" fill="none" stroke="\${stroke}" stroke-width="\${props.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>\`,
    )
    .join('')
  const svg: string = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${vb}">\${body}</svg>\`
  return \`data:image/svg+xml;utf8,\${encodeURIComponent(svg)}\`
})
</script>`,
      note: 'IconData rendering moved to <image> + SVG data URL; stroke color resolved through computedStyle (currentColor / var() cannot cross the image boundary)',
    },
    {
      anchor: `  <view
    class="sn-icon"
    :class="[customClass]"`,
      replacement: `  <view
    class="sn-icon"
    :class="[customClass, \`sn-icon--u\${iconUid}\`]"`,
      note: 'root node carries a per-instance class for the computedStyle query',
    },
    {
      anchor: `    <view v-else-if="remoteSrc" class="sn-icon__remote" :style="remoteStyle" />`,
      replacement: `    <!-- uni-app x App: background-image + SVG data URL is unreliable on native — use <image>. -->
    <image v-else-if="remoteSrc" class="sn-icon__svg-img" :src="remoteSrc" mode="aspectFit" />`,
      note: 'remote (iconify / provider URL) branch retargeted to <image :src>',
    },
    {
      anchor: `    <svg
      v-else-if="displayIcon"
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
    </svg>`,
      replacement: `    <!-- uni-app x App: inline <svg> is not a built-in element — rasterize via <image>. -->
    <image v-else-if="displayIcon" class="sn-icon__svg-img" :src="iconDataUrl" mode="aspectFit" />`,
      note: '<svg> block replaced by <image :src="iconDataUrl">',
    },
    {
      anchor: `.sn-icon svg {
  display: block;
  width: 100%;
  height: 100%;
}`,
      replacement: `.sn-icon__svg-img {
  display: block;
  width: 100%;
  height: 100%;
}`,
      note: 'svg sizing rule retargeted to the <image> element',
    },
  ],

  // sn-form/sn-form-item.vue: former [data-status] attribute-selector patches
  // are gone — the source now binds `--error/--warning` modifier classes
  // natively (messageStatusClass / iconStatusClass computeds), so the uni-x
  // output no longer needs any rewrite here.

  // sn-loading/sn-loading.vue: former :nth-child stagger patches are gone —
  // the source emits per-index modifier classes (--1..--8 / --1..--3) natively.


  'sn-picker-view/sn-picker-view-drag.ts': [
    {
      anchor: `    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
    document.addEventListener('mouseleave', onLeaveWindow);
    window.addEventListener('blur', onBlur);`,
      replacement: `    // #ifdef H5
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeaveWindow)
    window.addEventListener('blur', onBlur)
    // #endif`,
      note: 'desktop H5 mouse listeners gated behind #ifdef H5 (no DOM on App)',
    },
    {
      anchor: `      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
      document.removeEventListener('mouseleave', onLeaveWindow);
      window.removeEventListener('blur', onBlur);`,
      replacement: `      // #ifdef H5
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeaveWindow)
      window.removeEventListener('blur', onBlur)
      // #endif`,
      note: 'cleanup listeners gated behind #ifdef H5',
    },
  ],

  'sn-qr-code/sn-qr-code.vue': [
    {
      anchor: `interface UniHost {
  createCanvasContext?: (id: string, component?: unknown) => CanvasLike;
  canvasToTempFilePath?: (options: Record<string, unknown>, component?: unknown) => void;
}`,
      replacement: `interface UniHost {
  createCanvasContext?: (id: string, component?: unknown) => CanvasLike;
  canvasToTempFilePath?: (options: Record<string, unknown>, component?: unknown) => void;
  /** uni-app x only: device pixel ratio source for canvas bitmap sizing. */
  getDeviceInfo?: () => unknown
}`,
      note: 'UniHost gains getDeviceInfo for uni-app x canvas bitmap sizing',
    },
    {
      anchor: `  /** uni canvas only: flush the command queue to the native canvas. */
  draw?: (reserve?: boolean, callback?: () => void) => void;
}`,
      replacement: `  /** uni canvas only: flush the command queue to the native canvas. */
  draw?: (reserve?: boolean, callback?: () => void) => void
  /** uni-app x only: export the bitmap as a data URL (W3C-aligned). */
  toDataURL?: () => string
}`,
      note: 'CanvasLike gains toDataURL (uni-app x export path)',
    },
    {
      anchor: `/** Acquire the drawing surface: uni context first, DOM canvas second. */
function getSurface(): CanvasLike | null {`,
      replacement: `/**
 * uni-app x: the canvas bitmap defaults to 0×0 and there is no automatic DPR
 * handling — size it from the element box and scale once (official canvas
 * sample). Old-uni hosts size the bitmap themselves; this is skipped when the
 * element has no box yet (first paint before layout).
 */
function applyCanvasBitmapSize(canvas: unknown, context: CanvasLike): void {
  const el = canvas as { width?: number; height?: number; offsetWidth?: number; offsetHeight?: number }
  const deviceInfo = getUni()?.getDeviceInfo?.() as { devicePixelRatio?: number } | undefined
  const dpr = deviceInfo?.devicePixelRatio ?? 1
  const width = el.offsetWidth ?? 0
  const height = el.offsetHeight ?? 0
  if (width <= 0 || height <= 0) return
  el.width = Math.round(width * dpr)
  el.height = Math.round(height * dpr)
  context.scale?.(dpr, dpr)
}

/** Acquire the drawing surface: uni context first, DOM canvas second. */
function getSurface(): CanvasLike | null {`,
      note: 'uni-app x canvas bitmap sizing + DPR scale added (official sample pattern)',
    },
    {
      anchor: `      const context = domCanvas.getContext?.('2d');
      if (context !== null && typeof context === 'object') {
        surface = context as CanvasLike;
        surfaceCanvasId = canvasIdValue.value;
        return surface;
      }`,
      replacement: `      const context = domCanvas.getContext?.('2d')
      if (context !== null && typeof context === 'object') {
        surface = context as CanvasLike
        applyCanvasBitmapSize(domCanvas, surface)
        surfaceCanvasId = canvasIdValue.value
        return surface
      }`,
      note: 'element-context path (uni-app x template ref = UniCanvasElement) applies bitmap sizing',
    },
    {
      anchor: `    const toTempFilePath = getUni()?.canvasToTempFilePath;
    if (typeof toTempFilePath !== 'function') {`,
      replacement: `    // uni-app x: export straight from the 2d context (canvasToTempFilePath is
    // legacy-only there); on this path the promise resolves to a data URL.
    const toDataUrl = surface?.toDataURL
    if (typeof toDataUrl === 'function') {
      try {
        const dataUrl: string = toDataUrl.call(surface)
        if (dataUrl.startsWith('data:image/')) {
          resolve(dataUrl)
          return
        }
      } catch (error) {
        reject({
          code: 'EXPORT_FAILED',
          message: 'canvas toDataURL failed',
          cause: error,
        } satisfies QrExportError)
        return
      }
    }
    const toTempFilePath = getUni()?.canvasToTempFilePath;
    if (typeof toTempFilePath !== 'function') {`,
      note: 'exportImage prefers ctx.toDataURL (uni-app x); legacy canvasToTempFilePath stays as fallback',
    },
  ],

  'sn-sticky/sn-sticky.vue': [
    {
      anchor: `.sn-sticky {
  position: sticky;
  box-sizing: border-box;`,
      replacement: `/* uni-app x App: position: sticky is unsupported (css/position docs) and the
   built-in sticky-section/sticky-header only work inside list-view, so the
   component degrades to normal flow. For App-side pinning inside lists, hosts
   should use list-view + sticky-section/sticky-header directly. */
.sn-sticky {
  box-sizing: border-box;`,
      note: 'position: sticky removed — explicit normal-flow degradation on App (docs note the list-view alternative)',
    },
  ],

  'sn-config-provider/sn-config-provider.vue': [
    {
      anchor: `const rootClass = computed(() => [
  'sn-config-provider',`,
      replacement: `const rootClass = computed(() => [
  'sn-config-provider',
  // uni-app x App has no :root/page selector — token vars mount on this class (ADR-0004).
  'sn-theme-root',`,
      note: 'root node carries .sn-theme-root for token var mounting',
    },
  ],
};

export function applyPatches(source: string, relPath: string, issues: TransformIssue[]): string {
  const patches: SourcePatch[] | undefined = PATCHES[relPath];
  if (patches === undefined) return source;
  let out = source;
  for (const patch of patches) {
    if (!out.includes(patch.anchor)) {
      throw new Error(
        `[uni-x] patch anchor missing in ${relPath} (${patch.note}). ` +
          'Upstream source drifted — update the patch in packages/uni-x/src/transform/patches.ts.',
      );
    }
    out = out.replace(patch.anchor, patch.replacement);
    issues.push({ file: relPath, kind: 'patch', detail: patch.note });
  }
  return out;
}
