/**
 * sn-dialer type contracts (pure ts module).
 *
 * Types live outside the SFC so the uni-x pipeline (ADR-0004) can ship a
 * deterministic import target on uni-app x — same pattern as sn-icon-types.
 */

/** 转盘奖品项（demo / 宿主侧结构化奖品源的契约）。 */
export interface SnDialerPrize {
  /** 奖品 id。 */
  id: string;
  /** 奖品名。 */
  name: string;
  /** 奖品图（可选）。 */
  img?: string;
  /** 本扇区背景色（优先于 prizeBgColors）。 */
  color?: string;
}
