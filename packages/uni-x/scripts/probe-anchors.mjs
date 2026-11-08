// One-off probe: report all patch anchors that no longer match @snui/uni sources.
import { readFileSync } from 'node:fs';

const src = readFileSync('src/transform/patches.ts', 'utf8');
const fileBlocks = [...src.matchAll(/'([a-z0-9-]+\/[a-z0-9-]+\.vue)': \[/g)];
let ok = 0;
const missing = [];
for (const fb of fileBlocks) {
  const file = fb[1];
  const start = fb.index;
  const nextBlock = src.indexOf("\n  '", start + 10);
  const seg = src.slice(start, nextBlock === -1 ? src.length : nextBlock);
  const source = readFileSync('../uni/src/components/' + file, 'utf8');
  const anchors = [...seg.matchAll(/anchor: (`(?:[^`]*)`|'(?:[^'\\]|\\.)*')/g)];
  for (const a of anchors) {
    let val = a[1];
    if (val.startsWith('`')) val = val.slice(1, -1);
    else val = val.slice(1, -1).replace(/\\'/g, "'");
    if (source.includes(val)) ok++;
    else missing.push({ file, val });
  }
}
for (const m of missing)
  console.log('MISSING in', m.file, ':', JSON.stringify(m.val.slice(0, 110)));
console.log('anchors ok:', ok, '| missing:', missing.length);
