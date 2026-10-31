import { getCollection } from 'astro:content';
import katex from 'katex';
import { execFileSync } from 'node:child_process';
import { relative, resolve, sep } from 'node:path';

// 記事ごとの、最初にコミットされた時刻。git log を1回だけ実行して古い順にたどり、
// リネームされた記事は元のファイルの時刻を引き継ぐ（git log --follow と同じ結果になる）
const loadCreatedTimes = () => {
  const created = new Map<string, number>();
  try {
    const out = execFileSync('git', ['log', '--reverse', '-M', '--name-status', '--format=@%aI', '--', 'src/content/notes'], {
      encoding: 'utf8',
      maxBuffer: 64 * 1024 * 1024,
    });
    let time = 0;
    for (const line of out.split('\n')) {
      if (line.startsWith('@')) time = new Date(line.slice(1)).getTime();
      else if (line.startsWith('A\t')) created.set(line.slice(2), created.get(line.slice(2)) ?? time);
      else if (line.startsWith('R')) {
        const [, from, to] = line.split('\t');
        created.set(to, created.get(from) ?? time);
      }
    }
  } catch {}
  return created;
};

// まだコミットしていない記事は今の時刻にする（同じ日の中で先頭に来る）
const createdAt = (created: Map<string, number>, filePath?: string) =>
  (filePath && created.get(relative(process.cwd(), resolve(filePath)).split(sep).join('/'))) || Date.now();

// frontmatter の日付の新しい順。同じ日の中は最初にコミットした時刻の新しい順
const loadNotes = async () => {
  const notes = await getCollection('notes', ({ data }) => import.meta.env.DEV || !data.draft);
  const created = loadCreatedTimes();
  const at = new Map(notes.map((n) => [n.id, createdAt(created, n.filePath)]));
  return notes.sort((a, b) => b.data.date.getTime() - a.data.date.getTime() || at.get(b.id)! - at.get(a.id)!);
};

// ビルド中は何ページからも呼ばれるので結果を使い回す。dev では記事の追加・変更を反映するため毎回読み直す
let cached: ReturnType<typeof loadNotes> | undefined;
export function getNotes() {
  if (import.meta.env.DEV) return loadNotes();
  return (cached ??= loadNotes());
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

// タイトルを HTML にする（$...$ の数式を KaTeX で表示）
export const titleHtml = (title: string) => inlineHtml(title);

// タイトルの数式を、ブラウザのタブや検索結果に出せる文字だけの形にする
export const plainTitle = (title: string) =>
  title.replace(/\$([^$]+)\$/g, (_, tex: string) =>
    tex
      .replace(/\\mathfrak\{([a-z])\}/g, (_m, c: string) => String.fromCodePoint(0x1d51e + c.charCodeAt(0) - 97))
      .replace(/\\sqrt\{([^{}]+)\}/g, (_m, x: string) => (x.length === 1 ? `√${x}` : `√(${x})`))
      .replace(/\\[a-zA-Z]+\s?/g, '')
      .replace(/[{}]/g, ''),
  );
