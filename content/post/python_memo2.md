---
categories: ["hack", "memo"]
date: 2016-01-01T19:17:22+09:00
description: "Pandas,numpy,scipyなど"
keywords: ["python"]
title: "pythonメモ2　データ分析編"
---

## ipython

`objectname?`のようにはてなを最後につけて実行することで、オブジェクトの詳細が見れる。
`objectname??` ... さらに詳細に見れる
またls やcdはそのまま使える

`!cp a.txt b/`のように、先頭に`!`を付けると内部で`os.system()`を読んでくれるので、シェルコマンドを直接実行できる。ただしnotebook中で`cd`や`pwd`をしたいときは`!cd`ではなく`%cd`でなくてはならない

`files = !ls /usr`のようにすると簡単にシステムコマンドのアウトプットをとれる

`%edit` ... エディタを開いて編集

### ipython serverのセットアップ
[ここ](https://thomassileo.name/blog/2012/11/19/setup-a-remote-ipython-notebook-server-with-numpyscipymaltplotlibpandas-in-a-virtualenv-on-ubuntu-server/)を参考にする

### マジックコマンド

`%quickref`や`%magic`ですべてのマジックコマンドを表示
`%`を付けて実行すると、引数を関数の外に書くことができる。例

```python
## 実行時間を計測
%timeit range(1000)

## %%にすると複数行にわたって書ける
%%timeit x = range(10000)
max(x)
```

**`%matplitlib inline`を実行して置かないとplotできないので注意**

#### 別のフォーマットへの変換
- `ipython nbconvert --to html hoge.ipynb` ... htmlへ
- `ipython nbconvett --to html --template basic hoge.ipynb` ... ヘッダーなどのないよりシンプルなhtml
- `--to slides`
- `--to markdown`
- `--to rst`
- `--to python`
- `--to latex`
 - `--template book`
 - `--template article`
 - `template basic`

等がある。`--post serve`を末尾につけると自動でブラウザを開いてくれる
RISEと呼ばれるパッケージを入れると、notebookの右上にボタンが出て、リアルタイムプレビューができるようになる

## ベイジアン

~~変分ベイズならBayesPy、MCMCならStanがよさそう~~
最近はStanでも、共益事前分布の場合は勝手に変分近似してくれるらしい

### BayesPy
python3のパッケージ。指数型分布族(ガウス、ガンマ、ディリクレなど)にしか使えないっぽい？
もともと変分ベイズ用のパッケージは

- `Bayes Blocks` 整数値のガウシアンのノードにしか対応していない。
- `VIBES`　Javaで書かれたもの、もはや過去のもの
- `Infer.NET`　完全なオープンソースでない

等がある。

- stochastic variational inference (Hoffman et al., 2013), deterministic annealing (Katahira
et al., 2008)
- collapsed inference (Hensman et al., 2012)
- Riemannian conjugate gradient learning (Honkela et al., 2010)
- parameter expansions (Qi and Jaakkola, 2007)
- pattern searches (Honkela et al., 2003).

といったVBの拡張にも対応している


### stan
`.stan`という拡張子でstanコードを書く。ガウス混合分布をフィッティングする例

```stan
data {
    int<lower=1> N;
    int<lower=1> k;
    real X[N];
}
parameters {
    simplex[k] theta;
    real mu[k];
}
model {
    real ps[k];
    for (i in 1:k){
        mu[i] ~ normal(0, 1.0e+2);  #事前分布として平均0、標準偏差100の事前分布を用いる。
    }
    for(i in 1:N){
        for(j in 1:k){
            ps[j] <- log(theta[j]) + normal_log(X[i], mu[j], 1.0);
        }
        increment_log_prob(log_sum_exp(ps));
    }
}
```
Stanコードには4つのブロックがある

- `data` 用いるデータを宣言する。このブロックにpythonなどのインターフェイスからデータを渡す。上ではデータ数Nと混合数kを渡している
- `parameters` ... モデルのパラメータを宣言するブロック。今回は平均muと混合比thetaがパラメータ。thetaの型であるsymplexはディリクレ分布を事前分布に設定した時に使う特別な型
- `transformed parameters` ... parametersを用いて新たなパラメータを宣言する場合に使用する
- `model` ... モデルを記述する。

## numpy
線形のランダムノイズを載せた生成モデルからのデータを作るスクリプト

```python
m_true = -0.954
b = true = 4.294
f_true = 0.534

N = 50
x = np.sort(10*np,.random.rand(N))
yerr = 0.1+0.5*np.random.rand(N)
y += m_true * x+b_true
y += np.abs(f_true * y) * np.random.randn(N)
y += yerr * np.random.randn(N)
```

### スライスの挙動

通常のpythonと違い、代入もできる

```python
ndarr1 = np.array([0, 1, 2, 3, 4, 5])
ndarr1[3:6] = [100., 200., 300.,]
print(ndarr1)
# => [0 1 2 100 200 300]

# スライスではなく数値を入れるとブロードキャストされる

ndarr1[3:5] = 20
print(ndarr1)
[0 1 2 20 20 5]

# スライスしたものを別の変数に入れると参照になり、元の配列の一部とつながる
# よってふくせいしたいときはcopy()メソッドを使用する
ndarr2 = ndarr1[3:5].copy()

```

## scipy



### stats
`scipy.stats.norm` ... 正規分布の

- `norm.rvs(loc, scale, size)` ... 平均(正確には期待値)`loc`,標準偏差`scale`の正規分布から`loc`個の確率変数を取得。(rvsはrandom variates)
- `norm.pdf(x, loc, scale)` ... 平均(正確には期待値)`loc`, 標準偏差`scale`,の正規分布の確率密度関数のxでの値を返す。(pdfはprobability density function)
- `norm.cdf` ... cumulative densitive function(上の累積版)
-`norm.sf` ... `1-cdf`
- `norm.ppf` ... パーセント点関数。累積分布関数(`cdf`)に近いが、xの代わりにqを指定する。`$ 0=<q=<1 $`を満たす。
- `norm.interval` ... `alpha` %信頼区間を返す


## matplotlib

### pyplot

例

```python
import numpy as np
import matplotlib.pyplot as plt

x = np.random.normal(size = 100)

plt.hist(x)
plt.title("Histgram")
plt.xlabel("x")
plt.ylabel("frequency")
plt.show()
```
`plot.hist(x, normed = True)`とすると縦軸が確率になる。`bins=20`で横幅調整
2つのヒストグラムを重ねるときは

```python
x =  np.random.normal(10, 5, 100)
y = np.random.normal(20, 5, 100)

plt.hist(x, label = "x", bins = 20, range = (-10, 40),alpha = 0.5, color = "blue")
plt.hist(y, label = "y", bins = 20, range = (-10, 40), alpha = 0.5, color = "red")
plt.legend()
plt.show()
```
保存したい場合は`plt.show()`の代わりに、`plt.savefig(”ファイル名.png”)`を使う。ファイル名に拡張子が入っていると自動で判断して保存してくれる。

使用できる拡張子は
emf, eps, jpeg, jpg, pdf, png, ps, raw, rgba, svg, svgz, tif, tiff

sshでログインしているときはエラーが出ないよう、以下のコードを書いておく

```python
import matplotlib
matplotlib.use("Agg")
```

## pandas

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


