---
title: "言語そのもののバージョン管理は、Python では Rust 製の uv がまとめてこなせるが、Node.js では npm が Node.js の上で動くので nvm などの別ツールに分かれている"
date: 2026-11-03
tags: [programming]
---

ライブラリのバージョンを管理できるようになると、次は言語やランタイムそのもののバージョンもプロジェクトごとに切り替えたくなる。Python では uv がライブラリと Python 本体の両方を扱える。一方 Node.js では、npm とは別の nvm などのツールを使うのが一般的だ。

この違いは、管理ツールが何で動いているかから来ている。

- **uv は Rust 製**で、Python がなくても動く。だから Python 本体をダウンロードして入れたり、切り替えたりする役も引き受けられる。以前は pyenv という別のツールで Python のバージョンを管理していたが、uv を使うなら同じことが uv の中で済む。
- **npm は Node.js で書かれている**ので、動かすにはまず Node.js が要る。npm で Node.js そのものを入れ替えようとすると、「Node.js を入れるための npm を動かすのに Node.js が要る」という堂々めぐりになり、扱いにくい。そのため Node.js のバージョン管理は、Node.js に頼らないツールに任されてきた。代表の nvm はシェルスクリプトで書かれている。

```sh
# Python（uv）
uv python install 3.12
uv python pin 3.12      # .python-version に記録される

# Node.js（nvm）
nvm install 22
nvm use 22              # .nvmrc に書いておけば nvm use だけで切り替わる
```

Node.js でも、Node.js に依存しない作りにすれば、ランタイムの管理を取り込める。

| ツール | 作り | できること |
| --- | --- | --- |
| nvm | シェルスクリプト | Node.js のバージョン管理だけ |
| fnm・Volta | Rust 製 | Node.js（Volta は npm や yarn も）のバージョン管理 |
| mise | Rust 製 | Node.js・Python など複数の言語のバージョン管理 |
| pnpm | 単体の実行ファイルでも配布 | ライブラリ管理に加え、`pnpm env` で Node.js も切り替えられる |

Volta は Rust 製なので、Node.js 版の uv のように見える。しかし実際には、Node.js と npm・yarn などのツールのバージョンを管理するもので、ライブラリの管理は npm などに任せる。ライブラリと Node.js 本体を1つで扱えるという点では、pnpm のほうが uv に近い。
