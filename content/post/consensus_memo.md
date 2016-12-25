---
categories: ["hack", "crypto", "memo"]
date: 2016-12-25T00:25:16+09:00
description: "personal memo for consensus algorithms"
draft: true
keywords: ["ethereum", "blockchain"]
title: コンセンサスアルゴリズムの比較メモ
---

元々Bitcoinで使われたいたProof of Work(PoW)は色々と問題があった。

* 専用のハードウェアが有利すぎるためマイナーの集中を招く
* アルトチェーンが普及すると、それらのマイニングパワーを一つのチェーンに一時的に集めることで容易に51%攻撃が行えるようになる。
* 手数料はマイニングノードが持っていくため、P2Pノードを立ち上げるモチベーションがない

Ethereumでは開発当初からこの点を改善すべく色々工夫している。

はじめはメモリ容量をたくさん使わざるを得ないようなPoWにして、GPUやASICによる採掘を避けようとしてきたが、
これは実装が面倒なのと、ハッシュパワーほどではないにしろ大量の電力と計算資源を無駄に消費する必要があるため、途中から採掘力が保持されているEtherの量に比例するような仕組みである*Proof of Stake*を使用するようになった。


# Proof of Stakeとは

## Ethereumの場合

1秒間に1回のみハッシュ値を計算することができ、成功確率は自分の持っている残高の量に比例する。という決済方法

定式化すると

```python
SHA256(prevhash + address + timestamp) <= 2^256 * balance /diff
```

を満たすときに採掘に成功する。

* timestamp ... Unix時間。秒ごとなので1秒に一回採掘できるということになる
* diff ... 難易度。ブロックタイムが平均12秒になるよう調整される。
* balance ... 保持しているUTXO

コンセンサスプロトコルは、全て投票による合意(*consensus by bet*)の特殊例とみなすことができる。

例えばPoWでは特定のチェーンに対してマイニングを行うことで、 `p*R-E` の利益を得ることが期待される。ただし

* `p` ... 1秒間にブロック生成に成功する確率
* `R` ... マイニング報酬
* `E` ... 1秒間に消費する電力(の代金)

これはつまり、PoWは特定のチェーンに(ハッシュパワーを)「賭ける」ことに等しいということ。オッズ比は`E:p*R-E`となる。

こう考えるとそれぞれのコンセンサスプロトコルは

1. 賭けに参加できるのは誰か
2. 金額及びオッズ比

の違いしかないと言える。

PoWはブロックの作成とハッシュパワーによる賭けが同時に行われていたのに対し、
PoSではブロックの作成が気軽に行えるので、どんどんブロックを作ってしまって、あとからStake Holderによる賭けで決めてしまえばよいという発想を採用している。

