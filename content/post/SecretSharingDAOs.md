---
categories: ["hack", "crypto"]
date: 2016-10-11T15:08:10+09:00
description: "translation for 「Secret sharing DAO」 in ethereum blog"
draft: true
keywords: ["blockchain", "ethereum"]
title: 秘密分散DAO、 もう一つの暗号2.0
---

この文書はEthrereum Project共同創業者の一人 Vitalik Buterinによる [Secret Sharing DAOs: The Other Crypto 2.0](https://blog.ethereum.org/2014/12/26/secret-sharing-daos-crypto-2-0/)の和訳です。大変興味深い内容だったので翻訳します。

[Enigma](http://enigma.media.mit.edu/)の理論的基礎になっているので、
文書自体もさることながら、リンクをたどるとEnigmaやEthereumの状況を理解するスタートポイントとしてちょうどよいです。

誤字誤訳のご指摘大歓迎です。

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

ビットコインは、経済面でのプライバシーという点において幾分ユニークなトレードオフを提供します。

**物理的アイデンティティ**の秘匿という面ではいかなる先達の技術と比べても遥かに優れています。銀行などの中央集権システムの場合はIDの登録が必須ですし、現金はTorネットワークを介して支払うことができないためです。

一方で**トランザクション**の秘匿性という点においては史上最もパブリックなシステムであると言えるでしょう。
合衆国政府であろうと、中国政府であろうと、ご近所の13歳のハッカーでさえ、いつどこでどのアカウントがどのアカウントにどれだけのBTCを送金したのか確かめるのにはウォレットすら必要ない、という点では同じだからです。

大雑把に言って、この2つの特性がビットコインをそれぞれ反対方向に引っ張ろうとしており、どちらが勝利するかは完全には明らかではありません。

Ethrereumの状況は理屈の上では似ていますが、現実はだいぶ違います。ビットコインは貨幣としての使用を想定しており、貨幣とは本質的に交換可能なものです。

ですから例えば[マージ回避(merge aboidance)](https://medium.com/@octskyward/merge-avoidance-7f95a386692f)のようなテクニックを用いて、ウォレットが背後でアカウントの分割を行えば、一つのアカウントを完全に分割して別々のアカウントであるかのように振る舞わせることが可能です。
[Coinjoin](https://bitcointalk.org/index.php?topic=279249.0)を用いれば出資金を非中央集権的に「混ぜる」ことが可能ですし、何らかの機関が代表して資金の統合を行うことも難しくありません。

一方でEthrereumの場合、**あらゆる**プロセスや関係性の中間状態を保持することを目的に設定されていますが、それらの多くは貨幣よりも遥かに複雑で「アカウントに紐付けられた(account-based)」情報であるため、単一の参加者が複数のアカウントで活動を行っていた場合、それを統合するためのコストは非常に高くつく可能性があります。

故に、多くの面で現状Ethrereumは、ビットコインの秘匿性よりも透明性という側面を継承しています。(もっとも、Ethereumを貨幣として利用したい場合はサブ貨幣として使用可能な秘匿性の高いプロトコルをあとから作成することは間違いなく可能ですが。)

さて、問題は本当にプライバシー保護が必要になった場合、どのように需要を満たすべきか、です。
Diaspora式（訳注: [分散型SNSの一種](https://en.wikipedia.org/wiki/Diaspora_(software)）のセルフホスティングベースの方法と[Zerocasah](http://zerocash-project.org/)式のゼロ知識証明に基づいた方法が思いつきます。
が、例えば、複数のユーザーの個人情報に対して集計処理を行いたいとするといずれも不可能です。

ブロックチェーン自体のデータと、スケーラビリティの問題はいったん置いておくとして、それでも、ブロックチェーンの仕組みに内在するプライバシーの欠如はやはり、何らかの集権化されたサーバに信頼を置かなくてはならないということを示しているのでしょうか？
それとも、両者の利点だけを、つまり
情報の分散化された制御と状態のアップデート（書き込み）だけでなく、情報それ自体へのアクセス権（読み込み）をブロックチェーンライクな仕組みで管理する方法を提供すること
は可能なのでしょうか？

結論から言うと、「可能」です。

実を言うと、アイディア自体は[1998年に](http://godcoin.org/)Nick Szaboによって提唱されており、「神のプロトコル」というあだ名さえついています。（「神」という単語は、他のすべてに対してパレート優越(Pareto-superior)な存在であると**想定**ではなく**定義**されています。Szabo自身が指摘してくれたとおり、これから説明するプロトコルは、そのような意味での神の存在からはほど遠いものです。）ビットコインスタイルの暗号経済学的技術の進展によって、このプロトコルが初めて有効になりうる状況が生まれました。

そのプロトコルとは一体何なのでしょうか？技術的に正確で、かつわかりやすい用語としてこれを

秘密分散DAO(secret sharing DAO)

と呼ぶことにします。

## 基礎技術: 秘密分散

理論的な話をスキップして応用を知りたい方は[こちら](https://blog.ethereum.org/2014/12/26/secret-sharing-daos-crypto-2-0/#applications)をクリックしてください。

秘匿情報の計算ネットワーク(Secret computation network)は情報を分散して保持するために、２つの基礎技術に依拠しています。その一つが[秘密分散(secret sharing)](https://en.wikipedia.org/wiki/Secret_sharing)です。

> 訳注: 本文では触れられていませんが、これは正確にはShamir's Secret Sharingと呼ばれる方式です。

これは簡単にいうと`N`人の参加者がデータを分割して保持し、そのうち`K`人が協力すればデータを完全に復元できるが、`K-1`人では何の情報も得られないようなデータの分割方式です。(`K <= N`)ならば`K`,`N`は任意の値を取ることができます。

数学的な説明をしましょう。点が２つあれば、そこを通る直線は一意に決まるということはわかりますね？

<img src="/static/images/SecretSharingDAOs/twopoints.png">

ですので、`2-of-N`の秘密分散（`K = 2`）を構築することを考えます。分散したい情報を`S`とすると、まずランダムな傾き`m`をとり、`y = mx + S`という直線を作成します。そして`N`人それぞれに直線上の点`(1, m + S)`, `(2, 2m + S)`, `(3, 3m + S)`を教えます。

`N`人のうち、任意の２人がお互いの情報を教え合えば、`S`が分かりますが
１人では何もできません。たとえば`(4, 12)`という点を持っていても、元の直線は
`y = 2x + 4`、`y = -10x + 52`、`y = 305445x - 1221768`というように無限にあり得るからです。

`3-of-N`の秘密分散を適用する場合、直線を放物線（二次関数）に変えればOKです。

<img src="/static/images/SecretSharingDAOs/threepoints.png">

２つの点がわかっただけならば、その点を通る放物線は無限に考えられますが、３つの点を通る放物線は一意に求まります。したがって上と同様の原理で復元できます。

同様にして、`K-of-N`の秘密分散を行いたい場合、`K - 1`次の多項式を用いればよいということがわかるでしょう。
この操作を[多項式補完](https://en.wikipedia.org/wiki/Polynomial_interpolation)と呼び、多数のアルゴリズムが存在します。
このことは[Erasure Codingに関する以前の記事](https://blog.ethereum.org/2014/08/16/secret-sharing-erasure-coding-guide-aspiring-dropbox-decentralizer/)でより詳しく論じています。

これが秘密分散DAOにおける情報の保持方法です。それぞれの参加ノードが状態の完全なコピーを同期して持つのではなく、その**一部分**を多項式中の点として持つのです。

## 基礎技術: コンピュテーション

秘密分散DAOはどのように計算を行うのでしょうか？

計算にあたっては[Secure multiparty computation(SMPC)](https://en.wikipedia.org/wiki/Secure_multi-party_computation)
と呼ばれる一群のアルゴリズムを用います。これは原則的には

1. `N`人が秘密分散によってデータを保持する。
2. 分散化された状態でコンピュテーションを行う。
3. 参加者全員が計算後のデータのみを手にする。途中でいかなるデータも単一のノード上で復元されることはない。

というものです。

SMPCによる加算は単純です。説明のために先ほどの「2点が直線を作る」例を用いましょう。ただし今回は2つの直線が出てきます。

<img src="/static/images/SecretSharingDAOs/twolines.png">

二つの直線`A`, `B`と`x=1`とのそれぞれの交点`A(1)`, `B(1)`をノード`P[1]`が保持していると考えます。
同様に`x=2`上の2点を`P[2]`が保持しているとします。
それぞれのノードが自身の持つデータを自分で加算し以下の値を新しく作ると

`C(1) = A(1) + B(1)`, `C(2) = A(2) + B(2)`

新しい直線ができます。

<img src="/static/images/SecretSharingDAOs/twolinesum.png">

`C = A + B`が`x=1`と`x=2`で成り立つのは自明ですが、興味深いことに、`C`は **すべての** 点において`A + B`と等しくなっています。

<img src="/static/images/SecretSharingDAOs/twolinesum2.png">

故に以下が成り立ちます。

秘匿情報の（同一のx座標における）合計値は、合計値の秘匿情報と等しい。

これはより高次元の場合にも成り立つので、`a`の秘匿情報と`b`の秘匿情報から**`a`, `b`のいずれをも再構成することなく**`a+b`の秘匿情報を計算することができます。
また、定数倍する場合にも同様の議論が成り立つため、秘匿情報`a`と定数`k`から`a*k`の秘匿情報を計算できます。

残念なことに、秘密分散した値同士の掛け算は[より複雑](http://www.eecs.harvard.edu/~cat/cs/tlc/papers/grr.pdf)です。
いくつかのステップがあり、どのような分散の仕方の場合でも複雑さに大差がないため、いきなり任意の多項式についての場合を説明をしていきます。

計算を行いたい値`a`と`b`があり、`P[1]` ... `P[n]`のそれぞれが保持する秘密分散の値を`a[i]`、`b[i]`とします。つまり以下のような状態から開始します。

<img src="/static/images/SecretSharingDAOs/secretmultiply.png">

加法の場合と同じ考えで行くと、それぞれのノードが`c[i] = a[i] + b[i]`を計算して`c = a + b`を作れば良いということになりますが、可能なのでしょうか？

意外に思われるでしょうが、これ自体は可能なのです。ただ、深刻な問題がつきまといます。計算結果の多項式が元の倍の次数になるのです。例えば元が`y = x + 5`と`y = 2x - 3`だったとすると、計算結果は`y = 2x^2 + 7x - 15`となります。

故に１回以上の乗算をすると、`N`個のノードが保持するにはあまりに大きすぎる多項式になってしまいます。

この問題を回避するため、一種のリベーシングプロトコルを用います。大きな多項式の秘密分散を、より小さな次数の多項式の秘密分散に変換するのです。以下がその方法になります。

まず、 ノード`P[i]`が`a`、`b`と同じ次数のランダムな多項式を新しく生成します。ただし`c[i] = a[i] * b[i]`がゼロになるようにします。
次に、その多項式`c`上の点を全ノードに分散させます。

<img src="/static/images/SecretSharingDAOs/secretmultiply2.png">

よって、`P[j]`は全ての`i`に対して`c[i][j]`を持つことになるので、`c[j]`を計算することが可能になります。つまり全員が`a`、`b`と同じ次数の多項式`c`の秘密分散を持つということです。

<img src="/static/images/SecretSharingDAOs/secretmultiply3.png">

これは、秘密分散プロトコルの気の利いたトリックによって達成されています。
秘密分散の数学的背景からは、加算と定数の乗算しか出てこないため、操作の順序が交換可能であることを利用しているのです。

秘密分散をレイヤAで実行し、その後レイヤBで実行したとします。その後レイヤAの分散を取り除いてもレイヤBによって秘密は保護されたままです。
これにより次数の高い多項式を次数の低いもので置き換えても秘密を暴露してしまうことがありません。２つのレイヤを**同時に**適用することがミソです。

`0`, `1`という２つの数字に対して加算と乗算を実行することができれば、任意の論理回路を構築することができます。
なぜならば以下のような演算を定義できるからです。

* `AND(a,b) = a * b`
* `OR(a,b) = a + b - a * b`
* `XOR(a,b) = a + b - 2 * a * b`
* `NOT(a) = 1 - a`

というわけで任意のプログラムを実行できるようになるわけですが、まだ一つ制約があります。条件分岐です。

たとえば`if ( x == 5 ) <do A> else <do B>`のような計算を行いたい場合、ノードは自身が分岐Aを計算しているのかBを計算しているのかを知らなくてはなりませんので、xを明らかにする必要があります。

この問題には２通りの解決策があります。一つが「貧乏人のif」を用いることです。

賢いプロトコルを用いれば、上記の演算と何らかの乗法を有限回繰り返すことで、任意のif文を表現できます。
（例えば有限体上では、[フェルマーの小定理](https://en.wikipedia.org/wiki/Fermat%27s_little_theorem)を`a - b`に適用することで`a == b`をチェックできます。）

もう一つわかり易い例をあげると、`if (x == 5) <y = 7>`は`y = (x == 5) * 7 + (x != 5) * y`と等価であることがわかります。

これから見ていく２つ目の方法では、if文をEVM（訳注: Ethereum Virtual Machine）内で実装し、SMPC内でEVMを実行することです。
最終的に、これはEVMが計算終了までに何ステップの演算を行ったかという情報以外には何も漏らしません。
（もし必要ならこれすらも曖昧にすることが可能です。例えばステップ数をもっとも近い２の乗数に切り下げると、効率性を犠牲にして情報の流出を防ぐことができます。）

上述の、秘密分散に基づいたプロトコルによるSMPCは比較的単純な例で、実際には他のアプローチも存在します。
例えば、セキュリティを向上するため、[verifiable secret sharing](https://en.wikipedia.org/wiki/Verifiable_secret_sharing)のレイヤーをトップに加えるというのもありうるでしょう。しかしここでは最小限の実装について述べるだけにします。

## 貨幣の作成

これでSMPCの大雑把な仕組みについて解説しました。では、いかにしてここに分散化された貨幣のエンジンを組み合わせましょう？
このブログでは、ブロックチェーンを解説する際には普通、以下のような説明をしてきました。

1. 状態`S`を持つシステムが、トランザクションを受理
2. どのトランザクションが指定の時刻に実行されるべきか合意を形成
3. 状態変更(transition)関数（`APPLY(X, TX) -> S' OR INVALID`）を実行

ここでは、**全ての**トランザクションが有効であり、有効でないトランザクション`TX`を適用した場合は単に`APPLY(S, TX) = S`となると仮定します。

ブロックチェーン自体には秘匿性がないので、ユーザーがブロックチェーンに送ることのできるトランザクションには次の２つがあると期待できるでしょう。

* *get requests* ... 特定のアカウントに対して、現在の状態に関する何らかの情報を尋ねる。
* *update requests* ... 状態に対して適用するトランザクションを送信する。

ここでは、アカウントは対照表(balance)とnonceしかリクエストできず、自身に関する情報しか引き出せないようにルールを実装します。

> 訳注: 上の文は訳に自信がないので、原文を載せます。
> We’ll implement the rule that each account can only ask for balance and nonce information about itself, and can withdraw only from itself.

二種類のリクエストを以下のように定義します。

```
SEND: [from_pubkey, from_id, to, value, nonce, sig]
GET: [from_pubkey, from_id, sig]
```

データベースは以下のフォーマットで`N`個のノードで管理されます。

<img src="/static/images/SecretSharingDAOs/accounts.png">

要素が３つのタプルでアカウントを表現し、データベースはその集合になります。
３要素とは所持者の公開鍵、Nonce、対照表です。

リクエストの送信のため、ノードはトランザクションを構成し、それを秘密分散の化します。
それぞれの分散にランダムに生成したリクエストIDと、少量のProof of Work(PoW)を付加します。PoWの不可は以下の理由のためです。

1. スパムに対抗する何らかの仕組みが必要なため
2. 対照表はプライベートなので、送信者のアカウントがトランザクションの料金を支払うのに十分な資金を持っていなくてはならないため

その後各ノードは、トランザクションに含まれる公開鍵と、分散化されたデータの署名とに齟齬がないかの検証をそれぞれ独立に行います。（このように秘密分散のそれぞれに対して、分散ごとに署名・検証するアルゴリズムが存在します。[Schnorr署名](https://en.wikipedia.org/wiki/Schnorr_signature)などがその有名なカテゴリです。）
受け取った秘密分散が（署名、もしくはPoWに問題があるために）有効でないと判定したノードは拒絶し、有効であると判断した場合受理します。

受理されたトランザクションは即座に処理されるわけではなく、ブロックチェーンのアーキテクチャのように、いったんメモリにプールされます。そして１２秒毎になんらかの合意形成アルゴリズムを適用して、処理の順序をノード間で揃えます。
アルゴリズム自体はなんでもよく、`N`からランダムに一つノードを選んでそれに従うとか、[Pebble](https://app.park.io/auctions/view/pebble.io)で使用されているような改良版 ネオ-BFTアルゴリズムを用いるとかが考えられますが、単純にしておきたいならばアルファベット順にソートするだけでも十分でしょう。

### GETリクエスト発行時の処理

GETリクエストに対して答えるため、SMPCで、以下のようにしてアウトプットが計算されます。

```

owner_pubkey = R[0] * (from_id == 0) + R[3] * (from_id == 1) + ... + R[3*n] * (from_id == n)

valid = (owner_pubkey == from_pubkey)

output = valid * (R[2] * (from_id == 0) + R[5] * (from_id == 1) + ... + R[3n + 2] * (from_id == n))

```

何を意味する等式でしょうか？これは大きく３つのステップから成り立っています。

1. 特定のアカウントの収支を記録した対照表を返すために、そのアカウントの公開鍵を取得。
 * データベースにある公開鍵にインデックスでアクセスすれば簡単に取得できるように思われますが、計算過程はSMPCによって行われるため、ノードにはそのインデックスの情報がありません。そこで、ここでは単純にデータベースの全インデックスを取って、無関係のものに０をかけて合計しています。
2. リクエストによって取得されようとしているデータが、本当にその保持者のものなのかを公開鍵の照合によって確認。
 * トランザクションを受け取った際に、そこに含まれる公開鍵自体の検証を済ませていることに留意してください。そのため、ここではアカウントのIDと`from_pubkey`との照合だけで十分です。
3. 最後に、分散化された公開鍵を取得するのに用いたのと同じデータベースから対照表を取得して、有効なトランザクションであれば再構成した対照表を、そうでなければ０を返します。

### SENDリクエスト発行時の処理

ここからはSENDの処理についてみていきましょう。まず、以下の手順で述部の有効性をチェックします

1. 処理対象の公開鍵の有効性確認
2. nonceが正しいことの確認
3. アカウントが送信に十分な資産を持っていることの確認

これには、GETリクエストの処理でも用いた「同等性をチェックして合計する」プロトコルを用います。繰り返し用いるので、`R[0] ( x == 0) * (x == 1) + ... `を`R[x * 3]`という簡略表記で表すことにします。

```

valid = (R[from_id * 3] == from_pubkey) * (R[from_id * 3 + 1] == nonce) * (R[from_id * 3 + 2] >= value)

```

その後、以下によってデータベースをアップデートします。

```

R[from_id * 3 + 2] -= value * valid
R[from_id * 3 + 1] += valid
R[to * 3 + 2] += value * valid

```

`R[x * 3] += y`は`R[0] += y * (x == 0), R[3] += y * (x == 1)`というように複数の手続きの簡略表記です。
これらは全て並列化可能であることに注意してください。
また、対照表のチェックのため`>=`演算子を用いている点も要注意です。これは上述の論理回路構成の仕組みで実現できますが、[賢いトリック](http://www.iacr.org/archive/pkc2007/44500343/44500343.pdf)を用いるとさらに効率よく、加算と乗算だけで実行することが可能です。

ここまでで、このSMPCアーキテクチャには、計算効率性についての２つの原理的な制約が存在することがわかります。

1. データベースへの読み書きにはO(n)のコストがかかる。
 * もし、一部の区画のみに対して読み書きを実行していくとすると、データベースのどこにアクセスがあったのかを覚えておくことで統計的に情報を抽出することが可能になってしまうため、データベースの全インデックスに対してクエリをかける必要があります。
2. 乗算を行うためには、ネットワーク間のメッセージの送信が必要なので、計算に当たっては（メモリやCPUではなく）ネットワークが大きな律速になる。

そのため、残念なことですが秘密分散ネットワークは神のプロトコルからは程遠いものです。ビジネスロジックは問題なくこなせますが、それ以上に複雑なことは不可能です。暗号による認証法の構築でさえ、このプラットフォーム用に作られた適切な暗号化技術（多くの場合高くつきます。）を用いなくては不可能でしょう。

## 貨幣からEVMへ

次に考えなくてはいけないことは、いかにしてこのおもちゃのような貨幣を汎用的なEVMプロセッサに持ってくるかという点です。
では、単一のトランザクション環境での仮想マシンのコードを見ていきましょう。簡略化された関数のコードは以下のようになります。

```python

def run_evm(block, tx, msg, code):
    pc = 0
    gas = msg.gas
    stack = []
    stack_size = 0
    exit = 0
    while 1:
        op = code[pc]
        gas -= 1
        if gas < 0 or stack_size < get_stack_req(op):
            exit = 1
        if op == ADD:
            x = stack[stack_size]
            y = stack[stack_size - 1]
            stack[stack_size - 1] = x + y
            stack_size -= 1
        if op == SUB:
            x = stack[stack_size]
            y = stack[stack_size - 1]
            stack[stack_size - 1] = x - y
            stack_size -= 1
        ...
        if op == JUMP:
            pc = stack[stack_size]
            stack_size -= 1
        ...

```

ここでは以下のような変数が出てきています。

* The code
* The stack
* The memory
* The account state
* The program counter

よって、これらをまとめてレコードとして管理し、コンピュテーションのステップごとに以下に似た関数を実行します。

```python

op = code[pc] * alive + 256 * (1 - alive)
gas -= 1

stack_p1[0] = 0
stack_p0[0] = 0
stack_n1[0] = stack[stack_size] + stack[stack_size - 1]
stack_sz[0] = stack_size - 1
new_pc[0] = pc + 1

stack_p1[1] = 0
stack_p0[1] = 0
stack_n1[1] = stack[stack_size] - stack[stack_size - 1]
stack_sz[1] = stack_size - 1
new_pc[1] = pc + 1
...
stack_p1[86] = 0
stack_p0[86] = 0
stack_n1[86] = stack[stack_size - 1]
stack_sz[86] = stack_size - 1
new_pc[86] = stack[stack_size]
...
stack_p1[256] = 0
stack_p0[256] = 0
stack_n1[256] = 0
stack_sz[256] = 0
new_pc[256] = 0

pc = new_pc[op]
stack[stack_size + 1] = stack_p1[op]
stack[stack_size] = stack_p0[op]
stack[stack_size - 1] = stack_n1[op]
stack_size = stack_sz[op]
pc = new_pc[op]
alive *= (gas < 0) * (stack_size < 0)

```

キモは、全オペコードを並列に実行し、状態を更新するのに適切な物をチョイスするという点にあります。`alive`変数は１から開始し、何らかのタイミングで０になります。するとその後の全ての操作は「何もしない」になります。
これは恐ろしく非効率的なやり方に見えますし、実際その通りです。
しかし忘れないでください。ボトルネックはコンピュテーションではなくネットワークのレイテンシにあるのです。
抜け目のない読者ならばお気づきでしょうが、全オペコードを並列に実行することはオペコードの行数nに対してたかだかO(n)の計算量でしかありません。
（簡略化のために上では行いませんでしたが、スタックから複数の要素を同時に抜き出してそれ用の変数に入れればさらに高速になります。）
ですので、ここは一番重いコンピュテーションが必要なところですらないのです。ストレージやアカウントの数がオペコードの数より多い場合（妥当な想定だと思われます）、データベースのアップデートがそれになります。
Nステップが終了するごと（情報の流出を少なくしたい場合は、２の乗数に切り捨てたのち）に、`alive`変数を更新し、`alive = 0`ならば終了します。

十分な参加者がいる場合、EVMの最大のオーバーヘッドはデータベースになるでしょう。その場合、情報の流出具合とのトレードオフをうまいこと調整してやれば、オーバーヘッドを緩和することができます。
例をあげましょう。実行されるコードはデータベースのシーケンシャルなインデックスから読まれ、それに多くの時間を費やすことがわかっています。ですので、対応策の一つとして、コードを大きな数字のシークエンスとして保持しすることが考えられます。
それぞれの数字は何行かのオペコードをエンコードしているので、[ビット分解プロトコル(bit decomposition protocol)](http://www.iacr.org/archive/pkc2007/44500343/44500343.pdf)を用いて個々のオペコードに変換できます。

EVMを抜本的に効率化する方法にはこれ以外にも様々なものが考えられるでしょうが、この文書の目的はあくまでどのようにすれば秘密分散DAOが可能であるかを示すことに過ぎませんので、最適な実装方法などには深入りしません。

付け加えると、[スケーラビリティ2.0](https://blog.ethereum.org/2014/10/21/scalability-part-2-hypercubes/)で説明したようなテクニックを使用すると効率性の向上のために状態のコンパートメント化をすすめることができるかもしれません。

### Nの更新

ここまで説明してきたSMPCの仕組みでは、所与の参加ノード数`N`が与えられ、その中の一部（1/3か1/4以下の割合）とのコンセンサスの不一致に対してセキュアなシステムを作る。という前提で話をしてきました。

しかし、ブロックチェーンプロトコルは理論上は永遠に持続可能なものでなくてはならないので、経済的にstagnantなものであってはなりません。

> 訳注: ここでいうstagnantは、構成ノードが（インセンティブを求めて）動的に入れ替わっていくことがない。という意味です。

そのために、以下のようなプロコトルを導入します。

1. 秘密分散DAO全体の時間を「エポック」に分割する。各エポックは数時間から数週間持続するとする。
2. 一番最初のエポックは、genesisのsaleの間の上位N個のノード（訳注: 早く参加したノードか、多く参加したノードかは任意と思われる。）を選択する。
3. エポックの終了ごとに、次のラウンドにノードとして参加したいものは署名をした上でデポジットを投下します。その後N個のノードがランダムに選ばれ公開されます。
4. 「分散化引き継ぎプロトコル」が実行され、N個のノードが自身の保持する秘密分散データを新しいNに分割して再分配します。その後新規Nノードは、そのデータから自身の保持すべき秘密分散を（掛け算に用いたのと同じ方法で）再構成します。お察しの通り、これにより参加ノード数を増やしたり減らしたりすることが可能です。

以上は参加者が全て信頼できるという前提のもとで完璧に機能しますが、暗号通貨のプロトコルにおいてはインセンティブも必要です。そのために[verifiable secret sharing](https://en.wikipedia.org/wiki/Verifiable_secret_sharing)の原理をいくつか利用することで、秘密分散に関係する処理の間、特定のノードが誠実に振る舞っていたかどうかを判定することができます。

原理を簡単に説明します。
秘密分散による計算を２つのレベルで並行して行います。１つが整数を利用したもの、もう一つが楕円曲線（いくつかの選択肢があるでしょうが、暗号通貨ユーザーにとってはsecp256k1が馴染み深いのでこれを用いることにします。）上の点を利用したものです。

楕円曲線上の点は、交換法則と結合法則を満たす加法演算子が定義されているため扱いやすいことが知られています。要するに、普通の数値と同じように足し算や引き算を行えるということです。数値を楕円曲線上の点に変換することは容易ですが、逆は不可能です。更に次の等式が成り立ちます。`number_to_point(A + B) = number_to_point(A) + number_to_point(B)`

数値と楕円曲線上の点との２つのレベルで同時に秘密分散を実行し、楕円曲線上の点を公開することで、不法行為を検出することができます。
効率の向上の為、[Schellingcoinスタイルのプロトコル](https://blog.ethereum.org/2014/03/28/schellingcoin-a-minimal-trust-universal-data-feed/)によってノードが他のノードを罰することができる仕組みを導入することが可能でしょう。


## 応用

我々は何を手に入れたのでしょうか？ブロックチェーンが「分散化されたコンピュータ」ならば、これは「分散化されたコンピュータ + プライバシー」です。

この新たな要件を、秘密分散DAOは妥当なトレードオフ（掛け算とデータベースアクセスに必要なネットワーク通信コスト）と引き換えに満たしてくれます。
結果として、正統派Ethereumよりもガスのコストは大分高くなり、コンピュテーションは単純なビジネスロジックに限られ、ほとんどの暗号技術を用いた計算は難しいでしょう。
スケーラビリティを考慮した設計にすることでマシにはなるでしょうが、どこかで原理的な限界に突き当たると思われます。
従ってこのテクノロジーは、全てのユースケースに対して適用できるものではなく、特定目的のカーネルのように特殊な分散アプリケーション専用のものとなるでしょう。例えばこんな感じです。


#### 医療情報

データを秘密分散化してプライベートに保持しておくことで、簡単に使えて、かつセキュアな、患者自身による健康情報管理システムへの道が開かれるでしょう。
特に自家製の診断アルゴリズムをDAO上で実行することができるので、医療診断 as a Serviceが可能になります。医療診断会社による、意図的・非意図的な保険会社や別の会社への情報流出を防ぐことができます。

#### 秘密鍵の預託

パスワードのリカバリのための情報を一箇所に置いておく代わりに、分散化して冗長性をもたせて管理しておくことが可能です。

#### 汎用的マルチシグ(Multisig、多重署名)

柔軟なアクセス制御や、M-of-N 認証をネイティブにサポートしていないシステムでも、DAO管理した秘密鍵を差し込むことで導入が可能です。

#### レピュテーションシステム

他人への自分からの「評価」をスコア化してこっそり渡し、相手の全評判に対する自分の寄与率を見ることができたらどうなるでしょう？もちろん他人の寄与率はみれませんので匿名性は担保されています。


#### プライベートなファイナンシャルシステム

秘密分散DAOは[Zerocash](http://zerocash-project.org/)風の完全匿名通貨を別の方法で作ります。ただしこちらは分散化された両替をより簡単に達成し、より複雑なスマートコントラクトにも拡張できます。
ビジネスユーザーには会社の運営費にレバレッジをかけて純利益をあげたいというニーズがあるかもしれませんが、これならビジネスロジックを公開することなく行うことができます。

#### マッチメイキングアルゴリズム

雇用者・被雇用者や、デートの相手、分散アプリ上でのUber、などなど。
マッチメイクが必要な場合に個人情報を一切漏らすことなく、アルゴリズムの出力した結果のみを知ることができます。

#### まとめ

まとめると、SMPCによって得られる効果は、[暗号によるソースコード難読化(cryptographically secure code obfuscation)](http://bitcoinmagazine.com/10055/cryptographic-code-obfuscation-decentralized-autonomous-organizations-huge-leap-forward/)
によるそれとよく似ています。唯一違うのは、人間にとって実用的なタイムスケールで動作するという点です。

## その他

上記の応用以外に秘密分散DAOによってもたらされるものは何でしょう？考慮しておくべき自体はないでしょうか？
結論から言うと、ブロックチェーンそれ自体と同様、いくつか憂慮事項は存在します。

まず、もっともはっきりしていることは、秘密分散DAOによって完全に匿名化された状態で実行されるアプリケーションの領域が大きく拡大されるということでしょう。
ブロックチェーンの支持者は、その論拠の多くをブロックチェーンベースの貨幣が共通して持つ特徴から導いています。
その特徴とは、アドレスと物理的なアイデンティティを結びつけることができないという意味での高い匿名性を持つ一方で、トランザクションと台帳が世界中で分散管理されているという意味で世界で最もオープンなシステムであるという性質です。
ここでは前者の性質は保持されている一方で、後者は完全になくなっています。従って完全な匿名性を達成したと言えるでしょう。

もし、この強力な匿名性によって、犯罪的行為が助長されるということが運用開始後に判明し公共からの反感を買った場合、政府やその他の機関が、もしかしたら善意のボランティアハッカーでさえもがこのシステムを落とそうとするかもしれませんし、それが正当とみなされる可能性もあります。
彼らにとって幸いなことに、秘密分散DAOには取り除くことのできないバックドアが存在します。51%攻撃です。特定の時刻において、秘密分散DAOのメンテナーの51%が共謀した場合、管理下にある全てのデータを明らかにすることができます。
さらに、この権利には時効がありません。過去のある時点でメンテナになっていた組織の51%が数年後に共謀した場合でも、その過去の時点でのデータを明らかにすることができます。
まとめると、システム内部で起きていることに社会が大きな反感を抱いた場合はオペレータがシステムを停止したり、内部の状態を見たりすることは十分可能だということです。

２つ目に






-----

翻訳ここまで

参考:
計算を伴わない分散ストレージに関してはこの記事より以前の
[Secret Sharing and Erasure Coding: A Guide for the Aspiring Dropbox Decentralizer](https://blog.ethereum.org/2014/08/16/secret-sharing-erasure-coding-guide-aspiring-dropbox-decentralizer/#finitefields)が詳しいです。