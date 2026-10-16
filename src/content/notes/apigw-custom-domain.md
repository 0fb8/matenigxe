---
title: "API Gateway のカスタムドメインは、Route 53 のエイリアスレコードで受けて、API マッピングで API のステージにつなぐ"
date: 2026-10-17
tags: [aws, dns]
---

API Gateway のカスタムドメインは、`api.example.com` のような自分のドメイン名で API を公開するためのリソース。カスタムドメインは2か所でつなぐ。手前では、Route 53 のエイリアスレコードでドメイン名をカスタムドメインに向ける。奥では、API マッピングでカスタムドメインを API のステージに結びつける。

カスタムドメインを使わないと、API の URL は `https://abc123.execute-api.ap-northeast-1.amazonaws.com/prod` のような自動生成のものになる。API を作り直すと ID が変わり、URL も変わってしまう。カスタムドメインを間に挟めば、利用者に見せる URL を固定したまま、裏の API を差し替えられる。

全体の流れは次のとおり。

```text
api.example.com
  │  Route 53：A レコード（エイリアス）
  ▼
カスタムドメイン（API Gateway が払い出すドメイン名 d-xxxx.execute-api...）
  │  API マッピング
  ▼
API のステージ（例：API「orders」の prod ステージ）
```

各部分の役割は次のとおり。

| 部分 | 設定するもの | ポイント |
| --- | --- | --- |
| Route 53 | A レコードのエイリアス | 向け先は IP アドレスではなく、カスタムドメイン作成時に払い出されるドメイン名 |
| カスタムドメイン | ドメイン名と、ACM の証明書 | HTTPS で受けるので、そのドメインの証明書が必要 |
| API マッピング | API、ステージ、パス | パスを空にすれば、ドメイン直下を1つのステージに結びつけられる |

Route 53 で使う A レコードは、ふつうの A レコードではなくエイリアスレコード。IP アドレスを書くのではなく、AWS のリソースを向け先に選ぶ。API Gateway の裏の IP アドレスは固定されていないので、IP を直接書くことはできない。エイリアスなら、Route 53 が向け先の最新のアドレスを返してくれる。

API マッピングでパスを分ければ、1つのドメインの下に複数の API をまとめられる。

```text
api.example.com/orders  →  API「orders」の prod ステージ
api.example.com/users   →  API「users」の prod ステージ
```

証明書は AWS Certificate Manager（ACM）で用意する。エンドポイントの種類がリージョンの場合は、API と同じリージョンの証明書を使う。エッジ最適化の場合は、バージニア北部（us-east-1）の証明書が必要になる。
