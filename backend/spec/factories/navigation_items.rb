FactoryBot.define do
  factory :navigation_item do
    association :tenant
    label { "Sample Navigation Item" }
    url { "https://example.com" }
    sequence(:position) { |n| n }
    visible { true }
  end
end
