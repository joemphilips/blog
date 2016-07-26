---
categories: ["hack"]
date: 2016-07-10T00:34:46+09:00
description: "Juliaのエラーハンドリングについて"
draft: false
keywords: ["julia"]
title: juliaのエラーハンドリングに関するメモ
---

エラーをどう扱うかに関しては、大きく二つのアプローチがある。

1. Look Before You Leap approach (LBYL) ... 初めにすべてファイルの存在と有効な形式であることをチェック
2. Easier to Ask Forgiveness than Permission (EAFP) ... 問題が起こるたびに`try/catch`で回避



