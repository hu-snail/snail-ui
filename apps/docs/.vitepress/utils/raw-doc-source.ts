/**
 * markdown-it plugin: publish each page's raw markdown so the docs "copy
 * document" button can hand the reader the exact source.
 *
 * ## Why a plugin
 *
 * VitePress builds every `.md` page into a Vue component; the original
 * markdown text is not kept anywhere retrievable at runtime, and neither the
 * dev server nor a static build serves the `.md` files. So the source has to
 * travel with the page. A markdown-it core rule sees `state.src` — the page
 * body, frontmatter already stripped by VitePress — which is exactly the text
 * a reader would have authored.
 *
 * ## Why an attribute, not a <script>
 *
 * The emitted HTML becomes part of the compiled Vue template. A literal
 * `<script>` element in a template risks colliding with the SFC block parser,
 * and text content can have its whitespace condensed by the template
 * compiler. A `data-*` attribute on a hidden `<div>` avoids both: attribute
 * values keep their exact characters (JSON-escaped newlines included) and are
 * simply read back with `getAttribute()`.
 *
 * The payload is HTML-entity escaped, so markdown containing `</div>`, quotes
 * or angle brackets round-trips unchanged.
 */

/** Name of the attribute carrying the JSON-encoded markdown. */
export const RAW_DOC_SOURCE_ATTR = 'data-sn-doc-source'

/** The slice of markdown-it's API this plugin needs (kept structural so the
 *  docs package does not need markdown-it as a direct dependency). */
interface MarkdownToken {
  content: string
}

interface MarkdownStateCore {
  src: string
  Token: new (type: string, tag: string, nesting: number) => MarkdownToken
  tokens: MarkdownToken[]
}

interface MarkdownRenderer {
  core: {
    ruler: {
      push: (name: string, rule: (state: MarkdownStateCore) => void) => void
    }
  }
}

/**
 * Encode the page source for a `data-*` attribute.
 *
 * ## Why base64 and not HTML escaping
 *
 * The emitted attribute is part of the compiled Vue template, and Vue's
 * template compiler runs its own HTML tokenizer over attribute *values* — it
 * does not treat `&lt;` / `&#60;` as "this is not markup". A markdown body
 * contains real tags (`<Demo name="…" description="…">`, `<sn-config-provider
 * theme="dark">`, …), so every one of those attribute names was parsed a
 * second time and collided with the page's own attributes:
 *
 *   components/uni/fab.md (86:30): Duplicate attribute.
 *
 * Escaping cannot fix that — the tokenizer decodes entities first, then parses.
 * Base64 removes the possibility entirely: the value has no `<`, `>`, `"` or
 * `&`, so the tokenizer sees one opaque token. The reader-facing behaviour is
 * unchanged (`SnDocsDocActions` decodes it back to the exact markdown).
 *
 * `btoa` cannot take arbitrary Unicode, so the string is UTF-8 encoded first.
 */
function encodeSource(value: string): string {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  // eslint-disable-next-line no-undef
  return btoa(binary)
}

export function rawDocSource(md: MarkdownRenderer): void {
  md.core.ruler.push('sn-raw-doc-source', (state) => {
    const source = typeof state.src === 'string' ? state.src.trim() : ''
    if (!source) return

    const token = new state.Token('html_block', '', 0)
    token.content =
      `<div hidden ${RAW_DOC_SOURCE_ATTR}="${encodeSource(source)}"></div>`
    state.tokens.push(token)
  })
}
