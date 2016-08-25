+++
Categories = ["hack", "memo"]
Description = "Memo for ansible"
Tags = ["python"]
date = "2015-12-30T15:45:36+09:00"
title = "ansibleメモ"
draft = false

+++

`fabric`で構成管理をしているとソースがぐちゃぐちゃになってしまうので、`ansible`に乗り換えようと思う。というわけで勉強なう

# 下準備

## 実行に必要な環境

* ローカル側 ... Python2.6か2.7があればOK.

* リモート側 ...
 1. python2.4以降。2.4の場合は`python-simplejson`が入っていないので、それも必要
 2. SELinuxが入っている場合、`libselinux-python`を最初に入れておかないとファイルの転送ができない。
 3. python2.xが入っていないサーバの場合、はじめにインストールして`ansible_python_interpreter`環境変数をInventory(後述)でセットする必要がある。が、たいていのUnixならpython2は入っているので気にする必要はない

必要なものを始めにインストールする場合には`ansible myhost --sudo -m raw -a "yum install -y python2 python-simplejson"`

もちろんSSHできなくてはならない。SFTPを用いる場合は`ansible.cfg`を用いる。

## インストール

公式は最新版を入れることをオススメしているがおとなしく`brew`などのパッケージマネージャを用いよう

githubから落とす場合は

```
git clone git://github.com/ansible/ansible.git --recursive
cd ./ansible

source ./hacking/env-setup
```

## ansibleがいかにremoteに接続するか

まずはデフォルトのOpenSSH設定を試す。`~/.ssh/config`なども読み込まれる。
ローカルのOpenSSHの設定が古い場合(centos6などはこれに当てはまる。)pythonのOpenSSH実装(paramiko)を使用する。

## `known_hosts`になくても気にしないようにする。

`/etc/ansible/ansible.cfg`、あるいは`~/.ansible.cfg`に、以下のように書く。

```
[defaults]
host_key_checking = False

```

# inventory

対象となるサーバのIPと役割をINIっぽい形式で指定するファイル。`/etc/ansible/hosts`(これは`ANSIBLE_INVENTORY`をexportすることで変更できる)で指定する。以下のような感じ

```
mail.example.com

[webservers]
foo.example.com
bar.example.com

[dbservers]
one.example.com
two.example.com
three.example.com:5309 # portを指定する場合

```

ひとつのサーバが複数のロールを持っていても良い

また、トンネリングして向こう側のサーバにプロビジョニングしたい場合は

```
jumper ansible_port=5555 ansible_host=192.168.1.50
```

のように指定する。`jumper`は単なるAliasで経由するサーバを指す。192.168.1.50のサーバに5555を通してアクセスする。

以下のように一括指定もできる。

```
[webservers]
www[01:50].example.com

[databases]
db-[a:f].example.com
```

接続するプロトコルや、接続先サーバのユーザー名も指定可能

```
[targets]

localhost ansible_connection=local
other1.example.com ansible_connection=ssh ansible_user=mpdehaan

```

この変数は単に接続先サーバで設定される環境変数なので、任意のものを指定できる。ansible特有のものは後述

グループ内のサーバに一括指定する場合は、以下のように`var`を指定する**こともできるが、後述のyamlを用いるのがベストプラクティス**

```
[atlanta]
host1
host2

[atlanta:vars]
ntp_server=ntp.atlanta.example.com
proxy=proxy.atlanta.example.com
```

グループ間に親子関係を設けたい場合は`:children`で

```
[southeast]
host1
host2

[notrheast]
host3
host4

[usa:vars]
hoge=fuga

[usa:children]
southeast
northeast
```

それぞれのグループの設定は`/etc/ansible/group_vars/<group名>/<任意のファイル>` でyamlで行うこともできる。

`group_vars`の代わりに`host_vars`でも可

これらの設定はPlaybookの設定で上書きされる。

## ansible 特有の環境変数

* `ansible_host` 接続したいホストの名前
* `ansible_port` デフォルトは22
* `ansible_user` ユーザ名
* `ansible_sshpass` sshのパスワード(セキュアでないのでちゃんと鍵を使うこと)
* `ansible_ssh_private_key_file` 秘密鍵のパス
* `ansible_ssh_common_args` `ssh`,`sftp`,`scp`に共通で渡される引数`ProxyCommand`を使用する際に便利。それぞれのプロトコルに別々に引数を指定する場合は専用の変数がある(が、必要なさそう)。
* `ansible_ssh_pipelinig` パイプラインを使用する場合に便利。`ansible.cfg`の`pipelining`で上書きできる。
* `ansible_become` suすることを強制する。
* `ansible_become_user` どのユーザになるか指定
* `ansible_become_pass` sudoのパス。セキュアでないのでこれではなく、`--ask-become-pass`で指定しましょう

ansibleは`sudo`などの、別のユーザになるためのコマンドを`become`として抽象化しているので、最後の3つは概ね`sudo`のオプションと同じ
* `ansible_shell_type` 使用するシェル
* `ansible_python_interpreter` 使用するpythonインタプリタ。他の言語も同じ形式で指定可能

* `ansible_connection` ssh、sftp以外には以下がある。
 * `local` ... localhostの場合
 * `docker` ... dockerの場合これを指定。これは便利!!以下をパースしてくれる
  * `ansible_host` ... 接続先dockerコンテナの名前
  * `ansible_user` ... docker内でのユーザー名。指定する必要ないのでは？
  * `ansible_become` ... `true`の場合、`become_user`で指定したユーザになる
  * `ansible_docker_extra_args` ... dockerデーモンに追加で渡される引数。リモートのDockerデーモンをいじるのに使用する。

