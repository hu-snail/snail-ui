/**
 * check-x —— apps/uni-demo-x 结构校验（无需 HBuilderX 的最小验收面）：
 *
 * 1. manifest.json 为 uni-app x 蒸汽模式形态（`uni-app-x.vapor: true`）。
 * 2. pages.json 的每个页面（主包 + subPackage）都有对应 .uvue 文件。
 * 3. 生成树中每个 `<sn-*>` 标签都能被显式 .uvue 导入或 easycom 正则
 *    解析到 `@snui/uni-x/dist/components/…` 实体（组件产物已生成）。
 * 4. 无 `.vue` 页面残留、无 `@snui/uni-src` 引用、无 demo-bridge 引用。
 * 5. 与 uni-demo 的同步契约：首页分组（home-data 的分组 key / 标签序列）和
 *    pages.json 分组（subPackage root + 页面清单）必须与 uni-demo 逐项一致
 *    —— x 端是 uni-demo 的生成镜像，uni-demo 增删分组（如展示 / 业务 /
 *    更多）后未重新 gen-x 时在这里直接失败，而不是上线后少一栏分类。
 * 6. 新鲜度契约：每个生成产物头部的 gen-x 源指纹（源路径 + sha256）必须与
 *    当前源一致 —— 改了 apps/uni-demo / templates / uni 组件源码而未重跑
 *    gen-x 时在这里直接失败（曾导致预览端跑旧 token、样式"改了没生效"）。
 *
 * 运行：pnpm -F @snui/uni-demo-x check
 */

import { createHash } from 'node:crypto';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const uniXDist = resolve(appRoot, '../../packages/uni-x/dist');

const problems = [];
const notes = { pages: 0, uvue: 0, tags: new Set(), resolved: 0, explicit: 0 };

function walk(dir, cb) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walk(full, cb);
    else cb(full);
  }
}

/* 1. manifest 形态 */
const manifest = JSON.parse(readFileSync(join(appRoot, 'manifest.json'), 'utf8'));
const xNode = manifest['uni-app-x'];
if (!xNode || xNode.vapor !== true) {
  problems.push('manifest.json 缺少 `uni-app-x.vapor: true` —— HBuilderX 会识别为 js 引擎版项目');
}
if (xNode && xNode['vapor-default-script-lang'] !== 'ts') {
  problems.push('manifest.json 建议声明 `vapor-default-script-lang: "ts"`');
}

/* 1b. index.html —— web 端编译入口（官方模板形态：入口为无扩展名 `/main`） */
const indexHtml = join(appRoot, 'index.html');
if (!existsSync(indexHtml)) {
  problems.push('index.html 缺失 —— uni-app x web 端编译需要它（HBuilderX 运行到 web）');
} else {
  const indexCode = readFileSync(indexHtml, 'utf8');
  if (!indexCode.includes('src="/main"')) {
    problems.push('index.html 缺少 `<script type="module" src="/main">` 入口（官方模板形态）');
  }
  if (indexCode.includes('src="/src/main')) {
    problems.push('index.html 引用 CLI 工程入口 /src/main —— 应为 HBuilderX 根目录形态 /main');
  }
}

/* 2. pages.json 页面实体 */
const pagesJson = JSON.parse(readFileSync(join(appRoot, 'pages.json'), 'utf8'));
if (!pagesJson.easycom?.custom?.['^sn-(.*)']) {
  problems.push('pages.json 缺少 easycom → @snui/uni-x 配置');
}
const pagePaths = [
  ...pagesJson.pages.map((p) => p.path),
  ...(pagesJson.subPackages ?? []).flatMap((sp) => sp.pages.map((p) => `${sp.root}/${p.path}`)),
];
for (const p of pagePaths) {
  notes.pages++;
  const file = join(appRoot, `${p}.uvue`);
  if (!existsSync(file)) problems.push(`页面缺 .uvue 实体: ${p}`);
}
for (const sp of pagesJson.subPackages ?? []) {
  if (!existsSync(join(appRoot, sp.root))) problems.push(`subPackage 根目录缺失: ${sp.root}`);
}

/* 3. sn-* 标签可解析：easycom 实体存在，或文件内有显式 .uvue 导入
 *    （配对子组件 sn-tabbar-item 等 easycom 正则覆盖不到，走显式导入）。 */
