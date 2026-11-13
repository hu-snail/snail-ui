/**
 * gen-x —— 从 apps/uni-demo 场景源生成 apps/uni-demo-x（uni-app x 蒸汽模式
 * HBuilderX 工程）。ADR-0004 单源码双产物在 demo 层的落法：
 *
 *   apps/uni-demo/src/**        （唯一场景事实源，.vue + TS）
 *   packages/templates/src/**   （场景引用的模板组件，如 sn-ai-chat）
 *        ↓  本脚本：@snui/uni-x 转换管线 + demo 专属 import 重写
 *   apps/uni-demo-x/{pages,components,state,templates}/**  （.uvue + TS，可重复生成）
 *
 * 组件消费走显式 .uvue 导入（局部绑定 + 场景源 PascalCase 标签，uvue 编译器
 * 原生路径；easycom 正则匹配不了 PascalCase 标签，web 编译实测 resolve 失败，
 * pages.json 的 easycom 配置仅作 kebab 标签兜底）。工具/类型/图标集导入
 * 重映射到 @snui/uni-x 显式路径。手写文件只有 manifest.json /
 * main.uts / package.json / README.md / 本脚本。
 *
 * 运行：pnpm -F @snui/uni-demo-x gen（需先 pnpm -F @snui/uni-x build）。
 */

import {
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformVueToUvue } from '../../../packages/uni-x/src/transform/index.ts';

const here = dirname(fileURLToPath(import.meta.url));
const appRoot = resolve(here, '..');
const srcRoot = resolve(appRoot, '../uni-demo/src');
const templatesRoot = resolve(appRoot, '../../packages/templates/src');
const uniXDist = resolve(appRoot, '../../packages/uni-x/dist');
const outRoot = appRoot;

/** uni-app x 组合式 API 自动导入名单（uvue 无需 import from 'vue'）。 */
const VUE_AUTO_IMPORTS = new Set([
  'ref',
  'shallowRef',
  'reactive',
  'computed',
  'watch',
  'watchEffect',
  'watchSyncEffect',
  'nextTick',
  'onMounted',
  'onUnmounted',
  'onBeforeMount',
  'onBeforeUnmount',
  'onBeforeUpdate',
  'onUpdated',
  'onActivated',
  'onDeactivated',
  'onErrorCaptured',
  'provide',
  'inject',
]);

/** 生成统计（写进 GEN-REPORT.md）。 */
const stats = {
  uvue: 0,
  ts: 0,
  uniXRemapped: 0,
  typeImportsRemapped: 0,
  templatesMapped: 0,
  vueImportStrips: [],
  appSpecific: [],
  issues: [],
};

function relFromOut(file) {
  return relative(outRoot, file);
}

/**
 * 重写 import 区（.uvue 与 .ts 共用）。outDir 是产物的目标目录，
 * 用于把 `@snui/templates-src/<spec>` 换算成模板产物的相对路径。
 */
