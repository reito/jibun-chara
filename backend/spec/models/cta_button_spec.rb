require 'rails_helper'

RSpec.describe CtaButton, type: :model do
  describe 'associations' do
    it { should belong_to(:tenant) }
  end

  describe 'factory' do
    it 'creates a valid cta_button' do
      cta_button = build(:cta_button)
      expect(cta_button).to be_valid
    end

    it 'creates contact button with contact_button trait' do
      cta_button = build(:cta_button, :contact_button)
      expect(cta_button.title).to eq('無料相談予約')
      expect(cta_button.url).to eq('https://example.com/contact')
      expect(cta_button.category).to eq('consultation')
      expect(cta_button).to be_valid
    end

    it 'creates event button with event_button trait' do
      cta_button = build(:cta_button, :event_button)
      expect(cta_button.title).to eq('イベント参加')
      expect(cta_button.url).to eq('https://example.com/events')
      expect(cta_button.category).to eq('event')
      expect(cta_button).to be_valid
    end
  end

  describe 'tenant association' do
    it 'belongs to a tenant' do
      tenant = create(:tenant)
      cta_button = create(:cta_button, tenant: tenant)
      expect(cta_button.tenant).to eq(tenant)
    end

    it 'is invalid without a tenant' do
      cta_button = build(:cta_button, tenant: nil)
      expect(cta_button).not_to be_valid
    end
  end

  describe 'validations' do
    let(:tenant) { create(:tenant) }
    
    # titleはpresenceバリデーションはなく、空の場合はコントローラーでスキップまたはvisible:falseで保存
    it { should validate_presence_of(:position) }
    
    it 'validates URL format when URL is present' do
      button = build(:cta_button, tenant: tenant, url: 'invalid-url')
      expect(button).not_to be_valid
      expect(button.errors[:url]).to include('is invalid')
    end
    
    it 'allows blank URLs' do
      button = build(:cta_button, tenant: tenant, url: '')
      expect(button).to be_valid
    end
    
    it 'allows blank titles' do
      button = build(:cta_button, tenant: tenant, title: '')
      expect(button).to be_valid
    end
  end
  
  describe 'scopes' do
    let(:tenant) { create(:tenant) }
    
    before do
      create(:cta_button, tenant: tenant, title: 'Visible Button', position: 1, visible: true)
      create(:cta_button, tenant: tenant, title: 'Hidden Button', position: 2, visible: false)
      create(:cta_button, tenant: tenant, title: 'Another Visible', position: 3, visible: true)
    end
    
    describe '.visible_items' do
      it 'returns only visible buttons' do
        visible_buttons = tenant.cta_buttons.visible_items
        expect(visible_buttons.count).to eq(2)
        expect(visible_buttons.pluck(:title)).to include('Visible Button', 'Another Visible')
        expect(visible_buttons.pluck(:title)).not_to include('Hidden Button')
      end
    end
    
    describe '.ordered' do
      it 'returns buttons ordered by position' do
        buttons = tenant.cta_buttons.ordered
        expect(buttons.map(&:title)).to eq(['Visible Button', 'Hidden Button', 'Another Visible'])
      end
    end
  end

  describe 'dependent destroy' do
    it 'is destroyed when tenant is destroyed' do
      tenant = create(:tenant)
      cta_button = create(:cta_button, tenant: tenant)

      expect { tenant.destroy }.to change { CtaButton.count }.by(-1)
      expect(CtaButton.find_by(id: cta_button.id)).to be_nil
    end
  end
end
