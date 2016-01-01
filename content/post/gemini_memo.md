---
categories: ["hack", "memo"]
date: 2016-01-01T19:29:28+09:00
description: "GEMINIはvcfにアノテーションをつけるためのsqliteのラッパー"
keywords: ["Bioinformatics", "RDBMS"]
title: "GEMINIメモ"
---


GEMINI
---

[TOC]

@(ブログ)

ヒトゲノムのannotation統合のためのツール
(元はここ)[http://gemini.readthedocs.org/en/latest/]
ENCODE tracks, UCSC tracks, OMIM, dbSNP, KEGG, and HPRD
のでーたがある。
SQLでクエリをかけれる
SQLite内に保存時テイル

##インストール
結構時間がかかるので注意(10時間位)
```sh
 wget https://raw.github.com/arq5x/gemini/master/gemini/scripts/gemini_install.py
 python gemini_install.py /usr/local /usr/local/share/gemini
 export PATH=$PATH:/usr/local/gemini/bin
```
デフォルトだと`/usr/local`、`/usr/local/share/gemini`へのインストールを推奨している
root権限無しでインストールする場合
`python gemini_install.py ~/gemini ~gemini --nosudo`、その後pathを通す。ここではrootでインストールしたものとする

`cd /usr/local/share/gemini/gemini && bash master-test.sh` ... インストール成功の可否をテスト(これも結構時間がかかる)

###各種コマンド

- `gemini update` ... geminiをアップデート
- `gemini update --dataonly` ... データのみアップデート
- `python /usr/local/share/gemini/gemini/install-data.py /mnt/biodata/annotation` ... アノテーションファイルのダウンロード。公式は`/usr/local/share`へのダウンロードを推奨しているが、Cloudbiolinuxのデータとまとめて扱うため、ここでは`/mnt/biodata`に入れる
`gemini load my`


##メモ
annovarは面倒くさい。GEMINIならほぼ常にVCFで扱える。
Annovarは完全なオープンソースでない。
GEMINIはsnpEffやVEPのつけたアノテーションにさらに足してくれる。
UCSCがVAIというのも出している。
