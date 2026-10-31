# メモサイト

見かけた小ネタを書き溜める個人用サイト（Astro + Pagefind）。

サイト名・説明文は `site.config.ts` で変更する（ファビコンもサイト名の1文字目から自動生成）。

## 記事を書く

このリポジトリで Claude Code を起動し、`/note <知ったこと>` と打つと、対話のうえ記事を作って commit まで行う（push は手動）。手順とルールは `.claude/skills/note/SKILL.md`。

見出しのある長めの記事は `/longnote <内容>` で作る（`long: true` 付き。手順は `.claude/skills/longnote/SKILL.md`）。

手で書く場合:

```sh
npm run new -- git-stash "git stash の使い方"   # src/content/notes/git-stash.md ができる
npm run new -- --long group-theory "群論入門"     # long: true 付きで作る
npm run dev                                     # http://localhost:4321 でプレビュー
```

frontmatter:

| 項目    | 説明                                   |
| ------- | -------------------------------------- |
| `title` | タイトル                               |
| `date`  | 日付（一覧はこの新しい順）             |
| `tags`  | `[git, linux]` のように               |
| `draft` | `true` にすると本番ビルドから除外      |
| `long`  | `true` にすると長めの記事として扱う（トップページの別枠に並べ、一覧に印を付け、記事ページに `##`・`###` の見出しから目次を付ける） |

数式は LaTeX 記法で書ける（文中は `$...$`、別の行は `$$...$$`。ビルド時に KaTeX で表示）。数式ではない `$` は `\$` と書く。

## ビルド

```sh
npm run build     # dist/ に出力 + 検索インデックス生成
npm run preview   # ビルド結果を確認（検索はビルド後のみ動作）
```

`main` に push すると GitHub Actions で GitHub Pages にデプロイされる。
