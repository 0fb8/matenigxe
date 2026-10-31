// 使い方: npm run new -- [--long] <slug> [タイトル]
import { writeFileSync, existsSync } from 'node:fs';

const args = process.argv.slice(2);
const long = args.includes('--long');
const [slug, ...titleParts] = args.filter((a) => a !== '--long');
if (!slug) {
  console.error('使い方: npm run new -- [--long] <slug> [タイトル]');
  process.exit(1);
}
const path = `src/content/notes/${slug}.md`;
if (existsSync(path)) {
  console.error(`${path} はすでに存在します`);
  process.exit(1);
}
const today = new Date().toLocaleDateString('sv-SE');
writeFileSync(path, `---
title: "${titleParts.join(' ') || slug}"
date: ${today}
tags: []
${long ? 'long: true\n' : ''}---

`);
console.log(`作成しました: ${path}`);
