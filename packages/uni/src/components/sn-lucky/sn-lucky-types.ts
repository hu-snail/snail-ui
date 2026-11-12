/**
 * sn-lucky type contracts (pure ts module).
 *
 * Types live outside the SFC so the uni-x pipeline (ADR-0004) can ship a
 * deterministic import target on uni-app x — same pattern as sn-icon-types.
 */

/** 九宫格抽奖奖品项（沿周长顺序排列）。 */
export interface SnLuckyPrize {
  /** 奖品名。 */
  name: string;
  /** 奖品图（可选）。 */
  img?: string;
  /** 激活时格子背景色（可选）。 */
  color?: string;
}
