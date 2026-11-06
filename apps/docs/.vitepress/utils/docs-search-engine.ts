/**
 * Docs search engine — inverted index + TF-IDF scoring, CJK aware.
 *
 * ## Why a hand-rolled engine (and not minisearch)
 *
 * The docs corpus is ~640 pages of mostly-Chinese prose. The panel needs
 * field-scoped weights (title > headings > body), an AND-completeness signal
 * for ranking, and per-term hit spans for highlight + snippet. minisearch's
 * flat field model cannot express per-field weights cleanly and its scoring
 * is opaque; the docs' own minisearch config stays with VitePress's modal.
 *
 * ## Algorithm
 *
 * 1. Tokenize each field into ASCII words + CJK unigrams and bigrams
 *    (`tokenize()` — shared with the query side, so a query term like 「按钮」
 *    matches pages whose prose contains 「按钮」 via the bigram vocabulary).
 * 2. Build an inverted index `Map<token, Map<docId, tf>>` per field bucket
 *    (title / headings / text), plus per-doc field lengths for normalization.
 * 3. Query: tokenize, drop pure-CJK unigrams whose bigram partner is present
 *    (the bigram is strictly more precise), resolve prefix expansions for
 *    ASCII terms via binary search over the sorted vocabulary.
 * 4. Score = Σ per-term TF-IDF (log-scaled TF, IDF = log(1 + N/df)) × field
 *    weight (title 6 / headings 3 / text 1) / sqrt(field length); multiplied
 *    by an AND-completeness factor (matched terms / query terms)^1.5, so pages
 *    containing *all* terms outrank pages hitting one.
 * 5. Cap candidates with a top-K min-heap (K = 30) during accumulation.
 *
 * Pure TypeScript, no deps. Build is O(corpus); query is O(terms × postings).
 */

/** Corpus entry delivered from the virtual module (`docs-search-source.ts`). */
export interface DocsSearchDoc {
  /** Site-absolute route, e.g. `/components/web/button`. */
  url: string;
  title: string;
  /** Platform bucket for the Web / uni capsule filter. */
  end: 'web' | 'uni' | 'other';
  /** Sidebar-style label rendered as a chip on each hit. */
  category: string;
  /** h2/h3 section titles. */
  headings: string[];
  /** Stripped prose. */
  text: string;
}

/** One ranked hit. */
export interface DocsSearchHit {
  doc: DocsSearchDoc;
  /** Relative relevance — only ordering is meaningful. */
  score: number;
  /** Body excerpt with the query hit near the start. */
  snippet: string;
  /** Character ranges within `snippet` to highlight. */
  highlight: Array<[number, number]>;
}

/** Field weights: a title hit is worth far more than a body mention. */
const FIELD_WEIGHT: Record<'title' | 'headings' | 'text', number> = {
  title: 6,
  headings: 3,
  text: 1,
};

/** Result cap (top-K heap during accumulation). */
const TOP_K = 30;

/** Snippet window around the best body hit. */
const SNIPPET_LENGTH = 120;

/** CJK unified ideographs (+ ext A). */
const CJK = /[\u4e00-\u9fff\u3400-\u4dbf]/;
/** Token alphabet: ASCII letters/digits or CJK. */
const TOKEN_SPLIT = /[^a-z0-9\u4e00-\u9fff\u3400-\u4dbf]+/;

/**
 * Tokenize into ASCII words + CJK unigrams AND bigrams.
 * Bigrams let the query 「按钮」 match via the exact 「按钮」 bigram; unigrams
 * stay in the index so single-character queries like 「按」 still hit.
 */
export function tokenize(text: string): string[] {
  const lowered = text.toLowerCase();
  const tokens: string[] = [];
  for (const word of lowered.split(TOKEN_SPLIT)) {
    if (word) tokens.push(word);
  }
  const chars = [...lowered];
  for (let i = 0; i < chars.length; i += 1) {
    const ch = chars[i] ?? '';
    if (!CJK.test(ch)) continue;
    tokens.push(ch);
    const next = chars[i + 1] ?? '';
    if (next && CJK.test(next)) tokens.push(ch + next);
  }
  return tokens;
}

/** Per-field inverted index for one field bucket. */
class FieldIndex {
  readonly postings = new Map<string, Map<number, number>>();
  readonly lengths: number[] = [];

  add(docId: number, tokens: readonly string[]): void {
    this.lengths[docId] = tokens.length;
    if (tokens.length === 0) return;
    for (const token of tokens) {
      let post = this.postings.get(token);
      if (!post) {
        post = new Map();
        this.postings.set(token, post);
      }
      post.set(docId, (post.get(docId) ?? 0) + 1);
    }
  }
}

/**
 * Bounded top-K min-heap (root = lowest score currently retained).
 *
 * `offer` pushes then — once the heap exceeds K — evicts the root, so the
 * structure never holds more than K entries. (Without the eviction the heap
 * grows with the candidate set: every doc above the floor piled up, and the
 * "top 30" cap silently became "all of them".)
 */
