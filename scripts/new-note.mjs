// 使い方: npm run new -- <slug> [タイトル]
import { writeFileSync, existsSync } from 'node:fs';

const [slug, ...titleParts] = process.argv.slice(2);
if (!slug) {
  console.error('使い方: npm run new -- <slug> [タイトル]');
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
---

`);
console.log(`作成しました: ${path}`);
