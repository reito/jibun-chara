class DashboardController < ApplicationController
  before_action :authenticate_user!

  def index
    @tenant = current_user.tenant
  end
end