function rewriteImports(code, fromFile, outDir) {
  // 0. 组合导入（default + 纯 type 绑定，如 `import SnIcon, { type IconData } from
  //    .../sn-icon.vue`）拆成两条源形态行 —— 值部分交给规则 1（显式 .uvue 导入），
  //    类型部分交给规则 2（types 实体重映射）。花括号里出现
  //    非 type 绑定时 fail loud：uni-x 端组件文件没有值命名导出。
  code = code.replace(
    /^import\s+(\w+)\s*,\s*\{([^}]*)\}\s*from\s+'(@snui\/(?:uni-src|uni)\/components\/sn-[a-z0-9-]+\/sn-[a-z0-9-]+)\.vue';\s*\n/gm,
    (line, name, bindings, spec) => {
      const parts = bindings.split(',').map((n) => n.trim()).filter(Boolean);
      const nonType = parts.filter((n) => !n.startsWith('type '));
      if (nonType.length > 0) {
        throw new Error(
          `[gen-x] ${relFromOut(fromFile)}: 组合导入含非 type 绑定（${nonType.join(', ')}）—— ` +
            `uni-x 端 .uvue 组件无值命名导出，请在场景源拆分该导入`,
        );
      }
      return (
        `import ${name} from '${spec}.vue';\n` +
        `import type { ${parts.map((n) => n.replace(/^type\s+/, '')).join(', ')} } from '${spec}.vue';\n`
      );
    },
  );
  // 1. sn-* 组件导入 → 显式 .uvue 导入（局部绑定 + PascalCase 标签是 uvue
  //    编译器原生路径）。不能删除走 easycom：场景标签是 PascalCase，easycom
  //    正则 ^sn- 大小写敏感匹配不到（uni-demo-x web 编译实测 resolve 失败）。
  code = code.replace(
    /^import\s+(\w+)\s+from\s+'@snui\/(?:uni-src|uni)\/components\/(sn-[a-z0-9-]+)\/(sn-[a-z0-9-]+)\.vue';\s*\n/gm,
    (line, name, dir, file) => {
      stats.uniXRemapped++;
      return `import ${name} from '@snui/uni-x/components/${dir}/${file}.uvue';\n`;
    },
  );
  // 2. 从 .vue 导入的类型 → <comp>-types 纯 ts 实体（uni-x 端无 .vue 实体可挂
  //    类型；实体清单由 uni 源码侧保证：sn-icon / sn-fab / sn-dialer / sn-lucky）。
  code = code.replace(
    /^(import\s+type\s*\{[^}]*\}\s*from\s*)'@snui\/(?:uni-src|uni)\/components\/(sn-[a-z0-9-]+)\/sn-[a-z0-9-]+\.vue';\s*\n?/gm,
    (line, head, comp) => {
      const typesEntity = join(uniXDist, 'components', comp, `${comp}-types.ts`);
      if (!existsSync(typesEntity)) {
        throw new Error(
          `[gen-x] ${relFromOut(fromFile)}: 从 ${comp}.vue 导入类型，但 dist 缺少 ` +
            `${comp}-types.ts 实体 —— 请把该类型契约拆到纯 ts 模块（sn-icon-types 模式）`,
        );
      }
      stats.typeImportsRemapped++;
      return `${head}'@snui/uni-x/components/${comp}/${comp}-types';\n`;
    },
  );
  // 3. 场景引用的模板组件 → 本工程 templates/ 产物（相对路径换算）。
  code = code.replace(
    /from\s*'@snui\/templates-src\/([^']+)'/g,
    (line, spec) => {
      const outPath = templateOutPath(spec);
      stats.templatesMapped++;
      const relSpec = relative(outDir, outPath).replace(/\\/g, '/');
      return `from '${relSpec.startsWith('.') ? relSpec : `./${relSpec}`}'`;
    },
  );
  // 4. 其余 @snui/uni-src → @snui/uni-x（组件协同 ts / utils）。
  code = code.replaceAll('@snui/uni-src/', '@snui/uni-x/');
  // 5. demo 相对导入的 .vue → .uvue（聚合页 → 场景、场景 → 场景）。
  code = code.replace(/(from\s+'(?:\.\.?\/[^']*)?)\.vue'/g, "$1.uvue'");
  // 6. `import { x } from 'vue'`：剥离 uvue 自动导入名单内的名字，
  //    全部可剥离时整行删除。
  code = code.replace(/^import\s*\{([^}]*)\}\s*from\s*'vue';\s*\n/gm, (line, names) => {
    const parts = names.split(',').map((n) => n.trim()).filter(Boolean);
    const kept = parts.filter((n) => !VUE_AUTO_IMPORTS.has(n.replace(/^type\s+/, '')));
    for (const dropped of parts.filter((n) => VUE_AUTO_IMPORTS.has(n.replace(/^type\s+/, '')))) {
      stats.vueImportStrips.push(`${relFromOut(fromFile)}: ${dropped}`);
    }
    if (kept.length === 0) return '';
    return `import { ${kept.join(', ')} } from 'vue';\n`;
  });
  return code;
}

/** `@snui/templates-src/<spec>` 在本工程产物树里的落点。 */
function templateOutPath(spec) {
  if (spec.endsWith('.vue')) return join(outRoot, 'templates', spec.replace(/\.vue$/, '.uvue'));
  return join(outRoot, 'templates', `${spec}.ts`);
}

/** 转换单个 .vue 源文件为 .uvue 文本（uni-x 管线 + demo 重写）。 */
function toUvue(srcPath, outDir, issueTag) {
  const source = readFileSync(srcPath, 'utf8');
  const result = transformVueToUvue(source, `${issueTag}.uvue`);
  for (const issue of result.issues) {
    stats.issues.push(`${issueTag}: [${issue.kind}] ${issue.detail}`);
  }
  return rewriteImports(result.code, srcPath, outDir);
}

/** 转换纯 TS（demo-ui / home-data / templates shared 等）。 */
function toTs(srcPath, outDir) {
  return rewriteImports(readFileSync(srcPath, 'utf8'), srcPath, outDir);
}

function writeFileEnsured(outPath, content) {
  mkdirSync(dirname(outPath), { recursive: true });
  writeFileSync(outPath, content);
}

