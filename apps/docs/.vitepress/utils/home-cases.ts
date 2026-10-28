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
 * `caseHue` 为每张卡片派生一个确定性的色相（0–359）：卡片使用淡色渐变
 * 弥散玻璃质感（glassmorphism），色相随案例变化但 SSR / 客户端一致
 * （不能用 Math.random，否则水合时卡片颜色会闪变）。深浅主题下的玻璃
 * 配方见 SnHomeCaseCard。
 */

/** 案例卡内容区高度档位。 */
export type HomeCaseSize = 'sm' | 'md' | 'lg';

/** 案例标识 —— SnHomeCaseDemo 模板按它渲染对应的场景组合。 */
export type HomeCaseId =
  | 'account'
  | 'payments'
  | 'payout'
  | 'controls'
  | 'savings'
  | 'notify'
  | 'milestone'
  | 'timeline'
  | 'chat'
  | 'members'
  | 'balance'
  | 'chart'
  | 'qr'
  | 'skeleton'
  | 'dialog'
  | 'carousel'
  | 'table'
  | 'heatmap'
  | 'image'
  | 'video'
  | 'datetime'
  | 'calendar'
  | 'color'
  | 'upload'
  | 'drag'
  | 'steps';

export interface HomeCaseCard {
  /** 案例标识（唯一）。 */
  id: HomeCaseId;
  /** 内容区高度档位。 */
  size: HomeCaseSize;
}

/**
 * 案例清单 —— 一面瀑布流。size 档位（sm≈120 / md≈180 / lg≈260 的内容
 * 区基准高度）让瀑布流出现自然的错落。
 */
export const homeCases: HomeCaseCard[] = [
  { id: 'account', size: 'md' },
  { id: 'payments', size: 'sm' },
  { id: 'payout', size: 'md' },
  { id: 'controls', size: 'sm' },
  { id: 'savings', size: 'md' },
  { id: 'notify', size: 'sm' },
  { id: 'milestone', size: 'md' },
  { id: 'timeline', size: 'sm' },
  { id: 'chat', size: 'md' },
  { id: 'members', size: 'sm' },
  { id: 'balance', size: 'md' },
  { id: 'chart', size: 'lg' },
  { id: 'qr', size: 'sm' },
  { id: 'skeleton', size: 'sm' },
  { id: 'dialog', size: 'sm' },
  { id: 'carousel', size: 'md' },
  { id: 'table', size: 'lg' },
  { id: 'heatmap', size: 'md' },
  { id: 'image', size: 'sm' },
  { id: 'video', size: 'lg' },
  { id: 'datetime', size: 'sm' },
  { id: 'calendar', size: 'lg' },
  { id: 'color', size: 'sm' },
  { id: 'upload', size: 'sm' },
  { id: 'drag', size: 'md' },
  { id: 'steps', size: 'sm' },
];

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
  chartTitle: '贡献趋势',
  chartDesc: '近 6 个月的活跃度',
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
  carouselTitle: '精选轮播',
  carouselDesc: '自动播放的图片轮播。',
  slideA: '设计系统',
  slideB: '风格包',
  slideC: 'AI Native',
  tableTitle: '发布任务',
  tableDesc: '带斑马纹的紧凑数据表格。',
  colTask: '任务',
  colOwner: '负责人',
  colStatus: '状态',
  statusDone: '已完成',
  statusDoing: '进行中',
  statusTodo: '待开始',
  heatmapTitle: '活跃度',
  heatmapDesc: '近 8 周的贡献热力图。',
  imageTitle: '媒体',
  imageDesc: '懒加载图片，object-fit 裁切。',
  videoTitle: '视频播放',
  videoDesc: '自定义控制条与清晰度菜单。',
  datetimeTitle: '日期时间',
  datetimeDesc: '日期时间选择与相对时间。',
  datetimePlaceholder: '选择日期时间',
  calendarTitle: '日历',
  calendarDesc: '可点选日期的月历面板。',
  colorTitle: '颜色面板',
  colorDesc: '内嵌面板与常用色板。',
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
  chartTitle: 'Contribution History',
  chartDesc: 'Last 6 months of activity',
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
  carouselTitle: 'Highlights',
  carouselDesc: 'Auto-playing carousel of feature slides.',
  slideA: 'Design System',
  slideB: 'Style Packs',
  slideC: 'AI Native',
  tableTitle: 'Release Tasks',
  tableDesc: 'A compact data table with striped rows.',
  colTask: 'Task',
  colOwner: 'Owner',
  colStatus: 'Status',
  statusDone: 'Done',
  statusDoing: 'In Progress',
  statusTodo: 'To Do',
  heatmapTitle: 'Activity',
  heatmapDesc: 'Contributions over the last 8 weeks.',
  imageTitle: 'Media',
  imageDesc: 'Lazy-loaded image with object-fit cover.',
  videoTitle: 'Video Player',
  videoDesc: 'Custom controls with quality menu.',
  datetimeTitle: 'Date & Time',
  datetimeDesc: 'Datetime picker and relative time.',
  datetimePlaceholder: 'Pick a date & time',
  calendarTitle: 'Calendar',
  calendarDesc: 'Month panel with selectable dates.',
  colorTitle: 'Color Picker',
  colorDesc: 'Inline panel with swatches.',
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
};

/** 按语言取整份案例字典（`${id}Title` / `${id}Desc` + 案例内文案）。 */
export function caseCopy(locale: HomeCaseLocale): CaseDict {
  return locale === 'en' ? enDict : zhDict;
}

/** 案例卡的标题 / 副标题（`${id}Title` / `${id}Desc` 键）。 */
export function caseText(
  id: HomeCaseId,
  locale: HomeCaseLocale,
): { title: string; desc?: string } {
  const dict = caseCopy(locale);
  return {
    title: dict[`${id}Title`] as string,
    desc: dict[`${id}Desc`] as string | undefined,
  };
}
