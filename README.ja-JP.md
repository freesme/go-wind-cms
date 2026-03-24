# GoWind Content Hub｜すぐに使える企業向けフロントエンド・バックエンド一体型コンテンツプラットフォーム

GoWind HCH（ゴーウィンド HCH）は、すぐに使える企業向けの Golang フルスタック Headless コンテンツプラットフォーム（HCH=Headless Content Hub、ヘッドレスコンテンツハブ）であり、柔軟で拡張性の高いドメイン全体にわたるコンテンツ管理と配信ソリューションを企業に提供します。

[English](./README.en-US.md) | [中文](./README.md) | **日本語**

## デモアドレス

| デモタイプ | アクセスアドレス |
|---------------|--------------------------------------------------------------------------------------|
| バックエンド管理フロントエンド | [https://admin.cms.gowind.cloud](https://admin.cms.gowind.cloud) |
| バックエンド API Swagger | [https://api.admin.cms.gowind.cloud/docs/](https://api.admin.cms.gowind.cloud/docs/) |
| デフォルトアカウントパスワード | `admin` / `admin`（すべてのデモアドレスで共通） |
| フロントエンド API Swagger | [https://api.cms.gowind.cloud/docs/](https://api.cms.gowind.cloud/docs/) |
| フロントエンド Vue サイト | [https://cms.gowind.cloud](https://cms.gowind.cloud) |
| フロントエンド React サイト | [https://react.cms.gowind.cloud](https://react.cms.gowind.cloud) |
| フロントエンド Taro サイト | [https://taro.cms.gowind.cloud](https://taro.cms.gowind.cloud) |

## GoWind・コアテクノロジースタック

効率的で安定性が高く、拡張可能な技術選定の理念を掲げ、複数のフロントエンド技術スタックのサポートを提供します。システムの核心技术スタックは以下の通りです：

- バックエンド：[Golang](https://go.dev/) + [go-kratos](https://go-kratos.dev/) + [wire](https://github.com/google/wire) + [ent](https://entgo.io/docs/getting-started/)
- 管理画面フロントエンド：[Vue](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) + [Ant Design Vue](https://antdv.com/) + [Vben Admin](https://doc.vben.pro/)
- フロントエンド表示フロントエンドは複数の技術スタックをサポートし、現在 [Vue3](https://vuejs.org/) + [Naive UI](https://www.naiveui.com/)、[React](https://react.dev/) + [Next.js](https://nextjs.org/) + [Ant Design](https://ant.design/)、[Taro](https://docs.taro.zone/en/docs/) に適合しています。

## GoWind・コア機能リスト

| 機能 | 説明 |
|------|----------|
| マルチテナント管理 | 企業向けのマルチテナントアーキテクチャ。テナントの追加、有効化/無効化、パッケージ設定と分離管理をサポート。新しいテナントの作成時に自動的に部門、デフォルトロール、管理者アカウントを初期化。ワンクリックでテナントのバックエンドにログイン可能。 |
| ユーザー管理 | システムユーザーのライフサイクル全体を管理。ユーザーの追加、編集、有効化/無効化、パスワードのリセットをサポート。複数のロール、複数の部門、上司とのバインディングが可能。上司としての設定/解除、ワンクリックでの代理ログイン、高度な条件検索をサポート。 |
| ロール管理 | ロールとロールグループの統合管理。ロールに基づくユーザーの関連付け、メニュー権限、インターフェース権限、データ権限のきめ細かい設定をサポート。従業員の批量追加/削除に対応し、チームの権限分割に柔軟に対応。 |
| 権限管理 | 権限グループ、メニューノード、権限ポイントを統合管理。ツリー構造で権限システムを表示し、ボタンレベルの細かい権限制御をサポート。インターフェース、メニューと連動して完全な権限管理を実現。 |
| メニュー管理 | システムメニューディレクトリ、メニューページ、機能ボタンの視覚的な設定。カスタムメニューアイコン、並べ替え、ルート、権限識別子をサポート。フロントエンドのメニューは権限に基づいて自動的に動的にレンダリングされる。 |
| 部門管理 | 組織構造の部門ツリー管理。複数レベルの部門の作成、編集、並べ替え、ユーザーとの連携バインディングをサポート。企業の組織階層を明確に区分。 |
| コンテンツモデリング | 視覚的なカスタムコンテンツモデルとフィールドタイプ。テキスト、数値、リッチテキスト、画像、ファイル、関連付けなどのフィールドをサポート。記事、製品、お知らせ、素材など、さまざまなビジネスコンテンツ構造に柔軟に対応。 |
| コンテンツ管理 | あらゆる種類のコンテンツデータを一元的に管理。コンテンツの追加、編集、公開/非公開、トップ固定、並べ替え、ゴミ箱、批量操作をサポート。リッチテキスト/Markdown エディター、画像と添付ファイルのワンクリックアップロードに対応。 |
| 分類管理 | 複数レベルのコンテンツ分類ツリー管理。分類の追加、編集、並べ替え、無効化をサポート。コンテンツモデルとのバインディングが可能。フロントエンドでは分類に基づいてコンテンツをすばやくフィルタリング。 |
| タグ管理 | コンテンツタグの一括管理。タグの追加、編集、削除、コンテンツとの関連付けをサポート。タグによる検索と集約表示に対応。 |
| コメント管理 | ユーザーコメントとインタラクションコンテンツを管理。コメントの閲覧、審査、削除、返信、不正コメントのブロックをサポート。コンテンツ、ユーザー、時間によるフィルタリング検索が可能。 |
| 多言語管理 | ネイティブの多言語国際化サポート。言語の追加、有効化/無効化、コンテンツ、メニュー、ヒントメッセージの統一翻訳管理。海外展開と越境ビジネスをシームレスにサポート。 |
| サイト管理 | 複数のサイトの独立した設定をサポート。各テナントは複数のサイトを作成でき、ドメイン名、タイトル、Logo、SEO 情報、表示スタイルを独立して設定可能。 |
| サイト設定 | サイトシステムの視覚的な設定。基本情報、SEO 最適化、アップロード制限、キャッシュポリシー、メール/SMS などのグローバルパラメータ設定をサポート。設定はリアルタイムで有効。 |
| ファイルリソース管理 | 画像、文書、動画などのファイルリソースを一元的に管理。ローカルまたは OSS クラウドストレージへのアップロードをサポート。ファイルのプレビュー、アドレスのコピー、ダウンロード、削除、グループ管理、拡大表示に対応。 |
| 辞書管理 | システムデータ辞書の大項目とサブアイテムの管理。連携検索、サーバーサイドの並べ替え、インポート/エクスポートをサポート。ドロップダウンオプション、ステータス識別子などのグローバル共通データの維持に使用。 |
| インターフェース管理 | バックエンドインターフェースの統合管理と自動同期。ツリー構造でインターフェースリストを表示。インターフェースのリクエストパラメータ、レスポンス結果、操作ログ記録を設定可能。権限ポイントのバインディングに使用。 |
| タスクスケジューリング | 定期タスク管理。タスクの追加、編集、削除、開始、一時停止、即時実行をサポート。タスクの実行記録と実行ログの表示に対応し、定期業務の自動実行を保証。 |
| メッセージ通知 | メッセージ分類とプッシュ管理。複数レベルのメッセージ分類をサポート。指定されたユーザーへのメッセージ送信、メッセージの既読ステータスと既読時間の閲覧が可能。 |
| 站内消息 | 個人向け站内メッセージセンター。メッセージの閲覧、削除、個別の既読設定、一括既読をサポート。システムとユーザー間のメッセージ到達を実現。 |
| パーソナルセンター | 個人情報の閲覧と編集。アバター、ニックネームの変更、ログインパスワードのリセット、ログイン記録とアカウントセキュリティ情報の閲覧が可能。 |
| キャッシュ管理 | システムキャッシュのリアルタイム照会と管理。キャッシュキーによる正確な削除、批量清理をサポート。システム設定とデータのリアルタイム更新を保証。 |
| ログインログ | すべてのユーザーのログイン成功/失敗のログを記録。ログインアカウント、IP、所在地、デバイス、時間を含み、照会とエクスポートに対応。セキュリティ監査に便利。 |
| 操作ログ | 全リンクのユーザー操作ログ記録。正常および異常な操作を含む。操作者、IP、所在地、リクエストパラメータと結果を記録。詳細の表示とトレーサビリティをサポート。 |
| Headless API | API ファースト設計。フロントエンド・バックエンド全体の OpenAPI インターフェースを提供。コンテンツの照会、作成、更新、削除をサポート。Vue、React、Taro、ミニプログラムなど、複数の端末呼び出しに対応。 |

## GoWind・バックエンドスクリーンショット

<table>
    <tr>
        <td><img src="./docs/images/admin_login.png" alt="バックエンドユーザーログインインターフェース"/></td>
        <td><img src="./docs/images/admin_register.png" alt="バックエンドユーザー登録インターフェース"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/admin_post_list.png" alt="バックエンド投稿リスト"/></td>
        <td><img src="./docs/images/admin_post_edit.png" alt="バックエンド投稿編集"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/admin_category_list.png" alt="バックエンドカテゴリリスト"/></td>
        <td><img src="./docs/images/admin_category_edit.png" alt="バックエンドカテゴリ編集"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/admin_tag_list.png" alt="バックエンドタグリスト"/></td>
        <td><img src="./docs/images/admin_tag_edit.png" alt="バックエンドタグ編集"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/admin_comment_list.png" alt="バックエンドコメントリスト"/></td>
        <td><img src="./docs/images/admin_site_list.png" alt="バックエンドサイトリスト"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/admin_site_setting_list.png" alt="バックエンドサイト設定リスト"/></td>
    </tr>
</table>

## GoWind・フロントエンドスクリーンショット

<table>
    <tr>
        <td><img src="./docs/images/react_app_login.png" alt="React フロントエンドユーザーログインインターフェース"/></td>
        <td><img src="./docs/images/react_app_register.png" alt="React フロントエンドユーザー登録インターフェース"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/react_app_homepage.png" alt="React フロントエンドホームページ"/></td>
        <td><img src="./docs/images/react_app_about.png" alt="React フロントエンドについてページ"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/react_app_post_list.png" alt="React フロントエンド投稿リスト"/></td>
        <td><img src="./docs/images/react_app_post_detail.png" alt="React フロントエンド投稿詳細ページ"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/react_app_category_list.png" alt="React フロントエンドカテゴリリスト"/></td>
        <td><img src="./docs/images/react_app_category_detail.png" alt="React フロントエンドカテゴリ詳細ページ"/></td>
    </tr>
    <tr>
        <td><img src="./docs/images/react_app_tag_list.png" alt="React フロントエンドタグリスト"/></td>
        <td><img src="./docs/images/react_app_tag_detail.png" alt="React フロントエンドタグ詳細ページ"/></td>
    </tr>
</table>

## お問い合わせ

- WeChat 個人アカウント：`yang_lin_bo`（備考：`go-wind-cms`）
- 掘金コラム：[go-wind-cms](https://juejin.cn/column/7541283508041826367)

## [JetBrains 様から提供された無料の GoLand & WebStorm に感謝します](https://jb.gg/OpenSource)

[![avatar](https://resources.jetbrains.com/storage/products/company/brand/logos/jb_beam.svg)](https://jb.gg/OpenSource)
