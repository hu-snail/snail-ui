/**
 * .vue → .uvue transform entry (ADR-0004).
 *
 * Pipeline per SFC: anchored patches → block parse → per-block transforms
 * (script / template / css) → reassembly. Stray SFC content is dropped with
 * an issue. Pure function: same input always yields same output + issues.
 */

import { transformCss } from './css.ts';
import { applyPatches } from './patches.ts';
import { transformScript } from './script.ts';
import { parseSfc } from './sfc.ts';
import { transformTemplate } from './template.ts';
import type { CssTransformResult, TextTransformResult, TransformIssue } from './types.ts';

export interface UvueTransformResult {
  code: string;
  issues: TransformIssue[];
}

export function transformVueToUvue(source: string, relPath: string): UvueTransformResult {
  const issues: TransformIssue[] = [];
  const patched: string = applyPatches(source, relPath, issues);
  const sfc = parseSfc(patched);
  if (sfc.stray !== '') {
    issues.push({
      file: relPath,
      kind: 'stray-sfc-content',
      detail: `${sfc.stray.split('\n').length} stray line(s) outside SFC blocks dropped`,
    });
  }

  const out: string[] = [];
  for (const block of sfc.blocks) {
    const attrText: string = block.attrs !== '' ? ` ${block.attrs}` : '';
    if (block.tag === 'script') {
      const r: TextTransformResult = transformScript(block.content, relPath);
      issues.push(...r.issues);
      out.push(`<script${attrText}>${r.code}</script>`);
    } else if (block.tag === 'template') {
      const r: TextTransformResult = transformTemplate(block.content, relPath);
      issues.push(...r.issues);
      out.push(`<template${attrText}>${r.code}</template>`);
    } else {
      const r: CssTransformResult = transformCss(block.content, 'component', relPath);
      issues.push(...r.issues);
      out.push(`<style${attrText}>${r.css}</style>`);
    }
  }
  return { code: out.join('\n'), issues };
}

export { transformCss } from './css.ts';
export { applyPatches, PATCHES } from './patches.ts';
export { transformScript } from './script.ts';
export { parseSfc } from './sfc.ts';
export { transformTemplate } from './template.ts';
export type { CssMode, CssTransformResult, IssueKind, TextTransformResult, TransformIssue } from './types.ts';
