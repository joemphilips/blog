---
categories: ["hack", "memo", "web"]
date: 2017-05-11T20:08:34+09:00
description: "memo for learning MEAN stack"
draft: false
tags: ["javascript", "web"]
title: "MEAN stack(mongodb, express, angular, express)関連のメモ"
---

# mongodb




# node.js

## Logging

### `console` を利用したlogging

* `console.log()` ... 標準出力に出す
* `console.error()` ... 標準エラー出力に出す

### `debug` moduleを使用したlogging

```
const debug = require("debug")("my-namespace")
debug("hogehoge is %s", hogehoge)
```

こうしておくと `DEBUG` 環境変数がsetされた時のみ出力される。

namespaceを指定することで、自分の書いた部分だけが出力されるようになる。
複数出力する場合は

```
DEBUG=my-namespace,express* node app.js # 自分で書いた分と、expressで出す分の両方を出力
```

### `winston` を利用したlogging

```js

const winston = require('winston');
const getLoggerSettings = (consoleLog) {
  const settings = {
    transports: [
      new winstron.transports.File({filename: 'winston.log', json:false})
    ],
    exceptionHandlers: [
       new winstron.transports.File({filename: 'winston.log', json:false})
    ]
  };
  if (consoleLog) {
    settings.transports.push(new winston.transports.Console({colorize: true, timestamp: true, level: 'silly'}));
    settings.exceptionHandlers.push(new winston.transports.Console({colorize: true, timestamp: true, level: 'silly'}));
  }

  return settings;
};

const logger = new (winston.Logger)(getLoggerSettings(true));
logger.error('error!')

```

#### Transaports

ログの出力先。デフォルトは `Htpp` , `Console` , `File` の３つ

#### ロギングレベル

ロギングレベルには、

1. node.js準拠のもの（デフォルト） ... `{ error: 0, warn: 1, info: 2, verbose: 3, debug: 4, silly: 5 }`
2. RFC5424準拠のもの ... `{ emerg: 0, alert: 1, crit: 2, error: 3, warning: 4, notice: 5, info: 6, debug: 7 }`

の２種があり `winston.setLevels(winston.config.syslog.levels);` か
 `logger.setLevels(winston.config.syslog.levels);` で変えることができる。


### `morgan` を利用したlogging
