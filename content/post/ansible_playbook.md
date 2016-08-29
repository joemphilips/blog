+++
Categories = ["hack", "memo"]
Description = "Memo for ansible"
Tags = ["python"]
date = "2016-08-26T15:45:36+09:00"
title = "ansible vaultのメモ"
draft = false

+++

ansible vaultとはansibleで秘密鍵を用いたデプロイをする際に使用する機能、playbookが秘密鍵を使用してデプロイを行うことを可能にしつつ、playbookを見ても秘密鍵やDBへの接続情報などがわからないようにしておくのに使用する。
