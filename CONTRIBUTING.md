# Contributing Guide

## 環境構築

### Dev Container を使用する場合 (推奨)

Dev Container を使用する場合は、以下の手順に従って開発環境を構築してください。

1. **[Docker](https://www.docker.com/get-started) をインストールする**

2. **[Visual Studio Code](https://code.visualstudio.com/) をインストールする**

3. **[Remote - Containers](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers) 拡張機能をインストールする**

4. **リポジトリを手元にクローンする**

   ```sh
   git clone https://github.com/shuiro-dev/shuiro.git
   ```

5. **リポジトリを Visual Studio Code で開く**

   ```sh
   code shuiro/shuiro.code-workspace
   ```

6. **コマンドパレットを `Ctrl+Shift+P` (Windows/Linux) または `Cmd+Shift+P` (Mac) で開く**

7. **`Dev-Containers: Reopen in Container` と入力し、リストから選択して実行する**

### Dev Container を使用しない場合

Dev Container を使用しない場合は、以下の手順に従って開発環境を構築してください。

1. **以下のツールをインストールする**

   - [Node.js](https://nodejs.org/)
   - [Bun](https://bun.sh/)

   必要なバージョンは、[`.tool-versions`](./.tool-versions) ファイルを参照してください。

   TIP: バージョン管理ツールとして [mise](https://mise.jdx.dev/) を利用している場合は、`mise install` によって上記のツールをインストールできます。

2. **[Rust](https://www.rust-lang.org/) をインストールする**

   次のコマンドを実行することで、Rust をインストールできます。

   ```sh
   curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
   ```

## 開発

### 開発の大まかな流れ

1. **Issue を選んで担当する**

   実装したい Issue に対して、Assignees に自分を設定してください。もしまだ見つけたバグや実装したい機能に対応する Issue がない場合は、新しい Issue を作成してください。

2. **ローカルリポジトリを最新の状態に更新する**

   ```sh
   git switch main
   git pull
   ```

3. **Issue に対応するブランチを作成する**

   ```sh
   git switch -c feature/issue-123-some-description
   ```

   ここで、123 は Issue 番号、some-description は Issue の内容を簡潔に表す文字列を指しています。

4. **[開発の進め方](#開発の進め方) を参考に、機能の実装やバグの修正を行う**

   コーディングガイドラインは、[Coding Guidelines](#coding-guidelines) を参照してください。

   コードを変更したら、次のようなコマンドで変更をコミットしてください。

   ```sh
   git add .
   git commit -m "feat(frontend): add some feature"
   ```

   コミットメッセージは、[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) の仕様に従うことを推奨します。

   TIP: コミットはなるべく小さく、単一の変更に対して行うようにすると、後で変更を追跡しやすくなります。つまり、何か変更をしたらこまめにコミットすると良いです。

5. **リモートリポジトリに変更をプッシュする**

   ```sh
   git push -u origin HEAD
   ```

6. **[Pull Request の作成](#pull-request-の作成) を参考に、Pull Request を作成する**

### 開発の進め方

#### フロントエンド

1. **依存関係のインストール**

   ```sh
   bun install --frozen-lockfile
   ```

2. **開発サーバーの起動**

   ```sh
   bun run --cwd frontend dev
   ```

その他のコマンドは、[frontend/README.md](./frontend/README.md#commands) を参照してください。

#### バックエンド

1. **環境変数などの設定**

   [backend/README.md](./backend/README.md#setup) を参照して、環境変数などを設定してください。

2. **依存関係のインストール**

   ```sh
   bun install --frozen-lockfile
   ```

3. **DBのマイグレーションと初期データの投入**

   ```sh
   bun run --cwd backend prisma migrate dev && bun run --cwd backend prisma db seed
   ```

4. **開発サーバーの起動**

   ```sh
   bun run --cwd backend dev
   ```

その他のコマンドは、[backend/README.md](./backend/README.md#commands) を参照してください。

## Pull Request の作成

1.  [GitHub のリポジトリページ](https://github.com/shuiro-dev/shuiro/pulls) にアクセスして、画面上部にある `New pull request` ボタンをクリックし、作成画面を開く

2.  Pull Request のタイトルを設定する

    タイトルのフォーマットは、[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) の仕様に従って記述してください。

    例: `feat(frontend): add some feature`

3.  Pull Request の説明を記述する

    Pull Request の説明には、以下の内容を含めることを推奨します。

    - 関連する Issue

      以下のように記述することで、自動的に Issue と紐付けられます。

      ```
      close #123
      ```

    - 確認事項

      レビューアーに確認してほしいポイントを記述してください。

    - 変更の概要

      TIP: GitHub Copilot を使用すると、変更の概要を自動生成できます。

    説明の例：

    ```md
    close #123

    ## 確認事項

    - [ ] `http://localhost:3000` にアクセスして、正しく表示されること
    - [ ] スマホ画面でレイアウトが崩れないこと
    - [ ] ○○のバグが修正されていること

    ## Summary

    - Add some feature
    - Fix some bug
    ```

4.  自身を Assignees に設定する
5.  レビューアーを指定する
6.  関連するラベルを設定する

7.  Pull Request を作成する

## Coding Guidelines

### Code Style

ESLint と Prettier で定義されたコードスタイルに従ってください。

以下のコマンドを使用して現在のコードがコードスタイルに準拠しているか確認して、修正できます。自動で修正されない場合は、エラー内容に従って手動で修正してください。

1. コードをリントする:

   ```sh
   bun run lint:write
   ```

2. コードをフォーマットする:

   ```sh
   bun run format:write
   ```

### Commit Messages

- なるべく簡潔で明確なコミットメッセージを書くことを心がけてください。
- コミットメッセージのフォーマットは [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) の仕様に従うことを推奨します。
