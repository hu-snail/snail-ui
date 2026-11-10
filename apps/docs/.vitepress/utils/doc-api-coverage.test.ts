/**
 * 契约覆盖测试 —— web 端组件文档必须与 SFC 契约一致。
 *
 * 锁死三件事（zh / en 两个语言版本都查）：
 *   1. `props` 表列出的属性 == `defineProps` 声明的属性（顺序一致，一个不多一个不少）；
 *   2. `events` 表 == `defineEmits` 的事件名（顺序一致）；没有事件的组件不得出现空表；
 *   3. `slots` 表 == `defineSlots` + 模板 `<slot>` 的插槽名（集合一致）。
 *
 * 为什么值得一条测试：文档是手写数据（`doc-pages/*.ts`），组件 SFC 一改
 * 属性 / 事件 / 插槽，文档就可能悄悄过期；这条测试把「文档即契约」变成
 * 可执行断言，而不是靠 Review Agent 逐页肉眼比对（AGENTS §110 / §92）。
 */
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { extractFullContract, type SfcContract } from './sfc-contract';

interface DocRow {
  name: string;
  [key: string]: unknown;
}

interface DocSection {
  hint: unknown;
  rows: DocRow[];
}

interface DocPage {
  props?: DocSection;
  events?: DocSection;
  slots?: DocSection;
}

type ModuleExports = Record<string, unknown>;

const HERE = path.dirname(fileURLToPath(import.meta.url));
const WEB_SRC = path.resolve(HERE, '../../../../packages/vue-web/src');

const zhModules = import.meta.glob<ModuleExports>('./doc-pages/*.ts', { eager: true });
const enModules = import.meta.glob<ModuleExports>('./doc-pages/en/*.ts', { eager: true });

/** 页面模块导出的是具名常量（如 `buttonDocPage`），取那个带 `props` 的对象。 */
function pageOf(modules: Record<string, ModuleExports>, file: string): DocPage | undefined {
  const mod = modules[file];
  if (!mod) return undefined;
  for (const value of Object.values(mod)) {
    if (value && typeof value === 'object' && 'props' in value) return value as DocPage;
  }
  return undefined;
}

function nameOf(file: string): string {
  return path.basename(file, '.ts');
}

function pascal(kebab: string): string {
  return kebab
    .split('-')
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join('');
}

/** 与文档渲染层同一套归一化：允许 `htmlType (deprecated)` 这类标注。 */
function normalize(name: string): string {
  return name
    .replace(/[`*]/g, '')
    .replace(/\s*\((deprecated|已废弃|废弃)\)\s*/i, '')
    .replace(/\s*（.*?）\s*/g, '')
    .trim();
}

const zhNames = Object.keys(zhModules).map(nameOf).sort();
const enNames = Object.keys(enModules).map(nameOf).sort();

function contractFor(name: string): SfcContract {
  const file = path.join(WEB_SRC, name, `Sn${pascal(name)}.vue`);
  return extractFullContract(readFileSync(file, 'utf8'));
}

describe('web component docs contract coverage', () => {
  it('should ship a zh and en data page for the same component set', () => {
    expect(zhNames).toEqual(enNames);
    expect(zhNames.length).toBeGreaterThan(0);
  });

  it('should document every declared prop, in declaration order', () => {
    const problems: string[] = [];
    for (const name of zhNames) {
      const contract = contractFor(name);
      const langs = [
        ['zh', zhModules, `./doc-pages/${name}.ts`],
        ['en', enModules, `./doc-pages/en/${name}.ts`],
      ] as const;
      for (const [lang, modules, file] of langs) {
        const page = pageOf(modules, file);
        if (!page?.props?.rows?.length) {
          problems.push(`${name}/${lang}: props table missing`);
          continue;
        }
        const rows = page.props.rows.map((row) => normalize(row.name));
        if (rows.join('|') !== contract.props.join('|')) {
          problems.push(
            `${name}/${lang}: props mismatch\n    doc: ${rows.join(', ')}\n    sfc: ${contract.props.join(', ')}`,
          );
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('should document exactly the emitted events, in declaration order', () => {
    const problems: string[] = [];
    for (const name of zhNames) {
      const contract = contractFor(name);
      const langs = [
        ['zh', zhModules, `./doc-pages/${name}.ts`],
        ['en', enModules, `./doc-pages/en/${name}.ts`],
      ] as const;
      for (const [lang, modules, file] of langs) {
        const page = pageOf(modules, file);
        const rows = page?.events?.rows ?? [];
        const documented = rows.map((row) => row.name);
        if (documented.join('|') !== contract.emits.join('|')) {
          problems.push(
            `${name}/${lang}: events mismatch\n    doc: ${documented.join(', ') || '—'}\n    sfc: ${contract.emits.join(', ') || '—'}`,
          );
        }
        for (const row of rows) {
          if (!row.desc) problems.push(`${name}/${lang}: event \`${row.name}\` has no description`);
        }
      }
    }
    expect(problems).toEqual([]);
  });

  it('should document exactly the exposed slots (set equality)', () => {
    const problems: string[] = [];
    for (const name of zhNames) {
      const contract = contractFor(name);
      const expected = [...contract.slots].sort().join('|');
      const langs = [
        ['zh', zhModules, `./doc-pages/${name}.ts`],
        ['en', enModules, `./doc-pages/en/${name}.ts`],
      ] as const;
      for (const [lang, modules, file] of langs) {
        const page = pageOf(modules, file);
        const rows = page?.slots?.rows ?? [];
        const documented = rows
          .map((row) => row.name)
          .sort()
          .join('|');
        if (documented !== expected) {
          problems.push(
            `${name}/${lang}: slots mismatch\n    doc: ${documented || '—'}\n    sfc: ${expected || '—'}`,
          );
        }
        for (const row of rows) {
          if (!row.desc) problems.push(`${name}/${lang}: slot \`${row.name}\` has no description`);
        }
      }
    }
    expect(problems).toEqual([]);
  });
});
