---
categories: ["hack"]
date: 2016-10-20T00:11:35+09:00
description: ""
draft: true
keywords: ["blockchain", "enigma", "cryptography"]
title: enigmaの解説
---



## なぜSMPCは難しいか

1. 乗算は極めて使用頻度の高い演算であるが、乗算のたびに通信をする必要がある。例えば大小比較や統合判定ですら複数の和と積から構成される
2. データベースのインデックスを作るとそこから情報漏えいするため全探索しなくてはならない。

1は基本演算の効率化を図ることで解消してきた -> 通常の効率化手法が適用できず、専用のコンパイラを考える必要がある。内積演算は1回の積に一括化できる。複数の統合判定は一部をまとめることができるなど
2は

# enigmaのもたらす恩恵

---

## 冗長性をもたせる




----

## 秘密鍵の分散管理

MのうちNが賛成したときのみ、送金(あるいはコンピュテーションの実行。IoTデバイスの操作も含む)ができる。

例えば5-of-9の分割を行った際、普通に行っただけでは、4人が集まっただけでも、秘密鍵の探索空間をかなり狭められるため、blute force することができ、危険。

そこで、秘密鍵の4倍のランダム配列を秘密鍵に加えてサイズを大きくし、分散管理させることで探索空間を広く保つ。

----

## 参照情報

* [法変換を用いたマルチパーティ計算の通信コストの削減 Ryo Kato][cost_reduction]
 1. 計算途中の分散の数を減らす（ビット法変換）
 2.
* [Erasure Coding][Erasure Coding]による冗長化



[Erasure Coding]: https://blog.ethereum.org/2014/08/16/secret-sharing-erasure-coding-guide-aspiring-dropbox-decentralizer/#finitefields
[cost_reduction]: http://ir.lib.uec.ac.jp/infolib/user_contents/9000000780/9000000780.pdf
