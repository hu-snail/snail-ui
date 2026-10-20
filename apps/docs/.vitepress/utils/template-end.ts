/**
 * Template-end filter for the 模板 sidebar.
 *
 * The section lists one page per AI 套件 template, and each page covers both
 * ends internally (its ends are tagged inside the article). Not every template
 * ships on both ends though — the assistant, the composer and the model-config
 * page are web-only — so the sidebar carries a web / uni-app capsule that
 * filters the list down to what the selected end actually provides.
 *
 * The filtering itself is CSS-only: vitepress renders the sidebar, and
 * custom.css §14 hides the entries that the selected end does not ship. That
 * keeps this module out of vitepress's sidebar internals — nothing has to
 * re-render on a switch, and the items stay in the DOM so the group's spacing
 * and the outline panel are unaffected.
 *
 * The value is mirrored onto `<html data-sn-template-end="web|uni">` for CSS and
 * persisted in localStorage so the choice survives navigation and reloads.
 */

import { onMounted, ref, watch, type Ref } from 'vue'

export type TemplateEnd = 'web' | 'uni'

/**
 * Template pages that exist only on the web end, i.e. the sidebar entries the
 * uni-app filter hides. custom.css §14 matches the same three hrefs — that
 * pairing is deliberate, since CSS cannot read this list. It is also what the
 * capsule's "this page is web-only" hint is built from.
 */
export const WEB_ONLY_ROUTES: readonly string[] = [
  '/templates/ai/assistant',
  '/templates/ai/prompt',
  '/templates/ai/model-config',
]

const STORAGE_KEY = 'sn-docs-template-end'
const HTML_ATTR = 'data-sn-template-end'

const end = ref<TemplateEnd>('web')

function applyToHtml(value: TemplateEnd): void {
  if (typeof document === 'undefined') return
  document.documentElement.setAttribute(HTML_ATTR, value)
}

function readStored(): TemplateEnd | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    return stored === 'web' || stored === 'uni' ? stored : null
  } catch {
    return null
  }
}

// The html attribute is applied as early as this module is evaluated — i.e.
// before the sidebar paints — so a stored `uni` never flashes the web-only
// entries first. The reactive value itself is only restored in `onMounted`:
// keeping the first render deterministic ('web') avoids a hydration mismatch
// on the capsule, which is diffed against the server-rendered markup.
const stored = readStored()
if (stored) applyToHtml(stored)

watch(end, (value) => {
  applyToHtml(value)
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(STORAGE_KEY, value)
  } catch {
    // Storage can be unavailable (private mode, blocked cookies). The filter
    // still works for the current session, so this is intentionally silent.
  }
})

export interface TemplateEndFilter {
  end: Ref<TemplateEnd>
  setEnd: (value: TemplateEnd) => void
}

export function useTemplateEnd(): TemplateEndFilter {
  onMounted(() => {
    // The first render is deliberately the default, so the capsule matches the
    // server-rendered markup; the stored end is applied once, here. The
    // attribute is re-asserted because vitepress can replace <html> on a full
    // page load.
    if (stored) end.value = stored
    applyToHtml(end.value)
  })

  return {
    end,
    setEnd: (value: TemplateEnd) => {
      end.value = value
    },
  }
}
