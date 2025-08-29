FactoryBot.define do
  factory :tenant do
    sequence(:name) { |n| "テスト相談所#{n}" }
    sequence(:slug) { |n| "test-tenant-#{n}" }
    sequence(:admin_email) { |n| "admin#{n}@example.com" }
    # unique_tokenはモデルで自動生成される

    trait :invalid_slug do
      slug { "admin" }  # 予約語
    end

    trait :short_slug do
      slug { "ab" }  # 短すぎる
    end

    trait :invalid_email do
      admin_email { "invalid-email" }
    end
  end
end
