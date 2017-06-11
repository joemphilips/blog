---
categories: ["crypto"]
date: 2017-04-17T22:29:45+09:00
description: "memo about Extension block"
draft: true
tags: []
title: extension blockとは
---



ソフトフォークで1MBの制限を撤廃することが目標

# メモ

## [はじめの提案（2013年）](https://bitcointalk.org/index.php?topic=283746.0)

当初はauxiliary blockと呼ばれていた。

* ヘッダーのないブロックを付け加える。
* `OP_NOP1`を`OP_AUX`として再定義する。
* はじめ、このブロックは空だが、 `<serialized script x> OP_AUX`という形式のScriptPubkeyに送信すると
coinbaseに似たトランザクションをauxiliary blockに作成し、
これは`<deserialized script x>`へとコインを送信する。
Auxiliary blockのマークルルートはメインブロックのcoinbaseに含まれる。
アップグレードしたノードはメインチェーンからAUX chainへと正しくコインが送金されている事を検証する。
* aux chainのBTCはメインチェーンのものと同様に送受信できる。
* Y額のaux coinをmain chainに戻したい時は、以下のフォーマットのScriptPubkeyに送る。
 * `<serialized script y> OP_AUX OP_RETURN`
* これをみたマイナーは、`OP_AUX`のUTXOを、総額がYと一致するようにランダムに選び、メインチェーンの`<deserialized script y>`に渡す。

後方互換性:

1. 古いノードはauxのブロックを見ないので、auxブロックはいくらでも大きくなれる。
2. 古いノードからは`OP_AUX`のアウトプットは誰でもredeemできるように見えるので、ハードフォークにはならない。
3. 古いノードがこの`OP_AUX`のアウトプットを盗もうとした場合、多数派のマイナーによって拒否される[^1]
4. `OP_AUX`のトランザクションを含めたり、redeemしようとしたりしない限り、古いノードはマイニングに参加する事ができる。

[^1]: アップグレード済みノードが多数派を占める場合に限るのでは？

## [Johnson Lauによる提案(2017)](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2017-January/013490.html)



## [Spec](https://github.com/tothemoon-org/extension-blocks/blob/master/spec.md)

* Extension blockに含まれるトランザクション(xtx)はSegWitで"flag"欄に`0x02`という値を持つ。

### Resolution

extension blockのUTXOセットの合計値を記録していくための仕組みとしてresolution transactionというものを導入する。
ex blockへの支払いのin,outの両方を扱う。

ex block、main blockにまたがるトランザクションを一つでも持っているブロックは必ずresolution txを持たなくてはならない。
これはextension blockに入ろうとしたトランザクションの全てのアウトプットを持ち、そのブロックの最後のトランザクションとして必ず存在しなくてはならない。
(新しく作られたアウトプットを全てsweepするため)

これは誰でも払えるアウトプット(`OP_TRUE`)に行き、他の`resolution`トランザクション以外には支払いできないよう、
マイナーによってコンセンサスが強制される。

resolution txはもう一つ、ex blockを脱出するアウトプットを持たなくてはならない。

コインベースアウトプットはwitness programmを含んではならない。
もし含むと前述のように、resolution txによってsweepすることができない（コンセンサスの強制ができない）ため

resolution txの最初のinputは直前のresolution txの最初のアウトプットを指さなくてはならない。

feeはextension txの中からresolution txへと「伝搬」していく。
言い換えると、resolution txのfeeはex block内のfeeの合計と等しくなる。

### Bootstrapping

ex blockのブートストラップのため、"genesis" resolution txが必要になる。

これは1-100 byteのスクリプト（push onlyの単一のオペコードを持つ）を最初のインプットの中に持っても良い。
ここに適当なデータを持たせられるが、特に深い意味はない。（じゃあ書くなと言いたい）

### Resolutionの規則

resolution txの最初のアウトプットの値は以下と等しくなくてはならない。

`(previous-resolution-value + entering-value - exiting-value) - ext-block-fees`

続くアウトプットスクリプトと値はex blockの既存のアウトプットと完全に同一でなくてはならない。(ex blockに現れる順番と全く同一)

resolution txのバージョンは固定する必要がある。

## [Luke DashjrによるMLでの会話](https://lists.linuxfoundation.org/pipermail/bitcoin-dev/2017-April/013981.html)

1. BIP141やハードフォークに比べてもやや複雑な提案である。
2.


## [Purseの発表した公式文書](https://github.com/tothemoon-org/extension-blocks/blob/master/spec.md)



### [FAQ](https://medium.com/purse-essays/extension-block-commonly-asked-questions-dec3431b7d8d)

Q. ブロックサイズはどうなるのか？

A. [extnet](https://github.com/bcoin-org/bcoin-extension-blocks/issues/2)（extension block専用のテストネット）でのブロックサイズは6mbのハードリミットと、2mbのソフトリミットを用いている。

ソフトリミットはトランザクションの「コスト」と呼ばれる新しい基準に基いて計算される。コストはscriptのバージョンによって決まる。
現時点で存在するスクリプトバージョンはコストを８倍にし、不明のものは1倍にする。

将来的に新しいバージョンのスクリプトを導入した際は、この倍率をさらに小さくすることで新しいバージョンのプログラムほど
ブロック内を消費するスペースが小さくなるようにする。

