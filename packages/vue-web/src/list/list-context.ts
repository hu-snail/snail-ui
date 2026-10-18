/**
 * Shared injection contract for SnList / SnListItem (AUI-WEB-DD-012).
 *
 * Mirrors the splitter-context.ts pattern: the container provides its
 * shared flags under a typed injection key; items read them during setup.
 * `undefined` from `inject` means the item was rendered outside a list —
 * it then degrades to a standalone row (divider shown like the default).
 */
import type { InjectionKey, Ref } from 'vue'

export interface SnListContext {
  /** Whether inter-item dividers render (parent `show-divider`). */
  showDivider: Ref<boolean>
}

export const SN_LIST_INJECTION_KEY: InjectionKey<SnListContext> = Symbol(
  'sn-list',
)
