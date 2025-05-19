class Api::V1::CtaButtonsController < ApplicationController
  def index
    tenant = Tenant.find_by!(slug: params[:tenant_slug])
    cta_buttons = tenant.cta_buttons.order(:position)
    render json: cta_buttons
  end
end
