import { describe, expect, it } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';

const BLOCKED = new Set([
  // emoji / dingbat / symbol ranges
  ...Array.from({ length: 0x1faff - 0x1f300 + 1 }, (_, i) => 0x1f300 + i),
  ...Array.from({ length: 0x27bf - 0x2600 + 1 }, (_, i) => 0x2600 + i),
  ...Array.from({ length: 0x2bff - 0x2b00 + 1 }, (_, i) => 0x2b00 + i),
  ...Array.from({ length: 0x1f2ff - 0x1f000 + 1 }, (_, i) => 0x1f000 + i),
  0xfe0f, // variation selector-16
  // glyphs deliberately replaced with SVG icons
  0x2022, // bullet
  0x2192, // rightwards arrow
  0x2191, // upwards arrow
  0x2193, // downwards arrow
  0x25b2, // up-pointing triangle
  0x25bc, // down-pointing triangle
]);

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'src');
const HTML = path.join(ROOT, 'index.html');
const SELF_SUFFIX = 'noEmoji.test.ts';

function* walkFiles(dir: string): Generator<string> {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) yield* walkFiles(full);
    else if (entry.isFile() && /\.(ts|tsx|css|html)$/.test(entry.name)) yield full;
  }
}

function findViolations(file: string): string[] {
  const violations: string[] = [];
  const text = fs.readFileSync(file, 'utf-8');
  const lines = text.split('\n');
  for (let li = 0; li < lines.length; li++) {
    for (const ch of lines[li]) {
      const cp = ch.codePointAt(0);
      if (cp !== undefined && BLOCKED.has(cp)) {
        violations.push(`${path.relative(ROOT, file)}:${li + 1}`);
      }
    }
  }
  return violations;
}

describe('no emoji glyphs in app code', () => {
  it('src and index.html contain no emoji or replaced glyph characters', () => {
    const violations: string[] = [];
    for (const file of walkFiles(SRC)) {
      if (file.endsWith(SELF_SUFFIX)) continue;
      violations.push(...findViolations(file));
    }
    if (fs.existsSync(HTML)) violations.push(...findViolations(HTML));
    expect(violations.sort()).toEqual([]);
  });
});
