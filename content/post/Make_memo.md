---
categories: ["hack", "memo"]
date: 2016-01-01T19:08:13+09:00
description: "Memo for Makefile"
keywords: ["Make"]
title: "Makeメモ"
---

`make --just-print`
するとmakeの実行するコマンドの一覧が見れる。

configure時に
`--prefix=/usr/xxxx`
のように指定してやると、make install 先のディレクトリが/usr/xxxxになる。

# makeflow

makeに非常に似た構文でかけるパイプ作成ツール。シェルよりもfault toleranceが高い。

# minimal make

```make
ターゲット:依存するファイル
    コマンド
```

とすると、*ターゲットが存在しない* ||  *依存するファイルの更新履歴がターゲットより新しい*
時にのみ実行してくれる。なお、インデントはタブでなくてはならない

```make
.PHONY:clean

clean:
    rm -f file*.txt
```
とすると`make clean`で中間結果の削除ができる

