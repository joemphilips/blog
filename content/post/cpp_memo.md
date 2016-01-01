---
categories: ["hack", "memo"]
date: 2016-01-01T19:23:17+09:00
description: "personal memo for C++"
keywords: ["C++"]
title: "c++メモ"
---


#C++メモ
-----

[TOC]

@(備忘録)


##基本文法
###hello world

```cpp:hello world

#include <stdio.h>
int main()
{
	printf( "%s\n", "Hello, World" );
	return 0;

}
```

コメントアウトは//か/**/

標準出力は`std::cout`
よってboostを用いてhello worldを書くと
```cpp
#include <iostream>
#include <boost/format.hpp>

int main()
{
	std::cout << boost::format("%s\n") % "Hello, World";
	return 0;
}
//%は引数としてbost::format関数に渡していることを示す
```

標準入力から整数を受け取って、標準出力に和を返すプログラムは
```cpp
#include <iostream>
int main(){
	int a, b;
	cin >> a >> b;
	cout << a + b <<endl;
	return 0;
}
```

`using namespace std;`とすると、coutと書くだけで、std::coutにアクセスできる…が、名前空間が汚されるので協議プログラミング以外では避けた方が良い

###配列
繰り返し処理は以下
```cpp
int main() {
    int array[10];
    for(int i = 0; i < 10; i++)
        array[i] = i * i;
}
```

###oop
構造体はstructで定義する。それに関数も入れれるようにしたのがクラス

クラスは以下のように定義する
```cpp
struct hoge {
private:
	int x;
	int y;
public:

	MyConstructor()
		: x( 0 ), y( 0 );
	//セッター
	void set_count( int x ) { this->x = x; };

	//ゲッター
	int geet_count() const { return this->count; };

}
```

コンストラクタはクラス名と同じ名前の関数でも行けるらしい。

###explicit
下は暗黙の型変換の例
```cpp
class A
{
	A( int );
}

class B
{
	B( const A&);
}

void func()
{
	B( 3 );
}
```
BのコンストラクタはAでないといけないように見えるが、３を渡すと自動的に

```cpp
void func()
{
	B( A(3) );
}
```
になる。これを防ぐには`explicit`を利用する。
```cpp
class B
{
	explicit B( const A& );
}
```
特に理由がなければコンストラクタにはexplicitを使用しなくてはならない

##並列処理
IntelTBBを使うのが良いらしい。Boostでもできるが、それぞれのスレッドをどのコアに割り当ててやるか指定しなくてはならないので、面倒。

OpenMPも簡単？

###OpenMP
共有メモリ型の並列処理に適した形でコンパイルする。
が、頻繁にメモリにアクセスするプログラムの場合は一台のマシンでもなぜかMPIを使用した方が早いらしい
ソース内に
```c++
#pragma omp
```
を付けて、コンパイル時にフラグを付ければOpenMPに対応したコンパイラなら自動的に並列化される。例えばGCCの場合は
`-fopenmp`を付けるだけでよい

###MPI
分散メモリ(クラスタマシン)の場合はこちらを使う


##ライブラリ
###標準ライブラリ
####STL
最もよく使われる標準ライブラリ、下記をincludeして使う

```cpp
#include <algorithm>
min(a, b)	#小さい方を返す
max(a, b)
int a[] = {3, 5, 7, 8, 2}
sort(a, a+5)	#aをソート
reverse(a, a+5)	#aを反転
count(a, a+8, 8)	#a中の8の数をカウント
```
スタックとキュー
```cpp
#include <stack>
#include <queue>

stack<int> S;	#stack<int>というクラスのSというインスタンスを作成。<int>はスタックに格納する値がintであることを示す。

S.push(3);	#Sに3を追加
S.top()	#Sの先頭要素を取得（削除はしない）
S.pop()	#Sの先頭要素を削除
S.size()
S.empty()
#queueも似たような感じ
```


