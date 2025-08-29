class Api::V1::CtaButtonsController < ApplicationController
  before_action :authenticate_user!, except: [:index]
  before_action :set_tenant_from_slug, only: [:index]
  before_action :set_tenant, except: [:index]

  def index
    cta_buttons = @tenant.cta_buttons.visible_items.ordered
    render json: {
      status: "success", 
      data: cta_buttons
    }
  end
  
  def admin_index
    cta_buttons = @tenant.cta_buttons.ordered
    render json: {
      status: "success", 
      data: cta_buttons
    }
  end

  def bulk_update
    # 複数のCTAボタンを一括更新
    buttons_params = params.permit(cta_buttons: [:title, :subtitle, :url, :description, :position, :visible], cta_button: {})[:cta_buttons] || []
    
    # 既存のボタンを削除
    Rails.logger.info "Destroying existing CTA buttons for tenant: #{@tenant.id}"
    @tenant.cta_buttons.destroy_all
    Rails.logger.info "Processing CTA buttons params: #{buttons_params.class} - #{buttons_params}"
    
    # 新しいボタンを作成
    success_count = 0
    errors = []
    
    buttons_params.each_with_index do |button_params, index|
      # ActionController::Parametersをハッシュに変換
      button_hash = button_params.to_h if button_params.respond_to?(:to_h)
      button_hash ||= button_params
      
      Rails.logger.info "Processing button #{index + 1}: visible=#{button_hash[:visible]}, title='#{button_hash[:title]}', url='#{button_hash[:url]}'"
      
      # visible: falseの場合は空でも保存、そうでない場合は空ならスキップ
      if button_hash[:visible] == false
        # visible: falseの場合は必ず保存（空でも）
        Rails.logger.info "Saving button #{index + 1} because visible=false"
      else
        # それ以外（nil, true）の場合は空ならスキップ
        if button_hash[:title].blank? && button_hash[:url].blank?
          Rails.logger.info "Skipping button #{index + 1} because title and url are blank"
          next
        end
      end
      
      cta_button = @tenant.cta_buttons.build(
        title: button_hash[:title],
        subtitle: button_hash[:subtitle],
        url: button_hash[:url],
        description: button_hash[:description],
        position: index + 1,
        visible: button_hash[:visible].nil? ? true : button_hash[:visible]
      )
      
      if cta_button.save
        success_count += 1
        Rails.logger.info "Successfully saved button #{index + 1}"
      else
        Rails.logger.error "Failed to save button #{index + 1}: #{cta_button.errors.full_messages.join(', ')}"
        errors << "#{index + 1}番目: #{cta_button.errors.full_messages.join(', ')}"
      end
    end
    
    if errors.empty?
      render json: {
        status: "success",
        message: "CTAボタン設定を更新しました",
        data: @tenant.cta_buttons.ordered
      }
    else
      render json: {
        status: "error",
        message: "一部のボタンでエラーが発生しました",
        errors: errors,
        data: @tenant.cta_buttons.ordered
      }, status: :unprocessable_entity
    end
  end

  private

  def authenticate_user!
    token = request.headers['Authorization']&.gsub('Bearer ', '')
    
    if token.blank?
      render json: { status: "error", message: "認証が必要です" }, status: :unauthorized
      return
    end

    user = User.find_by(authentication_token: token)
    
    if user.nil?
      render json: { status: "error", message: "無効なトークンです" }, status: :unauthorized
      return
    end

    @current_user = user
  end

  def set_tenant
    @tenant = @current_user.tenant
  end

  def set_tenant_from_slug
    @tenant = Tenant.find_by(slug: params[:tenant_slug])
    if @tenant.nil?
      render json: { status: "error", message: "テナントが見つかりません" }, status: :not_found
      return
    end
  end
end
