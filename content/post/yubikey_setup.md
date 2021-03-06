---
categories: ["hack", "secutiry", "device"]
date: 2016-09-20T00:46:15+09:00
description: "use yubikey to manage secutiry problems"
draft: false
tags: ["yubikey"]
title: yubikeyでセキュリティ筋力を鍛える
---

# motivation

仕事柄秘匿性の高い情報を扱うことが多いのだが、色々と困ったことが発生する。例えば

* いろいろなサイトでランダムに生成したパスワードを用いているが覚えきれない。
* 職場のPCに秘密鍵をおいているが流出が怖い
* 職場のサーバのアクセス権限を一時的に同僚に渡す必要が発生

などである。Yubikey Neoを使用するといい感じになるという噂を聞いたので、勉強も兼ねて導入する。

以下をやっていく。

1. Github、Bitbucket、Google account、bitcoin web walletの認証をFIDO U2Fを使用した2段階認証にする。
2. awsのadmin認証をOATH OTPで行う
3. PAM認証を使用してローカルの端末へのログインにYubikeyが必要なようにする。
4. sshでの接続をYubikeyで制限する。
5. YubikeyをPIVカードとして使用し、秘密鍵の一元管理を行う。
6. パスワードを暗号化して管理する。
7. アクセサリにする。

やっていく(気持ち)

# yubikeyとは

以下のような見た目で

<img src="/images/yubikey/yubikey1.png">

大きく以下の種類がある。

1. Yubikey .... OATH OTPのみ
2. Yubikey Neo ... OTPとU2Fが使用できる。OTPは更にYubikey OTPとOATH OTPの違いを選択することができる。他にもいろいろ機能がある。後述
3. Yubikey NEO-n ... Yubikey Neoと同じだが、サイズが小さい。

全てに共通する機能はOne Time Password(OTP)の生成のみ。
また

1. FIDO U2F Special Security Key

というものもある。これはFIDO Universal 2nd Factor(U2F)での認証に特化している。安い

#### One Time Password と U2Fの違いについて

「秘密鍵やパスワードでは流出が怖いので、ハードウェアの有無を認証に使用する」というモチベーションはいずれも同じ。

後者は専用のハードウェアが必要な代わりに中間者攻撃や端末自体の脆弱性に強い。前者はソフトウェア上でのパスワードを発行するだけなので導入が簡単。という点が違う。前者の例としてはGoogle Authenticatorなどがある。

潮流としては

OTP -> FIDO U2F -> 生体認証

