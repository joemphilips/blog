---
categories: ["hack", "crypto", "device"]
date: 2017-01-03T19:50:34+09:00
description: "review for Ledger products"
draft: false
keywords: ["cryptocurrency"]
title: Ledger nanoの導入とLedger製品のレビュー
---

## そもそもなぜ[ハードウェアウォレット](https://en.bitcoin.it/wiki/Hardware_wallet)が必要なのか

ビットコイン（に限らず全ての暗号通貨）は「自分がこの支払いをする資格を持っている」ということを証明するために
[デジタル署名](https://ja.wikipedia.org/wiki/%E6%9A%97%E5%8F%B7%E7%90%86%E8%AB%96#.E3.83.87.E3.82.B8.E3.82.BF.E3.83.AB.E7.BD.B2.E5.90.8D_.28digital_signature.29)を必要とする
のだが、当然ながら署名にはメモリとCPUが必要になる。

秘密鍵の保持だけならばストレージだけがあれば良く、これは[コールドストレージと呼ばれる。](https://en.bitcoin.it/wiki/Cold_storage)

ただ、支払いを行う際には秘密鍵を用いてトランザクションに署名する必要があるので、CPUを持つデバイス上に持ってくる必要がある。

ここで問題が生じる。普段からネットに接続し、別のことに使っているコンピュータの場合、
「マルウェアに侵されていない」ということを確信することができない。

そこで普段使うデバイスとは別に独立した小さいコンピュータを持つ必要がある。これがハードウェアウォレット

実質、ただの小さなコンピュータなので[Raspberry piで自作することもできる](http://www.pi-wallet.com/)

市販のハードウェアウォレットと、Raspberry Piによる自作で何が違うのかというと、「デバイス自体が盗まれた際の安全性」が違う。

例えば攻撃者がデバイス自体を盗んで取得したとしよう。
ハードウェアウォレットは署名に当たってPINコードの入力が必要なので、デバイスを持っていても送金はできない。

これ自体はRaspberry piでも同様のことが実現できるのだが、熟達した攻撃者であれば

1. Brute forceする
2. メモリをダンプする
3. マルウェアでサイドチャネルを仕込む

で回避する方法は色々ある。

それを防ぐにはPINの入力を一定回数誤ったらファームウェアレベルでロックするとか、メモリ上のデータを自動で暗号化するなどといった、高度に特殊化したハードウェアを作る必要がある。

> もちろん、特殊化したファームウェアであろうともクラックすることは原理上不可能ではないので、完璧ではない。
> この点に関しては製造会社を信用するしかない。

したがって、
[Yubikey](https://www.yubico.com/products/yubikey-hardware/yubikey4/)の製造元であるYubicoでは[ハードウェアはクローズに、ソフトウェアはオープンに](https://www.yubico.com/2016/05/secure-hardware-vs-open-source/)の原則を貫いており、
Ledger Nano Sの販売元であるLedger社も[同様の方針を取っている。](https://ledger.groovehq.com/knowledge_base/topics/is-it-open-source)

ソフトウェアがオープンである利点は、言うまでもなく[リーナスの法則](https://ja.wikipedia.org/wiki/%E3%83%AA%E3%83%BC%E3%83%8A%E3%82%B9%E3%81%AE%E6%B3%95%E5%89%87)に尽きる
のだが、ハードウェアがクローズドである点は議論の余地がある。（クラック**しにくい**ということにどれだけの意味がある？製造元がサイドチャネルを仕込むかもしれないじゃないか。ということらしい）

Ledger社は以下の理由からクローズドソースを肯定している。

1. 他のスマートカードも同様の方針であること
2. 仕様はオープンになっていて検証可能であること

Trezorの製造元である[SatoshiLabs](http://satoshilabs.com/)は対象的に「ハードウェアもオープンに」の姿勢を取っている。[keep key](https://www.keepkey.com/)も同様
そもそもハードウェアをなくした時点でアウトなので気にするなということか


長々と議論したが、
どんなハードウェアウォレットを持っていても[5$レンチ攻撃](https://xkcd.com/538/)（現実世界での物理攻撃）には無力なので、
数十万BTCを保持しているとか、ボディガードをつけるような身分であるとかでない限り、
どちらを選んでも大差ないので好きな方を選ぶと良いと思う。

大まかな方針としては

1. 保持BTCが月収以下ならウェブウォレットで
2. 月収以上年収以下ならLedger nanoで
3. 年収以上ならLedger nano S、Trezor、KeepKeyで

管理するくらいが良いと思う（もちろん金額の絶対量にもよるが）

自分は大してBTCを持っていないので、今回はLedger製品でも一番安い[Ledger nano](https://www.ledgerwallet.com/products/1-ledger-nano)を購入した。

## Ledger nano

値段は29ユーロ

写真に撮り忘れたけど、はじめは全体がラップで包まれていて、それが未開封の証明になっている。

こんな感じ。

<img src="/images/LedgerNano_review/IMG_0020.JPG">





中身はこう。

<img src="/images/LedgerNano_review/IMG_0023.JPG">

左から

1. 本体
2. ストラップ用の紐と箱
3. リカバリーシート ... 秘密鍵QRコードと24単語のメモスペース、本体をなくした際の復旧用
4. 説明書
5. ２段階認証のためのセキュリティカード



本体はこれ

<img src="/images/LedgerNano_review/IMG_0022.JPG">

### 実際に設定してみる

初回設定作業はセキュアなコンピュータ上で行う。

[全５種類のLedger製品のリスト](https://www.ledgerwallet.com/start)

<img src="/images/LedgerNano_review/Ledger_Wallet_-_Get_started_with_Ledger.png">

今回はLedger Nanoなので、クリックしてこちらに飛ぶ。

<img src="/images/LedgerNano_review/Ledger_Wallet_2.png">

ここで[Google chromeの拡張としてwallet](https://www.ledgerwallet.com/apps/bitcoin)が自動でインストールされる。
初めてのLedger製品だとインストールされるらしい。
されない場合は[こちら](https://chrome.google.com/webstore/detail/ledger-wallet-bitcoin/kkdpmhnladdopljabkgpacgpliggeeaf/related)から。

アプリを起動するとこんな画面が立ち上がる。

<img src="/images/LedgerNano_review/Ledger_Wallet_3.png">

今回は「新しいウォレットの作成」を行う。

４桁のPINコードを設定し、24単語のリカバリーフレーズを紙にメモする。

PINコードは（デフォルトでOKとは思うが）一応何回かシャッフルしておく。

24単語のリカバリーフレーズが出るので、**絶対にメモして、厳重に保管しておく**
、リカバリーシート内にメモをするところがある。

その後、一度抜き差しすると設定完了。もう普段のPCに移して使用しても大丈夫。

### 振り込んでみる

appの左上の「受信」タブをクリックすると以下のような画面が出る

<img src="/images/LedgerNano_review/Ledger_Wallet_Receive.png">

QRコードをスキャンするか、アドレスを送って別のウォレットから送信

以下のように結果が画面に表示される。

<img src="/images/LedgerNano_review/Ledger_Wallet_Receive2.png">

### 支払ってみる

受け取りと同様に「送信」タブをクリックすると以下の画面に。

<img src="/images/LedgerNano_review/Ledger_Wallet_send.png">

アドレス（カメラが付いているデバイス上ならQRコードも使える）と代金を入力し、手数料を3段階のうちから一つ選び、送信する。

２段階認証を聞かれるので、セキュリティカードを見て打ち込むか、スマートフォンをペアリングして送信する。

<img src="/images/LedgerNano_review/Ledger_Wallet_send2.png">

完了すると受信時と同様に画面にその旨が出る。

### その他のapp

メジャーなデスクトップクライアントである[Electrum](https://electrum.org/#home)、[MyCelium](https://mycelium.com/)で設定することもできるらしい（が、私は上述のChrome appで満足なので試していない）


### Ledger nanoの問題点

1. 認証時 ... PIN
2. 送金時 ... 4桁の鍵

を打ち込んでいるが、自分のコンピュータ上で行うので、もしそのコンピュータがキーストロークを読み取るタイプのマルウェアに侵されていた場合、無意味になる。

このタイプの攻撃に対処するため、同梱のセキュリティカードに入力文字列をシャッフルさせる
[シーザー暗号](https://ja.wikipedia.org/wiki/%E3%82%B7%E3%83%BC%E3%82%B6%E3%83%BC%E6%9A%97%E5%8F%B7)
の鍵が入っているが、よくできたマルウェアならば何回も入力しているうちに解読できてしまうので、100%セキュアではない

後述のLedger nano Sや老舗の[Trezor](http://satoshilabs.com/trezor/)は
キーボード自体をwalletにつけてしまうことでこの問題に対処している。


## その他のLedger製品


### [Ledger Unplugged](https://www.ledgerwallet.com/products/6-ledger-unplugged)

値段は29ユーロ

[Java card](https://ja.wikipedia.org/wiki/Java%E3%82%AB%E3%83%BC%E3%83%89)（JVMをカード上で実行できるようにしたもの）ベースのウォレット

Ledger nanoに比べると、USB端子がない端末でも使用できるという利点がある。

無線でやり取りすると通信を傍受される危険があるんじゃないの？
という危惧が生まれるが、それは大丈夫らしい。
[こちらの解説](http://www.atmarkit.co.jp/ait/articles/0508/12/news090.html)がわかりやすい

Java card自体も実績のあるものなので問題はないと思う。


### [Ledger HW.1](https://www.ledgerwallet.com/products/3-ledger-hw-1)

値段は15ユーロ

マルチシグ用に複数鍵を管理するためのデバイスということになっているが、
[実はLedger nanoと機能は全く同じ](https://www.reddit.com/r/Bitcoin/comments/4g8h3z/ledger_hw1_vs_ledger_nano/)

違うのは

1. サイズ
2. 値段
3. 耐久性（多分）

だけなので初めての購入にちょうどよいかもしれない


### [Ledger nano S](https://www.ledgerwallet.com/products/12-ledger-nano-s)

値段は58ユーロ

Ledger nanoより高機能だが若干高い

Trezorや[KeepKey](https://www.keepkey.com/)と同様、トランザクションをデバイス上で完結させることができるので、前述のマルウェアの問題がない。

また、EthereumやZcashのwalletとしても使用でき、
アプリケーションごとにマイクロカーネルを立てるので、Ethereumのアプリのバグがビットコインの秘密鍵流出につながるということがない。

現時点での対応コインは以下

<img src="/images/LedgerNano_review/Ledger_Nano_S_altcoins.png">

ついでにFIDO U2Fの機能もあるので、Yubikeyの代用としても使えるっぽい

[Zaifの公式ページで](https://zaif.jp/ledgerwallet)紹介している。


### [Ledger Blue](https://www.ledgerwallet.com/products/9-ledger-blue)

値段は ... 公式が在庫切れで見れない。多分200ユーロくらい？

一言で言うと「全部入り」。
上記の機能が全て入っている。

ジョブズの息吹を感じるデザインをしているが、

1. アプリケーション間の不干渉を徹底している（nano Sと同じ）
2. 好きなappを入れたり外したりできる。

という点もApple製品っぽい。

明らかに拡張性を意識しているので、対応アルトコインはこれから増えていくはず

## まとめ

Ledger製品はTrezorやKeepkeyに比べてアルトコイン指向が強いので、ビットコイン原理主義者ならばTrezor・Keepkeyで、アルトコインも保有したいならばLedger  nano SかLedger blueを持つのが良いと思う。


### こちらもどうぞ

* [以前自分で書いたyubikeyの説明](http://joemphilips.com/post/yubikey_setup/)

## 参考

* [Bitcoin Hardware Wallet Review: Ledger May Have Caught Up to Trezor With Nano S](https://bitcoinmagazine.com/articles/bitcoin-hardware-wallet-review-ledger-may-have-caught-up-to-trezor-with-nano-s-1473944111)

* [Review: How Well Does the Ledger Wallet Nano Balance Bitcoin Security and Convenience?](http://insidebitcoins.com/news/review-how-well-does-the-ledger-wallet-nano-balance-bitcoin-security-and-convenience/28446)
* [Zaifの解説ページ](https://zaif.jp/ledgerwallet)
* [知っておきたいICカードのタイプと使われ方](http://www.atmarkit.co.jp/ait/articles/0508/12/news090.html)
* [bitcoin news: なにかと話題のLedger Wallet Nanoを買ってみた！](http://btcnews.jp/reviewing-ledger-wallet-nano/)
