+++
Categories = ["hack", "memo"]
Description = "use ansible to automate virtual servers for example in ec2 and openstack"
Tags = ["python", "aws", "ansible"]
date = "2016-08-26T15:45:36+09:00"
title = "ansible でawsなどの外部リソースを扱う"
draft = true

+++

# dynamic inventory

仮想サーバをansibleでプロビジョニングする際、Dynamic inventoryと呼ばれる仕組みを使用する必要がある。`contrib`フォルダにawsやOpenStack、cobblerなどの設定がデフォルトで入っているので、多くはこれで十分。

## aws

通常のインベントリでec2を管理していると、

1. hostが追加されたりなくなったりすることへの対応が難しい。
2. aws autoscalingの使用が難しい

という問題がある。
[こちらのスクリプト](https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/ec2.py)をダウンロードして`-i`オプションで指定してやると、EC2 external inventoryが使えるようになる
あるいは`/etc/ansible/hosts`にコピーして`chmod +x`してもよい。その場合は[ec2.ini](https://raw.githubusercontent.com/ansible/ansible/devel/contrib/inventory/ec2.ini)を`/etc/ansible/ec2.ini`にコピーしてやる必要がある。

いずれにせよ実行にはbotoがawsにアクセスできるようになっているひつようがある。環境変数`AWS_ACCESS_KEY_ID`と`AWS_SECRET_ACCESS_KEY`をエクスポートするのが一番手軽で早い。

`./ec2.py --list`で疎通をチェックできる。
別々のプロファイルを使用したいときは`AWS_PROFILE`をエクスポートする。

デフォルトの`ec2.ini`の設定は、EC2の外からEC2を操作するときのためのもの
となっているので、ec2の中から操作する場合は設定を変える必要がある。

するとinvenory内でec2に関連した変数が使えるようになる。`./ec2.py`の中で、使用可能になる変数の一覧が見れる。

