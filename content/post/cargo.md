---
categories: ["hack", "memo"]
date: 2016-02-09T10:27:46+09:00
description: "Memo for Rustlang-Cargo"
draft: false
tags: ["rust", "memo"]
title: "Rustのパッケージマネージャcargoに関するメモ"
---

# cargo.tomlの書き方

`[package]`, `[profile]`, `[features]`, `[workspace]`, `[lib]`, `[dependencies]`, `[dev-dependencies]`等のセクションがある。

##`[package]`

基本は以下

```toml

name = ""
version = "0.0.1" # semantic versioningに従うこと
authors = ["名前 <hogehoge@gmail.com>"]
license = "MIT/Apache-2.0"
tags = [""]
repository = "https://github.com/ "
homepage = "https://github.com/ "
documentation = "http:// "
description = """

"""

```

他に以下のようなフィールドがある

### `build =　"build.rs"`

多言語のビルドを行う必要がある場合、このようにしてビルドスクリプトを指定すると、Cargoの実行前にコンパイルしてくれる。

その言語がさらにdependencyを持つ場合、以下のように`[build-dependencies]`を指定する。

```rust

[build-dependencies]
foo = { git = "https://github.com/hogehoge/foo"}

```
