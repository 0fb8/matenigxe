---
title: "Transit Gateway はリージョンごとのサービスで、別リージョンの TGW とは TGW ピアリングでつなぎ、ピアリングへ向けるルートは static で書く"
date: 2026-11-21
tags: [aws, network, routing]
---

Transit Gateway（TGW）はリージョンに属するサービスで、つなげるのは同じリージョンの VPC や VPN などだけ。別リージョンの TGW とつなぐには TGW ピアリングを使う。ピアリングへ向けるルートは propagation で入らないので、static ルートとして手で書く。

TGW には、つなぐ相手ごとにアタッチメントの種類がある。

| アタッチメント | つなぐ相手 |
| --- | --- |
| VPC | 同じリージョンの VPC |
| VPN | Site-to-Site VPN |
| DX Gateway | Direct Connect Gateway |
| Peering | ほかの TGW |

片方の TGW からピアリングアタッチメントをリクエストし、相手の TGW 側で承認する。別アカウントの TGW ともつなげる。

ルートは、パケットがたどる順に TGW の RT を見ていけばよい。リージョン A の VPC-A からリージョン B の VPC-B へ送る場合は、次のようになる。

| TGW | RT（association しているアタッチメント） | 宛先 | 行き先 | 書き方 |
| --- | --- | --- | --- | --- |
| TGW-A | VPC-A のアタッチメント | VPC-B の CIDR | ピアリング | static |
| TGW-B | ピアリング | VPC-B の CIDR | VPC-B のアタッチメント | propagation でよい |
| TGW-B | VPC-B のアタッチメント | VPC-A の CIDR | ピアリング | static |
| TGW-A | ピアリング | VPC-A の CIDR | VPC-A のアタッチメント | propagation でよい |

下の2行は戻りの通信のためのもの。VPC 側の RT にも、相手 VPC の CIDR を TGW へ向けるルートが要る。ピアリングアタッチメントでは TGW 同士が BGP で経路を交換しないので、相手側にある CIDR を自動では知れない。そのため、ピアリングへ向けるルートだけは static で書く。

TGW ピアリングは、VPC ピアリングとよく似ている。

| | VPC ピアリング | TGW ピアリング |
| --- | --- | --- |
| つなぐもの | VPC と VPC | TGW と TGW |
| 接続の作り方 | リクエストと承認 | リクエストと承認 |
| 経路 | RT に手で書く | ピアリングへ向けるルートは static |
| 推移的な中継 | できない | できない |

推移的な中継ができないので、たくさんのリージョンをつなぐには TGW 同士をフルメッシュでピアリングすることになる。TGW が $n$ 個なら $n(n-1)/2$ 本になる。数が多くて管理しきれないときは、複数リージョンをまとめて1つのネットワークとして扱える AWS Cloud WAN を検討する。
