/**
 * check-x —— apps/uni-demo-x 结构校验（无需 HBuilderX 的最小验收面）：
 *
 * 1. manifest.json 为 uni-app x 蒸汽模式形态（`uni-app-x.vapor: true`）。
 * 2. pages.json 的每个页面（主包 + subPackage）都有对应 .uvue 文件。
 * 3. 生成树中每个 `<sn-*>` 标签都能被 easycom 正则解析到
 *    `@snui/uni-x/dist/components/…` 实体（组件产物已生成）。
 * 4. 无 `.vue` 页面残留、无 `@snui/uni-src` 引用、无 demo-bridge 引用。
 *
 * 运行：pnpm -F @snui/uni-demo-x check
 */

import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const uniXDist = resolve(appRoot, '../../packages/uni-x/dist');

const problems = [];
const notes = { pages: 0, uvue: 0, tags: new Set(), resolved: 0 };

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
const generatedDirs = ['pages', 'components'].map((d) => join(appRoot, d));
const unresolved = new Map();
for (const dir of generatedDirs) {
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
      if (explicitImports.has(tag)) continue;
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

/* 5. 残留检查 */
for (const dir of generatedDirs) {
  if (!existsSync(dir)) continue;
  walk(dir, (file) => {
    const code = readFileSync(file, 'utf8');
    if (file.endsWith('.vue')) problems.push(`生成树残留 .vue: ${file}`);
    if (code.includes('@snui/uni-src')) problems.push(`@snui/uni-src 残留: ${file}`);
    if (code.includes('demo-bridge')) problems.push(`demo-bridge 残留: ${file}`);
  });
}

if (problems.length > 0) {
  console.error(`[check-x] FAIL — ${problems.length} 个问题:`);
  for (const p of problems) console.error(`  ✕ ${p}`);
  process.exit(1);
}
console.log(
  `[check-x] OK — ${notes.pages} pages / ${notes.uvue} .uvue / ` +
    `${notes.resolved}/${notes.tags.size} easycom tags resolved (vapor manifest)`,
);
