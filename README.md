# 💠 Notebook Wiki (Venus Memory Vault Lite)

[![React](https://img.shields.io/badge/React-19.0-blue.svg)](https://react.dev/)
[![Express](https://img.shields.io/badge/Express-4.21-green.svg)](https://expressjs.com/)
[![Gemini](https://img.shields.io/badge/Gemini_API-2.4-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-Apache_2.0-yellow.svg)](LICENSE)

Google AI Studio App として開発された、AI検索・ナレッジグラフ・強固な暗号化を備えたセキュアなローカルパーソナルWikiシステム。
ヴィーナスリンク（Venus Link）の長期記憶保管庫「Venus Memory Vault」の軽量・セルフホスト版ランタイムとして動作します。

詳細な設計思想やセキュリティ構造については [ABOUT.md](file:///home/dma/プロジェクト/notebook-wiki/ABOUT.md) を参照してください。

---

## 💠 主な機能 (Features)

*   **🔒 強固なセキュリティ (AES-256-CBC)**
    *   すべてのメモ、タグ、ファイルデータはユーザー独自のパスフレーズから生成された32バイトのマスターキー（`scrypt` で導出）を用いてローカルで暗号化されて保存されます。サーバー側にも平文データは一切送信されません。
*   **🤖 Gemini API 連携リアルタイムアシスタント**
    *   `@google/genai` (SDK v2) を使用し、ローカルに暗号化されたメモデータをリアルタイムで参照・検索しながら回答を生成するAIアシスタントを内蔵。
*   **🕸️ 双方向ナレッジグラフの可視化**
    *   メモ間のリンクやタグの共通性、AIによる関連性推論を元に、ナレッジグラフを動的かつ美しく3D/2Dビジュアル表示。
*   **🔑 TOTP 二要素認証 (2FA)**
    *   アカウントの削除や重要データのエクスポート/インポートなど、重要操作にはTOTP 2FAによる保護が設定可能です。
*   **🎨 豊富なデザインシステム & テーマ**
    *   ダークモードやアンバー、ローズ、森林といった多様なカラーテーマを選択可能。

---

## 🛠️ セットアップ & ローカル起動手順

### 前提条件 (Prerequisites)
*   Node.js (v18以降を推奨)
*   Gemini API キー

### 1. 依存関係のインストール
```bash
npm install
```

### 2. 環境変数の設定
`.env.example` をコピーして `.env.local` を作成し、あなたの Gemini API キーを設定します。
```bash
cp .env.example .env.local
```
中身：
```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. 起動 (ポートの変更)
デフォルトでは `3100` 番ポートで起動します。（3000番ポートで別のUIが動いている場合の競合を避ける設計になっています。）
```bash
npm run dev
```
もし別のポートで動かしたい場合は、以下のように `PORT` 環境変数を指定してください：
```bash
PORT=3200 npm run dev
```

### 4. ビルドと本番起動
```bash
npm run build
npm start
```

---

## 💾 データ構造と永続化
アプリのデータは `data/db.json` にローカル保存されます。
このファイルは `.gitignore` に登録されており、誤ってリモートリポジトリにプッシュされることはありません。
サーバー等にデプロイして稼働させる場合は、`data/` ディレクトリを永続ディスク（Persistent Volume）にマウントして運用してください。

---

## 📄 ライセンス
Apache License 2.0