/** 递归收集目录内全部 .vue / .ts（跳过测试、AppleDouble 与排除名单）。 */
function collect(dir, excluded = []) {
  const found = [];
  if (!existsSync(dir)) return found;
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('._')) continue;
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (excluded.some((e) => full.startsWith(e))) continue;
      found.push(...collect(full, excluded));
    } else if (/\.(vue|ts)$/.test(entry.name) && !/\.test\.ts$/.test(entry.name)) {
      if (excluded.includes(full)) continue;
      found.push(full);
    }
  }
  return found;
}

function emitPagesJson() {
  const source = JSON.parse(readFileSync(join(srcRoot, 'pages.json'), 'utf8'));
  const out = {
    easycom: {
      autoscan: false,
      custom: {
        '^sn-(.*)': '@snui/uni-x/components/sn-$1/sn-$1.uvue',
      },
    },
    ...source,
  };
  writeFileSync(join(outRoot, 'pages.json'), `${JSON.stringify(out, null, 2)}\n`);
}

/** App.vue → App.uvue：生命周期去掉 @dcloudio 导入、主题 css 移入 style、
 *  docs iframe 桥剔除（那是 uni-demo 的职责，见 ADR-0005）。 */
function emitApp() {
  const src = join(srcRoot, 'App.vue');
  let code = readFileSync(src, 'utf8')
    .replace(/^import\s*\{[^}]*\}\s*from\s*'@dcloudio\/uni-app';\s*\n/m, () => {
      stats.appSpecific.push('App: @dcloudio/uni-app lifecycle import dropped (uvue auto-imports)');
      return '';
    })
    .replace(/^import\s+'@snui\/uni\/styles';\s*\n/m, () => {
      stats.appSpecific.push("App: '@snui/uni/styles' script import moved into <style> as @snui/uni-x/theme");
      return '';
    })
    .replace(/^import\s*\{\s*initDemoBridge\s*\}\s*from\s*'\.\/state\/demo-bridge';\s*\n/m, () => {
      stats.appSpecific.push('App: demo-bridge import dropped (docs-iframe only, ADR-0005)');
      return '';
    })
    .replace(/\n\/\/ #ifdef H5\n\/\/ 宿主（docs iframe）桥[^\n]*\ninitDemoBridge\(\);\n\/\/ #endif\n/g, '\n')
    .replace(/^<style>/m, "<style>\n/* 主题变量层（uni-app x App 端无 :root，变量挂在 .sn-theme-root ——\n   DemoPageShell 根节点携带该 class；本块由 gen-x.mjs 生成，勿手改）。 */\n@import '@snui/uni-x/theme/index.css';");
  code = `<!-- 由 scripts/gen-x.mjs 从 apps/uni-demo/src/App.vue 生成，勿手改。 -->\n${code}`;
  code = rewriteImports(code, src, outRoot);
  writeFileSync(join(outRoot, 'App.uvue'), code);
  stats.uvue++;
}

/** DemoPageShell 根节点补 sn-theme-root（主题变量挂载点，见 App.uvue 注释）。 */
function emitShell(srcPath, outPath) {
  let code = toUvue(srcPath, dirname(outPath), relative(srcRoot, srcPath));
  code = code.replace('class="demo-shell"', 'class="sn-theme-root demo-shell"');
  writeFileEnsured(outPath, code);
  stats.uvue++;
}

function emitReport() {
  const lines = [
    '# uni-demo-x GEN-REPORT',
    '',
    `> Generated by \`pnpm -F @snui/uni-demo-x gen\` from apps/uni-demo sources.`,
    '',
    '| 项 | 数量 |',
    '| --- | --- |',
    `| .uvue 产出 | ${stats.uvue} |`,
    `| .ts 产出 | ${stats.ts} |`,
    `| 组件/协同导入 → @snui/uni-x 显式路径 | ${stats.uniXRemapped} |`,
    `| 类型导入 → <comp>-types 实体 | ${stats.typeImportsRemapped} |`,
    `| 模板组件导入映射 | ${stats.templatesMapped} |`,
    '',
    '## App.uvue 专属改写',
    '',
    ...stats.appSpecific.map((n) => `- ${n}`),
    '',
  ];
  const strips = [...new Set(stats.vueImportStrips)];
  if (strips.length > 0) {
    lines.push('## vue 导入剥离（uvue 自动导入）', '', ...strips.map((n) => `- ${n}`), '');
  }
  if (stats.issues.length > 0) {
    lines.push(
      '## 管线转换问题（CSS 规则删除等，需真机验证视觉）',
      '',
      ...stats.issues.map((n) => `- ${n}`),
      '',
    );
  }
  writeFileSync(join(appRoot, 'GEN-REPORT.md'), `${lines.join('\n')}\n`);
}

/** ExFAT 卷的 macOS AppleDouble（`._*`）资源文件 —— 与 uni-demo 的
 *  clean-dist-junk.mjs 同款清理，避免污染 HBuilderX 工程树。 */
