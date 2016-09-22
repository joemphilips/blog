---
categories: ["hack", "memo"]
date: 2016-02-23T17:10:05+09:00
description: "memo for ssh agent forwarding"
draft: false
keywords: ["ssh", "linux", "secutiry"]
title: ssh agent forwarding
---

# 仕組み

参考: [An Illustrated Guide to SSH Agent Forwarding](http://www.unixwiz.net/techtips/ssh-agent-forwarding.html)

sshで多段階接続するときに、踏み台にするサーバに秘密鍵を置かなくて済むため、セキュリティが向上する。

githubからデプロイサーバにアクセスするときなどに必要

githubがデプロイサーバにアクセスできないときに手元に秘密鍵を尋ねにくる。その際に`ssh-agent`というデーモンをローカルで起動しておいてやると、Credentialに成功してGithubからのデプロイができる。

# やり方

参考: [Github: Using SSH agent forwarding](https://developer.github.com/guides/using-ssh-agent-forwarding/)

```
eval `ssh-agent` # `ssh-agent`がSSHクライアントとやり取りする際に用いるソケットのファイルパスをエクスポート
ssh-add ~/.ssh/id_rsa # 秘密鍵をagentに登録
ssh-add -k ~/.ssh/id_rsa # 再起動後も保持したい場合はこちら
ssh-add -L # 登録された鍵の確認
```

その後、`ssh -A hoge.com`で転送を許可して接続。ただしリモートの`ssh_config`に`AllowAgentForwarding`が設定されていなければならない。そうしておくとhoge.comから別の場所にsshする際によしなにしてくれる。

ローカルの`~/.ssh/config`に`ForwardAgent yes`を設定しておけば、`-A`を指定する必要はない。

ローカルでrootになった後も鍵情報を引き継ぐには
`su -p`,`sudo -E`でrootになる。
