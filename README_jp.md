qMimy Tumblr Viewer README
==========================

## イントロダクション

qMimy Tumblr Viewer（以下qMimyと省略）は、Windows 7のデスクトップガジェットとして開発された、Tumblr向けの写真ビューアである。

## 動作環境

- Windows 7

## 構成

- **gadget.xml**: ガジェットのマニフェストファイル
- **main.html**: メイン画面
- **setting.html**: 設定画面
- **scripts**
    - **jQuery-1.6.min.js**: jQueryライブラリ
    - **main.js**: メイン画面のスクリプト
    - **setting.js**: 設定画面のスクリプト
- **css**
    - **main.css**: メイン画面のCSSファイル
    - **setting.css**: 設定画面のCSSファイル
- **images**
    - **画像ファイル**: UIに使う画像
- **logos**
    - **画像ファイル**: ロゴおよびガジェットの説明画面に表示される画像

## 導入

### .gadgetの作成

Windows 7のガジェットを動作させるには、ソースをパッケージングして.gadgetファイルにする必要がある。.gadgetファイルの実体はzipファイルなので、qMimy.gadgetディレクトリをzip圧縮し、拡張子を.gadgetに変えればよい。

### .gadgetのインストール

作成した.gadgetファイルをダブルクリックすると、ガジェットの一覧に追加される。ガジェットの一覧からqMimy Tumblr Viewerを選び、デスクトップに配置する。

以上で導入は終わりである。Have fun!

### パッケージング済みファイル

[http://quellencode.org/#!qMimy_win7](http://quellencode.org/#!qMimy_win7 "") で配布している。

## ライセンス

本ソフトウェアは、MIT Licenseのもとで配布されている。詳細はLICENSEファイルに記している。

## 作者について

Moza USANE  
[http://blog.quellencode.org/](http://blog.quellencode.org/ "")  
mozamimy@quellencode.org