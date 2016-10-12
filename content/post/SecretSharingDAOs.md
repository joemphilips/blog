---
categories: ["hack", "crypto"]
date: 2016-10-11T15:08:10+09:00
description: "ethereum and hyperledger"
draft: true
keywords: ["blockchain"]
title: 秘密分散DAO, もう一つの暗号2.0
---

この文書はEthrereum Project共同創業者の一人 Vitalik Buterinによる [Secret Sharing DAOs: The Other Crypto 2.0](https://blog.ethereum.org/2014/12/26/secret-sharing-daos-crypto-2-0/)の和訳です。大変興味深い内容だったので翻訳します。

以下和訳
-------

今年（訳注: 2014年）、暗号技術2.0の業界はブロックチェーン技術を大いに発達させました。例えば

1. [Slasher](https://blog.ethereum.org/2014/01/15/slasher-a-punitive-proof-of-stake-algorithm/)（訳注: Nothing at Stakeを防止する懲罰的プロトコル）や[DPOS](http://wiki.bitshares.org/index.php/DPOS_or_Delegated_Proof_of_Stake) のようなProof of stakeの定式化や実現
2. 様々な[形式](http://www.reddit.com/r/ethereum/comments/2jvv5d/ethereum_blog_scalability_part_2_hypercubes/)での[スケーラブル](https://github.com/petertodd/tree-chains-paper/blob/master/tree-chains.tex)なブロックチェーン[アルゴリズム](https://blog.ethereum.org/2014/11/13/scalability-part-3-metacoin-history-multichain/)
3. [古典的なビザンチン対障害性](http://pebble.io/docs/)(Byzantine fault tolerancae)理論から拝借した「リーダー不要合意」のメカニズム
4. [Schelling合意形成](https://blog.ethereum.org/2014/03/28/schellingcoin-a-minimal-trust-universal-data-feed/)の[仕組み](https://blog.ethereum.org/2014/03/28/schellingcoin-a-minimal-trust-universal-data-feed/)や、それを利用した[価格変動性の少ない通貨](https://blog.ethereum.org/2014/11/11/search-stable-cryptocurrency/)

中央集権型の仕組みに比べてブロックチェーンが劣っていた点は全て、これらの技術によって大いに改善されるでしょう。

1は合意形成のコストの低下とセキュリティの向上をもたらし、
2はサイズ（訳注: ブロックサイズのこと？）の制限とトランザクションのコストを下げ、
3は悪用可能性(exploitability)を減らし、
4はブロックチェーンが現実のデータに「気づく」ことを可能にします。

しかしながら、一つだけ欠けたパズルのピースがあります。**プライバシー**です。

## 通貨、分散アプリケーション、そしてプライバシー

ビットコインユーザーは、経済面でのプライバシーという点において、幾分ユニークなトレードオフを提供します。

**物理的アイデンティティ**の秘匿という面ではいかなる先達の技術と比べても遥かに優れています。銀行などの中央集権システムの場合はIDの登録が必須ですし、現金はTorネットワークを介して支払うことができないためです。

一方で**トランザクション**の秘匿性という点においては史上最もパブリックなシステムであると言えるでしょう。
合衆国政府であろうと、中国政府であろうと、ご近所の13歳のハッカーでさえ、いつどこでどのアカウントがどのアカウントにどれだけのBTCを送金したのか確かめるのにはウォレットすら必要ない、という点では同じだからです。

大雑把に言って、この2つの特性がビットコインをそれぞれ反対方向に引っ張ろうとしており、どちらが勝利するかは完全には明らかではありません。

Ethrereumでは状況は理屈の上では似ていますが、現実はだいぶ違います。ビットコインは貨幣としての想定しており、貨幣とは本質的に交換可能なものです。
