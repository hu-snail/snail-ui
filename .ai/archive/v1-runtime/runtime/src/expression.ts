/**
 * AUI Safe Expression Engine (AUI-BINDING-002).
 *
 * Per AGENTS.md §23 (禁止动态代码执行) and §24 (Binding 受控 Context):
 *   - No `eval()` / `new Function()` — implemented as a recursive-descent parser
 *     over a tiny AST.
 *   - The expression grammar only references identifiers from the supplied
 *     `BindingContext` (state / props / computed / args). It cannot read
 *     `window`, `document`, `globalThis`, etc.
 *
 * Supported grammar:
 *   expr       := ternary
 *   ternary    := logical ('?' expr ':' expr)?
 *   logical    := equality (('&&' | '||') equality)*
 *   equality   := compare (('===' | '!==' | '==' | '!=' | '<' | '>' | '<=' | '>=') compare)*
 *   compare    := additive (('+' | '-') additive)*
 *   additive   := multiplicative (('*' | '/' | '%') multiplicative)*
 *   multiplicative := unary
 *   unary      := ('!' | '+' | '-')? primary
 *   primary    := literal | identifier | '(' expr ')' | pathAccess
 *   pathAccess := identifier ('.' identifier | '[' integer | string ']')*
 *   literal    := number | string | true | false | null
 *   identifier := [a-zA-Z_][a-zA-Z0-9_]*
 *
 * Phase 1 limits: paths only index by `.identifier` (no computed keys).
 * Object literals / array literals / function calls are intentionally NOT
 * supported — they expand the attack surface and are not required by WBS.
 */

import { createAUIError, type AUIError } from './error.js';

/** BindingContext — the only namespace the expression engine can read. */
export interface BindingContext {
  readonly state: Record<string, unknown>;
  readonly props: Record<string, unknown>;
  readonly computed: Readonly<Record<string, unknown>>;
  readonly args?: Readonly<Record<string, unknown>>;
}

type ASTNode =
  | { kind: 'literal'; value: unknown }
  | { kind: 'ident'; name: string }
  | { kind: 'path'; segments: readonly string[] }
  | { kind: 'unary'; op: '!' | '+' | '-'; operand: ASTNode }
  | { kind: 'binary'; op: BinaryOp; left: ASTNode; right: ASTNode }
  | { kind: 'ternary'; test: ASTNode; consequent: ASTNode; alternate: ASTNode };

type BinaryOp =
  | '+' | '-' | '*' | '/' | '%'
  | '===' | '!==' | '==' | '!='
  | '<' | '>' | '<=' | '>='
  | '&&' | '||';

/** Token kinds. */
type Token =
  | { kind: 'num'; value: number }
  | { kind: 'str'; value: string }
  | { kind: 'ident'; value: string }
  | { kind: 'punct'; value: string }
  | { kind: 'eof' };

const PUNCT_TOKENS = [
  '===', '!==', '==', '!=',
  '<=', '>=', '<', '>',
  '&&', '||',
  '+', '-', '*', '/', '%',
  '?', ':', '(', ')', '.', '[', ']', '!',
] as const;

function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < src.length) {
    const c = src[i]!;
    if (c === ' ' || c === '\t' || c === '\n' || c === '\r') {
      i++;
      continue;
    }
    if (c === '"' || c === "'") {
      const quote = c;
      i++;
      let buf = '';
      while (i < src.length && src[i] !== quote) {
        if (src[i] === '\\' && i + 1 < src.length) {
          const next = src[i + 1]!;
          if (next === 'n') buf += '\n';
          else if (next === 't') buf += '\t';
          else if (next === 'r') buf += '\r';
          else if (next === '\\') buf += '\\';
          else if (next === quote) buf += quote;
          else buf += next;
          i += 2;
          continue;
        }
        buf += src[i];
        i++;
      }
      if (i >= src.length) throw exprError(`Unterminated string literal`, src);
      i++; // closing quote
      tokens.push({ kind: 'str', value: buf });
      continue;
    }
    if (c >= '0' && c <= '9') {
      let j = i;
      while (j < src.length && ((src[j]! >= '0' && src[j]! <= '9') || src[j] === '.')) {
        j++;
      }
      const text = src.slice(i, j);
      const value = Number(text);
      if (Number.isNaN(value)) throw exprError(`Invalid number literal "${text}"`, src);
      tokens.push({ kind: 'num', value });
      i = j;
      continue;
    }
    if ((c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_') {
      let j = i;
      while (j < src.length && /[a-zA-Z0-9_]/.test(src[j]!)) {
        j++;
      }
      const text = src.slice(i, j);
      if (text === 'true' || text === 'false' || text === 'null') {
        tokens.push({ kind: 'ident', value: text });
      } else {
        tokens.push({ kind: 'ident', value: text });
      }
      i = j;
      continue;
    }
    // Punctuation — match longest first.
    let matched = false;
    for (const p of PUNCT_TOKENS) {
      if (src.startsWith(p, i)) {
        tokens.push({ kind: 'punct', value: p });
        i += p.length;
        matched = true;
        break;
      }
    }
    if (!matched) {
      throw exprError(`Unexpected character "${c}"`, src);
    }
  }
  tokens.push({ kind: 'eof' });
  return tokens;
}

