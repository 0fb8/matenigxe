---
title: "イデアル I が素イデアルであることと、商環 R/I が整域であることは同値"
date: 2026-10-12
tags: [math, algebra]
---

可換環 $R$ のイデアル $I$ について、$I$ が素イデアルであることと、商環 $R/I$ が整域であることは同値になる。素イデアルの条件「$I$ に入らないもの同士の積は $I$ に入らない」が、商環では「$0$ でないもの同士の積は $0$ でない」にそのまま読み替わるから。

以下、$R$ は単位元 $1$ をもつ可換環とする。$\mathfrak{p} \neq R$ であって、次の条件を満たすイデアル $\mathfrak{p}$ を素イデアルという。

$$
a \notin \mathfrak{p} \text{ かつ } b \notin \mathfrak{p} \implies ab \notin \mathfrak{p}
$$

対偶をとって「$ab \in \mathfrak{p}$ ならば $a \in \mathfrak{p}$ または $b \in \mathfrak{p}$」と書くことも多い。整域は、$0 \neq 1$ で、零因子をもたない（$xy = 0$ ならば $x = 0$ または $y = 0$）可換環のこと。

$a \in R$ の $R/I$ での像を $\bar{a}$ と書く。対応の鍵になるのは次の2つ。

$$
\bar{a} = 0 \iff a \in I, \qquad \bar{a}\,\bar{b} = \overline{ab}
$$

**素イデアルなら整域**: $\mathfrak{p}$ を素イデアルとする。$R/\mathfrak{p}$ の元はどれも、ある $a \in R$ を使って $\bar{a}$ と書ける。$\bar{a}\,\bar{b} = 0$ とすると、$\overline{ab} = 0$ なので $ab \in \mathfrak{p}$。$\mathfrak{p}$ は素イデアルだから、$a \in \mathfrak{p}$ または $b \in \mathfrak{p}$、つまり $\bar{a} = 0$ または $\bar{b} = 0$ になる。また $\mathfrak{p} \neq R$ より $1 \notin \mathfrak{p}$ なので、$\bar{1} \neq 0$ も成り立つ。

**素イデアルでないなら整域でない**: $I \neq R$ のときは、$a \notin I$、$b \notin I$ で $ab \in I$ となる $a, b$ がある。これは $R/I$ で $\bar{a} \neq 0$、$\bar{b} \neq 0$ かつ $\bar{a}\,\bar{b} = 0$ を意味するので、$R/I$ は零因子をもつ。$I = R$ のときは、$R/I$ が零環になり $0 = 1$ なので、整域ではない。

定義に $\mathfrak{p} \neq R$ が入っているのは、この最後の場合のため。$I = R$ だと「$a \notin I$」となる $a$ がないので、条件は何も言っていないのと同じになり、自動的に満たされてしまう。しかし $R/R$ は零環で、整域とは呼ばない。そのため、$R$ 自身は素イデアルから除いておく。

例えば $\mathbb{Z}$ では、次のようになる。

| イデアル | 素イデアルか | 商環 |
| --- | --- | --- |
| $(5)$ | はい | $\mathbb{Z}/5\mathbb{Z}$ は整域（体でもある） |
| $(6)$ | いいえ（$2 \cdot 3 \in (6)$ だが $2, 3 \notin (6)$） | $\mathbb{Z}/6\mathbb{Z}$ では $\bar{2}\cdot\bar{3} = 0$ |
| $(0)$ | はい | $\mathbb{Z}$ そのもので、整域 |
