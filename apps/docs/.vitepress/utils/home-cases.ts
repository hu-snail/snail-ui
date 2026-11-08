/**
 * 首页「场景案例」展示区（SnDocsHome）的版位注册表 —— 纯数据，无渲染。
 *
 * 设计语义（区别于「组件总览」）：每张卡片是一个真实业务/组件组合的迷你
 * 场景（表单 / 列表 / 图表 / 对话 / 二维码 / 表格 / 日历……），由真实
 * @snui/vue-web 组件拼装，展示"组合起来能做什么"。标题与描述由
 * SnHomeCaseDemo 的双语字典提供，这里只登记版位与高度档。
 *
 * 结构：一面 SnWaterfall 瀑布流（`min-column-width` 响应式列数，铺满
 * 视口宽度），无跑马灯 —— 一次排布、自然滚动浏览。
 *
 * `caseHue` 为每张卡片派生一个确定性的色相（0–359）：一个纯函数色板工具，
 * 派生规则由契约测试（home-cases.test.ts）锁定，SSR / 客户端一致（不能用
 * Math.random，否则水合时数值会闪变）。注意：卡片当前改为中性配色（见
 * SnHomeCaseCard），caseHue 不再驱动卡片外观，保留供其它场景复用。
 */

/**
 * 案例卡内容窗高度档位（内容窗最小高度，px）。
 *
 * 取值由「三列齐平」反推：瀑布流按最短列优先摆放，档位定死后同档卡等高，
 * 12 张卡（4/4/4）才能三列几乎完全齐平（实测列高差 < 10px）。
 * 内容更高时卡片自然增高，故每档都是 min-height 而非固定高度。
 */
export type HomeCaseSize =
  | 'c188'
  | 'c208'
  | 'c228'
  | 'c248'
  | 'c288'
  | 'c308'
  | 'c338'
  | 'c378'
  | 'c388'
  | 'c398'
  | 'c418'
  | 'c428';

/** 案例标识 —— 首页设计稿的 9 张卡，外加数据表格 / 视频播放器 / 轮播三个扩展场景。 */
export type HomeCaseId =
  | 'aiChat'
  | 'aiPrompt'
  | 'aiImage'
  | 'form'
  | 'stats'
  | 'chart'
  | 'datetime'
  | 'table'
  | 'color'
  | 'kanban'
  | 'video'
  | 'carousel';

/** 筛选分组 —— 卡头胶囊按它过滤（ai = AI 原生场景）。 */
export type HomeCaseGroup = 'ai' | 'core' | 'media';

/** 筛选键：'all' = 不过滤。 */
export type HomeCaseFilter = 'all' | HomeCaseGroup;

/** 卡头 badge 的强调色档（参照稿同款：不同场景不同色相）。 */
export type HomeCaseAccent = 'blue' | 'indigo' | 'emerald' | 'fuchsia' | 'amber' | 'teal';

/** 分组顺序（筛选胶囊的排列顺序，不含 'all'）。 */
export const HOME_CASE_GROUPS: HomeCaseGroup[] = ['ai', 'core', 'media'];

export interface HomeCaseCard {
  /** 案例标识（唯一）。 */
  id: HomeCaseId;
  /** 内容区高度档位。 */
  size: HomeCaseSize;
  /** 筛选分组。 */
  group: HomeCaseGroup;
  /** 卡头 badge / 编号的强调色档。 */
  accent: HomeCaseAccent;
  /** 卡头能力标签（语言中立的技术 tag，参照稿同款英文短标签）。 */
  badge: string;
  /** 底部左：场景用到的组件 / 协议签名（mono，语言中立）。 */
  api: string;
  /** 底部右：状态文案（mono；缺省 `● Live`）。 */
  status?: string;
}

/**
 * 案例清单 —— 一面瀑布流。
 *
 * 顺序即瀑布流摆放顺序：3 张 AI 原生场景排最前，正好落在 3 列的第一行。
 */
