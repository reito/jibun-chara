# ブランチ保護ルール設定手順（詳細版）

このドキュメントでは、GitHub のブランチ保護ルールを詳細に設定する手順を説明します。

## 設定手順

### 1. GitHub リポジトリの設定ページへ移動
1. GitHub のリポジトリページにアクセス
2. 上部メニューの「Settings」をクリック
3. 左サイドバーの「Branches」をクリック

### 2. ブランチ保護ルールの追加
1. 「Add rule」ボタンをクリック
2. 「Branch name pattern」に `main` と入力

### 3. 詳細設定項目

#### ✅ **必須設定項目**

**Protect matching branches:**

1. **Require status checks to pass before merging** ✅
   - CIチェックが通らないとマージできない
   - **Require branches to be up to date before merging** ✅
   - **Status checks that are required:**
     - `Frontend TypeCheck`
     - `Frontend ESLint`
     - `Frontend Prettier`
     - `Backend RuboCop`
     - `Backend RSpec`
   
2. **Require conversation resolution before merging** ✅
   - PR上のコメント・会話をすべて解決後にマージ可能

3. **Include administrators** ✅
   - リポジトリオーナーもルールの対象にする

#### ❌ **無効にする項目（一人開発のため）**

1. **Require pull request reviews** ❌
   - 一人開発では永遠にマージできなくなる
   
2. **Require deployments to succeed** ❌
   - デプロイ設定していない場合

3. **Require signed commits** ❌
   - コミット署名は任意（設定が複雑）

#### ⚠️ **オプション項目（お好みで）**

1. **Restrict pushes that create files** 
   - 特定のパスへのファイル作成を制限

2. **Restrict push and merge** 
   - プッシュ・マージできるユーザーを制限

### 4. 設定の保存
「Create」ボタンをクリックして設定を保存

## 注意：Status checksの追加方法

Status checksは最初のCIが実行されないと選択肢に表示されません：

1. まず、PR作成してCIを一度実行
2. その後、Settingsに戻ってStatus checksを追加
3. または、手動で以下をテキスト入力：
   ```
   Frontend TypeCheck
   Frontend ESLint  
   Frontend Prettier
   Backend RuboCop
   Backend RSpec
   ```

## 設定後の開発フロー

1. **ブランチ作成**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **開発・コミット**
   ```bash
   git add .
   git commit -m "feat: implement new feature"
   git push origin feature/your-feature-name
   ```

3. **PR作成**
   - GitHub上でPRを作成
   - テンプレートに従って内容を記入

4. **CIの確認**
   - GitHub Actions が自動で実行される
   - Frontend Tests と Backend Tests が通ることを確認

5. **セルフレビュー**
   - PR上で自分のコードをレビュー
   - 必要に応じてコメントを追加

6. **マージ**
   - 全てのチェックが緑になったらマージボタンをクリック
   - 「Squash and merge」や「Merge pull request」を選択

## トラブルシューティング

### CIが失敗する場合
- エラーログを確認し、該当箇所を修正
- 修正後に再度プッシュすると自動でCI再実行

### 緊急時のマージ
- 管理者権限で「Override branch protection」が可能
- ただし、基本的には使用しない

## 注意事項
- この設定により、`main` ブランチへの直接プッシュができなくなります
- すべての変更は PR 経由で行う必要があります
- CI が通らない限りマージはできません