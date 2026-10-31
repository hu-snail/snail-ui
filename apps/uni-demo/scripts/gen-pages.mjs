#!/usr/bin/env node
/**
 * gen-pages —— 由 src/demos/ 生成 uni-app 页面结构（生成物提交入库）。
 *
 * 产出：
 *   - src/pages.json                 首页 + 按组件分组的 subPackages
 *   - src/pages/index/home-data.ts   首页目录数据（含英文字段；首页页面本体
 *                                     index.vue 为手写代码，消费该数据）
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
import { GROUP_LABELS_EN, parseOverviewData, splitSubpackages, titleEnOf } from './subpackages.mjs';

const pagesDir = fileURLToPath(new URL('../src/pages/', import.meta.url));
const manifestOut = fileURLToPath(new URL('../src/demos-manifest.json', import.meta.url));

const COMP_RE = /^(.*?)-mp(?:-(.+))?$/;

/** 场景标题映射：高频场景给中文标题，其余回退为场景 key 本身。 */
const SCENARIO_LABELS = {
  basic: '基础用法',
  behavior: '行为',
  size: '尺寸',
  sizes: '尺寸',
  shape: '形状',
  state: '状态',
  states: '状态',
  status: '状态',
  group: '头像组',
  card3d: '3D 卡片',
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
  iconfont: '图标按钮',
  'icon-font': '字体图标',
  'icon-button': '图标按钮',
  gallery: '图标总览',
  string: '目录用法',
  iconify: 'Iconify 按需',
  disabled: '禁用',
  style: '样式',
  scroll: '滚动',
  cell: '单元格',
  layout: '布局',
  guard: '拦截',
  position: '位置',
  fan: '扇形展开',
  drag: '拖拽',
  label: '标签',
  export: '导出',
  text: '文本',
  placement: '弹出位置',
  badge: '徽标',
  header: '标题与描述',
  panels: '多列面板',
  sheet: '动作面板',
  fields: '字段',
  'form-type': '表单类型',
  fallback: '回退',
  threshold: '阈值',
  visibility: '可见性',
  hover: '悬停',
  'image-tap': '点图片关闭',
  lunar: '农历',
  card: '卡片',
  direction: '方向',
  theme: '主题',
  page: '整页演示',
  contacts: '通讯录',
  verify: '验证',
  popup: '弹窗',
  height: '高度',
  interaction: '交互',
  trigger: '触发',
  expand: '展开',
  connector: '连接线',
  node: '节点',
  swiper: '轮播联动',
  paging: '分页联动',
  prefix: '前缀',
  options: '选项',
  range: '日期范围',
  formatter: '自定义文案',
  nav: '导航按钮',
  'no-border': '无边框',
  radius: '圆角',
  'align-compact': '对齐与紧凑',
  'bordered-bg-radius': '边框与背景',
  'clear-focus': '清空与聚焦',
  'clearable-count': '清空与字数',
  'native-attrs': '原生属性',
  'password-toggle': '密码显隐',
  'prefix-suffix': '前后图标',
  runtime: '运行时属性',
  'word-limit': '字数统计',
};

/**
 * 组件级场景标题覆盖：key 为 `<comp>-<scenario>`。同一 scenario key 在不同
 * 组件下语义不同（input 的 states 是禁用/只读、status 是校验状态），全局
 * 映射表无法表达时在这里按组件消歧。
 */
const SCENARIO_LABEL_OVERRIDES = {
  'input-states': '禁用与只读',
  'input-status': '校验状态',
};

/**
 * 组件页画布底色覆盖：输入框页用纯白画布对比深浅组件底色（仅浅色主题，
 * 深色维持暗色画布）。空缺 = 默认中性灰。同步写入 pages.json 的
 * backgroundColor（滚动过界后的窗口底色）。
 */
const PAGE_BG_OVERRIDES = {
  input: '#ffffff',
};

/**
 * 组件内 demo 展示顺序：字母序会把「基础用法」夹在中间，列出的 demo 按
 * 值升序排（基础 → 变体 → 图标 → 状态 → 进阶属性），未列出的保持字母序。
 */
