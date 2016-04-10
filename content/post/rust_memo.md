---
categories: ["hack", "memo"]
date: 2016-02-09T10:27:46+09:00
description: "Memo for Rustlang"
d raft: false
keywords: ["rust"]
title: rustメモ
---

## 基本事項

hello world を3回表示する

```rust

fn main() {
    for count in 0..3 {
        println!("{}. Hello World!", count);
    }
}

```

### error handling

`n == 5`の結果を返す関数の例

```rust

fn guess(n: i32) -> bool {
    if n < 1 || n > 10 {
        panic!("Invalid number: {}", n);
    }
    n == 5
}

```

### ループ

`loop`, `while`, `for`の3種類

```rust

loop {
    println!("loop forever !")
}

```

`while`の例

```rust

let mut x = 5;
let mut done = false;

while !done {
    x += x - 3;

    println!("{}", x);

    if x % 5 == 0 {
        done = true;
    }
}

```

`while true{}` は`loop`で置き換えたほうがコンパイラに与える情報が多いので良い

また、上の例も、doneという変数を省略するため`loop`を用いたほうが良い

```rust

let mut x = 5;

loop {
    x += x - 3;

    println!("{}", x);

    if x % 5 == 0 { break; }
}

```

`for`はpythonに似ている

```rust

for x in 0..10 {
    println!("{}", x);
}

```

上の例の場合、プリントされるのは1から9までである(10ではない)ことに注意

python同様,`enumerate()`も用意されている。

```rust

for (i,j) in (5..10).enumerate() {
    println!("i = {} and j = {}", i, j);
}

```

Rustに特徴的なloopの書き方として、ループラベルというものがある。

以下は`x`と`y`がともに奇数の場合のみprintするプログラムの例

```rust

'outer: for x in 0..10 {
    'inner: for y in 0..10 {
        if x % 2 == 0 { continue 'outer; }
        if y % 2 == 0 { continue 'inner; }
        println!("x; {}, y: {}", x, y);
    }
}

```

### mutability and ownership

Rustではfunctionがlistを保持し、listがオブジェクトを保持する。
というようにownershipの概念がある。この考え方をpythonに適用するとすべてのオブジェクトはインタプリタが保持すると考えることができる。





## python  との連携

(cpython)[https://github.com/dgrunwald/rust-cpython]を用いる

`PyObject` 型を用いる

pythonのオブジェクトは複数のownerを持つことができるので、Rustのmutabilityの概念は当てはまらない。



##
