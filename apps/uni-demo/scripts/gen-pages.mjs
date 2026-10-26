#!/usr/bin/env node
/**
 * gen-pages —— 由 src/demos/ 生成 uni-app 页面结构（生成物提交入库）。
 *
 * 产出：
 *   - src/pages.json                 首页 + 按组件分组的 subPackages
 *   - src/pages/index/index.vue      首页：组件目录（静态数据渲染，无动态组件）
 *   - src/pages/<group>/<comp>.vue   组件聚合页：静态展开该组件全部场景
 *   - src/demos-manifest.json        目录清单（docs 消费：分组 / 标题 / 英文影子）
 *
 * demo 源物理位于 src/pages/<group>/demos/（fork-demos.mjs 迁入），MP 组件
 * chunk 随文件位置归入对应 subPackage。
 *
 * 设计约束（ADR-0005）：
 *   - 生成而非手写：demo 变更后重跑 `pnpm gen:pages`
 *   - 静态展开每个 demo（<DemoN />），不用 component :is —— MP 编译器对动态
 *     组件支持不全
 *   - 微信小程序主包限 2MB：组件页按 docs 总览分组拆 subPackage，主包只留
 *     首页；分组与标题以 docs 的 overview-data.ts 为单源（正则抽取，避免在
 *     node 侧引入 TS 运行时）
 *   - 场景标题从 demo 文件名单源派生，并通过 demos-manifest.json 与 docs 共享
 */
import { execFileSync } from 'node:child_process';
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { GROUP_LABELS, parseOverviewData, splitSubpackages } from './subpackages.mjs';

const pagesDir = fileURLToPath(new URL('../src/pages/', import.meta.url));
const manifestOut = fileURLToPath(new URL('../src/demos-manifest.json', import.meta.url));

const COMP_RE = /^(.*?)-mp(?:-(.+))?$/;

/** 场景标题映射：高频场景给中文标题，其余回退为场景 key 本身。 */
const SCENARIO_LABELS = {
  basic: '基础用法',
  behavior: '行为',
  size: '尺寸',
  shape: '形状',
  state: '状态',
  states: '状态',
  custom: '自定义',
  'custom-class': '自定义类名',
  'custom-style': '自定义样式',
  variant: '变体',
  config: '配置',
  slots: '插槽',
  type: '类型',
  types: '类型',
  vertical: '垂直模式',
  color: '颜色',
  icon: '图标',
  icons: '图标',
  iconfont: '字体图标',
  'icon-font': '字体图标',
  disabled: '禁用',
  style: '样式',
  scroll: '滚动',
  cell: '单元格',
  layout: '布局',
  guard: '拦截',
  position: '位置',
  label: '标签',
  export: '导出',
  text: '文本',
  placement: '弹出位置',
  badge: '徽标',
  panels: '多列面板',
  sheet: '动作面板',
  fields: '字段',
  'form-type': '表单类型',
  fallback: '回退',
  threshold: '阈值',
  visibility: '可见性',
  hover: '悬停',
};

function scenarioLabel(scenario) {
  if (scenario === undefined || scenario === '') return SCENARIO_LABELS.basic;
  return SCENARIO_LABELS[scenario] ?? scenario;
}

// ── 扫描 demo 源（src/pages/<group>/demos/） ────────────────────────────────
/** @type {Map<string, Array<{name: string, scenario: string, hasEn: boolean}>>} */
const byComp = new Map();
const enNames = new Set();
const demoFiles = [];
const groupDirs = readdirSync(pagesDir).filter(
  (d) => !d.startsWith('.') && !d.startsWith('._') && d !== 'index' && d !== 'index.html',
);
for (const group of groupDirs) {
  const demosDir = `${pagesDir}${group}/demos`;
  let files = [];
  try {
    files = readdirSync(demosDir);
  } catch {
    continue;
  }
  for (const file of files) {
    if (!file.endsWith('.vue') || file.startsWith('._')) continue;
    demoFiles.push({ group, file });
  }
}
for (const { file } of demoFiles) {
  if (file.endsWith('.en.vue')) {
    enNames.add(file.slice(0, -'.en.vue'.length));
  }
}
for (const { file } of demoFiles) {
  if (file.endsWith('.en.vue')) continue;
  const name = file.slice(0, -'.vue'.length);
  const m = name.match(COMP_RE);
  if (m === null) continue;
  const comp = m[1];
  const scenario = m[2] ?? '';
  if (!byComp.has(comp)) byComp.set(comp, []);
  byComp.get(comp).push({ name, scenario, hasEn: enNames.has(name) });
}
for (const list of byComp.values()) {
  list.sort((a, b) => a.name.localeCompare(b.name));
}

