---
categories: ["hack"]
date: 2016-09-29T23:06:12+09:00
description: "category of Multi Factor authentication method"
draft: true
keywords: ["device", "security"]
title: "2段階認証の方法まとめ"
---


# OTP


## HOTP

## TOTP

## yubico OTP

# FIDO U2F

Man In The Middle Attack に強い。
Google Chrome 以外のブラウザがまだ対応していない。Firefoxは近日対応予定。

## ver1.0

## ver2.0

# M-Pin

[英MIRACL社](f3c63d8e7073b1fa0830e6b30194128930a6b170)が開発した方法。

特定の端末から4桁の暗証番号を入力する。[apache milagro](http://milagro.apache.org/)の一部として公開予定だが、現在実装途中。
