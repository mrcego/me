/**
 * Reorder Vue SFCs to: <script> → <template> → <style>
 * (vue-best-practices / Volar preferred order)
 *
 * Usage:
 *   node scripts/reorder-sfc-blocks.mjs --check
 *   node scripts/reorder-sfc-blocks.mjs --write
 */
import { createRequire } from 'node:module';
import { readdirSync, readFileSync, writeFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const require = createRequire(import.meta.url);
const {
  parse,
} = require('../node_modules/.pnpm/@vue+compiler-sfc@3.5.39/node_modules/@vue/compiler-sfc/dist/compiler-sfc.cjs.js');

const write = process.argv.includes('--write');

function walk(dir) {
  /** @type {string[]} */
  const out = [];
  for (const name of readdirSync(dir)) {
    if (name === 'node_modules' || name.startsWith('.')) continue;
    const full = join(dir, name);
    const st = statSync(full);
    if (st.isDirectory()) out.push(...walk(full));
    else if (name.endsWith('.vue')) out.push(full);
  }
  return out;
}

/**
 * compiler-sfc `loc` covers inner content only — expand to include the tags.
 * @param {string} source
 * @param {{ loc: { start: { offset: number }, end: { offset: number } } }} block
 * @param {string} tagName
 */
function fullBlockSource(source, block, tagName) {
  const openRe = new RegExp(`<${tagName}\\b[^>]*>`, 'gi');
  let openStart = -1;
  let m;
  while ((m = openRe.exec(source)) !== null) {
    const tagEnd = m.index + m[0].length;
    if (tagEnd <= block.loc.start.offset) {
      openStart = m.index;
    } else {
      break;
    }
  }
  if (openStart < 0) {
    throw new Error(`Could not find opening <${tagName}> for block`);
  }

  const closeTag = `</${tagName}>`;
  const closeStart = source.indexOf(closeTag, block.loc.end.offset);
  if (closeStart < 0) {
    throw new Error(`Could not find closing ${closeTag}`);
  }

  return source.slice(openStart, closeStart + closeTag.length);
}

/**
 * @param {string} source
 * @param {import('@vue/compiler-sfc').SFCDescriptor} descriptor
 */
function leadingTrivia(source, descriptor) {
  const starts = [];
  for (const block of [
    descriptor.script,
    descriptor.scriptSetup,
    descriptor.template,
    ...descriptor.styles,
    ...(descriptor.customBlocks || []),
  ]) {
    if (!block) continue;
    const tag = block.type;
    const openRe = new RegExp(`<${tag}\\b[^>]*>`, 'gi');
    let openStart = -1;
    let m;
    while ((m = openRe.exec(source)) !== null) {
      const tagEnd = m.index + m[0].length;
      if (tagEnd <= block.loc.start.offset) openStart = m.index;
      else break;
    }
    if (openStart >= 0) starts.push(openStart);
  }
  if (starts.length === 0) return '';
  return source.slice(0, Math.min(...starts)).replace(/\s+$/, '');
}

/**
 * @param {string} source
 */
function reorder(source) {
  const { descriptor, errors } = parse(source, { pad: false });
  if (errors?.length) {
    throw new Error(errors.map((e) => e.message).join('\n'));
  }

  /** @type {string[]} */
  const parts = [];
  const lead = leadingTrivia(source, descriptor);
  if (lead) parts.push(lead);

  if (descriptor.script) parts.push(fullBlockSource(source, descriptor.script, 'script'));
  if (descriptor.scriptSetup) parts.push(fullBlockSource(source, descriptor.scriptSetup, 'script'));
  if (descriptor.template) parts.push(fullBlockSource(source, descriptor.template, 'template'));
  for (const style of descriptor.styles) {
    parts.push(fullBlockSource(source, style, 'style'));
  }
  for (const block of descriptor.customBlocks || []) {
    parts.push(fullBlockSource(source, block, block.type));
  }

  let next = parts.join('\n\n');
  if (!next.endsWith('\n')) next += '\n';
  return next;
}

/** @param {string} source */
function isWrongOrder(source) {
  const { descriptor } = parse(source, { pad: false });
  const blocks = [];
  if (descriptor.script) {
    blocks.push({ type: 'script', offset: descriptor.script.loc.start.offset });
  }
  if (descriptor.scriptSetup) {
    blocks.push({ type: 'script', offset: descriptor.scriptSetup.loc.start.offset });
  }
  if (descriptor.template) {
    blocks.push({ type: 'template', offset: descriptor.template.loc.start.offset });
  }
  for (const style of descriptor.styles) {
    blocks.push({ type: 'style', offset: style.loc.start.offset });
  }
  blocks.sort((a, b) => a.offset - b.offset);

  const rank = { script: 0, template: 1, style: 2 };
  let last = -1;
  for (const b of blocks) {
    const r = rank[b.type];
    if (r < last) return true;
    last = r;
  }
  return false;
}

/** Sanity: rewritten SFC must still parse with the same block contents. */
function assertSameContents(before, after) {
  const a = parse(before, { pad: false }).descriptor;
  const b = parse(after, { pad: false }).descriptor;
  const norm = (d) =>
    JSON.stringify({
      script: d.script?.content ?? null,
      scriptSetup: d.scriptSetup?.content ?? null,
      template: d.template?.content ?? null,
      styles: d.styles.map((s) => s.content),
    });
  if (norm(a) !== norm(b)) {
    throw new Error('Reorder changed block contents');
  }
}

const root = join(process.cwd(), 'app');
const files = walk(root);
let wrong = 0;
let rewritten = 0;

for (const file of files) {
  const source = readFileSync(file, 'utf8');
  if (!isWrongOrder(source)) continue;
  wrong += 1;
  const rel = relative(process.cwd(), file);
  const next = reorder(source);
  assertSameContents(source, next);
  if (write) {
    writeFileSync(file, next, 'utf8');
    rewritten += 1;
    console.log(`fixed: ${rel}`);
  } else {
    console.log(`needs fix: ${rel}`);
  }
}

console.log(
  write
    ? `[sfc] rewrote ${rewritten}/${wrong} files (of ${files.length} SFCs)`
    : `[sfc] ${wrong}/${files.length} SFCs need reorder (pass --write to apply)`,
);