function toKebab(name) {
  return name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
const generatedDirs = ['pages', 'components', 'templates', 'state'].map((d) => join(appRoot, d));
// easycom tag 解析只对 demo 页面面（pages/components）负责：templates 树是
// 显式导入世界（局部 import + kebab→Pascal 归一），不适用 easycom 实体校验。
const tagScanDirs = ['pages', 'components'].map((d) => join(appRoot, d));
const unresolved = new Map();
for (const dir of tagScanDirs) {
  if (!existsSync(dir)) continue;
  walk(dir, (file) => {
    if (!file.endsWith('.uvue')) return;
    notes.uvue++;
    const code = readFileSync(file, 'utf8');
    const explicitImports = new Set(
      [...code.matchAll(/from\s+'(?:[^']+\/)?(sn-[a-z0-9-]+)\.uvue'/g)].map((m) => m[1]),
    );
    // 只扫模板段 —— script 里的泛型 `ref<SnIconCategory>` 会被误判成标签。
    const tpl = code.slice(code.indexOf('<template>'), code.lastIndexOf('</template>'));
    for (const m of tpl.matchAll(/<((?:sn-)[a-z0-9-]+|(?:Sn)[A-Za-z0-9]+)[\s/>]/g)) {
      const tag = toKebab(m[1]);
      notes.tags.add(tag);
      if (explicitImports.has(tag)) {
        notes.explicit++;
        continue;
      }
      const entity = join(uniXDist, 'components', tag, `${tag}.uvue`);
      if (!existsSync(entity)) {
        if (!unresolved.has(tag)) unresolved.set(tag, file);
      } else {
        notes.resolved++;
      }
    }
  });
}
for (const [tag, file] of [...unresolved.entries()].sort()) {
  problems.push(
    `<${tag}> 无法解析（easycom 实体缺失且无显式导入）—— 首见 ${relative(appRoot, file)}`,
  );
}

/* 4. 相对导入路径真实存在（.uvue / 本地 .ts） */
for (const dir of generatedDirs) {
  if (!existsSync(dir)) continue;
  walk(dir, (file) => {
    if (!/\.(uvue|ts)$/.test(file)) return;
    const code = readFileSync(file, 'utf8');
    for (const m of code.matchAll(/from\s+'(\.\.?\/[^']+)'/g)) {
      const spec = m[1];
      const base = resolve(dirname(file), spec);
      const found =
        existsSync(base) || existsSync(`${base}.ts`) || existsSync(join(base, 'index.ts'));
      if (!found) {
        problems.push(`相对导入无法解析: ${relative(appRoot, file)} → ${spec}`);
      }
    }
  });
}

/* 5. 与 uni-demo 的同步契约：首页分组 + pages.json 分组逐项对齐。
 *    home-data 的分组块是 `    key:`（4 空格缩进，组件 comp 是 8 空格），
 *    以此区分分组条目与组件条目；顺序也参与比较——首页 chips 按该顺序渲染。
 *    生成器历史上两种引号形态并存：单引号字面量（旧产物）与
 *    JSON.stringify 双引号（现产物），分组键/标签不含引号字符，两种都收。 */
const uniDemoRoot = resolve(appRoot, '../uni-demo');
const homeGroupRe =
  /^ {4}(?:key|"key"): (?:'([a-z0-9-]+)'|"([a-z0-9-]+)"),\n {4}(?:label|"label"): (?:'([^']*)'|"([^"]*)"),\n {4}(?:labelEn|"labelEn"): (?:'([^']*)'|"([^"]*)"),/gm;
function homeGroupsOf(file) {
  const source = readFileSync(file, 'utf8');
  return [...source.matchAll(homeGroupRe)].map(
    (m) => `${m[1] ?? m[2]}|${m[3] ?? m[4]}|${m[5] ?? m[6]}`,
  );
}
const sourceHomeGroups = homeGroupsOf(join(uniDemoRoot, 'src/pages/index/home-data.ts'));
const targetHomeGroups = homeGroupsOf(join(appRoot, 'pages/index/home-data.ts'));
notes.groups = targetHomeGroups.length;
if (sourceHomeGroups.length === 0) {
  problems.push('uni-demo home-data.ts 解析不到分组 —— 解析器与生成格式脱节，需同步更新');
} else if (sourceHomeGroups.join('\n') !== targetHomeGroups.join('\n')) {
  const sourceOnly = sourceHomeGroups.filter((g) => !targetHomeGroups.includes(g));
  const targetOnly = targetHomeGroups.filter((g) => !sourceHomeGroups.includes(g));
  problems.push(
    'home-data 分组与 uni-demo 不一致 —— 先重跑 `pnpm -F @snui/uni-demo-x gen`；' +
      `仅 uni-demo 有: [${sourceOnly.join('; ')}] 仅 x 有: [${targetOnly.join('; ')}]`,
  );
}

