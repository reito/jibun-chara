require 'rails_helper'

RSpec.describe NavigationItem, type: :model do
  describe 'associations' do
    it { should belong_to(:tenant) }
  end

  describe 'validations' do
    let(:tenant) { create(:tenant) }

    # labelとurlはpresenceバリデーションはなく、空の場合はコントローラーでスキップ
    it { should validate_presence_of(:position) }

    it 'validates URL format when URL is present' do
      item = build(:navigation_item, tenant: tenant, url: 'invalid-url')
      expect(item).not_to be_valid
      expect(item.errors[:url]).to include('is invalid')
    end
    
    it 'allows blank URLs' do
      item = build(:navigation_item, tenant: tenant, url: '')
      expect(item).to be_valid
    end

    it 'allows valid URLs' do
      valid_urls = [
        'https://example.com',
        'http://example.com/path',
        'https://sub.example.com/path?param=value'
      ]

      valid_urls.each do |url|
        item = build(:navigation_item, tenant: tenant, url: url)
        expect(item).to be_valid, "Expected #{url} to be valid"
      end
    end
  end

  describe 'scopes' do
    let(:tenant) { create(:tenant) }

    before do
      create(:navigation_item, tenant: tenant, label: 'Item 3', position: 3)
      create(:navigation_item, tenant: tenant, label: 'Item 1', position: 1)
      create(:navigation_item, tenant: tenant, label: 'Item 2', position: 2)
    end

    describe '.ordered' do
      it 'returns items ordered by position' do
        items = tenant.navigation_items.ordered
        expect(items.map(&:label)).to eq([ 'Item 1', 'Item 2', 'Item 3' ])
      end
    end
  end
end
