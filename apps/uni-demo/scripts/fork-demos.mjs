#!/usr/bin/env node
/**
 * fork-demos —— 一次性引导脚本（ADR-0005：uni-demo 自持 demo 源）。
 *
 * uni 端 demo 源的唯一事实源在本工程 `src/pages/<group>/demos/`；初版从 docs
 * 演示目录整体迁入，此后两侧各自演进（docs 预览改由本工程部署产物 iframe 承载，
 * 不再持有 uni demo）。迁移时同步完成 MP 可移植性修复：HTML 标签（div/span/p/
 * code 在 mp-weixin 不渲染）→ uni 标签（view/text）。demo 源按 docs 总览分组
 * 物理放入对应 subPackage 目录，使小程序组件 chunk 归入分包（主包限 2MB）。
 *
 * 依赖浏览器 API 的 demo 无法在 MP 端运行，不迁入，登记 follow-up 修复后
 * 手工移入。英文影子（demo-en）迁为 `<name>.en.vue`，供 docs 代码面板按
 * 站点语言取用；运行时页面以中文 demo 为准。
 *
 * 本脚本设计为可重复执行（覆盖写入），但 demo 源迁入后以本工程为准演进，
 * 不再依赖 docs 目录。
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { COMP_RE, parseOverviewData, splitSubpackages, subrootMap } from './subpackages.mjs';

const pagesDir = fileURLToPath(new URL('../src/pages/', import.meta.url));

/** uni demo 的文件名标记：`button-mp-basic`（中段）与 `card-mp`（后缀）两种形态。 */
const MP_NAME = /(^|-)mp(-|$)/;

/** 依赖浏览器 API、暂不能上 MP 的 demo（见 .ai/tasks/follow-up/ 对应任务）。 */
const EXCLUDE = new Set(['img-cropper-mp-basic', 'switch-mp-before-change']);

/**
 * HTML → uni 标签改写。div 在 mp-weixin 端不渲染，text 是行内文本的标准
 * 载体。只做标签名替换，属性与样式类保持原样；纯正 uni 标签的文件不受影响。
 */
const TAG_REWRITES = [
  [/<div(\s|>)/g, '<view$1'],
  [/<\/div>/g, '</view>'],
  [/<span(\s|>)/g, '<text$1'],
  [/<\/span>/g, '</text>'],
  [/<p(\s|>)/g, '<text$1'],
  [/<\/p>/g, '</text>'],
  [/<code(\s|>)/g, '<text$1'],
  [/<\/code>/g, '</text>'],
];

/**
 * 裸包名 → 源码别名改写：dist 产物按 H5 运行时预编译（openBlock 等导入在
 * uni-mp-vue 运行时不存在），demo 一律走 @snui/uni-src 源码路径编译。
 */
const BARE_UNI_RE = /import\s*\{([^}]+)\}\s*from\s*'@snui\/uni'/g;

function kebabOf(snName) {
  return `sn-${snName
    .replace(/^Sn/, '')
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .toLowerCase()}`;
}

function portable(source) {
  let out = source.replace(BARE_UNI_RE, (_, names) =>
    names
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean)
      .map((n) => {
        const comp = kebabOf(n);
        return `import ${n} from '@snui/uni-src/components/${comp}/${comp}.vue'`;
      })
      .join('\n'),
  );
  for (const [pattern, replacement] of TAG_REWRITES) {
    out = out.replace(pattern, replacement);
  }
  return out;
}

/**
 * 引导源 = git HEAD 里的 docs demo 目录。
 *
 * docs 工作树已不持有 uni demo（本任务删除，ADR-0005 单一事实源迁至本工程），
 * 一次性引导从迁移前的 git 历史读取，避免依赖 docs 当前状态。
 */
const REPO_ROOT = execFileSync('git', ['rev-parse', '--show-toplevel'], {
  encoding: 'utf8',
}).trim();
const DOCS_DEMO_PREFIX = 'apps/docs/.vitepress/demo';
const DOCS_DEMO_EN_PREFIX = 'apps/docs/.vitepress/demo-en';

function gitList(prefix) {
  const out = execFileSync('git', ['ls-tree', '-r', '--name-only', 'HEAD', prefix], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
    maxBuffer: 16 * 1024 * 1024,
  });
  return out
    .split('\n')
    .filter((f) => f.endsWith('.vue') && !f.includes('/._'))
    .map((f) => f.slice(prefix.length + 1));
}

function gitRead(prefix, file) {
  return execFileSync('git', ['show', `HEAD:${prefix}/${file}`], {
    encoding: 'utf8',
    cwd: REPO_ROOT,
    maxBuffer: 16 * 1024 * 1024,
  });
}

const compMeta = parseOverviewData();
const zhNames = gitList(DOCS_DEMO_PREFIX)
  .map((f) => f.replace(/\.vue$/, ''))
  .filter((n) => MP_NAME.test(n) && !EXCLUDE.has(n));
const compsByGroup = new Map();
for (const comp of [...new Set(zhNames.map((n) => n.match(COMP_RE)?.[1] ?? n))].sort()) {
  const group = compMeta.comps.get(comp)?.group ?? 'more';
  if (!compsByGroup.has(group)) compsByGroup.set(group, []);
  compsByGroup.get(group).push({ key: comp });
}
const subroots = subrootMap(splitSubpackages(compsByGroup, compMeta.groupOrder));

let zh = 0;
let en = 0;
const excluded = [];

function demosDirOf(comp) {
  return `${pagesDir}${subroots.get(comp) ?? 'more'}/demos/`;
}

for (const root of new Set(subroots.values())) {
  rmSync(`${pagesDir}${root}/demos`, { recursive: true, force: true });
}
rmSync(`${pagesDir}more/demos`, { recursive: true, force: true });

for (const file of gitList(DOCS_DEMO_PREFIX)) {
  const name = file.replace(/\.vue$/, '');
  if (!MP_NAME.test(name)) continue;
  if (EXCLUDE.has(name)) {
    excluded.push(name);
    continue;
  }
  const comp = name.match(COMP_RE)?.[1] ?? name;
  const outDir = demosDirOf(comp);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}${name}.vue`, portable(gitRead(DOCS_DEMO_PREFIX, file)));
  zh += 1;
}

for (const file of gitList(DOCS_DEMO_EN_PREFIX)) {
  const name = file.replace(/\.vue$/, '');
  if (!MP_NAME.test(name)) continue;
  if (EXCLUDE.has(name)) continue;
  const comp = name.match(COMP_RE)?.[1] ?? name;
  const outDir = demosDirOf(comp);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(`${outDir}${name}.en.vue`, portable(gitRead(DOCS_DEMO_EN_PREFIX, file)));
  en += 1;
}

console.log(
  `[fork-demos] zh demos: ${zh}, en shadows: ${en}, excluded: ${excluded.join(', ') || 'none'}`,
);
