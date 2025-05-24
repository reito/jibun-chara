class Users::RegistrationsController < ApplicationController
  def new
    @tenant = Tenant.find_by(unique_token: params[:token])
    if @tenant.nil? || @tenant.user.present?
      redirect_to root_path, alert: "この招待リンクは無効です。"
    else
      @user = User.new
    end
  end

  def create
    @tenant = Tenant.find_by(unique_token: params[:token])
    return redirect_to root_path unless @tenant && @tenant.user.nil?

    @user = User.new(user_params)
    @user.tenant = @tenant

    if @user.save
      sign_in(@user)
      redirect_to dashboard_path
    else
      render :new
    end
  end

  private

  def user_params
    params.require(:user).permit(:email, :password, :password_confirmation, :name)
  end
end
