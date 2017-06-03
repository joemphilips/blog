---
categories: []
date: 2017-05-21T11:53:16+09:00
description: ""
draft: true
tags: []
title: "C++製のオーダーマッチングエンジンliquibookのメモ"
---



オーダーオブジェクトをQuickFIX,QuickFASTでシリアライズ、デシリアライズして、
データの保持と、マッチングを行う。

オーダーオブジェクトは以下のようなプロパティを持つ。

* Side ... 売り、または買い
* 量
* シンボルで表されたアセットの種類
* 
