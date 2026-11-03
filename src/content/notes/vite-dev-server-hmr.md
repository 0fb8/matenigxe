---
title: "Vite は開発中にバンドルせず、ブラウザが求めたファイルだけをその場で変換するので、規模が大きくなっても書き換えがすぐ画面に反映される"
date: 2026-11-03
tags: [programming]
---

Vite は、TypeScript や JSX の変換とバンドルをこなすフロントエンドのビルドツールだ。開発中はバンドルをせず、ブラウザが要求したファイルだけをその場で変換して返す。そのため、プロジェクトが大きくなっても、起動や書き換えの反映がほとんど待たずに済む。

以前主流だった webpack は、開発中でもまず全部のファイルをたどって1つにまとめてから配信していた。大きなプロジェクトでは、起動に数十秒かかることも珍しくなかった。

Vite は、今のブラウザが ES モジュール（`import` 文）を自分で解釈できることを利用している。

1. 開発サーバーは、最初の HTML だけを返す。
2. ブラウザが `import` をたどって、必要なファイルを1つずつ要求する。
3. Vite は、要求されたファイルだけを JavaScript に変換して返す。

まとめる作業がないので、ファイルの数が増えても起動は速いままだ。

HMR（Hot Module Replacement）も、この仕組みの上で速く動く。HMR は、ファイルを書き換えたときに、ページを再読み込みせず、変わったモジュールだけを動いているページの中で差し替える仕組みだ。入力欄の中身などの状態も残る。Vite では変わったファイルだけを変換し直せばよいので、プロジェクトの規模によらずすぐ反映される。エディタとブラウザを並べて、書き換えながら見た目を確かめる試行錯誤がしやすい。

本番向けの `vite build` では、読み込みの回数を減らすため、従来どおりバンドルと圧縮を行う。

`vite` や `vite build` を直接打つことはあまりない。ふつうは `package.json` の `scripts` に登録しておき、npm 経由で呼ぶ。

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

| | 開発中 | 本番向け |
| --- | --- | --- |
| 打つコマンド | `npm run dev` | `npm run build` |
| 実際に動くもの | `vite` | `vite build` |
| バンドル | しない | する |
| 目的 | 変更をすぐ反映する | 配信するファイルを少なく小さくする |

`npm run` は `node_modules/.bin/` にパスを通してからコマンドを実行するので、Vite をプロジェクトに入れるだけで `vite` が使える。

Vite 本体がするのは基本的な変換だけで、ほかの処理はプラグインで足す。たとえば Vue の `.vue` ファイルを扱うには、公式の `@vitejs/plugin-vue` を入れる。React で状態を保ったまま差し替える Fast Refresh を使うには、`@vitejs/plugin-react` を入れる。

プラグインは、npm で配られているものを使うだけでなく、プロジェクトの中で自分で書くこともできる。プラグインは、`name` と、ビルドの決まった段階で呼ばれる関数（フック）を持ったオブジェクトにすぎない。`vite.config.ts` に直接書いて、「ビルドのときにこれをしたい」という処理を差し込める。

```ts
// vite.config.ts
import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

// HTML の %BUILD_TIME% をビルドした時刻に置き換える自作プラグイン
function buildTime(): Plugin {
  return {
    name: "build-time",
    transformIndexHtml(html) {
      return html.replace("%BUILD_TIME%", new Date().toISOString());
    },
  };
}

export default defineConfig({
  plugins: [react(), buildTime()],
});
```

フックには、各ファイルを変換する `transform`、ビルドの始まりと終わりに呼ばれる `buildStart` と `closeBundle`、開発サーバーに手を加える `configureServer` などがある。
