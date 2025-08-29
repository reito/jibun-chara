FactoryBot.define do
  factory :cta_button do
    title { "お問い合わせ" }
    url { "https://example.com" }
    category { "contact" }
    visible { true }
    position { 1 }
    association :tenant

    trait :contact_button do
      title { "無料相談予約" }
      url { "https://example.com/contact" }
      category { "consultation" }
    end

    trait :event_button do
      title { "イベント参加" }
      url { "https://example.com/events" }
      category { "event" }
    end
  end
end
