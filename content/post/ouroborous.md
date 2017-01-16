---
categories: []
date: 2017-01-11T02:28:32+09:00
description: ""
draft: true
keywords: []
title: ouroborous
---


# [Ouroborous](https://eprint.iacr.org/2016/889.pdf)とは

[Ethereum Classic](https://iohk.io/projects/ethereum-classic/)の研究員によるProof of Stakeアルゴリズムの提案

## 特徴

1. 以下の2つの要件を満たす。
 * Persistance ... 特定のノードがあるブロックをstable（すなわち以後覆される可能性が十分低い）、と判断した場合他のノードも同様に判断する。
 * Liveness ... トランザクションがstableになるまで時間が単調増加で予測しやすい。
2. epochごとにStakeの状態のスナップショットをとり、Stake holderから一定数のcommiteeを選出し、SMPCによるコインフリッピングを行う。
3. セキュアである。すなわちPersistanceとLivenessを崩すことができる条件が予想できて、それが十分あり得なさそうである。
4. マイニングパワーを委任できる。


