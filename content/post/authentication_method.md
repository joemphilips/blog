---
categories: ["hack"]
date: 2016-09-29T23:06:12+09:00
description: "category of Multi Factor authentication method"
draft: true
keywords: ["device", "security"]
title: "2段階認証の方法まとめ"
---

# イントロ

そもそもwebでクライアント・サーバがお互いを識別する際に当たっては３つの目的がある。

1. クライアントがサーバを認証する ... SSL/TLS
2. サーバがクライアントを認証する ... パスワード
3. その後のやり取りを暗号化する ... 共通鍵暗号

1も問題がないわけではないが、特に問題が大きいのが2.

## パスワード認証の問題点

1. 「パスワードファイル」に相当するものがサーバー側に残る -> 流出の危険
 サービスごとにパスワードを変えることが推奨されているのはそのため。
 仮にサーバ側で暗号化していても、流出すればbrute forceできる。長いパスワードが推奨されるのはそのため
2. 覚えきれないのが良くない(メモると流出の危険がある)
3. 直接タイプするのが良くない -> 後ろの人に見られたりタイピングをトレースされたりするとアウト。

# ２段階認証の方法

## OTP


### HOTP

### TOTP

### yubico OTP

## FIDO U2F

Man In The Middle Attack(MIMA) に強い。
Google Chrome 以外のブラウザがまだ対応していない。Firefoxは近日対応予定。

### ver1.0

### ver2.0

## M-Pin

[英MIRACL社](f3c63d8e7073b1fa0830e6b30194128930a6b170)が開発した方法。

特定の端末から4桁の暗証番号を入力する。[apache milagro](http://milagro.apache.org/)の[一部](http://docs.milagro.io/en/mfa/getting-started/milagro-mfa-overview.html)として公開予定だが、現在実装途中。

以下の手法を用いる。(参考: )

1. 楕円曲線暗号 ... RSAに比べて少ない計算量で同じ強度を達成できる。
2. ペアベース暗号 ...
3. [IDベース暗号](https://ja.wikipedia.org/wiki/ID%E3%83%99%E3%83%BC%E3%82%B9%E6%9A%97%E5%8F%B7) ... 秘密鍵を保持する必要なく、任意のIDで認証を達成できる
4. ゼロ知識証明

以下のバリエーションが有り、いずれにおいてもMIMAと[KCI(Key Compromise Impoersonation)](http://d.hatena.ne.jp/jovi0608/20150821/1440117459)への耐性がある。

1. M-Pin-1 ... IoTデバイス用の電子署名による認証方式
2. M-Pin-2 ... ブラウザ用の認証方式
3. M-Pin-FUll
4. Chow-Choo

### 参考

[milagro crypto]: http://docs.milagro.io/en/milagro-concepts.html
[]: http://docs.milagro.io/en/pairing-crypto-protocols.html
