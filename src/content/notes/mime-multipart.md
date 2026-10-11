---
title: "MIME はヘッダーで形式と区切り文字を宣言し、本文を部分ごとに Base64 などで ASCII にして送る、メールの中身の書き方"
date: 2026-10-11
tags: [mail, encoding]
---

SMTP は、もともと ASCII のテキストしか運べない。日本語や画像の添付ファイルを送るために作られたのが MIME で、メールの中身を「どんな形式のデータか」という情報付きで部分ごとに分け、それぞれを ASCII に変換して書く決まり。SMTP の対話そのものは何も変えないので、そのまま組み込める。

SMTP から見れば、ヘッダーも本文も DATA のあとに流すただのテキストだった。MIME はこのテキストの書き方を決めているだけなので、SMTP のサーバーは MIME を知らなくても中継できる。MIME を解釈するのは、受信者のメールソフト（MUA）だ。

まずメール全体のヘッダーで、複数の部分からなることと、部分どうしの区切りに使う文字列（boundary）を宣言する。そして、`--` を付けたその文字列の行で区切りながら、各部分を順に書いていく。最後は、後ろにも `--` を付けた行で終わりを示す。

```text
MIME-Version: 1.0
Subject: =?UTF-8?B?5aCx5ZGK?=
Content-Type: multipart/mixed; boundary="XXXX"

--XXXX
Content-Type: text/plain; charset=UTF-8
Content-Transfer-Encoding: base64

44GT44KT44Gr44Gh44Gv
--XXXX
Content-Type: image/png; name="photo.png"
Content-Disposition: attachment; filename="photo.png"
Content-Transfer-Encoding: base64

iVBORw0KGgoAAAANSUhEUgAA...
--XXXX--
```

この例は、「こんにちは」という本文に画像を1枚添付したメール。各部分にもヘッダーがあり、次の2つで中身を説明する。

| ヘッダー | 意味 | 例 |
| --- | --- | --- |
| Content-Type | どんな形式のデータか | `text/plain`、`text/html`、`image/png` |
| Content-Transfer-Encoding | ASCII にするための変換方式 | `base64`、`quoted-printable`、`7bit` |

`base64` は画像のようなバイナリに向く。`quoted-printable` は、ほとんど ASCII で一部だけ違う文字がある文章に向き、ASCII の部分はそのまま読める形で残る。

ヘッダーは部分に分けられないので、件名のような日本語は別のやり方で書く。上の例の `=?UTF-8?B?5aCx5ZGK?=` は、文字コードが UTF-8、変換方式が B（Base64）という意味で、中身は「報告」。

全部の部分を書き終えたら、SMTP の対話としては `.` だけの行で DATA を終える。サーバーが 250 を返せば、受け渡しは完了する。
