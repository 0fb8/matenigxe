---
title: 'イデアル $\mathfrak{m}$ が極大イデアルであることと、商環 $R/\mathfrak{m}$ が体であることは同値'
date: 2026-10-12
tags: [math, algebra]
---

可換環 $R$ のイデアル $\mathfrak{m}$ について、$\mathfrak{m}$ が極大イデアルであることと、商環 $R/\mathfrak{m}$ が体であることは同値になる。$R/\mathfrak{m}$ のイデアルは、$R$ の中で $\mathfrak{m}$ を含むイデアルと1対1に対応する。そのため、「$\mathfrak{m}$ と $R$ の間にイデアルがない」ことが、「$R/\mathfrak{m}$ には $0$ と全体しかイデアルがない」ことに読み替わるから。

以下、$R$ は単位元 $1$ をもつ可換環とする。$\mathfrak{m} \neq R$ であって、$\mathfrak{m} \subsetneq J \subsetneq R$ となるイデアル $J$ が存在しないとき、$\mathfrak{m}$ を極大イデアルという。

証明では、次の2つの事実を使う。$\pi \colon R \to R/I$ を商写像とする。

- **対応定理**: $R/I$ のイデアル $\mathfrak{a}$ と、$I$ を含む $R$ のイデアル $J$ は、$\mathfrak{a} \mapsto \pi^{-1}(\mathfrak{a})$ と $J \mapsto J/I$ で1対1に対応する。この対応は包含関係を保つ。
- **体の判定**: $0 \neq 1$ の可換環 $K$ が体であることと、$K$ のイデアルが $0$ と $K$ だけであることは同値。$x \neq 0$ なら $(x) = K$ なので、$xy = 1$ となる $y$ がとれる。

**極大イデアルなら体**: $\mathfrak{m}$ を極大イデアルとし、$\mathfrak{a}$ を $R/\mathfrak{m}$ のイデアルとする。$\pi^{-1}(\mathfrak{a})$ は $\mathfrak{m}$ を含む $R$ のイデアルなので、極大性から $\mathfrak{m}$ か $R$ のどちらか。対応させて戻すと、$\mathfrak{a}$ は $0$ か $R/\mathfrak{m}$ になる。また $\mathfrak{m} \neq R$ より $R/\mathfrak{m}$ で $0 \neq 1$ なので、$R/\mathfrak{m}$ は体になる。

**極大イデアルでないなら体でない**: $I = R$ のときは、$R/I$ は零環で体ではない。$I \neq R$ のときは、$I \subsetneq J \subsetneq R$ となるイデアル $J$ がある。すると $J/I$ は $R/I$ のイデアルで、$J \neq I$ から $0$ ではなく、$J \neq R$ から全体でもない。$0$ と全体以外のイデアルをもつので、$R/I$ は体ではない。

体は整域なので、この結果と「$\mathfrak{p}$ が素イデアル $\iff R/\mathfrak{p}$ が整域」を合わせると、極大イデアルは素イデアルでもあることがわかる。逆は成り立たない。

| イデアル（$\mathbb{Z}$ の中） | 素イデアルか | 極大イデアルか | 商環 |
| --- | --- | --- | --- |
| $(5)$ | はい | はい | $\mathbb{Z}/5\mathbb{Z}$ は体 |
| $(0)$ | はい | いいえ（$(0) \subsetneq (2) \subsetneq \mathbb{Z}$） | $\mathbb{Z}$ は整域だが体ではない |
| $(6)$ | いいえ | いいえ | $\mathbb{Z}/6\mathbb{Z}$ は体でも整域でもない |
