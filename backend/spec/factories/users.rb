FactoryBot.define do
  factory :user do
    sequence(:email) { |n| "user#{n}@example.com" }
    password { "password123" }
    password_confirmation { "password123" }
    association :tenant

    trait :admin do
      email { "admin@example.com" }
    end

    trait :invalid_email do
      email { "invalid-email" }
    end

    trait :short_password do
      password { "123" }
      password_confirmation { "123" }
    end
  end
end
