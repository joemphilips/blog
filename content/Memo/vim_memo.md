---
categories: ["hack", "memo"]
date: 2016-01-15T21:37:27+09:00
description: "personal memo for vim and vimrc"
draft: true
keywords: ["vim"]
title: "vim_memo"
---

#基本操作


0でカーソル行の行頭へ飛ぶ。が、^を使えば「行頭の空白でない文字へ飛ぶ」なので、こちらを使った方が良い。
$でカーソル行の行末へ飛ぶ。

w,e,b
でそれぞれ次のword、endのword、beforeのwordに移動

ctrl-fで一画面分下へスクロール
ctrl-bで一画面分上へスクロール
Ctrl-uで半画面分上へスクロール
Ctrl-dで半画面分下へスクロール

ggVGで全画面を選択

fの後に任意の文字を入力すると、次にその文字があるところまで飛ぶ。
(e.g.　fa　#次にaがあるところまで飛ぶ)
vと組み合わせると一気に選択できる。
(e.g.　vfa)
cと組み合わせると一気に削除できる。
(c2fa　2番目のaまで削除)
faするとaのところまで飛ぶが、その後;を連打するとその次のa、次のaと飛んで行ける。戻るときは,

yはヤンクでdはカットだが、cは削除で、vは選択
(e.g.　cw　単語全体を削除　　　yw　単語全体をヤンク)
          cwだと選択位置から先のみを削除してしまうが、単語の途中にカーソルがある場合、ciwで最初から削除できる。Wを大文字にすると挙動が違う？

ddする際に、1回目のdをx行目、2回目のdをy行目で行うと、その間をカットできる

#テキストオブジェクト
vim7から追加された概念
例えばノーマルモードで
vi"
と入力すると、「カーソル上の"で囲まれている文字列の内部をヴィジュアルモードで選択」という意味になる。
va"だと"も選択対象に含まれる

v…文字単位で選択するビジュアルモード
V…行単位で選択するビジュアルモード
Ctrl-v…矩形で選択するビジュアルモード
ビジュアルモードの矩形選択とdcyとの組み合わせは便利

dat

複数行をビジュアル選択してJとタイプすると複数行を一行に連結する。
3Jのように行数を指定して連結することもできる。

矩形選択(Ctrl-v)した時はそのままjで行方向に選択範囲を広げ、次に$をタイプすると一気に選択できる（Vで十分？）。そのあとにAをタイプすると、行末に一気に文字列を追加できる。長さが異なる業の時に便利。

>>…インデントを一つ追加。
2>>…2行にわたってインデントを追加。
ビジュアル選択した状態で>とタイプするとその範囲に一気にインデントを追加。

Ctrl-a、Ctrl-x…カーソルの下にある数字を増減させる。
r…1文字を任意の文字列に上書き。
R…ESCをおすまで、一定の文字数で上書き。

~…カーソルの上にある文字の大文字小文字を切り替える。また、ビジュアル選択中には一括で切り替える。
u,U…ビジュアル選択中に行うことで、選択範囲内にある文字をすべて大文字あるいは小文字にする。
選択範囲のインデントをそろえるには、ビジュアルモードで一括選択したのち、.=でOK。


挿入モードでCtrl-pあるいはCtrl-n…単語補完（ただし最初の数文字を入力してから使うこと）
:lsでバッファの一覧を表示。

qの後に任意の一文字を打つとマクロ登録が開始される。qをもう一度押すと記録終了となる。
登録したマクロを使いたい場合は
@の後に任意の一文字。
Data::DumperやDB::single = 1を登録しておくと便利かも。

Ctrl-w vあるいはCtrl-w sとタイプするとウィンドウを縦か横に分割できる。
ウィンドウを閉じるときはq:

コマンドラインモードで:!とするとvimを起動したままシェルコマンドを実行できる。例えば
:! ls
編集中のファイルは%で表せるので、
:!perl %
で編集中のperlスクリプトを実行可能。

ctrl-uで編集モードから抜け出せる頃に

:g,     #最後に編集したところに飛ぶ

Ctrl + p      #デフォルト機能での補完

#矩形挿入
矩形Visualモードで範囲を選択してから
Iを押すと入力した後にESCで抜けると、選択範囲の左端全てにテキストが挿入される
Aを推すと右端に挿入される


#置換について
:s/before/after/g カーソル行全体を置換
:%s/before/after/g　文全体を置換
:%s/before/after/gc 文全体を一つ一つ確認しながら置換
:10,20s/before/after/g     #10行目から20行目までを置換

visualモードで選択した後に:を推すと
:'<,'>
と出るので続けて
:'<,'>s/hoge/fuga/gc
とやると選択範囲のみ置換できる

vimでjsonの整形
:%!python -m json.tool

#外部コマンドの実行
:r! ls     #カーソル位置にlsの結果が入力される
#文字コードの変更
set encoding=utf-8
でutf-8に変更。ただしこれでは現在開いているファイルには即座には反映されないので
:e ++enc=cp932
で即座に変更できる。文字化けはたいていこれで治る

#コピペ
:set paste を実行すると、コピペしてもずれない     #:set noautoindentでは不十分

#tab
:set expandtab     #tabを空白に変換
:set noexpandtab     #tabのまま

#タブ、空白などの特殊文字の可視化
:set list

#複数ファイルについて
複数ファイルを開くにはviコマンドの引数に複数ファイルを与える。その際に-oオプションで画面を分割して報じさせられる。
vi -o file1 file2
:nで次のファイルへ、:Nで前のファイルへ
:lsで開いているファイルの一覧を表示できる。

複数ファイルを開くときは
:vs 新しいファイル名
あるいは
:sp 新しいファイル名
とする。
ファイル間を移動したい場合は
Ctrl-w  +  ↑↓←→w

一度に全部のファイルを閉じる際には
:wqa
とする。


vimにクリップボードから貼り付けた時にずれるのは自動インデントのせい
:set noautoindent
して
:set autoindent
で解決できる

#vim自体の管理
バージョンの確認は
vim --version | grep VIM


#.vimrcについて
runtimepathを探すようになっている。デフォルトは~/.vimのみ
ここにプラグイン一式(~/.vim/plugin)や設定の本体(詳しくはこちらhttp://qiita.com/himinato/items/8279154e20249247f78f)が入っている。マシンごとの管理はしない。

#vimscript
vimrcはvimscriptと呼ばれる文法で書かれている。
わからない単語などがあった場合
:help hoge
でhogeのヘルプが見れる
実行方法は
:source ~/.vimrc     #vim内から実行
vim -S ~/.vimrc     #コマンドラインから実行
#関数定義
```vim
function! s:Sum(v1, v2)     #ユーザー定義関数は大文字で始める。!は同名の関数を上書きすることを示す。s:はそのスクリプト内のローカル関数であることを示す。なくてもよい
     return a:v1 + a:v2     #関数内で引数にアクセスするにはa:が必要。
endfunction
```
letで変数の宣言ができる。型は暗黙に決まる

has()でコンパイルされた環境特有の設定ができる。例
if has('gui_running')
     " GUI 用の設定
endif

#文法
行を継続したいときは\を*次の行に*つける。一般的な言語とは違い、行末ではなく行頭につけるのがポイント


#キーマッピング
mapとnoremapがあるが基本的に後者を用いればよい。
ただのnoremapはノーマルモードとヴィジュアルモードにおける設定であるため、ノーマルモードだけならばnnoremapを使用する
inoremapとnnoremapのみで十分。例
nnoremap <silent> <Space>w :<C-u>update<CR>     #<silent>はコマンドラインへの出力を抑制する。Space + wで保存する。

neobundle導入の手順は
mkdir -p ~/.vim/bundle
git clone git://github.com/Shougo/neobundle.vim ~/.vim/bundle/neobundle.vim

vi上から：NeoBundleInstallで.vimrcのNeoBundleで指定されているリポジトリのプラグインをインストールできる。削除したいときは.vimrcからNeoBundleの記述を消したうえで：NeoBundleCleanでできる。

NeoBundle自体のインストールは
http://qiita.com/Kuchitama/items/68b6b5d5ed40f6f96310
を参考に行った。
ただし
neobundle#rcの部分は古いので、じぶんでrc->beginに変更
それだけだと警告が出るので、最後に
call neobundle#end()
を追加

新しくプラグインを追加したい場合は、NeoBundle 'プラグインの場所'
のように指定してから、viを立ち上げ、NeoBundleInstallを実行。

#neobundlelazy
特定の条件下でのみ、パッケージを読み込む。
:h *neobundle-options-autoload*
で詳しいヘルプが見れる

追加したプラグイン

#NERDtree
     ファイルをツリーにして表示する
     o ... 開く
     i ... 新規タブ(縦割り)で開く
     s ... 新規タブ(横割り)で開く
#新規ファイルの作成
1. 作成したいディレクトリ上にカーソルを持っていく
2. m     #cp, rm, mv もこれでできる
3. a
4. ファイル名を入力(ディレクトリの場合は/を付ける)

#Neocomplcache
     補完機能あり、設定はhttp://qiita.com/hide/items/229ff9460e75426a2d07
と同じ。
tabで補完候補を選択し、Ctrl+gあるいはIで便利なことができる。

:QuickRun
で、編集中のコードを実行できる

http://qiita.com/Cside/items/3d186671b361672f1e51
を参考にperlの辞書を
~/.vim/dict
に入れている。

#fugitive.vim
cd ~/.vim/bundle     してgit cloneすればOk

様々なgitコマンドをvim上から行えるようになるが、特に重要なのは
:Gdiff <Commit ID>
現在のファイルのmasterとの差分をvimdiffで表示 <ID>を省略するとmasterとの差分

:Gedit branch:filename.py
:Gsplit branch:%
:Gvsplit branch:%
     別のブランチのファイルを開く。ファイル名に%を指定した場合、現在のファイルと同じものを開く

#自分で設定したショートカット
Ctrl-kでスニペットの補完ができる。
自分でスニペットを追加したいときは
:NeoSnippetEdit
を実行すると
~/.vim/bundle/neosnippet-snippets/snippets
に書ける。書き方はデフォルトのスニペット(/home/vpngw/.vim/bundle/neosnippet-snippets/neosnippets/)を参考に

Ctrl-q     #自分自身を実行
Ctrl-e     #Nerdtree
Ctrl-g     #Gblame

#judi-vimのショートカット
<leader>g     #関数の呼び出しもとに飛ぶ
<leader>d     #変数の定義場所まで飛ぶ
<leader>r     #名前変更リファクタリング
<leader>n     #リファクタリング対象を羅列



モジュール名にフォーカスした後Shift + k　するとperldocを引ける。
     マッピングしたキーの一覧は:mapで確認できる

以下、あとでスニペットに含める。

#--------Error Message---------#


use Getopt::Long;

my $errorMsg = <<ERROR;
usage: $SOFT --i <mRNA fasta file> --o <output file>
version: $VERSION

options
  --i  <file>         Input mRNA fasta file
  --o  <file>         確認用配列の出力

ERROR

#---------Define the Global Parameter------#
my $IN_FILE = '';

#--------Checking Argument---------#
GetOptions (
        'i=s'=>\$IN_FILE,
) or die $errorMsg;

die $errorMsg if( ! -f $IN_FILE );

## Open fasta file ##
        my $in = Bio::SeqIO->new( -file => $IN_FILE, -format => "fasta" );


        ## Open output files ##
        open SAVE, ">$OUT_FILE" or die "Could not open $OUT_FILE\n";

my @vcf_cols = <VCF>;
foreach my $col(@vcf_cols){
        if($col =~ /^#/){
        print $col;
        }

        my @collist = split(/\t/,$col);
        foreach my $value(@collist){
                print $value,"\n";
        }
}

my $in = Bio::SeqIO->new( -file => $IN_FILE, -format => "fasta" );



my $dir = dir('./reference');
102         while (my $fasta = $dir->next){
     next if($fasta が適さない)
}

