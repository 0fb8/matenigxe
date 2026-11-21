---
title: "集約 Egress は多数の VPC のインターネット向け通信を Transit Gateway で1つの Egress VPC に集める構成で、VPC 同士を分けたいなら Blackhole ルートが要る"
date: 2026-11-21
tags: [aws, network, routing]
---

集約 Egress は、たくさんの VPC からインターネットへ出る通信を、Transit Gateway（TGW）経由でインターネット専用の VPC（Egress VPC）に集め、そこからまとめて出す構成。Egress は「外向き」という意味で、Ingress の反対。セキュリティグループのルールが Ingress と Egress に分かれているのと同じ使い方で、ここでは「インターネットに出る」ことを指す。

ふつうは、VPC ごとに IGW と、それを `0.0.0.0/0` の行き先にした RT を参照するパブリックサブネットを置き、プライベートサブネットからは NAT Gateway を通して出る。ただ、マルチ AZ なら NAT Gateway は AZ の数だけ必要で、それが VPC の数だけ増えるので、料金がかさむ。インターネットから見た送信元 IP アドレスも VPC ごとにばらばらになる。Egress VPC に集めれば、NAT Gateway は Egress VPC の中だけで済み、送信元 IP アドレスもそろう。

TGW の RT は2つ用意する。

| RT | association するアタッチメント | 経路 |
| --- | --- | --- |
| RT-spoke | 各業務 VPC | `0.0.0.0/0 → att-egress` |
| RT-egress | Egress VPC | 各業務 VPC を propagation（インターネットからの戻りの通信用） |

このままだと、業務 VPC 同士を分けたい場合に抜け道がある。VPC1 から VPC2 宛てのパケットを TGW に送ると、RT-spoke の `0.0.0.0/0` にマッチして att-egress へ行く。Egress VPC から TGW に戻ってくると、今度は RT-egress に VPC2 への経路があるので、そのまま VPC2 に届いてしまう。

これを防ぐには、RT-spoke に各業務 VPC の CIDR（まとめられるならそのまとまり）を **Blackhole** にするルートを足す。Blackhole は、マッチしたパケットを転送せずにその場で捨てる行き先。`0.0.0.0/0` より長いプレフィックスなので、ロンゲストマッチでこちらが優先される。

| RT-spoke の宛先 | 行き先 |
| --- | --- |
| `0.0.0.0/0` | att-egress |
| `10.0.0.0/8`（業務 VPC 全体） | Blackhole |

ルーターで宛先を捨てる経路を作ること自体は一般的で、Cisco の Null0 などがある。TGW の RT では、それが Blackhole という名前で用意されている。
