module Api
  module V1
    class NavigationItemsController < ApplicationController
      before_action :authenticate_user!, except: [ :public_index ]
      before_action :set_tenant, except: [ :public_index ]
      before_action :set_navigation_item, only: [ :show, :update, :destroy ]

      def index
        @navigation_items = @tenant.navigation_items.ordered
        render json: {
          status: "success",
          data: @navigation_items
        }
      end

      def show
        render json: {
          status: "success",
          data: @navigation_item
        }
      end

      def create
        @navigation_item = @tenant.navigation_items.build(navigation_item_params)

        if @navigation_item.save
          render json: {
            status: "success",
            data: @navigation_item
          }, status: :created
        else
          render json: {
            status: "error",
            errors: @navigation_item.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def update
        if @navigation_item.update(navigation_item_params)
          render json: {
            status: "success",
            data: @navigation_item
          }
        else
          render json: {
            status: "error",
            errors: @navigation_item.errors.full_messages
          }, status: :unprocessable_entity
        end
      end

      def destroy
        @navigation_item.destroy
        render json: {
          status: "success",
          message: "ナビゲーション項目を削除しました"
        }
      end

      def bulk_update
        # 複数のナビアイテムを一括更新
        items_params = params.permit(navigation_items: [:label, :url, :position, :visible], navigation_item: {})[:navigation_items] || []

        # 既存のアイテムを削除
        @tenant.navigation_items.destroy_all

        # 新しいアイテムを作成
        success_count = 0
        errors = []

        items_params.each_with_index do |item_params, index|
          # ActionController::Parametersをハッシュに変換
          item_hash = item_params.to_h if item_params.respond_to?(:to_h)
          item_hash ||= item_params
          
          # visible: falseでも、labelとurlが両方入力されていれば保存
          next if item_hash[:label].blank? && item_hash[:url].blank?

          navigation_item = @tenant.navigation_items.build(
            label: item_hash[:label],
            url: item_hash[:url],
            position: index + 1,
            visible: item_hash[:visible]
          )
          if navigation_item.save
            success_count += 1
          else
            error_msg = "#{index + 1}番目: #{navigation_item.errors.full_messages.join(', ')}"
            errors << error_msg
          end
        end

        if errors.empty?
          render json: {
            status: "success",
            message: "ナビゲーション設定を更新しました",
            data: @tenant.navigation_items.ordered
          }
        else
          render json: {
            status: "error",
            message: "一部の項目でエラーが発生しました",
            errors: errors,
            data: @tenant.navigation_items.ordered
          }, status: :unprocessable_entity
        end
      end

      # 公開用API（認証不要）
      def public_index
        tenant = Tenant.find_by(slug: params[:tenant_slug])

        if tenant
          navigation_items = tenant.navigation_items.visible_items.ordered
          render json: {
            status: "success",
            data: navigation_items
          }
        else
          render json: {
            status: "error",
            message: "テナントが見つかりません"
          }, status: :not_found
        end
      end

      private

      def authenticate_user!
        token = request.headers["Authorization"]&.gsub("Bearer ", "")

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

      def set_navigation_item
        @navigation_item = @tenant.navigation_items.find(params[:id])
      end

      def navigation_item_params
        params.require(:navigation_item).permit(:label, :url, :position, :visible)
      end
    end
  end
end
