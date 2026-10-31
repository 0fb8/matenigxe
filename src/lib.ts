import { getCollection } from 'astro:content';
import katex from 'katex';
import { execFileSync } from 'node:child_process';

// 記事が最初にコミットされた時刻。まだコミットしていない記事は今の時刻にする（同じ日の中で先頭に来る）
const createdAt = (filePath?: string) => {
  if (!filePath) return Date.now();
  try {
    const out = execFileSync('git', ['log', '--follow', '--diff-filter=A', '--format=%aI', '--', filePath], { encoding: 'utf8' });
    const first = out.trim().split('\n').pop();
    return first ? new Date(first).getTime() : Date.now();
  } catch {
    return Date.now();
  }
};

// frontmatter の日付の新しい順。同じ日の中は最初にコミットした時刻の新しい順
export async function getNotes() {
  const notes = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  const created = new Map(notes.map((n) => [n.id, createdAt(n.filePath)]));
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || created.get(b.id)! - created.get(a.id)!);
}

export const url = (path: string) => `${import.meta.env.BASE_URL.replace(/\/$/, '')}${path}`;

export const formatDate = (d: Date) => d.toISOString().slice(0, 10);

// 日本語は 1分あたり約500文字として概算
export const readingMinutes = (body = '') => Math.max(1, Math.round(body.length / 500));

// 本文の見出し行（# 〜 ######）の文字を順に返す。コードブロックの中は除く
export const headingLines = (body = '') => {
  let fence = false;
  const out: string[] = [];
  for (const line of body.split('\n')) {
    if (/^\s*(```|~~~)/.test(line)) fence = !fence;
    else if (!fence) {
      const m = line.match(/^#{1,6}\s+(.*?)\s*#*\s*$/);
      if (m) out.push(m[1]);
    }
  }
  return out;
};

const escapeHtml = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);

// 見出し1行分を HTML にする。$...$ は KaTeX、`...` はコードとして表示し、ほかは文字のまま
export const inlineHtml = (text: string) =>
  text
    .split(/(\$[^$]+\$|`[^`]+`)/)
    .map((part) =>
      part.startsWith('$') && part.length > 1
        ? katex.renderToString(part.slice(1, -1), { throwOnError: false })
        : part.startsWith('`') && part.length > 1
          ? `<code>${escapeHtml(part.slice(1, -1))}</code>`
          : escapeHtml(part.replace(/\*\*|__/g, '')),
    )
    .join('');
