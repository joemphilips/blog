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
