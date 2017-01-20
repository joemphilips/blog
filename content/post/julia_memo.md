---
categories: ["hack", "memo"]
date: 2016-07-10T16:15:49+09:00
description: "personal memo for Julialang"
draft: false
tags: ["Julia"]
title: juliaの備忘録
---

# Juliaメモ
---

##基本事項

### パッケージ

```julia

Pkg.init() # インストール時にとりあえず実行しておく
Pkg.add("DataFrames")   #インストール
Pkg.status("Dataframes")    #version情報などを表示
using DataFrames    #Rでいうlibrary()

Pkg.update()    #インストールされているパッケージ全てをアップデート

```

## Pythonの資産を使う

```julia

Pkg.add( "PyCall" )
using PyCall
@pyimport numpy.random as nr
nr.rand()   #=> 0.254253265675362が返る

```

sklearn

##パッケージ作成

`Pkg.generate("MyPackage", "MIT")` ... ひな形の作成(第二引数はライセンス)
ファイルの中身は

本体
```julia:src/MyPackage.jl

module MyPackage
#packageの中身

end

```

テスト

```julia:test/runtests.jl

using MyPackage
using

```

### その他便利なパッケージ

* Documenter.jl
* Optim.jl
* Pkg.Dev

## TIPS

使いやすいマクロ

`@show` 変数をformatして表示
