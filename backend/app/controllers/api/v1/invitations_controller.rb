module Api
  module V1
    class InvitationsController < ApplicationController
      def create
        # パラメータの存在確認
        unless params[:tenant]
          Rails.logger.error "Missing tenant parameter"
          render json: {
            status: "error",
            errors: [ "tenant parameter is required" ]
          }, status: :bad_request
          return
        end

        @tenant = Tenant.new(tenant_params)

        if @tenant.save
          invite_url = generate_invite_url(@tenant.unique_token)

          render json: {
            status: "success",
            data: {
              tenant: @tenant,
              invite_url: invite_url
            }
          }, status: :created
        else
          Rails.logger.error "Tenant save failed: #{@tenant.errors.full_messages}"
          render json: {
            status: "error",
            errors: @tenant.errors.full_messages
          }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Exception in invitation creation: #{e.class.name}: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        raise e  # ApplicationControllerのエラーハンドリングに委譲
      end

      private

      def tenant_params
        params.require(:tenant).permit(:name, :slug, :admin_email)
      rescue ActionController::ParameterMissing => e
        Rails.logger.error "Parameter missing: #{e.message}"
        raise e
      end

      def generate_invite_url(token)
        frontend_url = ENV["FRONTEND_URL"] || default_frontend_url
        "#{frontend_url}/register?token=#{token}"
      end

      def default_frontend_url
        if Rails.env.development?
          "http://localhost:5173"
        else
          "https://jubun-chara-frontend.onrender.com"
        end
      end
    end
  end
end
