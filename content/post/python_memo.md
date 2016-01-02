+++
Categories = ["hack", "memo"]
Description = "Memo for python"
Tags = ["Bioinformatics", "python"]
date = "2015-12-30T15:45:36+09:00"
title = "pythonメモ"
draft = false

+++

## 基本事項

`print('hello,world!')` ()でくくらないとpython3ではエラーになる。


### 組み込み型

#### dictionary

perlで言うハッシュ

```python
d = {'a' : 'apple', 'b' : banana, 'c' : orrange}

#keyの値を取得
for k in d:
	print k
#keyとvalueの両方を取得
for k, v in d.items():
	print k, '-->', v
```
keyとvalueの候補が既にjリストで存在する場合は以下のように`izip`で簡単に結合できる

```python

names = ['a', 'b', 'c']
fruits = ['apple', 'banana', 'orrange']
d = dict(izip(names, colors))

```

#### list

perlでいう配列、`[]`内に複数の要素を書くことで作成する。
```python
mylist = ['A', 'B']
mylist.append('C')	#Cを追加
mylist.extend(['D', 'E'])	#別のリストと結合
mylist = mylist + ['D', 'E']	#同上
```
`append`で複数項目のリストを追加すると、リストの中身ではなくlistオブジェクトそのものが追加される

### 繰り返し
for文は
```python
for i in [1,2,3,4]
     print i**2
```
リストの部分は`range(4)`で書く場合が多い、音が多いがiの値が大きいとメモリを食うので
`xrange(4)`
がベター、`python3`では`range`が`xrange`と同じ働きをする。

逆順にループするときは
```python
colors = ['red', 'green', 'blue', 'yellow']
for c in reversed(colors):
	print c
```

要素番号も取得したいときは
```python
for i, color in enumurate(colors):
	print i, '-->', color

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
たまにモジュールのソースコードに以下のような一文が書かれている場合がある。
```python
if __name__ == '__main__':
```
`__name__`はそれが存在するモジュールの中の名前になる。`__main__`というのは対話環境(Rで言う.Globalenv?)で呼ばれたときの値。
上のように書いておくことにより、そのモジュールがメインモジュール(最初に呼ばれたモジュール)である時にのみ実行する内容にできる。詳しくは[こちら](http://jutememo.blogspot.jp/2008/08/python-if-name.html)

### 文字列操作
文字列型への返還は
`str()`か`repr()`を使用する。前者は人にやさしい表現に直し、後者は内部実装に近い見た目を返す。
```python
str(0.1)	# => '0.1'
repr(0.1)	# => '0.10000000000000001'
```
pythonには`printf`がない。書式を指定する場合は以下のようにする
```python
'%d %o %x' % (100, 100, 100)	# => '100 144 64'
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

#### 文字列型組み込み関数

```python
src = 'I like orange.'
src.replace('orange', 'apple')
```

#### 正規表現


`re`を使用する
コンパイルして、patternオブジェクトを作ってから、match,search,findall,finditer,の4種類を使う。
- `match` ... パターンが先頭にある場合にマッチする
- `search` ... 全部探す。複数マッチの場合でも、最初の1つしか返してくれない
- `findall` ... マッチした部分をすべて配列で返す
- `finditer` ... マッチした部分をイテレータで返す。

マッチした結果を適当な変数に入れたら、`group()`,`start()`,`end()`, `span()`で処理できる

- `group` ... マッチした文字列を返す
- `start` ... マッチの開始位置を返す
- `end` ... 終了位置
- `span` ... 開始位置と終了位置

例
```python
import re
pattern = re.compile(r'3.*?7')
pattern.match(text)
if matchObj.group():
    print(matchObj.group())
```
`group`
で後方参照を行うこともできる
```python
pattern = re.compile("GCC(.+)TATTT(.+)TTTC")
m = pattern.search(<対象となるDNA文字列オブジェクト>)
if m:
    print(m.group(0))
    print(m.group(1)
```

正規表現による置換はre.subを用いる。Rのgsubとほぼ同じ。後方参照による置換の例

```python
pattern = re.compile("X(.)X")
dna_mod = pattern.sub(r"C¥1C", <DNA文字列オブジェクト>)
```
文字列にrawを使用しているのがポイント

### 入出力
#### ファイル操作
ファイルを開くときはwith構文を使用する。書き込みの例
```python
with open("filename", "w") as file:
	file.write("some string")
```
with構文を使用すると、クラス内で`__enter__`および`__exit__`を使用したクラスの場合,メソッド呼び出し前と呼び出し後にそれぞれを実行してくれるようになる
例

```python
import sys
with open("mydata.txt") as m:
    with open("outputfile.txt", 'w') as outfh:
        for line in m:
            itemList = line[:-1].split("\t")
            if itemList[0] == 'hoge':
                print(itemList[1], file = outfh)


```

`line.strip()`でも改行は削除されるが、空のタブも削除されるため、tsvファイルを扱うには適していない。

一行ずつではなくまるごと読み込みたいときは
`allLines = open('foo.html').read()`

#### 標準入力からの取得

