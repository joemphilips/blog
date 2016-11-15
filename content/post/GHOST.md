---
categories: ["hack", "crypto"]
date: 2016-11-02T00:04:15+09:00
description: "how GHOST protocol works"
draft: true
keywords: ["ethereum", "blockchain"]
title: EthereumのProof of Stakeの仕組み
---


元々Bitcoinで使われたいたProof of Work(PoW)は色々と問題があった。

* 専用のハードウェアが有利すぎるためマイナーの集中を招く
* アルトチェーンが普及すると、それらのマイニングパワーを一つのチェーンに一時的に集めることで容易に51%攻撃が行えるようになる。
* 手数料はマイニングノードが持っていくため、P2Pノードを立ち上げるモチベーションがない

Ethereumでは開発当初からこの点を改善すべく色々工夫している。

はじめはDaggerと呼ばれるメモリ容量をたくさん使わざるを得ないようなPoWにして、GPUやASICによる採掘を避けようとしてきたが、
これは実装が面倒なのと、ハッシュパワーほどではないにしろ大量の電力と計算資源を無駄に消費する必要があるため、途中から採掘力が保持されているEtherの量に比例するような仕組みである*Proof of Stake*を使用するようになった。

## Proof of Stakeとは

* もともとは[PPCoin](https://peercoin.net/assets/paper/peercoin-paper-jp.pdf)で使用されていた
基本は

```
SHA256(prevhash + address + timestamp) <= 2^256 * balance /diff
```

を満たすときに採掘に成功するというプロトコル

* timestamp ... Unix時間。秒ごとなので1秒に一回採掘できるということになる
* diff ... 難易度。ブロックタイムが平均12秒になるよう調整される。
* balance ... 保持しているUTXO


問題点はフォークが発生した際にその両方でマイニングすることが容易である点にある。言い換えるとフォークを収束させるメリットがマイナーにない。
なので何らかの懲罰的アルゴリズムを導入する必要がある。
>>>>>>> update GHOST and start writing translation annoucement


## GHOST


で、Ethereumとは独立に、PoWに決済時間の短縮という目的でGHOSTというプロトコルも2013年に[提唱されていた](http://www.cs.huji.ac.il/~avivz/pubs/13/btc_scalability_full.pdf)

詳しくは論文を読んでもらうとして、要点だけを述べるとこれは実にシンプルな仕組みで、複数のフォークから一つを選ぶ際にそのフォーク中の一つだけ分岐したブロック(stale block)を考慮に入れるというもの。

例えば以下のようなブロックの分岐があった際に

```

○--○--○--○--○--○--○--○ <- A
    \
     \
      ○--○--○--○--○ <- B
          \  \
           ○  ○ <- C

```


ビットコインでは単に最長のものを選ぶので`A`が選ばれるが、GHOSTを用いた場合は`B`が選ばれる。

決済時間を短くすると、このような分岐が増えるので有効な仕組み。`B`のほうがより多くのPoWを持っているということが直感的説明っぽい。


### Modified GHOST

EthereumではこのGHOSTに若干の修正を加えている。

1. 選ばれたブロックの「おじ」(uncle)のマイナーにも若干のマイニング料を与える。(トランザクション手数料は無し)
2. おじは、7世代前までのみを考慮する。(効率性のため)

## Slasher

[Slasher](https://blog.ethereum.org/2014/01/15/slasher-a-punitive-proof-of-stake-algorithm/)

### Proof of Excelence, bandwidth, storage, identity


### Proof of Importance

ここでちょっと脱線

Ethereumではなく[NEM](https://blog.nem.io/)では、Proof of Importance(PoI)というコンセンサスアルゴリズムを用いる

PoSはマタイの法則で一箇所にETHが集まってしまい、貯蔵を促進する傾向がある。


* トランザクションの履歴は有向非巡回グラフになるので、GoogleのPageRankに似たアルゴリズムで、ランクを付ける
* 決済時間は60秒

ノード数削減のため10000XEM以上を所持しているノードについて
以下の条件を満たすトランザクションを対象とする。

1. 1000XEM以上
2. 最新43200ブロック(約一ヶ月)に含まれる
3. 取引の相手も1000XEM以上をもつ

新しいトランザクションを重要視するように重みを付けた後、行(送信元)でノーマライズした行列を作る。コレをアウトリンク行列`$ O $`と呼ぶ

難点としては

1. 複雑すぎる
2. 原理主義者からみると十分Decentralizedではない

## 参考

[NEM公式リファレンス](https://www.nem.io/NEM_techRef.pdf)


