+++
Categories = ["hack", "memo"]
Description = "Memo for python"
Tags = ["python"]
date = "2017-01-24T15:14:58+09:00"
title = "pythonでhuffman codingを実装する"
draft = false

+++

## 基本事項

`print('hello,world!')` ()でくくらないとpython3ではエラーになる。
複数の変数に同じ値を代入するには
`a = b = c = ("hoge", fuga)`
Noneは特別なデータ型

### print

以下のようにしてフォーマットする
**python3では`format`を使用するのがベター**

```python
myvar = "hogehoge"
print("my variable is %s" % myvar)

```

辞書をフォーマットするときは少し特殊で

```python
mydict = {"hoge":a, "piyo";b}
print("Hello! %(hoge)d %(piyo)d" % {'hoge':a, 'piyo':b})
```

`str.format()`を用いてもよい(format関数を参照)

### 基本演算子

- `type(1)`    ... intを返す
- `isinstance(1, int)` ... Trueを返す
- `11/2` ... 5.5
- `11//2` ... 6
- `11%2` ...
- `-11//2` ... -6
- `**` ... べき乗

### 組み込み型

色々あるが、特に大事なのは3つ

- リスト ...`[]`配列ともいう
- タプル ... `()` Cでいうstructに近い
- 集合 ... `{}`   dictionaryとも

タプルはデータの追加や削除が行えない。集合は数学の集合と同じで、同じ値のデータが複数代入されても1つしか残らない。
`tuple()`や`list()`でそれぞれの型を変換できる

#### tuple

`a, b = ("A", "B")`でまとめて代入できる

- `A = ("hoge", "fuga")` tupleの作成

実は()は必要ない

`A = "hoge", "fuga"`

インデックスで参照できる点はリストと同じだが、代入はできない
`A[0]` ... hogeが出力

##### 名前付きタプル

通常のタプルのふるまいに加えて、オブジェクトのようにchainメソッドで参照することができる。`collections`モジュールをimportすること

```python
import collections
Point = namedtuple('Point3d', 'x y z')
point = Point(10, 20 ,30)
point   # => Point3d(x=10,y=20,z=30)
```

通常のように`point[0]`で参照することもできるし`point.x`で参照することもできる

構造体(struct)を作るときに便利


##### タプルの技

```python
(MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY) = range(7)
```
それぞれの曜日名に数字を代入

#### dictionary
perlで言うハッシュ
`d["key"]`でkeyに対応する値を取得できる

```python
d = {'a' : 'apple', 'b' : banana, 'c' : orrange}

# keyを取得
for k in d:
    print k
# keyとvalueの両方を取得
for k, v in d.items(): #iteritemsでもいいらしい、違いは不明
    print k, '-->', v
```
keyとvalueの候補が既にjリストで存在する場合は以下のように`itertools.izip`で簡単に結合できる
**`itertools.izip`はpython3では`zip`に統一された**

```python
names = ['a', 'b', 'c']
fruits = ['apple', 'banana', 'orrange']
d = dict(izip(names, colors))

```
##### 辞書のメソッド
`setdefault()` ... `difaultdict`を使用しなくても、これでデフォルトの値を設定することができる

```python
sef group_by(dict):
    d = {}
    for k, v in dict.iteritems():
        d.setdefault(k, []).append(v)   #kが存在しなければ、[]を設定したうえでvをappendする
    return d
```

###### dictを等分割する

```python
from itertools import islice

def split_dict(data, SIZE=10000):
    it = iter(data)
    for i in range(0, len(data), SIZE):
        yield {k:data[k] for k in islice(it, SIZE)}
```

#### list
perlでいう配列、`[]`内に複数の要素を書くことで作成する。

##### スライス
配列の一部を除いた配列を返す。タプルの操作と全く同様。(extend、appendを除く)

```python
mylist = ['A', 'B']
mylist.append('C')  #Cを追加
mylist.extend(['D', 'E'])   #別のリストと結合
mylist = mylist + ['D', 'E']    #同上
```
`append`で複数項目のリストを追加すると、リストの中身ではなくlistオブジェクトそのものが追加される
**注意: result = list1.extend(list2)とするとresultにはNoneが入る!!!**

##### 要素の取り出し、修正
```python
mylist.count('new') # mylistにnewが含まれている場合、その個数を返す
'new' in mylist #TrueかFalseを返す
mylist.index('new') #indexを返す
```
`.index('new')`は'new'が見つからなかった場合例外を出す
```python
mylist.remove('new') #消去する。初めからなければエラー
mylist.pop()    #末尾から取り除く
mylist.pop(0)   #先頭から取り除く、perlで言うshift()
mmylist.pop(1)  #先頭から二番目を取り除く
```

実際には`mylist[start:end:step]`のようにインデックスで参照した方が良い

```python
a = [2, 3, 4]
a[::-1] # => [4,3,2]
```

##### 同じ要素を持つ配列の作成

```python
lst = [1] * 3   #要素がすべて1、長さ3の配列を作成
```
あるいは
```python
lst = itertools.repeat(1, 3)
```
多次元の場合は
```python
memo = [[0] * 10] * 10  #これは間違い(参照がコピーされる)。正しくは
memo = [[0] * 10 for x in xrange(10)]
```

リストをコピーしたいときは

```pytyon
w = v[:]    #値をコピー
w = v   #参照をコピーするので無意味
# 多次元の場合は以下のようにする

from copy import deepcopy
w = deepcopy(v)

```

同じ要素を持つ配列ではなく配列事態をコピーしたい場合は内包表記で

```python
four_lists = [[] for __ in range(4)]
```

##### 便利な技
```python
>>> query = 'user=pilgrim&database=master&password=PapayaWhip'
>>> a_list = query.split('&')
>>> a_list
['user=pilgrim', 'database=master', 'password=PapayaWhip']
>>> a_list_of_lists = [v.split('=', 1) for v in a_list if '=' in v]
>>> a_list_of_lists
[['user', 'pilgrim'], ['database', 'master'], ['password', 'PapayaWhip']]
>>> a_dict = dict(a_list_of_lists)
>>> a_dict
{'password': 'PapayaWhip', 'user': 'pilgrim', 'database': 'master'}

```

関数の引数にリストを渡す際、アスタリスク\*を付けると展開して渡される

```python

myarg = ["hoge", "fuga"]
myfunc(*myarg)  # 第一引数に"hoge",第2に"fuga"が入る

```

###### listを等分割する
n個ずつに分割する場合は
`[mylist[i:i+n] for i in range(0, len(mylist), n)]`
この方法だと、最後の部分リストが極端に小さい場合がありうる。それを避けたい場合は
```python

def split_list (list,n):
list_size = len(list)
a = list_size // n
b = list_size % n
return [list[i*a + (i if i < b else b):(i+1)*a + (i+1 if i < b else b)] for i in range(n)]

```

list以外のiterableを等しい分割したい場合は以下。(ただし)python3だとなぜか動かない

```python
import itertools
def splitparN(iterable, N=3):
    for i, item in itertools.groupby(enumerate(iterable), lambda x: x[0]):
        yield (x[1] for x in item)
```

python3の場合はこちら、ただし、いずれの場合も辞書はキーをmapオブジェクトで返すので、値は手に入らない
```python
import operator, itertools

def chunk(it, n):
    op = operator.itemgetter(1)
    for key, subitr in itertools.groupby(enumerate(it), lambda x:x[0]//n):
        yield map(op, subitr)



for x in chunk(mylist, 2):
    print(list(x))
```


#### set
集合ともいう、辞書と同様、{}で作成する。集合をbool値のようにifで評価すると
空の場合はFalse、そうでなければTrueを返す


`type({1})` ... setを返す
`type({})` ... dictを返す

```python
myset.remove("hoge")    #hogeを削除、なければ例外
myset.discard("hoge")   #hogeを削除、なければ何もしない
myset.pop("hoge") ... "hoge"を非復元抽出、順番というものがないので、indexは使えない
```
##### 集合演算
```python
30 in myset #TrueかFalseを返す
myset.union(b_set)    #2つの集合を合体(和集合)
myset.intersection(b_set)   #積集合
myset.difference(b_set) #mysetにはあるがb_setにはないものの集合(差集合)
myset.symmetric_difference(両方の差集合)
```

##### booleanを返す集合演算
```python
myset.issubset(b_set)   #mysetの要素の全てがb_setに含まれていれば真
myset.issuperset(b_set) #上の逆
```

### 繰り返し
for文は
```python
for i in [1,2,3,4]
     print i**2
```
`continue`,`break`が使える
リストの部分は`range(4)`で書く場合が多い、音が多いがiの値が大きいとメモリを食うので
`xrange(4)`
がベター、`python3`では`range`が`xrange`と同じ働きをする。

逆順にループするときは
```python
colors = ['red', 'green', 'blue', 'yellow']
for c in reversed(colors):
    print c
```

要素番号も取得したいとき
```python
for (i, color) in enumurate(colors):
    print i, '-->', color

```
二つの配列をまとめてループするときはzipが便利
```python
list1 = ["hoge","fuga"]
list2 = [1, 2]

for (text number) in zip(list1, list2):

```

#### 辞書のループ
普通にforを回すとキーのみを取得する。iteritemsを使用するのが良い
```python
for k,v in d.iteritems():
    print(k, '--->', v)
```

#### itertools

##### `itertools.count(n)`
n以降無限回続くイテレータを生成

```python
itr = itertools(5)
for i in itr:
    print(i, end="")
    if i == 10:
        break

# => 5 6 7 8 9 10
```
##### `itertools.cycle()`
引数として与えたイテレータの要素を延々返す

```python[
itr = itertools.cycle('ABC')
for i,j in enumerate(itr):
    print(j, end='')
    if i == 5:
        break

# => A B C A B C
```

##### `itertools.repeat()`
第二引数　回繰り返す
```python
itr = itertools.repeat("YAH!", 3)
print([i for i in itr])

# => ['YAH!', 'YAH!', 'YAH!']
```
##### `itertools.chain()`

```python
itertools.chain("ABC", range(5))
print(list(itr))
# => ['A', 'B', 'C', 0, 1, 2, 3, 4]
```
##### `itertools.compress()`
第二引数`selector`が真になるデータを返すイテレータ.
```python
itr = itertools.compress('ABCDEF', [1, 0, 1, 0, 0, 1])
print(list(itr))
# => ['A', 'B', 'C']
```
##### `itertools.dropwhile(predicate, iterable)`
predicateが真である限りiterableから要素を返すイテレータを生成

```python
p = lambda x: x<5
l = [1, 4, 2, 1, 9, 3, 6]
itr = itertools.takewhile(p,l)
print(list(itr))
# => [1,4,2,1]
```
##### `itertools.groupby()`
連続する要素をグループ化する
```python
for k, g in itertools.groupby(sorted("AAAABBCCCDDDEEEFFAAACC"), key=list):
    print(k, len([i for i in g]), end=', ')
# ['A'] 7, ['B'] 2, ['C'] 5, ['D'] 3, ['E'] 3, ['F'] 2,
```