```python
import sys
    for line in sys.stdin
    print line,
```
,をつけることで改行をしなくなる。python3の場合は
`print(line, end = "")`とする。また、
```python
f = open('foo.txt', 'w')
print('hello world', file=hoge.txt)  #ファイルに出力
print("hello world", file=sys.stdout)    #標準出力に出す
```


#### コマンドライン引数の取得
```python
import sys
argvs = sys.argv	#argvsにはコマンドライン引数のリストが入る
argc = len(argvs)
```

#### ディレクトリ操作

```python
import os.path

myfile = 'Users/user/Document/test.txt'
os.path.dirname(myfile)   #Users/user/Dockument
os.path.basename(myfile)    #'test.txt'
os.path.abspath('test.txt') #絶対パスを返す
os.path.exists(myfile)  #True
os.path.isdir(myfile)   #True

###スクリプト名を取得
import sys
print(__file__)  #実行時カレントディレクトリからの相対パスを取得
print os.path.abspath(os.path.dirname(__file__))  #スクリプトのあるディレクトリへの絶対パス
```
`import os`や`import shutil`すると
OSにかかわらずディレクトリの削除やコピーなどができるみたい


### 正規表現でファイルを探す

```python
import glob
glob.glob('*.txt')  #['hoge.txt', 'huga.txt']

```

## 関数定義

---
引数に*を付けると任意の数の引数をリストで受け取ることができる。
```python
def one(*args)
	print args
one()	# => one(1,2,3)
```
アスタリスクを2個にするとリストではなく辞書で受け取る。

アスタリスクが1つの場合も2つの場合も関数に引数を渡すときにすべて一気に渡すための構文が用意されている。例
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
result = myfunc()	#myfunc()の実行結果がはいる
myfunc2 = myfunc	#myfuncが複製される。(リファレンスではないので、myfuncを削除してもmyfunc2は残る。)
```

### lambda式
`lambda x: x + n for n in range(5)`
とすると、ｎのスコープが関数内に限定されず、以下のように変なことになるので、
`lambda x n=n: x + n for n in range(5)`
とする

```python

funcs = [lambda x: x+n for n in range(5)]
for f in funcs:
... print(f(0))
...
4
4
4
4
4

```

## OOP、スコープ

---
`__init__`がコンストラクタ
```python
>>> class Coordinate(object):
...     def __init__(self, x, y):
...         self.x = x
```

`locals()`で名前空間内(多くの場合は関数内)のすべての値を辞書形式で返す。例
```python
def foo(arg):
	x = 10
	print locals()

foo(20)	# => {'x' : 10, 'arg' : 20}
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
	def test_to_values(self):	#メソッド名はtestから始まっていなくてはならない
		for integer, numerical in self.values:
		result = roman1.to_roman(integer)
		self.assertEqual(numerical, result)	#TestCaseクラスのメソッド

if __name__ == '__main__':
	unittest.main()

```
テストを実行する際は -v オプションを付ける。
`assert*`メソッドにはいろいろある。[こちら](http://surgo.jp/2011/12/python-or-unittest2.html)を参照

このケースだと、例外処理が不十分である。つまり、以上に大きい値が`to_roman`に与えられると、`"MMMMMM"`のような値が返される可能性があり、これは喜ばしくない。`to_roman`は3999以上の値はエラーを吐くようにしたい。こういった場合は`assertRaises`メソッドを使用する。

```python
class ToRomanBadInput(unittest.TestCase):
	def test_too_large(self):

		self.assertRaises(roman1.OutOfRangeError, roman1.to_roman, 4000)

```

このようなテストを書いたら、roman1.pyにOutOfRangeErrorを追加する。
```python
class OutOfRangeError(ValueError):
```

unittestのメソッドには3つの返り値がある

- Pass ... テストに成功した
- Fail ... テストに失敗した
- Error ... コードを実行できなかった。

## 例外処理
例外を補足するには`try: except:`節を利用する

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
でもほんとは適切なエラークラスを指定すべき

以下にエラークラスの種類を示す

- BaseException ... 全ての例外のベースクラス
 - Exceprion ... 実行中のアプリケーションを終了させない例外のベースクラス。ユーザー定義の例外はこれをベースをすべき
 - StandardError ... よくわからん
 - ArithmeticError ... 数値関連のエラー
 - LookupError ... 何かを発見した時に発生させるエラー
 - EnvironmentError ... pythonの外部から発生するエラーのためのベースクラス

より細かい区分は[ここ](http://ja.pymotw.com/2/exceptions/)を参照

### 型のチェック
`isinstance(n, int)`のようにして行う。例

```python
if not isinstance(n, int):
	raise NotIntegerError("Please give me Integer value!")
```


---
matplotlib

## logging
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

## バージョンの違い、処理系

---
`from__futute__import division`
とすることで、python3の整数除算の挙動をpython2に取り入れることができる。
pypy…pythonインタプリタだがそれ自体pythonで記述されている。RPythonで書かれている。
### python自体のバージョン管理
python2,3を共存させたいような場合は`pyenv`が便利
`~/.pyenv` に`git clone http:\\github.com/yyuu/pyenv.git`したものを入れる。
`git clone https://github.com/yyuu/pyenv.git ~/.pyenv`
`git clone https://github.com/yyuu/pyenv-virtualenv.git ~/.pyenv/plugins/pyenv-virtualenv`

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

