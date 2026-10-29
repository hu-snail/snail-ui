/**
 * 模板商店数据源 —— 11 个真实场景模板（subpages 分包）的目录元信息。
 * 首页（index）按分类 / 关键词 / 排序消费并分页展示；收藏状态为模块级
 * 共享 ref，首页点赞与收藏页列表保持一致。
 */
import { ref } from 'vue';
import type { IconData } from '@snui/uni-src/components/sn-icon/sn-icon.vue';
import { Bell, Edit, Heart, Home, Menu, Plus, User } from '@snui/uni-src/components/sn-icon/sn-icon-set';
import { ChartColumnIcon, MapPinIcon, ShoppingBagIcon, SmartphoneIcon } from './icons';

export type TplCat = 'all' | 'login' | 'mall' | 'social' | 'tool';

export interface TplItem {
  /** 模板标识（= subpages 下文件名，路由 `/subpages/<id>`）。 */
  id: string;
  title: string;
  desc: string;
  cat: Exclude<TplCat, 'all'>;
  /** 封面左上角的来源工具角标（纯装饰）。 */
  tool: 'Figma' | 'Sketch' | 'XD' | 'ProtoPie';
  /** 封面右下角的类型角标。 */
  tag: string;
  downloads: number;
  /** 更新时间戳（天粒度），供「最新发布」排序。 */
  updated: number;
  author: string;
  initial: string;
  authorColor: string;
  from: string;
  to: string;
  icon: IconData;
}

export const TPL_CATEGORIES: { key: TplCat; label: string }[] = [
  { key: 'all', label: '全部' },
  { key: 'login', label: '登录页' },
  { key: 'mall', label: '商城' },
  { key: 'social', label: '社区资讯' },
  { key: 'tool', label: '工具效率' },
];

export const TPL_SORTS = [
  { key: 'recommend', label: '综合推荐' },
  { key: 'latest', label: '最新发布' },
  { key: 'downloads', label: '最多下载' },
] as const;

export type TplSortKey = (typeof TPL_SORTS)[number]['key'];

export const HOT_WORDS = ['登录页', '毛玻璃', '图文社区', '通讯录', '步骤表单'] as const;

const DAY = 86_400_000;
/** 2026-10-01 起的相对天，避免散落的大字面量。 */
const at = (day: number): number => Date.UTC(2026, 9, 1) + day * DAY;

export const TEMPLATES: TplItem[] = [
  { id: 'login', title: '双方式登录页', desc: '验证码 / 密码 · 斜切双 Tab', cat: 'login', tool: 'Figma', tag: 'iOS', downloads: 1800, updated: at(26), author: '蜗蜗工坊', initial: '蜗', authorColor: '#35a257', from: '#10b981', to: '#6ee7a0', icon: SmartphoneIcon },
  { id: 'mall', title: '商城首页', desc: '搜索 / 宫格 / 秒杀 / 底部导航', cat: 'mall', tool: 'Figma', tag: '电商', downloads: 2400, updated: at(22), author: '青柠UI', initial: '柠', authorColor: '#0ea5e9', from: '#0ea5e9', to: '#22d3ee', icon: Home },
  { id: 'goods', title: '商品详情页', desc: '主图 / 规格 / 底部操作栏', cat: 'mall', tool: 'Sketch', tag: '电商', downloads: 1600, updated: at(18), author: '像素组', initial: '像', authorColor: '#f97316', from: '#f97316', to: '#facc15', icon: ShoppingBagIcon },
  { id: 'order', title: '我的订单', desc: '状态分段 / 订单卡 / 去支付', cat: 'mall', tool: 'XD', tag: '交易', downloads: 1200, updated: at(15), author: '夜航船', initial: '夜', authorColor: '#8b5cf6', from: '#8b5cf6', to: '#6366f1', icon: Menu },
  { id: 'xhs', title: '图文社区', desc: '双列笔记流 / 点赞互动', cat: 'social', tool: 'Figma', tag: '内容', downloads: 3100, updated: at(25), author: '山雀', initial: '雀', authorColor: '#ec4899', from: '#ec4899', to: '#f43f5e', icon: Heart },
  { id: 'news', title: '新闻首页', desc: '频道分段 / 图文列表', cat: 'social', tool: 'Figma', tag: '资讯', downloads: 940, updated: at(12), author: '极简社', initial: '极', authorColor: '#14b8a6', from: '#14b8a6', to: '#22c55e', icon: Bell },
  { id: 'article', title: '文章详情', desc: '作者行 / 正文 / 互动栏', cat: 'social', tool: 'Sketch', tag: '资讯', downloads: 880, updated: at(9), author: '山雀', initial: '雀', authorColor: '#ec4899', from: '#334155', to: '#64748b', icon: Edit },
  { id: 'address', title: '地址管理', desc: '地址卡 / 默认标签 / 新增', cat: 'tool', tool: 'XD', tag: '效率', downloads: 1500, updated: at(8), author: '蜗蜗工坊', initial: '蜗', authorColor: '#35a257', from: '#64748b', to: '#94a3b8', icon: MapPinIcon },
  { id: 'stats', title: '数据统计', desc: '指标卡 / 柱状图 / 来源分布', cat: 'tool', tool: 'ProtoPie', tag: '效率', downloads: 1350, updated: at(6), author: '像素组', initial: '像', authorColor: '#f97316', from: '#7c3aed', to: '#c084fc', icon: ChartColumnIcon },
  { id: 'contacts', title: '通讯录', desc: '搜索 / 字母索引分组', cat: 'tool', tool: 'Figma', tag: '效率', downloads: 1050, updated: at(4), author: '夜航船', initial: '夜', authorColor: '#8b5cf6', from: '#2563eb', to: '#60a5fa', icon: User },
  { id: 'form', title: '创建店铺表单', desc: '分步入驻 / 字段校验', cat: 'tool', tool: 'ProtoPie', tag: '表单', downloads: 1220, updated: at(2), author: '青柠UI', initial: '柠', authorColor: '#0ea5e9', from: '#059669', to: '#34d399', icon: Plus },
];

/** 收藏状态 —— 首页点赞与收藏页共享（模块级 ref，应用生命周期内常驻）。 */
export const likedIds = ref<Record<string, boolean>>({});

export function formatDownloads(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(1)}k` : String(n);
}
