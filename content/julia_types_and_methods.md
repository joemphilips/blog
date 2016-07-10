---
categories: ["hack"]
date: 2016-07-10T00:34:46+09:00
description: "Juliaの型システムについて"
draft: true
keywords: ["julia"]
title: juliaの型とメソッドの言語仕様に関するメモ
---

# 型

Juliaでは、全ての型が`Any`の子孫だが、具象型を継承することはできない。

したがって継承用の抽象型と実行用の具象型の区別がはっきりしている。

具象型、抽象型のいずれも他の型(ただし、`isbits`が`true`を返す型)をパラメータとして与えることができる。

* `isbits` ... 引数の型がImmutableで他の型への参照を含んでいないかぎり`true`を返す。


`::`演算子は2つの機能を持つ。

1. 型チェックの機能 ... 関数の引数で型を指定すると(例: `myfunc(x::Float64)`)それ以外を受け取った時にTypeErrorを発生させる。
2. 型変換の機能 ... 変数のアサインをする際に指定すると`convert()`を自動で呼び出す。(例: `x::Int8 = 100`)

## 抽象型のミュータビリティ

抽象型の定義は`abstract 定義する型 <: 親の型`で行う。例:

```
abstract Integer <: Real
```

`abstract`をつけないと、型チェックに使える。`Integer <: Real`はTrueを返す。

コンパイル時に、それぞれの具象型に対応したものを必要な分(実際に呼び出している型の分)作成するため(例: `myfunc(Int)`は`myfunc(Int64)`など)引数に抽象型を指定しても性能に影響は無い。(抽象型のコンテナ型を与えた際に影響がある場合もあるらしい)

全ての型のルートには抽象型`Any`がある。これはわかりやすいが、その逆の`Union{}`は少しわかりづらい。これは継承関係のない2つの型を1つにまとめるために使用する。

```julia
IntOrString=Union{Int, AbstructString}
```

## 複合型

以下のように定義

```julia

type Hoge
    fuga
    piyo::Int
end

```

引数の型を指定しないでコンストラクタ`Hoge()`を呼び出すと`convert()`が呼ばれる。

デフォルトでミュータブルだが、`type`の代わりに`Immutable`を使用するとイミュータブルにできる。

```julia
immutable Complex
    real::Float64
    imag::Float64
end

```

Rustにおける参照のミュータビリティの概念はない。**以下の違いは重要**

* ミュータブルな型は参照を渡され、イミュータブルな型は必ずコピーを関数に渡される。 ... (イミュータブルな型はパフォーマンス向上目的には余り使えない?)

`Any`の下(直下かどうかはわからんが)にある重要なデータ型の一つに`DataType`がある。

## ジェネリック型

型パラメータを`{}`で与えることで作成

```julia

type Point{T}
    x::T
    y::T
end

```

Tに型制限を与えたい場合は後に述べる抽象コンテナ型を使用する。

`{}`で実際の方を指定して作成する`T`は抽象型であってもよい。例：

```julia
Point{AbstructString}

// デフォルトコンストラクタを呼び出す。
Point{Float64}(12.0, 24.5)

```

以下の違いは、メモリ上でのデータの保持の仕方に起因する。

* `Array{Float64} <: Array` ... true
* `Array{Float64} <: Array{Real}` ... false

`Array{Float64}`はベクトル化されるが、`Array{Real}`はされない。おそらく後者はヒープ上にallocateされる。

よって、コンテナ型を引数に取る関数を書きたい時、そのコンテナ型の中身の型が一定の条件を満たしていることを保証したければ、以下のように書く。

```julia

function norm(T<:Real)(p::Point{T})
    sqrt(p.x^2 + p.y^2)
end

```

Rustならばトレイト境界を使用するところだが、Juliaはあくまで抽象型のサブタイプであるか否かをチェックする。

`abstract`キーワードを用いることで、コンテナ型の抽象型を上位に用意しておくこともできる。

`abstract Pointy{T}`した上でPointの定義をこう変える。

