# db/seeds.rb

tenant = Tenant.create!(
  name: "大阪ブライダル相談所",
  slug: "osaka-bridal"
)

tenant.cta_buttons.create!(
  [
    { title: "公式サイトを見る", url: "https://example.com", category: "external", visible: true, position: 1 },
    { title: "LINE相談はこちら", url: "https://line.me/R/ti/p/xxxx", category: "line", visible: true, position: 2 }
  ]
)
