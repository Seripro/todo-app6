# Todo App

Hono、Drizzle ORM、MySQL で作られたシンプルな Todo アプリです。ブラウザから Todo の追加、完了状態の切り替え、削除ができます。

## 技術スタック

- Node.js / TypeScript
- Hono
- Drizzle ORM
- MySQL
- Docker Compose

## 起動方法（Docker）

Docker と Docker Compose を用意して、次を実行します。

```bash
docker compose up --build
```

起動時にデータベースのマイグレーションが実行されます。ブラウザで [http://localhost:3000](http://localhost:3000) を開いてください。

停止するには次を実行します。

```bash
docker compose down
```

データベースの内容も削除して初期化する場合は、次を実行します。

```bash
docker compose down -v
```

## ローカル開発

MySQL を別途起動し、プロジェクト直下に `.env` を作成します。

```env
DATABASE_URL=mysql://user:password@localhost:3306/mydatabase
```

依存関係をインストールし、マイグレーション後に開発サーバーを起動します。

```bash
npm install
npx drizzle-kit migrate
npm run dev
```

アプリは [http://localhost:3000](http://localhost:3000) で利用できます。

## 利用できる操作

- Todo を追加する
- Todo を完了・未完了に切り替える
- Todo を削除する

## API

| メソッド | エンドポイント | 内容 |
| --- | --- | --- |
| `GET` | `/api/todos` | Todo の一覧を取得 |
| `POST` | `/api/todos` | Todo を作成。`title` を送信 |
| `POST` | `/api/todos/:id` | `action=toggle` で完了状態を切り替え、`action=delete` で削除 |

`POST /api/todos` は JSON（`{ "title": "買い物" }`）とフォーム形式のどちらにも対応しています。

## データベース

`todos_table` に以下の情報を保存します。

| カラム | 説明 |
| --- | --- |
| `id` | Todo の ID |
| `title` | Todo のタイトル |
| `completed` | 完了状態 |
| `createdAt` | 作成日時 |

スキーマを変更した場合は、マイグレーションを生成して適用します。

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

## 本番用ビルド

```bash
npm run build
npm start
```
