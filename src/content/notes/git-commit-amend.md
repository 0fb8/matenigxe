---
title: "直前のコミットメッセージを修正する"
date: 2026-10-06
tags: [git]
---

直前のコミットのメッセージを間違えたときは `--amend` で書き換えられる。

```sh
git commit --amend -m "正しいメッセージ"
```

ステージした変更もまとめて直前のコミットに含まれるので、**入れ忘れたファイルを追加する**用途にも使える。

```sh
git add forgotten.txt
git commit --amend --no-edit
```

> push 済みのコミットに使うと履歴が変わるので、`git push --force-with-lease` が必要になる。
