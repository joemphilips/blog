---
categories: ["hack", "memo"]
date: 2016-11-09T13:54:12+09:00
description: "How R's model.matrix and model.formula .etc works"
draft: false
tags: ["R", "statistics"]
title: Rのmodel.matrixの説明
---

`glmnet`や`randomForest`といったパッケージで教師有り学習（回帰）を行う際に、Rのformulaを直接与えると、
`data.frame`では変数の数が多い場合にオーバーヘッドがでかくなる場合がある。

あらかじめ前処理として`model.matrix`（どの列が説明変数で、どの列が応答変数なのかの情報をmatrixに含ませたもの）に変換しておくと、各列の変数の型がそろうのでメモリ使用量が大幅に減る場合がある。


`data.matrix`というものもあるが、こういった場合には使用するべきでない。なぜなら`factor`が整数値になってしまい、互いに独立であるはずのfactor間に大小関係が生まれてしまうため。例えば

```R

df = data.frame(x=c('a', 'b', 'c'), y=c(1, 2, 3))
print(data.matrix(df))
##      x y
## [1,] 1 1
## [2,] 2 2
## [3,] 3 3

```

`x`に`a + b = c`という望ましくない関係が生まれてしまう。

対して`model.matrix`を使用すると`factor`を自動でダミー変数化(別々の列に分解)してくれる。

```R

print(model.matrix(as.formula(~0+x+y), # x, y共に説明変数のデザイン行列を作る
                   data=df)
     )

```

これは以下のような出力を出す。

```R

##   xa xb xc y
## 1  1  0  0 1
## 2  0  1  0 2
## 3  0  0  1 3
## attr(,"assign")
## [1] 1 1 1 2
## attr(,"contrasts")
## attr(,"contrasts")$x
## [1] "contr.treatment"

```

`x`が`xa`, `xb`, `xc`の3列に分解されていることがわかる。

なんのために`formula`に`0+`を加えているかというと、これを加えない場合`R`は`xa`, `xb`, `xc`のうち一つを省略するため。
（`xb`, `xc`がともに0ならば`xa`は必ず1になるため2列あれば3列目の内容は必ずしも必要ない）

だが、話をややこしくしないためにとりあえず`0+`を加えておいた方がよいと思う。

応答変数は何なんだと思うかもしれないが、例えば`glmnet::glmnet`の場合は引数として別に与えるので、`model.matrix`に含ませる必要はない。


多くの`R`の回帰関数(e.g. `lm`)は、このようなダミー変数化とデザイン行列への変換を自動で行ってくれるため、変数が`numeric`でなくても何も考えずに使うことができる。




### 参考

* https://www.r-bloggers.com/r-minitip-dont-use-data-matrix-when-you-mean-model-matrix/
* http://stackoverflow.com/questions/17032264/big-matrix-to-run-glmnet