export const homeCases: HomeCaseCard[] = [
  {
    id: 'aiChat',
    size: 'c388',
    group: 'ai',
    accent: 'blue',
    badge: 'Agent Stream',
    api: 'SnInput · SnButton · SSE',
    status: '● Live',
  },
  {
    id: 'aiPrompt',
    size: 'c338',
    group: 'ai',
    accent: 'indigo',
    badge: 'Orchestrator',
    api: 'SnSlider · SnTag · SnInput',
    status: 'API v1',
  },
  {
    id: 'aiImage',
    size: 'c418',
    group: 'ai',
    accent: 'fuchsia',
    badge: 'Diffusion',
    api: 'SnProgress · SnInput',
    status: '● 80%',
  },

  {
    id: 'form',
    size: 'c288',
    group: 'core',
    accent: 'blue',
    badge: 'Smart Form',
    api: 'SnInput · SnRadioGroup · SnCheckbox',
    status: '● Valid',
  },
  {
    id: 'stats',
    size: 'c308',
    group: 'core',
    accent: 'emerald',
    badge: 'Stats Suite',
    api: 'SnStatistic · SnSlider',
    status: '● Live',
  },
  {
    id: 'chart',
    size: 'c228',
    group: 'core',
    accent: 'blue',
    badge: 'Dual Spline',
    api: 'SnStatistic · SnTag',
    status: 'ECharts',
  },
  {
    id: 'datetime',
    size: 'c428',
    group: 'core',
    accent: 'indigo',
    badge: 'Date & Time',
    api: 'SnCalendar · SnTimePicker',
    status: 'ISO-8601',
  },
  {
    id: 'table',
    size: 'c398',
    group: 'core',
    accent: 'indigo',
    badge: 'Data Table',
    api: 'SnDataTable · SnTag',
    status: '● 1,284',
  },
  {
    id: 'color',
    size: 'c378',
    group: 'media',
    accent: 'fuchsia',
    badge: 'Color System',
    api: 'SnColorPicker · SnProgress',
    status: 'D65',
  },
  {
    id: 'kanban',
    size: 'c188',
    group: 'media',
    accent: 'emerald',
    badge: 'Kanban Flow',
    api: 'SnDragSort · SnTag · SnIcon',
    status: 'HTML5 DnD',
  },
  {
    id: 'video',
    size: 'c208',
    group: 'media',
    accent: 'teal',
    badge: 'Video Player',
    api: 'SnVideoPlayer · SnTag · SnProgress',
    status: 'MP4 · HLS',
  },
  {
    id: 'carousel',
    size: 'c248',
    group: 'media',
    accent: 'amber',
    badge: 'Carousel',
    api: 'SnCarousel · SnCarouselItem',
    status: '● Auto',
  },
];
/**
 * 卡头编号 —— AI 原生场景 `AI #01…`，其余 `#01…`（按注册表顺序连续编号）。
 * 纯派生 + 确定性：SSR 与客户端、以及任何筛选状态下都得到同一个编号
 * （编号不随过滤结果重排）。
 */
export const caseIndexLabels: Record<HomeCaseId, string> = (() => {
  const labels = {} as Record<HomeCaseId, string>;
  let ai = 0;
  let other = 0;
  for (const c of homeCases) {
    if (c.group === 'ai') {
      labels[c.id] = `AI #${String((ai += 1)).padStart(2, '0')}`;
    } else {
      labels[c.id] = `#${String((other += 1)).padStart(2, '0')}`;
    }
  }
  return labels;
})();

/**
 * 由案例 id 派生确定性色相（0–359）。
 *
 * 简单多项式散列 × 137 黄金比例打散，保证相邻 id 的色相差异足够大，
 * 同一 id 在 SSR 与客户端得到同一颜色（水合安全）。
 */
export function caseHue(id: HomeCaseId): number {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = (hash * 31 + id.charCodeAt(i)) % 360;
  }
  return (hash * 137) % 360;
}