function cleanAppleDouble() {
  const walk = (dir) => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (entry.name.startsWith('._')) rmSync(full, { force: true });
    }
  };
  for (const dir of ['pages', 'components', 'state', 'templates']) walk(join(outRoot, dir));
}

function main() {
  if (!existsSync(join(resolve(appRoot, '../../packages/uni-x/dist'), 'components'))) {
    console.error('[gen-x] packages/uni-x/dist 不存在 —— 先运行 pnpm -F @snui/uni-x build');
    process.exit(1);
  }
  for (const dir of ['pages', 'components', 'state', 'templates']) {
    rmSync(join(outRoot, dir), { recursive: true, force: true });
  }
  rmSync(join(outRoot, 'App.uvue'), { force: true });
  rmSync(join(outRoot, 'pages.json'), { force: true });

  // 场景与聚合页：pages/**；共享壳与状态；排除 docs-iframe 桥。
  const bridgeFile = join(srcRoot, 'state/demo-bridge.ts');
  const shellFiles = new Set([
    join(srcRoot, 'components/DemoPageShell.vue'),
    join(srcRoot, 'components/DemoModuleHead.vue'),
  ]);
  for (const srcPath of collect(srcRoot, [bridgeFile])) {
    const isVue = srcPath.endsWith('.vue');
    const outPath = join(outRoot, relative(srcRoot, srcPath)).replace(/\.vue$/, '.uvue');
    if (shellFiles.has(srcPath)) {
      emitShell(srcPath, outPath);
      continue;
    }
    const code = isVue
      ? toUvue(srcPath, dirname(outPath), relative(srcRoot, srcPath))
      : toTs(srcPath, dirname(outPath));
    writeFileEnsured(outPath, code);
    if (isVue) stats.uvue++;
    else stats.ts++;
  }

  // 场景引用的模板组件：镜像 packages/templates/src 的 uni/ + shared/ 子树
  // （web/ 子树消费 @snui/vue-web 独有组件，对 uni-app x 工程不适用）。
  const templateSubtrees = ['uni', 'shared'].flatMap((sub) => collect(join(templatesRoot, sub)));
  for (const srcPath of templateSubtrees) {
    const relSpec = relative(templatesRoot, srcPath);
    const isVue = srcPath.endsWith('.vue');
    const outPath = join(outRoot, 'templates', relSpec.replace(/\.vue$/, '.uvue'));
    const code = isVue
      ? toUvue(srcPath, dirname(outPath), `templates/${relSpec}`)
      : toTs(srcPath, dirname(outPath));
    writeFileEnsured(outPath, code);
    if (isVue) stats.uvue++;
    else stats.ts++;
  }

  // 场景引用的本地素材：src/static/** 镜像到本工程根 static/（uni-app 静态
  // 目录约定）。collect 只扫 pages/components/state/templates，static 需要
  // 单独镜像；每次生成全量重建（rm + copy），AppleDouble 由 cleanAppleDouble
  // 兜底清理。
  const staticSrc = join(srcRoot, 'static');
  if (existsSync(staticSrc)) {
    rmSync(join(outRoot, 'static'), { recursive: true, force: true });
    mkdirSync(join(outRoot, 'static'), { recursive: true });
    let mirrored = 0;
    const walkStatic = (dir) => {
      for (const entry of readdirSync(dir, { withFileTypes: true })) {
        if (entry.name.startsWith('._')) continue;
        const full = join(dir, entry.name);
        if (entry.isDirectory()) walkStatic(full);
        else {
          const target = join(outRoot, 'static', relative(staticSrc, full));
          mkdirSync(dirname(target), { recursive: true });
          writeFileSync(target, readFileSync(full));
          mirrored++;
        }
      }
    };
    walkStatic(staticSrc);
    stats.appSpecific.push(`static: mirrored ${mirrored} asset(s) from apps/uni-demo/src/static`);
  }

  emitApp();
  emitPagesJson();
  emitReport();
  cleanAppleDouble();
  console.log(
    `[gen-x] ${stats.uvue} .uvue + ${stats.ts} .ts → apps/uni-demo-x` +
      ` (imports ${stats.uniXRemapped}, types ${stats.typeImportsRemapped}, templates ${stats.templatesMapped})`,
  );
  // 防跳步：组件消费的是 @snui/uni-x/dist 产物——改过 packages/uni 源码而
  // 未重建 dist 时，HBuilderX 编译拿到的仍是旧组件（demo 场景与 dist 脱节）。
  console.log(
    '[gen-x] hint: 若改过 @snui/uni 组件源码，请先 pnpm -F @snui/uni-x build 再用 HBuilderX 编译。',
  );
}

main();
