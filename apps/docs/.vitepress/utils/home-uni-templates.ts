/**
 * 首页「uni-templates」版位注册表 —— 真实场景模板的引流卡片。
 *
 * 每个条目对应独立工程 `apps/uni-templates`（与 uni-demo 分离）里的一个
 * **真实场景模板页**，全部位于 `subpages` 分包：
 *   - H5：独立部署站 hash 路由（`uniTemplatesPageUrl(route)`），首页手机
 *     模拟器内以 iframe 实时加载 —— 打开 / 扫码即预览真实模板；
 *   - 微信小程序：同源发布，卡片悬停展示二维码（引流入口）。小程序码
 *     未接入微信 API 前先用 H5 链接生成（SnQrCode），发布后在
 *     SnHomeUniTemplate 里换成官方小程序码图片。
 *
 * `route` 必须与 apps/uni-templates/src/pages.json 的 subPackages 声明一致。
 */

export type UniTemplateLocale = 'zh' | 'en';

export interface UniTemplate {
  /** 模板标识（唯一，= subpages 下的文件名）。 */
  id: string;
  /** 分包页面路由（如 `subpages/login`）。 */
  route: string;
  /** 手机模拟器高度（px，瀑布流错落）。 */
  h: number;
}

/** 模板清单 —— 11 个真实场景模板页（apps/uni-templates/src/subpages）。 */
export const uniTemplates: UniTemplate[] = [
  { id: 'login', route: 'subpages/login', h: 540 },
  { id: 'mall', route: 'subpages/mall', h: 620 },
  { id: 'goods', route: 'subpages/goods', h: 620 },
  { id: 'order', route: 'subpages/order', h: 580 },
  { id: 'xhs', route: 'subpages/xhs', h: 600 },
  { id: 'news', route: 'subpages/news', h: 545 },
  { id: 'address', route: 'subpages/address', h: 480 },
  { id: 'article', route: 'subpages/article', h: 600 },
  { id: 'stats', route: 'subpages/stats', h: 570 },
  { id: 'contacts', route: 'subpages/contacts', h: 540 },
  { id: 'form', route: 'subpages/form', h: 585 },
];

type UniTplDict = Record<string, string>;

const zhDict: UniTplDict = {
  loginTitle: '登录页',
  loginDesc: '验证码登录 · 三方入口',
  mallTitle: '商城首页',
  mallDesc: '搜索 / 宫格 / 秒杀 / 底部导航',
  goodsTitle: '商品详情页',
  goodsDesc: '主图 / 规格 / 底部操作栏',
  orderTitle: '订单页',
  orderDesc: '状态分段 / 订单卡 / 去支付',
  xhsTitle: '图文社区',
  xhsDesc: '双列笔记流 · 点赞互动',
  newsTitle: '新闻首页',
  newsDesc: '频道分段 · 图文列表',
  addressTitle: '地址页',
  addressDesc: '地址卡 / 默认标签 / 新增',
  articleTitle: '新闻文章页',
  articleDesc: '作者行 / 正文 / 互动栏',
  statsTitle: '统计页',
  statsDesc: '指标卡 / 柱状图 / 来源分布',
  contactsTitle: '通讯录页',
  contactsDesc: '搜索 / 字母索引分组',
  formTitle: '步骤表单页',
  formDesc: '分步入驻 / 字段填写',
  scanHint: '微信扫码 · 预览真实模板',
  openH5: '打开 H5',
  badgeH5: 'H5 已发布',
  badgeMp: '微信小程序',
  iframeTitle: 'uni-app 模板实时预览',
};

const enDict: UniTplDict = {
  loginTitle: 'Login',
  loginDesc: 'SMS code login · social entries',
  mallTitle: 'Mall Home',
  mallDesc: 'Search / grid / flash sale / tabbar',
  goodsTitle: 'Product Detail',
  goodsDesc: 'Hero / specs / bottom action bar',
  orderTitle: 'Orders',
  orderDesc: 'Status tabs / order cards / pay',
  xhsTitle: 'Feed Home',
  xhsDesc: 'Two-column notes · likes',
  newsTitle: 'News Home',
  newsDesc: 'Channels · media list',
  addressTitle: 'Addresses',
  addressDesc: 'Address cards / default tag',
  articleTitle: 'Article',
  articleDesc: 'Author row / body / engagement',
  statsTitle: 'Statistics',
  statsDesc: 'Metric cards / bars / sources',
  contactsTitle: 'Contacts',
  contactsDesc: 'Search / letter-index groups',
  formTitle: 'Step Form',
  formDesc: 'Stepped onboarding / fields',
  scanHint: 'Scan with WeChat · preview the real template',
  openH5: 'Open H5',
  badgeH5: 'H5 live',
  badgeMp: 'WeChat Mini Program',
  iframeTitle: 'uni-app template live preview',
};

const dicts: Record<UniTemplateLocale, UniTplDict> = { zh: zhDict, en: enDict };

/** 按语言取 uni-templates 字典。 */
export function uniTemplateCopy(locale: UniTemplateLocale): UniTplDict {
  return dicts[locale];
}

/** 模板卡标题（`${id}Title`）。 */
export function uniTemplateTitle(id: string, locale: UniTemplateLocale): string {
  return dicts[locale][`${id}Title`] ?? id;
}

/** 模板卡描述（`${id}Desc`）。 */
export function uniTemplateDesc(id: string, locale: UniTemplateLocale): string {
  return dicts[locale][`${id}Desc`] ?? '';
}
