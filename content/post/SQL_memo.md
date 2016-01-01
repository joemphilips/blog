---
categories: ["hack", "memo"]
date: 2016-01-01T19:14:42+09:00
description: "personal memo for SQL and RDBMS"
keywords: ["SQL", "RDBMS"]
title: "SQLメモ"
---

#SQL,RDBMSメモ
----

@(備忘録)

[TOC]


##SQLの基本構文
```sql
select myentry from mytable where [検索条件] order by hoge;
```

コメントは\#ではなく\-\- や/\*ほげ\*/の形にする
予約語(select等)を識別子として使用する場合は''(シングルクオート)で囲む
###COUNT
レコード数(列数)を数えるには
```sql
SELECT COUNT(*)
FROM <テーブル名>
```
SELECT COUNT(DISTINCT <列名>)

###mysql
`mysql -u root@localhost -p`rootとしてパスワードつきで起動(@localhostは省略可能)

###join

###sqlite
####コマンドラインでのコマンド
`sqlite3 <database_name>` ... データベースの作成とインタプリタの起動。データベース名はなんでもよいが拡張子名には`db`あるいは`sqlite3`とつける


####インタプリタでのコマンド
`.show` ... 区切り文字などのパラメータ状態の表示
`;`が入力されるまでは1つの文とみなされる。それまでは自由に改行できる
`.help` ... ヘルプ
`.tables` ... tableの一覧を確認
`.databases` ... 接続されているデータベースの一覧
`select * from <table_name>;` ... sqlの実行
`.schema <table_name>` ... テーブル定義を確認
`.dump <table_name>` ... ダンプimp

####テーブルの基本操作
テーブルの作成
```sql
create table test(val1, val2)   #データ型の指定なし
create table test2(val1 text, val2 mumeric) #データ型を指定
```

行の挿入
```sql
insert into test values(null, 48);
```

データ型の確認
```sql
select typeof(val1)
```

####tsv,csv
#####インポート
```sql
create table table_name (name text, param1 int, param2 int) #あらかじめテーブルを作成(必須かは不明)
.separator "\t"
.import data.tsv table_name
```
#####エクスポート
```sql
.header off
.mode tabs
.output hoge3.csv
```

