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
        items_params = params[:navigation_items] || []

        # 既存のアイテムを削除
        @tenant.navigation_items.destroy_all

        # 新しいアイテムを作成
        success_count = 0
        errors = []

        items_params.each_with_index do |item_params, index|
          next if item_params[:label].blank? || item_params[:url].blank?

          navigation_item = @tenant.navigation_items.build(
            label: item_params[:label],
            url: item_params[:url],
            position: index + 1
          )

          if navigation_item.save
            success_count += 1
          else
            errors << "#{index + 1}番目: #{navigation_item.errors.full_messages.join(', ')}"
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
          navigation_items = tenant.navigation_items.ordered
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
        params.require(:navigation_item).permit(:label, :url, :position)
      end
    end
  end
end
