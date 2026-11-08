/**
 * Public types of the SnProUser piece (@snui/admin-layout).
 *
 * Kept in a plain `.ts` module (repo convention, same as
 * `sn-pro-layout-types.ts` / vue-web's `sn-dropdown-types.ts`) so nothing else
 * has to pull the SFC to get the contract.
 */

/** Profile rendered in a layout's sidebar footer. */
export interface SnProUserProfile {
  /** Display name. Also the avatar letter source when no image is given. */
  name: string;
  /** Secondary line — role, e-mail, team, … */
  description?: string | undefined;
  /** Avatar image URL; omitted → a letter tile from `name`. */
  avatar?: string | undefined;
}
