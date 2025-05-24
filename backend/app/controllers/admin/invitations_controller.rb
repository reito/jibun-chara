class Admin::InvitationsController < ApplicationController
  def new
    @tenant = Tenant.new
  end

  def create
    @tenant = Tenant.new(tenant_params)
    if @tenant.save
      invite_url = register_users_url(token: @tenant.unique_token)
      # ここでメール送信 or 手動でURLを配布
      render plain: "招待リンク: #{invite_url}"
    else
      render :new
    end
  end

  private

  def tenant_params
    params.require(:tenant).permit(:name, :slug)
  end
end
