---
title: "言語そのもののバージョン管理は、Python では Rust 製の uv がまとめてこなせるが、Node.js では npm が Node.js の上で動くので nvm などの別ツールに分かれている"
date: 2026-11-03
tags: [programming]
---

ライブラリのバージョンを管理できるようになると、次は言語やランタイムそのもののバージョンもプロジェクトごとに切り替えたくなる。Python では uv がライブラリと Python 本体の両方を扱える。一方 Node.js では、npm とは別の nvm などのツールを使うのが一般的だ。

この違いは、管理ツールが何で動いているかから来ている。

- **uv は Rust 製**で、Python がなくても動く。だから Python 本体をダウンロードして入れたり、切り替えたりする役も引き受けられる。以前は pyenv という別のツールで Python のバージョンを管理していたが、uv を使うなら同じことが uv の中で済む。
- **npm は Node.js で書かれている**ので、動かすにはまず Node.js が要る。ところが、Node.js のバージョンを管理するツールは、Node.js をまだ入れていない状態でも動く必要がある。npm にこの役を持たせると、「Node.js を入れるための npm を動かすのに Node.js が要る」という堂々めぐりになってしまう。そのため、Node.js に頼らない nvm のような別のツールが使われている。nvm はシェルスクリプトで書かれている。

```sh
# Python（uv）
uv python install 3.12
uv python pin 3.12      # .python-version に記録される

# Node.js（nvm）
nvm install 22
nvm use 22              # .nvmrc に書いておけば nvm use だけで切り替わる
```