/* ─────────────────────────────────────────────────────────────────────────
 * 案例双语字典 —— 单一事实源
 *
 * SnDocsHome（卡片标题/副标题）与 SnHomeCaseDemo（案例内容文案）共用；
 * 键名约定：`${id}Title` / `${id}Desc`，其余为案例内文案。`achieved`
 * 是带参文案（函数值）。SSR 安全：纯数据，无副作用。
 * ───────────────────────────────────────────────────────────────────────── */

export type HomeCaseLocale = 'zh' | 'en';

type CaseDict = Record<string, string | ((...args: string[]) => string)>;

const zhDict: CaseDict = {
  accountTitle: '账号安全',
  accountDesc: '更新你的登录凭据或重新认证。',
  email: '邮箱地址',
  emailPlaceholder: 'artist@studio.com',
  password: '当前密码',
  passwordPlaceholder: '••••••••••••',
  updateSecurity: '更新安全设置',
  paymentsTitle: '支付设置',
  paymentsDesc: '管理你的资金流转。',
  transferLimit: '修改转账限额',
  transferLimitDesc: '调整单笔可转出的余额上限。',
  scheduled: '定期转账',
  scheduledDesc: '设置在指定日期发起的转账计划。',
  recurring: '循环卡扣款',
  recurringDesc: '管理周期性的卡扣款任务。',
  payoutTitle: '提现阈值',
  payoutDesc: '设置触发提现所需的最低余额。',
  currency: '结算货币',
  minPayout: '最低提现金额',
  savePrefs: '保存偏好',
  notifyTitle: '通知偏好',
  notifyDesc: '选择你希望接收的更新。',
  notifyTx: '交易动态',
  notifyTxDesc: '入账、提现与手续费',
  notifySecurity: '安全警报',
  notifySecurityDesc: '登录尝试与账户变更',
  notifyMilestones: '目标里程碑',
  notifyMilestonesDesc: '在 25%、50%、75%、100% 时更新',
  savingsTitle: '储蓄目标',
  savingsDesc: '2024 年度储蓄目标的活跃里程碑。',
  retirement: '养老金',
  realEstate: '房产',
  achieved: (p, rest) => `已完成 ${p} · 还差 ${rest}`,
  milestoneTitle: '新建目标',
  milestoneDesc: '设定你的财务目标，我们会帮你规划节奏。',
  goalName: '目标名称',
  goalNamePlaceholder: '例如：新车、首付',
  targetAmount: '目标金额',
  targetDate: '目标日期',
  createGoal: '创建目标',
  cancel: '取消',
  chatTitle: '新对话',
  chatGreeting: '早上好，蜗蜗！',
  chatHint: '今天想做点什么？发送消息开始对话。',
  chatPlaceholder: '输入消息…',
  chatSend: '发送',
  balanceTitle: '可领余额',
  pendingSetup: '待开通',
  netRoyalties: '净版权收益',
  processingFee: '处理手续费',
  totalReady: '合计可领',
  balanceNote: '银行账户连通后，余额超过 $10.00 的部分将自动进入每月 15 日的发放名单。',
  chartTitle: '可视化分析图表',
  chartDesc: '平滑双曲线、拟态 Tooltip 气泡与分段器',
  upcoming: '进行中',
  scheduledMay: '5 月 2024',
  scheduledState: '已排期',
  plan: '储蓄计划',
  planState: '加速中',
  planRecurring: '按月复投',
  viewReport: '查看完整报告',
  membersTitle: '团队成员',
  membersDesc: '管理空间成员与角色。',
  memberOwner: '所有者',
  memberAdmin: '管理员',
  memberViewer: '访客',
  timelineTitle: '发货进度',
  orderPlaced: '订单已创建',
  orderPlacedTime: '12 月 01 日 09:24',
  orderPlacedDesc: '发卡行已确认扣款。',
  shipped: '已发货',
  shippedTime: '12 月 02 日 18:40',
  shippedDesc: '包裹已被承运商揽收。',
  inTransit: '运输中',
  inTransitTime: '12 月 03 日 08:12',
  inTransitDesc: '正在发往本地转运中心。',
  controlsTitle: '快捷操作',
  controlsDesc: '把高频操作收进一条紧凑的操作栏。',
  primaryAction: '去提现',
  secondaryAction: '导出',
  outlineAction: '分享',
  badge: '徽标',
  qrTitle: '扫码连接',
  qrDesc: '扫码在手机上打开文档。',
  skeletonTitle: '加载占位',
  skeletonDesc: '内容就绪前的骨架屏。',
  dialogTitle: '确认对话框',
  dialogDesc: '带主 / 次操作的类型化确认。',
  dialogOpen: '打开对话框',
  dialogHeading: '删除草稿？',
  dialogBody: '该操作无法撤销，草稿将被永久移除。',
  dialogPositive: '删除',
  dialogNegative: '保留',
  carouselTitle: '轮播横幅',
  carouselDesc: '自动播放、拖拽切换与卡片动效。',
  slideA: '设计系统',
  slideB: '风格包',
  slideC: 'AI Native',
  tableTitle: '数据表格',
  tableDesc: '紧凑数据表格、负责人指派与状态徽标。',
  colTask: '任务',
  colOwner: '负责人',
  colStatus: '状态',
  statusDone: '已完成',
  statusDoing: '进行中',
  statusTodo: '待开始',
  /* ── 数据表格（扩展场景） ── */
  tableLabel: '发布任务',
  tableCount: '1,284 行',
  tableRow1: 'Tokens 多端转换',
  tableRow2: '错误监控接入',
  tableRow3: '设计稿同步',
  tableOwner: '蜗蜗',
  heatmapTitle: '活跃度',
  heatmapDesc: '近 8 周的贡献热力图。',
  imageTitle: '媒体',
  imageDesc: '懒加载图片，object-fit 裁切。',
  videoTitle: '视频播放器',
  videoDesc: '倍速、画中画、清晰度切换与弹幕层。',
  datetimeTitle: '日期时间选择器',
  datetimeDesc: '高精度日历面板、时分秒滚动列与快捷预设',
  datetimePlaceholder: '选择日期时间',
  calendarTitle: '日历',
  calendarDesc: '可点选日期的月历面板。',
  colorTitle: '色彩调配引擎',
  colorDesc: 'SV 取色面板、色相/透明滑杆与 Token 色票',
  uploadTitle: '上传',
  uploadDesc: '选择文件，最多 3 张图片。',
  uploadCta: '上传文件',
  dragTitle: '队列排序',
  dragDesc: '拖动手柄调整任务顺序。',
  stepsTitle: '入驻引导',
  stepsDesc: '第 2 步，共 3 步 —— 马上完成。',
  stepAccount: '账号',
  stepProfile: '资料',
  stepDone: '完成',

  /* ── AI 原生场景（三张参照稿同款的组合场景） ── */
  aiChatTitle: 'AI 对话与推理流',
  aiChatDesc: '模型选择器、思考链折叠与流式代码生成',
  aiChatSwitch: '切换',
  aiChatStats: 'Tokens/s 84.5 · 延迟 240ms',
  aiChatQuery: '请帮我写一张磨砂玻璃指标卡，支持平滑微折线。',
  aiChatThinking: '深度思考过程（耗时 8.2s）',
  aiChatThinkingBody:
    '拆解需求：外层 rounded-3xl + backdrop-blur 做磨砂面；折线用二次贝塞尔，末点补一枚光斑。',
  aiChatSend: '发送',
  aiChatCopy: '复制代码',
  aiChatInput: '追问需求或微调设计…',
  aiChatFoot: 'SSE 流式传输',
  aiPromptTitle: 'Prompt 与上下文编排',
  aiPromptDesc: 'System 设定、变量槽位注入与参数调优。',
  aiPromptSystem: '系统预设指令',
  aiPromptSystemValue:
    '你是一名设计系统架构师。输出必须遵循 @snui 的视觉原则，并匹配 {{user_intent}} 与 {{retrieved_chunks}}。',
  aiPromptActive: 'v2.3 活跃中',
  aiPromptTokens: '预估 148 Tokens',
  aiPromptSlots: '已注入动态变量槽位',
  aiPromptRun: '调试运行',
  aiPromptFoot: '预算 4,096 / 128K',
  aiImageTitle: 'AI 图像生成与微调',
  aiImageDesc: '多风格预设、宽高比适配与去噪迭代进度',
  aiImagePrompt: 'Futuristic frosted glass UI, clean ambient glow, octane render.',
  aiImageStep: 'Step 28 / 35',
  aiImageOptimize: '优化 Prompt',
  aiImageWeight: '权重 1.2',
  aiImagePreset1: '极简磨砂 3D',
  aiImagePreset2: '日系二次元',
  aiImagePreset3: '矢量微扁平',
  aiImageRender: '正在去噪渲染 80%',
  aiImageFoot: '采样 DPM++ 2M',
  /* ── #01 表单综合套件（设计稿：配置面板） ── */
  domainLabel: '工作空间域名',
  domainOk: '域名可用',
  hostLabel: '算力托管模式',
  hostCloud: '云端托管',
  hostPrivate: '私有部署',
  syncLabel: '同步能力',
  selectAll: '全选',
  syncFigma: 'Figma 变量',
  syncMcp: 'MCP 同步',
  quotaLabel: '并发 Token 配额',
  quotaStep: '步长 ±512',
  saveConfig: '保存配置',
  reset: '重置',
  /* ── #04 日期时间选择器 ── */
  presetToday: '今天',
  presetYesterday: '昨天',
  preset7d: '近 7 天',
  preset30d: '近 30 天',
  timeLabel: '时间',
  confirm: '确认选择',
  /* ── #02 资产与指标统计 ── */
  statLabel: 'Total Clicks / Value',
  ratioLabel: '配置比例',
  ratioValue: '权益 58% · 固收 28% · 现金 14%',
  transfer: '转账',
  withdraw: '提现',
  deepAnalyze: '深度分析',
  /* ── #12 列表拖拽与看板流 ── */
  kanbanTodo: 'To Do · P0',
  /* ── #03 可视化分析图表 ── */
  kanbanTask1Title: '设计 Tokens 多端转换工具链',
  kanbanTask1Meta: '负责人: 蜗蜗 · 进行中',
  kanbanTask2Title: '接入错误监控',
  kanbanTask2Meta: 'Sentry 自动化集成与告警',
  kanbanProg: 'In prog',
  kanbanReview: 'Review',
  chartActual: '实际推演',
  chartBase: '预期基线',
  chartWeek: '周',
  chartTipDate: '04-18 (周五)',
  /* ── 视频播放器（扩展场景） ── */
  videoCap: '海边航拍 · 1080P',
  videoTip: '弹幕 / 画中画 / 迷你窗',
  videoSpeed: '1.25× 倍速',
  /* ── 轮播（扩展场景） ── */
  carouselSlide1: '春季新品发布',
  carouselSlide1Desc: '全品类限时 8 折，会员积分翻倍',
  carouselSlide2: '出行季 · 旅行专区',
  carouselSlide2Desc: '机票酒店套餐立减 300 元',
  carouselSlide3: '会员日来袭',
  carouselSlide3Desc: '每月 18 日专属券包，立即领取',
  carouselFoot: '自动播放 · 1.8s',
  /* ── 组件场景卡标题 / 副标题（与设计稿一致） ── */
  formTitle: '表单综合套件',
  formDesc: '前后缀复合输入、单选卡片、复选与步进器',
  statsTitle: '资产与指标统计',
  statsDesc: '白净悬浮卡片、柔和微折线与指标增长',
  kanbanTitle: '列表拖拽与看板流',
  kanbanDesc: '磨砂悬浮卡片、圆角浮卡与拖拽手柄',
};

