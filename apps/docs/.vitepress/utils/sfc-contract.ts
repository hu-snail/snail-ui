/**
 * SFC 契约提取器 —— 只读解析 `.vue`，供文档契约测试使用。
 *
 * 为什么不用 `typescript` 编译器：docs 包没有声明该依赖，而这里只需要
 * 「声明了什么」这一层信息（属性名 / 事件名 / 插槽名），不需要类型求值。
 * 手写扫描器对 AUI 组件统一采用的 `defineProps<{…}>` / `defineEmits<{…}>` /
 * `defineSlots<{…}>` 形态是充分的 —— 它对全部 web 组件的输出已与 TypeScript
 * AST 的解析结果逐项比对一致（见 doc-api-coverage.test.ts）。
 *
 * 约束：组件契约必须以类型字面量声明。若某个 SFC 改用 `defineProps(…)`
 * 运行时对象，这里会解析不到，测试会立刻报缺口（这是期望行为，见 AGENTS §31）。
 */

/** 取出 SFC 里所有 `<script>` 块并拼接（普通 `<script>` 与 `<script setup>` 并存时两块都要）。 */
export function scriptBlocks(source: string): string {
  return [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map((m) => m[1]).join('\n');
}

/** 去掉注释，避免注释里的 `foo:` / `(e: 'x')` 被误当作契约。 */
export function stripComments(code: string): string {
  return code.replace(/\/\*[\s\S]*?\*\//g, ' ').replace(/(^|[^:])\/\/[^\n]*/g, '$1 ');
}

/**
 * 取 `call<…>` 尖括号内的类型体。
 *
 * 深度感知是必要的：属性类型里会出现 `=>`（`() => void`）和嵌套泛型
 * （`Record<string, () => unknown>`），朴素的 `indexOf('>')` 会截断。
 * 只有在花括号 / 圆括号 / 方括号都归零时遇到的 `>` 才是收尾。
 */
export function typeBody(code: string, call: string): string | null {
  const at = code.indexOf(`${call}<`);
  if (at < 0) return null;
  const start = at + call.length + 1;
  let brace = 0;
  let paren = 0;
  let bracket = 0;
  for (let i = start; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{') brace++;
    else if (ch === '}') brace--;
    else if (ch === '(') paren++;
    else if (ch === ')') paren--;
    else if (ch === '[') bracket++;
    else if (ch === ']') bracket--;
    else if (ch === '>' && brace === 0 && paren === 0 && bracket === 0) return code.slice(start, i);
  }
  return null;
}

/** 去掉类型字面量最外层的一对花括号，让成员回到深度 0。 */
function inner(body: string | null): string | null {
  if (!body) return null;
  const trimmed = body.trim();
  return trimmed.startsWith('{') && trimmed.endsWith('}') ? trimmed.slice(1, -1) : trimmed;
}

/** 在深度 0 上收集匹配 `re` 的标识符（跳过嵌套的对象 / 泛型 / 参数列表）。 */
function topLevel(code: string, re: RegExp): string[] {
  const out: string[] = [];
  let depth = 0;
  for (let i = 0; i < code.length; i++) {
    const ch = code[i];
    if (ch === '{' || ch === '(' || ch === '[') {
      depth++;
      continue;
    }
    if (ch === '}' || ch === ')' || ch === ']') {
      depth--;
      continue;
    }
    if (depth !== 0) continue;
    re.lastIndex = i;
    const m = re.exec(code);
    if (!m || m.index !== i) continue;
    out.push(m[1] ?? m[2]);
    i = re.lastIndex - 1;
  }
  return out;
}

/** 插槽名可以写成标识符（`default`）或带连字符的字符串字面量（`'header-extra'`）。 */
function topLevelSlotNames(code: string): string[] {
  return topLevel(code, /(?:'([^']+)'|([A-Za-z_$][\w$]*))\s*\??(?=\s*[:(])/y);
}

export interface SfcContract {
  /** `defineProps<…>` 的属性名，声明顺序。 */
  props: string[];
  /** `defineEmits<…>` 的事件名，声明顺序。 */
  emits: string[];
  /** `defineSlots<…>` + 模板 `<slot>` 的插槽名，声明顺序去重。 */
  slots: string[];
}

/** 纯声明层面的契约（只看 `defineProps` / `defineEmits` / `defineSlots`）。 */
export function extractContract(source: string): SfcContract {
  const code = stripComments(scriptBlocks(source));
  const propsBody = inner(typeBody(code, 'defineProps'));
  const emitsBody = inner(typeBody(code, 'defineEmits'));
  const slotsBody = inner(typeBody(code, 'defineSlots'));
  return {
    props: propsBody ? topLevel(propsBody, /([A-Za-z_$][\w$]*)\s*\??(?=\s*:)/y) : [],
    emits: emitsBody ? [...emitsBody.matchAll(/\(\s*e\s*:\s*'([^']+)'/g)].map((m) => m[1]) : [],
    slots: slotsBody ? topLevelSlotNames(slotsBody) : [],
  };
}

/** 模板里出现、但没有写进 `defineSlots` 的插槽（`<slot />` / `<slot name="x">`）。 */
export function templateSlots(source: string): string[] {
  const template = [...source.matchAll(/<template[^>]*>([\s\S]*)<\/template>/g)]
    .map((m) => m[1])
    .join('\n');
  const out: string[] = [];
  for (const m of template.matchAll(/<slot\b([^>]*)>/g)) {
    const named = m[1].match(/\bname="([^"]+)"/);
    const name = named ? named[1] : 'default';
    if (!out.includes(name)) out.push(name);
  }
  return out;
}

/** 文档需要覆盖的完整契约：声明 + 仅模板里存在的插槽。 */
export function extractFullContract(source: string): SfcContract {
  const contract = extractContract(source);
  const slots = [...contract.slots];
  for (const name of templateSlots(source)) if (!slots.includes(name)) slots.push(name);
  return { ...contract, slots };
}
