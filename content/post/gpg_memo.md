---
categories: ["hack", "security"]
date: 2016-09-20T00:49:37+09:00
description: "how to use gpg"
draft: false
keywords: []
title: "GPGで自分用の秘密鍵を1つに統一する"
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

[QUBES OS](https://www.qubes-os.org/)がsandboxとして使いやすいかも

gpgをローカルでインストールし(デフォルトで入っていることが多い)た後,`gpg --gen-key`コマンドを実行する。

設定はすべてデフォルトでOK。RSAの鍵長を伸ばしてもセキュリティ強度はそこまで大きく変化しないという噂もあるが(参考: [yubicoによる解説](https://www.yubico.com/2015/02/big-debate-2048-4096-yubicos-stand/))、念の為RSA2048でなく、RSA4096で行う。ユーザー名と連絡先の記入の 後、エントロピーの取得のため、しばらくガチャガチャした後saveする。(結構長時間ガチャガチャする必要がある。だるい)

`gpg --list-keys <ユーザー名>` でIDを取得できるので、これを後の処理で使用する。

ここでは説明のために`MASTERID`というIDを用いる

## 顔写真の登録

[こちらを参考に](https://blog.josefsson.org/2014/06/19/creating-a-small-jpeg-photo-for-your-openpgp-key/)適切なサイズと解像度のJPEGを作成する。

`gpg --edit-key MASTERID`

でシェルが開くので、`addphoto`で登録する。

## master keyの失効証明書を作成

`gpg --output \<MASTERID\>.gpg-revocation-certificate --gen-revoke`

発行の理由を説明して、master keyとは別に管理しておく。

## sub keyの作成

`gpg --edit-key MASTERID`

から、`addkey`を実行。あとはmaster keyの時と同様だが、有効期限をつけるとベター

署名と暗号化に同一の鍵を使うと、暗号化アルゴリズム依存の脆弱性が生じる場合があるので、暗号化、署名、認証のそれぞれに専用のsubkeyを作ると良い。

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
* `gpg2 --card-status` ... PIV card の状態確認

# ssh鍵としての使用

1. gpg-agentがSSH-agentとしても機能するようにする。
2. gpg秘密鍵をSSH鍵ペアとして使用する。

の2種類を分けて考える必要がある。ここでは後者について述べる

## gpg-agentがSSH-agentとしても機能するようにする。

`~/.gnupg/gpg-agent.conf`に必要な設定を書き込むことができる。[コマンドラインから指定可能なオプション](https://www.gnupg.org/documentation/manuals/gnupg/Agent-Options.html)はすべて指定できるので、`enable-ssh-support`とお好みのオプションを書き込んで再起動する。

##gpg秘密鍵をSSH鍵ペアとして使用する。

[monkeyshpere](http://web.monkeysphere.info/why/) projectの一部としてopenpgpをsshとして使用するためのソフトウェア`pgp2ssh`を開発している。

Note:
    このMonkeysphereの、root CAを廃止してweb of trustを実現するという目標はそれ自体大変興味深いので、デジタル左翼の皆さんは一読の価値ありです。
    なぜroot CAおよびHTTPSプロトコルそのものが邪悪なのかに関しては[同団体の人物が書いたTechnical Architecture shapes Social Structure](http://lair.fifthhorseman.net/~dkg/tls-centralization/)という文書が参考になります。


`sshd`が解釈可能な形式に鍵を変換(ここでは`0A72B72`というsub key鍵IDを用いる。)

```sh

gpg2 --export-secret-subkeys \
  --export-options export-reset-subkey-passwd 0A072B72! | \ # ! をつけないと、全兄弟keyをエクスポートしてしまう
  openpgp2ssh 0A072B72 > gpg-auth-keyfile

```

`gpgkey2ssh <鍵ID>`でも可

あとは普通のssh秘密鍵のように扱う。

# 参考

* [OpenPGP best practices guide][best]
* [Using OpenPGP subkeys in Debian development](https://wiki.debian.org/Subkeys?action=show&redirect=subkeys),
* [How To Use GPG to Encrypt and Sign Messages on an Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-use-gpg-to-encrypt-and-sign-messages-on-an-ubuntu-12-04-vps)
* [My Perfect GnuPG / SSH Agent Setup](http://www.bootc.net/archives/2013/06/09/my-perfect-gnupg-ssh-agent-setup/)
* [Using GnuPG for SSH authentication](https://incenp.org/notes/2014/gnupg-for-ssh-authentication.html)
* [GnuPG -- Archlinux][arch]


[best]: https://riseup.net/en/gpg-best-practices
[arch]: https://wiki.archlinuxjp.org/index.php/GnuPG
