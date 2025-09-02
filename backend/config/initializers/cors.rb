# Be sure to restart your server when you modify this file.

# Avoid CORS issues when API is called from the frontend app.
# Handle Cross-Origin Resource Sharing (CORS) in order to accept cross-origin Ajax requests.

# Read more: https://github.com/cyu/rack-cors

Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # 環境変数から許可するオリジンを読み込む
    allowed_origins = ENV.fetch("ALLOWED_ORIGINS", "http://localhost:5173").split(",")
    origins *allowed_origins
    resource "*",
      headers: :any,
      methods: [ :get, :post, :put, :patch, :delete, :options ],
      credentials: true
  end
end
