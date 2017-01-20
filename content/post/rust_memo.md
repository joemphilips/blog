---
categories: ["hack", "memo"]
date: 2016-02-09T10:27:46+09:00
description: "Memo for Rustlang"
d raft: false
tags: ["rust"]
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

let mut x = 5; # オブジェクトはデフォルトでimmutableなのでmutをつける
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

## ownership

Rustではfunctionがlistを保持し、listがオブジェクトを保持する。
というようにownershipの概念がある。(この考え方を無理やりpythonに対して適用すると、すべてのオブジェクトはインタプリタが保持すると考えることができる。)

このownershipの概念がRustにおけるメモリ安全性の基礎になっており、完全に理解するには以下の3つに分類して説明するのが良い

- ownership
- borrowing
- lifetimes

Rustはシステムプログラミング言語として、C・C++を置き換えることを目指しているため、必然的に、抽象化はすべて*ゼロコストで*行われなければならないという制約が生まれる。

よって最適化はすべてコンパイル時に行われ、実行時のパフォーマンスに影響を及ぼさない。

よって唯一のコストは利用者の学習コストのみ(アルファギークの好むトレードオフ)

例えば以下のコードを実行すると

```rust

fn foo() {
    let v = vec![1,2,3];
}

```

新たにvが作られた時点で、新しいベクトル型が*heap*領域に配置される。そのポインタとなる`v`が、スタック上に作られる。

そして、上から順に実行されていき、`foo()`のスコープを抜けた時点で、`v`に関係するすべてのものはメモリから消去される。

更に、ヒープメモリ上の実態をただ一つの変数にしかバインディングすることを許さない。
つまり以下はエラーになる

```rust

let v = vec![1,2,3];
let v2 = v;
println!("v[0] is {}", v[0]); // ここでエラー

```

この場合、`v`がヒープメモリ上のVec型データを、*所有している*と考える。また、所有権は関数に渡ることもある。

```rust

fn take(v: Vec<i32>) {
    // hogehoge
}

let v = vec![1,2,3];
take(v);

println!("v[0] is: {}", v[0]); // ここでエラー

```

こういった場合もちろん、返り値を持つようにすれば良い

```rust

fn foo(v: Vec<i32>) -> Vec<i32> {
    v
}

```

ただ、引数・返り値がたくさんあるような関数は長くなって書くのがめんどい。
あと、returnするときにヒープ上に再度割り当て直すので、遅くなる(多分)

そういう時は後述の`borrow`という仕組みを使う

### Copy

ベクトル型は`Copy`traitを持っていないので、上記のエラーが出たが、例えば`i32`だとheap上の実態がまるごとコピーされるのでエラーは起きない。

プリミティブ型はすべて`Copy` traitを持つ

## borrowing

どうもポインタのことらしい

以下のように返り値が多い関数の場合

```rust

fn foo(v1: Vec<i32>, v2: Vec<i32>) -> (Vec<i32>, Vec<i32>, i32) {
    // hogehoge
}

```

以下のように、返り値として渡さず、ポインタを渡すことで、変数の所有権を貸すのが良い

（Rustではポインタのことをリファレンスと呼ぶ）

```rust

fn foo(v1: &Vec<i32>, v2: &Vec<i32>) -> i32 {
    //hoge
}

let v1 = vec![1,2,3];
let v2 = vec![1,2,3];

let answer = foo(&v1, &v2);

```

ただし、リファレンスはデフォルトだとImmutableなので、上の`foo()`内でVectorにpushしようとしたりしても無駄。

多くの場合はmutableで渡したいので`&mut`を使用する

```rust

let mut x = 5; // リファレンスが指すデータ構造もmutableで無くてはならない
{
    let y = &mut x;
    *y += 1; // OK!
}
println!("{}", x); // => 6

```

上の例で\{\}でスコープを句切らないとエラーになる。これは、yがxをborrowしたままになってしまっているため、move,borrow, modificationが禁じられるため。

このように、mutableなリファレンスが同時に1つしか存在しないことを保証されているので、データ競合が怒らず安全。

