/**
 * 分组与 subPackage 切分 —— fork-demos.mjs 与 gen-pages.mjs 共享。
 *
 * 单源：docs 的 overview-data.ts（组件标题 / 简介 / 分组，正则抽取，避免在
 * node 侧引入 TS 运行时）。微信限制单个分包 ≤ 2MB，组件数过多的组按 key 序
 * 拆为多个 subPackage（root 为 `<group>` / `<group>-2` / …）。
 */
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const OVERVIEW_DATA_URL = new URL(
  '../../docs/.vitepress/utils/overview-data.ts',
  import.meta.url,
);

/** demo 文件名 → 组件 key + 场景段（`button-mp-basic` / `card-mp` 两种形态）。 */
export const COMP_RE = /^(.*?)-mp(?:-(.+))?$/;

/** 单个分包的组件数上限：form 组 23 个重组件实测 2.6MB，14 个/包留足余量。 */
export const SUBPACKAGE_MAX_COMPS = 14;

export const GROUP_LABELS = {
  basic: '基础组件',
  navigation: '导航组件',
  form: '录入组件',
  feedback: '反馈组件',
  display: '展示组件',
  business: '业务组件',
  more: '更多组件',
};

/**
 * 解析 docs overview-data.ts。
 *
 * @returns {{ comps: Map<string, {title: string, desc: string, group: string}>, groupOrder: string[] }}
 */
export function parseOverviewData() {
  const source = readFileSync(OVERVIEW_DATA_URL, 'utf8');
  const comps = new Map();
  const groupOrder = [];
  const groupRe = /key:\s*'([^']+)',\s*label:\s*'([^']+)',\s*items:\s*\[([\s\S]*?)\n\s*\],/g;
  let gm;
  while ((gm = groupRe.exec(source)) !== null) {
    groupOrder.push(gm[1]);
    GROUP_LABELS[gm[1]] ??= gm[2];
    const itemRe = /name:\s*'sn-([^']+)',\s*title:\s*'([^']+)',\s*desc:\s*'([^']*)'/g;
    let im;
    while ((im = itemRe.exec(gm[3])) !== null) {
      comps.set(im[1], { title: im[2], desc: im[3], group: gm[1] });
    }
  }
  return { comps, groupOrder };
}

/**
 * 把按组聚合的组件切分为 subPackage 列表。
 *
 * @param {Map<string, Array<unknown>>} compsByGroup 组 key → 组件列表（组内按
 *   key 序，切分结果才稳定）
 * @param {string[]} groupOrder docs 总览的组顺序，未收录的组排在其后
 * @returns {Array<{root: string, label: string, comps: Array<unknown>}>}
 */
export function splitSubpackages(compsByGroup, groupOrder) {
  const groupKeys = [
    ...groupOrder.filter((k) => compsByGroup.has(k)),
    ...[...compsByGroup.keys()].filter((k) => !groupOrder.includes(k)),
  ];
  const subpackages = [];
  for (const group of groupKeys) {
    const comps = compsByGroup.get(group);
    const chunkCount = Math.ceil(comps.length / SUBPACKAGE_MAX_COMPS);
    const size = Math.ceil(comps.length / chunkCount);
    let ordinal = 0;
    for (let i = 0; i < comps.length; i += size) {
      ordinal += 1;
      subpackages.push({
        root: ordinal === 1 ? group : `${group}-${ordinal}`,
        label: GROUP_LABELS[group] ?? group,
        comps: comps.slice(i, i + size),
      });
    }
  }
  return subpackages;
}

/** 组件 key → subPackage root 映射（fork-demos 决定 demo 源物理位置用）。 */
export function subrootMap(subpackages) {
  const map = new Map();
  for (const sub of subpackages) {
    for (const comp of sub.comps) {
      map.set(comp.key, sub.root);
    }
  }
  return map;
}
