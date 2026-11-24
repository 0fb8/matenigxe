---
title: "IAM Roles Anywhere は AWS の外のサーバーが X.509 証明書で認証して IAM ロールの一時認証情報を受け取れるようにし、長期のアクセスキーを置かずに済ませる"
date: 2026-11-25
tags: [aws, security]
---

IAM Roles Anywhere は、オンプレミスのサーバーなど AWS の外で動くワークロードが、X.509 証明書を使って IAM ロールの一時認証情報を受け取れるようにするサービス。組織にすでに PKI があり、サーバーに証明書を配っているなら、その仕組みをそのまま AWS の認証に使える。

AWS の外から AWS の API を呼ぶには、これまで IAM ユーザーのアクセスキーをサーバーに置くことが多かった。アクセスキーは長期の認証情報なので、漏れると無効にするまで使われる。IAM Roles Anywhere では、サーバーは証明書と秘密鍵で自分を証明し、期限付きの一時認証情報だけを受け取る。

設定するものは次のとおり。

| 設定 | 内容 |
| --- | --- |
| トラストアンカー | 信頼する CA。AWS Private CA のほか、自前の CA の証明書を登録できる |
| プロファイル | 引き受けられるロールや、セッションの権限を絞るポリシー |
| IAM ロール | 信頼ポリシーで `rolesanywhere.amazonaws.com` を許可する。証明書の属性で引き受けられる相手を絞れる |

サーバーでは、AWS が配布している署名ヘルパーを AWS CLI や SDK の `credential_process` に設定しておくと、一時認証情報が自動で取得される。

```ini
[profile onprem]
credential_process = aws_signing_helper credential-process --certificate cert.pem --private-key key.pem --trust-anchor-arn <トラストアンカーの ARN> --profile-arn <プロファイルの ARN> --role-arn <ロールの ARN>
```

IAM Roles Anywhere の対象は、人ではなくサーバーやアプリなどのワークロード。人のログインには、これまでどおり IAM Identity Center などの IdP を使う。
