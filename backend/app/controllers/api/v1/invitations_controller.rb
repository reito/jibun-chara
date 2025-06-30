module Api
  module V1
    class InvitationsController < ApplicationController
      def create
        Rails.logger.info "=== Invitation creation started ==="
        Rails.logger.info "Params: #{params.inspect}"
        
        @tenant = Tenant.new(tenant_params)
        Rails.logger.info "Tenant object created: #{@tenant.inspect}"
        
        if @tenant.save
          Rails.logger.info "Tenant saved successfully with ID: #{@tenant.id}"
          invite_url = generate_invite_url(@tenant.unique_token)
          Rails.logger.info "Generated invite URL: #{invite_url}"
          
          render json: { 
            status: 'success',
            data: {
              tenant: @tenant,
              invite_url: invite_url
            }
          }, status: :created
        else
          Rails.logger.error "Tenant save failed: #{@tenant.errors.full_messages}"
          render json: { 
            status: 'error',
            errors: @tenant.errors.full_messages 
          }, status: :unprocessable_entity
        end
      rescue => e
        Rails.logger.error "Exception in invitation creation: #{e.message}"
        Rails.logger.error e.backtrace.join("\n")
        render json: { 
          status: 'error',
          errors: ['Internal server error'] 
        }, status: :internal_server_error
      end

      private

      def tenant_params
        params.require(:tenant).permit(:name, :slug, :admin_email)
      end

      def generate_invite_url(token)
        frontend_url = ENV['FRONTEND_URL'] || default_frontend_url
        Rails.logger.info "Frontend URL: #{frontend_url}"
        Rails.logger.info "Token: #{token}"
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