class TopK {
  private heap: Array<{ id: number; score: number }> = [];

  get size(): number {
    return this.heap.length;
  }

  /** Lowest score currently retained (insertion floor). */
  get floor(): number {
    return this.heap.length < TOP_K ? -Infinity : (this.heap[0]?.score ?? -Infinity);
  }

  /** @internal heap ordering — exposed for tests. */
  static less(a: { score: number }, b: { score: number }): boolean {
    return a.score < b.score;
  }

  private swap(a: number, b: number): void {
    [this.heap[a], this.heap[b]] = [this.heap[b]!, this.heap[a]!];
  }

  private siftUp(from: number): void {
    let i = from;
    while (i > 0) {
      const parent = (i - 1) >> 1;
      if (!TopK.less(this.heap[i]!, this.heap[parent]!)) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  private siftDown(from: number): void {
    let i = from;
    for (;;) {
      const l = i * 2 + 1;
      const r = l + 1;
      let m = i;
      if (l < this.heap.length && TopK.less(this.heap[l]!, this.heap[m]!)) m = l;
      if (r < this.heap.length && TopK.less(this.heap[r]!, this.heap[m]!)) m = r;
      if (m === i) break;
      this.swap(i, m);
      i = m;
    }
  }

  /** Remove and return the root (the lowest retained score). */
  private popRoot(): { id: number; score: number } {
    const root = this.heap[0]!;
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.siftDown(0);
    }
    return root;
  }

  offer(id: number, score: number): void {
    if (this.heap.length >= TOP_K && score <= (this.heap[0]?.score ?? 0)) return;
    this.heap.push({ id, score });
    this.siftUp(this.heap.length - 1);
    if (this.heap.length > TOP_K) this.popRoot();
  }

  /** Pop-all → ascending; reverse for the final descending result order. */
  drain(): Array<{ id: number; score: number }> {
    const out: Array<{ id: number; score: number }> = [];
    while (this.heap.length > 0) out.push(this.popRoot());
    out.reverse();
    return out;
  }
}

/** Field scores accumulated per candidate doc during a query. */
interface Acc {
  score: number;
  /** Fields hit, as a bitmask: 1=title, 2=headings, 4=text. */
  fields: number;
  /** Count of query terms matched (for the AND-completeness factor). */
  matched: number;
}

/**
 * The search engine. Build once per corpus revision (module-level singleton in
 * the panel), query on every keystroke — queries are cheap (inverted index).
 */
export class DocsSearchEngine {
  private readonly docs: readonly DocsSearchDoc[];
  private readonly title = new FieldIndex();
  private readonly headings = new FieldIndex();
  private readonly text = new FieldIndex();
  /** Sorted vocabulary for ASCII prefix expansion. */
  private readonly vocab: string[] = [];

  constructor(docs: readonly DocsSearchDoc[]) {
    this.docs = docs;
    for (let id = 0; id < docs.length; id += 1) {
      const doc = docs[id]!;
      this.title.add(id, tokenize(doc.title));
      this.headings.add(id, tokenize(doc.headings.join(' ')));
      this.text.add(id, tokenize(doc.text));
    }
    for (const token of this.title.postings.keys()) this.vocab.push(token);
    for (const token of this.headings.postings.keys()) this.vocab.push(token);
    for (const token of this.text.postings.keys()) this.vocab.push(token);
    this.vocab.sort();
  }

  get size(): number {
    return this.docs.length;
  }

  /** Sorted vocabulary for ASCII prefix expansion. */
  private resolveTerm(term: string): string[] {
    if (CJK.test(term[0] ?? '')) return [term];
    // ASCII: exact token + prefix expansions via binary search.
    const expansions = new Set<string>([term]);
    let lo = 0;
    let hi = this.vocab.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (this.vocab[mid]! < term) lo = mid + 1;
      else hi = mid;
    }
    for (let i = lo; i < this.vocab.length; i += 1) {
      const token = this.vocab[i]!;
      if (!token.startsWith(term)) break;
      expansions.add(token);
      if (expansions.size >= 24) break; // cap prefix fan-out
    }
    return [...expansions];
  }

  /** Score one field bucket for the accumulated docs. */
  private scoreField(
    index: FieldIndex,
    weight: number,
    fieldBit: number,
    terms: readonly string[],
    nDocs: number,
    acc: Map<number, Acc>,
  ): void {
    for (const term of terms) {
      const post = index.postings.get(term);
      if (!post) continue;
      const idf = Math.log(1 + nDocs / post.size);
      for (const [docId, tf] of post) {
        const norm = Math.sqrt(index.lengths[docId] ?? 1);
        const contribution = ((1 + Math.log(tf)) * idf * weight) / norm;
        let cell = acc.get(docId);
        if (!cell) {
          cell = { score: 0, fields: 0, matched: 0 };
          acc.set(docId, cell);
        }
        cell.score += contribution;
        cell.fields |= fieldBit;
      }
    }
  }

