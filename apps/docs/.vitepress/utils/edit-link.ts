import { execFileSync } from 'node:child_process'

/**
 * "Edit this page" base URL for the docs chrome (see
 * components/SnDocsDocActions.vue).
 *
 * The link has to name the ref that actually contains the file being served.
 * Hard-coding the repository's default branch does not: `main` sits hundreds
 * of commits behind the branch these docs are built from, so an `edit/main/…`
 * link 404s for every page added or moved since the last merge — the whole
 * `/style-packs/`, `/templates/` and newer `/components/web/` surface
 * included.
 *
 * Resolution order:
 *   1. `SNUI_DOCS_EDIT_REF` — explicit override for CI, forks and builds
 *      that are not a git checkout
 *   2. the checked-out branch — correct by construction both for local dev
 *      and for any preview deployed from a branch
 *   3. `main` — last resort when git is unavailable or HEAD is detached
 *
 * Build-time only: config.ts hands the result to the client through
 * `themeConfig.editBase`, so no git call ever reaches the browser.
 */

const REPO = 'hu-snail/snail-ui'

/** Repo-root-relative directory the docs are published from. */
const DOCS_ROOT = 'apps/docs/'

function detectRef(): string {
  const override = process.env.SNUI_DOCS_EDIT_REF?.trim()
  if (override) return override

  try {
    const ref = execFileSync('git', ['rev-parse', '--abbrev-ref', 'HEAD'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim()
    // `HEAD` is a detached checkout (typical in CI), not a usable ref.
    if (ref && ref !== 'HEAD') return ref
  } catch {
    // Not a git checkout — fall through to the default branch.
  }

  return 'main'
}

/** `page.relativePath` is appended to this. */
export const EDIT_BASE = `https://github.com/${REPO}/edit/${detectRef()}/${DOCS_ROOT}`
