import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { parseSfc } from './sfc.ts';
import { transformScript } from './script.ts';
import { transformVueToUvue } from './index.ts';
import { applyPatches } from './patches.ts';
import type { TransformIssue } from './types.ts';

describe('parseSfc', () => {
  it('should split script/template/style blocks', () => {
    const src =
      '<script setup lang="ts">\nconst a = 1\n</script>\n\n<template>\n  <view />\n</template>\n\n<style scoped>\n.a {\n  color: red;\n}\n</style>\n';
    const sfc = parseSfc(src);
    expect(sfc.blocks).toHaveLength(3);
    expect(sfc.blocks[0]?.tag).toBe('script');
    expect(sfc.blocks[0]?.attrs).toBe('setup lang="ts"');
    expect(sfc.blocks[1]?.tag).toBe('template');
    expect(sfc.blocks[2]?.tag).toBe('style');
    expect(sfc.stray).toBe('');
  });

  it('should handle nested template tags (slot templates) without breaking the root block', () => {
    const src =
      '<template>\n  <view>\n    <template #icon>\n      <text>i</text>\n    </template>\n  </view>\n</template>\n';
    const sfc = parseSfc(src);
    expect(sfc.blocks).toHaveLength(1);
    expect(sfc.blocks[0]?.content).toContain('<template #icon>');
    expect(sfc.blocks[0]?.content).toContain('</template>');
  });

  it('should report stray content outside blocks instead of crashing', () => {
    const src =
      '<style scoped>\n.a {\n  color: red;\n}\n</style>\n\n/* stray */\n.b {\n  color: blue;\n}\n';
    const sfc = parseSfc(src);
    expect(sfc.blocks).toHaveLength(1);
    expect(sfc.stray).toContain('stray');
  });
});

describe('transformScript', () => {
  it('should convert DOM event calls to optional calls', () => {
    const r = transformScript(
      'function h(e: Event) {\n  e.preventDefault()\n  e.stopImmediatePropagation()\n}',
      'f.ts',
    );
    expect(r.code).toContain('e.preventDefault?.()');
    expect(r.code).toContain('e.stopImmediatePropagation?.()');
    expect(r.issues.some((i) => i.kind === 'script-guard')).toBe(true);
  });

  it('should strip an unconsumed defineSlots call', () => {
    const r = transformScript('\ndefineSlots<{\n  default(): unknown\n}>()\n', 'f.vue');
    expect(r.code).not.toContain('defineSlots');
    expect(r.issues.some((i) => i.kind === 'defineSlots-stripped')).toBe(true);
  });

  it('should keep a consumed defineSlots call and flag it', () => {
    const r = transformScript('const slots = defineSlots<{\n  default(): unknown\n}>()\n', 'f.vue');
    expect(r.code).toContain('const slots = defineSlots');
    expect(r.issues.some((i) => i.kind === 'defineSlots-manual')).toBe(true);
  });
});

describe('transformVueToUvue', () => {
  it('should run the full pipeline and preserve block structure', () => {
    const src = [
      '<script setup lang="ts">',
      "import { computed } from 'vue'",
      'const label = computed(() => "ok")',
      '</script>',
      '',
      '<template>',
      '  <view class="a" @tap="go" data-x="1">{{ label }}</view>',
      '</template>',
      '',
      '<style scoped>',
      '.a { color: red; cursor: pointer; }',
      '.wrap .a { color: blue; }',
      '</style>',
    ].join('\n');
    const r = transformVueToUvue(src, 'test/sn-comp.vue');
    expect(r.code).toContain('<script setup lang="ts">');
    expect(r.code).toContain('@click="go"');
    expect(r.code).not.toContain('data-x');
    expect(r.code).toContain('<text>{{ label }}</text>');
    expect(r.code).toContain('color: var(--snx-a-color, red)');
    expect(r.code).not.toContain('cursor');
    expect(r.code).toContain('--snx-a-color: blue;');
    expect(r.code).toContain('color: var(--snx-a-color, red)');
  });

  it('should pass through files without patches untouched', () => {
    const issues: TransformIssue[] = [];
    expect(applyPatches('plain source', 'unknown/unknown.vue', issues)).toBe('plain source');
    expect(issues).toHaveLength(0);
  });
});

/**
 * Regression guard (§103): sn-popover / sn-tooltip used to never open on
 * uni-app x App because taps on their slot content (the page's compilation
 * unit) never reach the component's own views there. The open path now rides
 * an `#ifdef APP` catcher node the component owns — the transform must carry
 * that gate, the catcher and its renamed click binding into the .uvue
 * verbatim, and keep the catcher's CSS out of the flattener's hands.
 */
describe('transformVueToUvue — App trigger open path (popover / tooltip)', () => {
  const uniComponents = resolve(__dirname, '../../../uni/src/components');

  const gatedBlockOf = (out: string, startMark: string, endMark: string): string => {
    const start = out.indexOf(startMark);
    const end = out.indexOf(endMark, start);
    expect(start, `${startMark} must survive the transform`).toBeGreaterThan(-1);
    expect(end).toBeGreaterThan(start);
    return out.slice(start, end);
  };

  for (const component of ['sn-popover', 'sn-tooltip'] as const) {
    it(`should keep the ${component} App catcher and its click binding in the .uvue`, () => {
      const src = readFileSync(join(uniComponents, component, `${component}.vue`), 'utf8');
      const out = transformVueToUvue(src, `components/${component}/${component}.uvue`).code;

      // Template gate: the catcher stays App-only and stays bound to the same
      // toggle handler (uni-app x has no @tap, so the rename must land inside
      // the gate).
      const templateGate = gatedBlockOf(out, '<!-- #ifdef APP -->', '<!-- #endif -->');
      expect(templateGate).toContain(`${component}__trigger-catcher`);
      expect(templateGate).toContain('@click.stop="onTriggerTap"');
      expect(templateGate).toContain('hover-class=');

      // The catcher must not leak outside the App gates — the component
      // carries TWO gates (template catcher + style shield), so both are
      // stripped before the leak check (the style block lives after the
      // template one; stripping back-to-front keeps the slice indexes valid).
      const styleStart = out.indexOf('/* #ifdef APP */');
      const styleEnd = out.indexOf('/* #endif */') + '/* #endif */'.length;
      expect(styleStart).toBeGreaterThan(-1);
      const afterStyle = out.slice(0, styleStart) + out.slice(styleEnd);
      const tplStart = afterStyle.indexOf('<!-- #ifdef APP -->');
      const tplEnd = afterStyle.indexOf('<!-- #endif -->') + '<!-- #endif -->'.length;
      const withoutGate = afterStyle.slice(0, tplStart) + afterStyle.slice(tplEnd);
      expect(withoutGate).not.toContain(`${component}__trigger-catcher`);

      // Style gate: the catcher's absolute shield rule survives with its gate.
      const styleGate = gatedBlockOf(out, '/* #ifdef APP */', '/* #endif */');
      expect(styleGate).toContain(`.${component}__trigger-catcher {`);
      expect(styleGate).toContain('position: absolute');
    });
  }
});
