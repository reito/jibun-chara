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

  describe 'dependent destroy' do
    it 'is destroyed when tenant is destroyed' do
      tenant = create(:tenant)
      cta_button = create(:cta_button, tenant: tenant)

      expect { tenant.destroy }.to change { CtaButton.count }.by(-1)
      expect(CtaButton.find_by(id: cta_button.id)).to be_nil
    end
  end
end
