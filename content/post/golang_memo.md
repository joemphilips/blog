---
categories: ["hack", "memo"]
date: 2016-03-20T18:30:44+09:00
description: "personal memo for golang"
draft: false
keywords: ["golang"]
title: "golangメモ"
---

# 基本構文

## 関数

```go

///関数の例
func add (x int, y int) int {
    return x + y
}

z := add(2, 3)

// 可変長引数は...を使う

func fArgs(strArgs ...string) {
    for index, value := range strArgs {
        fmt.Println(index, value)
    }
}

// 複数の戻り値

func tworesults(x int) (int, string) {
    return x, "heelo"
}

num, str := someResult(10)
```

### 宣言

関数の宣言をするときは`type`を使用する

```
type funcTemplate func(string) string

func greet(name string) string {
    return "hello," + name
}

func x(f funcTemplate) {
    fmt.Println((fmt.Sprintf("%T", f))
}

func main() {
    x(greet)
}
```

### 参照渡しと値渡し

デフォルトだと値をコピーして渡す、ポインタを用いて参照渡しすることもできる.

```go
func inc2(i *int) {
    *i++ // 関数内ではすべてアスタリスクをつけて扱う
    fmt.Println("inc2: i = " + strconv.Itoa(*i))
}

num := 10
inc2(&num) // &を使ってアドレスを渡す。 inc2: i = 11が出力される
fmt.Println(num) // i = 11

```

## for,if

```go
for i := 0; i < 10; i++ {
    fmt.Println(i)
}

// 下記のように一部を省略する事が可能。GOにはwhileがないのでこのようにする。

j := 0
for j < 10 {
    fmt.Println(j)
    j++
}

```

## swtich, case

```go

i := 5
swtich i {
case 1:
    fmt.Println("i = 1")
case 2, 3, 4:
    fmt.Println("i = 2, 3, 4,")
default:
    fmt.Println("default message")
}

```

# 標準ライブラリ

## cgo

GoにCのオブジェクトをバインディングする

Cの共有ライブラリ(`so`)の形でコンパイルする事もできる。ビルド時のオプションを
`go build --buildmode=c-shared -o mylib.so mylib.go`

と指定してやれば良い


## goからCを使う

```golang

// #include <stdio.h>
// #include <errno.h>
import "C"

```

のようにコメントでCのヘッダファイルをincludeしてから(行を空けずに!)`import "C"`とすれば

`C.size_t`や`C.random`のような形でCのパッケージが使える様になる

`C`という名前のGoパッケージがあるわけではなくcgoが解釈してCの名前空間を参照しているらしい

コンパイル時のフラグ指定も可能

```go

// #cgo CFLAGS: -DPNG_DEBUG=1
// #cgo amd64 386 CFLAGS: -DX86=1
// #cgo LDFLAGS: -lpng
// #include <png.h>
import "C"

```

### GO内からCの参照

#### 構造体(struct)

例えば`hogetype`という名前のフィールドを持つ`X`という名のCのstructがあったとして、GO内部からそれを参照するときは

`X._hogetype`のようにアンダースコアを挟む。

ビットフィールドのようにGo内に対応する型が存在しないようなフィールドの場合、参照はできない。

struct, enum, unionの内部の変数に直接言及するには

`C.struct_stat`, `C.enum_stat`

のようにアンダースコアを挟む

#### 型指定

- `C.schar` ... signed char
- `C.char` ... char
- `C.uchar` ... unsinged char
- `C.short`
- `C.log`
- `C.int`
- `C.uint`

など、ほとんどCの名前そのままで言及できるが

- `unsafe.Pointer` ... `void*`

など、一部違うものもある。

サイズを取得するには

`C.sizeof_struct_stat`

のようにはじめにsizeofを挟む

### 文字列に関して

CはGOと違い明示的な文字(`str`)列型がない。`C.Cstring()`あるいは`C.GoString`で相互に変換する

`C.Cstring()`を使用したあとは必ず`C.free`でメモリを開放してやらなくてはならない

```go

// #include <stdio.h>
// #include <stdlib.h>
import "C"
import "unsafe"

func Print(s string) {
    cs := C.Cstring(s) // Cの文字列の頭へのポインタを返す
    C.fputs(cs, (C*FILE)(C.stdout))
    C.free(unsafe.Pointer(cs))
}
```

#### 関数

Cのエラーナンバーを受け取りたいときは2つ使う

```go
n, err := C.sqrt(-1)
_, err := C.voidFunc()

```


##GoをCにする

コメントでexportすることでCのコードにすることができるようになる

```go
//export MyFunction
func MyFunction(arg1, arg2 int, arg3 string) int {...}

```

Cの中では

```c
extern int64 MyFunction(int arg1, int arg2, GoString arg3);
```

返り値が複数ある場合、Cの中ではstructとして受け取る

exortする関数の中では宣言のみで、定義を含んではならない。
もしファイルが宣言と定義の両方を含む場合、2つの出力ファイルは別々にシンボルを吐き出し、リンカが落ちる。これを避けるためには定義は別のファイルで(`//export`したうえで)行う。

### ポインタの処理

GOはガベージコレクタが付属している言語なので、ポインタの受け渡しに制限がある。

Cはreturnした後にGOのポインタを保持していてはならない。

Cによって呼ばれたGOの関数は受け取っても良いがポインタを返してはならない。

このようなルールはコンパイル時にCGOによってチェックされる。
`GODEBUG=cgocheck=1`で詳しい情報が見れる。2にするともっと詳しくなる。


## 並列処理(concurrency)

`make`でchannelを定義し、そこに値を送るというのが基本的なやり方。

```
package main
import "fmt"

func fibonacci(ch1, quit chan int) {
    x, y := 0, 1
    for {
        select {
        case c <- x:    // xに値が残っている場合は
            x, y = y, x+y
        case <- quit:   // quitの場合は
            fmt.Println("quit")
            return
        // 同様にしてdefault:を用いれば、chanが空の時の挙動の指定もできる
        }
    }
}

func main() {
    c := make(chan int)
    quit := make(chan int)
    go func() {
        for i := 0; i < 10; i++ {
            fmt.Println(<-c)
        }
        quit <- 0
    }()
    fibonacci(c, quit)
}

```
