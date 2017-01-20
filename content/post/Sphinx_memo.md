---
categories: ["hack", "memo"]
date: 2016-05-30T19:25:26+09:00
description: "Memo for reSTructuredText and Sphinx"
draft: false
tags: ["ReST", "python", "julia"]
title: "reSt, Sphinxメモ"
---


# reSTructuredText

`pip install docutils`すると
`rst2html`でhtmlにできる。
`rst2s5`でhtmlスライドにできる

## markdownと違う点

### 見出し

#### h1見出し

```
========
title 1
========

```
ここで、title1が上下の線より長いと怒られる。

### h2

下だけ`=`
```
title 2
========
```

##### h3

ハイフンで囲む

```
-------
title 3
-------
```

##### h4

下だけハイフン

```
title 4
-------
```

h5やh6はない
#### ラインブロック

`|`で囲む


\|ここの部分の
\|文章はそのまま
\|生の文字列になる

#### replace

```
.. |hoge| replace:: ほげ
```

と書いておくとほかの|hoge|がほげに変換される。いっぱいあるときは、別ファイルに書いておいて

```
.. include:: definition.txt
```

とする

#### リンク

#### 外部リンク

markdownと違い、外部参照のリンクはドキュメントの末尾にまとめて書かれる。

ここでのポイントは、..と\_


```
`Plone CMS`_ を試してみてください。これはすばらしいですよ！ Zope_ 上に作られています。

.. _`Plone CMS`: http://plone.org
.. _Zope: http://zope.org
```


末尾でなくともOK

```
`python <www.python.org>`_
```

#### 内部リンク

```
.. _ex-hoge:

---------------
ほげほげ
---------------

```

このように、章や節の上に記述して定義する。

```
--------
他の場所
--------

ほげほげに関しては :ref:`ほげほげ<ex-hoge>` として任意のテキストで参照します。

```

#### ソースコードの記述

インラインリテラルは\`\`を2つずつつける必要がある。

`print("hoge")` -> reST中では\`\`print("hoge")\`\`

インラインでない通常のリテラルは::の後に、インデントを入れることで記述可能

```
next paragraph is source code::
               #ここの空白は必須
    1 + 1
```

`..code-block::`を使ったほうが良いかも。htmlの例

```
..code-block::html
    :linenos:  # 行番号を表示

    <h1>hogehoge</h1>
```

外部ファイルをインクルードする場合は

```
 ..literalinclude::filename
    :linenos:
    :language: python
    :lines: 1, 3-5
    :start-after: 3
    :end-before: 5
```

#### テーブル

```
=====  =====  =======
A      B      A and B
=====  =====  =======
False  False  False
True   False  False
False  True   False
True   True   True
=====  =====  =======

```

ただし、これは書くのが難しいのでcsvやListを使用する

```
.. csv-table:: Frozen Delights!
   :header: "Treat", "Quantity", "Description"
   :widths: 15, 10, 30

   "Albatross", 2.99, "On a stick!"
   "Crunchy Frog", 1.49, "If we took the bones out, it wouldn't be
   crunchy, now would it?"
   "Gannet Ripple", 1.99, "On a stick!"


.. list-table:: Frozen Delights!
   :widths: 15 10 30
   :header-rows: 1

   * - Treat
     - Quantity
     - Description
   * - Crunchy Frog
     - 1.49
     - If we took the bones out, it wouldn't be
       crunchy, now would it?

```

### ディレクティブ, directive

Sphinx拡張のものと、rst標準のものがある

#### 目次

```
.. contents::
```

#### toctree

章や節に番号を振りたいときは

```
.. toctree::
   :maxdepth: 2
   :numbered:

   overview
   design
   implementation
