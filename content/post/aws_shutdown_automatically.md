---
categories: ["hack"]
date: 2016-01-01T19:57:08+09:00
draft: true
description: "how to use AWS lambda and Data PipeLine to auto shutdown if EC2 not running"
tags: ["Shell", "AWS", "Linux"]
title: "EC2が計算を行っていないときに自動的にシャットダウンする"
---

# 動機

AWS EC2を個人的な計算環境として使用していると、うっかりシャットダウンするのを忘れてそのまま走らせ続けてしまうことがたまにあります。例えば

1. プロセス終了時に自動でシャットダウンするよう指示しておくのを忘れる。
2. 後で続きをやろうと思ってシャットダウンせずに別のことをはじめ、そのまま忘れる。

そういった原因でEC2の起動時間が延び、料金が積もってつらみが増します。

ですのでaws lambdaとaws data pipelineを用いて、EC2がなにも計算を行っていない場合に自動的にシャットダウンするような仕組みを作りました。

#
