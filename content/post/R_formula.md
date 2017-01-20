---
categories: ["memo", "hack"]
date: 2016-10-25T17:07:58+09:00
description: "how formula in R works"
draft: true
tags: ["R", "statistics"]
title: "Rのformulaの仕様に関するメモ"
---

`応答変数 ~ 説明変数1 + 説明変数2` という形が基本

チルダ(`~`)の右辺では以下の表現が使用できる。

* `+x` ... `x`を含める
* `-x` ... `x`を除く
* `x:z` ... `x`と`z`の交互作用項を追加
* `x*z` ... `+x`,`+z`,`x:z`を追加
*