const DEMO_ORDER = {
  'input-mp-basic': 1,
  'input-mp-types': 2,
  'input-mp-sizes': 3,
  'input-mp-radius': 4,
  'input-mp-bordered-bg-radius': 5,
  'input-mp-prefix-suffix': 6,
  'input-mp-slots': 7,
  'input-mp-clearable-count': 8,
  'input-mp-clear-focus': 9,
  'input-mp-password-toggle': 10,
  'input-mp-word-limit': 11,
  'input-mp-status': 12,
  'input-mp-states': 13,
  'input-mp-align-compact': 14,
  'input-mp-native-attrs': 15,
  'input-mp-runtime': 16,
  'input-mp-custom-class': 17,
};

const SCENARIO_LABELS_EN = {
  basic: 'Basic usage',
  behavior: 'Behavior',
  size: 'Size',
  sizes: 'Sizes',
  shape: 'Shape',
  state: 'State',
  states: 'State',
  custom: 'Custom',
  'custom-class': 'Custom class',
  'custom-style': 'Custom style',
  variant: 'Variants',
  config: 'Configuration',
  slots: 'Slots',
  type: 'Type',
  types: 'Type',
  vertical: 'Vertical',
  color: 'Color',
  icon: 'Icon',
  icons: 'Icons',
  iconfont: 'Icon Button',
  'icon-font': 'Iconfont',
  'icon-button': 'Icon Button',
  gallery: 'Gallery',
  string: 'Catalog names',
  iconify: 'Iconify on demand',
  disabled: 'Disabled',
  style: 'Style',
  scroll: 'Scroll',
  cell: 'Cell',
  layout: 'Layout',
  guard: 'Guard',
  position: 'Position',
  label: 'Label',
  export: 'Export',
  text: 'Text',
  placement: 'Placement',
  badge: 'Badge',
  header: 'Title & description',
  panels: 'Panels',
  sheet: 'Action sheet',
  fields: 'Fields',
  'form-type': 'Form type',
  fallback: 'Fallback',
  threshold: 'Threshold',
  visibility: 'Visibility',
  hover: 'Hover',
  lunar: 'Lunar',
  card: 'Card',
  direction: 'Direction',
  theme: 'Theme',
  page: 'Full page',
  contacts: 'Contacts',
  verify: 'Verification',
  popup: 'Popup',
  height: 'Height',
  interaction: 'Interaction',
  trigger: 'Trigger',
  expand: 'Expand',
  connector: 'Connector',
  node: 'Node',
  swiper: 'Swiper sync',
  paging: 'Paging sync',
  prefix: 'Prefix',
  options: 'Options',
  range: 'Date range',
  formatter: 'Custom text',
  nav: 'Navigation',
  'no-border': 'No border',
  radius: 'Radius',
  'align-compact': 'Alignment & compact',
  'bordered-bg-radius': 'Border & background',
  'clear-focus': 'Clear & focus',
  'clearable-count': 'Clearable & count',
  'native-attrs': 'Native attributes',
  'password-toggle': 'Password toggle',
  'prefix-suffix': 'Prefix & suffix icons',
  runtime: 'Runtime attributes',
  'word-limit': 'Word limit',
};

const SCENARIO_LABEL_OVERRIDES_EN = {
  'input-states': 'Disabled & readonly',
  'input-status': 'Validation status',
};

function scenarioLabel(comp, scenario) {
  if (scenario === undefined || scenario === '') return SCENARIO_LABELS.basic;
  return SCENARIO_LABEL_OVERRIDES[`${comp}-${scenario}`] ?? SCENARIO_LABELS[scenario] ?? scenario;
}