// ── 组件分组与元数据（分组/切分单源见 scripts/subpackages.mjs） ─────────────
const { comps: compMeta, groupOrder } = parseOverviewData();
const groups = new Map();
for (const comp of [...byComp.keys()].sort()) {
  const meta = compMeta.get(comp) ?? { title: comp, desc: '', group: 'more' };
  if (!groups.has(meta.group)) groups.set(meta.group, []);
  groups.get(meta.group).push({ key: comp, ...meta, demos: byComp.get(comp) });
}
const subpackages = splitSubpackages(groups, groupOrder);

// ── 生成 pages.json ────────────────────────────────────────────────────────
const pagesJson = {
  pages: [
    {
      path: 'pages/index/index',
      style: { navigationBarTitleText: 'snui 组件演示' },
    },
  ],
  subPackages: subpackages.map((sub) => ({
    root: `pages/${sub.root}`,
    pages: sub.comps.map((comp) => ({
      path: comp.key,
      style: { navigationBarTitleText: comp.title },
    })),
  })),
  globalStyle: {
    navigationBarTextStyle: 'black',
    navigationBarTitleText: 'snui',
    navigationBarBackgroundColor: '#FFFFFF',
    backgroundColor: '#F7F7F7',
  },
};
writeFileSync(`${pagesDir}../pages.json`, `${JSON.stringify(pagesJson, null, 2)}\n`);

// ── 生成首页 ───────────────────────────────────────────────────────────────
const homeGroups = subpackages.map((sub) => ({
  key: sub.root,
  label: sub.label,
  comps: sub.comps.map((comp) => ({
    key: comp.key,
    group: sub.root,
    title: comp.title,
    desc: comp.desc,
    count: comp.demos.length,
  })),
}));
const homeVue = `<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改；demo 变更后重跑 \`pnpm gen:pages\`。
interface CompItem {
  key: string
  group: string
  title: string
  desc: string
  count: number
}

interface GroupItem {
  key: string
  label: string
  comps: CompItem[]
}

const groups: GroupItem[] = ${JSON.stringify(homeGroups, null, 2)}

function open(comp: CompItem): void {
  uni.navigateTo({ url: \`/pages/\${comp.group}/\${comp.key}\` })
}
</script>

<template>
  <view class="home">
    <view v-for="group in groups" :key="group.key" class="home__group">
      <view class="home__group-title">{{ group.label }}</view>
      <view
        v-for="comp in group.comps"
        :key="comp.key"
        class="home__card"
        @tap="open(comp)"
      >
        <view class="home__card-head">
          <text class="home__title">{{ comp.title }}</text>
          <text class="home__count">{{ comp.count }} 个场景</text>
        </view>
        <text class="home__desc">{{ comp.desc }}</text>
      </view>
    </view>
    <view class="home__foot">
      <text class="home__foot-text">snui · uni-app 端组件演示</text>
    </view>
  </view>
</template>

<style scoped>
.home {
  padding: 24rpx;
}

.home__group {
  margin-bottom: 32rpx;
}

.home__group-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f1f1f;
  padding: 8rpx 8rpx 16rpx;
}

.home__card {
  background-color: #ffffff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
}

.home__card-head {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8rpx;
}

.home__title {
  font-size: 30rpx;
  font-weight: 600;
  color: #1f1f1f;
}

.home__count {
  font-size: 22rpx;
  color: #999999;
}

.home__desc {
  font-size: 24rpx;
  color: #666666;
  line-height: 1.6;
}

.home__foot {
  padding: 40rpx 0;
  display: flex;
  justify-content: center;
}

.home__foot-text {
  font-size: 22rpx;
  color: #bbbbbb;
}
</style>
`;
mkdirSync(`${pagesDir}index`, { recursive: true });
writeFileSync(`${pagesDir}index/index.vue`, homeVue);