function exprError(message: string, expr: string): AUIError {
  return createAUIError({
    code: 'AUI_EXPRESSION_INVALID',
    message,
    source: 'binding',
    severity: 'error',
    hint: `Expression: ${expr.slice(0, 80)}`,
  });
}

/** Recursive-descent parser. */
function parseExpression(tokens: Token[], expr: string): ASTNode {
  let pos = 0;

  function peek(): Token {
    return tokens[pos]!;
  }
  function consume(): Token {
    return tokens[pos++]!;
  }
  function expectPunct(value: string): void {
    const t = peek();
    if (t.kind !== 'punct' || t.value !== value) {
      throw exprError(`Expected "${value}"`, expr);
    }
    consume();
  }

  function parseTernary(): ASTNode {
    const test = parseLogical();
    if (peek().kind === 'punct' && (peek() as { kind: 'punct'; value: string }).value === '?') {
      consume();
      const consequent = parseTernary();
      expectPunct(':');
      const alternate = parseTernary();
      return { kind: 'ternary', test, consequent, alternate };
    }
    return test;
  }

  function parseLogical(): ASTNode {
    let left = parseEquality();
    while (peek().kind === 'punct') {
      const op = (peek() as { kind: 'punct'; value: string }).value;
      if (op !== '&&' && op !== '||') break;
      consume();
      const right = parseEquality();
      left = { kind: 'binary', op: op as BinaryOp, left, right };
    }
    return left;
  }

  function parseEquality(): ASTNode {
    let left = parseAdditive();
    while (peek().kind === 'punct') {
      const op = (peek() as { kind: 'punct'; value: string }).value;
      if (op !== '===' && op !== '!==' && op !== '==' && op !== '!='
        && op !== '<' && op !== '>' && op !== '<=' && op !== '>=') break;
      consume();
      const right = parseAdditive();
      left = { kind: 'binary', op: op as BinaryOp, left, right };
    }
    return left;
  }

  function parseAdditive(): ASTNode {
    let left = parseMultiplicative();
    while (peek().kind === 'punct') {
      const op = (peek() as { kind: 'punct'; value: string }).value;
      if (op !== '+' && op !== '-') break;
      consume();
      const right = parseMultiplicative();
      left = { kind: 'binary', op: op as BinaryOp, left, right };
    }
    return left;
  }

  function parseMultiplicative(): ASTNode {
    let left = parseUnary();
    while (peek().kind === 'punct') {
      const op = (peek() as { kind: 'punct'; value: string }).value;
      if (op !== '*' && op !== '/' && op !== '%') break;
      consume();
      const right = parseUnary();
      left = { kind: 'binary', op: op as BinaryOp, left, right };
    }
    return left;
  }

  function parseUnary(): ASTNode {
    if (peek().kind === 'punct') {
      const op = (peek() as { kind: 'punct'; value: string }).value;
      if (op === '!' || op === '+' || op === '-') {
        consume();
        return { kind: 'unary', op: op as '!' | '+' | '-', operand: parseUnary() };
      }
    }
    return parsePrimary();
  }

  function parsePrimary(): ASTNode {
    const t = peek();
    if (t.kind === 'num') {
      consume();
      return { kind: 'literal', value: t.value };
    }
    if (t.kind === 'str') {
      consume();
      return { kind: 'literal', value: t.value };
    }
    if (t.kind === 'ident') {
      consume();
      if (t.value === 'true') return { kind: 'literal', value: true };
      if (t.value === 'false') return { kind: 'literal', value: false };
      if (t.value === 'null') return { kind: 'literal', value: null };
      // Path access?
      const segments: string[] = [t.value];
      while (peek().kind === 'punct' && (peek() as { kind: 'punct'; value: string }).value === '.') {
        consume();
        const next = peek();
        if (next.kind !== 'ident') throw exprError(`Expected identifier after "."`, expr);
        consume();
        segments.push(next.value);
      }
      if (segments.length === 1) return { kind: 'ident', name: segments[0]! };
      return { kind: 'path', segments };
    }
    if (t.kind === 'punct' && (t as { kind: 'punct'; value: string }).value === '(') {
      consume();
      const inner = parseTernary();
      expectPunct(')');
      return inner;
    }
    throw exprError(`Unexpected token at position ${pos}`, expr);
  }

  const node = parseTernary();
  if (peek().kind !== 'eof') {
    throw exprError(`Unexpected trailing tokens`, expr);
  }
  return node;
}