- `pyenv versions` ... 現在のpythonのバージョンを見る。
- `pyenv versions` ... 使用可能なvirtualenvの一覧を見る。
- `pyenv install -l` ... installできるものの一覧
- `pyenv exec pip install --upgrade pip` ... pipを最新にする
- `pyenv virtualenv 2.7.10 my-virtualenv-2.7.10` ... 新しいvirtualenvの作成。
作成したvirtualenvは$PYENV_ROOT/versions/ に入る
- `pyenv uninstall my-virtualenv-2.7.10` ... 削除
- `pyenv global my-virtualenv-2.7.10` ... システム全体で切り替え。
- `pyenv local my-virtualenv-2.7.10` ... カレントディレクトリのみ切り替え

### anaconda
数値計算用のパッケージなどがセットになったpythonのディストリビューション


### Rpython
Rpython…pythonにいくつかの制限を加える代わりに高速化したもの


## 他言語との連携
### R
昔はRPy2が使用されていたがいまではPypeRが主流

## パッケージ管理
pyenvが便利？

---
pipのインストールは
```bash
sudo apt-get install python-pip pythondev build-essential
```
で行う。
`pip -U install fabric`Fabricのインストール
-Uオプションはすでにインストールされている場合アップグレードしてくれる

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

from distutils.core import setup

setup(name='Distutils',
      version='1.0',
      description='Python Distribution Utilities',
      author='Greg Ward',
      author_email='gward@python.net',
      url='http://www.python.org/sigs/distutils-sig/',
      packages=['distutils', 'distutils.command'],
     )
```

#### Manifest.inについて

```python
include hoge	#rootディレクトリのhogeという名前のファイルを配布物に含める
recursive-include huga *.html *.css	#rootディレクトリ以外でも、その名前のファイルがあれば含める。
```


## 構成管理

---
fabric -> ansibleへと移るのが吉
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
- `prompt()`	... ユーザーからの入力を受け付ける
- reboot()	... 言わずもがな

#### fabric.contrib

- `console.confirm("Message", default = False)`　 ... ユーザに[y/N]での確認を促す。promptの制限版


fabfile.pyという名前で保存し、`fab`コマンドで実行
```sh
fab -H <server_address> show_uname
#or
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

`fabfile/`ディレクトリを作ってやり、その中に任意の.pyファイルを入れてやれば、それを実行できる
taskで分割するときは
```python
from fabric.api import task

@task
def restart():
	pass
```

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
env.hosts =['my_server']	#デプロイ先のアドレスを指定。(リストなのでいくつでもよい)
```
よく使われるものには以下がある
- `env.user` SSH接続するときのデフォルトユーザ名は自分のローカル名だが、これを設定すると上書きできる
- `password`sudoや接続のパスワードを設定する。特に指定しなければ必要になったタイミングで聞いてくるらしい
- `warn_only`エラーを検知した時に実行を停止しないか否か。デフォルトはfalse。たいていの場合はenvでグローバルに設定せず,`with settings(warn_only = True)`の形で指定する。あるいはデコレータ(後述)で指定してもOK
- `env.roledefs`複数のホストを役割ごとにまとめるために使用する。例
```python
env.roledefs = {
	'web' : ['www1', 'www2', 'www3']
	'dns' : ['ns1', 'ns2']
}
```
- `env.config_file`設定を書いたyamlのパスを指定する。fabfile内に`env.config_file = 'deploy.yaml'`と書いておくと、`env.config.<yamlの要素名>`の形で参照できるようになる。

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

#####@with_settings
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

### ansible
[ここを参照](http://qiita.com/rasenn/items/d42ed07368ae90605c29)

#### インストール
RHELの場合は
```sh
rpm -ivh http://ftp.riken.jp/Linux/fedora/epel/7/x86_64/e/epel-release-7-5.noarch.rpm	#epelのリポジトリが使用可能になる

yum install ansible
```
Debianの場合は
```sh
deb http://ftp.jp.debian.org/debian wheezy-backports main contrib non-free
apt-get install ansible
```

## 各種パッケージ

---
### PyYaml
`pip install pyyaml`でインストールする
```python
import yaml
```
で使用する。読み込みと書き込みを行える。
#### 読み込み

```python
import pprint
f = open('hoge.yaml', 'r')
data = yaml.load(f)
pprint.pprint(data)	#いい感じに整形して出力してくれる
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



## 可視化

---
bokeh…可視化のライブラリ
seaborn。。。matplotlibに基づく可視化のライブラリ

## numpy

---
高速な行列演算などをサポートした科学技術計算用のパッケージ
inport numpy as np     #npでinportするのが慣例
np.ndarray     #多次元配列を扱うためのクラス。
np.ndarray     #N次元配列を扱うための

## 作図
