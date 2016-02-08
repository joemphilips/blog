---
categories: ["hack", "memo"]
date: 2016-01-01T19:57:08+09:00
draft: true
description: "personal memo for shell script"
keywords: ["Shell", "Bash", "Linux"]
title: "shメモ"
---

# 基本コマンド

## grep
grep -ir <pattern> ./
で./以下のすべてのファイル内を再帰的に検索。(-iは大文字小文字を区別しない。)
grep -100 で前後１００行を表示。該当する行の前だけ、あるいは後ろだけ出力したい場合は
grep -A 3 -B 5
#前５行、後ろ３行が表示される

grep -c      #マッチした行ではなく、マッチしたファイル名と回数のみが表示される。

#正規表現
デフォルトのgrepで使えるメタ文字は
\ ^ $ . [ ] *
である

基本的には? + { | ()
などの特殊記号を使うときは\でエスケープしなくてはならないが、
-Eや-P
を指定してやるといらなくなる。
grep -P "^\d{2,3}"     #2,3桁の数字から始まる行を抽出。

正規表現ではなく、固定文字列として扱いたいときは-Fを指定する。

#誤ってrmしてしまった場合
extundeleteを使用する

su
apt-get install extundelete
mkdir /tmp/extend
cd /tmp/extend
date -d "14:20" +%s     #14:20以降のファイルをバックアップしたい場合、これでUNIX時間を確認
fdisk -l     #復旧対象のパーティションを確認
その後、以下のコマンドを実行
1. extundelete --after <UNIX_TIME> --restore-directory home/hoge /dev/sdb1     #--restore-fileでも可
2. extundelete --after <UNIX_TIME> --restore-all /dev/sdb1
どちらのコマンドでも、./のRECOVERED_FILEディレクトリ下に復旧される

#rename
renameには2種類ある。
①mv と同じもの。(例
rename hoge fuga
②perl正規表現を使うもの
rename s/foo/bar/ ./*
①しか入っていない場合もあるので注意
その場合は仕方がないので
ls ./* | perl -lne '$file=$_; $dest=$file; $dest =~ s/foo/bar/; `mv $file $dest`'
とする

指定した文字列にマッチするプロセスをすべて殺したい場合,pgrep,pkillが便利
pgrep -f 'bwa' | xargs kill

でもやっぱりこっちの方がわかりやすい
ps aux | grep miyamoto | awk '{print $2}'
ポイントはcutでなくてawkを使用しているところ。cutは複数の空白文字が連続している場合にそれぞれで区切ってしまうが、awkだと一つにまとめてくれるので便利

grep -w pattern <目標>    #patternの前後に_か[A-Z]がないときのみヒット。

#jq
jsonの内容をsedやawkのようにフィルタ・加工するためのコマンド。使用例
cat hoge.json | jq '.name'     #.name要素を抽出

#netcat
リモートサーバをいじるときの十徳ナイフ
使い道なさそう…

pstree -l -p ユーザー名     #ユーザーの実行しているプロセスをすべてPIDつきで表示

jobs     #実行中のジョブ一覧を表示
fg %2     #ジョブID2をfgに持ってくる
stop %2     #バックグラウンドジョブを一時停止

nkf -Lu ファイルの改行コードをUNIXに変換
nkf -Lw ファイルの改行コードをwindowsに変換

#diff
出力は

2,3c7,8     #2~3行目と7~8行目の比較、という意味。Changedのcではなくdの場合は「削除された」の意味
< hoge
< hoge2
---
>fuga
>fuga2
ー
のような形になる。
第一引数として与えたファイルにしか存在しない行には
<
がつき
第二引数なら
>がつく、よって
diff a b | grep '<'
でaにのみ存在する行をとれる。そこから<の除きたい場合は
diff a b | grep '<' | cut -f2 -d" "
でいける


find . -name out_*.txt | cut -d”_” -f2 | sed ’s/.txt// | sort -n | diff <(cat -) <(seq 1 10000)'
out_*.txtの中に1~1000がちゃんとあるか確認

ファイルが同じ

#sort
重複行のチェックはsortしたのち　uniq -cで     #-cは行数を各行の先頭につけてくれるオプション
sort myfie.txt | uniq -c

実はsort | uniqは
sort -u
でもよい。これなら、特定の列でのみuniqをかけることができる
cat hoge.sam | sort -u -k1,1      #同じreadを削除

ソートする行を指定する際は
sort -k2,3 myfile.txt     #2列目、3列目でsort
2列目のみを用いる場合はなぜか2回書かなくてはならない
sort -k2,2 myfile.txt

複数の条件を指定する場合、複数回kを指定してやらねばならない。
sort -k 2,2 -k 1nr,1 -k 3,3     #まず2列目でソートし、次に1列目を数字で、かつ降順にソートし最後に3列目でソートする

-f     #辞書順に並べる。デフォルトだとキャラクターコード順なので、大文字を全部並べた後に小文字を並べる。
-n      #整数順に並べる
-g     #実数順に並べる

#uniq
uniq -u      #重複していない行を抽出
uniq -d      #重複している行を抽出
uniq -c      #重複してる数をカウント。数字\t行     の形で出力。列の順番を入れ替えたいときは
perl -ane 'print $F[1], "\t", $F[0], "\n"'
するしかない

#comm
SQLのjoinのように、2つのファイル間の比較ができる。文字列でsortしておく必要あり
comm <(sort file1.txt) <(sort file2.txt)
あるいはあらかじめsortしておいて
comm file1.txt file2.txt

タブ区切りファイルを出力し、
1列目が第一引数のファイルにuniqな行
2列目が第二引数の。。
3列目が共通の行

comm -23 file1 file2     #1列目のみを出力、-13、-12も指定できる
-i     #ignore case

#csvkit
コマンドラインでcsvを扱うためのツール。
pip install csvkit
で入れることができる
-dでデリミタを指定
-tでタブ区切り(-dをオーバーライド)

#csvformat
タブ区切りなど、フォーマットの変形ができる

#csvgrep
行の条件を指定してgrep、普通のgrepと違い、正規表現だけでなく、数字の範囲指定なども用いることができる。

#csvcut -c <列名>
unixのcutと同じだが列番号ではなく列名を用いる点が違う

#csvjson
csvデータをjsonに変換する
csvjson hoge.csv     #jsonに変換
csvjson -e shift_js hoge.csv     #日本語を含んでいる場合、このように指定

このままだと出力がインデントされていないため、見づらい。以下の2通りの方法でインデントする
cat hoge.csv | csvjson -e shift_js | python -m json.tool     #pythonのjsonモジュールによるインデント

csvjson -e shift_js -i 2 hoge.csv     #-iでインデント
例
csvjson -k "column_name" -t -i 4 hoge.tsv
-k      #キーとなる列名を指定、全要素はユニークでなくてはならない

#csvsql
csvをデータベースに入れるためのCREATE TABLE文を発行する
csvsql hoge.csv     #hoge,をという名前のテーブルを作りデータベースに登録する
csvsql --table mytable hoge.csv     #テーブル名を指定
csvsql -i oracle hoge.csv     #データベースを指定
csvsql -e shift_jis     #日本語の場合
csvsql --db sqlite:///hoge.sqilte hoge.csv     #接続文字列を指定すると、実際にSQL文を発行できる(?)

例
csvsql -i sqlite hoge.tsv | sqlite3 mydatabase.sqlite     #前半でCreate table文を発行して、そのテーブルをmydatabaseに登録している。

hoge.csvのところのファイル名に + * / - . ' :　が使われているとテーブル名が不正になりsyntax errorが出る

#csvlook
markdown用の表みたいにして出力

#csvclean
csvclean -n hoge.csv     #列数がおかしくなったりしていないかを調べる

#csvstat
Rでいうsummary

#in2csv
xlsxやjsonなどの各種フォーマットからからcsvへ変換する
in2csv -f json     #jsonをcsvに変換     #便利そう!
sql2csv     #sqlからcsvへ変換

#wc
-b     #バイト数のみ
-w     #文字数のみ
-l     #行数のみ

gzipで元ファイルを残すときは-cオプションで圧縮結果を標準出力に出させる。

環境変数の一覧は
printenv
コマンドで出せる。

#スクリプト
usageを定義しておくと便利、
function usage {
     cat <<EOF
     $(basename ${0}) is a tool for ...
     usage:
          $(basename ${0}) [command] [<options>]
     Options:
          --version, -v print $(basename ${0}) version
          --help, -h      print this
EOF
}

あるいはバージョンを定義する
function version {
     echo "$(basename ${0} version 0.0.1)"
}

!$で直前のコマンドの引数を参照

#変数の初期化
引数があったときのみそれを代入する場合${:-}を使用する
hoge=${1:-default}
これは以下と等価
```sh
if [ -z "$1"]; then
     hoge="default"
else
     hoge=$1
fi
```

: > foo.log     #foo.logを初期化

foo=${bar:=0}     #fooにbarを代入、ただし、barが空文字列あるいは未定義値なら0を代入
foo=${bar=0}     #上とほぼ同じだが、未定義地の場合にのみ、0を代入。自分から使う必要はない。

${#foo}     #fooの長さを取得。

${foo%word}     #wordはメタ文字が展開される。fooから、wordに最短一致する接尾辞を除去
                         #${foo%R*} (最後に出現したR以降を除去)
${foo%%word}     #fooから、wordに最長一致する接尾辞を除去
${foo#word}     #最短一致の接頭辞を除去
${foo##word}     #最長一致の接頭辞を除去

例えば
mypath="usr/local/etc/apache/httpd.conf"
${mypath##*/}     #=> httpd.conf
${mypath%.*}      #=> usr/local/etc/apache/httpd  ... つまり…拡張子の除去に使える

#date
フォーマットを指定するときは
date +"%Y/%m/%d/%H"     #時刻までのディレクトリ名を作成

#shファイル
-e
スクリプト内のコマンドの返り値が0以外だった時、そこで終了する。(全コマンドの後に || exit 1を付けるのと同じ)
実際には失敗しても続けてほしいコマンドの場合があるので、その時は最後に&& :
を付ける(例：
grep "unmatch pattern" hoge.txt && :
あるいはif文にしてしまっても処理は続行される。一時的にset +e してしまうのもあり。例
cp /hoge /fuga with 'set -ex'     #失敗したら終了し、コマンドがわかるようになる。

     #最も現実的なやり方は
commant || echo "error message" && exit 1

-x
デバッグオプション
-u
未定義変数を参照した時に処理を終了する

引数処理
$#…引数の数
$0…実行時のコマンドの絶対パス
CMDNAME=`basename $0`でファイル名を取得
shell_dir=$(cd $(dirname $0) && pwd)
でスクリプトのあるディレクトリのパスを取得
$1~$n…引数の値
$@…すべての引数
args=("$@")     で配列に格納

#exec
2つ使用法がある。
1. 現在のジョブに置き換えて指定したコマンドを続行する
exec exit 1     #現在のジョブを中止してexitする
2. 以降のシェルでの標準出力、標準エラー出力を別の場所に吐くように指定する
exec 2> /dev/null     #以降は標準エラーが出なくなる
exec 2> >(tee -a stderr.log)     #標準エラーが画面とstderr.logの両方に出力されるようになる。
exec 2> >(grep -v "exclude" > &2)     #標準エラー出力の内容をフィルタする。

#tee
標準出力と引数の両方に出力を分岐させる
例
echo "hoge" | tee hallo.dat
cat hoge | tee >(grep -v "hoge" > without_hoge) | echo

#TIPS

```sh
TMP=`mktemp -d`     #tmpファイルのパスを変数に格納
CPU=`grep processor /proc/cpuinfo | wc -l`     #cpuのコア数を取得
for i in `seq 0 \` expr $CPU - 1 \``; do     #コア数だけループを回す
     echo $i > $TMP/$i.txt &     #iを付けてバックグラウンドで実行
done

wait     #for内の全ての処理が終わるまで待つ
cat $tmp/*.txt >
rm -rf $TMP
```

#read
ユーザの入力を対話的に受け付けて変数にsetするコマンド

#!/usr/bin/bash
echo -n "enter yes or no --> "
read ANSWER
echo $ANSWER ←シェルを抜けると変数は解除されてしまうため確認のため組込み

#declare
変数の型を明示的にする時のコマンド。同じものにtypesetがあるが、こちらはbashではobsoleteになっているので、基本的にはdeclareを使用するのが良い。
zshではdeclareとtypesetは全く同じ。
使用例

declare -a     #配列
配列の扱い方は以下
declare -a myarray[要素数]
declare -a myarray = (hoge fuga hana)     #初期化
${myarray[0]}     #最初の値を参照
${myarray[*]}     #全ての要素の値を参照
${#myarray[0]}     #最初の値の文字数を取得
${#myarray[*]}     #データ数を参照

declare -i 3     #整数型。このように宣言しておくと
declare -r      #読み込み専用
decalre -f

#join
joinではタブ区切りを
join -t "\t"     ではなく
~~join -t "     "     にしなくてはならない~~
-> 訂正：join -t $'\t' とする

joinでは一度に2つのファイルしか連結できないので3つ以上連結する場合は

i=0
for f in file1 file2 file3
do
     if[ $i -eq 0 ]
          cat $f > tmp
     else
          join $f tmp > tmp2
          mv tmp2 tmp
     fi
     i=`expr "$i" + 1`
done

のようにする

結合する行を指定するときは
join -1 3 -2 4     #ファイル1の3行目とファイル2の4行目で結合する。
のようにする。
join前のソートで、-kを正しく指定することを忘れないようにする。第1列同士でjoinする場合でも同様

join -t,     #カンマを区切り文字に指定
-a1     #ファイル1のペアにならなかった行を、通常の出力に追加して表示する
-a2     #ファイル2の~~

-e "hoge"     #出力されなかったフィールドをhogeで埋める後述の-oオプションと合わせて使用する。

-o     #出力を絞る。指定の仕方が特殊で,0あるいはM.Nの形で指定する
0にはjoinに使われた行が入り、Mにはファイル番号(1 or 2)、NにはそのファイルのN列目を出力する

-o 0,1.1,2.2     #join列、1ファイル目の1列目、2ファイル目の2列目を出力する

使用例
join <(cat file1 | sort | uniq -c | perl -ane 'print $F[1], "\t", $F[0], "\n"' | sort) \
     <(cat file2 | sort | uniq -c | perl -ane 'print $F[1], "\t", $F[0], "\n"' | sort) \
     -1 1 -2 1 -e "0" -a1 -a2 -o 0,1.2,2.2
file1の

#ls
ls -L     #シンボリックリンクはリンク先のファイル名を表示
ls -ld ./*     #ファイル名をフルパスで表示する(カレントディレクトリの指定の仕方がポイント)

#find
find . -type f -print | xargs file |sed -e '/ASCII/d' | cut -d: -f1   #バイナリファイルのみ探す
なぜか-print0で出力して、xargs側では-0で受け取る方が良いらしい
find . -type f -print0 | xargs -0 file |sed -e '/ASCII/d' | cut -d: -f1
理由：ファイル名にクォートが入っていると、xargsが困ってしまうためらしい

-type [f|d]     #ファイルかディレクトリをダウンロード
-name "hgoe"     #名前で検索
-mtime +2     #24*(2+1)時間以前のファイル
-mtime 2     #24*2時間前からさらに過去24時間以内に更新されたファイル
-mtime -2     #24*2時間よりも後で更新されファイル

findで出てきた値を処理したいときはxargsに渡すのでもよいが-execオプションを使うのも可
find ./ -name "*.txt" -exec rm -rf {} \;     #なんかよくわからないが;をエスケープする必要がある。
find ./ -name "*.txt" -exec rm -rf {} +     #なるべく多くの引数を与える。xargsと同じ

#cut
cut -d " "
でデリミタを指定
-f     #フィールドを指定

の中身ではなく、ファイル名に対してcutしたい場合はあらかじめechoする

ls | cut -f1     #ダメ
ls | xargs echo | cut -f1

#並列実行

#xargs

ユーザ関数に渡す場合はexport -f <関数名>しておき
| xargs -I XXX bash -c "<関数名> XXX"     #XXXの部分は自由に変えてよい

xargs -i
と
xargs -I'{}'
はLinuxでは等価だが、OSXやBSDとの互換性のため、後者にしておいた方が良い

mvやcpに渡すと、最後の引数にとして処理されてしまうので、うまくいかないことがある。-iオプションを使うとうまくいく。
find . -name "hoge" | xargs -i mv {} /tmp
{}以外の記号を使いたい場合は
find . -name "hgoe" | xargs -i% mv % /tmp

-P0     並列実行数を指定,0だとよしなにはからってくれる。
-L     #引数として渡す数を指定。指定しないと「xargsで起動できるコマンドの最大引数」を自動で与えてくれる。
例えば ls | xargs gzip
してもCPUは一つしか使われない、これはlsからの標準出力を引数のリストにしてgzipに与えており、gzipコマンド自体は複数の引数が与えられても並列実行できないため。
こういった場合はあえて-L1とすることで、並列実行数を調整する。

-0     #Oではなくゼロ。find -print0 とセットで使われる。xargsに渡される文字列の区切り文字が空白ではなくnull文字になる。また、メタ文字が特別な意味を持たなくなり、そのまま解釈される

#複数コマンドを実行したい場合
ls | xargs -i sh -c 'echo {}; echo{}'
ただし、これをやると`find -print0 | xargs -0`では終わらない

#gnu parallel
&を用いたバックグランドの並列実行だと、実行数の数だけジョブを起動するが、parallelならCPUのコアごとにジョブを立ててくれるため、nice & tidy　である(http://unix.stackexchange.com/questions/104778/gnu-parallel-vs-i-mean-background-vs-xargs-p)
この点がxargsよりも優れている。(xargsは実行数だけジョブを立てる？)
他にも、xargsより優れた点に
xargsは'"やスペースの扱いが面倒。
アウトプットを別のディレクトリに入れることができない。

また、コンピュータを超えて実行することもできるらしい。詳細不明

基本文法は
parallel echo ::: hello world !     #echo　にhello, world, ! をそれぞれ引数として与える。
:::を二回連続で書くことで、引数の組み合わせの積を作ることもできる。例：
echo ::: hello, bye, ::: Alice Bob     #4種類の組み合わせをechoに与える。

-a     #ファイルの各行を引数として与えて実行する。例
parallel -a list.txt cat     #list.txtの各行を並列にcat
パイプも使える
cat list.txt | parallel -a - gzip
区切り文字はデフォルトでは\nだが、-0、または--nullを指定すると空白文字になる(tabもいける？)

コマンドに渡す引数の位置が最後でない場合は{}を指定する
parallel 'find {} -name "README*"' ::: ~vendor/julia/ ~/vendor/vector
{}の部分に引数が入る。
この{}を{.}や{/}で置き換えると、前者はファイル名の拡張子を除いた引数にしてくれる。後者はファイル名だけ取得してくれる。
{./}両方同時の時はこれ

~/t/sample $ parallel 'echo {.}' ::: tmp/foo.txt.gz tmp/bar.txt.gz
tmp/foo.txt
tmp/bar.txt
~/t/sample $ parallel 'echo {/}' ::: tmp/foo.txt.gz tmp/bar.txt.gz
foo.txt.gz
bar.txt.gz

--dry-run     #実際には実行せず、実行するコマンドのみを表示する。デバッグに便利

--results <outputdir>     #<outputdir>内に引数ごとにディレクトリを作り、そこに結果を保存する。

デフォルトだとマシンのコア数だけ並列させるが、共有サーバなどではCPUを占領してしまう。
これを減らしたい場合は
--jobs N     あるいは
-j N     で指定する。(1000%と書いてもOK)

xargsでいう-Lコマンドは-Nで渡す。

-k     #ジョブを与えた順に出力(デフォルトだと終了した順に出力)

--noswap     #メモリのスワップが発生しているときには新しいジョブを実行しないようにする。
ssh越しに複数のジョブを実行したいときは
parallel --sshlogin serverexample.com     #passが必要な時は不明

#less
-m     #自分がドキュメントのどのあたりにいるのかを%で表示
-i     #ドキュメント内検索で、大文字小文字を区別しない
-N     #行番号表示
-n     #行番号を非表示。必要のない機能かと思いきや、計算量が大幅に減るので、表示が重いときに便利
-S     #折り返しなしで表示
Shift + F     #更新をモニター。tail -f　と同じ
&     #を起動中に押すと、grepできる。

#sed
sed はふつう-e　オプションを使用する。置換は
sed -e "s/a/b/g" targetfile.txt     #STDOUTに出力
のようにして使用する。パイプで使うことももちろんできる。
iオプションを使うとパイプに送らずにファイルをそのまま書き換えることができるので便利
sed -ie "s/a/b/gi" targetfile.txt     #二回目のiはcase ignoreを指す
sedでは改行を置換することはできない。vimで行おう

-pオプションで、perl正規表現が使用できる

sed 's/^>¥([A-Z]\{2\}¥)/\1_/g' multi.fa     #fastaファイルの「>NM000001」のようなパターンを「>NM_000001」に置換する例

(){}はエスケープしなくてはならない。
+や?はperlの正規表現と同じ扱いだが、エスケープする必要がある。

メタ文字 意味
^ 先頭
$ 後尾
. 任意の 1 文字
* 直前の文字の 0 回以上の繰り返し
\+ 直前の文字の 1 回以上の繰り返し
\? 直前の文字が 0 回または 1 回のみ出現
[] 文字クラス、[abc0-9] ならば数字と a, b, c のどれか 1 文字
\| OR、[ab|ap] ならば ab または ap
\{3\} 直前の文字が 3 回だけ出現
\{3,5\} 直前の文字が 3〜5 回出現
\b 単語区切り

#expr
整数演算を行う
$(())で代用できるので、こちらの方が良い
while [ $((i++)) -lt 10 ]

#for文
for分は少し特殊で
for i in 1 2 3     #iが$iでないことに注意！
do
#hoge
done
のように行う
inの後の部分に`seq 1 N`や`ls *.txt`
を入れてもよい。

カウントする場合は
count=0
for
$count=`expr $count + 1`

ワンライナーで使用する場合は
for i in `ls ./`;do cp hoge huga; done     #doの後に;がないことに注意

イテレータを使用する場合はforの外でi=0としfor内で
i=`expr "$i" + 1`
次のループに移るときは
continue

例：1000ファイルに分割する
linenum=`wc -l`

for i in {1..1000}
do
     START=`(echo “($i -1) * $linenum/1000 + 1” | bc)`
     tail -n ;$START temp.fa | head -n linenum > split_$i.fa
done

#if,test内の条件判定ついて
以下、よく使うもの
-le…左辺が右辺以下
-ne…左辺と右辺が等しくない

否定文は
if ! [ -f $file]
のようにする。

zshならば正規表現も使える。例
if [["aaabbc" =~ "b+c$"]]; then
    echo "hoge"
fi

zshでなくても次のようなやり型で正規表現が書ける

if expr "aaabbc" : "b+c$" > /dev/null; then
     echo "hoge"
fi

#top
1でcpuごとの使用率を確認。
top -a     #メモリ使用順にソート
top -p <pid>     #特定のプロセスを監視
top -d1     #一秒ごとに更新

開いてからは
Shift+o表示された特定のキーを押してEnterすると任意の列でソートできる
Shift+p     #CPU利用率順にソート
Shift+m     #メモリ使用率順にソート

#C関連
ldd <binary>     #実行ファイルがダイナミックリンクなら、リンク先を表示

#特殊変数など
真偽値は普通と逆で、0=TRUE、1=FALSE,
$N      N番目の引数
$#     引数の個数
"$@"     = "$1" "$2"..."$N"
シェル変数
files=`ls`     #lsの結果がfilesに入る。参照したい場合は
${files}     #{}が大事
files=(`ls`)     #filesは配列になる。

#パイプについて
echo "hoge" 1>&2
とすると標準出力の内容を標準エラー出力に出力できる。これは「この出力はエラー出力ですよ」と明示したい場合に用いる。逆に
2>&1
は、エラー出力と標準出力をまとめてパイプしたい場合に用いる。例
make 2>&1 | less
#両方の出力をlessに渡す。
make > /dev/null 2>&1
#両方の出力を/dev/nullに書き出す
bashならば
&>
だけでもまとめてパイプすることはできる。例
make &> makelog
が、スクリプト内ではきちんと　2>&1 >とした方が良い。

ちなみに
echo -e "hoge\tfuga"     #=> hoge     fuga
echo "hoge\tfuga"     #=> hoge\tfuga
#zsh
chsh -s /usr/local/bin/zsh
でログインシェルの変更

zshを立ち上げた時に読み込まれる設定ファイルは以下の通り
ログインシェルとしてzshが起動された場合

1 ~/.zshenv
2 ~/.zprofile
3 ~/.zshrc
4 ~/.zlogin

インタラクティブシェル（ログインシェルとしてではない）としてzshが起動された場合

1 ~/.zshenv
2 ~/.zshrc

シェルスクリプトを実行するコマンドとしてzshが起動された場合

1 ~/.zshenv

ログインシェルとして起動されたzshからログアウトする場合

1 ~/.zlogout

よって、とりあえず.zshrcに書いておけば問題はない

#oh-myzsh
zshのカスタマイズが面倒な人向けにオススメ設定などが簡単に使えるようにするプラグイン
#インストール
下記のコマンドでインストール
wget http://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | sh
~/.oh-my-zsh
ができる。ディレクトリ名は固定で、変えたら動かない。

#テーマの変更
~/oh-my-zsh/themes
に、使用可能なテーマの一覧がある。
.zshrcのZSH_THEMEを変更するとテーマを変更できる。

#プラグイン
~/oh-my-zsh/themes
に独自のプラグインが入っている。
このうち使用するものを~/.zshrcの
plugis=(git ruby gem)
のような感じで指定する

#独自設定
~/.oh-my-zsh/custom
hoge.zsh
を置き、この中に適当なaliasなどを書いておくと使用可能になる。

#expect　sshpassの方が使い勝手が良い
対話的コマンドに対処する。実は単一のコマンドではなくTclの拡張言語である
基本的には、以下のようにして使用する
```
#!/usr/bin/expect
spawn <実行したいコマンド>
expect "<期待する対話プロンプト>"
send "PASS_WORD\n"
interact
```
だが、実際にはシェルとして実行した方が良い

```
#!/bin/sh

PW = "passwd"
expect -c"
set timeout 5          #デフォルトは10だがこれだと長い
spawn ....
expect ...
send ...
exit 0

"
```

#sshにおける分岐処理の例
```sh
set PW "Password"
set timeout 5
spawn env LANG=C /usr/bin/ssh hoge@servername
expect{
     "(yes/no)?" {
          send "yes\n"
          exp_continue     #たとえsendexpect内の処理(この場合はpassword)を続ける
     }
     "password:" {
          send "${PW}\n"
     }
}
expect {"\\\$" {exit 0}}
```

#ファイル、ディレクトリ管理
stat
 file.txt     #file.txtの詳細な情報を表示。
file
 file.txt     #もっとアバウトな情報を表示
du -hs hoge/     #hogeのサイズを表示
du -h hoge/     #hogeのサイズを再帰的に表示

du -k ~ | sort -n | tail -10     #~以下の大きいファイルを順に表示

#ssh
sshがうまくいかないときは-vオプションを付けるとデバッグモードになる。ここで
type -1
などと表示されているときは、そのファイルが存在しないという意味。たいていはIdentityFileがないため

あらかじめ
usermod -G ssh miyamoto
しておかないとつなげない
#-tオプション
接続先でコマンドを実行したいときは、ダブルクウォートを使用する
ssh hoge@hosta "echo 'Hello World!'"
これで2段階接続すると擬似端末が割り当てられていないせいで死ぬので、.ssh/configをいじるか
-tオプションを付ける
ssh -t hoge@hosta "ssh hoge@hostB"
あるいはProxyCommandを使う
ssh hostA -o ProxyCommand="ssh hoge@hostB -W %h:%p"

#rsa鍵の設定
cd ~/.ssh
ssh-keygen -t rsa -C -f id_rsa_for_for_myserver     #鍵の作成
~/.ssh/以下にid_rsa_for_myserver(秘密鍵)id_rsa_for_myserver.pub(公開鍵)が作成される
秘密鍵のpermissionは600に指定しておく
公開鍵をサーバ上の~/.ssh/authorized_keysに追記しておくと、接続できるようになる
known_hostsは手元(クライアント)側に設定するファイル

#~/ssh/config
設定をここに記述しておく
Hostから始まるブロックが一つの接続先サーバを表し、その下のインデントした部分に設定を記述する。
たとえば、login.example.comを中継に用いてserver.example.comで最終的に作業を行いたい場合
Host login
  User         user_at_login
  HostName     login.example.com
  IdentityFile ~/.ssh/id_rsa_for_login

Host server
  User user_at_server
  HostName server.example.com
  IdentityFile ~/.ssh/id_rsa_for_server
  ProxyCommand ssh login -W %h:%p
と書いておくと一段階で認証できる。
解説：上のHost loginの部分はなくてもいいのだが、設定しておくとssh loginとしただけでlogin.example.comに接続できるようになる。
ProxyCommandは、そのhost名に一致するサーバに接続しようとした時に、自動的にProxyCommandのコマンドが実行されるようにするもの。
~/.ssh/config内では
%h
はHostname、
%p
がポート番号(通常は22)、
%r
がリモートのユーザ名になる。

複数のサーバの設定を記述するときは、以下のように正規表現を使うこともできる。
Host server1
  User user_at_server1
  HostName server1.example.com

Host server2
  User user_at_server1
  HostName server1.example.com

Host server*
  ProxyCommand ssh login -W %h:%p

以下の設定を付け加えておくとSSHが早くなり、一度接続したホストにはパスワードの設定が必要なくなる。

Host *
  ControlMaster auto
  ControlPath ~/.ssh/master-%r@%h:%p.socket
  ControlPersist 10m

もしエラーが出たらOpenSSHのバージョンが古いのでアップデートしよう。

ServerAliveInterval 30
で、30秒ごとに1回サーバーに通信し、接続が切れるのを防ぎます。

ポートフォワードは-Rオプションでトンネルを掘ることで行う     #参考：http://www.clear-code.com/blog/2014/9/12.html
ssh 中継サーバ -R 10022:転送先ホスト:22     #職場(転送先ホスト)から中継サーバへのトンネルを開く
全く同じコマンドをsshの代わりにautosshで行うと、接続がずっと確立されたままになる。
これで、中継サーバ上で　ssh -p 10022 localhost
すると職場へとフォワードされる。初めから中継サーバから職場に接続できる場合は-Lオプションで逆からトンネルを掘ることもできる。

プロキシ内にある社内サーバに外からアクセスしたい場合
たいていの場合、会社のプロキシはhttpとhttpsは外からでも通すようになっているので、社内サーバのsshのlistenポートを443にしてしまえばよい
単純に
/etc/ssh/sshd_config
に
Port 443
を書いてsshdを再起動してやればOK

#ssfhs
sshでリモートのディレクトリをローカルのようにマウントする。

#scp
sshを用いたファイルのコピーを行う
scp local_file miyamoto@xxx.xx.jp     #こっちからあっちのホームディレクトリにコピー
scp -r miyamoto@hoge:remote_dir ~/local_dir     #あっちの~/remote_dirをこっちの~/local_dirに再帰的にコピー

#rsync
rsync <copy_from> <copy_to>
リモートフォルダの場合は
rsync ~/local miyamoto@remote.host.com:dir/
のようにする。
#オプション
使用頻度の多い順に
-a     #アーカイブモード。パーミッションやグループなどを保持したまま同期できる。基本的に使うのが吉(ただしシンボリックリンクをたどらないのでその点だけ注意)。以下のオプションをすべてオンにする
-r     #ディレクトリを再帰的にコピー
-l     #symbolic linkをDESTで作り直す。
-p     #permissionをDESTでも同じにする。
-g     #groupの``
-o     #ownerの``
--exclude=PATTERN     #PATTERNに一致するファイルをコピーしない
--delete-excluded     #PATTERNオプションで除外するファイルに関しても、DESTにあれば除外する。
-v     #処理中のファイル名を表示する。こちらも基本的に使うのが吉。
--delete     #コピー元で削除されたファイルがある場合、コピー先でも削除する
--update     #コピー先でファイルを更新してもSOURCEのファイルで上書きしない
-n     #dry-runする。
-z     #gzip圧縮して転送。大きいファイルならば使用するのが吉
--copy-links     #-aオプション時でもシンボリック先をたどってファイルをコピーする

#sshを使用した場合
基本的には-eを使用して以下のようにする。

```sh
rsync -avz -e ssh source user@remote:/path/to/backup     #DISTとsourceを逆にすればリモート
をローカルにバックアップすることもできる。
```
ログインにパスワードが必要な場合。
デーモンモードで起動する。

#デーモンモード下準備
/etc/rsyncd.conf
を編集する。
以下が記入例
### グローバル・オプション
uid         = root
gid         = root
log file    = /var/log/rsyncd.log
pid file    = /var/run/rsyncd.pid
### モジュール・オプション
[backup]     #[]はモジュールといい、rsyncのマウントポイントのようなもの
comment = rsyncd
serverpath = /opt
read only = no     #デフォルトでyesなので、読み書きできるようにしておく必要がある

デーモンモードはポート873でLISTENするので、root起動する必要がある。
#デーモンモードでの運用
rsync --daemon --config=/etc/rsyncd.conf     #--port=10873のようにすることで、ポートを変更できる。
でまず起動し、次にrsyncプロトコルで同期する
rsync -av source rsync:://192.168.1.2/backup     #最後の/backupは、rsyncd.confで指定した文字列でなくてはならない。
サーバ側のrsyncd.confも変更しなくてはならないみたい。詳しくはhttp://www.maruko2.com/mw/rsync_%E3%81%A7%E3%83%87%E3%82%A3%E3%83%AC%E3%82%AF%E3%83%88%E3%83%AA%E3%81%AE%E5%90%8C%E6%9C%9F%EF%BC%88%E3%83%90%E3%83%83%E3%82%AF%E3%82%A2%E3%83%83%E3%83%97%EF%BC%89

リアルタイムに同期する場合はlsyncdを利用する。

#管理者用コマンド、およびプロセス管理

#cron

service cron status     #cronデーモンが走っているか確認
走っていなかったら、chkconfigなどで設定する

/etc/crontab     #下記のファイルをそれぞれどの時間で実行するかを書いている。あまりいじらない方が良い
分     時     日     月     曜日     実行コマンド
の順に実行する時間が書いてある。1~5列目には
*     #毎回実行
1,3,8     #この月のみ実行
10-12     #この時間のみ実行
*/5     #5分間隔で実行
などが指定できる

下記はそれぞれ、そのタイミングで実行するファイル
/etc/cron.monthly
/etc/cron.weekly
/etc/cron.daily
/etc/cron.hourly

/var/spool/cron/crontab/<username>     #username用のcronジョブを記述する
実際には以下のようにホームディレクトリ下で管理した方が良い

編集は
crontab -e
で行うとマニュアルにはあるが、実際は
vim ~/dotfiles/crontabで
crontab ~/dotfiles/crontab     でcrontabを登録する

#パーミッション

chmod -R u|g|a +|- r|w|x ./

数字で書くときは左から順にugaのパーミッションを指定する。
0     ---
1     --x
2     -w-
3     -wx
4     r--
5     r-x
6     rw-
7     rwx

getent passwd     #cat /etc/passwdと同じ
getent group     #cat /etc/groupと同じ

groups     #groupnの一覧を確認
users     #ログインしているuserの一覧を確認

id     #今のuseridとgropuidを表示
useradd miyamoto -m -d /home/miyamoto     #userを作成
-mはホームディレクトリを同時に作成することを示す。
-dはホームディレクトリの位置を指し、その後にそのpathを指定する。

passwd miyamoto     #miyamotoのパスワードを変更
userdel -r miyamoto     #miyamotoを削除、(-rを指定することで、ホームディレクトリ以下のファイルを削除)
groupdel <group>     #groupを削除
usermod -u <userid> miyamoto     #userIDを変更
usermod -G ssh miyamoto     #miyamotoをsshユーザーに追加
chown -R miyamoto:groupA ~/     #ホームディレクトリ以下の所有者をmiyamoto、グループをgroupAに変更する。
groupmod -g <id> <group_name>     #groupidを変更

#sudo、visudo
/etc/sudoer
を変更することでsudoの権限をuserごとに変更できる。
miyamoto     ALL=(root) ALL
と書いておくと
miyamotoは、すべてのホストからrootに変身でき、すべてのコマンドを実行できる。
visudoをrootで実行すると自動的にこのファイルを編集できるが、たいていはこのファイルに
#includedir /etc/sudoers.d
と書いているので、その場合は
visudo -f /etc/sudoers.d/hoge
として、設定はこちらのファイル内に書いておいた方が良い

訂正、使わない方が良い

sudo -E     #現在のユーザの環境変数を引き継ぐ
これだと$HOMEも引き継いでしまうためややこしいことになる。
sudo -i     #~/.bashrcや/etc/profileの設定のみを引き継ぐ
の方が良い

いずれにせよいかない場合があるのでおとなしくsuした方が良い

#ジョブ管理
qsub run.sh     #指定したジョブをキューに入れる。
qsubへのオプションはrun.sh内に書く
#$ -S /bin/sh     #シェルスクリプトで実行
#$ -cwd     #ジョブを実行するディレクトリを指定
#$ -l <キューの名前>　プロセス数

qstat -f     #ジョブの表示
qstat -j <jobid>     #指定したジョブの詳細を表示
nohupし忘れたジョブを後からnohup状態にするにはbgに移行してから
disown %1     #job番号を指定

nohupの出力先をnohup.out以外にしたいなら
nohup command > out.log &

nohupをfor文に対して使いたいときは

renice -n -5 -p <pid>     nice値を-5に変更

#エラーチェック
ipcs     #共有メモリの情報を表示

fsck /dev/hda1/     #/dev/hda/というデバイスのファイルシステムにエラーがないか見る。

#パフォーマンスチューニング
sysstat dstat htop iotop、iftopで事足りそう

#sysstat
sar 1 5      #1秒ごとに5回計測する。デフォルトではCPUの利用状況を出す
-q     #load average
-u     #cpu(default)
-b     #DISK IO
-r     #memory
-n TCP    #network for TCP
-n ALL     #Network for All

以下のコマンドで過去のデータをとれる
-s     #開始時間
-e     #終了時間
-f     #ファイルに出力
例
sar -n TCP -s 02:11:20 -e 02:11:22 -f /tmp/sar.log

#iftop
network用のtop

#vmstat
最も基本となるコマンド
vmstatでディスクIOやメモリの管理が行える。
vmstat 1     #1秒間隔で実行(普通はこれで見る)
vmstat 2 5     #2秒感覚で5回実行

スラッシングなどを見たい場合は-pオプションを付ける
vmstat -p 1

--system--
in     #CPUに対する割り込み処理の回数
cs     #コンテクストスイッチの回数

--cpu--
id     #idolしていた時間
sy     #カーネルコード(OS自身やシステムコールのために費やした時間)
us     #sy以外のプログラムに費やした時間
wa     #dataの入出力時間

出力の見方についてはこのページが非常に参考になる。https://blogs.oracle.com/yappri/entry/vmstat

よくある問題
rがサーバのコア数よりだいぶ大きい…CPUが足りない。
si,soが大きい…メモリが足りない。
bが大きい…ディスクIOが追い付いていない。

より複雑な状態を見たい場合はdstatを使う

#cpなどの進行状況をチェック
以下を使うhttps://github.com/Xfennec/progress

#iotop
root権限が必要

#ハードウェアの情報
cat /proc/cpuinfo     #cpuの情報を表示
lscpu     #cpuの情報を表示
cat /proc/meminfo     #メモリの情報を表示

cat /proc/filesystems     #利用可能なファイルシステムの一覧
/etc/yum.repos/     #yumのリポジトリ情報

#mount

- partedでHDDにパーティションテーブルを作成
- mkfsでファイルシステムを作成
- mountでマウント

#よく使うコマンド
fdisk -l, df -h     #マウントされたものの一覧
dmesg | grep sd | tail     #最近のディスク関連のログ
parted -l     #マウントされていないデバイスのファイルシステムを調べる
mkfs -t ext4 /dev/sdd     #sddのファイルシステムを書き換える(ちょっと時間がかかる)
mount /dev/sdd /mnt     #/mntにマウント
fuser -muv /mnt/nfs1     #ファイルシステムを使っているプロセスを発見する

gdisk,fdisk,partedで、ディスクの初期化およびパーティションラベルの変更を行う
パーティションラベルとは…ディスクにつけるエイリアス、これを設定することで抜き差しした時に/dev/sdbが/dev/sdcに変わっても大丈夫

マウントされたデバイスとマウントポインタおよびオプションの詳細は
/etc/fstab     #起動時にマウントされるスライス
/etc/mtab     #現在マウントしているスライス
に書いている。

外付けをUSBにさすと、何らかのデーモンがfstabに以下のように追記する。
/dev/sdd1 on /media/sdd1 type ext4
その状態で
mount /media/sdd1     #通常は/dev/hogeを指定してやる必要があるが、省略した場合はfstabを参照する
としてやると勝手に/mediaにマウントされる。外付けは/mediaにマウントするのがデフォらしい

mount -o rw     #読み書き可能でマウント

mount /dev/cdrom /home     #CD-ROMを/homeにマウント
-t fstype     #ファイルシステムを指定。使用可能なファイルシステムはhttp://news.mynavi.jp/news/2010/04/15/058/を参照
-a     #/etc/fstabをすべてマウントする

umount /dev/cdrom     #CD-ROMをアンマウントする
umount -a     #/etc/mtabに記述されているすべてのファイルシステムをアンマウントする

#sshfs
rootではなく一般ユーザで行う。
sshfs miyamoto@myserver:/hoge /mnt     #remoteのhogeをlocalにマウント

#Centosでntfsをマウントする

#fdisk
HDをフォーマットする。
パーティションテーブルの規格によっては、2TB以上のHDはフォーマットできない場合がある。そういう時はGUID partition table(GPT)に変更する。

#HD管理
#LVM
Logical Volume Manager(論理ボリュームマネージャー)の略。
マウント前にボリュームグループを作成することで、物理ボリュームを柔軟にファイルシステムに割り当てることができる。手順は以下

1.fdisk /dev/sda     #対話式にディスクのパーティショニング。tでシステムIDを指定するがLVMぱてーぃションのシステムIDは8e
2.pvcreate /dev/sda1     #で物理ボリュームを作成(≒ディスクを初期化)
3.pvs,pvdisplay     #物理ボリュームの一覧と割り当てサイズを確認

4.ボリュームグループ(VG)の作成
vgcreate -s 32M <VG_NAME> /dev/sda1/dev/sdb1     #複数のファイルから32M分を一つのVGにまとめる。pvs,pvdisplayすると先ほどはなかったVGが表示される

5.論理ボリュームの作成
lvcreate -l 434 -n <LV_NAME> <VG_NAME>
-lオプションで指定するサイズは、pvdispalyでのTotal PEした時の値となる。

6.mkfsしてマウント
普通に外付けをmountする時と同じだがRAID構成の場合はちょっと違う
RAIDの場合
vgchange -a -n <VG_NAME>     #VGを非アクティベイト
/sbin/sfdisk -R /dev/sda     #待機系でパーティションテーブル更新
vgscan <VG_NAME>     #待機系でVGの認識をさせる
vgcfbackup <VG_NAME>     #LVM構成情報のバックアップファイルを取得
vgchange -a -y <VG_NAME>     #現用系でVGをアクティベイト
その後普通にmount
#外付けHDDマウントの手順
1. USBをさす
2. dmesg | grep sdb     #sdb: sdb1のような行があれば、そのHDはsdb1として認識されている
3. sudo fdisk -l     #外付けの一覧を見れる。HDを指す前との差分を見れば、どれが新しく追加されたものかわかる。ここではsddとする
4. sudo fdisk /dev/sdd     #色々コマンドを入力できる(mでヘルプ)が、ここではd(windows用ファイルシステムを削除)、w(テーブルをディスクに書き込み、exit)
5. もう一度sudo fdisk /dev/sddをして,p,n,p,1,enter,enter,したのち、確認のため、pそのごw
6. 念のためsynk
7. sudo mkfs -t ext4 /dev/sdd1     #ファイルシステムの指定、ここではext4
8. sudo mount /dev/sdd1 /mnt/hoge
9. 取り外すときは必ずアンマウントする。`umount /mnt/hoge`     #*マウントポイントより上位のディレクトリに移動すること!*
マウントされているか否かはmountコマンドで見る

#umountできない場合
lsof | grep "/mnt"
fuser - /dev/sdd1
でプロセスを確認
fuser -kmi /mnt      #/mntを利用しているすべてのプロセスをkill(iオプションは確認のためにつけている)

#ネットワーク関連
#ネットワーク関連ファイル
/etc/hosts ... 静的なIPと名前の対応表
/etc/resolv.conf ... DNSサーバの設定ファイル
nameserver 192.168.154.4
のようにして記述
/etc/network/interfaces ... 自分のIPなど
/etc/sysconfig/network-scripts/* ... ネットワークの設定ファイル。NATやアダプターの設定はここをいじる(CentOS7ではnmtuiを使った方が良い)

#lsof
特定のファイルを使用しているプロセスを見るコマンド。
rootで使用すべき
-iオプションを付けることで、ファイルだけでなくポートを使用しているプロセスを見ることもできる
netstatに近いが、プロセス名とポート名を同時に見ることができる点が違う
lsof -i -n -P | cut -f1 -d” “ | uniq #通信をしているプロセスの一覧を表示。sudoをつけないとすべてのユーザー情報は出ない
lsof -p <process_id>     #特定のプロセスIDが使用しているファイルを見る

lsof -i:22  #sshについて調べる

#netstat
netstat -lanp     #現在のネットワーク接続の一覧を表示
netstat -i     #通信状況を確認
netstat -rn      #デフォルトゲートウェイを確認。
-v     #詳細な情報を表示

ifconfig
 ipアドレスを表示
route
     デフォルトゲートウェイを表示、netstat -rnと同じ
デフォルトゲートウェイを変更したいときは
/etc/sysconfig/network
を編集する

2つ以上設定したいときは
route add default gw <ip address>

#iptables
iptables -L     #現在のIPtablesの設定を表示

iptablesの設定ファイルは
/etc/iptables/rules.v4     #debianの場合
ubuntuの場合はufwを使用するのが吉
/etc/sysconfig/iptables     #その他
にある。これを編集して
-A INPUT -p tcp -m tcp --dport <開けたいポート番号> -j ACCEPT
のようにする。ただし一番下の行にCOMMITがなくてはならない
-A          Appendの意、「ルールを追加しますよ」と明示している。
INPUT     「受信に対するルールだよ」の意
-m tcp     TCPパケットの通信を許可
-p     チェック対象のプロトコルをtcpに
これを反映させるためには
service iptables restart     #(systemctlの方がよい？)
だがこのままではエラーが出るので
iptables-restore < /etc/iptables/rules.v4

設定を再起動後も保持するためにはiptables-persistant     というものがあるらしいがよくわからない。
apt-get install iptables-persistent
すれば、/etc/init.d/iptables-persistent
に入るはずなのだが、入っていない。

#ufw
ubuntu特有のファイヤーウォール設定コマンド
ufw disable     #iptablesの設定をすべて無効化
ufw enable     #有効化
ufw allow 8787     #port8787を開ける。
ufw deny 22/tcp     #sshのTCP接続を拒否
ufw status     #現在の状況を確認

#MACアドレス
rootで
ifconfig | grep eth0     #HWaddrのところ
arp -a
のいずれかで見れる

dmesg | grep eth0
で見れる

#nmap
現在開いているポートを確認する(ポートスキャン)時は
nmap localhost

#wget
wget -p <port番号> http://localhost     #ポート8787を通して自分自身にアクセスできるかどうかを確認する。
wget  -e http_proxy=proxy.co.jp:8787 'http://localhost'     プロキシも指定できる。

#wgetの各種オプション
--no-check-certificate     #https通信で、SSLサーバ証明書を検証しない

いちいちプロキシを指定したくない場合は
/etc/wgetrc
に
use_proxy = on
https-proxy = http://hoge.fuga.co.jp:8080
などと書いておく

wgetに限らず、多くのコマンドのプロキシ設定は/etc/hogerc
に書いてある。普通はyumとwgetを指定すれば十分
yumの設定は
/etc/yum.confにproxy=http://hoge.jp:8080
などと書けばOK

システム全体で設定する場合は
/etc/profile.d/proxy.sh
に設定する。が、no_proxy項目周りの設定が面倒らしいので、下手にいじらない方が良い。

curlの場合は
~/.curlrc
に以下のように記述する
proxy-user = "(ユーザ名):(パスワード)"
proxy = "http://proxy.xxx.co.jp:(ポート)"
これだと自分のプロキシしか設定されないので、アプリケーションが新たにユーザを立ち上げて、そのなかでcurlを行っている場合プロキシにはじかれる場合がある。その場合は
/etc/environment
に
http_proxy="http://hoge:8080"
を書き込んでおく。

sudo は-iを指定する

F5アタックのコマンド
while :; do curl -s 'url' > /dev/null ; done

# curl
ssl認証絡みでうまくいかないことがある。その場合は-kオプションでエラーを無視すればたいていは解決する

あるいは/etc/pki/tls/certsが存在しない、ないしパーミッションが755でないなどの理由が考えられる。
sudo apt-get install ca-certificatesで更新するか
wget http://curl.haxx.se/ca/cacert.pem
で落としてきて
curl --cacert cacert.pem
で指定するなどの方法がある

#疎通の確認
nslookup www.yahoo.co.jp
で、yahooのIPがわかる。(さらにpingを送ってもよい)つながっていない場合は
DNA request timed out
みたいに出てくるはず。

#デーモンの管理
デーモンの一覧は
/etc/init.d/
に入っている。

デーモンが起動する際に読み込むファイルは
/etc/default     #debian,ubuntu
/etc/sysconfig     #RHEL
に入っている。

ランレベルnで起動デーモンは
/etc/init.d/rc<n>.d
に本体へのシンボリックリンクが張られている。よって
ls -l /etc/rc*.d/*ntp
をすればntpがどのランレベルで起動するかわかる。また、ここにシンボリックリンクを張れば変更もできる(RHEL系ならchkconfigでもOK)
ランレベル番号は
ランレベル番号は、以下のとおりです。

0 停止(シャットダウンに向かう状態)
1 シングルユーザモード
2 ローカルなマルチユーザ(リモートなし)(システムによっては定義されていない)
3 マルチユーザー
4 (定義されていない)
5 ランレベル 3 + Xディスプレイマネージャ起動
6 リブート
S シングルユーザモード

直接起動したいときは
/etc/init.d/デーモン名
だが、あまり使わない

serviceコマンドを使用する。
systemctlが入っている場合はこちらの方が広範に活用できるので、こちらを使用した方が良い。
systemctl start docker     #dockerデーモンを起動

startのところには
stop
reload     #デーモンがreloadに対応している必要あり
restart     #start->stop
kill
などが入る

systemctl list-unit-files -t service | grep docker     #dockerが自動起動の対象となっているかを確認

#起動時に任意のスクリプトを実行する
/etc/rc.d/rc.local
または
/etc/rc.local
に記述する

#chkconfig、(RHELにしか入っていない。
debian、ubuntuではいろいろあるが、sysv-rc-cnofを用いるのが良い)
サービスの自動起動、および停止を管理する。
ランレベルや自動起動の設定なども管理できる。
chkconfig --list      #各サービスの起動設定の一覧を表示
chkconfig <service_name> on     #自動起動するように設定。offで解除
chkconfig --level 24 <service_name> off     #ランレベル2,4では起動しないようにする
chkconfigの場合はoffしても即座に停止するわけではないのでその場合はserviceを使用する

#sysv-rc-conf
基本的に使い方はchkconfigと同じ
172.16.10.3     #DNSserver
160.190.222.6     #プロキシサーバ
#DNS
/etc/hosts     にホスト名とipアドレスの対応表がおいてある。(昔の名残)
sshする前にここに記入しておく必要あり

DNSサーバの設定は
/etc/resolv.confにある
ここに
nameserver <ip アドレス>
のように書いてやると解決してくれる。DNSサーバのipアドレスがわからない場合は、すでにつながっているマシンから
nslookup google.co.jp     #windowsの場合
dig google.co.jp     #linux
のようにすれば確認できる

CENTOS6以降ではDNSサーバは/etc/sysconfig/netowrk-scriptsに指定するらしい
UBUNTU12.04以降では/etc/network/interfacesに
dns-server 8.8.8.8
と書いたうえで
sudo service networking restart
で反映される

#統合監視ツール
#Zabbix

#構成管理ツール
ChefとPuppetがある。どちらもRubyベース
Puppetは独自DSLで設定ファイルを記述するので、Chefの方がよさげ

#パッケージインストールの知識
root権限がないときはlpmを使用する。
ソースコードからインストールする時は、いったん.debファイルを作ってやると、aptで管理できるので楽になる。
ローカルインストールする場合
dpkg -i package.deb
でもよいが
gdebi package.deb
の方が依存関係を考慮してくれるので良いらしい
dpkg -l     #インストール済みのパッケージを調べるには
dpkg -P <package_name>     #アンインストール

#aptコマンド
apt-getする前に、リポジトリの追加
/etc/apt/sources.list
および、aptのアップグレード
apt-get update && apt-get upgrade
を行うとよい。

アンインストールは
apt-get remove
で行う

apt用に配布するパッケージは、作者の作ったスクリプトが
/var/lob/dpkg/info/
に入る。ここに例えば
<package_name>.postinst
などのファイルがある。これはインストールされた後に実行するファイルである。
rmがうまくいかないときは
<package_name>.postrm
<package_name>.prerm
の一番上に
exit 0
と書いてやるとうまくいくことがある。

.debを作成しない場合は、アンインストールしやすいように、make cleanせずにMakefileを残しておいた方が良い。
make後、makefileの名前を（pログラムの名前がわかるように）変更したうえで、~/makefileディレクトリにおいておく。アンインストールする時は、そのmakefileを別のところに移動し名前を元に戻したうえで、
make uninstall
を行う。

apt-cache search hoge
でhogeに少しでも関係するパッケージを検索する
aptitude search packagename
でも可

#apt-key
aptがパッケージを認証するのに使用するキーの一覧を管理するのに使用する。
apt-key add <key>     #信頼済みのkeyを追加する。
apt-key exportal     #信頼済みのキー一覧を出力

インストールしたファイルの場所は
dpkg -L
でわかる。

#yum
基本はaptと一緒で、
yum install package
で行う。
yum search hoge
などもできる
yumリポジトリの一覧はここを参照
http://oki2a24.com/2013/02/18/know-best-repository-of-centos/

ソースのダウンロード

#rpm
aptに対するdpkgに相当(多分)
ローカルのrpmファイルをインストールするときなどに使う
rpm -ivh hoge.rpm     #本当に必要なオプションは-iだけで、vhは進行状況を表示する

#porg
aptやyumを使わずにinstallしたソフトを管理するためのソフト
#porgのインストール
tar玉を落として解凍したのち
cd paco-2.0.6/
./configure --disable-grop     #GUIを用いない
make
make install
make logme     #pacoでpaco自身を管理する

対象となるプログラムをダウンロード、makeした後
sudo porg -lp パッケージ名 'make install'     #あるいは
sudo porg -lD 'make install'
make以外のプログラムでもよい
sudo porg -lD 'ruby setup.rb'
など

#オプション
-l     #ログモードを許可する
-p     #パッケージ名の指定
-lD     #現在のディレクトリ名をパッケージ名として使う
-a     #innstallしたパッケージのリスト
-f パッケージ名    #そのパッケージ名でインストールされたファイルの数
-s パッケージ名     #パッケージのサイズを表示
-r パッケージ名     #削除

pacoが管理するデータは
/var/log/paco
に入っている。

モジュールの知識
lsmodでロードされているモジュールの一覧を表示
modinfo　<モジュール名>でモジュールの説明を表示　-dオプションで　説明を追加
modprobe　依存関係を考慮してモジュールをロード　ロードするドライバはlib/modules/`uname -r`/kernel/driverまで探しに行く
modprobe -r で依存関係を考慮したアンインストール

カーネルやbootプロセスの知識

inittab
boot時に一番最初に実行されるのは、initプロセスである(これはpsしたときに必ず一番上にくる)これは
/etc/inittab
を実行するのでここを編集すれば起動時のデフォルトの設定を変更できる。
デフォルトのランレベルを5に変えたいときはこのファイル
id:2:initdefault:
の2を5に変更する。

inittabの各行の見方は
id(なんでもいいから他とかぶらない値)：runlevel：プロセスの動作の仕方(action)：起動するプログラム
という形になっている。重要なのは3フィールド目で、
respawn　->　プロセスが終了するたびに何度でも再起動する。
wait　->　プロセスを起動し、終了を待ってから次に行く
initdefault　->　デフォルトのランレベルの指定にのみつかわれる。

起動時にGUIログイン画面を出すようにするには、
x:5:respawn:/usr/bin/kdm -nodaemon     #もちろんgdmでもprefdmでもよい。
と書く。

#uname
uname -m     #CPUのタイプを表示する。
uname -r     #カーネルのバージョンを表示
uname -s     #OS名を表示
uname -a     #全部表示

#ディストリビューションの確認
大抵は
/etc/issue
か
/etc/*-release
見ればわかる

X window systemに関する知識

X Window systemがハングアップしている場合は
Ctrl-Alt-F2
でコンソール画面に切り替える。その後Xに戻るには
Ctrl-Alt-F7

xmodmap     #X上でのキーをカスタマイズするコマンド。
xmodmap -pke とすると現在のキーコードとkeysymを表示する。

ディスプレイマネージャのデーモン、xdm、kdm、gdmなどが実行されることで、ウィンドウマネージャを立ち上げる。
xdmcpによるリモートログインがしたいなら、xdmを使用する。

xdmは（kdmもgdmも同様だが）
/etc/X11/Xsession　#全ユーザー共通のスクリプト①
を実行したのち、
~/.xsession     #ユーザーごとのスクリプト②
を行う。

ホームページによっては①をコピーして、②を作ってしまえばいいと書いてあるが、それだと問題が起きる場合がある。
なぜかというと①の最後に
「②を実行せよ」
という命令が書かれている場合があるからである。したがって②が無限ループに陥る可能性がある。
kdeならstartkde、
gnomeならgnome-session
を②に記述してやればよい

その後判明したのだが以下のページhttp://linux.kororo.jp/cont/intro/xhost.php
に従って、単に
export DISPLAY=<IPアドレス>:0.0
としてやれば、よいらしい。

#ubuntuの場合
は、lightdmがデフォルトのX デーモン

#ログの管理
システムのlogは
/var/log
にある特に重要なのは
/var/log/messages     #一般的なシステムに関する情報
/var/log/cron     #定期的に実行される処理の結果に関する情報
/var/log/secure     #セキュリティに関する情報
/var/log/boot.log     #OS起動時に関する情報

logの出力の仕方は
/etc/syslog.conf
で制御されている。     #apacheやsambaのログは別。そういった独自のログを出すアプリケーションはマニュアルを読む
