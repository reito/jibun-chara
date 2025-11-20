require 'rails_helper'

RSpec.describe "Api::V1::Sessions", type: :request do
  let(:tenant) { create(:tenant, slug: 'test-clinic') }
  let(:other_tenant) { create(:tenant, slug: 'other-clinic') }
  let(:user) { create(:user, tenant: tenant, password: 'password123', password_confirmation: 'password123') }
  let(:other_user) { create(:user, tenant: other_tenant, email: 'other@example.com', password: 'password456', password_confirmation: 'password456') }
  let(:valid_credentials) { { email: user.email, password: 'password123' } }
  let(:invalid_credentials) { { email: user.email, password: 'wrongpassword' } }

  before do
    host! 'localhost'
  end

  describe "POST /api/v1/tenants/:tenant_slug/sessions" do
    context "with valid credentials" do
      it "creates a session and returns user data with token" do
        post "/api/v1/tenants/#{tenant.slug}/sessions", params: valid_credentials

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
          post "/api/v1/tenants/#{tenant.slug}/sessions", params: valid_credentials

          user.reload
          expect(user.token_expires_at).to be_within(1.second).of(24.hours.from_now)
        end
      end
    end

    context "with invalid credentials" do
      it "returns error for wrong password" do
        post "/api/v1/tenants/#{tenant.slug}/sessions", params: invalid_credentials

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("メールアドレスまたはパスワードが正しくありません")
      end

      it "returns error for non-existent user" do
        post "/api/v1/tenants/#{tenant.slug}/sessions", params: { email: 'nonexistent@example.com', password: 'password123' }

        expect(response).to have_http_status(:unauthorized)

        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("メールアドレスまたはパスワードが正しくありません")
      end
    end

    context "with different tenant" do
      it "rejects login attempt from user belonging to another tenant" do
        post "/api/v1/tenants/#{other_tenant.slug}/sessions", params: { email: user.email, password: 'password123' }

        expect(response).to have_http_status(:unauthorized)
        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
      end

      it "returns not found for non-existent tenant" do
        post "/api/v1/tenants/non-existent/sessions", params: valid_credentials

        expect(response).to have_http_status(:not_found)
        json_response = JSON.parse(response.body)
        expect(json_response["status"]).to eq("error")
        expect(json_response["message"]).to eq("相談所が見つかりません")
      end
    end

    context "acts_as_tenant security" do
      it "User model respects tenant scope" do
        user
        other_user

        ActsAsTenant.with_tenant(tenant) do
          expect(User.find_by(email: user.email)).to eq(user)
          expect(User.find_by(email: other_user.email)).to be_nil
          expect(User.count).to eq(1)
        end

        ActsAsTenant.with_tenant(other_tenant) do
          expect(User.find_by(email: user.email)).to be_nil
          expect(User.find_by(email: other_user.email)).to eq(other_user)
          expect(User.count).to eq(1)
        end
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
