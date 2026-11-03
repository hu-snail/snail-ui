/**
 * Public types of @snui/admin-layout — the admin shell contract (ADR-0006).
 *
 * The package is layout-only: every business concern (auth, requests,
 * stores, route registration) stays in the host. Menu navigation is
 * event-driven (`select`), never performed internally.
 */

/** Built-in layout shapes. `v-model:layout` for host-driven switchers. */
export type SnProLayoutMode = 'side' | 'top' | 'mix' | 'dual';