### 条件分岐
基本的には
```python
if 10 < x :
    print('10より大きい数字')
elif 10 == x :
    print('10です')
else:
    print('10より小さい数字です')
```

論理演算子にはand、or、notがある。例
```python
if 10 < x and x% 2 == 0 :
```
`if a is None and b is`


たまにモジュールのソースコードに以下のような一文が書かれている場合がある。
```python
if __name__ == '__main__':
```
`__name__`はそれが存在するモジュールの中の名前になる。`__main__`というのは対話環境(Rで言う.Globalenv?)で呼ばれたときの値。
上のように書いておくことにより、そのモジュールがメインモジュール(最初に呼ばれたモジュール)である時にのみ実行する内容にできる。詳しくは[こちら](http://jutememo.blogspot.jp/2008/08/python-if-name.html)

#### 三項演算子

```python
x = "OK" if n == 10 else "NG"
```

### 文字列操作
文字列型への返還は
`str()`か`repr()`を使用する。前者は人にやさしい表現に直し、後者は内部実装に近い見た目を返す。
```python
str(0.1)    # => '0.1'
repr(0.1)   # => '0.10000000000000001'
```
pythonには`printf`がない。書式を指定する場合は以下のようにする
```python
'%d %o %x' % (100, 100, 100)    # => '100 144 64'
```
- `%d`10進数で表示
- `%o`8進数で表示
- `%x`16進数で表示
- `%s`str()と同じ
- `%r`repr()と同じ

printと組み合わせると""内でのオブジェクトの展開ができる。例
```python
print "arguments were: %s %s" % (args1, args2 )
```

以下の二つは等価である
```python
print("Executing on %s as %s" % (env.host, env.user))

print("Executing on %(host)s as %(user)s" % env)
```

##### format関数
文字列オブジェクトの中に別の文字列を代入するときは`format()`を使用する。例

```python
username = 'miyamoto'
password = 'mypass'
"{0}'s password is {1}".format(username, password)
```
ここではformatには文字列オブジェクトを引数として渡しているが、配列を渡すこともできる。例
```python
myarray = ['miyamoto', 'mypass']
"{0[0]}'s password is {0[1]}".format(username, password)
```
フォーマット指定子`:`を用いることで文字列をprintfのように様々な方法で加工できる

```python
"{0:.1f} {1}.format(698.24, 'GB')"
# => '698.2 GB'
```
.1は、小数第1位に丸めることを指し、fは指数表記やその他の小数記法ではなく固定小数表記にすることを指す

###### 書式指定
- d ... 10進数
- X ... 16
- o ... 8
- b ... 2
-

##### その他の便利な関数
3重引用符を使うと複数行入力ができる。例
```python
s = '''hogehoge
    fugafuga'''

s.splitlines()  # => ['hogehoge', 'fugafuga']
```
`.lower()`,`.upper()`で大文字小文字の変換ができる


#### 文字列エンコーディングについて
pythonはすべてUnicodeとして格納している
```python
s = '深入　python'
len(s) #9を返す
```

##### replace
文字列を置換する
```python
"hoge".replace("og", "OG")  # => "hOGe"
```

#### 正規表現
`re`パッケージを使う.
最も単純な使い方はこんな感じ
```python
import re
s = "200 North of ROAD"
re.sub(r'ROAD$', 'RD.', s)
```
とりあえずrを付けてraw文字列にするのが吉
実際にはコンパイルして使うことが多い

*注意*:デフォルトだと、\*,\+,?などの量指定子が含まれる場合**最長**マッチを行う。最短マッチをしたい場合は、量指定子の後に?を追加して
\*?,\+?,??
のようにする

```python
text = '0123456789'
pattern = re.compile(r'0.*?4', re.IGNORECASE)   #第2引数で大文字小文字を無視
matchobj = pattern.match(text)
if matchobj:
    print matchobj.group() #マッチした文字列
    print matchobj.start() #マッチした初めの位置
    print matchobj.end() #マッチの終了位置
    print matchobj.span() #start()およびend()の両方をタプルで返す
```
`re.compile()`に指定できる引数には
- `re.I` ... 大文字小文字を無視
- `re.M` ... 複数行マッチ
等がある

`re.compile`で作成したオブジェクトには以下のメソッドがある。

- `match()` ... 先頭でマッチするものを探し、*マッチオブジェクトで*返す
- `search()` ... 最初にマッチしたものを探し、*マッチオブジェクトで*返す
- `findall()` ... どこでもいいのでマッチしたものすべてを*文字列のリストで*返す。マッチオブジェクトのメソッドは使えないらしい。互いに重なった部分に関しては、マッチしない
- `finditer()` ... マッチしたものすべてを*マッチオブジェクトのイテレータで*返す。
- `sub` ... 元の文字列を置き換えたものを返す。
- `split` ... 元の文字列を分割したものを返す

##### 後方参照
`re.sub`の場合`\1`,`\2`で参照する。

```python
re.sub(r'(\d)(\d+)', r"abc\1-\2", "A123B")  # => 'Aabc1-23B'
```
マッチオブジェクトの場合、`group`で参照する。後述

#### マッチオブジェクトのメソッド
マッチオブジェクトのゲッターには上に書いたような`end()`、`span()`、`group()`、`start()`などがある。

##### `match.group()`
- `match.group(0)`  マッチした文字列全体を返す。
- `match.group(1)`  正規表現中に丸括弧()がある場合、1番目の()の中身を返す(後方参照)

```python
>>> m = re.match(r"(\w+) (\w+)", "Isaac Newton, physicist")
>>> m.group(0)       # The entire match
'Isaac Newton'
>>> m.group(1)       # The first parenthesized subgroup.
'Isaac'
>>> m.group(2)       # The second parenthesized subgroup.
'Newton'
>>> m.group(1, 2)    # Multiple arguments give us a tuple.
('Isaac', 'Newton')
```


### ファイル操作

open関数によってファイルオブジェクトを生成し、そのメソッドを用いて操作を行う

#### クラシックなやり方
```python
f = open("hoge.txt")
lines2 = f.readlines()
f.close()
for line in lines2
    print line,
```

- `readlines()` ... 全て読み込む。一度しかできず、2回目を呼び出すとからのリストが帰るので注意
- `readlines()` ...一行ごとの読み込む

#### python3では
ファイルを開くときはwith構文を使用する
```python
with open("filename", "w") as file:
    file.write("some string")
```
with構文を使用すると、クラス内で`__enter__`および`__exit__`を使用したクラスの場合,メソッド呼び出し前と呼び出し後にそれぞれを実行してくれるようになる

##### ファイルオブジェクト
ファイルオブジェクトにforを適用すると、行を要素とするイテレータとして扱われる
```python
with open("filename", "r") as f:
    for line in f:
        print(line)
```

###### ファイルオブジェクトのメソッド


### os、shutil

スクリプト中で相対パスを指定すると、fileのあるディレクトリではなく実行時のディレクトリから始めてしまうため
`filename = os.path.join(os.path.dirname(__file__), '../test.txt')`
こんな感じで指定する

`os.listdir()` ... `ls`をした結果をlistで取得。ワイルドカードは使えないのでglobを使用する

ファイル操作に必要な関数などはこれを参照
```python
import os
import shutil
import stat

# ディレクトリを作成する
os.mkdir("path")
os.makedirs("aaa/bbb")  # 再帰的に作成する

# ファイルをコピーする
shutil.copy("src", "dst")
shutil.copytree("src", "dst")

# ファイルを移動する
shutil.move("src", "dst")

# ファイルを削除する
os.remove("path")

# ディレクトリを削除する
os.rmdir("path")  # 空でないと削除できない
shutil.rmtree("path")  # ディレクトリが空で無くても削除できる

# ファイルの名前を変更する
os.rename("src", "dst")

# ファイルの更新日を変更する 第2引数(アクセス日時,修正日時)
os.utime("path", (1, 10000))

# ファイル権限を変更する
os.chmod("path", stat.S_IREAD | stat.S_IWRITE)

# ファイルの詳細情報を取得する
st = os.stat("path")

# 作業ディレクトリを変更する
os.chdir("/")

# 作業ディレクトリを取得する
cwd = os.getcwd()
```

また、`commands`を使う例もある

```python
import commands
commands.getoutput('ls text/* | xargs -n 1 basename').split("\n")
```

OS間の移植性を気にする場合は
```python
from os.path import join, relpath
from glob import glob
path = 'test'
files = [relpath(x, path) for x in glob(join(path, '*'))]
```

### os,sys

#### 自作パッケージ内で外部モジュールを使用するとき
は,`sys.path.insert`を使用する。appendとはサーチする順番が違うらしい、あとなぜか第一引数に1を与えなくてはならない
まず`external/`をパッケージ内に用意しておき、その中に`pip install --target`でインストールする。
次に自作モジュール内に以下のように記述する。
```python
sys.path.insert(1, os.path.join(os.path.dirname(os.path.abspath(__file__)), "external")
```
あとは普通にimportできる

### glob



### コマンドライン引数の取得
```python
import sys
argvs = sys.argv    #argvsにはコマンドライン引数のリストが入る
argc = len(argvs)
```

### 標準入出力
普通の

- `input()` ... 自動で改行を取り除く、モジュールをimportする必要がない。
- `sys.stdin.readline()` ... 標準入力から一行取得
- `sys.stdin.readlines()` ... 各行を要素としてもつリストとして取得
- `sys.stdin` ... 結果をそのまま一つの文字列として取得

`print()`は引数が`str()`ではなくてもよいが、`sys.stdout.write()`はstr型でなくてはならない
```python
import sys
for line in sys.stdin:
    print(line.strip())
```

python3での`input`はpython2では`raw_input()`と呼ばれていた
型を指定する場合は`mapを使用する`
```python
map(int, input().split("\t"))   #一行のみ
a = [ map(int, input().split("\t")) for i in range(input())]    #全ての行列要素をを一つのリストに入れる

# input()の要素を配列に入れる
a = []
for l in range(input()):
    a.append(input().split("\t"))


```

以下のようにすると標準エラー出力に出せる。`log`を使用した方が良さそう
`print("hogehoge", file = sys.stderr)`
の`sys.stdin`のみを使用することもできる。例


```python
import sys
for line in sys.stdin:
    line = line.strip() #先頭及び末尾から特定の文字を除去する。引数なしなら空白文字
    words = line.split()    #1文字ごとに分割してリスト化
    for w in words:
        print('%s\t%s') % (w, 1)

```

## 関数定義

---
引数に*を付けると任意の数の引数をタプルで受け取ることができる。
```python
def one(*args)
    print args
one()   # => one(1,2,3)
```
アスタリスクを2個にするとリストではなく辞書で受け取る。

ア
スタリスクが1つの場合も2つの場合も関数に引数を渡すときにすべて一気に渡すための構文が用意されている。例
```python
>>> list1 = [1, 2, 3]
>>> def foo(a, b, c):
        print a, b, c

>>> foo(*list1)
1 2 3
```
辞書の場合は
```python
dic1 = {'a': 10, 'b': 20, 'c': 30}
>>> def foo(a = 1, b = 2, c = 3):
        print a, b, c

>>> foo(**dic1)
10 20 30
```
基本的なことだが、関数に()を付けるか付けないかでは
共同が異なる
```python
result = myfunc()   #myfunc()の実行結果がはいる
myfunc2 = myfunc    #myfuncが複製される。(リファレンスではないので、myfuncを削除してもmyfunc2は残る。)
```

引数の数が多すぎたり、デフォルトのない引数を与えずに関数を呼び出したりすると、TypeErrorが発生する。

### docstring
google style と numpy style があるが、google style に統一する

関数、メソッド、オブジェクト、モジュールの最初にトリプルクォート`""""""`で囲んだ文字列があればdocstringとして認識され、`func.__doc__`で読める。docstring中で、\\(バッククォート)を使う場合はrを付ける。
`r"""hogehoge"""`
```python
def myfunc():
    """Do X and return a string."""  #前後に空白はいらない。動詞は一人称(i.e. "Returns"ではない)。ピリオドで終わる。
```
docstring中では`**`での強調やバッククォートなどもrest風に書ける


ながいdocstringを書く場合の例は(関数の場合)
```python
def myfunc():
    """Do X and return a string.
    Args:
        param1 (int): The first parameter.
        param2 (Optinal[str]): The second parameter. Defaults to None.
            Second line of description should be indented.
        param3 (dict of str: int): dictinary will explain like this or like param4
        param4 (dict):
            key (str): hogehoge
            value(int): fugafuga

    Returns:
        bool: True if successful, False otherwise.

    Yields:
        int: if this is generator function

    Note:
        be aware that ...

    Examples:
        Examples shuold be written in doctest style

        >>> print([i for i in myfunc])
        [0, 1, 2, 3]

        >>> factorial(1e100)
        Traceback (most recent call last):
            ...
        OverflowError: n too large
    """
```

クラスメソッド、インスタンスメソッドの場合も同様
プライベートメソッドはデフォルトではsphinxに出力結果には含まれない

クラスの説明を書く場合は

```python
class ExampleClass(object):
    """class for doing hogehoge

    more precise explatation of this class ...
    Attributes should only contain public attributes
    ``@property``で書かれた属性はその*getter メソッド中で* docstringを書くこと

    Attributes:
        attr1 (str): Description of `attr1`
        attr2 (Optional[int]): Description of `attr2`

    """

    def __init__(self, param1, param2, param3):

```

**`__init__(self)`に関する説明は、`__init__(self)`以下に書いてもよいし、クラスの説明のところに書いてもよい、いずれにせよ統一した方がいい**

`__init__.py`にはモジュールの簡単な説明を書くべきと公式にはあるがやっているところは少ない印象。

### doctest

モジュールをテストする場合は一番下に

```python

if __name__ == "__main__"
    import doctest
    doctest.testmod()
```

と書いておき,`python module.py -v`で実行

外部ファイルにdocstringを用意しておいて、それを用いてテストする場合は
インタラクティブシェルから`import doctest`して`doctest.testfile("usage.txt")`
あるいは`python -m doctest -v usage.txt `

## OOP、スコープ

---

pythonではスコープを作るのはclass,function,moduleのみでありif,try, except,with等には関係ないよって以下は正常に動作する

```python
if True:
    name = "hoge"
print(name)
```

インスタンスメソッドは第一引数にselfをとり、returnする場合はself.xのように、インスタンス変数を返す
クラスメソッドは`@classmethod`デコレータを使用する

`__init__`がコンストラクタ
```python
>>> class SomeClass(mySuperClass):   #SuperClassクラスを継承issert
...     def __init__(self, x, y):
...         self.x = x
...     def some_instanse_method(self, param):   #pythonのインスタンスメソッドは第一引数としてselfを与える。ここにはクラスインスタンスが入る
...         return self.x * param

        def _set_private_attr(self, hoge):
            self._private_attr = hoge * 2

        self._set_private_attr()    #プライベートメソッドを呼び出すときは、selfを頭につける
```

定義したクラスのメソッドは。チェインで呼び出す
```python
ins = SomeClass()
ins.some_method(10)
```

コマンドライン引数をclassに渡したいときは、単に`__init__()`中で以下のようにすればよい

```python

class Hoge:
    def __init__(self):
        self.attr1 = args.foo

if __name__ == '__main__':
    #普通にargparseでパース
    hoge = Hoge()   #引数を渡す必要はない

```



### 新スタイルクラスと旧スタイルクラス
旧 ... type(myins)は常に`instance`を返す
新 ... type(myins)は`myins.__class__`と同じく、クラス名を返す。ただし`myins.__class__`をオーバーライドすることもできるので、絶対ではない
あと、特殊メソッド名がいくつか追加されている。

python3ではすべて新スタイル


### オブジェクトの操作
```python
ins.__class__   #insのクラスがわかる
ins.__class__.mro() #insの継承関係がすべてわかる
ins.__doc__ #insのdocstring(使い方)がわかる
```

#### クラスメソッドとスタティックメソッド
いずれもインスタンス変数にアクセスできないようなメソッド、`@clasmethod`,`@staticmethod`でデコレートする。
クラスメソッドは引数としてクラスを渡す必要がある。絶対名で渡していない(clsとするのが慣習)ため、継承するとサブクラス内のスコープになる
staticmethodは、引数にクラスをとらず、絶対名で参照するため、継承しても親クラスのスコープになる

```python
class MyClass():
    class_var = "hoge"

    @classmethod
    def myclassmethod(cls):
        print "%s, class_var: %s" % (cls, cls.class_var)

    @staticmethod
    def mystaticmethod():
        print "%s, class_var: %s" % (MyClass, MyClass.class_var)
```

- `classmethod` ... クラスに束縛される
- `staticmethod` ... Superクラスに束縛される
- メソッド ... インスタンスに束縛される

と覚えておけばよい。

`MyClass.mymethod` は`<unbound method MyClass.mymethod>`と表示されるが
`my_instance.mymethod`は`<unbound method __main__.MyClass instance at 0x000000>`のように表示される

#### クラス変数
pythonクラス変数はシングルトンであるので以下のような挙動を示す。
```python
class A():
    a = "This is class attribute"

x = A()
y = A()
x.a = "This creates a new instance attribures for x!"
y.a # => "This is class attribute"
A.a = "This changes class attribute for A"
y.a # => "This changes class attribute for A"
# x.aはそのままである


```


#### イテレータの実装
クラスに`__iter__`メソッドと`__netx__`メソッドを付ければよい。前者は`iter(my_instance)`あるいは`for p in myinstance:`で自動的に読みだされる
`__next__`はforループのたびに実行される。例

```python
class Fib:
    def __init__(self, max):
        self.max = max

    def __iter__(self):
        self.a = 0
        self.b = 1
        return self

    def __next__(self):
        fib = self.a
        if fib > self.max:
            raise StopIteration
        self.a, self.b = self.b, self.a + self.b
        return fib
```

ポイントは`StopIteration`で、これは例外をraiseしない。

`locals()`で名前空間内(多くの場合は関数内)のすべての値を辞書形式で返す。例
```python
def foo(arg):
    x = 10
    print locals()

foo(20) # => {'x' : 10, 'arg' : 20}
```
グローバルな名前空間については`globals()`で確認ができる。

### クロージャ
関数内関数は呼び出し時のlocalスコープの情報を記憶している。つまり
```python
>>> def outer(x):
...     def inner():
...         print x
...     return inner
>>> print1 = outer(1)
>>> print2 = outer(2)
>>> print1()
1
>>> print2()
2
```
のようになる。

### デコレータ
クロージャの一種で関数を受け取って別の関数を返す関数。例
```python
>>> def outer(some_func):
...     def inner():
...         print "before some_func"
...         ret = some_func() #1
...         return ret + 1
...     return inner
>>> def foo():
...     return 1
>>> decorated = outer(foo) #2
>>> decorated()
before some_func
2
```
実際には関数の返す値の範囲を制限したりするために使うことが多い。
シンタックスシュガーとして@シンボルが用意されている詳しくは[こちら](http://qiita.com/_rdtr/items/d3bc1a8d4b7eb375c368)
最近は`@functools.wraps`をデコレータ内で使用する感じにした方が良いかも

デコレートされた関数は定義した時点でデコレートされているので、テストするときはデコレータを含めた状態でテストすることになる。

#### `property`

同じ名前の関数をセッター、ゲッター、deleter
として働くときに、それぞれ異なる動作をするようにしたいときに利用する。例

```python
class Sample:

    def __init__(self):
        self._x = 0

    @property
    def x(self):
        return self._x  #getterを定義

    @x.setter
    def x(self):
        self._x = x * 2

    @x.deleter
    def x(self):
        print(self._x)  #xを削除しようとすると、printするだけで削除できないようにする。
```

これでクライアントから以下のコードを実行すると

```python
samp = Sample()
del samp.x
```
`x`は削除されず、printされるのみになる。


## 関数型プログラミング
### lambda式について
defと同様に関数オブジェクトを行えるので、以下の2つの式は等価
```python
def add(x, y):
    return x + y

add = lambda x, y: x + y
```
defと違い、単独の文にしないといけないが、その代わり、他の関数に一文で与えることができる。例
```python
def sum(numbers):
    t = 0
    for t in numbers:
        t += n
        return t
# これはlambda式では書けない
sorted(strings, lambda s: len(s))   #sorted関数の引数として、関数オブジェクトを与える
```

### 高階関数
関数を引数に取る関数。
#### `filter`
組み込み関数。
第一引数に「Booleanを返す関数」
第二引数に「配列(リスト)」
を与えることで、リストの中からTrueの値だけを持ってくる。

他にも
- `map` ... 組み込み。配列全体に処理を適用する。
- `reduce` ... `functools`からインポートする。配列全体に処理を適用する

例
```python
nums = range(1, 10+1)
# 1から10の間で、奇数だけを返す
for x in filter(lambda x: x%2 == 1, nums):
    print(x)

# 1から10の間で、奇数だけを選択し、2乗して出力する
for x in map(lambda x: x*x, filter(lambda x: x%2 == 1, nums)):
    print(x)

# 上の結果を合計して出力する
from functools import reduce
    total = reduce(lambda t, x: t+x,
                   map(lambda x: x*x, filter(lambda x: x%2 == 1, nums)))

print(total)

# こっちの方が見やすい
from functools import reduce
nums = range(1, 10+1)
nums = filter(lambda x: x%2 == 1, nums)
nums = map(lambda x: x*x, nums)
total = reduce(lambda t, x: t+x, nums)
```

実際には`map`や`filter`は、内包表記を用いた方が良いことが多い
これは
1. 全要素に一つずつ操作を実行する。
2. 条件に合う要素でサブセットを作る。

という、非常によくある操作を行う場合のベストプラクティスである

```python
## map() と filter() の組み合わせは
newarr = map(lambda x: x * x, filter(lambda x: x % 2 == 0, arr))

## リスト内包表記でこう書ける
newarr = [ x * x for x in arr if x % 2 == 0 ]
```
`dict = { x:int(x) for x in strings}` ... 配列を辞書に変換

```python
line_list = ['  line 1\n', 'line 2  \n', ...]

# Generator expression -- returns iterator
stripped_iter = (line.strip() for line in line_list)

# List comprehension -- returns list
stripped_list = [line.strip() for line in line_list]

# subsetをとる
stripped_list = [line.strip() for line in line_list
                 if line != ""]

```

### generator,ジェネレータ
例えば、インプットが次のような形式だったとき
```
a1
a2
a3
...
(EOF)
```
「EOFが来るまでの値」を配列として受け取りたければ

```python
def get_input():
    while True:
        try:
            yield ''.join(raw_input())  #python3ではinput()?
        except EOFerror:
            break

if __name__ == '__main__':
    a = list(get_input())
```

## pep8

open文などが長い場合は \ を使用してインデントしてもよい
例
```python
with open('/path/to/some/file/you/want/to/read') as file_1, \
     open('/path/to/some/file/being/written', 'w') as file_2:
    file_2.write(file_1.read())
```

非常に長い文字列の場合は()で囲んでしまうと、結合できる。例えば以下の二つは等価である

```python
sample = 'http://www.data.jma.go.jp/obd/stats/etrn/view/daily_s1.php?prec_no=44&block_no=47662&year=2012&month=8&day=&view='
sample = ('http://www.data.jma.go.jp/obd/stats/etrn/view/daily_s1.php?'
          'prec_no=44&block_no=47662&year=2012&month=8&day=&view=')
```

## テスト
`unittest`を用いる。
例えばroman1のto_roman()をテストしたい場合は
`/test/test_roman.py`　のようなファイルを作り以下のように書く

```python
import roman1
import unitteset

class KnownValues(unittest.TestCase)
    values = ((1, 'I'),
              (2, 'II'),
              )
    def test_to_values(self):   #メソッド名はtestから始まっていなくてはならない
        for integer, numerical in self.values:
        result = roman1.to_roman(integer)
        self.assertEqual(numerical, result) #TestCaseクラスのメソッド
if __name__ == '__main__':
    unittest.main()

```


assert*メソッドにはいろいろある。[こちら](http://surgo.jp/2011/12/python-or-unittest2.html)あるいは[こちら](http://docs.python.jp/2/library/unittest.html#assert-methods)を参照

このケースだと、例外処理が不十分である。つまり、以上に大きい値がto_romanに与えられると、`"MMMMMM"`のような値が返される可能性があり、これは喜ばしくない。to_romanは3999以上の値はエラーを吐くようにしたい。こういった場合は`assertRaises`メソッドを使用する。
`assert`文の中でも`assertRaises`は少し特殊で、このようにwith文を使用するか

```python
def test_hoge(self):
    with self.assertRaises(ValueError):
        hoge()  #hoge()がValueErrorを出せばテストをパスする
```

引数を別にして呼び出す。(下記参照)

~~

```python
class ToRomanBadInput(unittest.TestCase):
    def test_too_large(self):

        self.assertRaises(roman1.OutOfRangeError, roman1.to_roman, 4000)

```

このようなテストを書いたら、roman1.pyにOutOfRangeErrorを追加する。
```python
class OutOfRangeError(ValueError):
```

~~

python2.7以降ならwithをつかって書いた方がわかりやすい
```python
def test_myfunc():
    with self.assertRaises(TypeError):  #TypeErrorは、組み込み型のエラー
    myfunc(2, ["hoge"]) #二つの異なる方を引数に渡しているのでエラー
```


unittestのメソッドには3つの返り値がある

- Pass ... テストに成功した
- Fail ... テストに失敗した
- Error ... コードを実行できなかった。

`setUp(self)`と`tearDown(self)`はテストケースクラスの中で、最初と最後に実行される内容を書く

まとめてテストを実行するときは以下のようにする
`python -m unittest discover <test_directory>`

#### mock
モックオブジェクトを用意するライブラリ。
python3.3以降では標準になっている

##### メソッドをMockインスタンスに差し替える
*注: 実際にはMagicMockを使用した方が良い。後述*
Bクラスが、Aクラスのインスタンスを引数として受け取り、内部でAクラスのメソッドを読んでいる場合、AのメソッドをMockオブジェクトに差し替えてやることで、依存関係を切り離せる

```python
class A(object):
    def a_test():
        print('test')

class B(object):
    def __init__(self, a_ins):
        self.a_ins = a_ins
    def b_test(self):
        return self.a_ins.a_test()
```
Aのメソッドをmockに変え,`return_value`を設定する
```python
a = A()
a.a_test = Mock()
a.a_test.return_value = 'Mocked'
b = B(a)
b.b_test()
```

##### インスタンスを丸ごとモックオブジェクトにする
Mockの引数に`spec=<Mockしたいクラス>`を指定する
```python
a = Mock(spec=A)
a.a_test.return_value = 'mocked_spec'
```

##### mockしたいクラスが例外を出す場合
例外を出すメソッドに`side_effect`を設定する



```python
a = Mock(spec=A)
a.a_test.side_effect = ValueError
b = B(a)
b.b_test()
```
##### 特定の状況下(例: `__main__`から呼んだとき)でのみmockを使う
`@patch`を使用する

##### magicmock
`mock.Mock`のラッパー、メソッドや、インスタンスだけでなくクラスでも関数でもなんでもシミュレートできる。
```python
fro mock import MagicMock
import models
user = models.User('akiyoko')
user.get_name.return_value = 'mock'
```
`retrun_value`は一文で作ってしまってもよい。例

```python
user.get_name = MagicMock(return_value = 'mock')
```
使う際はpatch化するか、`setUp()`内で使用する


## 例外処理
例外を補足するには`try: except:`節を利用する
(実際にはこれで十分な気がする…)

```python
if not isinstance(variable, int):
    raise ValueError('')
else:
    #何らかの処理

```


```python
while True:
    try:
        n = int(raw_input("数字を入力してください"))
        print n
        break
    except (ValueError, IndexError):
        print "例外が発生しました"
```
このように書くと、まずtry:の中を実行し、errorがなければ節を抜ける。errorがあればexcept文の中を実行する。except文に対応するErrorのクラス(この場合はValueError、IndexError)がなければ節から抜ける。
どのErrorクラスかよくわからない時は、とりあえず、Exceptionクラスを指定しておけばよい？例

```python
try:
    a = int('string')
except Exception as e:
    print e.message
```
でもほんとは以下のように適切なエラークラスを指定すべき

```python
class MyError(Exception):
    pass

raise MyError("Please do not ...")
```
Exceptionクラスを継承した時は、`__init__()`を用いて属性をセットすることが有用な場合もある。


以下にエラークラスの種類を示す

#### Errorクラスの種類

- `BaseException` ... 全ての例外のベースクラス
- `Exception` ... 実行中のアプリケーションを終了させない例外のベースクラス。ユーザー定義の例外はこれをベースをすべき
- `StandardError` ... よくわからん
- `ArithmeticError` ... 数値関連のエラー
- `LookupError` ... 何かを発見した時に発生させるエラー
- `EnvironmentError` ... pythonの外部から発生するエラーのためのベースクラス
- `AssertionError` ... assert文が失敗した時に出る
- `AttributeError` ... 存在しない属性を参照した時や、読み込み専用属性を変更しようとしたときに出る
- `IOError` ... 入力や出力が失敗するときに発生する
- `IndexError`,`KeyError` ... それぞれlist、辞書に存在しないインデックス、Keyで参照しようとした時に起こる

より細かい区分は[ここ](http://ja.pymotw.com/2/exceptions/)を参照

### 型のチェック
`isinstance(n, int)`のようにして行う。例

```python
if not isinstance(n, int):
    raise NotIntegerError("Please give me Integer value!")
```

第二引数にタプルを与えれば、複数の型を同時に検査できる

```python
# これは
if isinstance(value, list) or isinstance(value, tuple):
# 以下と同等
if isinstance(value, (list, tuple)):


```

---
matplotlib

## logging

たいていは単に`logger = logging.getLogger(__name__)`をそれぞれのスクリプトで行って、メインスクリプトで`basicConfig()`で必要に応じて設定を変えればOK。

`print()`に似た情報を出力できる。違いは、情報に重要度の違いを持たせられること。デバッグの時にのみ、出力することができたりする
[ここ](http://docs.python.jp/2/howto/logging.html#logging-basic-tutorial)の"基本ロギングチュートリアル"を見よ

```python
if __name__ == '__main__'
    logging.basicConfig(level=logging.DEBUG,
                        format='%(asctime)s- %(name)s - %(levelname)s - %(message)s')
    logging.debug('this is debug message')
    logging.info('this is info message')
    logging.warning('this is warning message')
    logging.error('this is error message')
    logging.critical('this is critical message')
```
デフォルトだと、ログレベルが`loggin.WARNING`になっているため`logging.debug()`や`logging.info()`の内容は出力されない。

### http://pieces.openpolitics.com/2012/04/python-logging-best-practices/
loggingパッケージでは4つのタイプのオブジェクトが作れる。

1. Loggers ... 後述
2. Formatters ... メッセージをフォーマットする
3. Filters ... outputをコントロールする。重要度は低い
4. Handlers ... Fileなど、出力先を変更する

basicConfigの設定が大量にあるときは
1. yamlからロードして辞書し、
2. logging.config.dictConfig()で読み込む
とよい

loggerはシングルトンなので、モジュールにつき一つ用意する。

##### loggerは階層的である
例えば`foo.bar`と`foo.baz`というライブラリがあった場合,
```python
from logging import getLogger
getLogger('foo').setLevel(logging.DEBUG)
```
すると、上述の二つのライブラリのロギングレベルを同時にDEBUGに設定できる。


`logger.****()`にはフォーマット記法が使える

```python
logger.debug('Records: %s', records)    #recordsを埋め込む
```



### loggingのベストプラクティス
結論から言うと
```python

from logging import getLogger,StreamHandler,DEBUG
logger = getLogger(__name__)    #以降、このファイルでログが出たということがはっきりする。
handler = StreamHandler()
handler.setLevel(DEBUG)
logger.setLevel(DEBUG)
logger.addHandler(handler)

```
こう書けばよい


#### なんで？
```python
logging.debug()
logging.basicConfig(lovel = loggin.DEBUG)
```
を指定すると、使用しているモジュール内のすべてのデバッグレベルが変更されてしまい、いらない情報まで出てきてしまう。

```
logger = logging.getLogger(__name__)
logger.debug()
```
が混ざる危険があるので`logger()`のみを使う
まず初めに以下のように書く
```python
from logging import getLogger
logger = getLogger(__name__)
```

### 複数のファイルにまたがるモジュールで共通の`logger`を使用する場合
`__init__.py`に、以下のように書いておく。

```python
import logging
def get_module_logger(modname):
    logger = logging.getLogger(modname)
    handler = logging.StreamHandler()
    formatter = logging.Formatter('my-format')
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    logger.setLevel(logging.DEBUG)
    return logger
```

そしてそれぞれのクラスでloggerが必要になったら。

```python
from <modname> import get_module_logger
logger = get_module_logger(__name__)
```

### logger
`logger.info()` ... プログラムの通常の操作中に発生したイベントの報告。
`logger.warn()` ... アプリケーションのユーザーに対して渡す警告

`logger.exception()` ... `except:`内でのみ使用する。以下が例

```python
try:
    #hogehoge
except Exception as e:
    logger.exception("hogehoge {}".format(e))
```

`logger.error()`に似るが、スタックトレースを一緒にダンプする。例外ハンドラだけで使用するべき(？)
### handler
出力先を指定するオブジェクト。`logger.addHandler()`によって`logger`オブジェクトにくっつく。

`logger.hadlers` ... 現在のハンドラ一覧。デフォルトは空
ハンドラを追加する場合は

```python

fh = logging.FileHandler('test.log', 'a+')
logger.addHandler(fh)   #追加

```
インタラクティブモードで実行されたなら、以降の出力はコンソールとファイルの両方に出るようになる。
そうでない場合(モジュールとして実行された場合)は、コンソールに出力するためには上記の`Filehandler('test.log', 'a+')`を`StreamHandler()`に変更する必要がある

他にもSMTPでメールを送ったり、Syslogへの出力もできる

#### QueueHandler、QueueListener
python 3.2以降で追加、リモートジョブのロギングをする。



### Formatter

`logging.Formatter()`でフォーマッタを生成し、それを`handler.formatter`に代入することで使用可能になる。フォーマッタの例

```python
import logging
logger = logging.getLogger('simple_example')
logger.setLevel(logging.DEBUG)

ch = logging.StreamHandler()
formatter = logging.Formatter('%(asctime)s - %(name) - %(Levelname)s - %(message)s') #%()内に入る属性はLogRecordと呼ばれる
ch.setFormatter(formatter)
logger.addHandler(ch)
logger.debug('debug message')
```
コマンドラインには`2005-03-19 15:10:26,618 - simple_example - DEBUG - debug message`とでる

### Filter

あんまり使わない

## バージョンの違い、処理系

---
`from__futute__import division`
とすることで、python3の整数除算の挙動をpython2に取り入れることができる。
pypy…pythonインタプリタだがそれ自体pythonで記述されている。RPythonで書かれている。

### pip

パッケージマネージャ
`pip install git+url`でgithubから直接落とせる

[get-pip.py](https://bootstrap.pypa.io/get-pip.py)を使用すれば`pip insatll`で実行できることなら大体できる。
これは本来はpip自体のインストール用スクリプト


### python自体のバージョン管理
python2,3を共存させたいような場合は`pyenv`とそのプラグイン`virtualenv`が便利
`~/.pyenv` に`git clone http:\\github.com/yyuu/pyenv.git`したものを入れる。
`git clone https://github.com/yyuu/pyenv.git ~/.pyenv`

`$PYENV_ROOT`を指定すればそこにインストールされる。
デフォルトでは`$HOME/.pyenv/versions`以下に入る

`~/.zshrc`に以下のように書いておくとよい

```sh
# pyenv
export PYENV_ROOT="${HOME}/.pyenv"
if [ -d "${PYENV_ROOT}" ]; then
export PATH=${PYENV_ROOT}/bin:$PATH
    eval "$(pyenv init -)"

fi
```

これで

```python
pyenv install anaconda-2.0.1
pyenv insatll anaconda3-2.0.1
```

のような使い方ができる。以下にコマンド


- `pyenv version` ... 現在のpythonのバージョンを見る。
- `pyenv versions` ... 使用可能なvirtualenvの一覧を見る。
- `pyenv install -l` ... installできるものの一覧
- `pyenv exec pip install --upgrade pip` ... pipを最新にする
- `pyenv virtualenv 2.7.10 my-virtualenv-2.7.10` ... 新しいvirtualenvの作成。
作成したvirtualenvは$PYENV_ROOT/versions/ に入る
- `pyenv uninstall my-virtualenv-2.7.10` ... 削除
- `pyenv global my-virtualenv-2.7.10` ... システム全体で切り替え。
- `pyenv local my-virtualenv-2.7.10` ... カレントディレクトリのみ切り替え
- `pyenv virtualenvs` ... 作成したvirtualenvの一覧を表示

#### pyenvの仕組み
`rbenv`とほぼ同じらしい
##### pip
`~/.pyenv/shims`がpipを横取りする。具体的には下記の手順で実行される

 1. `PATH`からpipの実行ファイルを探す。
 2. `~/.pyenv/shims`の中にあるpipを見つける
 3. このpipを実行し、コマンドをpyenvに渡す

よって、`~/.pyenv/shims`のパスが`/usr/local/`等よりも先に来ていないと正常に環境を構築できない可能性がある

まれに`samtools`等、pipでインストールできないコマンドがある。その時は`~/.pyenv/shims/samtools`を消すとか、~~`pip
install pysam`とかで解決する場合がある。~~ ->
これは`~/.pyenv/versions/<現在のバージョン名>/bin/`以下に本体へのシンボリックリンクを貼ることでも解消できる。



##### python自体
`~/.pyenv/versions`に入っている
以下の手順に従ってどのpythonのバージョンを使用するか決める
1. `PYENV_VERSION`環境変数
2. カレントディレクトリにある`.python-version`ファイル。なければ親ディレクトリをホームまでさかのぼって探す
3. `~/.pyenv/version`、`pyenv global`で変更できる


### virtual-env
`pyenv`のプラグイン、pipを横取りして、環境ごとに異なったパッケージを管理する

- pyenv virtualenv 3.5.0 new_3.5.0` ... 新しい環境の作成

特定の環境にインストールされたパッケージ群を別の環境に移植したい場合は

`pip freeze > requirements.txt`で、現在のパッケージ群を書き出し,

`pip install -r requirements.txt`

でそれらを入れる。

バージョンを考慮せず、全て最新のものを入れたい場合は

`cat requirements.txt | grep -v '^\-e' | cut -d = -f1 | xargs pip install -U`

あるいは

`cat requirements.txt | grep -v '^\-e' | cut -d = -f2 | xargs -L1 pip install -U`


### anaconda
数値計算用のパッケージなどがセットになったpythonのディストリビューション

`conda`コマンドの機能のいくつかは`pyenv`とかぶる。モジュールのバージョンも指定できる点
- `conda create -n py33con python=3.3 anaconda` ... -nでディレクトリ名を指定
- `conda create -p ~/anaconda/envs/test2 anaconda=1.4.0 python=2.7 numpy=1.6` ... パッケージのバージョン指定
- `conda search scikit-learn` ... パッケージのバージョン検索
- `conda search -p ~/anaconda/envs/onlyScipy/` ... 特定のパッケージにcompatibleなパッケージの検索
- `conda install -c bioconda bwa=0.7.12`biocondaを利用してバイオインフォマティクスのソフトを入れる。`.condarc`に以下のように書いておけば明示する必要がなくなる

```sh
channels:
    - defaults
    - bioconda
```
インストールするべきパッケージが大量にあるときは`requirements.txt`に例えば以下のように書いておき

```sh
bcftools=1.2
bwa=0.7.12
graphviz=2.38.0
python=3.4.3
samtools=1.2
snakemake=3.4.2
pyyaml=3.11
```

`--file requirements.txt`で指定する

- `conda info -e` ... 作った環境の一覧
環境を作ったら
`source activate <環境名(ディレクトリ)>`でactivateする

### Rpython
Rpython…pythonにいくつかの制限を加える代わりに高速化したもの

#### jupyter
`/usr/local/share/jupyter/kernels`に様々な言語のカーネルが入っている
`~/.python/kernels`ユーザー別のkernel

##### jupyter のインストール
pyenv でanaconda環境に切り替えたのち
`pip install jupyter`


##### jupyter/notebookのインストール
nodejsとnpmが入っていることをはっきりさせる
`sudo apt-get install nodejs-legacy npm`
macなら `brew install node`
jupyter notebookをcloneしてビルド
```sh
git clone https://github.com/jupyter/notebook.git
cd notebook
pip install --pre -e .
jupyter notebook
```

##### ipythonの設定

`pip3 install ipython`

`ipython3`

```python
from notebook.auth import passwd
passwd()
```
passを入力するとsha鍵が出るので、これを
`~/.jupyter/jupyter_notebook_config.py`内に以下のような形で書く
```python
c = get_config()

# 全てのIPから接続を許可
c.NotebookApp.ip = '*'
c.NotebookApp.password = u'sha1:bcd259ccf...<先ほどの鍵をコピペ>'
# ブラウザは立ち上げない
c.NotebookApp.open_browser = False

# 特定のポートに指定(デフォルトは8888)
c.NotebookApp.port = 9999
```
後はローカルのブラウザから
`http://<サーバのIP>:9999`でログイン

### ipython
`%run ~/source/mycode.py` ... 外部スクリプトの実行
起動時に自動で実行されるスクリプトは
`~/.ipython/profile_default/startup/*.py`

## 他言語との連携
### R
昔はRPy2が使用されていたがいまではPypeRが主流

## パッケージ管理
pyenvが便利？

---
pipのインストールは
```bash
sudo apt-get install python-pip pythondev
```
で行う。
`pip -U install fabric`Fabricのインストール
-Uオプションはすでにインストールされている場合アップグレードしてくれる

- `pip freeze` ... 現在の仮想環境下にインストールされているパッケージとそのバージョンを出力。自分でパッケージを作ったときは`pip freeze > requirement.txt`とかすると便利。
- `pip install -r requirements.txt` ... テキストファイル内のパッケージを一気にインストール

#### パッケージのパス
1. インストール時にデフォルトで設定されている物
例: `/usr/lib64/python2.6`
2. $PYTHONPATHに設定されているもの(追加するときは普通ここに設定する)
3. `sys.path`に格納されているもの`sys.path.append()`で追加できる

#### ソースのダウンロード
`pip install <package_name> --download="/path/to/downloaded/files"`でパッケージとそのDependencyのダウンロードのみを行う

#### wheel
eggではなくこれを使うのが今風らしい


### packageの中身
httplib2というパッケージの場合、以下のようなディレクトリ構成になる
```
httplib2/
|
+--README.txt
|
+--setup.py
|
+--docs/
|
+-httplib2/
    |
    +--__init__.py
    |
    +--hoge.py
```
このうち/docsだけは必須ではなく、`MANIFEST.in`で明示しなければ配布パッケージには含まれない。

### 自分でパッケージを書く場合

setuptoolsを使う。
パッケージのrootディレクトリに、`setup.py`を置き、以下のような感じでメタデータを書く
```python
#!/usr/bin/env python

from setuptools import setup

setup(name='Distutils',
      version='1.0',
      description='Python Distribution Utilities',
      author='Greg Ward',
      author_email='gward@python.net',
      url='http://www.python.org/sigs/distutils-sig/',
      packages=['distutils', 'distutils.command'],
     )
```
`package_dir = {'': 'lib'}`
と書いたうえで
`packages = ['foo']`を指定すると、setup.pyのあるディレクトリからの相対パスで
`lib/foo/__init__.py`が存在することを確約したことになる

#### `setup()`内で指定可能な要素
- `install_requires` ... dependency packageの文字列リスト
- `dependency_links` ... `install_requires`がPyPIにない時、こちらでgithubのリポジトリURLの文字列(のリスト)を指定する
- `tests_require`=['mock', 'nose']
- `script` ... 文字列のリスト、`setup.py`空の相対パスでファイルを指定する。指定されたファイルはインストール時に、PATHが通っているディレクトリにおかれ、実行可能なコマンドになる。.pyでも.shでも何でもよい
- `console_scripts` ... 上記の実行可能なコマンドをファイルからではなく*関数*から作成する。例
もしも

```python
import funniest.commandline
funniest.command_line.main()
```
が実行可能なら、以下のように書いておけば`funniest-joke`というコマンドラインツールができる
```python
setup(
    ...
    entry_points = {
        'console_scripts': ['funniest-joke=funniest.command_line:main'],
    }
    ...
)
```

#### Manifest.inについて
これを書かないと、配布物のうち`*.py`ファイル以外は配布対象にならない

```python
include hoge    #rootディレクトリのhogeという名前のファイルを配布物に含める
recursive-include huga *.html *.css #rootディレクトリ以外でも、その名前のファイルがあれば含める。
```

#### \_\_init\_\_.pyについて
空ファイルで構わない。おいておくと、そのファイルの存在するディレクトリ名がパッケージ名になり
`from <__init__.pyのあるパッケージ名>.<script名> import <関数名>`の形でinportできるようになる

##### 複数ディレクトリを1つのパッケージとしてまとめる
場合によっては以下のように書く場合もある
```python
from pkgutil import extend_path
__path__ = extend_path(__path__, __name__)
```
こうすると、複数の異なるディレクトリにまたがったパッケージを一つのディレクトリにある普通のパッケージとして扱えるらしい。

##### exportする関数を限定
`__all__ = []`を定義しておくと、`from <pkg> import *`した時に、all内の要素のみをimportする

##### 初期実行
`__init__.py`内のコードはそのディレクトリ内のものをインポートした際に一度だけ実行される


##### 内部の隠蔽

```
/foo
    - __init__.py   #from bar import PIYO
    - bar.py    #PIYO=100
```
と書いておくと、`import foo`でいきなりPIYOが使えるようになる。


## 構成管理

---
facric -> ansibleへと移るのが吉
### fabric
基本は以下のように書く
```python
from fabric.api import run

def show_uname():
    run('uname -s')
```

#### fabric.api
基本コマンドのクラス、よく使われるのは
`run,sudo,local,put`の４つ、
- `local` ... 手元のサーバでそのスクリプトを実行する
- `put` ... sftpでファイルを転送する。例
```python
from fabric.api import put
def scp():
    put('local path', 'remote path')
```

- `get(remote_path, local_path = <current_dir>)` ... リモートからファイルをゲット。
- `open_shell` ... デバッグ用。タスクの実行を一時停止し、リモートのシェルを開く。
- `prompt()`    ... ユーザーからの入力を受け付ける
- reboot()  ... 言わずもがな

#### fabric.contrib

- `console.confirm("Message", default = False)`　 ... ユーザに[y/N]での確認を促す。promptの制限版


fabfile.pyという名前で保存し、`fab`コマンドで実行
```sh
fab -H <server_address> show_uname
# or
fab -u <user_name> -i <path_to_secret_key> -H <server_address> show_uname
```
-Hで指定する先に`localhost`を指定することもできる。

`fab`コマンドには引数を与えることもできる(タスク引数)例えばfabfile.py内に以下のように記述し
```python
def hello(name="world")
    print("Hello %s!" % name)
```
シェルで
```sh
fab hello:name=jeff
```

#### task

`fabfile/`ディレクトリを作ってやり、その中に任意の.pyファイルを入れてやれば、それを実行できる
taskで分割するときは,`default`を設定してやると便利
```python:deploy.py
from fabric.api import task

@task
def restart():
    pass

@task(default=True)
def full_deploy():
    restart()
```
こうすると単に`deploy`するだけで`full_deploy`できる

`@task`デコレータでラップしてやると、`fab --list`で表示されるようになる。また
`@task(alias=hoge)`もできる

#### `fabfile.py`の分割
fabfaile/
    |-`__init__.py`
    |-`hoge.py`
    |-`fuga.py`

のようなディレクトリを作ってやり、`__init__.py`に`import hoge`,`import fuga`と書いてやる

>`~/.fabricrc`に`fabfile = hoge.py`
>と書いてやると任意の名前のファイルをfabfileとして扱える
>

環境変数やカレントディレクトリを指定したうえで、特定の動作を送ってほしい場合は`shell_env,cd,lcd`を使用する

環境変数HOGEをlocal、remoteともにfugaで固定する
```python
from fabric.api import local, shell_env, run

def envtest():
    with shell_env(HOGE='fuga'):
        local('env')
        run('env')
```
with構文を抜けるとshell_envの効果はなくなる。`cd,lcd`も同様

*デフォルトだと`~/.ssh/config`は利用してくれないのでスクリプト内に以下のように書いておく必要がある*
```python
env.use_ssh_config = True
```

#### fabricrc
bashrcのようなもの、デフォルトだと`~/fabricrc`を探すが
`-c`で指定してやると好きなものを使える


#### 失敗への対処
fabricはそれぞれのシェルスクリプトの返り値をチェックして、失敗の場合はそこで停止する。それを変更したい場合は各種モジュールを使う
```python
from __future__ import with_statement
from fabric.api import local, settings, abort
from fabric.contrib.console import confirm

def test():
    with settings(warn_only=True):
        result = local('./manage.py test my_app', capture=True)
    if result.failed and not confirm("Tests failed. Continue anyway?"):
        abort("Aborting at user request.")
```

#### if文
ファイルの存在などをシェルスクリプトのif文でチェックして実行したい場合は少し特殊で、

```python
code_dir = 'srv/django/myproject'
with settings(warn_only=True):
    if run("test -d %s" % code_dir).failed:
        run("git clone user@vchost:path/to/repo/.git %s" % code_dir)
```

#### env
グローバルなシングルトンで、タスク間で共有される設定を入れる。例
```python
from fabric.api import env
env.hosts =['my_server']    #デプロイ先のアドレスを指定。(リストなのでいくつでもよい)
```
よく使われるものには以下がある
- `env.user` SSH接続するときのデフォルトユーザ名は自分のローカル名だが、これを設定すると上書きできる
- `password`sudoや接続のパスワードを設定する。特に指定しなければ必要になったタイミングで聞いてくるらしい
- `warn_only`エラーを検知した時に実行を停止しないか否か。デフォルトはfalse。たいていの場合はenvでグローバルに設定せず,`with settings(warn_only = True)`の形で指定する。あるいはデコレータ(後述)で指定してもOK
- `env.roledefs`複f数のホストを役割ごとにまとめるために使用する。例
```python
env.roledefs = {
    'web' : ['www1', 'www2', 'www3']
    'dns' : ['ns1', 'ns2']
}
```
- `env.config_file`設定を書いたyamlのパスを指定する。fabfile内に`env.config_file = 'deploy.yaml'`と書いておくと、`env.config.<yamlの要素名>`の形で参照できるようになる。
- `env.logger` ... loggerの設定を共有

envは実際にはdictのサブクラスである。
ほとんどのenvはデコレータで代用できそうな気もする
envで指定できる要素の一覧は[こちら](http://fabric-ja.readthedocs.org/ja/latest/usage/env.html)を参照


#### 冪等制の保証
一応スクリプトだけでもできる
```python
def setup_package(package = "apache2"):
    if run("dpkg -s %s | grep 'Status:' ; true" %\
    (package)).find("installed") == -1:
    sudo("aptitude install '%s'" % (package))

```
…が、この方法はやめた方が良い。Cuisineを使用するのが吉

```python
def setup_package(package = "apache2"):
    package_ensure("%s" % (package))
```

#### デコレータ
特定のホストやroleのみに実行されるタスクの場合はデコレータを使用すると便利

##### @hosts
```python
from fabric.api import hosts, run
@hosts('host1', 'host2')
def mytask():
    run('ls /var/www')
```
こうするとenv.hostsを一時的に無視するようになる。

##### @prallel
複数のサーバに対してタスクを並列に実行する際に使用する。

##### @with_settings
例
```python
@with_settings(warn_only=True)
def foo():
```

##### @task
タスクは`@task`デコレータで囲ってしまうのがよいらしい。
```python
@task
def mytask()
    run("uname -a")
```
エイリアスの設定もできる。こうすることで、 `fab --list`した時に現れるようになる。
```python
@task(alias='dwm')
def deploy_with_migrations():
    hoge
```
defalutを使用することで、上位のタスクをデフォルトの挙動として使用することができる。例えば
```python
from fabric.api import task

@task
def migrate():
    pass

@task
def push():
    pass

@task
def provision():
    pass

@task
def full_deploy():
    if not provisioned:
        provision()
    push()
    migrate()
```
というfabfile.pyがあった時に`full_deploy()`の上の`@task`を`@task(default=True)`にすることで引数なしで`fab`をするだけで`full_deploy`を行ってくれる。


#### fabコマンド
`fab --list`タスクの一覧を表示

基本的には
`fab task1 task2`
のかたちで使用する。
内部でoptparseライブラリを使用しており、オプションと引数の順番は自由に入れ替えることができる。
fabfile.pyないしはfabfile/の探索メカニズムはvagrantと同様、カレントディレクトリから登っていく形で探す。


`--`を使用するとワンライナーで任意のリモートシェルコマンドを叩くことができる。例えば
```sh
fab -H system1,system2,system3 -- uname -a
```

### cuisine
fabric 単体では冪統制を保証することができない
`pip install cuisine`しておくと便利

### ansible
[ここを参照](http://qiita.com/rasenn/items/d42ed07368ae90605c29)

#### インストール
RHELの場合は
```sh
rpm -ivh http://ftp.riken.jp/Linux/fedora/epel/7/x86_64/e/epel-release-7-5.noarch.rpm   #epelのリポジトリが使用可能になる

yum install ansible
```
Debianの場合は
```sh
deb http://ftp.jp.debian.org/debian wheezy-backports main contrib non-free
apt-get install ansible
```



## 各種パッケージ

---
### 高速化
まずプロファイリングを行ったうえで
優先順位は

1. コーディングレベル
2. 並列処理
3. 言語レベルの高速化(Numpy,Numba,Cython)

#### プロファイリング
[ここ](http://shkh.hatenablog.com/entry/2013/08/16/221205)に詳しい

1. ipytyonの`%time`と`%timeit`を使用する。後者は何回か計算を行って平均をとる。また`%prun`というものもあり、これはcProfileへのショートカットである
2. 関数前後でlog出力する
3. ビルトインのプロファイラを利用する。`python -m cProfile -s time -o outputfile hoge.py`、いろいろ結果が出るが、基本的にはtottimeが大きい関数を高速化すればOK
outputfileはバイナリで、そのままでは見れないので`pstats`モジュールを用いる

```python
import pstats
p = pstats.Stats("ourputfile")
p.sort_stats("time").print_stats(10)
```

ビルトインのプロファイラには`profile`と`cProfile`があるが、基本的には後者でOK
4. yappiを使う
5. line_profileをつかう
5. Benchmarkerを使う


##### cProfile


#### 並行処理

- 高レベルAPI `Twisted`
- 低レベルAPI `pyev`

#### 並列処理
`multiprocessing`でプロセスベースの並列処理
オーバーヘッドが大きいので、十数秒以上かかる処理の時のみ用いること
`Process`クラスのインスタンスを作る方法と`Pool`クラスのインスタンスを作る方法の2種類がある。後者の方が手軽

`multiprocessing.cpu_count()` ... cpuの数を取得

##### Processクラス
インスタンスを複数作成したのち、`start()`すると別プロセスとして起動する。最後に`join`する
```python
import multiprocessing as mp

p = mp.Process(target=my_function_to_paralleize, args=("arg_to_give"))
p.start()
p.join()
```

返り値がほしいときはPoolかQueueを使用する。

##### poolクラス
###### pool.map
mapを手軽に並列化
```python
from multiprocessing import Pool
import math
pool = Pool(processes = 4)  #引数なしなら最大コア数
print(pool.map(math.sqrt, range(10))

pool.close()
pool.join()
```

###### pool.apply_async
forを手軽に並列化

```python
pool = Pool(processes = 4)
list_processes = []

for i in range(10):
    list_processes.append(pool.apply_async(math.paw, (i, 0.5)))

pool.close()
pool.join()
```

##### Queueクラス
`Queue.Queue`とほぼ同じ、並列するプロセス内で`queue.put`するか`queue.get`するかしてデータを扱う。

以下の例がわかりやすい。queueのインスタンスは引数として与えずにグローバルに定義している。

```python
def worker():
    while True:
        item = q.get()
        do_work(item)
        q.task_done()   #joinを用いて、全タスクの終了を待つ場合、これでgetしたタスクが終了したことを明示しなくてはならない。

q = Queue(maxsize=0)    #無限長のキュー
for i in range(num_worker_threads):
     t = Thread(target=worker)
     t.daemon = True
     t.start()

for item in source():
    q.put(item)

q.join()       # 全タスクが完了するまでブロック
```

#### zmq
`multiprocessing.Queue`でクラスタ間の連携も可能なので、こちらを使用する意味はあまりない。


```python
import zmq

def ventilator():
    context = zmp.Context()

    ventilator_send = context.socket(zmq.PUSH)
    ventinator_send.bind("tcp://127.0.0.1:5557")

    time.sleep(1)

    for num in range(10000):
        work_message = { 'num': num }
        ventinator_send.send_json(work_message)

    time.sleep(1)

```

#### 言語レベルの高速化
numpyscipyを使っても早くならないときは
blas,lapack,atlasが入っているか確認する
##### numpy
---
高速な行列演算などをサポートした科学技術計算用のパッケージ
import numpy as np     #npでinportするのが慣例
np.ndarray     #多次元配列を扱うためのクラス。
np.ndarray     #N次元配列を扱うための

```python
import numpy as np
a = np.array([0, 1, 2, 3])
a * 3   #=>array([0, 3, 6, 9])
np.exp(a)   #それぞれをeの指数に直す
```

##### scipy
scipy.sparseで疎行列を扱える
##### Numba
LLVMの基づいたpythonコンパイラ、
`@numba.jit`でデコレートするだけでオッケー
明示的に型を指定したい場合(あまりお勧めしていない)は
```python
@numba.jit("(int32, float32, float64)")
def my_function(x, y, z)
```
以下の文法は使えない
try/except/finaly
with
yield from
list, set ,dict等

##### pyston
同じくLLVMコンパイラ

##### cython

### pythonオブジェクトのシリアライズ
`pickle`を使用する。
高速化が目的ならdillを使用した方が良い。
データの受け渡しが目的ならjsonを使用した方が良い。
よって出番はほとんどない、タプルとバイト列はjsonにはないので、使い道はない


```python
import pickle
with open('outputfile', 'wb') as f:
    pickle.dump(entry, f)
```
こうするとpythonオブジェクトをoutputfileにバイナリで出力する。loadするには
```python
import pickle
with open('outputfile', 'rb') as f:
    obj = pickle.load(f)
```

ファイルではなくメモリ上のbytesオブジェクトにシリアライズすることもできる
```python
b = pickle.dumps(obj)   #bytesクラスのオブジェクトが入る
```


### シェルコマンドの実行(`subprocess`)
`subprocess.call`, `subprocess.check_output`, `subprocess.check_call`のいずれかを使用する。いずれも内部でsubprocess.Popenを使用している

昔は`os.system`を実行していたが、これはサポートされなくなりつつある。例

#### `check_call`, `call`

返り値は終了コードになる。`check_call`の場合、終了コードが0以外ならば`CalledProcessError`をraiseする。

標準出力、標準エラー出力はともに親プロセスとなるpython
VMのストリームに渡される。

```python

import subprocess
cmd = "ls -lt | head -n 5"
subprocess.call(cmd, shell = True) # コマンドはstrで渡す
```

`call(cmd, cwd='/bin')` ... 実行ディレクトリを指定

#### `check_output`

実行結果を取得する事ができる。パイプを用いた処理はできない

```python

cmd = "ls -lt"
ret = subprocess.check_output(cmd.split(" ")) # strではなく配列で与える
print ret   # retの型はstrになる

```

#### `subprocess.Popen`

実行結果を取得しつつ、終了ステータスのチェックも行うなど、より詳細な操作をする際に使用する。

また、`check_output`では標準エラー出力が出ないので、なぜ失敗したのかわからない場合がある、そういう時にも使える

```python

proc = subprocess.Popen('ls', stdout=subprocess.PIPE, stderr=subprocess.PIPE) # インスタンス化した時点で実行が開始される

proc.wait() # 実行が完了するまで待つ

# 出力結果はcommunicate()で受け取る
stdout_data, stderr_data = p.communicate() # でかすぎるデータはメモリを圧迫するので、以下のようにする

for l in proc.stdout:
    print(l)    # コマンドの実行結果は擬似ファイルハンドラとして扱える。よって以下のようにもできる
proc.stdout.read()
proc.returncode # 終了ステータス

```

### `functools`

3.2 以降なら `lru_cache`で簡単に関数の返り値をキャッシュすることができる。

```python

@functools.lru_cache()
def test(x):
    return x**2

```

`test.cache_info()`でどれくらいの値がキャッシュされているかわかる。内部では辞書を使用しているらしく
`lru_cache(maxsize=None)`とすると値を無限に保持できる(デフォルトは128)

### paver
makeとfabricの中間

- `@consume_args` ... 引数をとる
- `@cmdopts` ... オプションをとる

```python
from paver.easy import *

@task[
@consume_args
def hello():
    """my first task"""
    print("hello", args)
```

```
from paver.easy import *

@task
@cmdopts([
    ('foo', 'f', "The foo"),
    ('bar=', 'b', "Bar bar bar"),
    ])
def hello():
    """My first task."""
    print 'hello', options.foo, options.bar
```

### daemon

デーモンを簡単に書けるようにするためのパッケージ

- `DaemonContext`をwith文で使用する
- (`daemon.runner.DaemonRunner`に`run`メソッドを持つクラスを渡す)[http://qiita.com/asdf4321/items/27210be12350050768db]
の2通りがある

```python
import daemon

def daemon_process():
    # 適当な処理…
    while True:
        print("I am working !")
        time.sleep(5)

context = daemon.DaemonContext(
    working_directory="/path/to/workdir",
    stdout = open("hogefile.txt", "w+"),
    stderr = open("stderr_file.txt", "w+")
)

if __name__ == '__main__':
    with context:
        daemon_process

```



### collections
ちょっと使い勝手のいいデータ構造が使える
#### `defaultdict` ... 要素がdictにあれば、その値を1増やし、なければ新たに作る。という処理に使う

```python
from collections import defaultdict
d = defaultdict(int)
s = "abrakadabra"
from collections import defaultdict
for i in s:
    d[i] += 1
```
これだけで`{a: 5, r: 2, b:2, k:1, d:1}`が作れる。defaultdictを使わない場合は
```python
d = {}
s = "abrakadabra"

for i in s:
    if i in d:
        d[i] += 1
    else:
        d[i] = 1
```

#### `Counter`

辞書を継承している
単語などの出現頻度を数えるのに便利

```python
from collections import Counter
count = Counter('aabbccc')
print(count)    #=> Counter({'c': 3, 'b': 2, 'a': 1})
count.most_common(2)   # => [('c', 3), ('b', 2)]
count.most_common()([:-n-1:-1])    # n least common elements

```

通常の`dict`とは、以下の点が異なる。

1. 存在しないキーでアクセスした際に`KeyError`を出す代わりに、1を返す点

#### `ChainMap`

複数の辞書を高速に走査するための型

例：コマンドライン引数、環境変数、デフォルト値の順に名前解決する例

```python

from collections import ChainMap
defaults = {'color': 'red', 'user': 'guest'}

parser = argparse.ArgumentParser()
parser.add_argument('-u', '--user')
parser.add_argument('-c', '--color')
namespace = parser.parse_args()
command_line_args = {k:v for k, v in vars(namespace).items() if v}

combined = ChainMap(command_line_args, os.environ, defaults)

print(combined['color'])
print(combined['user'])

```

探索はチェーン全体に大して行われるが、書き込みは最初のマッピングに対してのみしか行われない。
深い書き込みと削除を望むなら、チェーンの深いところで見つかったキーを更新するサブクラスを簡単に書ける

```python
class DeepChainMap(ChainMap):
    def __setitem__(self, key, value):
        for mapping in self.maps:
            if key in mapping:
                mapping[key] = value
                return
        self.maps[0][key] = value

    def __delitem__(self, key):
        for mapping in self.maps:
            if key in mapping:
                del mapping[key]
                return
        raise KeyError(key)
```

#### `namedtuple`



```python
from collections import namedtuple

Point = namedtuple('Point', ('x', 'y')) # コンストラクタを作成
p = Point(11, y=11) # キーワード引数で指定も可能
Point._make([11, 22]) # 既存のiterableから作る場合

p[0] + p[1]     # 通常のタプルのようにアクセス
x, y = p    # アンパック
p.x, p.y    # フィールド変数のようにアクセス

```

継承すればメソッドを追加することもできる

```python
class Point(namedtuple('PointMixin', ('x', 'y'))):

    def distance(self, p2):
        xdiff = (self.x - p2.x) ** 2
        xdiff = (self.y - p2.y) ** 2
        return math.sqrt(xdiff + ydiff)
```

`csv`や`sqlite3`が返すタプルのフィールドに名前を付けるときにとても便利

```python
EmployeeRecord = namedtuple('EmployeeRecord', 'name, age, title, department, paygrade')
import csv
for emp in map(EmployeeRecord._make, csv.reader(open("employees.csv", "rb"))):
    print(emp.name, emp.title)

```

#### `Enum`

列挙型とも。`namedtuple`に似ている。すべての要素がSingleton

##### いつ使う?

定数の値のセットがあり、それぞれを列挙してアクセスする必要があるような場合。


```python

from enum import Enum

class Color(Enum):
    red = 1
    green = 2
    blue = 3

# または

Color = Enum('Class', 'red green blue')

```



```python

# 要素にアクセスする方法は3通り
Color.red
Color(1)
Color["red"]

# いずれも

```

### PyYaml

`pip install pyyaml`でインストールする
```python
import yaml
```
で使用する。読み込みと書き込みを行える。

### json

標準ライブラリ、jsonのよみかきが行える
`json.load()`で辞書型になる

#### 読み込み

```python
import pprint
f = open('hoge.yaml', 'r')
data = yaml.load(f)
pprint.pprint(data) #いい感じに整形して出力してくれる
f.close()
```
実際には`'r'` ではなく`'rU'`にした方が良い。こちらは改行コードがwindowsでもよしなに計らってくれる。


#### 書き込み
```python
mylist = {'dogs': ['pochi', 'taro', 'kai'],
          'cats': ['shimajiro', 'tyson']}

f = open('out.yaml', 'w')
f.write(yaml.dump(mylist))  # 書き込む
f.close()
```

## argparse
引数処理を行う。最小限の例は
```python
import argparse
parser = argparse.ArgumentParser()
parser.parse_args()
```
こうするだけで`--help`、`-h`が使えるようになる。例えば引数を受け取って、それを標準出力にprintするプログラムの場合
```python
import argparse
parser = argparse.ArgumentParser()
parser.add_argument("echo", help = "echo the string you use here")
args = parser.parse_args()
print(args.echo)
```
これだけで`python <program_name>.py foo`するだけで、fooが標準出力に表示される。helpした時にその説明が出るようになる
デフォルトだと、引数は文字列として受け取る。方を指定したいときは`add_argument`の中で、`type=int`のように型を指定する.他にも`default` などが指定できる

引数の数をコントロールしたい場合は
```python
parser.add_argument(nargs='*')  #任意の数の引数をとる
parser.add_argument(nargs='+')  #1つ以上の引数
parser.add_argument(nargs='?')  #0 or 1
```


例えばCHAINERのexampleでは
```python
parser = argparse.ArgumentParser(description='Chainer example: MNIST')
parser.add_argument('--gpu', '-g', default=-1, type=int,
                    help='GPU ID (negative value indicates CPU)')
args = parser.parse_args()
if args.gpu >= 0:
    cuda.check_cuda_available()
```

ハイフンから始まらないポジション引数の場合

```python
parser.add_argument('integers', metavar='N', type=int, nargs='+',
                    help='an integer for the accumulator')

```

## tempfile

```python
import tempfile
fh = tempfile.TemporaryFile()
fh.write("hogehoge")
fh.close()  #closeすると消える
```
他にも
`NamedTemporaryFile` ... 名前がついてる以外は同じ
`SpooledTempraryFile(max_size = 100000)` ... ファイルサイズが`max_size`を超えるか`fileno()`が呼ばれるまではメモリ上で処理される以外は、同じ

## filecomp
```python
import filecmp
filecmp.cmp("hoge.txt", "fuga.txt") #完全一致ならTrueを返す
filecmp.dircmp()    #directoryならこちら
```

## markdown
```python
import markdown
md = markdown.Markdown()
sample_markdown = '''
Title
======

list
 - hoge
 - fuga

'''

print(md.convert(sample_markdown))
```

## gitpublish
restructuredTextなどをGitでパブリッシュするためのパッケージ

```python
from gitpublish import core
gitrepo = core.GitRepo('/home/miyamoto/mygitproject')

```

## reSTructuredText
`pip install docutils`すると
`rst2html`でhtmlにできる。
`rst2s5`でhtmlスライドにできる

### markdownと違う点

#### 見出し

##### h1見出し

```
========
title 1
========

```
ここで、title1が上下の線より長いと怒られる。

##### h2
下だけ`=`
```
title 2
========
```

##### h3
ハイフンで囲む

```
-------
title 3
-------
```

##### h4
下だけハイフン

```
title 4
-------
```

h5やh6はない
#### ラインブロック
`|`で囲む


\|ここの部分の
\|文章はそのまま
\|生の文字列になる

#### replace

.. |hoge| replace:: ほげ
と書いておくとほかの|hoge|がほげに変換される。いっぱいあるときは、別ファイルに書いておいて

.. include:: definition.txt
とする

#### リンク
#### 外部リンク
markdownと違い、外部参照のリンクはドキュメントの末尾にまとめて書かれる。

ここでのポイントは、..と\_
>`Plone CMS`_ を試してみてください。これはすばらしいですよ！ Zope_ 上に作られています。

>.. _`Plone CMS`: http://plone.org
>.. _Zope: http://zope.org

#### 内部リンク

```
.. _ex-hoge:

---------------
ほげほげ
---------------

このように、章や節の上に記述して定義する。

--------
他の場所
--------

ほげほげに関しては :ref:`ほげほげ<ex-hoge>` として任意のテキストで参照します。

```

#### ソースコードの記述
インラインリテラルは\`\`を2つずつつける必要がある。
`print("hoge")` -> reST中では\`\`print("hoge")\`\`

インラインでない通常のリテラルは::の後に、インデントを入れることで記述可能

>next paragraph is source code::
>               #ここの空白は必須
>    1 + 1

#### テーブル

```
=====  =====  =======
A      B      A and B
=====  =====  =======
False  False  False
True   False  False
False  True   False
True   True   True
=====  =====  =======

```

ただし、これは書くのが難しいのでcsvやListを使用する

```
.. csv-table:: Frozen Delights!
   :header: "Treat", "Quantity", "Description"
   :widths: 15, 10, 30

   "Albatross", 2.99, "On a stick!"
   "Crunchy Frog", 1.49, "If we took the bones out, it wouldn't be
   crunchy, now would it?"
   "Gannet Ripple", 1.99, "On a stick!"


.. list-table:: Frozen Delights!
   :widths: 15 10 30
   :header-rows: 1

   * - Treat
     - Quantity
     - Description
   * - Crunchy Frog
     - 1.49
     - If we took the bones out, it wouldn't be
       crunchy, now would it?

```

### ディレクティブ
Sphinx拡張のものと、rst標準のものがある

#### 目次

.. contents::

#### toctree
章や節に番号を振りたいときは
.. toctree::
   :maxdepth: 2
   :numbered:

   overview
   design
   implementation

#### 画像
.. image:: gnu.png
で画像を表示できる。`gnu.png`のところは、rstファイルからの相対パスや絶対パスも指定できる。
html出力すると、`_static`のようなディレクトリにコピーされる。

#### 引用
Sphinx拡張の機能

This Idea is originally from [Ref]_

.. [Ref] Book or article reference or url


#### TODO
```
.. todo:: ブロック図を描く

.. todolist::   #文書中の全てのTODOリストを集めて表示
```

## Sphinx
SphinxはreSTから以下の形式のドキュメントを出力するプログラム

- html
- man
- ePub
- laTeX
- PDF ... 拡張機能
- docx ... 拡張機能

### インストール
`sudo apt-get install python-sphinx`

### 始める
`sphinx-quickstart`,以下のディレクトリとファイルを作成する

- Makefile
- _build
- _static ... CSSとか？
- _templates　… htmlテンプレートの置場
- conf.py ... 設定ファイル。拡張モジュールのpathや言語の設定などをかける。
- index.rst　...　ソースファイル
- make.bat
途中で言語を聞かれるがjaを選択する

`make latex`,`make latexpdf`、`make html`等でrenderする.詳細は`make help`で

### テーマの変更
Sphinx組み込みのテーマなら簡単。
```
html_theme = "classic"
html_theme_options = {
    "rightsidebar": "true",
    "relbarbgcolor": "black"
}
```
詳しく[こちら][http://docs.sphinx-users.jp/theming.html#using-a-theme]

### Sphinx拡張
下で書いているもの以外にもdocstringをドキュメント中に組み込んだり、Graphviz、継承関係図、カバレッジなどを取り込むことができる
#### sphinx.ext.todo
rstファイルの中で
`.. todo::`という記法でtodoを作成できる
`.. todolist::`ディレクティブを使用すると、ドキュメント内のすべてのTODOをリストにして表示する

#### sphinx.ext.jsmath、Sphinx.ext.pngmath
それぞれjsMath(Java
script)、dvipngを利用して数式を表示する
*現在はjsmathではなく、mathjax*を使う

#### mathjax

`.. math::`ディレクティブを使用できるようになる。その中ではlatex記法で書く。例

```rst
.. math:: e^{i\pi} + 1 = 0
    :label: euler

.. math::
    :label: quite

    (a + b)^2 &= (a + b)(a + b) \\
              &= a^2 + 2ab + b^2
```

:label:を付けると、数式にラベルと数式番号を付けることができ、:eq:を用いて参照することができる。例 :eq:\`euler\`

#### plnatuml
uml図が作れる


#### S6
スライドショーが作れる

#### sphinx.ext.inheritance_diagram
継承関係図を表示

## Web Application Flamework

### Flask

Django, Pyramid などと比べて軽量なフレームワーク
