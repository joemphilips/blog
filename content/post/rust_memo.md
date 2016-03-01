---
categories: ["hack", "memo"]
date: 2016-02-09T10:27:46+09:00
description: "Memo for Rustlang"
draft: false
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

### mutability and ownership

Rustではfunctionがlistを保持し、listがオブジェクトを保持する。
というようにownershipの概念がある。この考え方をpythonに適用するとすべてのオブジェクトはインタプリタが保持すると考えることができる。





## python  との連携

(cpython)[https://github.com/dgrunwald/rust-cpython]を用いる

`PyObject` 型を用いる

pythonのオブジェクトは複数のownerを持つことができるので、Rustのmutabilityの概念は当てはまらない。

