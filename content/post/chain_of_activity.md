---
categories: []
date: 2017-01-16T15:01:57+09:00
description: ""
draft: true
tags: []
title: Chain of Activity
---


## [Chain of Activity](http://bravenewcoin.com/assets/Whitepapers/Cryptocurrencies-without-Proof-of-Work.pdf)

1. トランザクションを集め、タイムスタンプとともに署名してブロードキャストする。このブロックを $B_i$ とする。
2. $B_i$には0, 1のビットを50%の確率で付属させ、（例えば署名の先頭1bitを取れば良い）これを $b_i$
3.  $B_i$ と$B_j$間のタイムスタンプの差は$|j-i-1| * G_0$

