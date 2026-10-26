import { describe, expect, it } from 'vitest';
import { parseSfc } from './sfc.ts';
import { transformScript } from './script.ts';
import { transformVueToUvue } from './index.ts';
import { applyPatches } from './patches.ts';
import type { TransformIssue } from './types.ts';

describe('parseSfc', () => {
  it('should split script/template/style blocks', () => {
    const src = '<script setup lang="ts">\nconst a = 1\n</script>\n\n<template>\n  <view />\n</template>\n\n<style scoped>\n.a {\n  color: red;\n}\n</style>\n';
    const sfc = parseSfc(src);
    expect(sfc.blocks).toHaveLength(3);
    expect(sfc.blocks[0]?.tag).toBe('script');
    expect(sfc.blocks[0]?.attrs).toBe('setup lang="ts"');
    expect(sfc.blocks[1]?.tag).toBe('template');
    expect(sfc.blocks[2]?.tag).toBe('style');
    expect(sfc.stray).toBe('');
  });

  it('should handle nested template tags (slot templates) without breaking the root block', () => {
    const src = '<template>\n  <view>\n    <template #icon>\n      <text>i</text>\n    </template>\n  </view>\n</template>\n';
    const sfc = parseSfc(src);
    expect(sfc.blocks).toHaveLength(1);
    expect(sfc.blocks[0]?.content).toContain('<template #icon>');
    expect(sfc.blocks[0]?.content).toContain('</template>');
  });

  it('should report stray content outside blocks instead of crashing', () => {
    const src = '<style scoped>\n.a {\n  color: red;\n}\n</style>\n\n/* stray */\n.b {\n  color: blue;\n}\n';
    const sfc = parseSfc(src);
    expect(sfc.blocks).toHaveLength(1);
    expect(sfc.stray).toContain('stray');
  });
});

describe('transformScript', () => {
  it('should convert DOM event calls to optional calls', () => {
    const r = transformScript('function h(e: Event) {\n  e.preventDefault()\n  e.stopImmediatePropagation()\n}', 'f.ts');
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
    const r = transformScript("const slots = defineSlots<{\n  default(): unknown\n}>()\n", 'f.vue');
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
