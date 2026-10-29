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
 */
export interface SnAvatarGroupContext {
  /** 统一尺寸（透传 sn-avatar 的 size 语义）。 */
  size?: string | number;
  /** 统一形状。 */
  shape?: 'round' | 'square';
}

/** 注入键：sn-avatar-group 提供，sn-avatar 消费。 */
export const SN_AVATAR_GROUP: InjectionKey<ComputedRef<SnAvatarGroupContext>> =
  Symbol('snAvatarGroup');
