/**
 * zh-CN messages — source of truth for the key tree. `en-US.ts` must keep
 * the exact same key set (asserted by `i18n/messages.test.ts`).
 */
export default {
  app: {
    title: 'Snail Admin',
    tagline: '中后台管理启动模板',
  },
  common: {
    username: '用户名',
    password: '密码',
    confirmPassword: '确认密码',
    nickname: '昵称',
    email: '邮箱',
    login: '登录',
    register: '注册',
    logout: '退出登录',
    loading: '加载中…',
    backHome: '返回首页',
  },
  menus: {
    home: '首页',
    docs: '文档',
    docsGettingStarted: '快速开始',
    docsRequest: '接口请求',
    docsRouter: '动态路由',
    docsTheme: '主题定制',
    docsI18n: '国际化',
  },
  header: {
    collapse: '收起菜单',
    expand: '展开菜单',
    theme: '深色模式',
    language: '语言',
    primaryColor: '主题色',
  },
  login: {
    title: '欢迎回来',
    subtitle: '登录以继续使用 Snail Admin',
    demoHint: '演示账号：admin / 123456',
    success: '登录成功，正在跳转…',
  },
  register: {
    title: '创建账号',
    subtitle: '注册一个新账号开始使用',
    success: '注册成功，已自动登录',
    toLogin: '已有账号？去登录',
    toRegister: '还没有账号？去注册',
  },
  home: {
    greeting: '你好，{name}，欢迎回来',
    stats: {
      totalUsers: '总用户数',
      todayOrders: '今日订单',
      revenue: '本月营收 (¥)',
      growth: '同比增长 (%)',
    },
    activities: {
      title: '最近动态',
      columns: {
        user: '操作人',
        action: '操作',
        target: '对象',
        time: '时间',
        status: '状态',
      },
      status: {
        success: '成功',
        warning: '警告',
        danger: '失败',
      },
    },
  },
  validation: {
    usernameRequired: '请输入用户名',
    passwordRequired: '请输入密码',
    passwordMin: '密码至少 6 位',
    confirmPasswordRequired: '请再次输入密码',
    passwordMismatch: '两次输入的密码不一致',
    nicknameRequired: '请输入昵称',
    emailRequired: '请输入邮箱',
    emailInvalid: '邮箱格式不正确',
  },
  api: {
    error: {
      401: '登录状态已失效，请重新登录',
      1001: '用户名或密码错误',
      1002: '用户名已存在',
    },
  },
  notFound: {
    title: '页面不存在',
    description: '你访问的页面不存在或已被移除',
  },
} as const;
