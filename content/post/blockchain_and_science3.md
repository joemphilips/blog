---
categories: ["poem", "hack"]
date: 2016-12-11T22:42:37+09:00
description: "why blockchain matters for scientists"
draft: true
tags: ["blockchain", "cryptocurrency"]
title: なぜブロックチェーン技術は科学者にとって重要なのか
---


# 3. ピアレビューからピア2ピアレビューへ

現行の[ピアレビュー制度が崩壊している](http://biomedcircus.com/research_02_54.html)、あるいはしつつあることは、特に生命科学業界では大きな問題です。

[指摘自体はされている](http://time.com/81388/is-the-peer-review-process-for-scientific-papers-broken/)

とはいえ、エディターの仲介による偽匿名性レビューに代わる方法を探すのも、既存のWebのシステムの中では難しいことも事実です。

査読者を完全にオープンにしてしまうと利害関係が発生し、
完全に匿名化して自由にコメントをつけることができるようになると無責任な中傷が横行する可能性があります。
科学者用のSNSのような仕組みでレビューをするとしても、PseudoAnonymousな

匿名出版を可能にしてしまえば

Wikipediaは信頼できません。[^2]

これらの問題に対しては、まずレビューそれ自体にインセンティブを与える必要があります。
もちろん大量に無責任なレビューをすることを許してしまっては意味が無いので匿名性

例えば[pubpub][pubpub]というMITメディアラボとMIT Pressが推進するオープンジャーナルプラットフォームがあります。科学者向けの[diaspora](https://en.wikipedia.org/wiki/Diaspora_(social_network))のようなものです。

まだ萌芽的段階で、ブロックチェーンのブの字も出てこないのですが、
MITメディアラボが行っている時点で将来的にはブロックチェーンを用いたインセンティブ（あるいは信用の可視化）やDapp化を行う方向に行く可能性は高いです。[^1]
（そうでなければWikipediaと変わりませんしね）

## 予測市場(prediction market)

### 現時点の科学出版の問題点

1. [サイエンティフィックジャーナルの購読料は高すぎる](https://www.theguardian.com/science/2012/apr/24/harvard-university-journal-publishers-prices)
が、自由競争が働いていないので放置されている。
 * 「編集には手間がかかる」というのが出版社側の意見だが、[それにしても高すぎる](http://econ.ucsb.edu/~tedb/Journals/jeprevised.pdf)
2. 細分化が進みすぎて[理解が追いつかない](http://www.the-scientist.com/?articles.view/articleNo/34196/title/Opinion--Communication-Crisis-in-Research/)
3. [同分野内の学者にすら理解されない論文](https://en.wikipedia.org/wiki/Sokal_affair)の出版を招くようなインセンティブ構造がある。
4. サブミットからパブリッシュするまでに異様に長い年月がかかる。
5. レビュアーに誠実にレビューするインセンティブがない。（それどころか邪魔をするインセンティブすらある。）
6. これらの帰結として、
[多くの](http://www.economist.com/news/briefing/21588057-scientists-think-science-self-correcting-alarming-degree-it-not-trouble)
[研究には](http://www.jove.com/blog/2012/05/03/studies-show-only-10-of-published-science-articles-are-reproducible-what-is-happening)
[再現性がない](http://journals.plos.org/plosmedicine/article?id=10.1371/journal.pmed.0020124)

とはいえ、科学出版以外の方法にも問題はある。

1. マスコミによる報道 ... 意見の偏りや利益追求的なポジショントーク
2. Wikipedia, SNS ... 責任の不在。[自分に都合のいい情報だけがみえる現象。](https://en.wikipedia.org/wiki/Echo_chamber_(media)))


### なぜ予測市場が科学に向いているのか

予測市場が最もよく機能する条件は

1. 問題の解釈が多様な観点を必要とし、情報源が一つ出ないこと
2. 結果の解釈が定量的にでき、曖昧な点がないこと
3.
例えば「山田太郎は来年までに死ぬ」という命題は殺人への強いインセンティブを与えるが、科学的な命題の場合はそうではない。

### Q. なぜパブリックブロックチェーン上で行う必要があるのか？

#### A1. 胴元を「消す」(あるいは分散化させる)ため

1. マーケットが小さいと
 * 賭けが成立しない
 * 市場の不安定性が増し、投機によるバブルが発生しやすくなる。
2. マーケットが大きいと
 * 胴元の利益には正当なマージンに加えてインサイダー利益もある。
 * 検閲（権力者にとって不利な賭けを操作したり、賭けの対象にすることを禁じたり）することによる利点が大きすぎる。

一言でいうと「大きすぎるマーケットは胴元が常にパレート優越でないと機能しないから」
といえる。ビットコインが必要である理由と全く同じ。

### Q. なぜサイドチェーンが必要なのか

1. 「投票の結果に応じて賭け金を分配する」というところを自動化するため
 * 単純なスマートコントラクト機構が必要
2. Votecoinの扱いが、ビットコインのブロックチェーンには組み込まれていないため


### ゼロサムゲームなので無意味では

1. 保険は全てゼロサムゲームだが、無意味であると考える人は少ない。
2. 賭けの当事者同士ではゼロサムだが、外部から見ると「賭けの状態」それ自体に価値がある。
(例: 例えば「水素水に効能があることを支持する科学者はほとんど居ない」ことがわかるなど)
3. 2のメリットは「正しい賭けを行った人物の発言権(= 資産)が増す」ことによって強まっていく。

### 仮説は収束しないのでは？

「曖昧すぎる」という理由で却下できる。

### 収束したとして、それが「正しい」とはいえないのでは？

予想市場における「真理」は[プラグマティズム](http://www.iep.utm.edu/pragmati/)的な意味での真理に限るという点に注意してほしい。

つまり、[パース](https://ja.wikipedia.org/wiki/%E3%83%81%E3%83%A3%E3%83%BC%E3%83%AB%E3%82%BA%E3%83%BB%E3%82%B5%E3%83%B3%E3%83%80%E3%83%BC%E3%82%B9%E3%83%BB%E3%83%91%E3%83%BC%E3%82%B://ja.wikipedia.org/wiki/%E3%83%81%E3%83%A3%E3%83%BC%E3%83%AB%E3%82%BA%E3%83%BB%E3%82%B5%E3%83%B3%E3%83%80%E3%83%BC%E3%82%B9%E3%83%BB%E3%83%91%E3%83%BC%E3%82%B9)による真理の定義、「十分な調査を行った人々が最終的に同意する意見」
であり、道具的真理にすぎない。

「将来に渡って誰からの同意も受けないだろうが、私はこれを正しいと知っている。」
という類の意見は予測市場の（というか実際には「科学の」）扱う範疇にない。


### 科学的仮説に白黒がついていくスピードは人間にとっておそすぎるのでは？

科学的仮説の内、特に根本的で重用なもの、たとえば

* 宇宙は有限か
* 地球外知的生命体は存在するか

というものもあるが大丈夫か？

A. 回収に40年かかる株式に投資しても、40年待たずに売ってしまって良い。

### 「アホな金持ち」の影響力が強すぎるのでは？

彼らは真摯な科学者の養分となってくれる。
あるいは（彼らが金持ちのままで居たいなら）「真摯な科学者」を自分で見抜く強いインセンティブが与えられる。


### 答えを「操作」できるのでは？

予測市場のオッズ比を何らかの政策の「答え」として扱う場合、自己充足的な命題の扱いが難しいという問題がある。

これはFutarchyの実現が難しいとみなされていた一番の理由でもある。

例えば「2025年までに[常温核融合](https://ja.wikipedia.org/wiki/%E5%B8%B8%E6%B8%A9%E6%A0%B8%E8%9E%8D%E5%90%88)の再現可能な方法が発見される。」
という命題に対して賭けを行う場合、
「常温核融合ができるようになると困る人物」（この例の場合、エネルギー業界の既得権益者だろうか）
が「No」に対してBettingすることで、文科省が「常温核融合への科研費の投資は有望でないというのが社会の総意なのか」と判断し、
科研費がおりず、したがって実際にその方法が見つからないということがあり得る。

Hivemindでは[Augmentation](http://bitcoinhivemind.com/papers/5_PM_Manipulation.pdf)と呼ばれる手法を適用することでこの問題を回避している。

<img src="/images/Science_blockchain/Augmentation_002.png"></img>



# Truthcoin/Hivemind






## 仕様

1. VotecoinとCashcoinを発行する。
2. 市場を「ブランチ」に分け、それぞれでVotecoinを発行する。
3. 賭けの対象となる命題をあげ、インターバルを挟む
 * 命題は例えば真偽値（2017年のアメリカ合衆国大統領選挙はヒラリークリントンが勝つ）スカラー値（2018年の世界平均気温は〇〇度である。）を取ることができる。
4. 投票を行う。正直に答える事を想定しているため、「他人と同じ内容に投票する」ことに利益がある。また「命題が曖昧すぎる」と思う場合は`0.5`という値を投票する。

# 参考

* 17世紀に科学的事実の予測と科学者の動機づけに市場原理を使うことを提唱していた証拠 ... Debus, A. (1970) Science and Education in the Seventeenth Century, MacDonald, London.)
* [Could Gambling Save Science](http://mason.gmu.edu/~rhanson/gamble.html)
* [Market Empricism](http://bitcoinhivemind.com/papers/1_Purpose.pdf)
* [Hivemind: Prediction Market Myths](http://bitcoinhivemind.com/papers/4_PM_Myths.pdf)
* [Capitalizing on Market Manipulation with “Augmentation"](http://bitcoinhivemind.com/papers/5_PM_Manipulation.pdf)

# 脚注

[^1]: http://www.dynamisapp.com/whitepaper.pdf
[^2]: http://www.enigma.co/ZNP15.pdf
[^4]: https://steem.io/SteemWhitePaper.pdf
[^5]: https://www.comsys.rwth-aachen.de/fileadmin/papers/2014/2014-bitsch-extremecom-liquid-democracy.pdf
[^3]: https://www.iotatoken.com/
[^6]: https://www.ethereum.org/dao
[^7]: 収入がある程度上がると幸福度が頭打ちになり、社会的承認欲求の方がより重要視されるようになるためです。もちろんこれは教師に限った話ではなく、医師、政治家など他の職業でもまったく同様です。

[^1]: メディアラボには[暗号通貨イニシアティブが存在しますし](https://www.media.mit.edu/research/highlights/media-lab-digital-currency-initiative)[所長の伊藤穰一はブロックチェーン業界の代表的な論客](https://joi.ito.com/jp/archives/2016/06/16/005601.html)です。
[^2]: http://www.findingdulcinea.com/news/education/2010/march/The-Top-10-Reasons-Students-Cannot-Cite-or-Rely-on-Wikipedia.html


[pubpub]: https://www.pubpub.org/
[semweb]: https://ja.wikipedia.org/wiki/%E3%82%BB%E3%83%9E%E3%83%B3%E3%83%86%E3%82%A3%E3%83%83%E3%82%AF%E3%83%BB%E3%82%A6%E3%82%A7%E3%83%96