/** 场景英文标题：映射表优先，未收录的 key 用 Title Case 兜底。 */
function scenarioLabelEn(comp, scenario) {
  if (scenario === undefined || scenario === '') return SCENARIO_LABELS_EN.basic;
  return (
    SCENARIO_LABEL_OVERRIDES_EN[`${comp}-${scenario}`] ??
    SCENARIO_LABELS_EN[scenario] ??
    titleEnOf(scenario)
  );
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
/** Demo 展示顺序：DEMO_ORDER 显式声明优先，未声明的回退字母序。 */
const demoRank = (name) => DEMO_ORDER[name] ?? Number.MAX_SAFE_INTEGER;
for (const list of byComp.values()) {
  list.sort((a, b) => demoRank(a.name) - demoRank(b.name) || a.name.localeCompare(b.name));
}
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
      style: {
        navigationBarTitleText: comp.title,
        ...(PAGE_BG_OVERRIDES[comp.key] ? { backgroundColor: PAGE_BG_OVERRIDES[comp.key] } : {}),
      },
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

// ── 生成首页数据（首页页面本体 src/pages/index/index.vue 为手写代码） ──────
const homeGroups = subpackages.map((sub) => ({
  key: sub.root,
  label: sub.label,
  labelEn: GROUP_LABELS_EN[sub.group] ?? sub.label,
  comps: sub.comps.map((comp) => ({
    key: comp.key,
    group: sub.root,
    title: comp.title,
    titleEn: titleEnOf(comp.key),
    desc: comp.desc,
    count: comp.demos.length,
  })),
}));
const homeDataTs = `// 由 scripts/gen-pages.mjs 生成，勿手改；demo 变更后重跑 \`pnpm gen:pages\`。
export interface DemoHomeComp {
  key: string
  group: string
  title: string
  titleEn: string
  desc: string
  count: number
}

export interface DemoHomeGroup {
  key: string
  label: string
  labelEn: string
  comps: DemoHomeComp[]
}

export const HOME_GROUPS: DemoHomeGroup[] = ${JSON.stringify(homeGroups, null, 2)}
`;
mkdirSync(`${pagesDir}index`, { recursive: true });
writeFileSync(`${pagesDir}index/home-data.ts`, homeDataTs);

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
    const imports = [
      ...comp.demos.map((demo, i) => `import Demo${i} from './demos/${demo.name}.vue'`),
      `import DemoModuleHead from '../../components/DemoModuleHead.vue'`,
      `import DemoPageShell from '../../components/DemoPageShell.vue'`,
      `import { useDemoUi } from '../../state/demo-ui';`,
    ].join('\n');
    const modules = comp.demos
      .map((demo, i) => {
        const badge = demo.scenario === '' ? '' : ` badge="${demo.scenario}"`;
        return `      <view class="module">
        <DemoModuleHead :title="t('${scenarioLabel(comp.key, demo.scenario)}', '${scenarioLabelEn(comp.key, demo.scenario)}')"${badge} :index="${i}" />
        <view class="module__body">
          <Demo${i} />
        </view>
      </view>`;
      })
      .join('\n');
    const vue = `<script setup lang="ts">
// 由 scripts/gen-pages.mjs 生成，勿手改 —— ${comp.key} 组件全部场景聚合页（静态展开）。
${imports}

// 场景标题双语（中/英切换见 DemoPageShell）。
const { t } = useDemoUi();
</script>

<template>
  <DemoPageShell :title-zh="'${comp.title}'" :title-en="'${titleEnOf(comp.key)}'" :bg="'${PAGE_BG_OVERRIDES[comp.key] ?? ''}'">
    <view class="page">
${modules}
    </view>
  </DemoPageShell>
</template>

<style scoped>
.page {
  padding: 24rpx 24rpx 48rpx;
}

/* 场景模块：白底圆角卡片（组件规范视觉稿：浅灰渐变画布上的浮起分区卡）。
 * 刻意不设 overflow / transform / backdrop-filter——它们会把 position: fixed
 * 的后代变成卡片坐标系，弹窗类 demo（calendar / popup / dialog …）会被困在
 * 卡片内裁切显示不全；层级感由描边 + 柔影承担。 */
.module {
  margin-bottom: 24rpx;
  padding: 32rpx;
  border-radius: 24rpx;
  background: var(--demo-card-bg);
  border: 1px solid var(--demo-card-border);
  box-shadow: var(--demo-card-shadow);
}

.module__body {
  padding: 0;
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
            title: scenarioLabel(comp.key, demo.scenario),
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
      `${pagesDir}index/home-data.ts`,
      `${pagesDir}/*/*.vue`,
    ],
    { stdio: 'inherit', shell: false },
  );
} catch {
  console.warn('[gen-pages] prettier 不可用，跳过格式化（不影响产物正确性）');
}
