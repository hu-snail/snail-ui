import { describe, expect, it } from 'vitest';
import { transformImportSpecifiers } from './script.ts';
import { transformVueToUvue } from './index.ts';

describe('transformImportSpecifiers', () => {
  it('should rewrite type imports from sn-icon.vue to the sn-icon-types entity', () => {
    const r = transformImportSpecifiers(
      "import type { IconData } from '../sn-icon/sn-icon.vue';\n",
      'sn-fab/sn-fab.vue',
    );
    expect(r.code).toBe("import type { IconData } from '../sn-icon/sn-icon-types';\n");
  });

  it('should rewrite cross-component value imports from .vue to .uvue', () => {
    const r = transformImportSpecifiers(
      "import SnIcon from '../sn-icon/sn-icon.vue';\nimport SnPopup from '../sn-popup/sn-popup.vue';\n",
      'sn-action-sheet/sn-action-sheet.vue',
    );
    expect(r.code).toContain("from '../sn-icon/sn-icon.uvue'");
    expect(r.code).toContain("from '../sn-popup/sn-popup.uvue'");
    expect(r.code).not.toContain(".vue'");
  });

  it('should leave helper .ts imports and package imports untouched', () => {
    const src =
      "import { resolveIconByName } from '../sn-icon/sn-icon-registry';\n" +
      "import type { IconData } from './sn-icon-types';\n" +
      "import { defineComponent } from 'vue';\n";
    const r = transformImportSpecifiers(src, 'f.vue');
    expect(r.code).toBe(src);
  });

  it('should handle sibling-directory chains (../../ depth)', () => {
    const r = transformImportSpecifiers(
      "import SnCell from '../../sn-cell/sn-cell.vue';\n",
      'sn-cell-group/sn-cell-group.vue',
    );
    expect(r.code).toContain("from '../../sn-cell/sn-cell.uvue'");
  });
});

describe('transformVueToUvue imports', () => {
  it('should rewrite cross-component imports in the emitted .uvue', () => {
    const src =
      '<script setup lang="ts">\n' +
      "import SnIcon from '../sn-icon/sn-icon.vue';\n" +
      "import type { IconData } from '../sn-icon/sn-icon.vue';\n" +
      '</script>\n\n<template>\n  <view />\n</template>\n';
    const r = transformVueToUvue(src, 'sn-fab/sn-fab.vue');
    expect(r.code).toContain("from '../sn-icon/sn-icon.uvue'");
    expect(r.code).toContain("from '../sn-icon/sn-icon-types'");
    expect(r.code).not.toContain(".vue'");
  });

  it('should rewrite kebab sub-component tags to PascalCase binding names', () => {
    const src =
      '<script setup lang="ts">\n' +
      "import SnRichTextNode from './sn-rich-text-node.vue';\n" +
      '</script>\n\n<template>\n' +
      '  <sn-rich-text-node :node="node" />\n' +
      '</template>\n';
    const r = transformVueToUvue(src, 'sn-rich-text/sn-rich-text.vue');
    expect(r.code).toContain('<SnRichTextNode :node="node" />');
    expect(r.code).not.toContain('<sn-rich-text-node');
  });

  it('should rewrite closing tags and leave unimported tags untouched', () => {
    const src =
      '<script setup lang="ts">\n' +
      "import SnCheckbox from '../sn-checkbox/sn-checkbox.vue';\n" +
      '</script>\n\n<template>\n' +
      '  <sn-checkbox-group>\n    <sn-checkbox />\n  </sn-checkbox-group>\n' +
      '</template>\n';
    const r = transformVueToUvue(src, 'x.vue');
    expect(r.code).toContain('<SnCheckbox />');
    expect(r.code).toContain('<sn-checkbox-group>'); // 无显式导入 → 保持 kebab（easycom 兜底）
  });
});
