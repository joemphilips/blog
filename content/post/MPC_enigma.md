---
categories: ["hack"]
date: 2016-10-20T00:11:35+09:00
description: ""
draft: true
tags: ["blockchain", "enigma", "cryptography"]
title: enigmaの解説
---


---

# 自己紹介

<img src="/static/images/small_icon.jpg">

名前: 宮本 丈
職業: Bioinformatician
ID: joemphilips

最近は暗号理論・ブロックチェーンの勉強にハマっています。 <- その話をします。
(9割Ethereum blogからの引用です)

# ブロックチェーンによる分散ストレージ

秘密分散で管理 -> ゼロ知識証明で、保持者にインセンティブを与える。

<img src="/static/images/SecretSharingDAOs/threepoints.png">
<img src="/static/images/SecretSharingDAOs/secretmultiply.png">

---

# 秘密分散上では情報を秘匿化したまま乗算と加算が可能

-> 任意の演算が可能

<img src="/static/images/SecretSharingDAOs/twolinesum2.png">
<img src="/static/images/SecretSharingDAOs/secretmultiply3.png">

個人情報をデータマイニング用に「売る」ことが可能に

---

# 秘密鍵の分散管理

MのうちNが賛成したときのみ、送金(あるいはコンピュテーションの実行。IoTデバイスの操作も含む)ができる。

例えば5-of-9の分割を行った際、普通に行っただけでは、4人が集まっただけでも、秘密鍵の探索空間をかなり狭められるため、blute force することができ、危険。

そこで、秘密鍵の4倍のランダム配列を秘密鍵に加えてサイズを大きくし、分散管理させることで探索空間を広く保つ。

---

# 問題点

## SMPCは遅い

1. 乗算は極めて使用頻度の高い演算であるが、乗算のたびに通信をする必要がある。例えば大小比較や統合判定ですら複数の和と積から構成される
2. データベースのインデックスを作るとそこから情報漏えいするため全探索しなくてはならない。

---

# enigma

1. SMPCを早くする。
 * SPDZプロトコルに基づいた前処理 ... ネットワーキングを少なくする。
 * 最初に処理全体をコンパイルすれば、後半に行くに連れて参加ノード数を減らせる。
2. 計算が正しく行われたかをチェックする仕組み(Verifiable Secret Sharing)を導入
3. ブロックチェーンでメタデータの管理
 * Read, Write, Compute(要約統計量の計算には使用できるが、データそのものは見れない)がどの秘密鍵に対して与えられるかを分散台帳で管理

----

## 参照情報

* [法変換を用いたマルチパーティ計算の通信コストの削減 Ryo Kato][cost_reduction]
 1. 計算途中の分散の数を減らす（ビット法変換）
 2.
* [Erasure Coding][Erasure Coding]による冗長化



[Erasure Coding]: https://blog.ethereum.org/2014/08/16/secret-sharing-erasure-coding-guide-aspiring-dropbox-decentralizer/#finitefields
[cost_reduction]: http://ir.lib.uec.ac.jp/infolib/user_contents/9000000780/9000000780.pdf
