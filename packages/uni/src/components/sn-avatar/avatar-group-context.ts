import type { ComputedRef, InjectionKey } from 'vue';

/**
 * sn-avatar ↔ sn-avatar-group 的注入契约（AUI 内部 API，不是公共 API）。
 *
 * 组把「统一尺寸 / 统一形状」下发给组内头像：wd-avatar-group 的语义是
 * **统一设置**组内头像的尺寸与形状，因此注入值优先于头像自身的默认值。
 *
 * 为什么用 provide / inject 而不是克隆 slot vnode：uni 端 MP 编译器不支持
 * 动态组件渲染（见 sn-table 模板里的同名注释），任何「把 slot vnode 重新渲染
 * 一遍」的方案都会在微信小程序端失效。provide / inject 与模板无关，全端可用。
 *
 * ## 成员注册（为什么计数不走 slot vnode）
 *
 * 组需要知道成员总数来推导折叠窗口与气泡。从 slot vnode 里数成员在 uni-app x
 * 各运行时不可靠：H5 的 slots.default 是函数、经典 MP 是数组、vapor MP 是
 * 另一种形态且**挂载后才填充**——每个运行时的形态与时序都不一样，任何静态
 * 遍历都会在某一端计到 0（真机回归：小程序端不折叠、无气泡）。改为注册制：
 * 头像在 setup 里把自身 uid 注册进组，卸载时注销——时序确定、全端一致。
 * 组自绘的折叠头像也走 SnAvatar，其 uid 由组经模板 ref 排除（见组组件）。
 */
export interface SnAvatarGroupContext {
  /** 统一尺寸（透传 sn-avatar 的 size 语义）。 */
  size?: string | number;
  /** 统一形状。 */
  shape?: 'round' | 'square';
  /** 成员注册：头像在 setup 里以自身 uid 调用（幂等）。 */
  registerMember?: (uid: number) => void;
  /** 成员注销：头像卸载时调用。 */
  unregisterMember?: (uid: number) => void;
}

/** 注入键：sn-avatar-group 提供，sn-avatar 消费。 */
export const SN_AVATAR_GROUP: InjectionKey<ComputedRef<SnAvatarGroupContext>> =
  Symbol('snAvatarGroup');
