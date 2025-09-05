# じぶんキャラ診断

「じぶんキャラ診断」は、ユーザーの性格や価値観から最も当てはまるキャラクタータイプを診断するWebアプリケーションです。

## 概要

45問の質問に答えることで、あなたの恋愛スタイルや性格タイプを診断します。男性は3つのタイプ（キング、ナイト、プリンス）、女性は3つのタイプ（アイドル、バリキャリ、マザー）から、単独タイプ、複合タイプ、バランスタイプのいずれかが診断結果として表示されます。

このWebアプリケーションは、各結婚相談所の運営者様が自社の婚活会員様に使ってもらうために管理することを想定しており、URLスラッグを用いたテナント機能により外部からアクセスできないようになっています。イメージとしてはWordPressのようなCMSをイメージしていただけるとわかりやすいかと思います。

現在はスモールスタートとしてサービス利用料のオンライン決済画面は実装しておらず、サービスを使いたい相談所様から依頼があった場合のみ、希望されるURLスラッグをお聞きした上で招待リンクを送信して登録してもらう形となっております。将来的に規模が増えた場合に実装予定です。

管理者画面では各相談所様が診断結果ページのCTRボタン(自社のLINE公式やホームページなどのリンク)やそのデザインをカスタマイズできるようにし、会員様向けのイベント予約機能も含めた管理者画面の実装を済ませる予定です。



## 特徴

- **簡単な診断プロセス**: 所要時間は約2分程度
- **性別に応じた診断**: 男性向け・女性向けそれぞれに最適化された質問と結果
- **詳細な結果表示**: 各タイプの割合をビジュアルで表示
- **婚活・恋愛サポート**: 診断結果及び婚活サービスへのリンク(LINE公式など)

## 技術スタック

### フロントエンド
- React 19.1.0
- TypeScript
- React Router v7
- Emotion (CSS-in-JS)
- Tailwind CSS
- Vite

### バックエンド
- Ruby on Rails (API mode)
- PostgreSQL
- Devise (認証)

## セットアップ

### 前提条件
- Node.js (v16以上)
- Ruby (v3.0以上)
- PostgreSQL
- Yarn

### インストール手順

1. リポジトリをクローン
```bash
git clone [repository-url]
cd jibun-chara
```

2. フロントエンドのセットアップ
```bash
cd frontend
yarn install
```

3. バックエンドのセットアップ
```bash
cd backend
bundle install
rails db:create
rails db:migrate
```

### 開発環境の起動

1. バックエンドサーバーの起動
```bash
cd backend
rails server
```

2. フロントエンドの起動
```bash
cd frontend
yarn dev
```

## プロジェクト構造

```
jibun-chara/
├── frontend/               # Reactフロントエンド
│   ├── src/
│   │   ├── pages/         # ページコンポーネント
│   │   ├── components/    # 再利用可能なコンポーネント
│   │   ├── assets/        # 画像などの静的リソース
│   │   └── api/           # APIクライアント
│   └── package.json
├── backend/               # Rails APIバックエンド
│   ├── app/
│   │   ├── controllers/
│   │   └── models/
│   └── Gemfile
└── docker-compose.yml     # Docker設定
```

## 主な機能

### ユーザー向け機能（実装済み）

1. **診断トップ画面** (`DiagnosisTop.tsx`)
   - 性別選択
   - 診断の説明

   <img width="1436" height="804" alt="Image" src="https://github.com/user-attachments/assets/f3bba00f-2575-412c-a9a0-bdbb7f5b5c4d" />

2. **診断クイズ** (`QuizMale.tsx`, `QuizFemale.tsx`)
   - 15問×3カテゴリの質問
   - プログレスバー表示

   <img width="1425" height="810" alt="Image" src="https://github.com/user-attachments/assets/fd3c06dc-48ed-4f91-8c35-cc83f2bfb76d" />

3. **結果画面** (`Result.tsx`)
   - キャラクタータイプの表示
   - 各タイプの割合表示
   - 管理者設定によるCTAボタン（設定済みの場合のみ表示）

   <img width="1429" height="807" alt="Image" src="https://github.com/user-attachments/assets/e1d12e80-6f2d-4f26-b64e-281f697ae522" />

   <img width="1429" height="809" alt="Image" src="https://github.com/user-attachments/assets/64b6bc07-ce9f-467f-aa7d-1cbd368c272b" />

### 管理者機能

4. **管理者認証システム** (実装済み)
   - セッション認証（24時間期限）
   - ログイン画面（`Admin.tsx`）
   - 招待リンクベースの新規登録

5. **管理者ダッシュボード** (`AdminDashboard.tsx`) (実装済み)
   - 統計データの表示（模擬データ）
   - 最近の活動ログ表示（模擬データ）

   <img width="1435" height="810" alt="Image" src="https://github.com/user-attachments/assets/704930ed-791c-4219-911f-b505a0bb130c" />

   - ページ・デザイン管理(ナビゲーションアイテム・CTAボタン編集)

   <img width="1435" height="810" alt="Image" src="https://github.com/user-attachments/assets/b53d1a36-005d-4afc-8463-c39d5d1bfccb" />

6. **ページ・デザイン管理** (`PageDesignManager.tsx`) (実装済み)
   - **ナビゲーションアイテム設定**：ヘッダーメニューの文言・リンク・表示切替
   - **CTAボタン設定**：診断結果ページのCTAボタンの文言・リンク・説明・表示切替
   - 設定内容に完全に忠実な表示（設定がない場合は非表示）

### 管理者画面の機能（実装予定）

1. **アカウント情報管理**
   - 相談所の基本情報編集
   - ロゴのアップロード
   - 組織情報の設定

2. **会員向けイベント**
   - イベントの作成・編集・削除
   - イベント参加者の管理
   - イベント告知の作成

3. **アクセス分析**
   - 実データに基づくページビュー数の推移グラフ
   - 診断完了数の統計
   - CTAボタンのクリック率分析
   - 期間別のレポート機能

4. **会員管理**
   - スタッフアカウントの作成・管理
   - 権限の設定（閲覧のみ、編集可能など）
   - アクセスログの確認

## デプロイ

本プロジェクトはRender.comでのデプロイに対応しています。`render.yaml`ファイルで設定が管理されています。

## ライセンス

© 2025 BLANCA. All rights reserved.