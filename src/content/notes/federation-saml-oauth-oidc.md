---
title: "フェデレーションは SP が IdP の認証を信頼する仕組みで、プロトコルには XML の SAML、認可だけの OAuth 2.0、それに認証を足した OIDC などがある"
date: 2026-11-24
tags: [security]
---

フェデレーション（ID フェデレーション）は、各サービス（SP: Service Provider）が自分で利用者を認証せず、IdP（Identity Provider）の認証結果を信頼して使う仕組み。組織の構成員の ID は IdP にまとめて管理されていて、SP は IdP から受け取った認証結果をもとに、その人に何を許すかを決める。ID の追加や削除、MFA の設定などを IdP の1か所で済ませられる。

IdP は認証結果を SP に渡さなければならないので、そのためのプロトコルが要る。代表的なものに次のようなものがある。

| プロトコル | できること | IdP が渡すもの | 向いている場面 |
| --- | --- | --- | --- |
| SAML（Security Assertion Markup Language） | 認証 | XML のアサーション | ブラウザでの SSO。企業の SaaS ログインで長く使われている |
| OAuth 2.0（Open Authorization） | 認可だけ | アクセストークン | 「このアプリに自分のデータへのアクセスを許す」ような権限の委譲 |
| OIDC（OpenID Connect） | 認証と認可 | ID トークン（JWT） | ブラウザのほか、モバイルアプリや API 連携など |

SAML のアサーションは、IdP が「この人は認証済みで、こういう属性を持つ」と表明するデータで、XML で書かれる。ブラウザのリダイレクトでアサーションを運ぶ使い方が中心なので、モバイルアプリやサーバー同士の連携には向かない。

OAuth 2.0 は認可のためのプロトコルで、それだけでは「誰がログインしたか」を確かめる仕組みを持たない。OIDC は OAuth 2.0 を拡張して認証を足したもので、利用者が誰かを表す ID トークンを JWT で発行する。JSON ベースで扱いやすく、「Google でログイン」のようなソーシャルログインや、GitHub Actions から AWS にキーなしでアクセスする連携などで使われている。

IdP の製品として広く使われているのが Microsoft の Active Directory（AD）。AD は社内のユーザーやコンピューターを管理するディレクトリサービスで、社内では LDAP（ディレクトリの検索・参照）や Kerberos（認証）といったプロトコルで使われる。SaaS などとフェデレーションするときは、AD FS（Active Directory Federation Services）や Microsoft Entra ID が SAML や OIDC の IdP になる。

SAML の流れは「[SAML は IdP が認証して署名付きのアサーションを発行し、それをブラウザが SP まで運ぶ](/notes/saml-sso/)」にまとめている。
