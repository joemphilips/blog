---
categories: ["hack", "memo"]
date: 2016-01-01T19:17:22+09:00
description: "doc2vec実行時の備忘録など"
keywords: ["python"]
draft: true
title: "Doc2Vec and gensim"
---

# `gensim`

## `gensim.corpus`

よく使われるコーパス用のアダプタクラス一式。例えばwikipediaのdumpを読み込みたい場合


## `gensim.models.doc2vec.TaggedDocument`

`namedtuple`のラッパー、二つのリストからなる。

1. 単語文字列 ... e.g. `[u"this", u"is", u"a", u"pen"]`
2. タグ ... e.g. `[u"SENT_1"]`, 要素数は任意だが一つだけにしておいた方が良い

## `TaggedLineDocument`

`TaggedDocument`と同様に使用できるが引数としてファイル名(あるいはファイルオブジェクト)をとる。gzされていてもよい。Taggedドキュメントにおけるタグは、行数から自動的に作成してくれる。あらかじめ空白で区切られていなくてはならない。

## `gensim.models.Doc2Vec`

`TaggedDocument`のイテレータ、あるいは`TaggedLineDocument`を引数としてとる。

### メソッド

* `Doc2Vec.corpus_count` ... 元となったTaggeDocumentの数

