---
categories: ["hack", "memo"]
date: 2016-01-01T19:20:02+09:00
description: "personal memo for JS,CSS,html"
keywords: ["javascript"]
title: "javascriptメモ"
---

## サードパーティ製ライブラリは
[cdnjs](https://cdnjs.com/libraries)を参照
## 外部ファイルのインクルード

```js
<script type="text/javascript" language="JavaScript" src="a.js"></script>
```
### requireJS
requireメソッドを呼ぶ前に、require.configでオプションを指定する

```html
<script src="scripts/require.js"></script>
<script>
    require.config({
        baseUrl:"another/path",
        paths: {
          "some"/some/v1.0
            },
        require(["some/module", "my/module", "hoge.js", fuga.js])
        function(someModule, myModule){//上でrequireされたモジュールがすべてloadされた時に実行されるスクリプト}
        }
    })

</script>
```

## 周辺知識
### CSS
HTMLのスタイルを記述する書式
```css
body{   ＃HTMLの<body>と</body>の間に対して以下の書式を適用
    background-color: white;
    color: black;
}
```
ここでbodyをセレクタと呼び、HTMLのどこに対して{}内のスタイルを適用するかを示している。
セレクタには以下がある

- `body` ... タイプセレクタ、bodyタグの中身に対して適用される
- `*` ... ユニバーサル。全てに適用される。
- - `#foo` ... IDセレクタ
- - `.foo` ... クラスセレクタ。指定したクラス名がある要素に適用
属性セレクタ
```html
[foo="bar"] { color: red; } /* foo属性の値がbarの要素 */
[foo^="bar"] { color: red; } /* foo属性の値がbarで始まっている要素 */
[foo$="bar"] { color: red; } /* foo属性の値がbarで終わっている要素 */
[foo*="bar"] { color: red; } /* foo属性の値がbarを含む要素 */
A[foo="bar"] { color: red; } /* foo属性の値がbarのA要素 */
```
実際には以下のように外部ファイルに定義を書いておいてインクルードする場合が多い

```html
<!DOCTYPE html>
<html>
  <head>
    <link href="test.css" rel="stylesheet" type="text/css">
  </head>

  <body>
    <p>Hello World:D</p>
  </body>
</html>
```

### Jade
HTMLを見やすくする？みたいな
例えば一般的なHTML5のテンプレートはこうだが
```html
<html>
    <head>
        <meta charset="UTF-8">
        <title>最高にクールなホームページ</title>
        <link rel="stylesheet" href="./css/app.css">
    </head>
    <body>
        <h1>最高にクールなホームページ</h1>
        <p>最高にクールなホームページへようこそ。</p>
        <script src="./js/app.js" charset="UTF-8"></script>
    </body>
</html>
```
Jadeで書くとこうなる、よりpythonライクな感じ
```jade
doctype html
html
  head
    meta(charset='UTF-8')
    title 最高にクールなホームページ
    link(rel='stylesheet', href='./css/app.css')
  body
    h1 最高にクールなホームページ
    p 最高にクールなホームページへようこそ。
    script(src='./js/app.js', charset='UTF-8')
```
他にも
```jade
section#example-01.example
p javaScriptでハローワールド
pre
    |(function () {
    |   console.log('Hello, world.');
    | })();
```
とかくと
```jade
<section id="example-01" class="example">
  <p>JavaScript でハローワールド。</p>
  <pre>
    (function () {
      console.log('Hello, world.');
    })();
  </pre>
</section>
```
となる
jadeを書いている時に、コピペした内容もすべてJadeの記法で書き直すと大変なため、以下の様な記法が使える.
最初の行のdiv(続くdivタグをまるごとスニペット化)と、`.`がポイント
```html
div#facebook.
  <div id="fb-root"></div>
  <script>
    (function(d, s, id) {
      var js, fjs = d.getElementsByTagName(s)[0];
      if (d.getElementById(id)) return;
      js = d.createElement(s); js.id = id;
      js.src = "//connect.facebook.net/ja_JP/all.js#xfbml=1";
      fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));
  </script>
  <div class="fb-like" data-send="false" data-layout="button_count" data-width="450" data-show-faces="false"></div>
```
jadeの中ではjavascriptオブジェクトを定義して、それをテンプレート内で使用することができる例えば
```jade
var package = {
  title: '最高にクールなホームページ',
  description: '最高にクールなホームページです。見ないと損です。',
  keywords: [
    '最高',
    'クール',
    '世界一',
    '天才'
  ],
  robots: [
    'INDEX',
    'FOLLOW',
    'NOODP',
    'NOYDIR',
    'NOARCHIVE'
  ]
};
```
というオブジェクトを定義して、以下の様な形で使用すると中身を使い回すのに便利
```jade
doctype html
html
  head
    meta(charset='UTF-8')
    title= package.title
    meta(name='description', content=package.description)
    meta(name='keywords', keywords=package.keywords)
    meta(name='robots', keywords=package.robots)
  body
    h1= package.title
    p #{package.title} にようこそ。
```

#### テンプレート継承
```jade
extends _layout
```
とかくと、`_layout.jade`の内容を継承でき

## テスト
### Jasmine
を用いる

```js
expect($result").not.toEqual("期待する値");
```
### frisby
REST API のテストに用いる
テストコードは`/spec`以下に置くのが慣習

## 可視化
### D3.js
data visualizationのためのライブラリ。
CSSライクにスタイルを記述できる。

```js
<head>
   <style type="text/css">
      p {
         font-family: sans-serif;
         color: lime;
      }
   </style>
</head>
```
このようにしてjsファイルのヘッダ部に直接記述するか、
あるいは外部CSSファイルに記述しておきそれを参照する
```js
<head>
   <link rel="stylesheet" href="style.css">
</head>
```

基本構文は
```js
d3.select("body").append("p").text("新しいパラグラフ！");
```
d3  #d3オブジェクトのメソッドであることを明示
select("body")  #対象となるCSSセレクタを指定(すべてに指定したい場合はselectAll())

```js
append("p") #<body>内に<p>を追加。
text("新しいパラグラフ")    #<p></p>内に文章を追加

```