```

`:glob:`をtoctreeの下に追加するとglob表現で複数の対象を一括指定できる

#### 画像

```
.. image:: gnu.png
```

で画像を表示できる。`gnu.png`のところは、rstファイルからの相対パスや絶対パスも指定できる。
html出力すると、`_static`のようなディレクトリにコピーされる。

#### note(ノートブロック)の表示

```
.. seealso:: This is a simple **seealso** note
.. note:: note that ...
..  warning:: be careful not to ...
```

#### 脚注、footnote

`[#]_`を使用する

```
hogehoge [#f1]_.
.. [#f1] hogehogeに特に意味は無い
```

あるいは`[1]`のように普通に番号を振っても良い


#### 引用

Sphinx拡張の機能

```
This Idea is originally from [Ref]_

.. [Ref] Book or article reference or url
```


#### TODO

```
.. todo:: ブロック図を描く

.. todolist::   #文書中の全てのTODOリストを集めて表示
```

#### よく使うSphinx拡張ディレクティブ


# Sphinxについて

### 始める

`sphinx-quickstart`,以下のディレクトリとファイルを作成する

- Makefile
- _build
- _static ... CSSとか？
- _templates　… htmlテンプレートの置場
- conf.py ... 設定ファイル。拡張モジュールのpathや言語の設定などをかける。
- index.rst　...　ソースファイル
- make.bat
途中で言語を聞かれるがjaを選択する

`make latex`,`make latexpdf`、`make html`等でrenderする.詳細は`make help`で

### テーマの変更

Sphinx組み込みのテーマなら簡単。

```
html_theme = "classic"
html_theme_options = {
    "rightsidebar": "true",
    "relbarbgcolor": "black"
}
```

詳しくは[こちら](http://docs.sphinx-users.jp/theming.html#using-a-theme)

### Sphinx拡張

下で書いているもの以外にもdocstringをドキュメント中に組み込んだり、Graphviz、継承関係図、カバレッジなどを取り込むことができる

#### sphinx.ext.todo

rstファイルの中で

* `.. todo::`という記法でtodoを作成できる
* `.. todolist::`ディレクティブを使用すると、ドキュメント内のすべてのTODOをリストにして表示する

#### sphinx.ext.jsmath、Sphinx.ext.pngmath

それぞれjsMath(java
script)、dvipngを利用して数式を表示する
*現在はjsmathではなく、mathjax*を使う

#### mathjax

`.. math::`ディレクティブを使用できるようになる。その中ではlatex記法で書く。例

```
.. math:: e^{i\pi} + 1 = 0
    :label: euler

.. math::
    :label: quite

    (a + b)^2 &= (a + b)(a + b) \\
              &= a^2 + 2ab + b^2
```

:label:を付けると、数式にラベルと数式番号を付けることができ、:eq:を用いて参照することができる。例 :eq:\`euler\`

#### plnatuml

uml図が作れる


#### S6

スライドショーが作れる

#### 作図

よく使いそうなのは

* blockdiag
* nwdiag
* actdiag
* seqdiag

くらい。継承関係図は別

##### 継承関係図

大きく3つのやり方がある。


1. `sphinx.ext.graphviz`を使用して図を描く ... `graphviz::`ディレクティブを使用する。抽象度が低い分単純な図しか書けない。
2. `sphinxcontrib.plantuml`を使用してJavaっぽい図を描く ... `pip install sphinxcontrib-plantuml`でインストールしたのち、`.. uml::`ディレクティブを使用する。3に比べて自由な図をかける点にメリットがある。
3. `sphinx.ext.inheritance_diagram`を使用する。... ソースコードの状態が反映される。


ややこしいのだが、`conf.py`中では`sphinx.ext.inheritance_diagram`と、アンダーバーを使用しているが、ディレクティブはアンダーバーではなく`-`を使用する。

```

.. inheritance-diagram:: matplotlib.patches matplotlib.lines matplotlib.text
    :parts: 2

```

### docstringの取り込み

docstringがReSTで書かれていればそのまま取り込めるが、Google Style, Numpy styleで書かれている場合は`sphinx.ext.napoleon`を使用してpreprocessしなくてはならない。

* `.. automodule:: MyModule`
    - 再帰的に取り込みたい場合は`:members:`オプションを追加する
    - `:undoc-members:`でdocstringのないメンバーも追加できる。
    - `:special-members:`で`__add__`のような特殊なメンバーもついか
