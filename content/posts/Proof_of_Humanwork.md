---
categories: ["memo"]
date: 2017-01-23T22:05:12+09:00
description: "about Proof of Human-work(PoH)"
draft: false
tags: ["cryptocurrency"]
title: Proof of Human-workについて
---

* 元論文 ... https://eprint.iacr.org/2016/145.pdf

# 概要

* 目的 ... Proof of workで解くべき問題を、[CAPTCHA](http://www.captcha.net/captcha_crypt.pdf)の一種を用いて、
「コンピュータにとっては難しいが、人間にとっては簡単」なものにする。


これにより、[ゲーミフィケート](http://link.springer.com/chapter/10.1007/978-3-642-39345-7_5)したり、
[教育目的に転用したり](https://www.computer.org/csdl/proceedings/isbast/2012/4696/00/4696a001.pdf)
社会にとって有用な目的に使用させたり（[例えば画像のタグ付け](https://www.cs.cmu.edu/~biglou/reCAPTCHA_Science.pdf)）
できる。

CAPTCHAの仕組みには直観的には解決不可能に思える問題点がある。

1. CAPTCHAを生成するコンピュータ自体が答えを知ることなく、人間にとって解きやすい(しかし他のコンピュータには解けない)問題をどのようにして作るのか？
2. 仮にそれができたとして、答えを検査する側はその問題が誠実に作られたということをどのようにして知るのか？
3. チェックする側は、どのようにして人間の助けを得ることなしに問題の答えを知るのか？

これらはIndistinguishable Obfuscationと呼ばれる方法で回避できるようになった...らしい

## obfuscationによるCAPTCHAパズルの生成

問題を$Z$とし、その答えを$\sigma$とする。問題作成者は$\sigma$を知ることなしに$Z$を作らなくてはならない。
これは2013年に[indistinguishability obfuscation](https://eprint.iacr.org/2013/451.pdf)という大きなブレイクスルーがあったのでこれで成し遂げられる。

直観的には、これは$Z$をobfuscatorの中で生成し、$\sigma$をその中に「閉じ込めておく」というプロトコル。
さらに、答えのチェックをobfuscateされたプログラムの内部で行うことができる。

まず、PoWを簡単に定式化すると、パズル$x$に対して、$H(x, s)$を様々なnonce(論文中ではwitnessという言葉を使っている)$s$の元で計算し、値が一定の数値以下になるものを探す。というもの。

対してPoHでは
$x, s$からハッシュ値$r$を生成し、これを種にして$Z$と$\sigma$を作成する。
マイナー（人間）は$Z$を保持するが、その中の$r$と$\sigma$へのアクセス権は持たない。
その状態で、$H(x,s,\sigma,Z)$が一定値以下になるものを探す。
verification tag($x=\sigma$)を満たすときのみ1になり、他はすべて0になるような点関数)というものを用いることで、$(x,s,\sigma,Z)$が条件を満たすか否かがわかる。

承認者が、確率$1 - (\frac{1}{2})^{\omega}$で正しいタプル$(x,s,\sigma,Z)$を拒否するようにしておけば、$\omega$をいじることで、PoWと同じように難易度を調整することができる。

PoWはランダムオラクルを用いて一様分布からサンプリングするが、PoHでは別の分布からサンプリングしなくてはならないので[ユニバーサルサンプラー](https://eprint.iacr.org/2014/507.pdf)というものを用いる

先行研究に[GOTCHA](https://www.cs.cmu.edu/~jblocki/papers/aisec2013-fullversion.pdf)というものもあるが、これは問題作成に人間がコミットする必要があり、答え合わせも人間がする必要があるので、暗号通貨での応用には適していないとのこと。

WEB上のセキュリティの問題の多くは、「何らかの権利を"タダ"で与えてしまうと、Sybil Attackに対する耐性がなくなる」
という点に帰着する。
PoWのすばらしさは"タダ"でコインを手に入れることができないという点にある。PoHもこの点を継承して一定の労働を投下させた場合にのみ、ブロックを作成できるようにする。


### ユニバーサルサンプラー

以下の2手順でサンプリングする。

* $U \leftarrow Setup(1^{\lambda})$ ... セキュリティパラメータ$\lambda$をとってサンプラーパラメータ$U$を返す。
* $p_d \leftarrow Sample(U,d)$ ... パラメータ$U$と、最大サイズが$l=poly(\lambda)$の回路(分布)$d$をとり、サンプル$p_d$を返す。

というのがユニバーサルサンプラーの基本だが、ここでは$\beta$を$Sample$関数の引数に加えることで、分布のランダムネスをあらかじめ調整しておく。この手法は[How to generate and use universal samplers](http://eprint.iacr.org/2014/507)で詳細に議論されている。

# PoH

マイニングに応用する場合、大きく5つの手順からなる。

* Setup ... セキュリティパラメータ$1^{\lambda}$と、難易度パラメータ$1^{\omega}$をとってSystem public parameterを返す(i.e. $PP \leftarrow Setup(1^{\lambda}, 1^{\omega})$)
* パズル生成ランダムアルゴリズム$G$で問題を作成 ... $x \leftarrow G(PP)$
* 問題を人間が解きやすい（が、コンピュータには解きにくい）形式に変換する。ここではUniversal sampler を使用してCAPTCHAインスタンスを作る。
* 問題を解かせ、それをビットコインにおけるPoWと同様に、マイニング報酬とともにブロードキャストする。PoWもセットで付けることも可能
* verification function$V$を用いて答えを検証する。$b := V(PP,x,a)$ ただし、正しければ$b=1$そうでなければ$b=0$

# Future Challenges

大きく3つの問題点がある。

1. Indistinguishable Obfuscation schemeに大きなブレイクスルーがない限り現実的ではない(?) ... 特定の問題に対する効率の高いtargeted obfuscation schemeをデザインできるか？という問題は未解決
2. 「特定の問題がAIによって解きにくい（が、人間には解ける）」ということに依拠しているため、AI技術の発達によって破られる可能性があり、長期的に機能するか怪しい
3. Setupの段階で問題作成が誠実に行われている必要がある。これはZerocashなどでも同様。Setup PhaseをSMPCで行えば問題ないとされる。これは[Secure sampling of public parameters for succinct zero knowledge proofs.](http://www.ieee-security.org/TC/SP2015/papers-archived/6949a287.pdf)で提案されている。

# 感想

個人的にこの論文の画期的な点は、暗号通貨のICOがしやすくなる点にあると思う。
PoSの場合、初期の保持者が有利すぎるし、PoWは過去と同じものを使えない
（例えばビットコインと同じPoWを使ったらビットコインのマイナーが簡単に51%攻撃を行えてしまう）
上に、のちにPoSに移行した際にハードウェアが無駄になる。
そういった問題点がなく、コインが欲しい場合は労働でゲットできる。
