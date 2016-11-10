---
categories: ["hack", "memo"]
date: 2016-10-26T22:10:51+09:00
description: "how SPDZ protocol works"
draft: true
keywords: ["SMPC", "blockchain", "enigma"]
title: SPDZプロトコルによるSMPCの仕組み
---


# SPDZとは？

[Practical Covertly Secure MPC for Dishonest Majority - or: Breaking the SPDZ Limits](https://eprint.iacr.org/2012/642.pdf)という論文で紹介しているSecure Multi Party Computation(SMPC)のプロトコル。
Shamir's Secret Sharingより数段早い

## SPDZ Overview

### 前提

1. n人のプレイヤーが、標数 `$ p $` の有限体 `$ F_p $`上でSMPCを行うと仮定する。`$ F_p $`は十分大きい。
2. `$ P_i $` は、単一のMAC鍵によって生成された `$ /alpha_{i} \in F_p $`を持つ(ただし`\alpha = \alpha_{1}, \alpha_{2}, .... \alpha_{n}`)
3. `$ a \in F_p $`で`$ a = a_1 + a_2 ... a_n $`となるようにデータ`$ a $`を分割し、`$ P_i $`は秘密分散データとして `$ a_i $`と`$ \ganma(a)_i $`をもつ。これを分散データを`$ <a> $`とする。ただし`$ \ganma(a) := \alpha・a $`かつ`$ \ganma(a) = \ganma(a)_1 + ... +\ganma(a)_n $`


目的はaとbの掛け算をSMPCで実行することとする。

## Multiparty Computation from Somewhat Homomorphic Encryption

`C`を回路の大きさ、`n`を参加パーティの数とすると
従来手法は`$ \Omega(n^2・|C|) $`の計算複雑性だったのが`$ O(n・|C|+n^3) $`になった。
