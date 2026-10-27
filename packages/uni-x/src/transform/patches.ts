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
      anchor: `  return style;
});
</script>`,
      replacement: `  return style
})

/**
 * uni-app x App has no inline <svg> element: IconData renders through an
 * <image> with an SVG data URL instead. CSS currentColor cannot reach the
 * rasterized document, so the stroke falls back to a fixed ink color.
 */
const iconDataUrl = computed<string | undefined>(() => {
  if (props.icon === undefined) return undefined
  const vb: string = props.icon.viewBox ?? '0 0 24 24'
  const stroke: string = props.color === 'currentColor' ? '#1a1a1a' : props.color
  const body: string = props.icon.paths
    .map(
      (d) =>
        \`<path d="\${d}" fill="none" stroke="\${stroke}" stroke-width="\${props.strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>\`,
    )
    .join('')
  const svg: string = \`<svg xmlns="http://www.w3.org/2000/svg" viewBox="\${vb}">\${body}</svg>\`
  return \`data:image/svg+xml;utf8,\${encodeURIComponent(svg)}\`
})
</script>`,
      note: 'IconData rendering moved to <image> + SVG data URL (no inline <svg> on App)',
    },
    {
      anchor: `    <svg
      v-else-if="icon"
      xmlns="http://www.w3.org/2000/svg"
      :viewBox="viewBox"
      fill="none"
      :stroke="color"
      :stroke-width="effectiveStrokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      focusable="false"
    >
      <path v-for="(d, i) in icon.paths" :key="i" :d="d" />
    </svg>`,
      replacement: `    <!-- uni-app x App: inline <svg> is not a built-in element — rasterize via <image>. -->
    <image v-else-if="icon" class="sn-icon__svg-img" :src="iconDataUrl" mode="aspectFit" />`,
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

  'sn-cell/sn-cell.vue': [
    {
      anchor: `    :hover-class="isInteractive ? 'sn-cell--pressed' : 'none'"
    @tap="onTap"
  >`,
      replacement: `    :hover-class="isInteractive ? 'sn-cell--pressed' : 'none'"
    @tap="onTap"
  >
    <view v-if="effectiveBorder" class="sn-cell__hairline" aria-hidden="true" />`,
      note: 'pressed hover-class is source-native now; ::after hairline still replaced by a real element',
    },
    {
      anchor: `.sn-cell--border::after {
  position: absolute;
  right: 0;
  bottom: 0;
  left: var(--sn-mp-spacing-4);
  height: 2rpx;
  background-color: var(--sn-mp-color-border-subtle);
  content: '';
}`,
      replacement: `/* uni-app x App: ::after unsupported — hairline is a real element. */
.sn-cell__hairline {
  position: absolute;
  right: 0;
  bottom: 0;
  left: var(--sn-mp-spacing-4);
  height: 2rpx;
  background-color: var(--sn-mp-color-border-subtle);
}`,
      note: '::after hairline rule → .sn-cell__hairline (:active → .sn-cell--pressed moved into source)',
    },
  ],

  'sn-form/sn-form-item.vue': [
    {
      anchor: `        class="sn-form-item__message"
        :data-status="status"
`,
      replacement: `        class="sn-form-item__message"
        :class="'sn-form-item__message--' + status"
`,
      note: 'message [data-status] attribute selector → status modifier class',
    },
    {
      anchor: `          class="sn-form-item__status-icon"
          :data-status="status"
`,
      replacement: `          class="sn-form-item__status-icon"
          :class="'sn-form-item__status-icon--' + status"
`,
      note: 'status-icon [data-status] attribute selector → status modifier class',
    },
    {
      anchor: '.sn-form-item__status-icon[data-status=\'error\'] {',
      replacement: '.sn-form-item__status-icon--error {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__status-icon[data-status=\'warning\'] {',
      replacement: '.sn-form-item__status-icon--warning {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__status-icon[data-status=\'success\'] {',
      replacement: '.sn-form-item__status-icon--success {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__message[data-status=\'error\'] {',
      replacement: '.sn-form-item__message--error {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__message[data-status=\'warning\'] {',
      replacement: '.sn-form-item__message--warning {',
      note: 'attribute selector rewritten',
    },
  ],

  'sn-loading/sn-loading.vue': [
    {
      anchor: `          class="sn-loading__spinner-bar"
`,
      replacement: `          class="sn-loading__spinner-bar"
          :class="'sn-loading__spinner-bar--' + i"
`,
      note: 'nth-child delays → per-index modifier class',
    },
    {
      anchor: '<view v-for="i in 3" :key="i" class="sn-loading__dot" />',
      replacement: `<view v-for="i in 3" :key="i" class="sn-loading__dot" :class="'sn-loading__dot--' + i" />`,
      note: 'nth-child delays → per-index modifier class',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(1) {
  animation-delay: 0s;
  opacity: 1;
}`,
      replacement: '.sn-loading__spinner-bar--1 { animation-delay: 0s; opacity: 1; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(2) {
  animation-delay: 0.1s;
  opacity: 0.875;
}`,
      replacement: '.sn-loading__spinner-bar--2 { animation-delay: 0.1s; opacity: 0.875; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(3) {
  animation-delay: 0.2s;
  opacity: 0.75;
}`,
      replacement: '.sn-loading__spinner-bar--3 { animation-delay: 0.2s; opacity: 0.75; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(4) {
  animation-delay: 0.3s;
  opacity: 0.625;
}`,
      replacement: '.sn-loading__spinner-bar--4 { animation-delay: 0.3s; opacity: 0.625; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(5) {
  animation-delay: 0.4s;
  opacity: 0.5;
}`,
      replacement: '.sn-loading__spinner-bar--5 { animation-delay: 0.4s; opacity: 0.5; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(6) {
  animation-delay: 0.5s;
  opacity: 0.375;
}`,
      replacement: '.sn-loading__spinner-bar--6 { animation-delay: 0.5s; opacity: 0.375; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(7) {
  animation-delay: 0.6s;
  opacity: 0.25;
}`,
      replacement: '.sn-loading__spinner-bar--7 { animation-delay: 0.6s; opacity: 0.25; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__spinner-bar:nth-child(8) {
  animation-delay: 0.7s;
  opacity: 0.125;
}`,
      replacement: '.sn-loading__spinner-bar--8 { animation-delay: 0.7s; opacity: 0.125; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__dot:nth-child(2) {
  animation-delay: 0.15s;
}`,
      replacement: '.sn-loading__dot--2 { animation-delay: 0.15s; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: `.sn-loading__dot:nth-child(3) {
  animation-delay: 0.3s;
}`,
      replacement: '.sn-loading__dot--3 { animation-delay: 0.3s; }',
      note: 'nth-child rewritten',
    },
  ],

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
