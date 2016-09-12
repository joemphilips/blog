gitのコマンドラインでsshかgitプロトコルを用いている場合は変更の必要はないが、httpsを用いている場合、そのままではgithubとのやり取りができなくなる。パスワードの代わりに[personal access token](https://github.com/settings/tokens)を利用することで問題なく通信できる。ローカルに毎回access tokenを打つのは面倒なので、以下のようにしてキャッシュを指定しておく。
```
git config --global credential.helper cache # linux の場合
git config --global credential.helper osxkeychain # os Xの場合
```
(ここでふと疑問: OAuthは3rd partyに限定された権限を与えるためのプロトコルのはずなのに、こういう風にフルアクセスの権限を自分で取得するために使用するのは本末転倒ではないのか？SSH・gitプロトコルを使用しろということ？でもセキュリティ的にはhttpsの方が望ましいと聞くけど？ 教えて偉い人)
bitbucketの場合はpersonal access tokenが存在しないためOAuthコンシューマキーを

https://bitbucket.org/account/user/<ユーザー名>/api

から取得するのだが、callback urlが必要なところを含め、CLIでの利用ではなくサービスのための利用を前提としている様子。おとなしくsshで接続しろということか

