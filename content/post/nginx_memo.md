---
categories: ["hack", "memo"]
date: 2016-02-23T17:10:05+09:00
description: "memo for nginx"
draft: true
keywords: []
title: nginx_memo
---

## デバッグ
`sudo nginx -t` コンフィグファイルの構文解析
`service nginx status` 状況確認
`/var/log/nginx/error.log` デフォルトエラーログ

##　デフォルトで読み込まれる設定ファイルは

`/etc/nginx/nginx.conf`、この中で以下の2つを読み込んでいる

- `/etc/nginx/sites-enabled/` ...細かい設定。実態は`/etc/nginx/sites-available`
- `/etc/nginx/conf.d` ... global なconfiguration