## Lifetimes

ownershipに関する3つの概念の中で、これが一番Rustに特徴的で、よく知って置かなければならない。

(多分、mutableでなければ、一つのヒープメモリ上の資源に対し、複数の変数をバインディングさせることができるため、)片方がメモリを開放した後に、別のリファレンスが資源にアクセスしようとすることがあり得る。

これを防ぐため、リファレンスに寿命を設定することができる。

```rust

fn foo(x: &i32){} // 寿命明示なし
fn bar<'a>(x: &'a i32) {} // 寿命明示あり
fn baz<'a, 'b>(x: &'a i32, y: &'b mut i32) {} //複数ある場合

```

関数だけでなく、リファレンスを含む構造体`struct`に関しても寿命を設定できる。

```rust

struct Foo<'a> {
    x: &'a i32,
}

fn main() {
    let y = &5;
    let f = Foo { x: y };

    println!("{}", f.x)
}

// impl する場合は寿命まで明示し無くてはならない。

impl<'a> Foo<'a> {
    fn x(&self) -> &'a i32 { self.x }
}

```

複数のリファレンスを受け取る場合、同じ寿命を適用することもできる

```rust

fn x_or_y<'a>(x: &'a str, y: &'a str) -> &'a str{}

```

### なぜ所有権が必要か？

例えば以下の例の場合、fはyのscopeの中に納まっているためエラーにはならない

```rust

struct Foo<'a> {
    x: &'a i32,
}

fn main() {
    let y = &5;           // -+ y goes into scope
    let f = Foo { x: y }; // -+ f goes into scope
    // stuff              //  |
                          //  |
}                         // -+ f and y go out of scope}

```

しかし、以下はエラーになる

```rust
struct Foo<'a> {
    x: &'a i32,
}

fn main() {
    let x;                    // -+ x goes into scope
                              //  |
    {                         //  |
        let y = &5;           // ---+ y goes into scope
        let f = Foo { x: y }; // ---+ f goes into scope
        x = &f.x;             //  | | error here
    }                         // ---+ f and y go out of scope
                              //  |
    println!("{}", x);        //  |
}                             // -+ x goes out of scope

```

これからスコープを抜ける`f`に対してリファレンス`x`を作っているのでエラーになるらしい(正直まだよくわからん)

### `'static`

特殊なlifetimesの一つとして`'static`というものがある。

これを宣言した場合、その対象はプログラム実行時間常にメモリ上に確保され続ける。(実行バイナリの中に保持される?)

```rust

let x: &'static str = "Hello, world.";
// あるいは
static Foo: i32 = 5;
let x: &'static i32 = &FOO;

```

lifetime にはinput lifetime とoutput lifetimeの2種類がある。

```rust

fn foo<'a>(bar: &'a str)            // input lifetime
fn foo<'a>(bar: &'a str)            // output lifetime
fn foo<'a>(bar: &'a str) -> &'a str // both

```

### lifetimeの省略

lifetimeを明示しないでおくと、自動で判断する。その際のルールは非常にシンプルで、以下の3つがすべて

- 省略されたすべてのlifetimeは変数ごとの別々のパラメータになる
- input lifetimeが一つしかない場合、省略の有無にかかわらず、それが全てのoutput
  lifetimeになる。
- input lifetime が複数あり、そのうちの一つが`&self`か`&mut self`のものだった場合、それがすべてのoutput lifetimeに適用される

これらに当てはまらない場合にoutput lifetimeを省略するとerrorになる。

### 型

#### 列挙型(`Enums`)


#### match

Cで言う`case`

```rust

let x = 5;

match x {
    1 => println!("one"),
    2 => println!("two"),
    3 => println!("three"),
    4 => println!("four"),
    5 => println!("five"),
    _ => println!("something else"),
}

```

### 並列処理




## python  との連携

(cpython)[https://github.com/dgrunwald/rust-cpython]を用いる

`PyObject` 型を用いる

pythonのオブジェクトは複数のownerを持つことができるので、Rustのmutabilityの概念は当てはまらない。


