---
categories: ["hack", "memo"]
date: 2016-01-01T19:34:42+09:00
description: "personal memo for RDF and SPQRQL"
tags: ["Bioinformatics", "RDF", "Semantic Web", "SPARQL"]
title: "RDF_SPARQLメモ"
---


RDF化しているBiological Databaseの一覧

- Diseasome
- Neurocommons
- FlyBase
- TCGA ... S3DBというデータの管理方式を持ちている。以下のデータを含む
    1. miRNA Expression
    2. SNV,SNP
    3. exon Expression(?)
    4. DNA methylation
    5. Copy Number
    6. Trace-gene-sample relationship(?)

## 基本文法
森薫の生まれた場所を取得する例
```sql
PREFIX dbpedia: <http://dbpedia.org/resource/>
PREFIX dbp-owl: <http://dbpedia.org/ontology/>

SELECT ?birthPlace
WHERE{
    dbpedia:Kaoru_Mori dbp-owl:birthPlace ?birthPlace .
}
```
select ?birthPlaceの代わりにASKをを使用するとyesかnoで返り値が帰ってくる。
返り値がそのままRDFグラフであってほしいような場合(サブグラフを抽出したい場合)はCONSTRUCTを使用する。例
```sql
PREFIX foaf:<http://xmlns.com/foaf/0.1/>

CONSTRUCT{
    ?s foaf:name ?o .
}
WHERE{
    ?s foaf:name $o .
}
```
PREFIXの代わりにDESCRIBEを使用するとリソースに関するグラフを取得できる
WHERE句の中の最後に`FILTER(lang(?hoge) = "ja")`と入れると?hogeが日本語のもののみ取得
