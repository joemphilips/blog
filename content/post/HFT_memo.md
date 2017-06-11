---
categories: ["crypto", "memo", "finance"]
date: 2017-04-09T13:59:00+09:00
description: "about High-Freequency-Trading"
draft: true
tags: ["finance"]
title: HFT(高頻度取引)やダークプールについての勉強メモ
---


# [Optimal high frequency trading with limit and market orders](https://hal.archives-ouvertes.fr/hal-00603385/document)

limit order book(OKB)形式での理想的なマーケットメイクの条件を考案する。
bid-ask spreadは有限マルコフ鎖で表現される。
複数のtick sizeを持ち、tick time clockはポアソン過程

アルゴリズム取引による裁定取引の自由化（maker taker モデルのこと?）は、spreadの幅を縮める効果があることが以下で示されている。

* [Does Algorithmic Trading Improve Liquidity?](http://faculty.haas.berkeley.edu/hender/algo.pdf)
* [High frequency trading and the new-market makers](http://www.sciencedirect.com/science/article/pii/S1386418113000281)

（いずれもかなりの引用数の論文）

マーケットメイキングstarategiesで一般的なのはリスク-報酬ベースで考える方法。
リスクには3種類ある。

1. Inventory risk（[High frequency trading in a limit order book](https://www.math.nyu.edu/faculty/avellane/HighFrequencyTrading.pdf) これもかなりの引用数）
2. adverse selection risk
3. execution risk

1はマーケットリスクに対応する。すなわち、リスキーなマーケットでロングしたりショートしたりすることのリスク。

# [Combinatorial Auctions](ftp://cramton.umd.edu/ca-book/cramton-shoham-steinberg-combinatorial-auctions.pdf)

引用数1200以上の重用なサーベイ論文