  /** Query the index. Empty query → []. */
  search(query: string): DocsSearchHit[] {
    const raw = query.trim().toLowerCase();
    if (!raw) return [];
    const queryTokens = tokenize(raw);
    const terms = dedupeTerms(queryTokens);
    if (terms.length === 0) return [];

    const nDocs = this.docs.length;
    const acc = new Map<number, Acc>();
    const matchedTerms = new Map<number, Set<string>>();

    for (const term of terms) {
      for (const expansion of this.resolveTerm(term)) {
        this.scoreField(this.title, FIELD_WEIGHT.title, 1, [expansion], nDocs, acc);
        this.scoreField(this.headings, FIELD_WEIGHT.headings, 2, [expansion], nDocs, acc);
        this.scoreField(this.text, FIELD_WEIGHT.text, 4, [expansion], nDocs, acc);
      }
    }

    // Per-doc matched-term count（用于 AND 完整度）。
    for (const term of terms) {
      for (const expansion of this.resolveTerm(term)) {
        for (const bucket of [this.title, this.headings, this.text]) {
          const post = bucket.postings.get(expansion);
          if (!post) continue;
          for (const docId of post.keys()) {
            let set = matchedTerms.get(docId);
            if (!set) {
              set = new Set();
              matchedTerms.set(docId, set);
            }
            set.add(term);
          }
        }
      }
    }

    const topK = new TopK();
    for (const [docId, cell] of acc) {
      const matched = matchedTerms.get(docId)?.size ?? 0;
      const completeness = Math.pow(matched / terms.length, 1.5);
      const score = cell.score * completeness;
      if (score > topK.floor) topK.offer(docId, score);
    }

    return topK.drain().map(({ id, score }) => {
      const doc = this.docs[id]!;
      const { snippet, highlight } = buildSnippet(doc, terms);
      return { doc, score, snippet, highlight };
    });
  }
}

/**
 * Query-term preparation.
 *
 * Dedupe; then drop a CJK unigram that is also a character of a query bigram
 * (「按钮按」 keeps the bigrams 「按钮」「钮按」 and drops the noisier unigram
 * 「按」) — the bigrams already carry every adjacent pair, so a covered
 * unigram only adds recall noise. Single-character CJK queries keep their
 * unigram; pure-ASCII queries are untouched.
 */
function dedupeTerms(tokens: readonly string[]): string[] {
  const unique = [...new Set(tokens)];
  const bigramChars = new Set<string>();
  for (const token of unique) {
    if (token.length === 2 && CJK.test(token[0] ?? '') && CJK.test(token[1] ?? '')) {
      bigramChars.add(token[0]!);
      bigramChars.add(token[1]!);
    }
  }
  if (bigramChars.size === 0) return unique;
  return unique.filter((token) => !(token.length === 1 && bigramChars.has(token)));
}

/**
 * Build the body snippet: the earliest body position where any query term
 * occurs, windowed to SNIPPET_LENGTH chars, plus character ranges for every
 * in-window term hit (for the panel's <mark> highlight).
 */
function buildSnippet(
  doc: DocsSearchDoc,
  terms: readonly string[],
): { snippet: string; highlight: Array<[number, number]> } {
  const text = doc.text;
  if (!text) return { snippet: '', highlight: [] };

  const lowered = text.toLowerCase();
  let best = -1;
  for (const term of terms) {
    const at = lowered.indexOf(term.toLowerCase());
    if (at >= 0 && (best < 0 || at < best)) best = at;
  }
  if (best < 0) {
    // Terms hit via prefix expansion / bigrams only — show the doc lead.
    return { snippet: text.slice(0, SNIPPET_LENGTH), highlight: [] };
  }

  const start = Math.max(0, best - 24);
  const end = Math.min(text.length, start + SNIPPET_LENGTH);
  const lead = start > 0 ? '…' : '';
  const tail = end < text.length ? '…' : '';
  const snippet = `${lead}${text.slice(start, end)}${tail}`;
  const snippetLower = snippet.toLowerCase();

  const highlight: Array<[number, number]> = [];
  const seen = new Set<string>();
  for (const term of terms) {
    const needle = term.toLowerCase();
    if (seen.has(needle)) continue;
    seen.add(needle);
    let at = snippetLower.indexOf(needle);
    while (at >= 0) {
      highlight.push([at, at + needle.length]);
      at = snippetLower.indexOf(needle, at + needle.length);
    }
  }
  highlight.sort((a, b) => a[0] - b[0]);
  // Merge overlapping / nested ranges (bigram + unigram hits nest inside each
  // other); the panel renders one <mark> per merged range.
  const merged: Array<[number, number]> = [];
  for (const range of highlight) {
    const last = merged[merged.length - 1];
    if (last && range[0] <= last[1]) last[1] = Math.max(last[1], range[1]);
    else merged.push([range[0], range[1]]);
  }
  return { snippet, highlight: merged };
}
