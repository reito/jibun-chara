module Api
  module V1
    class SessionsController < ApplicationController
      def create
        # テナントスラッグが必須
        tenant = Tenant.find_by(slug: params[:tenant_slug])

        unless tenant
          return render json: {
            status: "error",
            message: "相談所が見つかりません"
          }, status: :not_found
        end

        # テナント内でのみユーザーを検索
        ActsAsTenant.with_tenant(tenant) do
          user = User.find_by(email: params[:email])

          if user && user.valid_password?(params[:password])
            # セッショントークンを生成
            token = SecureRandom.hex(20)

            # トークンと有効期限をユーザーに保存（24時間後に期限切れ）
            user.update(
              authentication_token: token,
              token_expires_at: 24.hours.from_now
            )

            render json: {
              status: "success",
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  tenant_slug: user.tenant.slug
                },
                token: token
              }
            }, status: :ok
          else
            render json: {
              status: "error",
              message: "メールアドレスまたはパスワードが正しくありません"
            }, status: :unauthorized
          end
        end
      end

      def destroy
        # Authorizationヘッダーからトークンを取得
        token = request.headers["Authorization"]&.gsub("Bearer ", "")

        if token.present?
          user = User.find_by(authentication_token: token)
          if user
            user.update(authentication_token: nil)
            render json: {
              status: "success",
              message: "ログアウトしました"
            }, status: :ok
          else
            render json: {
              status: "error",
              message: "無効なトークンです"
            }, status: :unauthorized
          end
        else
          render json: {
            status: "error",
            message: "トークンが必要です"
          }, status: :bad_request
        end
      end

      def validate
        # トークンの有効性を確認
        token = request.headers["Authorization"]&.gsub("Bearer ", "")

        if token.present?
          user = User.find_by(authentication_token: token)
          if user && user.token_expires_at && user.token_expires_at > Time.current
            render json: {
              status: "success",
              data: {
                user: {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  tenant_slug: user.tenant.slug
                },
                expires_at: user.token_expires_at
              }
            }, status: :ok
          else
            # トークンが期限切れの場合はクリア
            user&.update(authentication_token: nil, token_expires_at: nil)
            render json: {
              status: "error",
              message: user ? "セッションが期限切れです" : "無効なトークンです"
            }, status: :unauthorized
          end
        else
          render json: {
            status: "error",
            message: "トークンが必要です"
          }, status: :bad_request
        end
      end
    end
  end
end