function subpackageShape(pagesJson) {
  return (pagesJson.subPackages ?? []).map((sp) => ({
    root: sp.root,
    pages: sp.pages.map((p) => p.path).join(','),
  }));
}
const sourceShape = JSON.stringify(
  subpackageShape(JSON.parse(readFileSync(join(uniDemoRoot, 'src/pages.json'), 'utf8'))),
);
const targetShape = JSON.stringify(subpackageShape(pagesJson));
if (sourceShape !== targetShape) {
  const sourceRoots = JSON.parse(sourceShape).map((s) => s.root);
  const targetRoots = JSON.parse(targetShape).map((s) => s.root);
  const rootDiff =
    sourceRoots.filter((r) => !targetRoots.includes(r)).join(',') ||
    targetRoots.filter((r) => !sourceRoots.includes(r)).join(',');
  problems.push(
    `pages.json 分组与 uni-demo 不一致（root: ${rootDiff || '页面清单有差异'}）` +
      ' —— 先重跑 `pnpm -F @snui/uni-demo-x gen`',
  );
}

/* 6. 残留检查（生成树 + 根级 App.uvue —— web 编译对 .vue 导入严格解析） */
const residueFiles = [];
for (const dir of generatedDirs) {
  if (!existsSync(dir)) continue;
  walk(dir, (file) => residueFiles.push(file));
}
if (existsSync(join(appRoot, 'App.uvue'))) residueFiles.push(join(appRoot, 'App.uvue'));
for (const file of residueFiles) {
  const code = readFileSync(file, 'utf8');
  if (file.endsWith('.vue')) problems.push(`生成树残留 .vue: ${file}`);
  if (code.includes('@snui/uni-src')) problems.push(`@snui/uni-src 残留: ${file}`);
  if (code.includes('demo-bridge')) problems.push(`demo-bridge 残留: ${file}`);
  const vueImport = code.match(/from\s+'[^']*\.vue'/);
  if (vueImport) problems.push(`.vue 导入残留: ${relative(appRoot, file)}: ${vueImport[0]}`);
}

/* 7. 新鲜度契约（gen-x 源指纹）：每个生成产物头部携带
 *    `gen-x: source <repo-rel-path> sha256:<16hex>`，与当前源文件重算值
 *    必须一致 —— 源码改动后未重跑 gen-x（预览端跑旧产物、样式/token
 *    "改了没生效"）在这里直接失败，而不是让人对着旧构建排查。 */
const repoRoot = resolve(appRoot, '..', '..');
const stampRe = /(?:<!--|\/\/)\s*gen-x:\s*source\s+(\S+)\s+sha256:([0-9a-f]{16})/;
let stamped = 0;
for (const file of residueFiles) {
  const head = readFileSync(file, 'utf8').slice(0, 400);
  const match = stampRe.exec(head);
  if (match === null) {
    problems.push(
      `生成产物缺少源指纹: ${relative(appRoot, file)} —— 重跑 \`pnpm -F @snui/uni-demo-x gen\``,
    );
    continue;
  }
  stamped += 1;
  const [, srcRel, recorded] = match;
  const srcAbs = resolve(repoRoot, srcRel);
  if (!existsSync(srcAbs)) {
    problems.push(`生成产物 ${relative(appRoot, file)} 的源已不存在: ${srcRel}`);
    continue;
  }
  const current = createHash('sha256')
    .update(readFileSync(srcAbs, 'utf8'))
    .digest('hex')
    .slice(0, 16);
  if (current !== recorded) {
    problems.push(
      `生成产物过期: ${relative(appRoot, file)}（源 ${srcRel} 已改动）—— 重跑 \`pnpm -F @snui/uni-demo-x gen\``,
    );
  }
}

if (problems.length > 0) {
  console.error(`[check-x] FAIL — ${problems.length} 个问题:`);
  for (const p of problems) console.error(`  ✕ ${p}`);
  process.exit(1);
}
console.log(
  `[check-x] OK — ${notes.pages} pages / ${notes.uvue} .uvue / ` +
    `${notes.explicit}+${notes.resolved}/${notes.tags.size} tags resolved, ` +
    `${notes.groups} home groups in sync with uni-demo, ` +
    `${stamped}/${residueFiles.length} artifacts fresh ` +
    `(explicit import + easycom fallback, vapor manifest)`,
);
