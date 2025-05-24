Rails.application.routes.draw do
  get "dashboard/index"
  devise_for :users

  namespace :admin do
    resources :invitations, only: [:new, :create]
  end

  namespace :users do
    get 'register', to: 'registrations#new', as: :register_users
    post 'register', to: 'registrations#create'
  end

  # 管理画面など
  get '/dashboard', to: 'dashboard#index'

  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")
  # root "posts#index"

  scope '/:tenant_slug' do
    get '/', to: 'pages#home'
  end

  namespace :api do
    namespace :v1 do
      resources :invitations, only: [:create]
      resources :registrations, only: [:create]
      get "cta_buttons/index"
      get '/tenants/:tenant_slug/cta_buttons', to: 'cta_buttons#index'
    end
  end
end
