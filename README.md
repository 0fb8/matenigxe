# メモサイト

見かけた小ネタを書き溜める個人用サイト（Astro + Pagefind）。

サイト名・説明文は `site.config.ts` で変更する（ファビコンもサイト名の1文字目から自動生成）。

## 記事を書く

このリポジトリで Claude Code を起動し、`/note <知ったこと>` と打つと、対話のうえ記事を作って commit まで行う（push は手動）。手順とルールは `.claude/skills/note/SKILL.md`。

手で書く場合:

```sh
npm run new -- git-stash "git stash の使い方"   # src/content/notes/git-stash.md ができる
npm run dev                                     # http://localhost:4321 でプレビュー
```

frontmatter:

| 項目    | 説明                                   |
| ------- | -------------------------------------- |
| `title` | タイトル                               |
| `date`  | 日付（一覧はこの新しい順）             |
| `tags`  | `[git, linux]` のように               |
| `draft` | `true` にすると本番ビルドから除外      |

## ビルド

```sh
npm run build     # dist/ に出力 + 検索インデックス生成
npm run preview   # ビルド結果を確認（検索はビルド後のみ動作）
```

`main` に push すると GitHub Actions で GitHub Pages にデプロイされる。
