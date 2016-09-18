---
categories: ["hack", "security"]
date: 2016-09-17T00:32:33+09:00
description: ""
draft: true
keywords: []
title: GPGのセットアップ
---

* PGP ... Pritty Good Privacy, 公開鍵暗号のベストプラクティス。
* GPG ... Gnu Privacy Guard, pgp のGNUによる実装。

gpgはUIがややこしくて混乱するので使い方についてメモる

# GPGとは

1. 電子署名
2. 公開鍵認証

を行うためのソフトウェア。秘密鍵を2つ作る。

1. 署名のためのmaster key
2. 署名に加えて暗号化を行うためのsub key

2つ作るのは単に利便性のため。master keyは**インターネット上のあなたそのもの**なのでこれを流出させると死ぬ(正確には新しい人物としてやり直しになる)。よって、厳重に保管しておき、普段の運用にはsub keyを用いる。

master keyを使用するのは以下の場合

* 他人の鍵に署名する。
* 鍵をrevoke(削除)する。
* UIDを強く信頼する。
* 新しいsub keyを作成する。
* 他の鍵のpreference(暗号化アルゴリズム、ハッシュ関数など)を変更する
* 鍵の有効期限を指定する。

`gpg`, `gpg2`の2種類がある。どちらを使っても大差ないが、後者の方が

1. 暗号化に外部ライブラリを用いている。(必要な機能だけコンパイルできるので、組み込みなどで便利)
2. master keyを別に管理するのが楽(後述)

というメリットがある。

# 鍵登録までの手順

## master keyの作成。

オフライン環境で、**一度もネットワークに繋いだことのないOSで実行する。**具体的には好きなLinuxのディストリビューションのboot imageを作成してそこで行う。くれぐれもソースの読めないOSで行わないこと。

gpgをローカルでインストールし(デフォルトで入っていることが多い)た後,`gpg --gen-key`コマンドを実行する。

設定はすべてデフォルトでOK。RSAの鍵長を伸ばしてもセキュリティ強度はそこまで大きく変化しないという噂もあるが(参考: [yubicoによる解説](https://www.yubico.com/2015/02/big-debate-2048-4096-yubicos-stand/))、念の為RSA2048でなく、RSA4096で行う。ユーザー名と連絡先の記入の 後、エントロピーの取得のため、ガチャガチャした後、saveする。

`gpg --list-keys <ユーザー名>` でIDを取得できるので、これを後の処理で使用する。

ここでは説明のために`MASTERID`というIDを用いる

## 顔写真の登録

`gpg --edit-key MASTERID`

でシェルが開くので、`addphoto`で登録する。

## master keyの失効証明書を作成

`gpg --output \<MASTERID\>.gpg-revocation-certificate --gen-revoke`

発行の理由を説明して、master keyとは別に管理しておく。

## sub keyの作成

`gpg --edit-key MASTERID`

から、`addkey`を実行。あとはmaster keyの時と同様だが、有効期限をつけるとベター

## master keyを保存

必要なだけsub keyを作成したら、`~/.gnupg`をセキュアなストレージにコピーする

ストレージは使いやすいフラッシュドライブと並行して可能な限り長持ちする媒体が良い。CDに焼くか[optar](http://www.jabberwocky.com/software/paperkey/)でQRコードに変換してから紙に印刷する。

## master keyをローカルから削除

gpgのバージョンによって必要な操作が違うので`gpg --version`で確認する。

### GPG 2.1以降の場合

* `~/.gnupg/pricate-keys-v1.d/<KEYGRIP>.key` ... master keyの本体
* `~/.gnupg/secring.gpg` 後方互換のためのファイル。存在しない可能性もある。

を削除する。ただし、`<KEYGRIP>`の確認は`gpg2 --with-keygrip --listkey MASTERID`で行う。

### GPG 2.1より古い場合

鍵を一つずつ削除することができないため、以下の手順を踏む必要がある。

1. master keyのsub keyをすべてエクスポート。
 `gpg --output secret-subkeys --export-secret-subkeys MASTERID`
2. master keyを削除
 `gpg --delete-secret-keys MASTERID`
3. subkeyを戻す。
 `gpg --import secret-subkeys`
4. subkeyのバックアップを削除
 `rm recret-subkeys`

`gpg -K`ですべての秘密鍵の情報を見ると、master keyの`sec`が`sec#`(使用不可)になっていることがわかる。

## パスワードの変更

`gpg --edit-key MASTERID passwd`でsub keyのpasswordを変更できる。バックアップした
master keyはそのままなので安全。


## 公開鍵のアップロード

synchronizing key server(SKS)と呼ばれるところに公開する。
[sks keyserver pool](https://sks-keyservers.net/overview-of-pools.php)はヘルスチェックが継続的にされているのでここにアップロードするのが吉、1日毎にすべてサーバで同期が取られるので、アップロード場所に神経質になる必要はない。IPを隠したい場合は一応Torも使えるっぽい

使用するサーバを決めたらアドレスを`~/.gnupg/gpg.conf`に書き込んでおく。

日本のサーバはないので、どこに設定しても大差なさそう。とりあえずMITのサーバ(`pgp.mit.edu`)にセットしておく。

[riseupによるベストプラクティス](best)によればhkpsと呼ばれる専用のプロトコル(デフォルトポートは11371)を用いるとよりセキュアらしいので、以下でインストール。

```
sudo apt install gnupg-curl # hkpsによる鍵のやり取りを可能にする。
```

keyのメタデータ(e.g. 誰を信頼しているか？)を隠した状態でやり取りするためのプロトコルらしい。


# master keyを使用

master keyを保持しているUSBをマウントして`GNUPGHOME`をその中のパスに設定してexportする。

## sub keyの再発行。

1. master keyを使える状態にしたうえで`gpg --edit-key MASTERID`
2. シェルから`list`でIDの確認。
3. `revkey`で失効証明書を作成。

key serverに送信する。

## master keyを失効させる。

1. `gpg --import \<MASTERID\>.gpg-revocation-certificate` ... 手元のmaster keyを失効
2. `gpg --send-keys MASTERID` ... 執行した鍵をサーバに登録


# sub keyの使用

署名用のsub keyはいくつ持っても良いが、解号用のsubkeyは最新のものしか使えないため、すべてのマシンで同じものを用いなくてはならない。紛失時の対応も楽なので、同時に使う秘密鍵はひとつにしておいたほうが良い。

## コマンド一覧

* `gpg --keyserver pgp.mit.edu --search-keys <キーワード>` ... 鍵を検索
* `gpg --fingerprint` ... 指紋作成
* `gpg --sign-key email@example.com` ... 鍵が本人のものであることを信頼し、署名。
* `gpg --export --armor email@example.com` ... 署名した鍵を送り返す。
* `gpg -e -a -r <自分のメールアドレス> filename` ... 秘密鍵によるファイルの暗号化
* `gpg filename` ... 復号化



# 参考

[OpenPGP best practices guide][best]
[Using OpenPGP subkeys in Debian development](https://wiki.debian.org/Subkeys?action=show&redirect=subkeys)
[How To Use GPG to Encrypt and Sign Messages on an Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-use-gpg-to-encrypt-and-sign-messages-on-an-ubuntu-12-04-vps)

[best]: https://riseup.net/en/gpg-best-practices