ただ、もちろんこれはネットワーク帯域の消費量が大きいという欠点があるので、
[Sharding](https://github.com/ethereum/wiki/wiki/Sharding-FAQ)を導入することが重要になってくる。
これは全ノードが全トランザクションを検証するのではなく、一部のノードだけが検証することでスケーラビリティを担保する方法


## 問題点

1. 二重投票が容易（どころか最適戦略）
2. マイナーの硬直化
3. genesis block時のトークン保持者がいつでも51% attackを行える

問題点はフォークが発生した際にその両方でマイニングすること(二重投票)が、功利主義的には最適な戦略であることにある。

言い換えるとフォークを収束させるメリットがマイナーにない。

PoWが優れているのは、投票にあたって「コスト(ハッシュパワー、すなわち電力)」を消費しなくてはならない（つまり「気軽に」マイニング(= 投票)を行うことができない）ことが保証されていることにある。

Ethereumでは懲罰的アルゴリズムを導入することで対処している。

もう一点がマイナーの硬直化に繋がる可能性があること。
PoSはマタイの法則で一箇所にETHが集まってしまい、貯蔵を促進する傾向がある。

これは使用すること自体に積極的なインセンティブを与えることが良い対処法となる。

## Slasher

Proof of Stakeにおいて二重投票を防ぐために導入されたプロトコル

### Slasher 1.0

マイニングに参加するにあたってデポジットを登録しておき、2重投票が見つかったら没収されるというもの。

シンプルだが（Vitalik曰く）有効

マイニングに成功しても、報酬が即座に払われず1000ブロック後に払われるように記憶される。
その間に２重投票をしているのが見つかった場合、セキュリティデポジットが没収されるため、マイナーはbonded validatorと呼ばれる。


### Slasher 2.0

二重投票ではなく、「間違った」フォークに投票した場合に没収される。

これにより、確率的二重投票が最適戦略になる可能性が低くなる。（らしい、よくわからん。）

（ユーザーにはセキュリティデポジットを回収する権利を認めなくてはならないため）短い分岐に対してしか有効でないという点は1.0と同じ。

もしセキュリティデポジットの回収を不可能にすると、（トークンの価値が上昇し続けない限り）マイナーの固定化につながる可能性が高い

## GHOST

で、Ethereumとは独立に、PoWに決済時間の短縮という目的でGHOSTというプロトコルも2013年に[提唱されていた](http://www.cs.huji.ac.il/~avivz/pubs/13/btc_scalability_full.pdf)

詳しくは論文を読んでもらうとして、要点だけを述べるとこれは割とシンプルな仕組みで、複数のフォークから一つを選ぶ際にそのフォーク中の一つだけ分岐したブロック(stale block)を考慮に入れるというもの。

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

決済時間を短くすると、このような分岐が増えるので有効な仕組み。`B`のほうがより多くのPoWを（すなわち「得票」を）持っているということが直感的説明。

### Modified GHOST

EthereumではこのGHOSTに若干の修正を加えている。

1. 選ばれたブロックの「おじ」(uncle)のマイナーにも若干のマイニング料を与える。(トランザクション手数料は無し)
2. おじは、7世代前までのみを考慮する。(効率性のため)

など

## CASPER

「上で説明したGhostとSlasherをいい感じに組み合わせたもの」くらいの理解をしている。

[Casperは集中化を招く](http://themerkle.com/casper-may-cause-centralized-staking-by-rich-ethereum-holders/)という指摘があり、The DAO事件とあいまってEthereumコミュニティの閉鎖性に対する批判のやり玉となっている。


## Delegated Proof of Stake (DPOS)

BitSharesやLiskで用いられている。

[こちらのまとめ](http://www.jpbitcoinblog.info/entry/20160518/1463549490)が詳しい。

# Tendermint PBFT

[オリジナルのPBFT](http://pmg.csail.mit.edu/papers/osdi99.pdf)がSticky leader systemならば、こちらはラウンドロビンっぽいやり方でリーダー（承認者）を決める。
これにより承認者がダイナミックに変更できる。

PBFTのようにファイナリティを持たせつつ、CasperのようにStakeに基づく民主制と、メンバーの変更可能性をもたせたいというモチベーションから作られたっぽい。

BitTorrent/LibSwiftにインスパイアされたアルゴリズムを用いている（…らしいが、どこをどうインスパイアされたのかよくわからない。）


# Proof of Excelence


コンピューティングパワーを投票に使用するという点ではPoWと同じだが、コンピューティング資源を無駄にしないように、「人類にとって有用な問題」を解かせようというアイディア

有用な問題には例えば数学の定理や何らかの関数の最大化などがあり、前者はProof of Proof、 後者はProof of Optimizationと呼ばれる。

アイディアとしては面白いがかなりの変化球であることは間違いない。Difficultyを固定できないとまずいのではという気はする。

# Proof of bandwidth, storage, identity

不明

# Proof of Importance

Ethereumではなく[NEM](https://blog.nem.io/)では、Proof of Importance(PoI)というコンセンサスアルゴリズムを用いる

元々はTransaction as Proof of Stake(TaPos)と呼ばれていた。
Slasherでは対処できない長期的なフォークに対して、アカウントが関与した「トランザクションの量」をマイニングパワーとすることで対処する。

ナイーブに実装すると、仲間同士で無意味にやり取りをすることでマイニングパワーを不当に上げる事ができる。
よって「経済圏全体で」どれぐらいの存在感があるのかを定量化する必要があるため、小さな「島」と作っているアカウント群を低く評価しなくてはならない。

トランザクションの履歴は有向非巡回グラフになるので、GoogleのPageRankに似たNCDawareRankというアルゴリズムでランクを付ける。
PageRankは、Webのグラフをマルコフ連鎖とみなして、その確率遷移行列を分解することでランクを付けるが、グラフ中に「島」となるクラスタがあると分解が難しくなる(Nearly Completely Decomposable, NCD)ため、NCDawareRankを用いる。

## PoIの利点

### 1. PoSの「富めるものがますます富む」という問題がかなり弱まっている。

Ethereumは[インサイダーが信用できない](https://www.cryptocoinsnews.com/source-ethereum-insiders-believe-dao-hack-inside-job/)という大きな問題があり、正直この点がアキレス腱になっていると思うので、これは大きい。

### 2. 監査証跡が可能

Fungibilityがないことと表裏一体、後述

## PoIの欠点

### 1. Fungibilityが手に入らない。

トランザクショングラフを書く必要があるので、原理上Fungibilityを担保することは無理（多分）

Fungibilityが問題となるのは大きく２点

### 2. Spammingに対する耐性が完全ではない。

上限があるとはいえ、[トランザクションを繰り返すことで多少Importanceを挙げることができる。](http://nemmanual.net/NEM_Technical_reference_JA/PoI/7.6.html)

この点、改良の余地はあるのか、グラフ理論の専門家の意見が気になる。

## 参考

* [NEM公式リファレンス](https://www.nem.io/NEM_techRef.pdf)
* Ethereum blog
 * [Proof of Stake: How I Learned to Love Weak Subjectivity](https://blog.ethereum.org/2014/11/25/proof-stake-learned-love-weak-subjectivity/)
 * [Introducing Casper "the Friendly Ghost"](https://blog.ethereum.org/2015/08/01/introducing-casper-friendly-ghost/)
 * [Understanding Serenity, Part 2: Casper](https://blog.ethereum.org/2015/12/28/understanding-serenity-part-2-casper/)

* [Ethereum wiki: Problems](https://github.com/ethereum/wiki/wiki/Problems)
* [Practical Byzantine Fault Tolerance](http://pmg.csail.mit.edu/papers/osdi99.pdf)

