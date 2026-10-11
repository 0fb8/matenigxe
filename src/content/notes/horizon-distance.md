---
title: "地平線までの距離は目の高さ h から √(2Rh) で近似でき、h をメートルで入れるとおよそ 3.6√h km"
date: 2026-10-11
tags: [math, physics]
---

地球を半径 $R$ の完全な球とみなすと、目の高さ $h$ から見える地平線（水平線）までの距離は $R\arccos\frac{R}{R+h}$ で、$h \ll R$ なら $\sqrt{2Rh}$ で近似できる。$h$ をメートルで入れると、だいたい $3.6\sqrt{h}$ km になる。

目から地球に接線を引くと、地球の中心・目・接点の3点は、接点で直角になる直角三角形をつくる。斜辺は中心から目までの $R+h$、隣辺は半径 $R$ なので、中心での角を $\theta$ とすると

$$\cos\theta = \frac{R}{R+h}$$

地平線までの地表に沿った距離は弧の長さ $R\theta$ だから、$R\arccos\frac{R}{R+h}$ と求まる。

これを近似したいが、$\arccos$ をそのままテイラー展開するのは面倒。そこで $\varepsilon := h/R$ とおき、$\cos\theta = \frac{1}{1+\varepsilon}$ の両辺をそれぞれ展開して主要項で打ち切る。

$$1 - \frac{\theta^2}{2} \approx 1 - \varepsilon$$

これを解くと $\theta \approx \sqrt{2\varepsilon}$ なので、距離は

$$R\theta \approx R\sqrt{2\varepsilon} = \sqrt{2Rh}$$

$R \approx 6371$ km を入れるときは単位をそろえる。$h$ をメートルのまま使うなら $R = 6.371 \times 10^6$ m として

$$\sqrt{2Rh} \approx \sqrt{1.27 \times 10^7}\,\sqrt{h}\ \text{m} \approx 3.57\sqrt{h}\ \text{km}$$

| 目の高さ $h$ | 地平線までの距離 |
| --- | --- |
| 1.6 m（立った大人の目） | 約 4.5 km |
| 100 m（ビルの上） | 約 36 km |
| 3776 m（富士山頂） | 約 220 km |

なお、ここでは大気による光の屈折を考えていない。実際には光が地表側へ少し曲がるので、見える範囲はこの値より少し遠くなる。