```julia

type Point{T} <: Pointy{T}
    x::T
    y::T
end

```

`Point{Float64} <: Point{Real}`や`Pointy{Float64} <: Pointy{Real}`はfalseのままだが、`Point{Float64} <: Pointy{Float64}`はtrueを返すようになる。

こうしておくことで、`Pointy`のサブクラスが統一されたインターフェイスを持つことを保証して置けるようになる。

たとえばサブクラスが、その要素として実数を持つことを保証したい場合

`abstract Pointy{T<:Real}`

サブクラスがジェネリックならば、サブクラスの定義にも書いておく必要がある。

```julia

type Point{T<:Real} <: Pointy{T}
    x::T
    y::T
end

```

juliaにおける有理数(Rational)型の実装は今までに述べた機構を用いている。

```julia

immutable Rational{T<:Integer} <: Real
    num::T
    den::T
end

```

## タプル

イミュータブルなジェネリック構造体(以下)に似ている。python、Rustと同様`()`で作成できる。

```julia

immutable MyTuple{A, B}
    a::A
    b::B
end

```

しかしながらこのような構造体と違う点もある。

1. 引数の数は任意(上だと2つしか受け取れない。)
2. `Tuple{Int} <: Tuple{Any}`はtrueを返す。
3. フィールドに名前がない。
4. コンストラクタへの最後の引数は`Vararg`という特殊な型になることができる。

`Vararg{T}`は1つ以上のTとマッチする。これは可変長引数として使用する場合に使えるらしいが、どう使えばいいのかはよくわからない。

## シングルトン型

シングルトン型自体は、インスタンスが必ずシングルトンになる型全般をさすが、Juliaにおいては型オブジェクトしかない。

### 型オブジェクト

型の名前自体も`Type`という型に属する。つまり`isa(Float64, Type)`はtrueをかえす。

型変換とパラメータ型を受け取るメソッドについて説明するまで、このメリットはわからない。が、多分引数の型に応じて関数が行う処理をより柔軟に変更したい際に使える。

## 型の検査に使える関数群

* `typeof` ... インスタンスの属する型を返す(多分pythonの`__class__`に相当)
* `super` ... 型を渡すとその親を返す。

## Nullable型

RustでいうOptionに相当。中身が空でもOK

* `Nullable{Float64}()` ... 空の値を作成

中身のアンパックはRustのように`match`ではなく、`get()`関数を使用する。

* `get(Nullable{Float64}())` ... NullExceptionをraiseする
* `get(Nullable{Float64}(), 2.0)` ... `get()`の第一引数がNullなので、第2引数(2.0)を返す。
* `get(Nullable{Float64}(1))` ... 1を返す。


# 関数

代替pythonと一緒で助かる。

## オペレータ

関数として使うことができる。

`+(1,2,3)` ... 6

同名で使える分pythonより優れている(pythonの場合、`+`をオーバーライドするにaは`__add__()`を実装しなくてはならない)が、以下のオペレータはpython同様別名の関数が呼び出される。

* `[A B C ...]` ... `hcat()`
* `[A, B, C, ...]` ... `vcat()`
* `[A B; C D; ...]` ... `hvcat()`
* `A'` ... `ctranspose()`、複素共益転置
* `A.'` ... `transpose()`、転置
* `A[i]` ... `getindex()`、pythonで言う`__getattribute__()`に近い
* `A[i]=x` ... `setindex!()`、pythonで言う`__setattr__()`

## 可変長引数関数

引数のあとに...をつける。pythonと違って引数のアンパックはされず、常にtupleになる

```julia

bar(a,b, x...) = (a, b, x)
bar(1,2,3,4,5,6) // (1, 2, (3, 4, 5, 6))を返す

```

ただし、関数に渡す際はアンパックしなくてはならない。これも`...`で行う。(pythonにおける`*`と同じ役割を果たすと思えば良い)

```julia

x = [3, 4]
bar(1, 2, x...)

```
