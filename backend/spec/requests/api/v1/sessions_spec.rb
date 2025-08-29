require 'rails_helper'

RSpec.describe "Api::V1::Sessions", type: :request do
  let(:tenant) { create(:tenant) }
  let(:user) { create(:user, tenant: tenant, password: 'password123', password_confirmation: 'password123') }
  let(:valid_credentials) { { email: user.email, password: 'password123' } }
  let(:invalid_credentials) { { email: user.email, password: 'wrongpassword' } }

  before do
    host! 'localhost'
  end

  describe "POST /api/v1/sessions" do
    context "with valid credentials" do
      it "creates a session and returns user data with token" do
        post "/api/v1/sessions", params: valid_credentials

        expect(response).to have_http_status(:ok)
        expect(response.content_type).to match(a_string_including("application/json"))

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("success")
        expect(json_response["data"]["user"]["email"]).to eq(user.email)
        expect(json_response["data"]["user"]["tenant_slug"]).to eq(tenant.slug)
        expect(json_response["data"]["token"]).to be_present

        # データベースでトークンと期限が設定されているか確認
        user.reload
        expect(user.authentication_token).to be_present
        expect(user.token_expires_at).to be_present
        expect(user.token_expires_at).to be > Time.current
      end

      it "sets token expiration to 24 hours from now" do
        freeze_time do
          post "/api/v1/sessions", params: valid_credentials

          user.reload
          expect(user.token_expires_at).to be_within(1.second).of(24.hours.from_now)
        end
      end
    end

    context "with invalid credentials" do
      it "returns error for wrong password" do
        post "/api/v1/sessions", params: invalid_credentials

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("メールアドレスまたはパスワードが正しくありません")
      end

      it "returns error for non-existent user" do
        post "/api/v1/sessions", params: { email: 'nonexistent@example.com', password: 'password123' }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("メールアドレスまたはパスワードが正しくありません")
      end
    end
  end

  describe "GET /api/v1/sessions/validate" do
    context "with valid token" do
      before do
        user.update(
          authentication_token: 'valid_token_123',
          token_expires_at: 1.hour.from_now
        )
      end

      it "returns user data for valid token" do
        get "/api/v1/sessions/validate", headers: { 'Authorization' => 'Bearer valid_token_123' }

        expect(response).to have_http_status(:ok)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("success")
        expect(json_response["data"]["user"]["email"]).to eq(user.email)
        expect(json_response["data"]["expires_at"]).to be_present
      end
    end

    context "with expired token" do
      before do
        user.update(
          authentication_token: 'expired_token_123',
          token_expires_at: 1.hour.ago
        )
      end

      it "returns unauthorized and clears token" do
        get "/api/v1/sessions/validate", headers: { 'Authorization' => 'Bearer expired_token_123' }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("セッションが期限切れです")

        # トークンがクリアされているか確認
        user.reload
        expect(user.authentication_token).to be_nil
        expect(user.token_expires_at).to be_nil
      end
    end

    context "with invalid token" do
      it "returns unauthorized for non-existent token" do
        get "/api/v1/sessions/validate", headers: { 'Authorization' => 'Bearer invalid_token' }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("無効なトークンです")
      end

      it "returns bad request when no token provided" do
        get "/api/v1/sessions/validate"

        expect(response).to have_http_status(:bad_request)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("トークンが必要です")
      end
    end
  end

  describe "DELETE /api/v1/sessions" do
    context "with valid token" do
      before do
        user.update(authentication_token: 'logout_token_123')
      end

      it "logs out user and clears token" do
        delete "/api/v1/sessions", headers: { 'Authorization' => 'Bearer logout_token_123' }

        expect(response).to have_http_status(:ok)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("success")
        expect(json_response["message"]).to eq("ログアウトしました")

        # トークンがクリアされているか確認
        user.reload
        expect(user.authentication_token).to be_nil
      end
    end

    context "with invalid token" do
      it "returns unauthorized for invalid token" do
        delete "/api/v1/sessions", headers: { 'Authorization' => 'Bearer invalid_token' }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("無効なトークンです")
      end

      it "returns bad request when no token provided" do
        delete "/api/v1/sessions"

        expect(response).to have_http_status(:bad_request)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("トークンが必要です")
      end
    end
  end
end
