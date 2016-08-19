---
categories: ["hack", "memo"]
date: 2016-01-01T19:57:08+09:00
draft: false
description: "personal memo for mount options in linux"
keywords: ["Shell", "Bash", "Linux"]
title: "linuxでのマウント関係の仕様、特にfstabとautomountに関するメモ"
---

## fstab

`mount -a` でfstabの内容を反映してマウント

それぞれの列は以下のようになっている

1. デバイスファイル名, e.g. `/dev/sda1`
2. マウントポイント, e.g. `/media`
3. ファイルシステムの種類, e.g. `ext4`, CD等は`auto`にしておく
4. マウント時のオプション
    * とりあえず`defaults`を指定しておけばOK.
    * `noauto` ... `umount -a`の際に自動でマウントされない。
5. ファイルシステムをdumpする必要があるか否か
    * `0` ... dumpしない。基本的にこれでOK
6. fsckするか否か。とりあえず`2`でOK
    * `0` ... しない
    * `1` ... する(root device`/`)
    * `2` ... する(root device以外)
