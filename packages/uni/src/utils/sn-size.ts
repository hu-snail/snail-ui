/**
 * mp 端尺寸归一：裸数字与无单位数字字符串都视为 750 设计稿的 rpx 值。
 *
 * 组件 props 常以字符串形式接到模板属性上（`loading-size="48"`），同一数值
 * 会以 number 和 unitless string 两种形态出现。sn-icon 的渲染盒把裸数字当
 * px、而无单位字符串写进 CSS `width` 是非法值（浏览器忽略后 SVG 按默认
 * 内在尺寸撑到 ~300px，即"巨大加载圈"bug）。这里统一归一成 `rpx` 字符串：
 * 375 视口下与原 px 意图等宽，其它屏宽随设备缩放。
 */

/** 无单位数字字符串（"48"、"48.5"）。 */
const UNITLESS_NUMERIC = /^\d+(?:\.\d+)?$/;

/**
 * 归一为 CSS 长度字符串：number / 无单位数字字符串 → `${n}rpx`；
 * 已带单位的字符串（'32rpx' / '1.5em' / '28px'）原样透传。
 */
export function toRpxSize(size: number | string): string {
  if (typeof size === 'number') return `${size}rpx`;
  if (UNITLESS_NUMERIC.test(size)) return `${size}rpx`;
  return size;
}
