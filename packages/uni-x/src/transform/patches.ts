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
  'sn-button/sn-button.vue': [
    {
      anchor: "    hoverClass: 'sn-button--feedback',",
      replacement: "    hoverClass: 'sn-button--pressed',",
      note: 'default hover-class switched to the uni-x pressed class',
    },
    {
      anchor: '    :hover-class="hoverClass"',
      replacement:
        "    :hover-class=\"feedback && !disabled && !loading ? hoverClass : 'none'\"",
      note: 'hover-class gated on feedback/disabled/loading (App has no :active pseudo)',
    },
    {
      anchor: `.sn-button--feedback:active:not(.sn-button--disabled):not(.sn-button--loading) {
  opacity: 0.7;
}`,
      replacement: `/* uni-app x App: :active unsupported — pressed feedback ships via view hover-class. */
.sn-button--pressed {
  opacity: 0.7;
}`,
      note: ':active rule replaced by .sn-button--pressed (hover-class driven)',
    },
  ],

  'sn-icon/sn-icon.vue': [
    {
      anchor: `  return style
})
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
      <path
        v-for="(d, i) in icon.paths"
        :key="i"
        :d="d"
      />
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
      anchor: `    :aria-label="isInteractive ? title || undefined : undefined"
    @tap="onTap"
  >`,
      replacement: `    :aria-label="isInteractive ? title || undefined : undefined"
    :hover-class="isInteractive ? 'sn-cell--pressed' : 'none'"
    @tap="onTap"
  >
    <view v-if="effectiveBorder" class="sn-cell__hairline" aria-hidden="true" />`,
      note: 'pressed feedback via hover-class; ::after hairline replaced by a real element',
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
      replacement: `/* uni-app x App: ::after unsupported — hairline is a real element; pressed via hover-class. */
.sn-cell__hairline {
  position: absolute;
  right: 0;
  bottom: 0;
  left: var(--sn-mp-spacing-4);
  height: 2rpx;
  background-color: var(--sn-mp-color-border-subtle);
}

.sn-cell--pressed {
  background-color: var(--sn-mp-color-background-soft);
}`,
      note: '::after hairline rule → .sn-cell__hairline; :active → .sn-cell--pressed',
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
      anchor: '.sn-form-item__status-icon[data-status="error"] {',
      replacement: '.sn-form-item__status-icon--error {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__status-icon[data-status="warning"] {',
      replacement: '.sn-form-item__status-icon--warning {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__status-icon[data-status="success"] {',
      replacement: '.sn-form-item__status-icon--success {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__message[data-status="error"] {',
      replacement: '.sn-form-item__message--error {',
      note: 'attribute selector rewritten',
    },
    {
      anchor: '.sn-form-item__message[data-status="warning"] {',
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
      replacement:
        `<view v-for="i in 3" :key="i" class="sn-loading__dot" :class="'sn-loading__dot--' + i" />`,
      note: 'nth-child delays → per-index modifier class',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(1) { animation-delay: 0s; opacity: 1; }',
      replacement: '.sn-loading__spinner-bar--1 { animation-delay: 0s; opacity: 1; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(2) { animation-delay: 0.1s; opacity: 0.875; }',
      replacement: '.sn-loading__spinner-bar--2 { animation-delay: 0.1s; opacity: 0.875; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(3) { animation-delay: 0.2s; opacity: 0.75; }',
      replacement: '.sn-loading__spinner-bar--3 { animation-delay: 0.2s; opacity: 0.75; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(4) { animation-delay: 0.3s; opacity: 0.625; }',
      replacement: '.sn-loading__spinner-bar--4 { animation-delay: 0.3s; opacity: 0.625; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(5) { animation-delay: 0.4s; opacity: 0.5; }',
      replacement: '.sn-loading__spinner-bar--5 { animation-delay: 0.4s; opacity: 0.5; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(6) { animation-delay: 0.5s; opacity: 0.375; }',
      replacement: '.sn-loading__spinner-bar--6 { animation-delay: 0.5s; opacity: 0.375; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(7) { animation-delay: 0.6s; opacity: 0.25; }',
      replacement: '.sn-loading__spinner-bar--7 { animation-delay: 0.6s; opacity: 0.25; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__spinner-bar:nth-child(8) { animation-delay: 0.7s; opacity: 0.125; }',
      replacement: '.sn-loading__spinner-bar--8 { animation-delay: 0.7s; opacity: 0.125; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__dot:nth-child(2) { animation-delay: 0.15s; }',
      replacement: '.sn-loading__dot--2 { animation-delay: 0.15s; }',
      note: 'nth-child rewritten',
    },
    {
      anchor: '.sn-loading__dot:nth-child(3) { animation-delay: 0.3s; }',
      replacement: '.sn-loading__dot--3 { animation-delay: 0.3s; }',
      note: 'nth-child rewritten',
    },
  ],

  'sn-picker-view/sn-picker-view-drag.ts': [
    {
      anchor: `    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeaveWindow)
    window.addEventListener('blur', onBlur)`,
      replacement: `    // #ifdef H5
    document.addEventListener('mousemove', onMove)
    document.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeaveWindow)
    window.addEventListener('blur', onBlur)
    // #endif`,
      note: 'desktop H5 mouse listeners gated behind #ifdef H5 (no DOM on App)',
    },
    {
      anchor: `      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeaveWindow)
      window.removeEventListener('blur', onBlur)`,
      replacement: `      // #ifdef H5
      document.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeaveWindow)
      window.removeEventListener('blur', onBlur)
      // #endif`,
      note: 'cleanup listeners gated behind #ifdef H5',
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
