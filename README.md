# UFCal - イベントカレンダーシステム

Astroフレームワークベースのカレンダーシステムです。ユーザーがログインし、カレンダーに表示するイベントを作成・管理できます。

![screencapture-localhost-3000-2024-08-16-11_55_49](https://github.com/user-attachments/assets/ad352e7d-3d34-4034-8a5f-21ca3eb21c8d)

## 主な機能

- イベントの作成、編集、削除
- カレンダー表示（月表示）
- ユーザー認証（ログイン/ログアウト）
- 管理者機能
- コメント機能（イベントへのコメント追加、編集、削除）
- ユーザ管理機能（ユーザの作成、編集、削除、ロール管理）
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
- Prisma (ORM)
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
   pnpm dlx prisma migrate dev --name init
   pnpm dlx prisma migrate reset
   ```

## 開発サーバーの起動

```bash
pnpm dev
```

開発サーバーは [http://localhost:3000](http://localhost:3000) で起動します。

### テストユーザー
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