module Api
  module V1
    class InvitationsController < ApplicationController
      def create
        @tenant = Tenant.new(tenant_params)
        if @tenant.save
          invite_url =
            if Rails.env.development?
              "http://localhost:5173/register?token=#{@tenant.unique_token}"
            else
              "#{request.base_url}/register?token=#{@tenant.unique_token}"
            end
          render json: { 
            status: 'success',
            data: {
              tenant: @tenant,
              invite_url: invite_url
            }
          }, status: :created
        else
          render json: { 
            status: 'error',
            errors: @tenant.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      private

      def tenant_params
        params.require(:tenant).permit(:name, :slug, :admin_email)
      end
    end
  end
end
