---
categories: ["hack", "memo"]
date: 2016-01-01T19:17:22+09:00
description: "luigi, multiprocessingなど"
tags: ["python"]
draft: true
title: "pythonでのパイプライン処理における考察"
---

# pipelineについて



## luigi

基本は以下の構成

```
class Task1(luigi.Task):
    param = luigi.Parameter(default=22)

    def requires(self):
        return []   # 一番最初のタスクは空リストを返す。

    def output(self):
        return luigi.LocalTarget('hoge.txt')    # 出力対象となるファイルを指定、S3Target 等もある

    def run(self):  # 出力先ファイルに書き込む
        with self.output().open('w') as f:
            for i in range(1, 11):
                f.write("{}\n".format(i))

if __name__ == "__main__"
    luigi.run()

```

このようなタスククラスをたくさん定義して走らせる。

`luigi.Target`のサブクラスを作る必要は少なく、たいていは`LocalTarget`,
`HdfsTarget`, `s3.S3Target`, `contrib.ssh.RemoteTarget`,
`contrib.ftp.RemoteTarget`, `contrib.mysqldb.MySqlTarget`等で事足りる。

いずれも`open()`メソッドをサポートしている

### メソッド

#### `Task.requires()`

下記のいずれかを返す

- 空リスト
- 他のタスククラスのインスタンス
- 他のタスククラスのインスタンスを要素に含む`dict`, `list`, `tuple`のいずれか

ここで`Target`クラスを返せないことに注意。


