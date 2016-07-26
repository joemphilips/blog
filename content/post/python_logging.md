+++
Categories = ["hack", "memo"]
Description = "Memo for python"
Tags = ["Bioinformatics", "python"]
date = "2015-12-30T15:45:36+09:00"
title = "pythonのロギングに関するメモ"
draft = false

+++

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