と移行していく感じっぽい。[こちら](https://yubikey.yubion.com/blog/20160203/)を参照

FIDOには1.0と2.0があるが、後方互換製があるので、ユーザーとして利用するだけならば気にする必要はない。

# yubikeyの基本的機能

## Yubico One Time Password(OTP)の生成


接続するとOS側からは通常のUSB接続のキーボードと認識されるため、OTPの利用だけならば新たにドライバをインストールする必要はない。

接続したのち、ボタンに触れると謎の45文字くらいの文字列が入力される。

これは

1. 内部のタイマー
2. デバイス固有の値
3. ランダムな数(どうやって生成してるのかはよくわからない)

から生成したバイト列を128bitのAES共通鍵で暗号化したものを文字列として出力している。

通常はこれをリモートに送信し、128bitのAES共通鍵で復号化して認証に用いる。

文字列はキーレイアウトに関係なく出力できるような文字種だけを用いているので、日本語キーボードでも安心。

## Yubikey NEOの機能

* OTP ... one time password
 * yubico OTP ... 上述
 * OATH HOTP  ... 毎回リセットされる6,または8桁のパスワード[RFC4226](https://tools.ietf.org/html/rfc4226)を参照。
 * OATH TOTP  ... 30秒ごとにリセットされる6,または8桁のパスワード。
* FIDO U2F ... 2段階認証
* PIV mode ... PIV cardというのは米国公務員が持ち歩いている身分証明カードの規格。それと同じように使用できるようになる。
* OpenPGP での電子署名
* challenge and responce ... 後述。大きく以下の2つがある。
 * Yubico OTPでの認証
 * HMAC-SHA1での認証
* static password ... ハード固有の38桁の値を生成、legacy system以外には用いるべきではない。

### 詳細

Yubikey NEOはslot1とslot2があり、任意の機能をそれぞれのスロットに当てはめることができる。key表面のボタンを短時間(`0.5~1s`)押すとslot1が呼び出され、長時間(`2~8s`)押すとslot2の機能を使用することができる。

デフォルトではslot1にはOTPのためのパスワード生成機能が入っており、slot2は空

また、slotとは別にmodeというものもあり、デフォルトでは`OTP+U2F`となっている。

PGPの鍵を埋め込みたい場合は`yubikey-neo-manager`をインストール後、`neoman`コマンドで変更する必要がある。

### challenge and responce について

challenge and responceによる認証は以下の2つがある。

| 認証方法   | pro             | con                                                                                             |
| :--        | :--             | :--                                                                                             |
| Yubico OTP | 安全            | 自身でサーバを立てるのは面倒。YubiCloudを用いればその必要はないが、向こうを信用する必要がある。 |
| HMAC_SHA1  | offlineでもOK。 | セキュリティ面はあまり向上していない?                                                           |

#### YubiCloudについて

2段階認証の必要なWebサービスを作る際に使用する。

[公式](https://www.yubico.com/products/services-software/yubicloud/technical-description/)より拝借した図

<img src="/images/yubikey/YubiCloud-Technical-Description-602x369.png">

[各種言語のAPIクライアントはこちらから](https://developers.yubico.com/OTP/Libraries/List_of_libraries.html)

[yubico 公式からAPI key](https://upgrade.yubico.com/getapikey/)を取得して使用する。

yubicoを信用できない場合は[自分でサーバーを立てることもできる](https://developers.yubico.com/Software_Projects/YubiKey_OTP/YubiCloud_Validation_Servers/)。[docker image](https://github.com/mvisonneau/docker-yubikey-validation-server)もあるっぽい

#### HMAC-SHA1 での認証について

適当なパスフレーズとYubikeyのハードウェア固有値をハッシュ関数のインプットにして、出力を鍵として用いる。

一見両方が必要そうで安全に見えるが、パスフレーズが盗まれるリスクと、ハッシュ関数の出力結果が盗まれるリスクがそんなに変わらないので、あまり意味がないような気も。

タイピングするところを見られても大丈夫。というくらいのメリットか。

# 導入

ubuntu 16.04で行った。

まずはyubikey自体の設定に必要なソフトウェアを入れていく。

```
sudo add-apt-repository
ppa:yubico/stable
sudo apt-get update
sudo apt-get install yubikey-personalization yubikey-neo-manager
sudo apt-get install yubikey-personalization-gui

```

また、pam認証に必要なパッケージも同様に入れる。

```
sudo apt-get install libpam-yubico libpam-ssh libpam-u2f
```

すべてOSSとして開発しており、[こちら](https://github.com/yubico)に存在する

## 1. OTP認証

OTP生成の設定は[公式のチュートリアル映像](https://www.yubico.com/products/services-software/personalization-tools/oath/)がわかりやすい

[ベストプラクティスはこちら](https://www.yubico.com/wp-content/uploads/2016/02/YubicoBestPracticesOATH-HOTP.pdf)


### awsでの設定

2016/09 時点で、awsはU2Fでの認証に対応していないので、yubikeyでの[OATH-HOTP](https://en.wikipedia.org/wiki/HMAC-based_One-time_Password_Algorithm)を用いる。。。

と思ったのだが、情報が足りなくて断念。調査の末

1. 後述するPIV modeで秘密鍵をストア
2. スマホで2段階認証

が最もセキュアかと判断。というわけで普通にGoogle Authenticatorを設定した。

## 2. U2F authentication

### github

#### 基本設定

まずはTOTPの設定をして、その後U2Fにアップグレードする。後者は現在のところchrome経由でしか使えない。

githubのアカウントsetting -> security -> Two-factor authenticationで指示に従ってGoogle authenticatorの設定をする。

最後まで行くと最下部にSecutiry keysという名の項目があるのでそれをクリックすると「お手持ちのU2Fデバイスのボタンを押してください」と言われるので押す -> 完了。


簡単!!

#### コマンドラインの設定

gitのコマンドラインでsshかgitプロトコルを用いている場合は変更の必要はないが、httpsを用いている場合(プロキシ環境下だとありがち)、そのままではgithubとのやり取りができなくなる。パスワードの代わりに[personal access token](https://github.com/settings/tokens)を利用することで問題なく通信できる。ローカルに毎回access tokenを打つのは面倒なので、以下のようにしてキャッシュを指定しておく。

```
git config --global credential.helper cache # linux の場合
git config --global credential.helper osxkeychain # os Xの場合
```

(疑問: OAuthは3rd partyに限定された権限を与えるためのプロトコルのはずなのに、こういう風にフルアクセスの権限を自分で取得するために使用するのは本末転倒ではないのか？SSH・gitプロトコルを使用しろということ？教えて偉い人)

### google account

github以上に簡単だったので省略

### bitbucket

#### 基本設定

githubとほぼ同じだったので省略。

#### コマンドラインの設定

bitbucketの場合はpersonal access tokenが存在しないためOAuthコンシューマキーを

`https://bitbucket.org/account/user/<ユーザー名>/api`

から取得するのだが、callback urlが必要なところを含め、CLIでの利用ではなくサービスのための利用を前提としている様子。おとなしくsshで接続しろということか


### bitcoin wallet

[blockchain.info](https://blockchain.info/)ウェブウォレットの場合、google accountや、githubと同じように簡単に２段階認証にできる。

ハードウェアウォレットとして使う場合、後述のPIV modeで秘密鍵をストアする。が、今のところはウェブウォレットを信用することにする。

## 3. localのpam認証

### はじめに

YubiKeyでローカルの端末をロックする場合、大きく2種類のケースがある。

1. 自分しか使わない端末へのロック
2. 共用サーバやデータベースのロック

いずれにせよセキュリティの向上という観点からはあまり意味がないが、下記の3点のメリットがある。

1. デスクトップのpasswordを覚える必要がなくなる
2. keyboard にタイピングする必要がなくなるため目で見てバレることがない。
3. 権限を分割管理することで、より安全性が増す(sudoするにはYubikeyが要る。といったふうにするなど。)

結局、ローカルの設定は自分にとって意味がないとわかったのでここでは行わないが、pamとの連携はsshと共通する部分があるので、以下にやり方をメモる。

### 多人数で使用する端末の場合

共用のサーバにおいて、特定の操作に関してのみKeyを必要とさせたい。といった状況ならば、Yubikeyをpamに関連付けるのは有用になりうる。

まずはユーザーのIDと、yubikeyのIDを対応付ける必要がある。2種類の書き方があり、相互排他的

1. rootユーザーによって決められるcentral mapping
2. それぞれのユーザーがhome以下に記述するmapping

#### central mapping

まず、yubikeyの使用を行うユーザーの登録を行う。

`/etc/yubikey_mappings`を作成し、

```
<username>:<yubikey token ID>:<yubikey token ID2>
```

の形式で記述する。ここでtoken IDとはYubikeyのOTP(短時間タッチした際に出てくる文字列)の先頭12文字

例えばyubikeyがないと`sudo`できないようにしたい場合は`/etc/pam.d/sudo`に

この操作は、最悪rootになれず死ぬ可能性があるので、端末のうちの一つを予めrootにした状態で行うのが吉。

#### user defined mapping

`~/.yubico/authorized_yubikeys`に同様の形式

```
<user name>:<yubikey token ID>
```

で記述する。

#### 認証設定の記述

`/etc/pam.d/`以下にある、認証を必要とするソフトウェアに設定を記述する。

今回はloginにのみYubikeyを要求するようにしたいので、
`/etc/pam.d/login`に

```
auth sufficient pam_yubico.so id=[Your API Client ID] debug
```

を記述しておく。


## 4. ssh接続の制限

「yubikeyでsshする」と言った場合、実際には2種類の可能性がある。

1. sshd側の設定でYubikey認証をオンにする。
2. yubikeyに登録した秘密鍵を用いて認証する。

### sshdにYubikey IDをチェックさせる。


sshdがpamの設定を使用していることを確かにするため、`/etc/ssh/sshd_config`を編集して`UsePAM yes`を書き込み、再起動する。

Yubico OTP を利用するため、オンライン環境でないと不可能な認証方法であることに注意。オフラインで使用する場合はHMAC-SHA1などを用いる

[yubico 公式からAPI key](https://upgrade.yubico.com/getapikey/)を取得する。

`/etc/pam.d/sshd`を編集して以下の一行を加える。

```
auth required pam_yubico.so id=<id number> debug authfile=/path/to/mapping/file
```

ここで`<id number>`は公式から取得したAPI鍵で、`/path/to/mapping/file`は上述のユーザー名とYubikeyのIDとのマッピング。

あとはsshdを再起動。

### PIV内の秘密鍵を認証に用いる。

https://blog.josefsson.org/2015/06/16/ssh-host-certificates-with-yubikey-neo/

`gpgkey2ssh`を用いる。
`gpg --card-status`で、内部秘密鍵のIDが見れるので、

```

gpgkey2ssh <秘密鍵のID>

```

でSSH公開鍵が手に入る

続きは[こちら][gpgmemo]と同じ。

## 5. PIV mode

piv modeで使用するにあたっては、yubikey自体の仕様の前に[PGP](http://www.wakayama-u.ac.jp/~takehiko/pgp.html)についてよく理解している必要がある。[こちらに書いた][gpgmemo]

[結城浩さんの暗号技術入門](http://www.hyuki.com/cr/)もよく読んで理解しておこう。(この本、以前はセキュリティ関係者の必読書だったが、最近は全IT関係者の必読書になりつつある印象。そのうち義務教育で教えることになりそう。)

piv cardはCCID(Chip Card Interface Device)と呼ばれるプロトコルを介して接続される。これはUSB接続だけでセキュアなやり取りをするための規格

以下の４つ(Yubikey 4の場合は24つ)のスロットに対応する機能が入る。これはYubikeyの仕様ではなく[PIVの仕様](http://csrc.nist.gov/groups/SNS/piv/standards.html)

* 9a ... PIV Authentication (認証)
* 9c ... Digital Signature (署名)
* 9d ... Key Management (`gpg2 --card-status`で確認)
* 9e ... Card Authentication

PIVとして使用する場合、はじめにyubikey NEO ManagerからCCIDmodeをオンにしておく必要がある。

### modeの設定

Yubikey NEOには、3種類のmodeがある。PIV

1. 0x80 ... 通常のYubikeyと同様。OTPのみのmode
2. 0x81 ... OpenPGP CCID only mode. smart cardとしては使えるが、OTPには使えない。
3. 0x82 ... OTP, PIVの両方で使用できるモード

とりあえず3にしておく。

`ykpersonalize -m82`

### PIV card としての初期設定

専用のマネージャソフトをインストール

```
sudo apt install -y yubico-piv-tool \ # cli tool
    yubikey-piv-manager # gui tool

```


```

sudo apt-get install -y gnupg2 gnupg-agent pinentry-curses scdaemon pcscd yubikey-personalization libusb-1.0-0-dev

```


GUIで立ち上げると初回は以下のような画面が出てくる。

<img src="/images/yubikey/PIV_manager.png">

~~なんだか使いづらかったので今回はCLIで行っていく~~
GUIのほうが楽でした。

まずは状態確認

```
yubico-piv-tool -a status # 状態確認
gpg --card-edit # gpg側から見た状態
```

manを見ると使用可能なslotとactionの一覧が見れる。

適当なパスワードをPINにして初期化する

```
yubico-piv-tool -a change-pin # pinを変更(初期値は123456)
```

### PINの仕様

ややこしいことにpiv cardには3種類のパスワードがある。

* PIN ... ユーザーレベルのパスワード。
* PUK ... rootレベルのパスワード。
* management key ... 24byte 3DESのkey

#### PINのみで管理する。

本来management keyは鍵の生成や証明書のimport時に必ず必要になるが、YubikeyではPINをそれらに用いることができる。その場合、技術的理由(詳細不明)からPUKはblockされ、使用不可になる。

組織のIDとして使用する場合、PINとPUKを分けるというケースがありうるっぽいが、個人で使う場合はあまり区別に意味はないので、Management keyとPINは同一のものを用いるとよい。

その場合、考慮しなくては行けないことが2点ある。

1. 実際のmanagement keyはPINから自動的に生成したものが用いられるため、不一致を避けるため、**PINの変更は必ず上述のコマンドを用いてyubico-piv-toolで行わなくてはならない。** (`gpg --change-pin`はNG)
2. PINがブロックされてもManagement keyば有効なので、Brute forceすることができる。 したがって十分長くて**推測不可能なPINを用いる必要がある**。

でリセットできる。予めわざと認証に失敗して(`yubico-piv-tool -a verify-pin`で)ブロックされておく必要がある。

もちろんリセットの禁止も設定できる。

### 鍵の作成

2種類の作り方がある。


| 作成方法                   | pro                                            | con                          |
| :---                       | :---                                           | :---                         |
| GPGで作ったkeyをimportする | 情報が多い。backupを取れる。                   | 安全な環境で行う必要がある。 |
| Yubikeyで直接作る          | 秘密鍵を一切外に出す必要がないのでよりセキュア | Yubikeyをなくすと死ぬ        |

#### gpgで作成した鍵をYubikeyに載せる

**落とし穴が多すぎて挫折しました**。gpgは重要性の割にUIがヘボすぎて使いづらいっす…

はじめから自分のgpg keyがある場合はそちらの秘密鍵をYubikeyにのせることもできる。作り方は[別に書いた][gpgmemo]


```
gpg2 --edit-key <master keyのID>

gpg> key 2 # 上から2番めの鍵を選択
gpg> keytocard # 選択した鍵をyubikeyに載せる
```


#### 直接作成する。

使用する非対称鍵ペアを作成する。

```
yubico-piv-tool -s 9a -a generate -o public.pem -P <PIN番号> # 9aというスロットに秘密鍵を作成し、対応する公開鍵をpublic.pemに出力
```

暗号化アルゴリズムはRSA2048がデフォルトだが、強度を高めたければRSA4096にすることもできる。とはいえ、RSA2048で十分すぎるレベル。[調査](http://security.stackexchange.com/questions/65174/4096-bit-rsa-encryption-keys-vs-2048)[の](https://danielpocock.com/rsa-key-sizes-2048-or-4096-bits)[結果](https://www.yubico.com/2015/02/big-debate-2048-4096-yubicos-stand/)暗号強度は大差ない上に、Yubikey NEOは2048までしか扱えない(yubikey 4 ならば問題ない)ことがわかったので、gpgのデフォルトでもある2048bitを用いる。

ここで`Failed authentication with the application.`と出る謎の現象が起きて詰まる。Management Key (PIV card内部で使用されるKey。Yubikeyの場合は本来はPINと同一で問題ないはず)をPINとは別に設定し`-k`オプションで渡すと解決した。謎。

`ssh-keygen`ではなくyubikeyで直接鍵を作るため、より流出の危険はせばまるが、代わりに秘密鍵のバックアップが取れなくなるため、Yubikeyをなくすと死ぬ可能性がある。

GUI

### 自己証明書の作成

自己証明書を作成すれば[PIV公式](http://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-73-4.pdf)に準拠した証明用カードとして使用できる。


## 静的パスワードの管理。

今のところ２つ選択肢がある。

1. `pass`コマンドで管理 ... yubikeyではなくgpgで管理。
2. [LassPass](https://lastpass.com/yubico)の２段階認証に使う ... 有料プランに登録しなくてはならない。

### `pass`コマンドで管理

`pass`はUnix標準のpasswordマネージャだが、実態はGPGのラッパ。

1. `pass init "GPG key ID"` でパスワードフォルダ`~/.password-store`を作成し、GPG keyで暗号化する。
2. `pass git init`でgitフォルダとして管理
3. 後は`pass insert`, `pass rm`, `pass generate`などで鍵管理する。パスワード以外の情報(秘密の質問への答えなど)は`insert -m`で複数行ファイルにすることで管理。

## アクセサリにする。

当初のイメージ図

<img src="/images/yubikey/hunter_001-1.jpg">

現実

<img src="/images/yubikey/hand.png">

amazonから適当に[首用](https://www.amazon.co.jp/gp/product/B0122DMW4Y/ref=oh_aui_detailpage_o01_s00?ie=UTF8&psc=1)と[腕用](https://www.amazon.co.jp/gp/product/B00S0FPB7Y/ref=oh_aui_detailpage_o00_s00?ie=UTF8&psc=1)の鎖を購入したのだけれど、首用の鎖を腕に巻くのが意外といい感じ。たるみを利用して腕から外さずに挿入できる上に、必要があれば首に巻くこともできる。

本当は溶接したいのだが、使用する際に腕から離す必要がある場合もありうるのでできない。専用のアクセサリを公式に作って欲しいんだけどなー

# 終わりに

２段階認証に使うだけならば極めて簡単にできるが、PIV cardとして使うのは骨が折れるので、セキュリティによほど興味がある人以外はやめておいたほうがよい。

yubico-piv-toolなどはopenscやscdaemon、gpgとの連携においてまだまだサポートが不十分な印象。おそらくユーザーがまだ多くないせいだと思う。「ユーザーが少ない」というはセキュリティ的にも確実に悪影響なのでPIVとしての使用は保留にして2段階認証ように止めようと思う。

gpg使いづらすぎ問題もある。余裕があればコミットしたいが忙しすぎて難しい…

[dockerアプリをセキュアにしたり](https://www.yubico.com/why-yubico/for-businesses/developer-platforms/docker/)、ansible vaultと連携したりしていくこともできそうなので、これからユーザーが増えれば色々とマシになるとは思う。

[gpgmemo]: https://joemphilips.com/post/gpg_memo
