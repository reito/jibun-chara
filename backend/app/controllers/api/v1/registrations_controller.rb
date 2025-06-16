module Api
  module V1
    class RegistrationsController < ApplicationController
      def create
        @tenant = Tenant.find_by(unique_token: params[:token])
        
        if @tenant.nil? || @tenant.user.present?
          render json: { 
            status: 'error',
            message: 'この招待リンクは無効です。'
          }, status: :unprocessable_entity
          return
        end

        @user = User.new(user_params)
        @user.tenant = @tenant
        @user.email = @tenant.admin_email

        if @user.save
          render json: { 
            status: 'success',
            data: {
              user: @user,
              tenant: @tenant
            }
          }, status: :created
        else
          render json: { 
            status: 'error',
            errors: @user.errors.full_messages 
          }, status: :unprocessable_entity
        end
      end

      private

      def user_params
        params.require(:user).permit(:password, :password_confirmation, :name)
      end
    end
  end
end
