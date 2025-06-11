# UFCal - イベントカレンダーシステム

Astroフレームワークベースのカレンダーシステムです。ユーザがログインし、カレンダーに表示するイベントを作成・管理できます。

![Image](https://github.com/user-attachments/assets/585de96f-9e01-4441-b363-8df0f8bdf9d6)

## 主な機能

- カレンダー表示（月表示）
- イベントの作成、編集、削除
- ユーザ認証（ログイン/ログアウト）
- ダッシュボード機能
- コメント機能（イベントへのコメント追加、削除）
- ユーザ管理機能（ユーザの作成、編集、削除、ロール管理(ADMIN、MODERATOR、EDITOR、MEMBER)）
- レスポンシブデザイン

## 技術スタック

### フロントエンド
- Astro (SSR)
- React
- Tailwind CSS
- Flowbite
- FullCalendar
- Zod (バリデーション)

### バックエンド
- Node.js
- MariaDB
- Redis (セッション管理)

### 開発ツール
- TypeScript
- ESLint
- Prettier

## 環境要件

- Node.js v20.0以上
- MariaDB v10.0以上
- Redis v7.0以上

## セットアップ

1. リポジトリのクローン
   ```bash
   git clone [repository-url]
   cd ufcal
   ```

2. 依存関係のインストール
   ```bash
   pnpm install
   pnpm dlx prisma generate
   ```

3. 環境変数の設定
   `.env`ファイルを作成し、以下の内容を設定：
   ```env
   DATABASE_URL=mysql://testuser:testuser@localhost:3306/ufcal-db
   SESSION_REDIS_URL=redis://localhost:6379/
   ```

4. データベースのセットアップ
   ```bash
   pnpm dlx prisma migrate deploy
   pnpm dlx prisma db seed
   ```

## 開発サーバーの起動

```bash
pnpm dev
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

### テストユーザ
- 管理者アカウント
  - メール: admin@example.com
  - パスワード: password

## ビルドとデプロイ

1. プロダクションビルド
   ```bash
   pnpm build
   ```

2. サーバーの起動
   ```bash
   pnpm start
   ```

## ライセンス

このプロジェクトは [MITライセンス](./LICENSE) の下で提供されています。