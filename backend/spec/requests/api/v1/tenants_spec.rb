require 'rails_helper'

RSpec.describe "Api::V1::Tenants", type: :request do
  let(:tenant) { create(:tenant) }
  let(:valid_attributes) { attributes_for(:tenant) }
  let(:invalid_attributes) { attributes_for(:tenant, :invalid_slug) }

  before do
    # CI環境でのホストの問題を回避
    host! 'localhost'
  end

  describe "GET /api/v1/tenants/validate/:slug" do
    context "when tenant exists" do
      it "returns valid: true" do
        get "/api/v1/tenants/validate/#{tenant.slug}"

        expect(response).to have_http_status(:success)
        expect(response.content_type).to match(a_string_including("application/json"))

        json_response = JSON.parse(response.body)
        expect(json_response["valid"]).to be true
      end
    end

    context "when tenant does not exist" do
      it "returns valid: false" do
        get "/api/v1/tenants/validate/nonexistent-slug"

        expect(response).to have_http_status(:success)
        expect(response.content_type).to match(a_string_including("application/json"))

        json_response = JSON.parse(response.body)
        expect(json_response["valid"]).to be false
      end
    end
  end

  # Invitationモデルが実装されていないため、コメントアウト
  xdescribe "GET /api/v1/tenants/:tenant_slug/generate_invitation_link" do
    context "when tenant exists" do
      before do
        # Invitationモデルが存在しない場合のため、モックを使用
        allow(tenant).to receive_message_chain(:invitations, :create!).and_return(
          double(token: "test-token", expires_at: 24.hours.from_now)
        )
        allow(Tenant).to receive(:find_by).with(slug: tenant.slug).and_return(tenant)
      end

      it "generates invitation link successfully" do
        get "/api/v1/tenants/#{tenant.slug}/generate_invitation"

        expect(response).to have_http_status(:success)
        expect(response.content_type).to match(a_string_including("application/json"))

        json_response = JSON.parse(response.body)
        expect(json_response["invitation_url"]).to be_present
        expect(json_response["invitation_url"]).to include("localhost:5173/invite/")
      end
    end

    context "when tenant does not exist" do
      it "returns not found error" do
        get "/api/v1/tenants/nonexistent-slug/generate_invitation"

        expect(response).to have_http_status(:not_found)
        expect(response.content_type).to match(a_string_including("application/json"))

        json_response = JSON.parse(response.body)
        expect(json_response["error"]).to eq("Tenant not found")
      end
    end
  end

  # Invitationモデルが実装されていないため、コメントアウト
  xdescribe "GET /api/v1/invitations/validate/:token" do
    let(:token) { "test-invitation-token" }
    let(:invitation) { double("invitation", expired?: false, used?: false, tenant: tenant) }

    before do
      allow(Invitation).to receive(:find_by).with(token: token).and_return(invitation)
    end

    context "when invitation is valid" do
      it "returns valid: true with tenant_slug" do
        get "/api/v1/invitations/validate/#{token}"

        expect(response).to have_http_status(:success)
        expect(response.content_type).to match(a_string_including("application/json"))

        json_response = JSON.parse(response.body)
        expect(json_response["valid"]).to be true
        expect(json_response["tenant_slug"]).to eq(tenant.slug)
      end
    end

    context "when invitation is expired" do
      before do
        allow(invitation).to receive(:expired?).and_return(true)
      end

      it "returns valid: false" do
        get "/api/v1/invitations/validate/#{token}"

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["valid"]).to be false
      end
    end

    context "when invitation is used" do
      before do
        allow(invitation).to receive(:used?).and_return(true)
      end

      it "returns valid: false" do
        get "/api/v1/invitations/validate/#{token}"

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["valid"]).to be false
      end
    end

    context "when invitation does not exist" do
      before do
        allow(Invitation).to receive(:find_by).with(token: token).and_return(nil)
      end

      it "returns valid: false" do
        get "/api/v1/invitations/validate/#{token}"

        expect(response).to have_http_status(:success)
        json_response = JSON.parse(response.body)
        expect(json_response["valid"]).to be false
      end
    end
  end

  describe "private methods" do
    let(:controller) { Api::V1::TenantsController.new }

    describe "#default_frontend_url" do
      it "returns localhost URL in development" do
        allow(Rails.env).to receive(:development?).and_return(true)

        expect(controller.send(:default_frontend_url)).to eq("http://localhost:5173")
      end

      it "returns production URL in production" do
        allow(Rails.env).to receive(:development?).and_return(false)

        expect(controller.send(:default_frontend_url)).to eq("https://jubun-chara-frontend.onrender.com")
      end
    end

    describe "#generate_invitation_url" do
      let(:token) { "test-token" }

      context "when FRONTEND_URL is set" do
        before do
          allow(ENV).to receive(:[]).with("FRONTEND_URL").and_return("https://custom-frontend.com")
        end

        it "uses the custom frontend URL" do
          url = controller.send(:generate_invitation_url, token)
          expect(url).to eq("https://custom-frontend.com/invite/#{token}")
        end
      end

      context "when FRONTEND_URL is not set" do
        before do
          allow(ENV).to receive(:[]).with("FRONTEND_URL").and_return(nil)
          allow(controller).to receive(:default_frontend_url).and_return("http://localhost:5173")
        end

        it "uses the default frontend URL" do
          url = controller.send(:generate_invitation_url, token)
          expect(url).to eq("http://localhost:5173/invite/#{token}")
        end
      end
    end
  end
end
