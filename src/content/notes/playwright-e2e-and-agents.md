---
title: "Playwright はブラウザ操作をコードで書く E2E テスト用のライブラリで、MCP や CLI で包むと AI エージェントがブラウザを操作する道具にもなる"
date: 2026-11-08
tags: [ai, programming]
---

Playwright は、Microsoft が開発したオープンソースのライブラリで、ブラウザの操作をコードで書いて自動で実行できる。もとは E2E テストのための道具だが、今は AI エージェントにブラウザを操作させる手段としても使われている。

E2E（エンドツーエンド）テストは、利用者と同じようにブラウザで画面を操作して、アプリが端から端まで正しく動くかを確かめるテストだ。人が毎回手で操作するより、操作をコードにしておいたほうが速く、何度でも同じ手順で確かめられる。Playwright は、主要な3つのブラウザエンジンを同じコードで動かせる。

- Chromium（Chrome・Edge）
- Firefox
- WebKit（Safari）

```ts
import { test, expect } from "@playwright/test";

test("ログインできる", async ({ page }) => {
  await page.goto("https://example.com/login");
  await page.getByLabel("メールアドレス").fill("user@example.com");
  await page.getByRole("button", { name: "ログイン" }).click();
  await expect(page.getByText("ようこそ")).toBeVisible();
});
```

名前の playwright は「劇作家」という意味の英単語だ。wright は古英語の「作る人・働く人」から来ていて、work と同じ系統の語だ。先に Google が作った Puppeteer（人形使い）という似たライブラリがある。当初は Chromium にしか対応していなかった。Playwright は、その Puppeteer の中心メンバーが Microsoft に移って作ったもので、名前も同じく「演じさせる側」になっている。

AI エージェントからブラウザを操作させる場合、Playwright の包み方は主に2通りある。

| 方式 | 仕組み | 特徴 |
| --- | --- | --- |
| Playwright MCP | MCP サーバーとして Claude Code などのハーネスにつなぐ。「クリック」「入力」などの操作が道具の一覧に加わる | 操作ごとにページの状態を詳しく返してくれるが、そのぶんトークンを多く使う |
| Playwright CLI | ふつうのコマンドとして用意し、エージェントがシェルから実行する | 必要な情報だけを読めるので、トークンを節約しやすい |

どちらの方式でも、ページの状態は画面の画像ではなく、アクセシビリティツリーという構造化されたテキストで受け取れる。ボタンや入力欄の役割と名前が並んだものだ。スクリーンショットを見て座標をクリックするより、見た目の変化に強く、トークンも少なくて済む。
