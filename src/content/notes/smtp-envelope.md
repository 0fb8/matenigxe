---
title: "SMTP が配送に使うのはエンベロープの MAIL FROM と RCPT TO で、受信者がヘッダーで見る From や To とは別物"
date: 2026-10-11
tags: [network, mail]
---

SMTP がメールを配送するときに見るのは、メールの外側に付けるエンベロープ（封筒）の情報だ。特に送信元の MAIL FROM と宛先の RCPT TO（recipient to）が大事で、エンベロープ From、エンベロープ To とも呼ぶ。これらは、受信者がメールのヘッダーで見る From や To とは別物。

メールにはふだん目にする本文のほかに、From、To、Subject などのヘッダーがある。けれども SMTP から見れば、ヘッダーも本文と同じく、運ぶ中身（ペイロード）にすぎない。SMTP はその中身を封筒に入れ、封筒に書いた宛先を見て配送する。中継するサーバーは、ヘッダーに Received（経由した記録）を書き足すくらいで、配送先の判断にはヘッダーを使わない。

```text
MAIL FROM:<alice@example.com>     ← エンベロープ From
RCPT TO:<bob@example.net>         ← エンベロープ To
RCPT TO:<carol@example.org>       ← 宛先が複数なら RCPT TO を繰り返す
DATA
From: Alice <alice@example.com>   ← ここからが中身（ヘッダー）
To: Bob <bob@example.net>
Subject: hello

本文
.
```

この例では、carol はヘッダーの To に入っていないのに、エンベロープの RCPT TO にあるので届く。Bcc はまさにこの仕組みで、Bcc の宛先はエンベロープにだけ書いて、ヘッダーには残さない。メーリングリストでも、ヘッダーの To はリストのアドレスのまま、エンベロープの宛先だけを参加者それぞれに書き換えて配る。

エンベロープは SMTP の配送のための情報で、メールボックスに届いた時点で役目を終える。そのため、受信者が封筒そのものを見ることはない。ただ、完全に消えるわけではない。最後に配送するサーバーは、エンベロープ From をヘッダーの Return-Path に書き写す。エラーメール（届かなかった通知）は、ヘッダーの From ではなく、このエンベロープ From に返される。