// ── 生成组件聚合页 ─────────────────────────────────────────────────────────
// 只清理聚合页 .vue 文件，保留 demos/（demo 源由 fork-demos.mjs 管理，
// 组件 chunk 依赖 demos 与聚合页同处一个 subPackage 目录）。
for (const sub of subpackages) {
  mkdirSync(`${pagesDir}${sub.root}`, { recursive: true });
  for (const f of readdirSync(`${pagesDir}${sub.root}`)) {
    if (f.endsWith('.vue') && !f.startsWith('._')) {
      rmSync(`${pagesDir}${sub.root}/${f}`);
    }
  }
  for (const comp of sub.comps) {
    const imports = comp.demos
      .map((demo, i) => `import Demo${i} from './demos/${demo.name}.vue'`)
      .join('\n');
    const modules = comp.demos
      .map(
        (demo, i) => `    <view class="module">
      <view class="module__head">
        <text class="module__title">${scenarioLabel(demo.scenario)}</text>
      </view>
      <view class="module__body">
        <Demo${i} />
      </view>
    </view>`,
      )
      .join('\n');
    const vue = `<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— ${comp.key} 组件全部场景聚合页（静态展开）。
${imports}
</script>

<template>
  <view class="page">
${modules}
  </view>
</template>

<style scoped>
.page {
  padding: 24rpx;
}

.module {
  background-color: #ffffff;
  border-radius: 16rpx;
  margin-bottom: 24rpx;
  overflow: hidden;
}

.module__head {
  padding: 24rpx 24rpx 0;
}

.module__title {
  font-size: 28rpx;
  font-weight: 600;
  color: #1f1f1f;
}

.module__body {
  padding: 24rpx;
}
</style>
`;
    writeFileSync(`${pagesDir}${sub.root}/${comp.key}.vue`, vue);
  }
}
const manifest = {
  note: '由 apps/uni-demo/scripts/gen-pages.mjs 生成，勿手改',
  components: Object.fromEntries(
    subpackages.flatMap((sub) =>
      sub.comps.map((comp) => [
        comp.key,
        {
          group: sub.root,
          title: comp.title,
          desc: comp.desc,
          page: `pages/${sub.root}/${comp.key}`,
          demos: comp.demos.map((demo) => ({
            name: demo.name,
            title: scenarioLabel(demo.scenario),
            hasEn: demo.hasEn,
          })),
        },
      ]),
    ),
  ),
};
writeFileSync(manifestOut, `${JSON.stringify(manifest, null, 2)}\n`);

const totalDemos = [...byComp.values()].reduce((sum, list) => sum + list.length, 0);
console.log(
  `[gen-pages] comps: ${byComp.size}, demos: ${totalDemos}, subpackages: ${subpackages.map((s) => s.root).join(', ')}`,
);

// 生成物统一 prettier（幂等）：聚合页 / 首页 / pages.json / manifest。
// demos/ 不在范围内（fork 源保持与 docs 原文件一致的风格演进）。
try {
  execFileSync(
    'pnpm',
    [
      'exec',
      'prettier',
      '--write',
      '--log-level',
      'silent',
      manifestOut,
      `${pagesDir}../pages.json`,
      `${pagesDir}index/index.vue`,
      `${pagesDir}/*/*.vue`,
    ],
    { stdio: 'inherit', shell: false },
  );
} catch {
  console.warn('[gen-pages] prettier 不可用，跳过格式化（不影响产物正确性）');
}
