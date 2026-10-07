---
title: "aws login はコンソールのサインインで AWS CLI を使えるようにするコマンドで、aws sso login の後継ではない"
date: 2026-10-08
tags: [aws]
---

AWS CLI v2.32.0 で `aws login` が加わった。マネジメントコンソールにサインインするときと同じ方法でブラウザからログインすると、CLI や SDK 用の一時的な認証情報が発行される。アクセスキーを手元に置かずに済むのがいちばんの利点。

```sh
aws login                      # default プロファイル
aws login --profile my-dev     # 名前付きプロファイル
aws login --remote             # ブラウザのない環境（URL を別の端末で開く）
aws logout                     # キャッシュした認証情報を消す
```

初めてログインすると、プロファイルが `~/.aws/config` に自動で書き込まれる。中身は、どの IAM ユーザーやロールでログインしたかと、リージョンだけ。

```ini
[default]
login_session = arn:aws:iam::123456789012:user/username
region = us-east-1
```

一時的な認証情報は `~/.aws/login/cache` に保存され、CLI が自動で更新する。ただし使えるのは最大 12 時間で、それを過ぎたらもう一度 `aws login` を実行する。IAM ユーザーやロールで使うときは、マネージドポリシー `SignInLocalDevelopmentAccess` をアタッチしておく必要がある。

`aws sso login` を置き換える新しいコマンドだと思いがちだが、対象にする人が違う。

| | `aws login` | `aws sso login` |
| --- | --- | --- |
| 対象 | ルートユーザー、IAM ユーザー、IAM のフェデレーション | IAM Identity Center のユーザー |
| config に書くこと | `login_session` と `region`（自動で生成） | `sso_start_url`、`sso_region`、アカウント ID、ロール名など |
| 主に置き換えるもの | `aws configure` で保存するアクセスキー | — |

「config に書く情報が減って楽になった」と感じるのは、SSO の設定項目と比べたときか、アクセスキーを発行して管理する手間と比べたときだと思う。Identity Center を使っている組織なら、これまでどおり `aws sso login` を使う。