const enDict: CaseDict = {
  accountTitle: 'Account Security',
  accountDesc: 'Update your credentials or re-authenticate.',
  email: 'Email Address',
  emailPlaceholder: 'artist@studio.com',
  password: 'Current Password',
  passwordPlaceholder: '••••••••••••',
  updateSecurity: 'Update Security',
  paymentsTitle: 'Payments',
  paymentsDesc: 'Manage how money moves.',
  transferLimit: 'Change transfer limit',
  transferLimitDesc: 'Adjust how much you can send from your balance.',
  scheduled: 'Scheduled transfers',
  scheduledDesc: 'Set up a transfer to send at a later date.',
  recurring: 'Recurring card payments',
  recurringDesc: 'Manage your repeated card transactions.',
  payoutTitle: 'Payout Threshold',
  payoutDesc: 'Set the minimum balance required before a payout is triggered.',
  currency: 'Payout currency',
  minPayout: 'Minimum payout amount',
  savePrefs: 'Save Preferences',
  notifyTitle: 'Notifications',
  notifyDesc: 'Choose which updates to receive.',
  notifyTx: 'Transactions',
  notifyTxDesc: 'Deposits, payouts and fees',
  notifySecurity: 'Security alerts',
  notifySecurityDesc: 'Login attempts and account changes',
  notifyMilestones: 'Goal milestones',
  notifyMilestonesDesc: 'Updates at 25%, 50%, 75%, 100%',
  savingsTitle: 'Savings Targets',
  savingsDesc: 'Active milestones for 2024 across your savings goals.',
  retirement: 'Retirement',
  realEstate: 'Real Estate',
  achieved: (p, rest) => `${p} achieved · ${rest} to go`,
  milestoneTitle: 'Set a New Milestone',
  milestoneDesc: "Define your financial target and we'll help you pace your savings.",
  goalName: 'Goal Name',
  goalNamePlaceholder: 'e.g. New Car, Home Downpayment',
  targetAmount: 'Target Amount',
  targetDate: 'Target Date',
  createGoal: 'Create Goal',
  cancel: 'Cancel',
  chatTitle: 'New Chat',
  chatGreeting: 'Morning, snail!',
  chatHint: 'What are we working on today? Press send to start a conversation.',
  chatPlaceholder: 'Type a message…',
  chatSend: 'Send',
  balanceTitle: 'Claimable Balance',
  pendingSetup: 'Pending Setup',
  netRoyalties: 'Net Royalties',
  processingFee: 'Processing Fee',
  totalReady: 'Total Ready to Claim',
  balanceNote:
    'Once your bank is connected, balances over $10.00 are automatically eligible for monthly distribution on the 15th.',
  chartTitle: 'Analytics Chart',
  chartDesc: 'Smooth dual splines, mock tooltip and segmented control.',
  upcoming: 'Upcoming',
  scheduledMay: 'May 2024',
  scheduledState: 'Scheduled',
  plan: 'Savings Plan',
  planState: 'Accelerated',
  planRecurring: 'Recurring',
  viewReport: 'View Full Report',
  membersTitle: 'Team Members',
  membersDesc: 'Manage people and roles in your workspace.',
  memberOwner: 'Owner',
  memberAdmin: 'Admin',
  memberViewer: 'Viewer',
  timelineTitle: 'Delivery Progress',
  orderPlaced: 'Order placed',
  orderPlacedTime: 'Dec 01, 09:24',
  orderPlacedDesc: 'Payment confirmed by the issuer.',
  shipped: 'Shipped',
  shippedTime: 'Dec 02, 18:40',
  shippedDesc: 'Picked up by the carrier.',
  inTransit: 'In transit',
  inTransitTime: 'Dec 03, 08:12',
  inTransitDesc: 'Arriving at the local hub.',
  controlsTitle: 'Quick Actions',
  controlsDesc: 'A compact action bar for daily tasks.',
  primaryAction: 'Withdraw',
  secondaryAction: 'Export',
  outlineAction: 'Share',
  badge: 'Badge',
  qrTitle: 'QR Connect',
  qrDesc: 'Scan to open the docs on your phone.',
  skeletonTitle: 'Loading State',
  skeletonDesc: 'Skeleton placeholders while content resolves.',
  dialogTitle: 'Confirm Dialog',
  dialogDesc: 'A typed confirmation with positive / negative actions.',
  dialogOpen: 'Open Dialog',
  dialogHeading: 'Delete draft?',
  dialogBody: 'This action cannot be undone. The draft will be removed permanently.',
  dialogPositive: 'Delete',
  dialogNegative: 'Keep it',
  carouselTitle: 'Carousel Banner',
  carouselDesc: 'Autoplay, drag-to-switch and card motion.',
  slideA: 'Design System',
  slideB: 'Style Packs',
  slideC: 'AI Native',
  tableTitle: 'Data Table',
  tableDesc: 'Compact data table with owners and status badges.',
  colTask: 'Task',
  colOwner: 'Owner',
  colStatus: 'Status',
  statusDone: 'Done',
  statusDoing: 'In Progress',
  statusTodo: 'To Do',
  /* ── Data table (extended) ── */
  tableLabel: 'Release tasks',
  tableCount: '1,284 rows',
  tableRow1: 'Multi-target tokens',
  tableRow2: 'Error monitoring',
  tableRow3: 'Design spec sync',
  tableOwner: 'Snail',
  heatmapTitle: 'Activity',
  heatmapDesc: 'Contributions over the last 8 weeks.',
  imageTitle: 'Media',
  imageDesc: 'Lazy-loaded image with object-fit cover.',
  videoTitle: 'Video Player',
  videoDesc: 'Playback rate, picture-in-picture, quality switch and danmaku.',
  datetimeTitle: 'Date & Time Picker',
  datetimeDesc: 'High-precision calendar, scroll columns and presets.',
  datetimePlaceholder: 'Pick a date & time',
  calendarTitle: 'Calendar',
  calendarDesc: 'Month panel with selectable dates.',
  colorTitle: 'Color System',
  colorDesc: 'SV panel, hue/alpha sliders and token swatches.',
  uploadTitle: 'Upload',
  uploadDesc: 'Pick files, up to 3 images.',
  uploadCta: 'Upload Files',
  dragTitle: 'Queue Order',
  dragDesc: 'Drag the handle to reorder tasks.',
  stepsTitle: 'Onboarding',
  stepsDesc: 'Step 2 of 3 — almost there.',
  stepAccount: 'Account',
  stepProfile: 'Profile',
  stepDone: 'Finish',

  /* ── AI-native scenarios ── */
  aiChatTitle: 'AI Chat & Reasoning Stream',
  aiChatDesc: 'Model picker, collapsible reasoning and streaming code.',
  aiChatSwitch: 'Switch',
  aiChatStats: 'Tokens/s 84.5 · 240ms latency',
  aiChatQuery: 'Build me a frosted-glass metric card with a smooth sparkline.',
  aiChatThinking: 'Reasoning trace (8.2s)',
  aiChatThinkingBody:
    'Breakdown: rounded-3xl + backdrop-blur for the frosted surface; the sparkline uses quadratic beziers with an end dot.',
  aiChatSend: 'Send',
  aiChatCopy: 'Copy code',
  aiChatInput: 'Ask a follow-up or tweak the design…',
  aiChatFoot: 'SSE streaming',
  aiPromptTitle: 'Prompt & Context Orchestration',
  aiPromptDesc: 'System prompt, variable slots and parameter tuning.',
  aiPromptSystem: 'System prompt',
  aiPromptSystemValue:
    'You are a design-system architect. Output must follow the @snui visual rules and match {{user_intent}} and {{retrieved_chunks}}.',
  aiPromptActive: 'v2.3 active',
  aiPromptTokens: '~148 Tokens',
  aiPromptSlots: 'Injected variable slots',
  aiPromptRun: 'Debug run',
  aiPromptFoot: 'Budget 4,096 / 128K',
  aiImageTitle: 'AI Image Generation & Tuning',
  aiImageDesc: 'Style presets, aspect fitting and denoise progress.',
  aiImagePrompt: 'Futuristic frosted glass UI, clean ambient glow, octane render.',
  aiImageStep: 'Step 28 / 35',
  aiImageOptimize: 'Optimize prompt',
  aiImageWeight: 'Weight 1.2',
  aiImagePreset1: 'Frosted 3D',
  aiImagePreset2: 'Anime',
  aiImagePreset3: 'Vector flat',
  aiImageRender: 'Denoising 80%',
  aiImageFoot: 'Sampler DPM++ 2M',
  /* ── #01 Form suite (config panel) ── */
  domainLabel: 'Workspace domain',
  domainOk: 'Domain available',
  hostLabel: 'Compute hosting',
  hostCloud: 'Cloud managed',
  hostPrivate: 'Self-hosted',
  syncLabel: 'Sync capabilities',
  selectAll: 'Select all',
  syncFigma: 'Figma variables',
  syncMcp: 'MCP sync',
  quotaLabel: 'Concurrent token quota',
  quotaStep: 'Step ±512',
  saveConfig: 'Save config',
  reset: 'Reset',
  /* ── #04 Date & time picker ── */
  presetToday: 'Today',
  presetYesterday: 'Yesterday',
  preset7d: 'Last 7 days',
  preset30d: 'Last 30 days',
  timeLabel: 'Time',
  confirm: 'Confirm selection',
  /* ── #02 Asset & metric stats ── */
  statLabel: 'Total Clicks / Value',
  ratioLabel: 'Allocation',
  ratioValue: 'Equity 58% · Fixed income 28% · Cash 14%',
  transfer: 'Transfer',
  withdraw: 'Withdraw',
  deepAnalyze: 'Deep analyze',
  /* ── #12 Kanban & drag flow ── */
  kanbanTodo: 'To Do · P0',
  /* ── #03 Analytics chart ── */
  kanbanTask1Title: 'Multi-target token pipeline',
  kanbanTask1Meta: 'Owner: Snail · In progress',
  kanbanTask2Title: 'Set up error monitoring',
  kanbanTask2Meta: 'Sentry auto-integration and alerts',
  kanbanProg: 'In prog',
  kanbanReview: 'Review',
  chartActual: 'Actual',
  chartBase: 'Baseline',
  chartWeek: 'Week',
  chartTipDate: 'Apr 18 (Fri)',
  /* ── Video player (extended) ── */
  videoCap: 'Coastal drone · 1080P',
  videoTip: 'Danmaku / PiP / mini window',
  videoSpeed: '1.25× speed',
  /* ── Carousel (extended) ── */
  carouselSlide1: 'Spring launch',
  carouselSlide1Desc: 'Up to 20% off everything, double points for members',
  carouselSlide2: 'Travel season',
  carouselSlide2Desc: 'Flight + hotel packages, ¥300 off',
  carouselSlide3: 'Members day',
  carouselSlide3Desc: 'Exclusive coupon pack on the 18th',
  carouselFoot: 'Autoplay · 1.8s',
  /* ── Component scene titles / subtitles ── */
  formTitle: 'Smart Form Suite',
  formDesc: 'Affix inputs, radio cards, checkboxes and a stepper.',
  statsTitle: 'Asset & Metric Stats',
  statsDesc: 'Floating cards, soft sparklines and growth badges.',
  kanbanTitle: 'Kanban & Drag Flow',
  kanbanDesc: 'Frosted floating card, rounded rows and drag handles.',
};

/** 按语言取整份案例字典（`${id}Title` / `${id}Desc` + 案例内文案）。 */
export function caseCopy(locale: HomeCaseLocale): CaseDict {
  return locale === 'en' ? enDict : zhDict;
}

/** 案例卡的标题 / 副标题（`${id}Title` / `${id}Desc` 键）。 */
export function caseText(id: HomeCaseId, locale: HomeCaseLocale): { title: string; desc?: string } {
  const dict = caseCopy(locale);
  return {
    title: dict[`${id}Title`] as string,
    desc: dict[`${id}Desc`] as string | undefined,
  };
}