/** Evaluate an AST against a BindingContext. */
function evaluate(node: ASTNode, ctx: BindingContext): unknown {
  switch (node.kind) {
    case 'literal':
      return node.value;
    case 'ident': {
      const root = node.name;
      if (root === 'state') return ctx.state;
      if (root === 'props') return ctx.props;
      if (root === 'computed') return ctx.computed;
      if (root === 'args') return ctx.args ?? {};
      return (ctx as unknown as Record<string, unknown>)[root];
    }
    case 'path': {
      const [head, ...rest] = node.segments;
      if (!head) return undefined;
      let base: unknown;
      if (head === 'state') base = ctx.state;
      else if (head === 'props') base = ctx.props;
      else if (head === 'computed') base = ctx.computed;
      else if (head === 'args') base = ctx.args ?? {};
      else base = (ctx as unknown as Record<string, unknown>)[head];
      for (const seg of rest) {
        if (base === null || base === undefined) return undefined;
        base = (base as Record<string, unknown>)[seg];
      }
      return base;
    }
    case 'unary': {
      const v = evaluate(node.operand, ctx);
      if (node.op === '!') return !v;
      if (node.op === '+') return +(v as number);
      if (node.op === '-') return -(v as number);
      return undefined;
    }
    case 'binary': {
      const l = evaluate(node.left, ctx);
      const r = evaluate(node.right, ctx);
      switch (node.op) {
        case '+': return (l as number) + (r as number);
        case '-': return (l as number) - (r as number);
        case '*': return (l as number) * (r as number);
        case '/': return (l as number) / (r as number);
        case '%': return (l as number) % (r as number);
        case '===': return l === r;
        case '!==': return l !== r;
        case '==': return l == r; // eslint-disable-line eqeqeq
        case '!=': return l != r; // eslint-disable-line eqeqeq
        case '<': return (l as number) < (r as number);
        case '>': return (l as number) > (r as number);
        case '<=': return (l as number) <= (r as number);
        case '>=': return (l as number) >= (r as number);
        case '&&': return l && r;
        case '||': return l || r;
        default: return undefined;
      }
    }
    case 'ternary': {
      const test = evaluate(node.test, ctx);
      return test ? evaluate(node.consequent, ctx) : evaluate(node.alternate, ctx);
    }
    default:
      return undefined;
  }
}

/** Compile an expression once for repeated evaluation. */
export interface CompiledExpression {
  readonly source: string;
  evaluate(ctx: BindingContext): unknown;
}

export function compileExpression(source: string): CompiledExpression {
  const tokens = tokenize(source);
  const ast = parseExpression(tokens, source);
  return {
    source,
    evaluate(ctx: BindingContext): unknown {
      return evaluate(ast, ctx);
    },
  };
}

/** Convenience: compile + evaluate in one shot. */
export function evaluateExpression(source: string, ctx: BindingContext): unknown {
  return compileExpression(source).evaluate(ctx);
}