---
categories: ["memo"]
date: 2016-07-19T13:27:41+09:00
description: ""
draft: true
tags: ["aws"]
title: aws-cliの仕様について
---

デフォルトで`~/.aws/credentials`を読み込む。

```
AWS_SHARED_CREDENTIALS_FILE
```

をエクスポートで上書きできる。

profileの形式は

```
[development]
aws_accesss_key_id=AKIHOGEHOGE
aws_secret_access_key=fugafuga
```

のようになる。

複数のプロファイルを書いて`--profile`を与えてやることでそのIAMを使用できる。与えなかった場合`AWS_DEFAULT_PROFILE`か`default`になる。

AssumeRoleを使用させることもできる。その場合上記のprofileの代わりに以下の変数をconfigファイルで指定する。

* `role_arn` ... AssumeしたいARN
* `source_profile` ... policyを取得するのに使うcredential情報の場所。デフォルトは`~/.aws/credentials`
* `external_id` ... サードパーティツールを使用する際のID。使わなそう。
* `mfa_serial` ... Assume対象となるロールの信頼ポリシーがMFAを要求する場合。これを指定する。ハードウェアのシリアルナンバーか、登録済み仮想マシンのARNを指定する。

`mfa_serial`を指定した場合は、CLIがOTPの記入を求めてくる。すると自動的にSTSから一時トークンを取得して`~/.aws/cache`においてくれる。SDKでも自動的にやってくれる模様。

## AssumeRoleとは

STSで一時的に別のアカウントになるトークンを取得すること、トークンの取得形式には他に2種ある。rootではできない。
